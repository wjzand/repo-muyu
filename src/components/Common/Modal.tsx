import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'bottom';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  className,
  size = 'md',
  position = 'center',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses =
    position === 'bottom'
      ? 'items-end justify-center pb-0'
      : 'items-center justify-center';

  const panelPositionClasses =
    position === 'bottom'
      ? 'rounded-t-2xl rounded-b-none max-h-[90vh] md:max-h-[85vh] animate-[slideUp_0.3s_ease-out]'
      : 'rounded-2xl max-h-[90vh]';

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        positionClasses,
        'bg-black/70 backdrop-blur-sm',
        'animate-[fadeIn_0.2s_ease-out]'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full',
          sizeClasses[size],
          'm-4',
          'bg-cyber-panel border border-cyber-border',
          'shadow-2xl',
          panelPositionClasses,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border">
            <h2 className="font-orbitron text-lg tracking-wider neon-text-purple">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div
          className={cn(
            'overflow-y-auto scrollbar-hide',
            title ? 'p-4 md:p-6 pb-12 md:pb-16' : 'pb-12 md:pb-16',
            position === 'bottom' ? 'max-h-[calc(90vh-70px)]' : 'max-h-[calc(90vh-70px)]'
          )}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
