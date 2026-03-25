import React from 'react';
import { motion } from 'motion/react';

export type BotState = 'idle' | 'jumping' | 'running';

interface BotProps {
  state: BotState;
  direction: 1 | -1;
}

export default function Bot({ state, direction }: BotProps) {
  const isJumping = state === 'jumping';
  const isRunning = state === 'running';

  return (
    <motion.div
      className="relative w-16 h-16 flex items-center justify-center"
      animate={{ scaleX: direction }}
      transition={{ duration: 0.2 }}
    >
      {/* Hover/Thruster Glow */}
      <motion.div
        className="absolute -bottom-2 w-8 h-8 bg-[#00E5FF] rounded-full blur-md opacity-50"
        animate={{
          scale: isJumping ? 1.5 : isRunning ? 1.2 : [1, 1.2, 1],
          opacity: isJumping ? 0.8 : isRunning ? 0.6 : [0.4, 0.6, 0.4],
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />

      {/* Main Body */}
      <motion.div
        className="relative w-12 h-12 bg-white rounded-[1.2rem] shadow-[0_0_15px_rgba(255,255,255,0.8),inset_0_-4px_10px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center z-10"
        animate={{
          y: isJumping ? -25 : isRunning ? [-2, -6, -2] : [0, -4, 0],
          rotate: isRunning ? 15 : isJumping ? -10 : 0,
        }}
        transition={
          isRunning ? { repeat: Infinity, duration: 0.3 } :
          isJumping ? { duration: 0.4, ease: "easeOut" } :
          { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }
      >
        {/* Screen / Face */}
        <div className="w-9 h-6 bg-[#0B0C10] rounded-lg flex items-center justify-center gap-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          {/* Left Eye */}
          <motion.div 
            className="w-2 h-2.5 bg-[#00E5FF] rounded-full shadow-[0_0_5px_#00E5FF]"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1] }}
          />
          {/* Right Eye */}
          <motion.div 
            className="w-2 h-2.5 bg-[#00E5FF] rounded-full shadow-[0_0_5px_#00E5FF]"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1] }}
          />
        </div>
        
        {/* Little ear/antenna nubs */}
        <div className="absolute -left-1 top-4 w-1.5 h-4 bg-gray-300 rounded-l-md shadow-[inset_2px_0_2px_rgba(0,0,0,0.1)]" />
        <div className="absolute -right-1 top-4 w-1.5 h-4 bg-gray-300 rounded-r-md shadow-[inset_-2px_0_2px_rgba(0,0,0,0.1)]" />
      </motion.div>
    </motion.div>
  );
}
