import React, { useEffect, useRef, useState } from 'react';

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
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  adLayout?: 'in-article';
}

export const AdUnit: React.FC<AdUnitProps> = ({
  placementId,
  slot = '2834720318',
  minHeightClass = 'min-h-[120px]',
  className = '',
  adFormat = 'auto',
  adLayout
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);
  const [shouldRenderAd, setShouldRenderAd] = useState(false);

  // Lazy-activate ad slot 250px before entering viewport to maximize Active View Viewability & RPM
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldRenderAd(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldRenderAd(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [placementId]);

  useEffect(() => {
    if (!shouldRenderAd || pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script blocked by adblocker or offline preview
    }
  }, [shouldRenderAd, placementId]);

  return (
    <aside
      ref={containerRef}
      aria-label="Advertisement"
      className={`w-full my-space-sm px-gutter ${className}`}
    >
      <div
        className={`w-full rounded-lg bg-surface-container-low/70 border border-outline-variant/35 p-2 flex flex-col items-center justify-center overflow-hidden ${minHeightClass}`}
      >
        <span className="font-label-sm text-[9px] uppercase tracking-widest text-secondary/80 mb-1 select-none">
          Advertisement
        </span>
        {shouldRenderAd && (
          <ins
            className="adsbygoogle w-full"
            style={{ display: 'block', textAlign: adLayout === 'in-article' ? 'center' : undefined }}
            data-ad-client="ca-pub-6889606875840958"
            data-ad-slot={slot}
            data-ad-format={adFormat}
            {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
            data-full-width-responsive="true"
          />
        )}
      </div>
    </aside>
  );
};
