export const STORAGE_KEYS = {
  USER: 'cyber_woodenfish_user',
  SETTINGS: 'cyber_woodenfish_settings',
  CUSTOM_SCRIPTURES: 'cyber_woodenfish_custom_scriptures',
};

export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn('Failed to remove from localStorage');
  }
}
