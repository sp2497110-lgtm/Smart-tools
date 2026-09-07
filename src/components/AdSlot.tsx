import { useEffect } from 'react';

interface AdSlotProps {
  type: 'top' | 'between-content' | 'sidebar' | 'bottom';
  className?: string;
}

declare global {
  interface Window {
    SmartToolsAds?: {
      config: any;
      init: () => void;
    };
  }
}

export default function AdSlot({ type, className = '' }: AdSlotProps) {
  const slotClass =
    type === 'top'
      ? 'ad-slot-top'
      : type === 'between-content'
      ? 'ad-slot-between-content'
      : type === 'sidebar'
      ? 'ad-slot-sidebar'
      : 'ad-slot-bottom';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.SmartToolsAds) {
      window.SmartToolsAds.init();
    }
  }, [type]);

  return (
    <div
      className={`${slotClass} ${className}`}
      data-ad-slot={type}
      aria-hidden="true"
    />
  );
}
