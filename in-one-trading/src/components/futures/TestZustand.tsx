'use client';

import { FC } from "react";
import { useFuturesStoreZustand } from "../../store/useFuturesStoreZustand";
import { Button } from "antd";

const TestZustand: FC = () => {

  const { age, increaseAge, decreaseAge, resetAge, name, setName } = useFuturesStoreZustand();

  return (
    <div>
      <h1 className="my-[20px] text-[20px] font-bold">Zustand</h1>
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border border-gray-300 rounded p-2"
        />
      </p>
    </div>
  )
}

export default TestZustand;