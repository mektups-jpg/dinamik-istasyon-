import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import { SciFiButton } from './SciFiButton';
import { Link } from 'react-router-dom';

interface ModuleCompletedScreenProps {
  title?: string;
  message?: string;
  scoreEarned?: number;
  onRestart?: () => void;
  nextModulePath?: string;
}

export function ModuleCompletedScreen({
  title = "GÖREV BAŞARILI",
  message = "Tüm sistemler onarıldı ve stabil çalışıyor. Yeni bir kazanım açıldı!",
  scoreEarned,
  onRestart,
  nextModulePath
}: ModuleCompletedScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="flex flex-col items-center justify-center p-5 sm:p-8 bg-black/60 rounded-3xl border border-yellow-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(234,179,8,0.2)] max-w-2xl mx-auto w-full my-8 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
      
      {/* Icon */}
      <motion.div
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-yellow-500/30 blur-2xl rounded-full" />
        <Trophy className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] relative z-10" />
      </motion.div>

      {/* Headings */}
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-full break-words text-center text-2xl font-black uppercase leading-tight tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 mb-4 sm:text-4xl sm:tracking-widest md:text-5xl"
      >
        {title}
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-300 text-center text-lg mb-8 max-w-lg"
      >
        {message}
      </motion.p>

      {/* Score/Stats (if any) */}
      {scoreEarned !== undefined && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 px-6 py-3 rounded-2xl mb-8"
        >
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 font-mono text-xl font-bold">+{scoreEarned} XP</span>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
      >
        {onRestart && (
          <SciFiButton variant="secondary" onClick={onRestart} className="w-full sm:w-auto" icon={<RotateCcw className="w-4 h-4" />}>
            TEKRAR OYNA
          </SciFiButton>
        )}
        
        {nextModulePath ? (
          <Link to={nextModulePath}>
            <SciFiButton variant="primary" className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400/50 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:brightness-110 text-white">
              SONRAKİ MODÜL
            </SciFiButton>
          </Link>
        ) : (
          <Link to="/">
            <SciFiButton variant="primary" className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400/50 shadow-[0_0_20px_rgba(234,179,8,0.4)] text-black" icon={<Home className="w-4 h-4" />}>
              ANA MERKEZE DÖN
            </SciFiButton>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
