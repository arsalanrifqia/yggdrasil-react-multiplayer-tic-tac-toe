import React from 'react';
import { Trophy, Flame, Minus } from 'lucide-react';

interface ScoreboardProps {
  playerXName: string;
  playerOName: string;
  xWins: number;
  oWins: number;
  draws: number;
  xStreak: number;
  oStreak: number;
  currentTurn: 'X' | 'O';
  isOnline?: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  playerXName,
  playerOName,
  xWins,
  oWins,
  draws,
  xStreak,
  oStreak,
  currentTurn,
  isOnline = false
}) => {
  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-3 mb-6">
      {/* Player X */}
      <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
        currentTurn === 'X' 
          ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50' 
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="absolute top-2 left-2 flex items-center space-x-1">
          <span className="w-5 h-5 rounded-md bg-indigo-500 text-white font-black text-xs flex items-center justify-center">X</span>
        </div>
        {xStreak > 1 && (
          <div className="absolute top-2 right-2 flex items-center space-x-0.5 text-amber-400 text-xs font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>{xStreak}</span>
          </div>
        )}
        <span className="text-xs font-semibold text-slate-300 truncate max-w-[90px] mt-4 mb-1">
          {playerXName}
        </span>
        <span className="text-2xl font-black text-indigo-400 font-mono">{xWins}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Menang</span>
      </div>

      {/* Draws */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center">
        <div className="absolute top-2 text-slate-500">
          <Minus className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-slate-400 mt-2 mb-1">Seri</span>
        <span className="text-2xl font-black text-slate-300 font-mono">{draws}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Imbang</span>
      </div>

      {/* Player O */}
      <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
        currentTurn === 'O' 
          ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/50' 
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="absolute top-2 left-2 flex items-center space-x-1">
          <span className="w-5 h-5 rounded-md bg-emerald-500 text-white font-black text-xs flex items-center justify-center">O</span>
        </div>
        {oStreak > 1 && (
          <div className="absolute top-2 right-2 flex items-center space-x-0.5 text-amber-400 text-xs font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>{oStreak}</span>
          </div>
        )}
        <span className="text-xs font-semibold text-slate-300 truncate max-w-[90px] mt-4 mb-1">
          {playerOName}
        </span>
        <span className="text-2xl font-black text-emerald-400 font-mono">{oWins}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Menang</span>
      </div>
    </div>
  );
};
