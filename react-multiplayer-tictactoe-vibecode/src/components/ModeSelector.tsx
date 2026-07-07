import React from 'react';
import { Users, Bot, Globe, LogOut, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GameMode } from '../types';

interface ModeSelectorProps {
  username: string;
  onSelectMode: (mode: GameMode) => void;
  onLogout: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ username, onSelectMode, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-4xl mx-auto z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center font-black text-white shadow-md">
            Xø
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Halo, {username}</h2>
            <p className="text-xs text-slate-400">Pilih mode permainan</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl z-10 mt-16 sm:mt-0"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Pilih Mode Pertandingan</h1>
          <p className="text-slate-400 text-sm">Mainkan Tic Tac Toe bersama teman atau asah kemampuanmu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Local Multiplayer */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode('local')}
            className="group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-left transition-all duration-200 shadow-xl cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Multiplayer Lokal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bertanding bergantian di satu perangkat bersama teman di sebelahmu.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
              <span>Mulai Lokal</span>
              <Sparkles className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </motion.button>

          {/* VS Computer */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode('ai')}
            className="group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-left transition-all duration-200 shadow-xl cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Lawan Bot AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tantang komputer pintar dengan berbagai tingkat kesulitan.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
              <span>Lawan Bot</span>
              <Sparkles className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </motion.button>

          {/* Online Room */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode('online_create')}
            className="group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 text-left transition-all duration-200 shadow-xl cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Room Kode Unik</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Buat room atau gabung dengan kode unik untuk mabar online dengan teman.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-sky-400 group-hover:text-sky-300">
              <span>Mainkan Online</span>
              <Sparkles className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
