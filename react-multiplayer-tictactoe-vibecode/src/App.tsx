import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ModeSelector } from './components/ModeSelector';
import { AIConfigModal } from './components/AIConfigModal';
import { OnlineLobby } from './components/OnlineLobby';
import { WaitingRoom } from './components/WaitingRoom';
import { GameBoard } from './components/GameBoard';
import { GameMode, AIDifficulty, RoomData } from './types';

function checkWinner(board: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: line };
    }
  }
  if (board.every(cell => cell !== null)) {
    return { winner: 'Draw', winningLine: null };
  }
  return null;
}

export default function App() {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('tictactoe_username') || '';
  });

  const [mode, setMode] = useState<GameMode>('menu');
  const [aiDifficulty, AIDifficultyState] = useState<AIDifficulty>('medium');
  const [showAIConfig, setShowAIConfig] = useState(false);

  // Local game state
  const [localBoard, setLocalBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [localTurn, setLocalTurn] = useState<'X' | 'O'>('X');
  const [localWinner, setLocalWinner] = useState<string | null>(null);
  const [localWinningLine, setLocalWinningLine] = useState<number[] | null>(null);
  const [localScores, setLocalScores] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
    xStreak: 0,
    oStreak: 0
  });

  // Online room state
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);

  // Polling effect for online room
  useEffect(() => {
    if (!currentRoom || !currentRoom.code) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${currentRoom.code}`);
        if (res.ok) {
          const data: RoomData = await res.json();
          setCurrentRoom(data);
        }
      } catch (err) {
        console.error('Failed to poll room state:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentRoom?.code]);

  const handleLogin = (name: string) => {
    setUsername(name);
    localStorage.setItem('tictactoe_username', name);
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('tictactoe_username');
    setMode('menu');
  };

  // Local move handler
  const handleLocalCellClick = (index: number) => {
    if (localBoard[index] !== null || localWinner !== null) return;

    const newBoard = [...localBoard];
    newBoard[index] = localTurn;
    setLocalBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setLocalWinner(result.winner);
      setLocalWinningLine(result.winningLine);
      updateScores(result.winner, 'local');
    } else {
      setLocalTurn(localTurn === 'X' ? 'O' : 'X');
    }
  };

  // AI move handler
  const handleAICellClick = (index: number) => {
    if (localBoard[index] !== null || localWinner !== null || localTurn !== 'X') return;

    const newBoard = [...localBoard];
    newBoard[index] = 'X';
    setLocalBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setLocalWinner(result.winner);
      setLocalWinningLine(result.winningLine);
      updateScores(result.winner, 'ai');
      return;
    }

    setLocalTurn('O');

    // Bot move after short delay
    setTimeout(() => {
      makeAIMove(newBoard);
    }, 500);
  };

  const makeAIMove = (board: (string | null)[]) => {
    const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter((val): val is number => val !== null);
    if (emptyIndices.length === 0 || checkWinner(board)) return;

    let moveIndex = emptyIndices[0];

    if (aiDifficulty === 'easy') {
      moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else if (aiDifficulty === 'medium') {
      // Try to win or block
      let found = false;
      for (const idx of emptyIndices) {
        const testBoard = [...board];
        testBoard[idx] = 'O';
        if (checkWinner(testBoard)?.winner === 'O') {
          moveIndex = idx;
          found = true;
          break;
        }
      }
      if (!found) {
        for (const idx of emptyIndices) {
          const testBoard = [...board];
          testBoard[idx] = 'X';
          if (checkWinner(testBoard)?.winner === 'X') {
            moveIndex = idx;
            found = true;
            break;
          }
        }
      }
      if (!found) {
        moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    } else {
      // Hard (Minimax)
      const best = minimax(board, 0, true);
      if (best.index !== undefined) {
        moveIndex = best.index;
      }
    }

    const newBoard = [...board];
    newBoard[moveIndex] = 'O';
    setLocalBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setLocalWinner(result.winner);
      setLocalWinningLine(result.winningLine);
      updateScores(result.winner, 'ai');
    } else {
      setLocalTurn('X');
    }
  };

  const updateScores = (winner: string, gameType: 'local' | 'ai') => {
    setLocalScores(prev => {
      let xWins = prev.xWins;
      let oWins = prev.oWins;
      let draws = prev.draws;
      let xStreak = prev.xStreak;
      let oStreak = prev.oStreak;

      if (winner === 'X') {
        xWins += 1;
        xStreak += 1;
        oStreak = 0;
      } else if (winner === 'O') {
        oWins += 1;
        oStreak += 1;
        xStreak = 0;
      } else {
        draws += 1;
        xStreak = 0;
        oStreak = 0;
      }
      return { xWins, oWins, draws, xStreak, oStreak };
    });
  };

  const resetLocalGame = () => {
    setLocalBoard(Array(9).fill(null));
    setLocalWinner(null);
    setLocalWinningLine(null);
    setLocalTurn('X');
  };

  // Online Actions
  const handleCreateRoom = async () => {
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal membuat room');
    }
    const room: RoomData = await res.json();
    setCurrentRoom(room);
    setMode('online_game');
  };

  const handleJoinRoom = async (code: string) => {
    const res = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, username })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal bergabung ke room');
    }
    const room: RoomData = await res.json();
    setCurrentRoom(room);
    setMode('online_game');
  };

  const handleOnlineCellClick = async (index: number) => {
    if (!currentRoom || currentRoom.winner || currentRoom.board[index] !== null) return;
    const mySymbol = currentRoom.playerX?.username === username ? 'X' : 'O';
    if (currentRoom.turn !== mySymbol) return;

    try {
      const res = await fetch(`/api/rooms/${currentRoom.code}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, symbol: mySymbol })
      });
      if (res.ok) {
        const room: RoomData = await res.json();
        setCurrentRoom(room);
      }
    } catch (err) {
      console.error('Failed to make move:', err);
    }
  };

  const handleResetOnline = async () => {
    if (!currentRoom) return;
    try {
      const res = await fetch(`/api/rooms/${currentRoom.code}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const room: RoomData = await res.json();
        setCurrentRoom(room);
      }
    } catch (err) {
      console.error('Failed to reset room:', err);
    }
  };

  if (!username) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (mode === 'menu') {
    return (
      <ModeSelector
        username={username}
        onSelectMode={(selectedMode) => {
          if (selectedMode === 'ai') {
            setShowAIConfig(true);
          } else if (selectedMode === 'online_create') {
            setMode('online_create');
          } else {
            setMode(selectedMode);
            resetLocalGame();
          }
        }}
        onLogout={handleLogout}
      />
    );
  }

  if (showAIConfig) {
    return (
      <AIConfigModal
        onBack={() => setShowAIConfig(false)}
        onSelectDifficulty={(diff) => {
          AIDifficultyState(diff);
          setShowAIConfig(false);
          setMode('ai');
          resetLocalGame();
        }}
      />
    );
  }

  if (mode === 'online_create') {
    return (
      <OnlineLobby
        username={username}
        onBack={() => setMode('menu')}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
    );
  }

  if (mode === 'online_game' && currentRoom) {
    if (currentRoom.status === 'waiting') {
      return (
        <WaitingRoom
          room={currentRoom}
          onBack={() => {
            setCurrentRoom(null);
            setMode('menu');
          }}
        />
      );
    }

    const mySymbol = currentRoom.playerX?.username === username ? 'X' : 'O';
    const opponentName = mySymbol === 'X' ? currentRoom.playerO?.username || 'Lawan' : currentRoom.playerX?.username || 'Lawan';
    const playerXName = currentRoom.playerX?.username || 'Player X';
    const playerOName = currentRoom.playerO?.username || 'Player O';

    return (
      <GameBoard
        board={currentRoom.board}
        onCellClick={handleOnlineCellClick}
        xWins={currentRoom.playerX?.score || 0}
        oWins={currentRoom.playerO?.score || 0}
        draws={0}
        xStreak={0}
        oStreak={0}
        playerXName={playerXName}
        playerOName={playerOName}
        currentTurn={currentRoom.turn}
        winner={currentRoom.winner}
        winningLine={currentRoom.winningLine}
        onReset={handleResetOnline}
        onBack={() => {
          setCurrentRoom(null);
          setMode('menu');
        }}
        modeTitle="Online Room"
        roomCode={currentRoom.code}
        mySymbol={mySymbol}
        isMyTurn={currentRoom.turn === mySymbol}
      />
    );
  }

  if (mode === 'local') {
    return (
      <GameBoard
        board={localBoard}
        onCellClick={handleLocalCellClick}
        xWins={localScores.xWins}
        oWins={localScores.oWins}
        draws={localScores.draws}
        xStreak={localScores.xStreak}
        oStreak={localScores.oStreak}
        playerXName={`${username} (X)`}
        playerOName={`Teman (O)`}
        currentTurn={localTurn}
        winner={localWinner}
        winningLine={localWinningLine}
        onReset={resetLocalGame}
        onBack={() => setMode('menu')}
        modeTitle="Multiplayer Lokal"
      />
    );
  }

  if (mode === 'ai') {
    return (
      <GameBoard
        board={localBoard}
        onCellClick={handleAICellClick}
        xWins={localScores.xWins}
        oWins={localScores.oWins}
        draws={localScores.draws}
        xStreak={localScores.xStreak}
        oStreak={localScores.oStreak}
        playerXName={`${username} (X)`}
        playerOName={`Bot AI (${aiDifficulty.toUpperCase()})`}
        currentTurn={localTurn}
        winner={localWinner}
        winningLine={localWinningLine}
        onReset={resetLocalGame}
        onBack={() => setMode('menu')}
        modeTitle={`Lawan Bot (${aiDifficulty})`}
      />
    );
  }

  return null;
}

// Minimax helper for Hard AI
function minimax(newBoard: (string | null)[], depth: number, isMaximizing: boolean): { score: number; index?: number } {
  const result = checkWinner(newBoard);
  if (result) {
    if (result.winner === 'O') return { score: 10 - depth };
    if (result.winner === 'X') return { score: depth - 10 };
    return { score: 0 };
  }

  const emptyIndices = newBoard.map((val, idx) => val === null ? idx : null).filter((val): val is number => val !== null);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = emptyIndices[0];
    for (const idx of emptyIndices) {
      newBoard[idx] = 'O';
      const score = minimax(newBoard, depth + 1, false).score;
      newBoard[idx] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = idx;
      }
    }
    return { score: bestScore, index: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = emptyIndices[0];
    for (const idx of emptyIndices) {
      newBoard[idx] = 'X';
      const score = minimax(newBoard, depth + 1, true).score;
      newBoard[idx] = null;
      if (score < bestScore) {
        bestScore = score;
        bestMove = idx;
      }
    }
    return { score: bestScore, index: bestMove };
  }
}
