export type GameMode = 'menu' | 'local' | 'ai' | 'online_create' | 'online_join' | 'online_game';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Scoreboard {
  xWins: number;
  oWins: number;
  draws: number;
  xStreak: number;
  oStreak: number;
}

export interface Player {
  username: string;
  score: number;
}

export interface RoomData {
  code: string;
  playerX: Player | null;
  playerO: Player | null;
  board: (string | null)[];
  turn: 'X' | 'O';
  winner: string | null;
  winningLine: number[] | null;
  status: 'waiting' | 'playing' | 'finished';
}
