import React, { useState } from 'react';
import { ArrowLeft, Globe, Key, Copy, Check, Users, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface OnlineLobbyProps {
  username: string;
  onBack: () => void;
  onJoinRoom: (code: string) => void;
  onCreateRoom: () => void;
}

export const OnlineLobby: React.FC<OnlineLobbyProps> = ({
  username,
  onBack,
  onJoinRoom,
  onCreateRoom,
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    setError('');
    try {
      await onCreateRoom();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat room');
      setIsCreating(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCodeInput.trim().toUpperCase();
    if (!code || code.length !== 6) {
      setError('Masukkan kode room 6 karakter dengan benar.');
      return;
    }
    setIsJoining(true);
    setError('');
    try {
      await onJoinRoom(code);
    } catch (err: any) {
      setError(err.message || 'Room tidak ditemukan atau sudah penuh.');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-3">
            <Globe className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Mabar Online</h2>
          <p className="text-xs text-slate-400">Buat room baru atau masukkan kode untuk bergabung</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-2 text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Create Room Button */}
          <div>
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Users className="w-4 h-4" />
              <span>{isCreating ? 'Membuat Room...' : 'Buat Room Baru'}</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">Atau</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Join Room Form */}
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Kode Room Unik (6 Karakter)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="CONTOH: AB12CD"
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono tracking-widest uppercase font-bold text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isJoining || !roomCodeInput.trim()}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isJoining ? 'Menghubungkan...' : 'Gabung ke Room'}</span>
              <Sparkles className="w-4 h-4 text-sky-400" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
