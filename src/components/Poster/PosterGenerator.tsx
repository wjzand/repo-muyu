import { useRef, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { getLevel, getLevelProgress } from '@/data/levels';
import { Modal } from '@/components/Common/Modal';
import { NeonButton } from '@/components/Common/NeonButton';
import { GlitchText } from '@/components/Common/GlitchText';
import { FishSkin } from '@/components/WoodenFish/FishSkin';
import { getSkinById } from '@/data/skins';
import html2canvas from 'html2canvas';
import { Download, Loader2, Share2 } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';

interface PosterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const POSTER_MOTTOS = [
  '愿代码无BUG，人生无烦恼',
  '赛博修行，功德无量',
  '敲一敲，福报+1',
  '早日上岸，财务自由',
  '电子木鱼，数字救赎',
  '心诚则灵，数据为证',
  '在赛博空间寻找内心宁静',
  '科技时代的禅意修行',
];

export function PosterGenerator({ isOpen, onClose }: PosterGeneratorProps) {
  const user = useUserStore((s) => s.user);
  const posterRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const currentLevel = getLevel(user.totalMerit);
  const levelProgress = Math.round(getLevelProgress(user.totalMerit) * 100);
  const currentSkin = getSkinById(user.currentSkin);
  const motto = POSTER_MOTTOS[user.avatarSeed % POSTER_MOTTOS.length];

  const handleGenerate = async () => {
    if (!posterRef.current) return;

    setExporting(true);
    setImageUrl(null);

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        useCORS: true,
        logging: false,
      });

      const url = canvas.toDataURL('image/png');
      setImageUrl(url);
    } catch (e) {
      console.error('Poster generation failed:', e);
      alert('海报生成失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `赛博修行证书_${user.cyberName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!imageUrl) return;

    try {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `赛博修行证书_${user.cyberName}.png`, {
        type: 'image/png',
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: '赛博修行证书',
          text: `我是${user.cyberName}，已积累${user.totalMerit}赛博功德！`,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="赛博修行证书" size="lg">
      <div className="space-y-5">
        <div className="flex justify-center overflow-hidden rounded-xl border-2 border-cyber-border bg-cyber-bg p-2">
          <div className="w-full max-w-sm">
            <div
              ref={posterRef}
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: '9/16',
                background: `
                  radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
                  linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)
                `,
                padding: '32px 28px',
              }}
            >
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 3px)`,
                }}
              />

              <div className="relative z-10 h-full flex flex-col items-center justify-between">
                <div className="text-center space-y-1">
                  <div className="font-orbitron text-xs tracking-[0.4em] text-cyber-purple">
                    ★ CYBER CULTIVATION ★
                  </div>
                  <GlitchText
                    trigger={false}
                    className="text-3xl font-qingke font-bold"
                  >
                    <span className="neon-text-purple">赛博</span>
                    <span className="neon-text-cyan">修行</span>
                    <span className="neon-text-pink">证书</span>
                  </GlitchText>
                  <div className="h-px bg-gradient-to-r from-transparent via-cyber-purple to-transparent mt-2" />
                </div>

                <div className="my-4 flex justify-center">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-2xl opacity-40"
                      style={{ background: currentSkin.colors.glow }}
                    />
                    <FishSkin skin={currentSkin} size={140} />
                  </div>
                </div>

                <div className="text-center space-y-4 w-full">
                  <div>
                    <div className="text-xs font-orbitron tracking-widest text-gray-500 mb-1">
                      CYBER NAME / 赛博法号
                    </div>
                    <div className="font-qingke text-2xl text-white">
                      {user.cyberName}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5">
                      <div className="text-[10px] font-orbitron tracking-wider text-cyber-cyan/70 mb-1">
                        功德值
                      </div>
                      <div className="font-orbitron text-2xl font-bold neon-text-cyan">
                        {formatNumber(user.totalMerit)}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-cyber-purple/30 bg-cyber-purple/5">
                      <div className="text-[10px] font-orbitron tracking-wider text-cyber-purple/70 mb-1">
                        敲击次数
                      </div>
                      <div className="font-orbitron text-2xl font-bold neon-text-purple">
                        {formatNumber(user.totalKnocks)}
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-lg border-2"
                    style={{
                      borderColor: currentLevel.color + '50',
                      backgroundColor: currentLevel.color + '08',
                      boxShadow: `inset 0 0 20px ${currentLevel.color}15`,
                    }}
                  >
                    <div className="text-[10px] font-orbitron tracking-wider text-gray-400 mb-1">
                      当前境界 / REALM
                    </div>
                    <div
                      className="font-qingke text-xl"
                      style={{
                        color: currentLevel.color,
                        textShadow: `0 0 10px ${currentLevel.color}80`,
                      }}
                    >
                      {currentLevel.title}
                    </div>
                    <div className="mt-2 h-1.5 bg-cyber-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${levelProgress}%`,
                          backgroundColor: currentLevel.color,
                          boxShadow: `0 0 6px ${currentLevel.color}`,
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-right text-gray-500 font-orbitron">
                      PROGRESS {levelProgress}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-cyber-pink/30 bg-cyber-pink/5">
                    <div className="text-[10px] font-orbitron tracking-wider text-cyber-pink/70 mb-1">
                      修行座右铭 / MOTTO
                    </div>
                    <div className="font-qingke text-sm text-gray-200 italic">
                      「{motto}」
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-orbitron tracking-wider text-gray-500">
                    <span>CYBER WOODEN FISH</span>
                    <span>v1.0.0</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
                  <div className="flex items-center justify-between text-[10px] text-gray-600">
                    <span>扫码继续修行</span>
                    <span>#{user.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {imageUrl && (
          <div className="rounded-xl overflow-hidden border-2 border-cyber-green/50 bg-cyber-green/5 p-2">
            <div className="text-xs font-orbitron tracking-wider text-cyber-green text-center mb-2">
              ✅ 海报生成成功！长按图片或点击按钮保存
            </div>
            <img
              src={imageUrl}
              alt="修行证书"
              className="w-full rounded-lg max-h-96 object-contain mx-auto"
              style={{ imageRendering: 'auto' }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {!imageUrl ? (
            <NeonButton
              color="cyan"
              variant="solid"
              onClick={handleGenerate}
              disabled={exporting}
              size="lg"
            >
              {exporting ? (
                <>
                  <Loader2 size={18} className="animate-spin inline mr-2" />
                  生成中...
                </>
              ) : (
                '生成修行海报'
              )}
            </NeonButton>
          ) : (
            <>
              <NeonButton color="green" variant="solid" onClick={handleDownload} size="lg">
                <Download size={18} className="inline mr-2" />
                保存图片
              </NeonButton>
              <NeonButton color="pink" variant="outline" onClick={handleShare} size="lg">
                <Share2 size={18} className="inline mr-2" />
                分享给好友
              </NeonButton>
              <NeonButton color="purple" variant="ghost" onClick={() => setImageUrl(null)}>
                重新生成
              </NeonButton>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
