import React, { useState } from 'react';
import { Copy, Check, ArrowLeft, Loader2, Globe, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { RoomData } from '../types';

interface WaitingRoomProps {
  room: RoomData;
  onBack: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ room, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <header className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Keluar Room</span>
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-4 animate-pulse">
          <Globe className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Menunggu Lawan...</h2>
        <p className="text-xs text-slate-400 mb-6">
          Bagikan kode room unik ini kepada temanmu agar bisa bergabung.
        </p>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Kode Room</span>
            <span className="text-2xl font-black font-mono text-sky-400 tracking-wider">{room.code}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors flex items-center space-x-1.5 text-xs font-medium cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
            <span className="text-slate-400 flex items-center space-x-2">
              <span className="w-5 h-5 rounded bg-indigo-500 text-white font-bold flex items-center justify-center">X</span>
              <span>{room.playerX?.username} (Pembuat)</span>
            </span>
            <span className="text-emerald-400 font-semibold">Siap</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
            <span className="text-slate-400 flex items-center space-x-2">
              <span className="w-5 h-5 rounded bg-emerald-500 text-white font-bold flex items-center justify-center">O</span>
              <span>Menunggu pemain kedua...</span>
            </span>
            <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Room aktif dan siap menerima lawan</span>
        </div>
      </motion.div>
    </div>
  );
};
