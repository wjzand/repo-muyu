import { useUserStore } from '@/store/useUserStore';
import { Modal } from '@/components/Common/Modal';
import { SOUND_CONFIGS } from '@/data/sounds';
import { SoundType } from '@/types';
import { useVibration } from '@/hooks/useVibration';
import { Volume2, VolumeX, Music, Radio, Zap, Drum, Scroll, Smartphone, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const soundIcons: Record<SoundType, React.ReactNode> = {
  electronic: <Zap size={20} />,
  wooden: <Music size={20} />,
  synth: <Radio size={20} />,
  drum: <Drum size={20} />,
};

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const settings = useUserStore((s) => s.settings);
  const updateSettings = useUserStore((s) => s.updateSettings);
  const { isSupported: vibrationSupported } = useVibration();

  const Toggle = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        'relative w-12 h-7 rounded-full transition-all duration-300',
        checked ? 'bg-cyber-green shadow-neon-green' : 'bg-cyber-border',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-lg',
          checked ? 'left-[22px]' : 'left-0.5'
        )}
      />
    </button>
  );

  const Slider = ({
    value,
    onChange,
    min = 0,
    max = 100,
    disabled = false,
    color = 'cyan',
  }: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    color?: 'cyan' | 'purple' | 'green' | 'pink';
  }) => {
    const percent = ((value - min) / (max - min)) * 100;
    const colorMap = {
      cyan: '#22d3ee',
      purple: '#a855f7',
      green: '#00ff88',
      pink: '#ec4899',
    };
    const c = colorMap[color];

    return (
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, ${c} 0%, ${c} ${percent}%, #1e1e2e ${percent}%, #1e1e2e 100%)`,
          boxShadow: percent > 0 ? `inset 0 0 5px ${c}40` : 'none',
        }}
      />
    );
  };

  const SettingRow = ({
    icon,
    label,
    hint,
    children,
  }: {
    icon: React.ReactNode;
    label: string;
    hint?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-border">
      <div className="text-cyber-cyan mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white">{label}</div>
        {hint && <div className="text-xs text-gray-500 mt-0.5">{hint}</div>}
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="设置" size="lg" position="bottom">
      <div className="space-y-4 pb-4">
        <div>
          <div className="text-xs font-orbitron tracking-widest text-cyber-purple uppercase mb-2 px-1">
            音效设置
          </div>
          <SettingRow
            icon={settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            label="音效开关"
            hint="开启/关闭敲击音效"
          >
            <Toggle
              checked={settings.soundEnabled}
              onChange={(v) => updateSettings('soundEnabled', v)}
            />
          </SettingRow>

          <div className="mt-3 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-border">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-cyber-cyan"><Volume2 size={20} /></div>
              <div className="flex-1">
                <div className="font-medium text-white">音量大小</div>
                <div className="text-xs text-gray-500 mt-0.5">{Math.round(settings.soundVolume * 100)}%</div>
              </div>
            </div>
            <Slider
              value={settings.soundVolume * 100}
              onChange={(v) => updateSettings('soundVolume', v / 100)}
              disabled={!settings.soundEnabled}
              color="cyan"
            />
          </div>

          <div className="mt-3 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-border">
            <div className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Radio size={16} className="text-cyber-cyan" />
              音色选择
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SOUND_CONFIGS.map((cfg) => (
                <button
                  key={cfg.type}
                  onClick={() => updateSettings('soundType', cfg.type)}
                  disabled={!settings.soundEnabled}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all',
                    settings.soundType === cfg.type
                      ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_10px_#22d3ee40]'
                      : 'border-cyber-border hover:border-cyber-cyan/50',
                    !settings.soundEnabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={settings.soundType === cfg.type ? 'text-cyber-cyan' : 'text-gray-400'}>
                      {soundIcons[cfg.type]}
                    </div>
                    <div className={cn(
                      'font-qingke text-sm',
                      settings.soundType === cfg.type ? 'text-cyber-cyan' : 'text-white'
                    )}>
                      {cfg.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-7">{cfg.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-orbitron tracking-widest text-cyber-purple uppercase mb-2 px-1">
            视觉设置
          </div>
          <SettingRow
            icon={<Scroll size={20} />}
            label="经文显示"
            hint="显示/隐藏漂浮经文"
          >
            <Toggle
              checked={settings.scriptureEnabled}
              onChange={(v) => updateSettings('scriptureEnabled', v)}
            />
          </SettingRow>

          {settings.scriptureEnabled && (
            <>
              <div className="mt-3 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-cyber-purple"><Scroll size={20} /></div>
                  <div className="flex-1">
                    <div className="font-medium text-white">经文频率</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {settings.scriptureFrequency <= 1 ? '低' : settings.scriptureFrequency <= 2 ? '较低' : settings.scriptureFrequency <= 3 ? '中' : settings.scriptureFrequency <= 4 ? '较高' : '高'}
                    </div>
                  </div>
                </div>
                <Slider
                  value={settings.scriptureFrequency}
                  onChange={(v) => updateSettings('scriptureFrequency', v)}
                  min={1}
                  max={5}
                  color="purple"
                />
              </div>

              <div className="mt-3 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-cyber-pink"><Scroll size={20} /></div>
                  <div className="flex-1">
                    <div className="font-medium text-white">经文透明度</div>
                    <div className="text-xs text-gray-500 mt-0.5">{Math.round(settings.scriptureOpacity * 100)}%</div>
                  </div>
                </div>
                <Slider
                  value={settings.scriptureOpacity * 100}
                  onChange={(v) => updateSettings('scriptureOpacity', v / 100)}
                  color="pink"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <div className="text-xs font-orbitron tracking-widest text-cyber-purple uppercase mb-2 px-1">
            其他设置
          </div>
          <SettingRow
            icon={<Smartphone size={20} />}
            label="震动反馈"
            hint={vibrationSupported ? '触觉反馈增强沉浸感' : '当前设备不支持震动'}
          >
            <Toggle
              checked={settings.vibrationEnabled}
              onChange={(v) => updateSettings('vibrationEnabled', v)}
              disabled={!vibrationSupported}
            />
          </SettingRow>

          <div className="mt-3">
            <SettingRow
              icon={<Activity size={20} />}
              label="自动敲击"
              hint="放置模式，自动积累功德"
            >
              <Toggle
                checked={settings.autoKnockEnabled}
                onChange={(v) => updateSettings('autoKnockEnabled', v)}
              />
            </SettingRow>
          </div>

          {settings.autoKnockEnabled && (
            <div className="mt-3 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-border">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-cyber-green"><Activity size={20} /></div>
                <div className="flex-1">
                  <div className="font-medium text-white">敲击速度</div>
                  <div className="text-xs text-gray-500 mt-0.5">{settings.autoKnockSpeed}ms/次</div>
                </div>
              </div>
              <Slider
                value={1200 - settings.autoKnockSpeed}
                onChange={(v) => updateSettings('autoKnockSpeed', 1200 - v)}
                min={200}
                max={1000}
                color="green"
              />
            </div>
          )}

          <div className="mt-3">
            <SettingRow
              icon={<Users size={20} />}
              label="参与排行榜"
              hint="允许他人在功德榜看到你的修行"
            >
              <Toggle
                checked={settings.participateInRanking}
                onChange={(v) => updateSettings('participateInRanking', v)}
              />
            </SettingRow>
          </div>
        </div>
      </div>
    </Modal>
  );
}
