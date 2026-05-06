import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, X } from 'lucide-react';
import Bot from '../characters/Bot';

export type BotMessageType = 'info' | 'success' | 'error';

export interface BotMessage {
  id: number;
  text: string;
  type?: BotMessageType; // Optional, usually 'info'
}

interface AstroBotProps {
  message: BotMessage | null;
}

export function AstroBot({ message }: AstroBotProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = window.setTimeout(() => setIsVisible(false), 4200);
    return () => window.clearTimeout(timer);
  }, [message?.id]);

  const type = message?.type || 'info';

  const colors = {
    info: 'border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
    success: 'border-[#00FF88]/50 shadow-[0_10px_30px_rgba(0,255,136,0.15)]',
    error: 'border-[#FF0055]/50 shadow-[0_10px_30px_rgba(255,0,85,0.15)]'
  };

  return (
    <motion.div 
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      className="pointer-events-none fixed right-4 top-24 z-50 flex max-w-[min(88vw,360px)] items-end gap-3 xl:bottom-8 xl:top-auto xl:right-8 xl:max-w-none xl:gap-4"
    >
      <AnimatePresence mode="wait">
        {message && isVisible && (
          <motion.div 
            key={message.id}
            initial={{ opacity: 0, scale: 0.8, y: 10, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={`bg-[#1F2833]/95 backdrop-blur-xl border text-white p-4 pt-6 rounded-2xl rounded-br-sm max-w-[280px] mb-8 relative pointer-events-none flex items-start gap-3 sm:max-w-[320px] xl:max-w-[340px] ${colors[type]}`}
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="pointer-events-auto absolute top-2 right-2 text-gray-500 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-0.5 min-w-[20px]">
              {type === 'info' && <Info className="w-5 h-5 text-[#00E5FF]" />}
              {type === 'success' && <CheckCircle className="w-5 h-5 text-[#00FF88]" />}
              {type === 'error' && <AlertTriangle className="w-5 h-5 text-[#FF0055]" />}
            </div>
            <p className="text-sm font-medium leading-relaxed pr-1">{message.text}</p>
            <div className={`absolute -bottom-2 right-4 w-4 h-4 bg-[#1F2833] border-b border-r transform rotate-45 ${type === 'info' ? 'border-gray-700' : type === 'success' ? 'border-[#00FF88]/50' : 'border-[#FF0055]/50'}`}></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative pb-2">
        <Bot state="idle" direction={-1} />
      </div>
    </motion.div>
  );
}
