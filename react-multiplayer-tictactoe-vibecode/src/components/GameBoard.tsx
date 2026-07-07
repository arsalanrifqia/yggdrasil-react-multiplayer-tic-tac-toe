import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { Scoreboard } from './Scoreboard';

interface GameBoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  xWins: number;
  oWins: number;
  draws: number;
  xStreak: number;
  oStreak: number;
  playerXName: string;
  playerOName: string;
  currentTurn: 'X' | 'O';
  winner: string | null;
  winningLine: number[] | null;
  onReset: () => void;
  onBack: () => void;
  modeTitle: string;
  roomCode?: string;
  mySymbol?: 'X' | 'O';
  isMyTurn?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  xWins,
  oWins,
  draws,
  xStreak,
  oStreak,
  playerXName,
  playerOName,
  currentTurn,
  winner,
  winningLine,
  onReset,
  onBack,
  modeTitle,
  roomCode,
  mySymbol,
  isMyTurn = true
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="absolute top-4 left-4 right-4 flex items-center justify-between max-w-xl mx-auto z-10">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-semibold text-slate-300">
            {modeTitle} {roomCode && <span className="text-sky-400 font-mono font-bold">#{roomCode}</span>}
          </span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </header>

      <div className="w-full max-w-md mx-auto pt-16 z-10">
        {/* Scoreboard */}
        <Scoreboard
          playerXName={playerXName}
          playerOName={playerOName}
          xWins={xWins}
          oWins={oWins}
          draws={draws}
          xStreak={xStreak}
          oStreak={oStreak}
          currentTurn={currentTurn}
        />

        {/* Turn / Status Banner */}
        <div className="text-center mb-6">
          {winner ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">
                {winner === 'Draw' ? 'Pertandingan Seri (Draw)!' : `${winner === 'X' ? playerXName : playerOName} Menang! 🎉`}
              </span>
            </motion.div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">
                Giliran: <strong className={currentTurn === 'X' ? 'text-indigo-400' : 'text-emerald-400'}>
                  {currentTurn === 'X' ? playerXName : playerOName} ({currentTurn})
                </strong>
                {mySymbol && ` ${mySymbol === currentTurn ? '(Giliran Kamu)' : '(Lawan Berpikir)'}`}
              </span>
            </div>
          )}
        </div>

        {/* 3x3 Tic Tac Toe Grid */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
          {board.map((cell, index) => {
            const isWinningCell = winningLine?.includes(index);
            return (
              <motion.button
                key={index}
                whileHover={{ scale: cell || winner ? 1 : 1.03 }}
                whileTap={{ scale: cell || winner ? 1 : 0.97 }}
                onClick={() => onCellClick(index)}
                disabled={cell !== null || winner !== null || (mySymbol && !isMyTurn)}
                className={`aspect-square rounded-2xl font-black text-4xl sm:text-5xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isWinningCell
                    ? 'bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border-2 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20 animate-pulse'
                    : cell
                    ? 'bg-slate-950/80 border border-slate-800'
                    : 'bg-slate-950/40 hover:bg-slate-950/90 border border-slate-800/60 hover:border-slate-700'
                }`}
              >
                {cell === 'X' && (
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                  >
                    X
                  </motion.span>
                )}
                {cell === 'O' && (
                  <motion.span
                    initial={{ scale: 0, rotate: 20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  >
                    O
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Rematch Button when game is finished */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <button
              onClick={onReset}
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi (Rematch)</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
