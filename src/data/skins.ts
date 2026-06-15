import { Skin } from '@/types';

export const SKINS: Skin[] = [
  {
    id: 'wood',
    name: '原初木鱼',
    description: '经典木纹木鱼，回归本源',
    unlockCondition: { type: 'merit', value: 0 },
    colors: {
      primary: '#8B4513',
      secondary: '#D2691E',
      glow: '#a855f7',
    },
    pattern: 'wood',
  },
  {
    id: 'neon',
    name: '霓虹灯管木鱼',
    description: '赛博朋克霓虹灯管风格',
    unlockCondition: { type: 'merit', value: 100 },
    colors: {
      primary: '#22d3ee',
      secondary: '#a855f7',
      glow: '#22d3ee',
    },
    pattern: 'neon',
  },
  {
    id: 'crystal',
    name: '透明水晶木鱼',
    description: '晶莹剔透的水晶质感',
    unlockCondition: { type: 'merit', value: 500 },
    colors: {
      primary: '#e0f2fe',
      secondary: '#7dd3fc',
      glow: '#ec4899',
    },
    pattern: 'crystal',
  },
  {
    id: 'pixel',
    name: '故障像素木鱼',
    description: '8位像素故障艺术风格',
    unlockCondition: { type: 'merit', value: 1000 },
    colors: {
      primary: '#00ff88',
      secondary: '#ff3366',
      glow: '#00ff88',
    },
    pattern: 'pixel',
  },
  {
    id: 'circuit',
    name: '黄金电路板木鱼',
    description: '金光闪闪的电路板纹理',
    unlockCondition: { type: 'merit', value: 5000 },
    colors: {
      primary: '#ffd700',
      secondary: '#ffaa00',
      glow: '#ffd700',
    },
    pattern: 'circuit',
  },
  {
    id: 'cat',
    name: '暗黑猫猫木鱼',
    description: '神秘的暗黑猫咪造型',
    unlockCondition: { type: 'event', value: 'limited' },
    colors: {
      primary: '#1a1a2e',
      secondary: '#ec4899',
      glow: '#ec4899',
    },
    pattern: 'cat',
  },
];

export function getSkinById(id: string): Skin {
  return SKINS.find(s => s.id === id) || SKINS[0];
}

export function isSkinUnlocked(skin: Skin, totalMerit: number, unlockedSkins: string[]): boolean {
  if (unlockedSkins.includes(skin.id)) return true;
  if (skin.unlockCondition.type === 'merit') {
    return totalMerit >= (skin.unlockCondition.value as number);
  }
  return false;
}
