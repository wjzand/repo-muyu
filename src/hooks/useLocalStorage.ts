import { useState, useEffect } from 'react';
import { safeGetItem, safeSetItem } from '@/utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => safeGetItem(key, initialValue));

  useEffect(() => {
    safeSetItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
