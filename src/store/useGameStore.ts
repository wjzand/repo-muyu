import { create } from 'zustand';
import { Level, Ripple, FloatingScripture, Particle } from '@/types';
import { useUserStore } from './useUserStore';
import { checkLevelUp, getLevel, DAILY_MERIT_LIMIT } from '@/data/levels';
import { getRandomScripture, SCRIPTURE_COLORS } from '@/data/scriptures';
import { getSkinById, SKINS } from '@/data/skins';

interface GameState {
  ripples: Ripple[];
  floatingScriptures: FloatingScripture[];
  particles: Particle[];
  showLevelUp: boolean;
  levelUpData: Level | null;
  showSkinUnlock: boolean;
  unlockedSkinName: string | null;
  knockCount: number;
  meritFlash: boolean;

  addRipple: (x: number, y: number) => void;
  removeRipple: (id: number) => void;

  addScripture: () => void;
  removeScripture: (key: number) => void;

  spawnParticles: (x: number, y: number, count?: number) => void;
  updateParticles: (particles: Particle[]) => void;

  performKnock: (isAuto?: boolean) => { reachedLimit: boolean };

  triggerLevelUp: (level: Level) => void;
  hideLevelUp: () => void;

  triggerSkinUnlock: (skinName: string) => void;
  hideSkinUnlock: () => void;

  triggerMeritFlash: () => void;

  resetKnockCount: () => void;
}

let rippleIdCounter = 0;
let scriptureKeyCounter = 0;

export const useGameStore = create<GameState>((set, get) => ({
  ripples: [],
  floatingScriptures: [],
  particles: [],
  showLevelUp: false,
  levelUpData: null,
  showSkinUnlock: false,
  unlockedSkinName: null,
  knockCount: 0,
  meritFlash: false,

  addRipple: (x: number, y: number) => {
    const id = ++rippleIdCounter;
    set((state) => ({
      ripples: [...state.ripples, { id, x, y }],
    }));
    setTimeout(() => get().removeRipple(id), 600);
  },

  removeRipple: (id: number) =>
    set((state) => ({
      ripples: state.ripples.filter((r) => r.id !== id),
    })),

  addScripture: () => {
    const userStore = useUserStore.getState();
    if (!userStore.settings.scriptureEnabled) return;

    const scripture = getRandomScripture();
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number, angle: number;

    switch (side) {
      case 0:
        x = Math.random() * 100;
        y = -10;
        angle = 180 + (Math.random() - 0.5) * 60;
        break;
      case 1:
        x = 110;
        y = Math.random() * 100;
        angle = 270 + (Math.random() - 0.5) * 60;
        break;
      case 2:
        x = Math.random() * 100;
        y = 110;
        angle = (Math.random() - 0.5) * 60;
        break;
      default:
        x = -10;
        y = Math.random() * 100;
        angle = 90 + (Math.random() - 0.5) * 60;
    }

    const key = ++scriptureKeyCounter;
    const floating: FloatingScripture = {
      ...scripture,
      key,
      x,
      y,
      angle,
      speed: 0.3 + Math.random() * 0.4,
      color: SCRIPTURE_COLORS[Math.floor(Math.random() * SCRIPTURE_COLORS.length)],
    };

    set((state) => ({
      floatingScriptures: [...state.floatingScriptures, floating],
    }));

    setTimeout(() => get().removeScripture(key), 5000);
  },

  removeScripture: (key: number) =>
    set((state) => ({
      floatingScriptures: state.floatingScriptures.filter((s) => s.key !== key),
    })),

  spawnParticles: (x: number, y: number, count: number = 15) => {
    const userStore = useUserStore.getState();
    const skin = getSkinById(userStore.user.currentSkin);
    const colors = [skin.colors.glow, skin.colors.primary, skin.colors.secondary];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      });
    }

    set((state) => ({
      particles: [...state.particles, ...newParticles],
    }));
  },

  updateParticles: (particles: Particle[]) =>
    set({ particles }),

  performKnock: (isAuto: boolean = false) => {
    const userStore = useUserStore.getState();
    const { user } = userStore;

    if (user.todayMerit >= DAILY_MERIT_LIMIT) {
      return { reachedLimit: true };
    }

    const meritGain = isAuto ? 0.5 : 1;
    const actualMerit =
      Math.floor(user.todayMerit + meritGain) > DAILY_MERIT_LIMIT
        ? Math.max(0, DAILY_MERIT_LIMIT - user.todayMerit)
        : meritGain;

    if (actualMerit <= 0) {
      return { reachedLimit: true };
    }

    userStore.addKnocks(1);
    userStore.addMerit(actualMerit);

    const newTotalMerit = user.totalMerit + actualMerit;
    const newLevel = getLevel(newTotalMerit);
    if (newLevel.index > user.level) {
      userStore.setLevel(newLevel.index);
      get().triggerLevelUp(newLevel);
    }

    const newUnlocks = userStore.checkSkinUnlocks();
    if (newUnlocks.length > 0) {
      const skin = SKINS.find((s) => s.id === newUnlocks[0]);
      if (skin) {
        get().triggerSkinUnlock(skin.name);
      }
    }

    set((state) => ({
      knockCount: state.knockCount + 1,
    }));

    get().triggerMeritFlash();

    const freq = userStore.settings.scriptureFrequency;
    if (Math.random() < freq * 0.12) {
      get().addScripture();
    }

    return { reachedLimit: false };
  },

  triggerLevelUp: (level: Level) => {
    set({ showLevelUp: true, levelUpData: level });
    setTimeout(() => get().hideLevelUp(), 3000);
  },

  hideLevelUp: () =>
    set({ showLevelUp: false, levelUpData: null }),

  triggerSkinUnlock: (skinName: string) => {
    set({ showSkinUnlock: true, unlockedSkinName: skinName });
    setTimeout(() => get().hideSkinUnlock(), 2500);
  },

  hideSkinUnlock: () =>
    set({ showSkinUnlock: false, unlockedSkinName: null }),

  triggerMeritFlash: () => {
    set({ meritFlash: true });
    setTimeout(() => set({ meritFlash: false }), 300);
  },

  resetKnockCount: () => set({ knockCount: 0 }),
}));
