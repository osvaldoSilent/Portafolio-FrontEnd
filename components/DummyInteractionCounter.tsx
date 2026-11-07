// components/DummyInteractionCounter.tsx
"use client";

import { useEffect, useState } from "react";
import { DUMMY_TELEMETRY_EVENT } from "../infrastructure/adapters/dummy-telemetry.adapter";

interface DummyInteractionCounterProps {
  initialCount?: number;
}

export default function DummyInteractionCounter({
  initialCount = 0,
}: DummyInteractionCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        setCount(customEvent.detail);
      } else {
        setCount((prev) => prev + 1);
      }
    };

    window.addEventListener(DUMMY_TELEMETRY_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(DUMMY_TELEMETRY_EVENT, handleUpdate);
    };
  }, []);

  return (
    <span className="text-3xl font-mono font-bold text-zinc-300">
      {count}
    </span>
  );
}

