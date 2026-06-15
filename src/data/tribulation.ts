import {
  TribulationDifficultyConfig,
  TribulationRankConfig,
  HeartDemonConfig,
  TribulationSkinFragment,
  GradeColor,
  TribulationRank,
} from '@/types';

export const TRIBULATION_DIFFICULTIES: TribulationDifficultyConfig[] = [
  {
    id: 'easy',
    name: '初劫',
    description: '入门渡劫，每日免费1次，适合新手修行者',
    duration: 30,
    targetKnocks: 100,
    costMerit: 0,
    freeDaily: 1,
    rewardMultiplier: 1,
    demonFrequency: 8,
    color: '#22d3ee',
  },
  {
    id: 'medium',
    name: '中劫',
    description: '消耗100功德挑战，心魔出现更频繁，奖励更丰厚',
    duration: 30,
    targetKnocks: 150,
    costMerit: 100,
    freeDaily: 0,
    rewardMultiplier: 2,
    demonFrequency: 5,
    color: '#a855f7',
  },
  {
    id: 'hard',
    name: '大劫',
    description: '消耗500功德挑战，心魔狂暴，需要极强反应力',
    duration: 30,
    targetKnocks: 200,
    costMerit: 500,
    freeDaily: 0,
    rewardMultiplier: 5,
    demonFrequency: 3,
    color: '#ec4899',
  },
];

export const TRIBULATION_RANKS: TribulationRankConfig[] = [
  { id: 'qi', name: '炼气小修', minScore: 0, color: '#94a3b8', icon: '☁️' },
  { id: 'zhuji', name: '筑基行者', minScore: 500, color: '#22d3ee', icon: '⚡' },
  { id: 'jindan', name: '金丹真人', minScore: 2000, color: '#ffd700', icon: '🔮' },
  { id: 'yuanying', name: '元婴道君', minScore: 5000, color: '#a855f7', icon: '💎' },
  { id: 'huashen', name: '化神天尊', minScore: 15000, color: '#ec4899', icon: '🌟' },
  { id: 'xianzun', name: '渡劫仙尊', minScore: 50000, color: '#00ff88', icon: '👑' },
];

export const HEART_DEMONS: HeartDemonConfig[] = [
  {
    id: 'barrage',
    name: '弹幕心魔',
    description: '大量经文弹幕漂过遮挡木鱼，需要双击木鱼清除',
    icon: '💬',
    color: '#ef4444',
    tip: '看到弹幕遮挡视线时，快速双击木鱼区域即可清除，不要被干扰节奏！',
  },
  {
    id: 'offset',
    name: '偏移心魔',
    description: '点击位置随机偏移，需要快速适应反应',
    icon: '🎯',
    color: '#f97316',
    tip: '保持敲击节奏，用余光感受偏移方向，点击时微调位置，不要慌乱！',
  },
  {
    id: 'reverse',
    name: '逆心咒',
    description: '出现"逆心咒"，此时不可敲击，需等待其消失',
    icon: '⛔',
    color: '#8b5cf6',
    tip: '看到全屏红色警告时立刻停手！此时敲击会被视为中断，耐心等待3秒即可。',
  },
  {
    id: 'sound',
    name: '幻音心魔',
    description: '音色突变刺耳，干扰你的专注力',
    icon: '🔊',
    color: '#06b6d4',
    tip: '点击右上角的幻音图标N次即可消除，或暂时关闭音效专注视觉节奏。',
  },
  {
    id: 'imp',
    name: '心魔小鬼',
    description: '小鬼在屏幕游走，快速点击消灭获取额外积分',
    icon: '👹',
    color: '#dc2626',
    tip: '小鬼是送分的！看到游走的小恶魔不要犹豫，立刻点它获得奖励积分。',
  },
  {
    id: 'shield',
    name: '护盾符',
    description: '幸运掉落护盾，点击获取，可抵挡一次心魔',
    icon: '🛡️',
    color: '#10b981',
    tip: '看到绿色护盾图标掉落时优先点击！获得后可免除下一次心魔干扰。',
  },
];

