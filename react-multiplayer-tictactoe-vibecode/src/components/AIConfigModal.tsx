import React from 'react';
import { Bot, ArrowLeft, Zap, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { AIDifficulty } from '../types';

interface AIConfigModalProps {
  onBack: () => void;
  onSelectDifficulty: (difficulty: AIDifficulty) => void;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({ onBack, onSelectDifficulty }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <Bot className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Pilih Kesulitan AI</h2>
          <p className="text-xs text-slate-400">Tentukan seberapa pintar lawan komputer kamu</p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectDifficulty('easy')}
            className="w-full p-4 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400">Mudah (Easy)</h3>
              <p className="text-xs text-slate-400">Bot bergerak secara acak, cocok untuk bersantai.</p>
            </div>
            <Sparkles className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectDifficulty('medium')}
            className="w-full p-4 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-400">Sedang (Medium)</h3>
              <p className="text-xs text-slate-400">Bot memblokir kemenanganmu dan mencari peluang.</p>
            </div>
            <Zap className="w-5 h-5 text-slate-600 group-hover:text-sky-400 transition-colors" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectDifficulty('hard')}
            className="w-full p-4 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400">Sulit / Master (Unbeatable)</h3>
              <p className="text-xs text-slate-400">Algoritma Minimax sempurna. Hampir mustahil dikalahkan!</p>
            </div>
            <Shield className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
