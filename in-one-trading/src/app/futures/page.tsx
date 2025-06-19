import { FC } from "react";
import TestZustand from "../../components/futures/TestZustand";
import TestSignal from "../../components/futures/TestSignal";
import ShowFps from "../../components/common/FpsMonitor";
import MemoryMonitor from "../../components/common/MemoryMonitor";
import TaskMonitor from "../../components/common/TaskMonitor";


const FuturesPage: FC = () => {

  return (
    <div>
      <ShowFps />
      <MemoryMonitor />
      <TaskMonitor />
      <h1 className="mb-[20px]">Futures Page</h1>
      <div className="flex items-start gap-[100px]">
        <TestZustand />
        <TestSignal />
      </div>
    </div>
  );
}

export default FuturesPage;