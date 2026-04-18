import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, AlertCircle, Lightbulb, CheckCircle2, MessageSquare, X } from 'lucide-react';

export type AstroMood = 'idle' | 'error' | 'hint' | 'success';

interface AstroGuideProps {
  visible: boolean;
  message: string;
  mood?: AstroMood;
  onClose?: () => void;
}

export default function AstroGuide({ visible, message, mood = 'idle', onClose }: AstroGuideProps) {
  // Theme configuration based on mood
  const themes = {
    idle: {
      border: 'border-gray-700',
      bg: 'bg-gray-900/90',
      iconColor: 'text-gray-400',
      glow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
      Icon: MessageSquare
    },
    error: {
      border: 'border-red-500/50',
      bg: 'bg-red-950/90',
      iconColor: 'text-red-400',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
      Icon: AlertCircle
    },
    hint: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-950/90',
      iconColor: 'text-purple-400',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
      Icon: Lightbulb
    },
    success: {
      border: 'border-[#00E5FF]/50',
      bg: 'bg-[#00E5FF]/10',
      iconColor: 'text-[#00E5FF]',
      glow: 'shadow-[0_0_30px_rgba(0,229,255,0.15)]',
      Icon: CheckCircle2
    }
  };

  const theme = themes[mood];
  const { Icon } = theme;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed bottom-8 right-8 z-50 flex items-end gap-3 max-w-[420px]`}
        >
          {/* Main Speech Bubble */}
          <div className={`relative p-5 rounded-2xl border backdrop-blur-xl ${theme.border} ${theme.bg} ${theme.glow}`}>
            
            {onClose && (
              <button 
                onClick={onClose}
                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex gap-3">
              <div className={`mt-0.5 ${theme.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-200 leading-relaxed pr-4 font-mono">
                {message}
              </p>
            </div>
            
            {/* Speech Bubble Tail */}
            <div className={`absolute -bottom-3 -right-2 w-6 h-6 border-b border-r ${theme.border} ${theme.bg} rotate-45 transform origin-top-left -z-10`} />
          </div>

          {/* Astro-Bot Avatar */}
          <motion.div 
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-14 h-14 rounded-full border-2 ${theme.border} bg-[#0A0A0A] flex items-center justify-center relative shrink-0 overflow-hidden shadow-2xl`}
          >
            <div className={`absolute inset-0 opacity-20 ${theme.bg}`} />
            <Bot className={`w-7 h-7 relative z-10 ${theme.iconColor}`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
