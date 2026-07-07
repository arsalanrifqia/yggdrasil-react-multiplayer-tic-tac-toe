import express from "express";
import path from "path";
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
  createdAt: number;
}

const rooms = new Map<string, Room>();

// Cleanup old rooms every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.createdAt > 3600000 * 2) { // 2 hours
      rooms.delete(code);
    }
  }
}, 1800000);

function checkWinner(board: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]            // diagonals
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: line };
    }
  }
  if (board.every(cell => cell !== null)) {
    return { winner: "Draw", winningLine: null };
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  // Create Room
  app.post("/api/rooms/create", (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Generate unique 6-character alphanumeric code
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
      createdAt: Date.now(),
    };

    rooms.set(code, room);
    res.json(room);
  });

  // Join Room
  app.post("/api/rooms/join", (req, res) => {
    const { code, username } = req.body;
    if (!code || !username) {
      return res.status(400).json({ error: "Room code and username are required" });
    }

    const room = rooms.get(code.toUpperCase());
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.playerX && room.playerX.username === username) {
      // Rejoining as X
      return res.json(room);
    }

    if (room.playerO && room.playerO.username === username) {
      // Rejoining as O
      return res.json(room);
    }

    if (room.playerO) {
      return res.status(400).json({ error: "Room is already full" });
    }

    room.playerO = { username, score: 0 };
    room.status = "playing";
    res.json(room);
  });

  // Get Room State
  app.get("/api/rooms/:code", (req, res) => {
    const code = req.params.code.toUpperCase();
    const room = rooms.get(code);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  });

  // Make Move
  app.post("/api/rooms/:code/move", (req, res) => {
    const code = req.params.code.toUpperCase();
    const { index, symbol } = req.body; // symbol: 'X' or 'O'
    const room = rooms.get(code);

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
      }
    } else {
      room.turn = room.turn === "X" ? "O" : "X";
    }

    res.json(room);
  });

  // Reset Room (Rematch)
  app.post("/api/rooms/:code/reset", (req, res) => {
    const code = req.params.code.toUpperCase();
    const room = rooms.get(code);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.board = Array(9).fill(null);
    room.winner = null;
    room.winningLine = null;
    room.status = "playing";
    // Alternate starting player or keep X
    room.turn = "X";

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
