import React, { useEffect, useRef, useState } from 'react';

export default function LaserDefenseSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mirrorAngle, setMirrorAngle] = useState(45); // Degrees
  const [isHit, setIsHit] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Positions
      const laserSource = { x: 50, y: height / 2 };
      const mirrorCenter = { x: width / 2, y: height / 2 };
      const target = { x: width / 2, y: 50 };
      const targetRadius = 30;

      // 1. Draw Laser Source
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(laserSource.x - 10, laserSource.y - 10, 20, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.fillText('Lazer', laserSource.x - 15, laserSource.y + 25);

      // 2. Draw Target
      ctx.beginPath();
      ctx.arc(target.x, target.y, targetRadius, 0, Math.PI * 2);
      ctx.fillStyle = isHit ? '#00FF00' : '#333333';
      ctx.fill();
      ctx.strokeStyle = isHit ? '#00FF00' : '#555555';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Hedef', target.x - 15, target.y - 40);

      // 3. Draw Mirror
      const mirrorLength = 100;
      const angleRad = (mirrorAngle * Math.PI) / 180;
      
      ctx.save();
      ctx.translate(mirrorCenter.x, mirrorCenter.y);
      ctx.rotate(angleRad);
      
      // Mirror body
      ctx.fillStyle = '#00E5FF';
      ctx.fillRect(-mirrorLength / 2, -5, mirrorLength, 10);
      
      // Mirror normal (perpendicular line)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -40);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.restore();

      // 4. Calculate Laser Path
      // Incident ray: from source to mirror
      const incidentVector = { x: mirrorCenter.x - laserSource.x, y: mirrorCenter.y - laserSource.y };
      const incidentAngle = Math.atan2(incidentVector.y, incidentVector.x); // Should be 0 since they are on same y

      // Normal angle is mirrorAngle - 90 degrees (pointing "up" relative to mirror)
      const normalAngle = angleRad - Math.PI / 2;

      // Reflection angle: r = 2 * normal - incident - PI
      // Simpler: incoming angle relative to normal is (incidentAngle - normalAngle).
      // Reflected angle relative to normal is -(incidentAngle - normalAngle).
      // Absolute reflected angle = normalAngle - (incidentAngle - normalAngle) + PI
      
      // Actually, standard reflection formula for vector: R = I - 2(I.N)N
      const nx = Math.cos(normalAngle);
      const ny = Math.sin(normalAngle);
      
      // Normalize incident
      const magI = Math.sqrt(incidentVector.x**2 + incidentVector.y**2);
      const ix = incidentVector.x / magI;
      const iy = incidentVector.y / magI;

      const dotProduct = ix * nx + iy * ny;
      
      const rx = ix - 2 * dotProduct * nx;
      const ry = iy - 2 * dotProduct * ny;

      // Ray endpoint (extend far away)
      const rayLength = 1000;
      const endPoint = {
        x: mirrorCenter.x + rx * rayLength,
        y: mirrorCenter.y + ry * rayLength
      };

      // Check intersection with target
      // Distance from point (target) to line (mirrorCenter -> endPoint)
      const distToLine = Math.abs((ry * target.x) - (rx * target.y) + (mirrorCenter.x * endPoint.y) - (endPoint.x * mirrorCenter.y)) / Math.sqrt(ry**2 + rx**2);
      
      // Also check if the ray is actually going towards the target (dot product > 0)
      const toTargetX = target.x - mirrorCenter.x;
      const toTargetY = target.y - mirrorCenter.y;
      const isGoingTowards = (rx * toTargetX + ry * toTargetY) > 0;

      const hit = isGoingTowards && distToLine < targetRadius;
      
      if (hit !== isHit) {
        setIsHit(hit);
      }

      // Draw Incident Ray
      ctx.beginPath();
      ctx.moveTo(laserSource.x, laserSource.y);
      ctx.lineTo(mirrorCenter.x, mirrorCenter.y);
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Reflected Ray
      ctx.beginPath();
      ctx.moveTo(mirrorCenter.x, mirrorCenter.y);
      
      if (hit) {
        // Stop at target
        // Calculate exact intersection point (simplified)
        ctx.lineTo(target.x, target.y);
      } else {
        ctx.lineTo(endPoint.x, endPoint.y);
      }
      
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Angles Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      
      // Calculate angles in degrees for display
      // Incident angle relative to normal
      let angleIncDeg = Math.abs((incidentAngle - normalAngle) * 180 / Math.PI);
      if (angleIncDeg > 90) angleIncDeg = 180 - angleIncDeg;
      
      ctx.fillText(`Geliş Açısı: ${Math.round(angleIncDeg)}°`, 20, 30);
      ctx.fillText(`Yansıma Açısı: ${Math.round(angleIncDeg)}°`, 20, 50);
      ctx.fillText(`Ayna Açısı: ${mirrorAngle}°`, 20, 70);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial draw

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mirrorAngle, isHit]);

  return (
    <div className="w-full h-full flex flex-col relative" ref={containerRef}>
      <canvas ref={canvasRef} className="flex-1 w-full h-full bg-[#1E1E1E] rounded-lg" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-[80%] max-w-md flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm font-bold text-white tracking-wide uppercase flex justify-between">
            <span>Ayna Açısı</span>
            <span className="text-[#00E5FF]">{mirrorAngle}°</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="180" 
            step="1" 
            value={mirrorAngle}
            onChange={(e) => setMirrorAngle(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
          />
        </div>
        
        {isHit && (
          <div className="w-full py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-center text-green-400 font-bold animate-pulse">
            Hedef Vuruldu!
          </div>
        )}
      </div>
    </div>
  );
}
