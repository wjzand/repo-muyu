import { useMemo } from 'react';
import { Skin } from '@/types';
import { cn } from '@/lib/utils';

interface FishSkinProps {
  skin: Skin;
  size?: number;
  isPressed?: boolean;
}

export function FishSkin({ skin, size = 280, isPressed = false }: FishSkinProps) {
  const { primary, secondary, glow } = skin.colors;
  const pattern = skin.pattern || 'wood';

  const glowFilter = useMemo(
    () => `drop-shadow(0 0 10px ${glow}) drop-shadow(0 0 20px ${glow}80)`,
    [glow]
  );

  const baseStyle = {
    width: size,
    height: size,
    filter: glowFilter,
  };

  const renderWood = () => (
    <svg viewBox="0 0 200 200" style={baseStyle}>
      <defs>
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={secondary} />
          <stop offset="50%" stopColor={primary} />
          <stop offset="100%" stopColor="#5D2E0C" />
        </linearGradient>
        <radialGradient id="woodHighlight" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="100"
        cy="110"
        rx="85"
        ry="70"
        fill="url(#woodGrad)"
        stroke={glow}
        strokeWidth="2"
      />
      <ellipse cx="100" cy="110" rx="85" ry="70" fill="url(#woodHighlight)" />
      <ellipse
        cx="100"
        cy="55"
        rx="50"
        ry="25"
        fill={secondary}
        stroke={glow}
        strokeWidth="1.5"
      />
      <ellipse
        cx="100"
        cy="55"
        rx="40"
        ry="18"
        fill="#3D1E0A"
      />
      <line x1="60" y1="100" x2="140" y2="100" stroke="#5D2E0C" strokeWidth="1" opacity="0.5" />
      <line x1="55" y1="120" x2="145" y2="120" stroke="#5D2E0C" strokeWidth="1" opacity="0.5" />
      <line x1="65" y1="140" x2="135" y2="140" stroke="#5D2E0C" strokeWidth="1" opacity="0.5" />
    </svg>
  );

  const renderNeon = () => (
    <svg viewBox="0 0 200 200" style={baseStyle}>
      <defs>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse
        cx="100"
        cy="110"
        rx="85"
        ry="70"
        fill="#0a0a0f"
        stroke={primary}
        strokeWidth="3"
        filter="url(#neonGlow)"
      />
      <ellipse
        cx="100"
        cy="110"
        rx="70"
        ry="55"
        fill="none"
        stroke={secondary}
        strokeWidth="2"
        filter="url(#neonGlow)"
        strokeDasharray="10 5"
      />
      <ellipse
        cx="100"
        cy="55"
        rx="50"
        ry="25"
        fill="#0a0a0f"
        stroke={primary}
        strokeWidth="3"
        filter="url(#neonGlow)"
      />
      <line x1="60" y1="70" x2="140" y2="70" stroke={secondary} strokeWidth="2" filter="url(#neonGlow)" />
      <line x1="70" y1="150" x2="130" y2="150" stroke={secondary} strokeWidth="2" filter="url(#neonGlow)" />
      <circle cx="100" cy="110" r="15" fill="none" stroke={glow} strokeWidth="2" filter="url(#neonGlow)" />
    </svg>
  );

  const renderCrystal = () => (
    <svg viewBox="0 0 200 200" style={baseStyle}>
      <defs>
        <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="30%" stopColor={secondary} stopOpacity="0.5" />
          <stop offset="60%" stopColor={primary} stopOpacity="0.6" />
          <stop offset="100%" stopColor="#87CEEB" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="crystalHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse
        cx="100"
        cy="110"
        rx="85"
        ry="70"
        fill="url(#crystalGrad)"
        stroke={glow}
        strokeWidth="2"
      />
      <ellipse cx="100" cy="110" rx="85" ry="70" fill="url(#crystalHighlight)" />
      <ellipse
        cx="100"
        cy="55"
        rx="50"
        ry="25"
        fill="url(#crystalGrad)"
        stroke={glow}
        strokeWidth="2"
      />
      <polygon points="50,80 80,60 75,100" fill="#ffffff" opacity="0.3" />
      <polygon points="150,80 120,60 125,100" fill="#ffffff" opacity="0.3" />
      <line x1="60" y1="75" x2="90" y2="95" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      <line x1="140" y1="75" x2="110" y2="95" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
    </svg>
  );

  const renderPixel = () => {
    const px = 10;
    const pattern = [
      '    XXXXXXXX    ',
      '  XXXXXXXXXXXX  ',
      ' XXXXXXXXXXXXXX ',
      'XXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXX',
      ' XXXXXXXXXXXXXX ',
      '  XXXXXXXXXXXX  ',
      '    XXXXXXXX    ',
    ];
    const glitchCells = useMemo(() => {
      const cells = new Set<string>();
      pattern.forEach((row, y) =>
        row.split('').forEach((cell, x) => {
          if (cell === 'X' && Math.random() > 0.85) cells.add(`${x}-${y}`);
        })
      );
      return cells;
    }, []);
    return (
      <svg viewBox="0 0 200 200" style={baseStyle}>
        {pattern.map((row, y) =>
          row.split('').map((cell, x) =>
            cell === 'X' ? (
              <rect
                key={`${x}-${y}`}
                x={20 + x * px}
                y={60 + y * px}
                width={px - 1}
                height={px - 1}
                fill={glitchCells.has(`${x}-${y}`) ? secondary : primary}
              />
            ) : null
          )
        )}
        <rect x="70" y="50" width="60" height="15" fill={glow} opacity="0.9" />
        <rect x="75" y="52" width="50" height="11" fill="#000" />
      </svg>
    );
  };

  const renderCircuit = () => (
    <svg viewBox="0 0 200 200" style={baseStyle}>
      <defs>
        <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      <ellipse
        cx="100"
        cy="110"
        rx="85"
        ry="70"
        fill="#1a1a0a"
        stroke={primary}
        strokeWidth="3"
      />
      <ellipse
        cx="100"
        cy="110"
        rx="75"
        ry="60"
        fill="none"
        stroke={secondary}
        strokeWidth="1"
        strokeDasharray="4 2"
        opacity="0.6"
      />
      <line x1="30" y1="110" x2="60" y2="110" stroke={primary} strokeWidth="2" />
      <line x1="140" y1="110" x2="170" y2="110" stroke={primary} strokeWidth="2" />
      <line x1="100" y1="60" x2="100" y2="40" stroke={primary} strokeWidth="2" />
      <line x1="70" y1="80" x2="70" y2="110" stroke={primary} strokeWidth="2" />
      <line x1="130" y1="80" x2="130" y2="110" stroke={primary} strokeWidth="2" />
      <line x1="70" y1="140" x2="70" y2="160" stroke={primary} strokeWidth="2" />
      <line x1="130" y1="140" x2="130" y2="160" stroke={primary} strokeWidth="2" />
      <circle cx="60" cy="110" r="4" fill={secondary} />
      <circle cx="140" cy="110" r="4" fill={secondary} />
      <circle cx="100" cy="40" r="4" fill={secondary} />
      <circle cx="70" cy="80" r="3" fill={secondary} />
      <circle cx="130" cy="80" r="3" fill={secondary} />
      <circle cx="70" cy="160" r="3" fill={secondary} />
      <circle cx="130" cy="160" r="3" fill={secondary} />
      <circle cx="100" cy="110" r="8" fill={glow} opacity="0.8" />
      <circle cx="100" cy="110" r="4" fill="#fff" />
      <ellipse
        cx="100"
        cy="55"
        rx="50"
        ry="25"
        fill="#1a1a0a"
        stroke={primary}
        strokeWidth="2"
      />
    </svg>
  );

  const renderCat = () => (
    <svg viewBox="0 0 200 200" style={baseStyle}>
      <defs>
        <radialGradient id="catGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <polygon points="45,60 55,30 75,55" fill={primary} stroke={secondary} strokeWidth="2" />
      <polygon points="155,60 145,30 125,55" fill={primary} stroke={secondary} strokeWidth="2" />
      <polygon points="50,55 57,35 70,53" fill={secondary} opacity="0.5" />
      <polygon points="150,55 143,35 130,53" fill={secondary} opacity="0.5" />
      <ellipse
        cx="100"
        cy="115"
        rx="80"
        ry="70"
        fill={primary}
        stroke={secondary}
        strokeWidth="2"
      />
      <ellipse cx="100" cy="115" rx="80" ry="70" fill="url(#catGlow)" />
      <ellipse cx="75" cy="105" rx="10" ry="14" fill="#fff" />
      <ellipse cx="125" cy="105" rx="10" ry="14" fill="#fff" />
      <ellipse cx="77" cy="108" rx="4" ry="8" fill={glow} />
      <ellipse cx="127" cy="108" rx="4" ry="8" fill={glow} />
      <circle cx="78" cy="106" r="1.5" fill="#fff" />
      <circle cx="128" cy="106" r="1.5" fill="#fff" />
      <path d="M92,135 Q100,145 108,135" stroke={secondary} strokeWidth="2" fill="none" />
      <polygon points="100,125 97,133 103,133" fill={glow} />
      <line x1="40" y1="125" x2="60" y2="128" stroke={secondary} strokeWidth="1.5" />
      <line x1="40" y1="135" x2="60" y2="135" stroke={secondary} strokeWidth="1.5" />
      <line x1="160" y1="125" x2="140" y2="128" stroke={secondary} strokeWidth="1.5" />
      <line x1="160" y1="135" x2="140" y2="135" stroke={secondary} strokeWidth="1.5" />
    </svg>
  );

  const renderByPattern = () => {
    switch (pattern) {
      case 'neon':
        return renderNeon();
      case 'crystal':
        return renderCrystal();
      case 'pixel':
        return renderPixel();
      case 'circuit':
        return renderCircuit();
      case 'cat':
        return renderCat();
      case 'wood':
      default:
        return renderWood();
    }
  };

  return (
    <div
      className={cn(
        'relative transition-transform duration-100',
        isPressed ? 'scale-90' : 'scale-100'
      )}
      style={{ width: size, height: size }}
    >
      {renderByPattern()}
    </div>
  );
}
