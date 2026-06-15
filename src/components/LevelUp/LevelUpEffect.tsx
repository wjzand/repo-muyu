import { useGameStore } from '@/store/useGameStore';
import { GlitchText } from '@/components/Common/GlitchText';
import { motion, AnimatePresence } from 'framer-motion';

export function LevelUpEffect() {
  const showLevelUp = useGameStore((s) => s.showLevelUp);
  const levelUpData = useGameStore((s) => s.levelUpData);
  const showSkinUnlock = useGameStore((s) => s.showSkinUnlock);
  const unlockedSkinName = useGameStore((s) => s.unlockedSkinName);

  return (
    <>
      <AnimatePresence>
        {showLevelUp && levelUpData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 20}%`,
                    top: `${50 + (Math.random() - 0.5) * 20}%`,
                    backgroundColor:
                      i % 3 === 0 ? levelUpData.color : i % 3 === 1 ? '#a855f7' : '#22d3ee',
                    boxShadow: `0 0 10px ${levelUpData.color}`,
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 800,
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0, rotate: 5 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="relative z-10 text-center"
            >
              <motion.div
                className="absolute inset-0 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  background: `radial-gradient(circle, ${levelUpData.color}80 0%, transparent 70%)`,
                }}
              />

              <div className="relative space-y-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-orbitron text-lg tracking-[0.5em] text-gray-400"
                >
                  ★ 等级提升 ★
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <GlitchText
                    trigger={showLevelUp}
                    className="text-5xl md:text-7xl font-qingke font-bold"
                    color1="#ff3366"
                    color2="#22d3ee"
                  >
                    <span
                      style={{
                        color: levelUpData.color,
                        textShadow: `0 0 20px ${levelUpData.color}, 0 0 40px ${levelUpData.color}, 0 0 80px ${levelUpData.color}80`,
                      }}
                    >
                      {levelUpData.title}
                    </span>
                  </GlitchText>
                </motion.div>

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="font-orbitron text-sm tracking-widest text-gray-400"
                >
                  LEVEL {levelUpData.index + 1}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSkinUnlock && unlockedSkinName && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[150] pointer-events-none"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px #ffd70080',
                  '0 0 40px #ffd700',
                  '0 0 20px #ffd70080',
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-cyber-panel/90 backdrop-blur-sm border-2 border-cyber-gold rounded-2xl px-8 py-4"
            >
              <div className="text-center space-y-1">
                <div className="font-orbitron text-xs tracking-widest text-cyber-gold">
                  🎉 SKIN UNLOCKED 🎉
                </div>
                <div
                  className="font-qingke text-2xl neon-text-gold"
                >
                  {unlockedSkinName}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
