import { useRef, useState } from 'react';

/**
 * A custom hooks that handles the state for the stopwatch
 */
const useStopwatch = () => {
  const [elapsedInMs, setElapsedInMs] = useState(0);
  const startTime = useRef<number | null>(null);
  const pausedTime = useRef<number | null>(null);
  const intervalId = useRef<NodeJS.Timer | null>(null);

  const countInSeconds = Math.floor(elapsedInMs / 1000);

  function startClock() {
    if (intervalId.current) {
      return;
    }
    if (!startTime.current) {
      startTime.current = Date.now();
    }
    intervalId.current = setInterval(() => {
      if (!pausedTime.current) {
        setElapsedInMs(Date.now() - startTime.current!);
      } else {
        const elapsedSincePaused = Date.now() - pausedTime.current;
        startTime.current = startTime.current! + elapsedSincePaused;
        pausedTime.current = null;
      }
    }, 16);
  }

  function resetState() {
    setElapsedInMs(0);
    startTime.current = null;
    pausedTime.current = null;
  }

  function removeInterval() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }

  function pause() {
    removeInterval();
    if (pausedTime.current || elapsedInMs === 0) {
      return;
    }
    pausedTime.current = Date.now();
  }

  function reset() {
    removeInterval();
    resetState();
  }

  return {
    tensOfMs: Math.floor(elapsedInMs / 10) % 100,
    lastDigit: countInSeconds % 10,
    tens: Math.floor(countInSeconds / 10) % 6,
    minutes: Math.floor(countInSeconds / 60),
    start: startClock,
    pause,
    reset,
  };
};

export default useStopwatch;
