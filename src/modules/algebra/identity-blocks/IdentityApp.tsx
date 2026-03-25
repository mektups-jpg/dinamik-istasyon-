import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

export default function IdentityBlocksSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Define block dimensions
  const a = 150;
  const b = 80;
  
  // Target positions (forming a large square)
  const targets = {
    a2: { x: 0, y: 0 },
    ab1: { x: a, y: 0 },
    ab2: { x: 0, y: a },
    b2: { x: a, y: a }
  };

  // Initial random positions
  const [positions, setPositions] = useState({
    a2: { x: 300, y: 50 },
    ab1: { x: 400, y: 250 },
    ab2: { x: 500, y: 100 },
    b2: { x: 350, y: 350 }
  });

  const checkCompletion = () => {
    // Check if all blocks are close to their target positions
    const tolerance = 20;
    const a2Dist = Math.hypot(positions.a2.x - targets.a2.x, positions.a2.y - targets.a2.y);
    const ab1Dist = Math.hypot(positions.ab1.x - targets.ab1.x, positions.ab1.y - targets.ab1.y);
    const ab2Dist = Math.hypot(positions.ab2.x - targets.ab2.x, positions.ab2.y - targets.ab2.y);
    const b2Dist = Math.hypot(positions.b2.x - targets.b2.x, positions.b2.y - targets.b2.y);

    if (a2Dist < tolerance && ab1Dist < tolerance && ab2Dist < tolerance && b2Dist < tolerance) {
      setIsCompleted(true);
      // Snap to exact positions
      setPositions(targets);
    }
  };

  const handleDragEnd = (id: keyof typeof positions, info: any) => {
    if (isCompleted) return;
    
    // Update position
    setPositions(prev => ({
      ...prev,
      [id]: { x: prev[id].x + info.offset.x, y: prev[id].y + info.offset.y }
    }));
  };

  useEffect(() => {
    if (!isCompleted) {
      checkCompletion();
    }
  }, [positions]);

  return (
    <div className="w-full h-full flex flex-col relative" ref={containerRef}>
      <div className="flex-1 w-full h-full bg-[#1E1E1E] rounded-lg overflow-hidden relative p-8">
        
        {/* Target Area Outline */}
        <div 
          className="absolute border-4 border-dashed border-gray-600 rounded-lg"
          style={{ 
            width: a + b + 8, // +8 for border width
            height: a + b + 8,
            left: 50,
            top: 50
          }}
        >
          <div className="absolute -top-8 left-0 text-gray-400 font-bold">(a + b)²</div>
        </div>

        {/* Draggable Blocks */}
        <motion.div
          drag={!isCompleted}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd('a2', info)}
          animate={{ x: positions.a2.x, y: positions.a2.y }}
          className="absolute bg-[#FF6B00] flex items-center justify-center text-white font-bold text-xl rounded shadow-lg cursor-grab active:cursor-grabbing"
          style={{ width: a, height: a }}
        >
          a²
        </motion.div>

        <motion.div
          drag={!isCompleted}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd('ab1', info)}
          animate={{ x: positions.ab1.x, y: positions.ab1.y }}
          className="absolute bg-[#00E5FF] flex items-center justify-center text-white font-bold text-xl rounded shadow-lg cursor-grab active:cursor-grabbing"
          style={{ width: b, height: a }}
        >
          ab
        </motion.div>

        <motion.div
          drag={!isCompleted}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd('ab2', info)}
          animate={{ x: positions.ab2.x, y: positions.ab2.y }}
          className="absolute bg-[#00E5FF] flex items-center justify-center text-white font-bold text-xl rounded shadow-lg cursor-grab active:cursor-grabbing"
          style={{ width: a, height: b }}
        >
          ab
        </motion.div>

        <motion.div
          drag={!isCompleted}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd('b2', info)}
          animate={{ x: positions.b2.x, y: positions.b2.y }}
          className="absolute bg-[#FFD700] flex items-center justify-center text-black font-bold text-xl rounded shadow-lg cursor-grab active:cursor-grabbing"
          style={{ width: b, height: b }}
        >
          b²
        </motion.div>

      </div>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-[80%] max-w-md flex flex-col items-center gap-4 shadow-2xl">
        <h3 className="text-white font-bold text-lg">(a + b)² = a² + 2ab + b²</h3>
        <p className="text-gray-400 text-sm text-center">
          Parçaları sürükleyerek büyük kareyi oluşturun.
        </p>
        
        {isCompleted && (
          <div className="w-full py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-center text-green-400 font-bold animate-pulse">
            Tebrikler! Özdeşliği ispatladınız.
          </div>
        )}
      </div>
    </div>
  );
}
