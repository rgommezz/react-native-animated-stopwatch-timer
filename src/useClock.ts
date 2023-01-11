import { useRef, useState } from 'react';

const useClock = () => {
  const [countInHundredthMs, setCountInHundredthMs] = useState(0);
  const intervalId = useRef<NodeJS.Timer | null>(null);

  function startClock() {
    intervalId.current = setInterval(() => {
      setCountInHundredthMs((prev) => prev + 1);
    }, 100);
  }

  function stopClock() {
    setCountInHundredthMs(0);
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  }

  const countInSeconds = Math.floor(countInHundredthMs / 10);

  return {
    hundredthMs: countInHundredthMs % 10,
    lastDigit: countInSeconds % 10,
    tens: Math.floor(countInSeconds / 10) % 6,
    minutes: Math.floor(countInSeconds / 60),
    start: startClock,
    stop: stopClock,
  };
};

export default useClock;
