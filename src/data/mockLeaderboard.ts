import { LeaderboardItem } from '@/types';

const MOCK_NAMES = [
  '智障禅师',
  '代码上人',
  'BUG终结者',
  '996囚徒',
  '发量王者',
  '需求粉碎机',
  '摸鱼大师',
  '赛博佛陀',
  '全栈狂魔',
  '算法达摩',
  '通宵菩萨',
  '加班金刚',
  '奶茶罗汉',
  'Debug仙人',
  '键盘侠',
  'API战士',
  '回归测试官',
  '产品天敌',
  '代码诗人',
  '重构狂魔',
];

function generateMockList(count: number, baseMerit: number): LeaderboardItem[] {
  const list: LeaderboardItem[] = [];
  for (let i = 0; i < count; i++) {
    const merit = Math.floor(baseMerit * (1 - i * 0.08) + Math.random() * baseMerit * 0.1);
    list.push({
      rank: i + 1,
      userId: `mock_user_${i}`,
      cyberName: MOCK_NAMES[i % MOCK_NAMES.length],
      avatarSeed: Math.floor(Math.random() * 1000),
      merit: Math.max(1, merit),
      level: merit >= 10000 ? 4 : merit >= 2000 ? 3 : merit >= 500 ? 2 : merit >= 100 ? 1 : 0,
    });
  }
  return list;
}

export const MOCK_LEADERBOARD = {
  daily: generateMockList(20, 800),
  weekly: generateMockList(20, 5000),
  total: generateMockList(20, 50000),
};

export type LeaderboardType = 'daily' | 'weekly' | 'total';
