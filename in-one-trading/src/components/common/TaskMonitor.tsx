'use client';

import { useEffect, useState } from 'react';

const CPUMonitor = () => {
  const [cpuLoad, setCpuLoad] = useState({
    longTasks: 0,
    avgDuration: 0,
    lastTaskDuration: 0
  });

  useEffect(() => {
    // 只在支持PerformanceObserver的浏览器中运行
    if ('PerformanceObserver' in window) {
      let taskCount = 0;
      let totalDuration = 0;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          taskCount++;
          totalDuration += entry.duration;
        });

        if (entries.length > 0) {
          setCpuLoad({
            longTasks: taskCount,
            avgDuration: Math.round(totalDuration / taskCount),
            lastTaskDuration: Math.round(entries[entries.length - 1].duration)
          });
        }
      });

      try {
        // 监控长任务（超过50ms的任务）
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.error('不支持长任务监控', e);
      }

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="fixed top-30 right-0 bg-black bg-opacity-70 text-red-500 p-2 font-mono text-sm z-50">
      <div>长任务数: {cpuLoad.longTasks}</div>
      <div>平均持续: {cpuLoad.avgDuration} ms</div>
      <div>最近任务: {cpuLoad.lastTaskDuration} ms</div>
    </div>
  );
};

export default CPUMonitor;