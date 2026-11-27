import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  placementId: string;
  slot?: string;
  minHeightClass?: string;
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({
  placementId,
  slot = '2834720318',
  minHeightClass = 'min-h-[110px]',
  className = ''
}) => {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script blocked by adblocker or offline preview
    }
  }, [placementId]);

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full my-space-sm px-gutter ${className}`}
    >
      <div
        className={`w-full rounded-lg bg-surface-container-low/70 border border-outline-variant/35 p-2 flex flex-col items-center justify-center overflow-hidden ${minHeightClass}`}
      >
        <span className="font-label-sm text-[9px] uppercase tracking-widest text-secondary/80 mb-1 select-none">
          Advertisement
        </span>
        <ins
          className="adsbygoogle w-full"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-6889606875840958"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
