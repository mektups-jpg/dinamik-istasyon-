import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export function GameHeader({ title, subtitle, onBack, rightContent }: GameHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="p-6 relative z-30 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack} 
          className="p-2 rounded-xl border border-transparent hover:border-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-400" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
            {title}
          </h1>
          <p className="text-xs text-[#00E5FF]/60 mt-1 uppercase tracking-widest font-mono">
            {subtitle}
          </p>
        </div>
      </div>
      
      {rightContent && (
        <div className="flex gap-4 items-center">
          {rightContent}
        </div>
      )}
    </header>
  );
}
