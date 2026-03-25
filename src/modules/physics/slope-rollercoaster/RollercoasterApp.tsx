import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function SlopeRollercoasterSimulation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [isReleased, setIsReleased] = useState(false);
  const [slopeHeight, setSlopeHeight] = useState(200); // Initial height of the slope
  
  // Store references to bodies we need to update
  const wagonRef = useRef<Matter.Body | null>(null);
  const slopeRef = useRef<Matter.Body | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const initTimer = setTimeout(() => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Events = Matter.Events;

      const engine = Engine.create();
      engineRef.current = engine;

      const render = Render.create({
        element: mountRef.current,
        engine: engine,
        options: {
          width,
          height,
          wireframes: false,
          background: '#1E1E1E',
          pixelRatio: window.devicePixelRatio
        }
      });
      renderRef.current = render;

      // --- SCENE SETUP ---
      const scale = Math.min(width, height) / 600;
      
      // Ground
      const ground = Bodies.rectangle(width / 2, height - 20, width, 40, { 
        isStatic: true,
        render: { fillStyle: '#333' }
      });

      // Target
      const targetX = width - 100 * scale;
      const targetY = height - 60;
      const target = Bodies.rectangle(targetX, targetY, 80 * scale, 40, {
        isStatic: true,
        isSensor: true, // Don't collide, just detect
        label: 'target',
        render: { fillStyle: '#00E5FF', opacity: 0.5 }
      });

      // Slope parameters
      const startX = 100 * scale;
      const endX = width / 2;
      const endY = height - 40;
      
      // Create slope
      const slopeLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - (height - slopeHeight), 2));
      const slopeAngle = Math.atan2(endY - (height - slopeHeight), endX - startX);
      const slopeCx = startX + (endX - startX) / 2;
      const slopeCy = (height - slopeHeight) + (endY - (height - slopeHeight)) / 2;

      const slope = Bodies.rectangle(slopeCx, slopeCy, slopeLength, 20, {
        isStatic: true,
        angle: slopeAngle,
        friction: 0.001,
        render: { fillStyle: '#FF6B00' }
      });
      slopeRef.current = slope;

      // Wagon (Ball)
      const wagonRadius = 20 * scale;
      startPosRef.current = { 
        x: startX, 
        y: height - slopeHeight - wagonRadius - 20 
      };
      
      const wagon = Bodies.circle(startPosRef.current.x, startPosRef.current.y, wagonRadius, {
        restitution: 0.5,
        friction: 0.001,
        density: 0.05,
        isStatic: true, // Hold it until released
        label: 'wagon',
        render: { fillStyle: '#FFFFFF' }
      });
      wagonRef.current = wagon;

      Composite.add(engine.world, [ground, target, slope, wagon]);

      // Collision detection for target
      Events.on(engine, 'collisionStart', (event) => {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
          const bodyA = pairs[i].bodyA;
          const bodyB = pairs[i].bodyB;

          if ((bodyA.label === 'wagon' && bodyB.label === 'target') ||
              (bodyB.label === 'wagon' && bodyA.label === 'target')) {
            // Reached target!
            bodyB.render.fillStyle = '#00FF00';
            bodyA.render.fillStyle = '#00FF00';
          }
        }
      });

      Render.run(render);
      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, engine);

    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) renderRef.current.canvas.remove();
      }
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  // Update slope when height changes
  useEffect(() => {
    if (!engineRef.current || !slopeRef.current || !wagonRef.current || !mountRef.current) return;
    if (isReleased) return; // Don't change slope while running

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scale = Math.min(width, height) / 600;

    const startX = 100 * scale;
    const endX = width / 2;
    const endY = height - 40;
    
    const slopeLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - (height - slopeHeight), 2));
    const slopeAngle = Math.atan2(endY - (height - slopeHeight), endX - startX);
    const slopeCx = startX + (endX - startX) / 2;
    const slopeCy = (height - slopeHeight) + (endY - (height - slopeHeight)) / 2;

    // We need to recreate the slope body to change its dimensions easily in Matter.js
    Matter.Composite.remove(engineRef.current.world, slopeRef.current);
    
    const newSlope = Matter.Bodies.rectangle(slopeCx, slopeCy, slopeLength, 20, {
      isStatic: true,
      angle: slopeAngle,
      friction: 0.001,
      render: { fillStyle: '#FF6B00' }
    });
    slopeRef.current = newSlope;
    Matter.Composite.add(engineRef.current.world, newSlope);

    // Update wagon position
    const wagonRadius = 20 * scale;
    startPosRef.current = { 
      x: startX, 
      y: height - slopeHeight - wagonRadius - 20 
    };
    Matter.Body.setPosition(wagonRef.current, startPosRef.current);
    Matter.Body.setVelocity(wagonRef.current, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(wagonRef.current, 0);

  }, [slopeHeight, isReleased]);

  const releaseWagon = () => {
    if (!wagonRef.current || isReleased) return;
    setIsReleased(true);
    Matter.Body.setStatic(wagonRef.current, false);
  };

  const resetSimulation = () => {
    if (!wagonRef.current) return;
    setIsReleased(false);
    Matter.Body.setStatic(wagonRef.current, true);
    Matter.Body.setPosition(wagonRef.current, startPosRef.current);
    Matter.Body.setVelocity(wagonRef.current, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(wagonRef.current, 0);
    
    // Reset target color
    if (engineRef.current) {
      const target = engineRef.current.world.bodies.find(b => b.label === 'target');
      if (target) {
        target.render.fillStyle = '#00E5FF';
      }
      if (wagonRef.current) {
        wagonRef.current.render.fillStyle = '#FFFFFF';
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div ref={mountRef} className="flex-1 w-full h-full bg-[#1E1E1E] rounded-lg overflow-hidden" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-[80%] max-w-md flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm font-bold text-white tracking-wide uppercase flex justify-between">
            <span>Eğim Yüksekliği (y)</span>
            <span className="text-[#FF6B00]">{slopeHeight}px</span>
          </label>
          <input 
            type="range" 
            min="50" 
            max="400" 
            step="10" 
            value={slopeHeight}
            onChange={(e) => setSlopeHeight(parseInt(e.target.value))}
            disabled={isReleased}
            className={`w-full h-2 bg-gray-700 rounded-lg appearance-none accent-[#FF6B00] ${isReleased ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          />
        </div>

        <div className="flex gap-4 w-full mt-2">
          <button 
            onClick={releaseWagon}
            disabled={isReleased}
            className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              isReleased ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-[#00E5FF] hover:bg-[#00B3CC] hover:scale-105 shadow-[#00E5FF]/20'
            }`}
          >
            {isReleased ? 'Hareket Halinde' : 'Vagonu Bırak'}
          </button>
          {isReleased && (
            <button 
              onClick={resetSimulation}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-gray-700 hover:bg-gray-600 shadow-lg transition-all hover:scale-105"
            >
              Tekrarla
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
