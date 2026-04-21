import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type SciFiButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface SciFiButtonProps extends HTMLMotionProps<"button"> {
  variant?: SciFiButtonVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SciFiButton({ 
  variant = 'primary', 
  icon, 
  children, 
  className = '', 
  disabled,
  ...props 
}: SciFiButtonProps) {
  
  const baseStyles = "px-6 py-2 rounded-xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-95 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#00E5FF] to-[#0088ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:brightness-110 border border-[#00E5FF]/50 disabled:opacity-50 disabled:grayscale-[0.5]",
    secondary: "bg-gray-900 text-white border border-gray-800 hover:bg-gray-800 shadow-inner disabled:opacity-50",
    danger: "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:brightness-110 border border-red-500/50 disabled:opacity-50",
    ghost: "bg-transparent text-[#00E5FF] hover:bg-[#00E5FF]/10 disabled:opacity-50"
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </motion.button>
  );
}
