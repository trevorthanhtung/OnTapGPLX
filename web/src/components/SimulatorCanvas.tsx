import React, { useEffect, useRef } from 'react';
import type { SimulationScenario } from '../types';

interface SimulatorCanvasProps {
  scenario: SimulationScenario;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  flagTime: number | null;
  isFinished: boolean;
  onSpacePress: () => void;
}

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  scenario,
  currentTime,
  isPlaying,
  flagTime,
  onSpacePress
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let roadOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const horizonY = height * 0.42;
      const centerX = width / 2;

      // 1. SKY GRADIENT (per chapter)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      if (scenario.chapter === 4) {
        // Foggy / Mountain rain
        skyGrad.addColorStop(0, '#334155');
        skyGrad.addColorStop(1, '#64748b');
      } else if (scenario.chapter === 3) {
        // Highway dusk/sunset
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.7, '#1e293b');
        skyGrad.addColorStop(1, '#334155');
      } else {
        // Standard daylight / city
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.7, '#38bdf8');
        skyGrad.addColorStop(1, '#bae6fd');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Distant mountains / skyline
      ctx.fillStyle = scenario.chapter === 4 ? '#475569' : '#0369a1';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = 0; x <= width; x += 80) {
        const peak = horizonY - 15 - Math.sin((x + 100) * 0.01) * 20;
        ctx.lineTo(x, peak);
      }
      ctx.lineTo(width, horizonY);
      ctx.closePath();
      ctx.fill();

      // 2. GROUND / TERRAIN
      ctx.fillStyle = scenario.chapter === 4 ? '#1e293b' : '#15803d'; // Green verge or dark rock
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // 3. ROAD (Asphalt trapezoid)
      const roadTopWidth = width * 0.12;
      const roadBottomWidth = width * 0.95;

      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      roadGrad.addColorStop(0, '#334155');
      roadGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - roadTopWidth / 2, horizonY);
      ctx.lineTo(centerX + roadTopWidth / 2, horizonY);
      ctx.lineTo(centerX + roadBottomWidth / 2, height);
      ctx.lineTo(centerX - roadBottomWidth / 2, height);
      ctx.closePath();
      ctx.fill();

      // Road Curbs / Sidelines (White)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - roadTopWidth / 2, horizonY);
      ctx.lineTo(centerX - roadBottomWidth / 2, height);
      ctx.moveTo(centerX + roadTopWidth / 2, horizonY);
      ctx.lineTo(centerX + roadBottomWidth / 2, height);
      ctx.stroke();

      // 4. ANIMATED CENTER DASHED LINES
      if (isPlaying) {
        roadOffset = (roadOffset + 0.018) % 1;
      }

      ctx.strokeStyle = '#facc15'; // Yellow dashed line
      ctx.lineWidth = 4;

      const numDashes = 10;
      for (let i = 0; i < numDashes; i++) {
        const p1 = (i + roadOffset) / numDashes;
        const p2 = (i + roadOffset + 0.5) / numDashes;
        if (p1 >= 1) continue;

        const y1 = horizonY + Math.pow(p1, 2.2) * (height - horizonY);
        const y2 = horizonY + Math.pow(Math.min(1, p2), 2.2) * (height - horizonY);

        ctx.beginPath();
        ctx.moveTo(centerX, y1);
        ctx.lineTo(centerX, y2);
        ctx.stroke();
      }

      // 5. DANGER SITUATION TRIGGER (HAZARD OBSTACLE IN PERSPECTIVE)
      const timeStart5 = scenario.timeStart5 || scenario.timeDirect || 7;
      const timeEnd5 = scenario.timeEnd5 || timeStart5 + 0.6;
      const timeEnd1 = scenario.timeEnd1 || timeStart5 + 2.8;
      const isApproaching = currentTime >= timeStart5 - 2.5 && currentTime < timeStart5;
      const isInGoldenZone = currentTime >= timeStart5 && currentTime <= timeEnd5;
      const isInDecayZone = currentTime > timeEnd5 && currentTime <= timeEnd1;
      const isPastHazard = currentTime > timeEnd1;

      if (isApproaching || isInGoldenZone || isInDecayZone) {
        // Normalized progress of danger approaching player (0 = far horizon, 1 = immediate collision point)
        const progress = Math.min(1, Math.max(0, (currentTime - (timeStart5 - 2.5)) / (timeEnd1 - (timeStart5 - 2.5) + 1.0)));
        const hazardY = horizonY + Math.pow(progress, 2.0) * (height * 0.45);
        const hazardScale = 0.3 + progress * 1.4;

        // Obstacle (e.g. Vehicle rear or pedestrian crossing)
        const obsX = centerX + Math.sin(currentTime * 2) * (progress * 40);

        ctx.save();
        ctx.translate(obsX, hazardY);
        ctx.scale(hazardScale, hazardScale);

        // Vehicle back body
        ctx.fillStyle = '#dc2626'; // Red brake lights car
        ctx.beginPath();
        ctx.roundRect(-40, -35, 80, 50, 8);
        ctx.fill();

        // Car Roof / Windows
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(-30, -50, 60, 25, 4);
        ctx.fill();

        // Brake Lights glowing
        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = isInGoldenZone ? 25 : 10;
        ctx.beginPath();
        ctx.roundRect(-38, -25, 18, 12, 3);
        ctx.roundRect(20, -25, 18, 12, 3);
        ctx.fill();
        ctx.shadowBlur = 0;

        // License plate
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-16, -10, 32, 10);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NGUY HIỂM', 0, -3);

        ctx.restore();

        // Danger HUD Alert Banner on canvas
        if (isInGoldenZone) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.fillRect(width * 0.25, 20, width * 0.5, 40);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(width * 0.25, 20, width * 0.5, 40);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('THỜI ĐIỂM VÀNG (5 ĐIỂM) - BẤM SPACE NGAY!', centerX, 46);
        } else if (isInDecayZone) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
          ctx.fillRect(width * 0.3, 20, width * 0.4, 34);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Đang giảm dần điểm (4 - 1 điểm)', centerX, 42);
        }
      }

      // 6. CAR HOOD & STEERING COCKPIT (Foreground)
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(centerX, height - 70, width, height);
      ctx.fill();

      // 7. HUD TELEMETRY (SPEEDOMETER & CLOCK)
      // Speedometer
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(24, height - 90, 150, 68, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('TỐC ĐỘ XE', 36, height - 68);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px monospace';
      const speed = isPlaying && !isPastHazard ? 60 + Math.floor(Math.sin(currentTime * 3) * 3) : 0;
      ctx.fillText(`${speed} km/h`, 36, height - 42);

      // Timer Display
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(width - 174, height - 90, 150, 68, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('THỜI GIAN', width - 36, height - 68);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(`${currentTime.toFixed(2)}s`, width - 36, height - 42);

      // Red Flag indicator on Canvas
      if (flagTime !== null) {
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 110, height - 65, 220, 36, 8);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`ĐÃ CẮM CỜ: ${flagTime.toFixed(2)}s`, centerX, height - 42);
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [scenario, currentTime, isPlaying, flagTime]);

  return (
    <div
      onClick={onSpacePress}
      className="relative w-full aspect-video bg-slate-950 flex items-center justify-center cursor-pointer select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={1024}
        height={576}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  );
};

