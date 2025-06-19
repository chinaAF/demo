'use client';

import { useEffect, useRef, useState } from 'react';

const CPULoadIndicator = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameDuration: 0,
    cpuEstimate: 0
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const frames = useRef<number[]>([]);

  useEffect(() => {
    let animationId: number;

    const measure = (timestamp: number) => {
      // 计算FPS
      frameCount.current++;
      const elapsed = timestamp - lastTime.current;

      // 记录帧间隔
      if (frames.current.length > 30) frames.current.shift();
      frames.current.push(elapsed);

      // 每秒更新一次
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / elapsed);
        const avgFrame = frames.current.reduce((sum, val) => sum + val, 0) / frames.current.length;

        // CPU负载估算: 16.7ms是60fps的帧时间，计算占用比例
        // 这是一个非常粗略的估计!
        const cpuEstimate = Math.min(100, Math.round((avgFrame / 16.7) * 100));

        setMetrics({
          fps,
          frameDuration: Math.round(avgFrame * 10) / 10,
          cpuEstimate
        });

        frameCount.current = 0;
        lastTime.current = timestamp;
      }

      animationId = requestAnimationFrame(measure);
    };

    animationId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="fixed top-60 right-0 bg-black bg-opacity-70 text-blue-500 p-2 font-mono text-sm z-50">
      <div>FPS: {metrics.fps}</div>
      <div>帧耗时: {metrics.frameDuration}ms</div>
      <div>CPU负载估算: {metrics.cpuEstimate}%</div>
    </div>
  );
};

export default CPULoadIndicator;