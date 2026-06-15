import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  trigger?: boolean;
}

export function GlitchText({
  children,
  className,
  color1 = '#ff3366',
  color2 = '#22d3ee',
  trigger = true,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsGlitching(true);
      const timer = setTimeout(() => setIsGlitching(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger, children]);

  return (
    <span className={cn('relative inline-block', isGlitching && 'animate-glitch', className)}>
      <span
        className="relative z-10">{children}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 opacity-70"
            style={{
              color: color1,
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: 'translate(-2px, -1px)',
            }}
            aria-hidden
          >
            {children}
          </span>
          <span
            className="absolute inset-0 opacity-70"
            style={{
              color: color2,
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: 'translate(2px, 1px)',
            }}
            aria-hidden
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}