export const SKIN_FRAGMENTS: TribulationSkinFragment[] = [
  {
    id: 'thunder_wood',
    name: '雷劫木碎片',
    description: '集齐5块可合成"雷劫木鱼"皮肤',
    icon: '⚡',
    color: '#fbbf24',
    dropFromDifficulty: ['medium', 'hard'],
  },
  {
    id: 'demon_crystal',
    name: '心魔水晶',
    description: '集齐3块可合成"心魔水晶"皮肤',
    icon: '💜',
    color: '#a855f7',
    dropFromDifficulty: ['hard'],
  },
  {
    id: 'dragon_scale',
    name: '龙鳞碎片',
    description: '集齐10块可合成"龙神木鱼"限定皮肤',
    icon: '🐉',
    color: '#10b981',
    dropFromDifficulty: ['easy', 'medium', 'hard'],
  },
];

export const GRADE_COLORS: GradeColor = {
  S: '#ffd700',
  A: '#a855f7',
  B: '#22d3ee',
  C: '#10b981',
  D: '#ef4444',
};

export const GRADE_THRESHOLDS = {
  S: 0.95,
  A: 0.85,
  B: 0.7,
  C: 0.5,
};

export function getDifficultyById(id: string): TribulationDifficultyConfig | undefined {
  return TRIBULATION_DIFFICULTIES.find((d) => d.id === id);
}

export function getRankByScore(score: number): TribulationRankConfig {
  let current = TRIBULATION_RANKS[0];
  for (const rank of TRIBULATION_RANKS) {
    if (score >= rank.minScore) {
      current = rank;
    }
  }
  return current;
}

export function getHeartDemonById(id: string): HeartDemonConfig | undefined {
  return HEART_DEMONS.find((d) => d.id === id);
}

export function getFragmentById(id: string): TribulationSkinFragment | undefined {
  return SKIN_FRAGMENTS.find((f) => f.id === id);
}

export function calculateGrade(knocks: number, target: number, demonsResolved: number, demonsTotal: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  const knockRatio = Math.min(knocks / target, 1);
  const demonRatio = demonsTotal > 0 ? demonsResolved / demonsTotal : 1;
  const score = knockRatio * 0.7 + demonRatio * 0.3;

  if (score >= GRADE_THRESHOLDS.S) return 'S';
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  return 'D';
}

export function calculateReward(
  grade: 'S' | 'A' | 'B' | 'C' | 'D',
  difficulty: TribulationDifficultyConfig,
  consecutiveWins: number
): { merit: number; fragments: string[]; scoreBonus: number } {
  const baseMerit = difficulty.targetKnocks * difficulty.rewardMultiplier;
  const gradeMultiplier = {
    S: 2.5,
    A: 1.8,
    B: 1.3,
    C: 1.0,
    D: 0.3,
  }[grade];

  const consecutiveBonus = Math.min(consecutiveWins * 0.05, 0.5);
  const totalMerit = Math.round(baseMerit * gradeMultiplier * (1 + consecutiveBonus));

  const fragments: string[] = [];
  if (grade !== 'D') {
    for (const fragment of SKIN_FRAGMENTS) {
      if (fragment.dropFromDifficulty.includes(difficulty.id)) {
        const dropChance = {
          S: 0.6,
          A: 0.35,
          B: 0.15,
          C: 0.05,
          D: 0,
        }[grade];
        if (Math.random() < dropChance) {
          fragments.push(fragment.id);
        }
      }
    }
  }

  return {
    merit: totalMerit,
    fragments,
    scoreBonus: Math.round(totalMerit * 0.1),
  };
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const TRIBULATION_MOTTOS = [
  '渡过此劫，便是晴天',
  '心魔不灭，道心不稳',
  '一敲一念，渡劫飞升',
  '雷劫九重天，功德满人间',
  '心若磐石，万魔不侵',
  '敲碎心魔，成就真佛',
  '赛博渡劫，数字飞升',
];
