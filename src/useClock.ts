import { useRef, useState } from 'react';

const useClock = () => {
  const [countInHundredthMs, setCountInHundredthMs] = useState(0);
  const intervalId = useRef<NodeJS.Timer | null>(null);

  function startClock() {
    if (intervalId.current) {
      return;
    }
    intervalId.current = setInterval(() => {
      setCountInHundredthMs((prev) => prev + 1);
    }, 100);
  }

  function clear() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }

  function pause() {
    clear();
  }

  function reset() {
    setCountInHundredthMs(0);
    clear();
  }

  const countInSeconds = Math.floor(countInHundredthMs / 10);

  return {
    hundredthMs: countInHundredthMs % 10,
    lastDigit: countInSeconds % 10,
    tens: Math.floor(countInSeconds / 10) % 6,
    minutes: Math.floor(countInSeconds / 60),
    start: startClock,
    pause,
    reset,
  };
};

export default useClock;
