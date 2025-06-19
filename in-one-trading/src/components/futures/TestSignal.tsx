'use client';

import { FC } from "react";
import { useSignalStore } from "../../store/useFuturesStoreSignal";
import { Button } from "antd";

const Test1: FC = () => {

  const { age, increaseAge, decreaseAge, resetAge, name, setName } = useSignalStore();

  return (
    <div>
      <h1 className="my-[20px] text-[20px] font-bold">Signal</h1>
      <p className="mb-[10px]">Age: {age}</p>
      <p className="flex justify-start items-center gap-2">
        <Button type="primary" onClick={increaseAge}>Increase Age</Button>
        <Button type="primary" onClick={decreaseAge}>Decrease Age</Button>
        <Button type="primary" onClick={resetAge}>Reset Age</Button>
      </p>
      <p className="mb-[10px]">Name: {name}</p>
      <p className="flex justify-start items-center gap-2">
        <input
          type="text"
          value={name as unknown as string}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border border-gray-300 rounded p-2"
        />
      </p>
    </div>
  )
}

export default Test1;