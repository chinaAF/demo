'use client';

import { useEffect, useState } from 'react';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

const MemoryMonitor = () => {
  const [memory, setMemory] = useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  });

  useEffect(() => {
    // 注意：performance.memory 是非标准API，主要在Chrome中支持

    const updateMemory = () => {
      if (
        typeof window !== 'undefined' &&
        window.performance &&
        (window.performance as Performance & { memory?: PerformanceMemory }).memory
      ) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } =
          (window.performance as Performance & { memory: PerformanceMemory }).memory;

        setMemory({
          usedJSHeapSize: Math.round(usedJSHeapSize / (1024 * 1024)),
          totalJSHeapSize: Math.round(totalJSHeapSize / (1024 * 1024)),
          jsHeapSizeLimit: Math.round(jsHeapSizeLimit / (1024 * 1024))
        });
      }
    };

    updateMemory();
    const intervalId = setInterval(updateMemory, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed top-10 right-0 bg-black bg-opacity-70 text-green-500 p-2 font-mono text-sm z-50">
      <div>已用内存: {memory.usedJSHeapSize} MB</div>
      <div>总分配: {memory.totalJSHeapSize} MB</div>
      <div>内存上限: {memory.jsHeapSizeLimit} MB</div>
    </div>
  );
};

export default MemoryMonitor;