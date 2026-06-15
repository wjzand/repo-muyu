import { SoundType } from '@/types';

export interface SoundConfig {
  type: SoundType;
  name: string;
  icon: string;
  description: string;
}

export const SOUND_CONFIGS: SoundConfig[] = [
  {
    type: 'electronic',
    name: '电子音',
    icon: 'Zap',
    description: '经典赛博电子合成音',
  },
  {
    type: 'wooden',
    name: '木鱼原声',
    icon: 'Music',
    description: '传统木鱼敲击声',
  },
  {
    type: 'synth',
    name: '合成器音',
    icon: 'Radio',
    description: '复古合成器音色',
  },
  {
    type: 'drum',
    name: '鼓点音',
    icon: 'Drum',
    description: '动感电子鼓点',
  },
];
