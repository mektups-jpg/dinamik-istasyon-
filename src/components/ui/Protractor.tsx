import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProtractorProps {
    placed: boolean;
    pPos: { x: number, y: number };
    pRot: number;
    setActiveDrag: (drag: 'NONE' | 'MOVE' | 'ROTATE') => void;
}

export function Protractor({ placed, pPos, pRot, setActiveDrag }: ProtractorProps) {
    return (
        <AnimatePresence>
            {placed && (
                <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
                    className="drop-shadow-[0_0_15px_rgba(0,255,136,0.4)]"
                >
                    <g transform={`translate(${pPos.x}, ${pPos.y}) rotate(${pRot})`} className="pointer-events-auto">
                        {/* Dış Yay ve Zemin (0=sağ, 180=sol, -Y yukarı) */}
                        <path d="M 250 0 A 250 250 0 0 0 -250 0 Z" fill="rgba(0,0,0,0.6)" stroke="rgba(0,255,136,0.8)" strokeWidth="6" className="pointer-events-none" />
                        <line x1="-250" y1="0" x2="250" y2="0" stroke="rgba(0,255,136,0.5)" strokeWidth="2" strokeDasharray="5,5" className="pointer-events-none" />
                        
                        {Array.from({ length: 181 }).map((_, angle) => {
                            // angle 0 is at right (250, 0), angle 180 is at left (-250, 0)
                            const rad = -angle * Math.PI / 180; 
                            const rOuter = 240;
                            let rInner = 232;
                            let strokeWidth = "1";
                            let opacity = 0.4;
                            let hasText = false;
                            let rText = 190;
                            let fontSize = "14";

                            if (angle % 10 === 0) {
                                rInner = 210;
                                strokeWidth = "2.5";
                                opacity = 1;
                                hasText = true;
                                rText = 188;
                                fontSize = "14";
                            } else if (angle % 5 === 0) {
                                rInner = 220;
                                strokeWidth = "1.5";
                                opacity = 0.8;
                                hasText = true;
                                rText = 205;
                                fontSize = "10";
                            }
                            
                            const x1 = rOuter * Math.cos(rad);
                            const y1 = rOuter * Math.sin(rad);
                            const x2 = rInner * Math.cos(rad);
                            const y2 = rInner * Math.sin(rad);

                            const tx = rText * Math.cos(rad);
                            const ty = rText * Math.sin(rad);

                            return (
                                <g key={angle} className="pointer-events-none">
                                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00FF88" strokeWidth={strokeWidth} opacity={opacity}/>
                                    {hasText && (
                                        <text x={tx} y={ty} fill="#00FF88" fontSize={fontSize} fontWeight="bold" fontFamily="monospace" textAnchor="middle" alignmentBaseline="middle" transform={`rotate(${angle - 90}, ${tx}, ${ty})`}>
                                            {angle}
                                        </text>
                                    )}
                                </g>
                            )
                        })}
                        
                        {/* Drag Handle (Center) */}
                        <g className="cursor-move transition-all group" onPointerDown={(e) => { e.stopPropagation(); setActiveDrag('MOVE'); }}>
                            <circle cx="0" cy="0" r="24" fill="rgba(0,229,255,0.2)" stroke="#00E5FF" strokeWidth="2" className="group-hover:fill-[rgba(0,229,255,0.4)]" strokeDasharray="4,4" />
                            <circle cx="0" cy="0" r="4" fill="#00E5FF" />
                            <text x="0" y="38" fill="#00E5FF" fontSize="11" textAnchor="middle" className="font-bold tracking-wider select-none">TAŞI</text>
                        </g>
                        
                        {/* Rotate Handle (0 degree line) */}
                        <line x1="250" y1="0" x2="300" y2="0" stroke="#00E5FF" strokeWidth="2" strokeDasharray="4,4" className="pointer-events-none" />
                        <g className="cursor-grab transition-all group" onPointerDown={(e) => { e.stopPropagation(); setActiveDrag('ROTATE'); }}>
                            <circle cx="280" cy="0" r="16" fill="rgba(0,229,255,0.2)" stroke="#00E5FF" strokeWidth="2" className="group-hover:fill-[rgba(0,229,255,0.4)]" />
                            <circle cx="280" cy="0" r="4" fill="#00E5FF" />
                            <text x="280" y="-22" fill="#00E5FF" fontSize="11" textAnchor="middle" className="font-bold tracking-wider select-none">DÖNDÜR</text>
                        </g>
                    </g>
                </motion.g>
            )}
        </AnimatePresence>
    );
}
