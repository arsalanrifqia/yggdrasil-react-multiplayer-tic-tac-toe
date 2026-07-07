import React, { useState } from 'react';
import { User, Sparkles, Trophy, Users, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Masukkan username terlebih dahulu!');
      return;
    }
    if (trimmed.length > 15) {
      setError('Username maksimal 15 karakter.');
      return;
    }
    onLogin(trimmed);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/30 mb-4">
            <span className="text-3xl font-black font-mono">Xø</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Tic Tac Toe Arena</h1>
          <p className="text-sm text-slate-400">Masuk dengan username untuk mulai bertanding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username Kamu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Contoh: GamerPro99"
                maxLength={15}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                autoFocus
              />
            </div>
            {error && <p className="text-rose-400 text-xs mt-2 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Masuk ke Arena</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center text-xs text-slate-400">
          <div className="flex flex-col items-center space-y-1">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Multiplayer Lokal</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Papan Skor</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Room Kode Unik</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
