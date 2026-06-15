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

export type TribulationDifficulty = 'easy' | 'medium' | 'hard';

export type TribulationStatus = 'idle' | 'preparing' | 'playing' | 'result';

export type HeartDemonType = 'barrage' | 'offset' | 'reverse' | 'sound' | 'imp' | 'shield';

export type TribulationRank = 'qi' | 'zhuji' | 'jindan' | 'yuanying' | 'huashen' | 'xianzun';

export interface TribulationDifficultyConfig {
  id: TribulationDifficulty;
  name: string;
  description: string;
  duration: number;
  targetKnocks: number;
  costMerit: number;
  freeDaily: number;
  rewardMultiplier: number;
  demonFrequency: number;
  color: string;
}

export interface TribulationRankConfig {
  id: TribulationRank;
  name: string;
  minScore: number;
  color: string;
  icon: string;
}

export interface HeartDemonConfig {
  id: HeartDemonType;
  name: string;
  description: string;
  icon: string;
  color: string;
  tip?: string;
}

export interface ActiveHeartDemon {
  id: string;
  type: HeartDemonType;
  startTime: number;
  duration: number;
  resolved: boolean;
  x?: number;
  y?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface TribulationSession {
  difficulty: TribulationDifficulty;
  startTime: number;
  endTime?: number;
  totalKnocks: number;
  demonsEncountered: number;
  demonsResolved: number;
  maxCombo: number;
  currentCombo: number;
  shields: number;
  interrupts: number;
  score: number;
  success: boolean;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface TribulationRecord {
  id: string;
  session: TribulationSession;
  rewardMerit: number;
  fragments: string[];
  timestamp: number;
}

export interface TribulationSkinFragment {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  dropFromDifficulty: TribulationDifficulty[];
}

export interface UserTribulationData {
  rankScore: number;
  totalScore: number;
  bestScore: number;
  successCount: number;
  failCount: number;
  consecutiveWins: number;
  maxConsecutiveWins: number;
  fragments: string[];
  records: TribulationRecord[];
  freeDailyUsed: { date: string; count: number };
  demonsEncountered: HeartDemonType[];
}

export type GradeColor = {
  [key in TribulationSession['grade']]: string;
};
