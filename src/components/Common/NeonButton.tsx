import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type NeonColor = 'purple' | 'cyan' | 'pink' | 'green' | 'gold';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: NeonColor;
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses: Record<NeonColor, { bg: string; shadow: string; border: string; text: string; hover: string }> = {
  purple: {
    bg: 'bg-purple-600/20',
    shadow: 'shadow-neon-purple',
    border: 'border-purple-500',
    text: 'text-purple-400',
    hover: 'hover:bg-purple-600/40 hover:text-purple-300',
  },
  cyan: {
    bg: 'bg-cyan-600/20',
    shadow: 'shadow-neon-cyan',
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    hover: 'hover:bg-cyan-600/40 hover:text-cyan-300',
  },
  pink: {
    bg: 'bg-pink-600/20',
    shadow: 'shadow-neon-pink',
    border: 'border-pink-500',
    text: 'text-pink-400',
    hover: 'hover:bg-pink-600/40 hover:text-pink-300',
  },
  green: {
    bg: 'bg-green-600/20',
    shadow: 'shadow-neon-green',
    border: 'border-green-500',
    text: 'text-green-400',
    hover: 'hover:bg-green-600/40 hover:text-green-300',
  },
  gold: {
    bg: 'bg-yellow-600/20',
    shadow: 'shadow-neon-gold',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    hover: 'hover:bg-yellow-600/40 hover:text-yellow-300',
  },
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export function NeonButton({
  color = 'purple',
  children,
  variant = 'outline',
  size = 'md',
  className,
  ...props
}: NeonButtonProps) {
  const c = colorClasses[color];
  const sz = sizeClasses[size];

  const variantClasses =
    variant === 'solid'
      ? `${c.bg} ${c.border} ${c.text} border ${c.hover}`
      : variant === 'ghost'
      ? `bg-transparent ${c.text} ${c.hover} border border-transparent hover:border-current/30`
      : `bg-transparent ${c.text} ${c.border} border ${c.hover}`;

  return (
    <button
      className={cn(
        'relative font-orbitron tracking-wider uppercase rounded-lg transition-all duration-200',
        'transform active:scale-95 hover:scale-[1.02',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        sz,
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
