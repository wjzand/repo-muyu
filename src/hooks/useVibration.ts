import { useCallback } from 'react';

export function useVibration() {
  const vibrate = useCallback((pattern: number | number[] = 30) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn('Vibration not supported:', e);
      }
    }
  }, []);

  const isSupported = 'vibrate' in navigator;

  return { vibrate, isSupported };
}
