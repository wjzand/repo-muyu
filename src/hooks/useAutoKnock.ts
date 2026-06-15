import { useEffect, useRef } from 'react';

export function useAutoKnock(
  enabled: boolean,
  speed: number,
  callback: () => void
) {
  const intervalRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (enabled) {
      intervalRef.current = window.setInterval(() => {
        callbackRef.current();
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, speed]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (!document.hidden && enabled && !intervalRef.current) {
        intervalRef.current = window.setInterval(() => {
          callbackRef.current();
        }, speed);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [enabled, speed]);
}
