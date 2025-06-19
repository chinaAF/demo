'use client';

import { useEffect, useRef, useState } from 'react';

const FPSCounter = () => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const updateFPS = () => {
      frameCount.current++;
      const now = performance.now();

      // 每秒更新一次FPS数值
      if (now - lastTimeRef.current >= 1000) {
        setFps(Math.round(frameCount.current * 1000 / (now - lastTimeRef.current)));
        frameCount.current = 0;
        lastTimeRef.current = now;
      }

      animationRef.current = requestAnimationFrame(updateFPS);
    };

    animationRef.current = requestAnimationFrame(updateFPS);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 bg-black bg-opacity-70 text-green-500 p-2 font-mono text-sm z-50">
      {fps} FPS
    </div>
  );
};

export default FPSCounter;