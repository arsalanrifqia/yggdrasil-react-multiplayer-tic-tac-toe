import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface Player {
  username: string;
  score: number;
}

interface Room {
  code: string;
  playerX: Player | null;
  playerO: Player | null;
  board: (string | null)[];
  turn: "X" | "O";
  winner: string | null;
  winningLine: number[] | null;
  status: "waiting" | "playing" | "finished";
  draws: number;
  createdAt: number;
}

const ROOMS_FILE = path.join(process.cwd(), "rooms_data.json");

function loadRooms(): Map<string, Room> {
  try {
    if (fs.existsSync(ROOMS_FILE)) {
      const data = fs.readFileSync(ROOMS_FILE, "utf-8");
      const obj = JSON.parse(data);
      const roomsMap = new Map(Object.entries(obj));

      // Migrate old rooms without draws field
      for (const [code, room] of roomsMap.entries()) {
        if (room && typeof room === "object" && !("draws" in room)) {
          room.draws = 0;
        }
      }

      return roomsMap;
    }
  } catch (e) {
    console.error("Failed to load rooms data:", e);
  }
  return new Map<string, Room>();
}

function saveRooms(roomsMap: Map<string, Room>) {
  try {
    const obj = Object.fromEntries(roomsMap.entries());
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save rooms data:", e);
  }
}

const rooms = loadRooms();

// Cleanup old rooms every 30 minutes
setInterval(() => {
  const now = Date.now();
  let modified = false;
  for (const [code, room] of rooms.entries()) {
    if (now - room.createdAt > 3600000 * 2) {
      // 2 hours
      rooms.delete(code);
      modified = true;
    }
  }
  if (modified) {
    saveRooms(rooms);
  }
}, 1800000);

function checkWinner(board: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: "Draw", winningLine: null };
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Enable CORS for all origins and methods (fixes Yggdrasil / tunnel unreachable / CORS errors)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API Routes
  // Create Room
  app.post("/api/rooms/create", (req, res) => {
    console.log("[POST /api/rooms/create] Request received");
    const { username } = req.body;
    console.log("[POST /api/rooms/create] Username:", username);
    if (!username) {
      console.log("[POST /api/rooms/create] Username missing, returning 400");
      return res.status(400).json({ error: "Username is required" });
    }

    let code = Math.random().toString(36).substring(2, 8).toUpperCase();
    while (rooms.has(code)) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const room: Room = {
      code,
      playerX: { username, score: 0 },
      playerO: null,
      board: Array(9).fill(null),
      turn: "X",
      winner: null,
      winningLine: null,
      status: "waiting",
      draws: 0,
      createdAt: Date.now(),
    };

    rooms.set(code, room);
    saveRooms(rooms);
    console.log("[POST /api/rooms/create] Room created with code:", code);
    console.log("[POST /api/rooms/create] Sending room data:", JSON.stringify(room));
    res.json(room);
    console.log("[POST /api/rooms/create] Response sent");
  });

  // Join Room
  app.post("/api/rooms/join", (req, res) => {
    const { code, username } = req.body;
    if (!code || !username) {
      return res.status(400).json({ error: "Room code and username are required" });
    }

    const roomCode = code.toUpperCase();
    let room = rooms.get(roomCode);

    // If not in memory, reload from disk in case of multi-worker/restart
    if (!room) {
      const reloaded = loadRooms();
      room = reloaded.get(roomCode);
      if (room) {
        rooms.set(roomCode, room);
      }
    }

    if (!room) {
      return res.status(404).json({ error: "Room tidak ditemukan. Periksa kembali kode room." });
    }

    if (room.playerX && room.playerX.username === username) {
      return res.json(room);
    }

    if (room.playerO && room.playerO.username === username) {
      return res.json(room);
    }

    if (room.playerO && room.playerO.username !== username) {
      return res.status(400).json({ error: "Room sudah penuh (2 pemain)." });
    }

    room.playerO = { username, score: 0 };
    room.status = "playing";
    rooms.set(roomCode, room);
    saveRooms(rooms);
    res.json(room);
  });

  // Get Room State
  app.get("/api/rooms/:code", (req, res) => {
    const code = req.params.code.toUpperCase();
    let room = rooms.get(code);
    if (!room) {
      const reloaded = loadRooms();
      room = reloaded.get(code);
      if (room) {
        rooms.set(code, room);
      }
    }
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  });

  // Make Move
  app.post("/api/rooms/:code/move", (req, res) => {
    const code = req.params.code.toUpperCase();
    const { index, symbol } = req.body;
    let room = rooms.get(code);
    if (!room) {
      const reloaded = loadRooms();
      room = reloaded.get(code);
      if (room) rooms.set(code, room);
    }

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.status !== "playing") {
      return res.status(400).json({ error: "Game is not active" });
    }

    if (room.turn !== symbol) {
      return res.status(400).json({ error: "Not your turn" });
    }

    if (room.board[index] !== null || room.winner !== null) {
      return res.status(400).json({ error: "Invalid move" });
    }

    room.board[index] = symbol;

    const result = checkWinner(room.board);
    if (result) {
      room.winner = result.winner;
      room.winningLine = result.winningLine;
      room.status = "finished";
      if (result.winner === "X" && room.playerX) {
        room.playerX.score += 1;
      } else if (result.winner === "O" && room.playerO) {
        room.playerO.score += 1;
      } else if (result.winner === "Draw") {
        room.draws += 1;
      }
    } else {
      room.turn = room.turn === "X" ? "O" : "X";
    }

    rooms.set(code, room);
    saveRooms(rooms);
    res.json(room);
  });

  // Reset Room (Rematch)
  app.post("/api/rooms/:code/reset", (req, res) => {
    const code = req.params.code.toUpperCase();
    let room = rooms.get(code);
    if (!room) {
      const reloaded = loadRooms();
      room = reloaded.get(code);
      if (room) rooms.set(code, room);
    }

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.board = Array(9).fill(null);
    room.winner = null;
    room.winningLine = null;
    room.status = "playing";
    room.turn = "X";

    rooms.set(code, room);
    saveRooms(rooms);
    res.json(room);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
