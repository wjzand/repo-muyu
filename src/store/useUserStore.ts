import { create } from 'zustand';
import { UserData, Settings, UserTribulationData, TribulationRecord } from '@/types';
import { STORAGE_KEYS, safeGetItem, safeSetItem } from '@/utils/storage';
import { generateCyberName, generateId } from '@/utils/generateName';
import { getTodayDate } from '@/utils/formatNumber';
import { isSkinUnlocked, SKINS } from '@/data/skins';

const DEFAULT_USER: UserData = {
  id: generateId(),
  cyberName: generateCyberName(),
  avatarSeed: Math.floor(Math.random() * 1000),
  totalKnocks: 0,
  totalMerit: 0,
  todayMerit: 0,
  todayDate: getTodayDate(),
  level: 0,
  unlockedSkins: ['wood'],
  currentSkin: 'wood',
  achievements: [],
  createdAt: Date.now(),
};

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  soundVolume: 0.5,
  soundType: 'electronic',
  vibrationEnabled: true,
  scriptureEnabled: true,
  scriptureFrequency: 3,
  scriptureOpacity: 0.8,
  autoKnockEnabled: false,
  autoKnockSpeed: 800,
  bgmEnabled: false,
  participateInRanking: true,
};

const DEFAULT_TRIBULATION: UserTribulationData = {
  rankScore: 0,
  totalScore: 0,
  bestScore: 0,
  successCount: 0,
  failCount: 0,
  consecutiveWins: 0,
  maxConsecutiveWins: 0,
  fragments: [],
  records: [],
  freeDailyUsed: { date: '', count: 0 },
  demonsEncountered: [],
};

interface UserStore {
  user: UserData;
  settings: Settings;
  tribulation: UserTribulationData;
  initUser: () => void;
  setCyberName: (name: string) => void;
  setAvatarSeed: (seed: number) => void;
  setCurrentSkin: (skinId: string) => void;
  unlockSkin: (skinId: string) => void;
  addKnocks: (count: number) => void;
  addMerit: (amount: number) => void;
  setLevel: (level: number) => void;
  addAchievement: (achievementId: string) => void;
  resetDaily: () => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  updateSettings: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  checkSkinUnlocks: () => string[];
  checkFreeDaily: (maxFree: number) => boolean;
  useFreeDaily: () => void;
  addTribulationRecord: (record: TribulationRecord, meritDelta: number, scoreDelta: number) => void;
  addTribulationFragment: (fragmentId: string) => void;
  addDemonEncountered: (demonId: string) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: safeGetItem(STORAGE_KEYS.USER, DEFAULT_USER),
  settings: safeGetItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  tribulation: safeGetItem(STORAGE_KEYS.TRIBULATION, DEFAULT_TRIBULATION),

  initUser: () => {
    const { user, tribulation, resetDaily } = get();
    const today = getTodayDate();
    if (user.todayDate !== today) {
      resetDaily();
    }
    if (tribulation.freeDailyUsed.date !== today) {
      set((state) => {
        const newTrib = {
          ...state.tribulation,
          freeDailyUsed: { date: today, count: 0 },
        };
        safeSetItem(STORAGE_KEYS.TRIBULATION, newTrib);
        return { tribulation: newTrib };
      });
    }
  },

