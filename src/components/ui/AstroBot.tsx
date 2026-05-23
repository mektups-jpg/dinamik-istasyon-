import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { InlineMath } from 'react-katex';
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

interface AstroBotPanelProps {
  message: string;
  className?: string;
}

export function AstroBot({ message }: AstroBotProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, [message?.id]);

  const type = message?.type || 'info';

  const colors = {
    info: {
      border: 'border-[#00E5FF]/62',
      glow: 'shadow-[0_0_54px_rgba(0,229,255,0.30),0_22px_54px_rgba(0,0,0,0.58)]',
      text: 'text-[#A9F8FF]',
      label: 'Rehber notu',
    },
    success: {
      border: 'border-[#00FF88]/66',
      glow: 'shadow-[0_0_54px_rgba(0,255,136,0.30),0_22px_54px_rgba(0,0,0,0.58)]',
      text: 'text-[#A9FFD6]',
      label: 'Başarı kilidi',
    },
    error: {
      border: 'border-[#FF4FA3]/70',
      glow: 'shadow-[0_0_54px_rgba(255,79,163,0.34),0_22px_54px_rgba(0,0,0,0.58)]',
      text: 'text-[#FFB4D4]',
      label: 'Dikkat',
    },
  };
  const tone = colors[type];

  return (
    <motion.div
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.12 }}
      className="pointer-events-none fixed bottom-4 left-3 z-50 flex max-w-[calc(100vw-1.5rem)] items-end gap-3 sm:left-5 lg:bottom-6 lg:left-6 lg:max-w-[560px]"
    >
      <motion.div
        className="relative shrink-0 pb-1"
        animate={{ y: message && isVisible ? [0, -4, 0] : 0 }}
        transition={{ duration: 2.4, repeat: message && isVisible ? Infinity : 0, ease: 'easeInOut' }}
      >
        <div className="absolute -inset-2 rounded-[28px] bg-[#00E5FF]/10 blur-xl" />
        <Bot state="idle" direction={1} />
      </motion.div>

      <AnimatePresence mode="wait">
        {message && isVisible && (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, scale: 0.92, x: -12, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, x: -10 }}
            className={`relative mb-5 flex max-w-[min(78vw,450px)] items-start gap-3 rounded-[24px] rounded-bl-md border bg-[#061525] p-4 pr-11 text-white ring-1 ring-white/8 backdrop-blur-2xl sm:max-w-[460px] ${tone.border} ${tone.glow}`}
            role="status"
            aria-live="polite"
          >
            <button
              type="button"
              aria-label="AstroBot mesajını kapat"
              onClick={() => setIsVisible(false)}
              className="pointer-events-auto absolute right-3 top-3 rounded-full border border-white/16 bg-white/[0.10] p-1.5 text-white/72 transition hover:border-white/32 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl border bg-black/26 ${tone.border}`}>
              {type === 'info' && <Info className="h-5 w-5 text-[#00E5FF]" />}
              {type === 'success' && <CheckCircle className="h-5 w-5 text-[#00FF88]" />}
              {type === 'error' && <AlertTriangle className="h-5 w-5 text-[#FF4FA3]" />}
            </div>
            <div className="min-w-0">
              <p className={`font-mono text-[10px] font-black uppercase tracking-[0.22em] ${tone.text}`}>AstroBot · {tone.label}</p>
              <div className="mt-1 text-sm font-black leading-relaxed text-white sm:text-[15px]">{renderAstroBotMessage(message.text)}</div>
            </div>
            <div className={`absolute -left-2 bottom-5 h-4 w-4 rotate-45 border-b border-l bg-[#061525] ${tone.border}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function renderAstroBotMessage(text: string) {
  const parts = text.split(/(\[\[math:[^\]]+\]\])/g);

  return parts.map((part, index) => {
    const math = part.match(/^\[\[math:([^\]]+)\]\]$/)?.[1];

    if (math) {
      return (
        <span
          key={`${part}-${index}`}
          className="mr-1 inline-flex align-middle text-[15px] text-cyan-50 sm:text-base [&_.katex]:text-[1.08em]"
        >
          <InlineMath math={math} />
        </span>
      );
    }

    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
}

export function AstroBotPanel({ message, className = '' }: AstroBotPanelProps) {
  return (
    <div className={`rounded-[22px] border border-[#00E5FF]/18 bg-[#061525]/72 p-3 shadow-[0_16px_38px_rgba(0,0,0,0.22)] ${className}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.72)]" />
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">AstroBot son not</p>
          <p className="mt-1 text-sm font-black leading-snug text-white/78">{message}</p>
        </div>
      </div>
    </div>
  );
}
