export type SoundType = 'electronic' | 'wooden' | 'synth' | 'drum';

export type SkinPattern = 'wood' | 'neon' | 'crystal' | 'pixel' | 'circuit' | 'cat';

export interface UserData {
  id: string;
  cyberName: string;
  avatarSeed: number;
  totalKnocks: number;
  totalMerit: number;
  todayMerit: number;
  todayDate: string;
  level: number;
  unlockedSkins: string[];
  currentSkin: string;
  achievements: string[];
  createdAt: number;
}

export interface Settings {
  soundEnabled: boolean;
  soundVolume: number;
  soundType: SoundType;
  vibrationEnabled: boolean;
  scriptureEnabled: boolean;
  scriptureFrequency: number;
  scriptureOpacity: number;
  autoKnockEnabled: boolean;
  autoKnockSpeed: number;
  bgmEnabled: boolean;
  participateInRanking: boolean;
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  unlockCondition: {
    type: 'merit' | 'share' | 'event';
    value: number | string;
  };
  colors: {
    primary: string;
    secondary: string;
    glow: string;
  };
  pattern?: SkinPattern;
  exclusiveSound?: SoundType;
}

export interface Level {
  index: number;
  title: string;
  minMerit: number;
  maxMerit: number;
  color: string;
}

export interface Scripture {
  id: string;
  text: string;
  category: 'work' | 'life' | 'meme' | 'custom';
}

export interface LeaderboardItem {
  rank: number;
  userId: string;
  cyberName: string;
  avatarSeed: number;
  merit: number;
  level: number;
}

export interface FloatingScripture extends Scripture {
  key: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Ripple {
  id: number;
  x: number;
  y: number;
}