  setCyberName: (name: string) =>
    set((state) => {
      const newUser = { ...state.user, cyberName: name };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  setAvatarSeed: (seed: number) =>
    set((state) => {
      const newUser = { ...state.user, avatarSeed: seed };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  setCurrentSkin: (skinId: string) =>
    set((state) => {
      const newUser = { ...state.user, currentSkin: skinId };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  unlockSkin: (skinId: string) =>
    set((state) => {
      if (state.user.unlockedSkins.includes(skinId)) return {};
      const newUser = {
        ...state.user,
        unlockedSkins: [...state.user.unlockedSkins, skinId],
      };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  addKnocks: (count: number) =>
    set((state) => {
      const newUser = { ...state.user, totalKnocks: state.user.totalKnocks + count };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  addMerit: (amount: number) =>
    set((state) => {
      const newUser = {
        ...state.user,
        totalMerit: state.user.totalMerit + amount,
        todayMerit: state.user.todayMerit + amount,
      };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  setLevel: (level: number) =>
    set((state) => {
      const newUser = { ...state.user, level };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  addAchievement: (achievementId: string) =>
    set((state) => {
      if (state.user.achievements.includes(achievementId)) return {};
      const newUser = {
        ...state.user,
        achievements: [...state.user.achievements, achievementId],
      };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  resetDaily: () =>
    set((state) => {
      const newUser = {
        ...state.user,
        todayMerit: 0,
        todayDate: getTodayDate(),
      };
      safeSetItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }),

  resetAllData: () => {
    const newUser = {
      ...DEFAULT_USER,
      id: generateId(),
      cyberName: generateCyberName(),
      avatarSeed: Math.floor(Math.random() * 1000),
      createdAt: Date.now(),
    };
    safeSetItem(STORAGE_KEYS.USER, newUser);
    safeSetItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    set({ user: newUser, settings: DEFAULT_SETTINGS });
  },

  exportData: () => {
    const state = get();
    return JSON.stringify(
      { user: state.user, settings: state.settings },
      null,
      2
    );
  },

  importData: (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.user && data.settings) {
        safeSetItem(STORAGE_KEYS.USER, data.user);
        safeSetItem(STORAGE_KEYS.SETTINGS, data.settings);
        set({ user: data.user, settings: data.settings });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  updateSettings: <K extends keyof Settings>(key: K, value: Settings[K]) =>
    set((state) => {
      const newSettings = { ...state.settings, [key]: value };
      safeSetItem(STORAGE_KEYS.SETTINGS, newSettings);
      return { settings: newSettings };
    }),

  checkSkinUnlocks: (): string[] => {
    const { user, unlockSkin } = get();
    const newlyUnlocked: string[] = [];

    SKINS.forEach((skin) => {
      if (
        !user.unlockedSkins.includes(skin.id) &&
        isSkinUnlocked(skin, user.totalMerit, user.unlockedSkins)
      ) {
        unlockSkin(skin.id);
        newlyUnlocked.push(skin.id);
      }
    });

    return newlyUnlocked;
  },

  checkFreeDaily: (maxFree: number): boolean => {
    const { tribulation } = get();
    const today = getTodayDate();
    if (tribulation.freeDailyUsed.date !== today) {
      return true;
    }
    return tribulation.freeDailyUsed.count < maxFree;
  },

  useFreeDaily: () => {
    set((state) => {
      const today = getTodayDate();
      const newTrib = {
        ...state.tribulation,
        freeDailyUsed: {
          date: today,
          count:
            state.tribulation.freeDailyUsed.date === today
              ? state.tribulation.freeDailyUsed.count + 1
              : 1,
        },
      };
      safeSetItem(STORAGE_KEYS.TRIBULATION, newTrib);
      return { tribulation: newTrib };
    });
  },

  addTribulationRecord: (record: TribulationRecord, meritDelta: number, scoreDelta: number) => {
    set((state) => {
      const success = record.session.success;
      const newRecords = [record, ...state.tribulation.records].slice(0, 100);
      const newConsecutiveWins = success ? state.tribulation.consecutiveWins + 1 : 0;
      const newTrib = {
        ...state.tribulation,
        rankScore: Math.max(0, state.tribulation.rankScore + scoreDelta),
        totalScore: state.tribulation.totalScore + Math.max(0, scoreDelta),
        bestScore: Math.max(state.tribulation.bestScore, record.session.score),
        successCount: state.tribulation.successCount + (success ? 1 : 0),
        failCount: state.tribulation.failCount + (success ? 0 : 1),
        consecutiveWins: newConsecutiveWins,
        maxConsecutiveWins: Math.max(state.tribulation.maxConsecutiveWins, newConsecutiveWins),
        fragments: [...state.tribulation.fragments, ...record.fragments],
        records: newRecords,
      };
      safeSetItem(STORAGE_KEYS.TRIBULATION, newTrib);

      const newUser = {
        ...state.user,
        totalMerit: Math.max(0, state.user.totalMerit + meritDelta),
        totalKnocks: state.user.totalKnocks + record.session.totalKnocks,
      };
      safeSetItem(STORAGE_KEYS.USER, newUser);

      return { tribulation: newTrib, user: newUser };
    });
  },

  addTribulationFragment: (fragmentId: string) => {
    set((state) => {
      const newTrib = {
        ...state.tribulation,
        fragments: [...state.tribulation.fragments, fragmentId],
      };
      safeSetItem(STORAGE_KEYS.TRIBULATION, newTrib);
      return { tribulation: newTrib };
    });
  },

  addDemonEncountered: (demonId: string) => {
    set((state) => {
      if (state.tribulation.demonsEncountered.includes(demonId as any)) {
        return {};
      }
      const newTrib = {
        ...state.tribulation,
        demonsEncountered: [...state.tribulation.demonsEncountered, demonId as any],
      };
      safeSetItem(STORAGE_KEYS.TRIBULATION, newTrib);
      return { tribulation: newTrib };
    });
  },
}));
