import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function PythagorasSimulation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [isReleased, setIsReleased] = useState(false);
  const gatesRef = useRef<Matter.Body[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Wait a brief moment for container to have dimensions
    const initTimer = setTimeout(() => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      // module aliases
      const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

      // create an engine
      const engine = Engine.create();
      engineRef.current = engine;

      // create a renderer
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
      const cx = width / 2;
      const cy = height / 2 + 50; // Shift down slightly
      const scale = Math.min(width, height) / 600; // Responsive scaling

      // Triangle dimensions (a=3, b=4, c=5 ratio)
      const a = 120 * scale; // vertical
      const b = 160 * scale; // horizontal
      const c = 200 * scale; // hypotenuse
      const wallThickness = 10;

      const wallOptions = { 
        isStatic: true, 
        render: { fillStyle: '#333', strokeStyle: '#555', lineWidth: 1 },
        friction: 0.0,
        restitution: 0.2
      };
      
      const gateOptions = { 
        isStatic: true, 
        render: { fillStyle: '#FF6B00' } 
      };

      // Right angle vertex is at (cx - b/2, cy - a/2)
      // Top vertex is at (cx - b/2, cy + a/2) -> wait, let's make right angle bottom-left
      const pRightAngle = { x: cx - b/2, y: cy };
      const pTop = { x: cx - b/2, y: cy - a };
      const pRight = { x: cx + b/2, y: cy };

      // 1. Central Triangle (Just walls)
      const tLeft = Bodies.rectangle(pRightAngle.x, cy - a/2, wallThickness, a, wallOptions);
      const tBottom = Bodies.rectangle(cx, pRightAngle.y, b, wallThickness, wallOptions);
      
      // Hypotenuse
      const angle = Math.atan2(a, b); // Angle of hypotenuse
      const tHypot = Bodies.rectangle(cx, cy - a/2, c, wallThickness, {
        isStatic: true,
        angle: -angle,
        render: { fillStyle: '#333' }
      });

      // 2. Square A (Left of vertical leg)
      // Side length = a
      const sqA_left = Bodies.rectangle(pRightAngle.x - a, cy - a/2, wallThickness, a, wallOptions);
      const sqA_top = Bodies.rectangle(pRightAngle.x - a/2, pTop.y, a, wallThickness, wallOptions);
      const sqA_bottom = Bodies.rectangle(pRightAngle.x - a/2, pRightAngle.y, a, wallThickness, wallOptions);
      // The gate is the right wall of Square A (which is also the left wall of the triangle)
      const gateA = Bodies.rectangle(pRightAngle.x, cy - a/2, wallThickness, a - 20, gateOptions);

      // 3. Square B (Top of horizontal leg)
      // Side length = b
      const sqB_left = Bodies.rectangle(pTop.x, pTop.y - b/2, wallThickness, b, wallOptions);
      const sqB_right = Bodies.rectangle(pRight.x, pTop.y - b/2, wallThickness, b, wallOptions);
      const sqB_top = Bodies.rectangle(cx, pTop.y - b, b, wallThickness, wallOptions);
      // The gate is the bottom wall of Square B (which is also the top of the triangle... wait, no)
      // Let's attach Square B to the horizontal leg (bottom of triangle)
      // Actually, standard visual is: A on vertical, B on horizontal, C on hypotenuse.
      // Let's move Square B to the bottom of the horizontal leg.
      const sqB_bottom_y = pRightAngle.y + b;
      const sqB_left2 = Bodies.rectangle(pRightAngle.x, pRightAngle.y + b/2, wallThickness, b, wallOptions);
      const sqB_right2 = Bodies.rectangle(pRight.x, pRightAngle.y + b/2, wallThickness, b, wallOptions);
      const sqB_bottom2 = Bodies.rectangle(cx, sqB_bottom_y, b, wallThickness, wallOptions);
      const gateB = Bodies.rectangle(cx, pRightAngle.y, b - 20, wallThickness, gateOptions);

      // 4. Square C (On hypotenuse)
      // Side length = c
      const hx = Math.sin(angle);
      const hy = Math.cos(angle);
      
      // Calculate normal vector to hypotenuse
      const nx = Math.sin(angle);
      const ny = Math.cos(angle);

      // Center of hypotenuse is (cx, cy - a/2)
      // Center of Square C is offset by c/2 along the normal
      const sqC_cx = cx + (c/2) * nx;
      const sqC_cy = (cy - a/2) - (c/2) * ny;

      // Create Square C using a single hollow body or 3 walls
      const sqC_top = Bodies.rectangle(sqC_cx + (c/2)*nx, sqC_cy - (c/2)*ny, c, wallThickness, { isStatic: true, angle: -angle, render: { fillStyle: '#333' } });
      const sqC_left3 = Bodies.rectangle(sqC_cx - (c/2)*Math.cos(angle), sqC_cy - (c/2)*Math.sin(angle), wallThickness, c, { isStatic: true, angle: -angle, render: { fillStyle: '#333' } });
      const sqC_right3 = Bodies.rectangle(sqC_cx + (c/2)*Math.cos(angle), sqC_cy + (c/2)*Math.sin(angle), wallThickness, c, { isStatic: true, angle: -angle, render: { fillStyle: '#333' } });
      
      // Actually, building a perfect angled box is tricky with raw coordinates.
      // Let's use a simpler approach: build it flat, then rotate and translate it.
      const boxC_bottom = Bodies.rectangle(0, c/2, c, wallThickness, wallOptions);
      const boxC_left = Bodies.rectangle(-c/2, 0, wallThickness, c, wallOptions);
      const boxC_right = Bodies.rectangle(c/2, 0, wallThickness, c, wallOptions);
      const boxC_top = Bodies.rectangle(0, -c/2, c, wallThickness, wallOptions); // The gate
      
      const squareC = Matter.Body.create({
        parts: [boxC_bottom, boxC_left, boxC_right],
        isStatic: true
      });
      
      // Position and rotate Square C to align with hypotenuse
      Matter.Body.setPosition(squareC, { x: sqC_cx, y: sqC_cy });
      Matter.Body.setAngle(squareC, -angle);

      // We need a gate for C too, or just let it fall in.
      // Actually, water falls FROM A and B, INTO C.
      // So C should be BELOW the triangle.
      // Let's flip the triangle so hypotenuse is at the bottom.
      
      // --- REVISED SIMPLER SCENE ---
      // To make gravity work naturally without complex funnels:
      // Triangle points DOWN. Hypotenuse is horizontal at the bottom.
      // Square A and B are on top.
      
      Engine.clear(engine);
      
      // Hypotenuse horizontal at bottom
      const triY = cy + 50;
      const tAngle = Math.asin(a/c); // Angle of triangle
      
      // Base (Hypotenuse)
      const base = Bodies.rectangle(cx, triY, c, wallThickness, wallOptions);
      
      // Left leg (b)
      const legLeftX = cx - c/2 + (b/2) * Math.cos(tAngle);
      const legLeftY = triY - (b/2) * Math.sin(tAngle);
      const legLeft = Bodies.rectangle(legLeftX, legLeftY, b, wallThickness, {
        isStatic: true, angle: tAngle, render: { fillStyle: '#555' }
      });
      
      // Right leg (a)
      const legRightX = cx + c/2 - (a/2) * Math.sin(tAngle);
      const legRightY = triY - (a/2) * Math.cos(tAngle);
      const legRight = Bodies.rectangle(legRightX, legRightY, a, wallThickness, {
        isStatic: true, angle: -(Math.PI/2 - tAngle), render: { fillStyle: '#555' }
      });

      // Square C (Below base)
      const sqC_l = Bodies.rectangle(cx - c/2, triY + c/2, wallThickness, c, wallOptions);
      const sqC_r = Bodies.rectangle(cx + c/2, triY + c/2, wallThickness, c, wallOptions);
      const sqC_b = Bodies.rectangle(cx, triY + c, c, wallThickness, wallOptions);

      // Square B (Above left leg)
      const sqB_cx = legLeftX - (b/2) * Math.sin(tAngle);
      const sqB_cy = legLeftY - (b/2) * Math.cos(tAngle);
      const sqB_box = Matter.Body.create({
        parts: [
          Bodies.rectangle(0, -b/2, b, wallThickness, wallOptions), // top
          Bodies.rectangle(-b/2, 0, wallThickness, b, wallOptions), // left
          Bodies.rectangle(b/2, 0, wallThickness, b, wallOptions),  // right
        ],
        isStatic: true
      });
      Matter.Body.setPosition(sqB_box, { x: sqB_cx, y: sqB_cy });
      Matter.Body.setAngle(sqB_box, tAngle);
      const gateB_new = Bodies.rectangle(legLeftX, legLeftY, b, wallThickness, gateOptions);
      Matter.Body.setAngle(gateB_new, tAngle);

      // Square A (Above right leg)
      const sqA_cx = legRightX + (a/2) * Math.cos(tAngle);
      const sqA_cy = legRightY - (a/2) * Math.sin(tAngle);
      const sqA_box = Matter.Body.create({
        parts: [
          Bodies.rectangle(0, -a/2, a, wallThickness, wallOptions), // top
          Bodies.rectangle(-a/2, 0, wallThickness, a, wallOptions), // left
          Bodies.rectangle(a/2, 0, wallThickness, a, wallOptions),  // right
        ],
        isStatic: true
      });
      Matter.Body.setPosition(sqA_box, { x: sqA_cx, y: sqA_cy });
      Matter.Body.setAngle(sqA_box, -(Math.PI/2 - tAngle));
      const gateA_new = Bodies.rectangle(legRightX, legRightY, a, wallThickness, gateOptions);
      Matter.Body.setAngle(gateA_new, -(Math.PI/2 - tAngle));

      gatesRef.current = [gateA_new, gateB_new];

      Composite.add(engine.world, [
        base, legLeft, legRight,
        sqC_l, sqC_r, sqC_b,
        sqB_box, gateB_new,
        sqA_box, gateA_new
      ]);

      // Fill Square A and B with "water" (small circles)
      const particleRadius = 4 * scale;
      const waterOptions = {
        restitution: 0.1,
        friction: 0.001,
        frictionAir: 0.01,
        density: 0.001,
        render: { fillStyle: '#00E5FF', strokeStyle: '#00B3CC', lineWidth: 1 }
      };

      const waterParticles: Matter.Body[] = [];
      
      // Calculate area to determine number of particles
      // A^2 + B^2 = C^2. 
      // Area A = a*a, Area B = b*b.
      // Particle area = PI * r^2
      // Packing fraction ~ 0.65 for circles
      const areaA = a * a;
      const numParticlesA = Math.floor((areaA * 0.5) / (Math.PI * particleRadius * particleRadius));
      
      const areaB = b * b;
      const numParticlesB = Math.floor((areaB * 0.5) / (Math.PI * particleRadius * particleRadius));

      // Spawn particles inside Square A
      for (let i = 0; i < numParticlesA; i++) {
        const px = sqA_cx + (Math.random() - 0.5) * (a - 20);
        const py = sqA_cy + (Math.random() - 0.5) * (a - 20);
        waterParticles.push(Bodies.circle(px, py, particleRadius, waterOptions));
      }

      // Spawn particles inside Square B
      for (let i = 0; i < numParticlesB; i++) {
        const px = sqB_cx + (Math.random() - 0.5) * (b - 20);
        const py = sqB_cy + (Math.random() - 0.5) * (b - 20);
        waterParticles.push(Bodies.circle(px, py, particleRadius, waterOptions));
      }

      Composite.add(engine.world, waterParticles);

      // run the renderer
      Render.run(render);

      // create runner
      const runner = Runner.create();
      Runner.run(runner, engine);

    }, 100); // 100ms delay to ensure container is sized

    return () => {
      clearTimeout(initTimer);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  const releaseWater = () => {
    if (!engineRef.current || isReleased) return;
    setIsReleased(true);
    
    // Remove the gates to let water fall
    Matter.Composite.remove(engineRef.current.world, gatesRef.current);
  };

  const resetSimulation = () => {
    window.location.reload();
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div ref={mountRef} className="flex-1 w-full h-full bg-[#1E1E1E] rounded-lg overflow-hidden" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 p-3 rounded-full backdrop-blur-sm border border-white/10">
        <button 
          onClick={releaseWater}
          disabled={isReleased}
          className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all ${
            isReleased ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-[#00E5FF] hover:bg-[#00B3CC] hover:scale-105 shadow-[#00E5FF]/20'
          }`}
        >
          {isReleased ? 'Su Boşaltıldı' : 'Suyu Boşalt'}
        </button>
        {isReleased && (
          <button 
            onClick={resetSimulation}
            className="px-8 py-3 rounded-full font-bold text-white bg-gray-700 hover:bg-gray-600 shadow-lg transition-all hover:scale-105"
          >
            Tekrarla
          </button>
        )}
      </div>
    </div>
  );
}
