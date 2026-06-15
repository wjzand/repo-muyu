import { Level } from '@/types';

export const LEVELS: Level[] = [
  {
    index: 0,
    title: '赛博小沙弥',
    minMerit: 0,
    maxMerit: 99,
    color: '#a855f7',
  },
  {
    index: 1,
    title: '代码比丘',
    minMerit: 100,
    maxMerit: 499,
    color: '#22d3ee',
  },
  {
    index: 2,
    title: '算法罗汉',
    minMerit: 500,
    maxMerit: 1999,
    color: '#ec4899',
  },
  {
    index: 3,
    title: '数据菩萨',
    minMerit: 2000,
    maxMerit: 9999,
    color: '#00ff88',
  },
  {
    index: 4,
    title: '全栈佛',
    minMerit: 10000,
    maxMerit: Infinity,
    color: '#ffd700',
  },
];

export const DAILY_MERIT_LIMIT = 1000;

export function getLevel(merit: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (merit >= LEVELS[i].minMerit) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getLevelProgress(merit: number): number {
  const level = getLevel(merit);
  if (level.maxMerit === Infinity) return 1;
  const range = level.maxMerit - level.minMerit;
  const current = merit - level.minMerit;
  return Math.min(1, Math.max(0, current / range));
}

export function checkLevelUp(currentMerit: number, currentLevel: number): Level | null {
  const nextLevel = LEVELS.find(l => l.index === currentLevel + 1);
  if (nextLevel && currentMerit >= nextLevel.minMerit) {
    return nextLevel;
  }
  return null;
}
