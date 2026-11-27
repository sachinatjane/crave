import React, { useState } from 'react';
import { resolveAssetUrl } from '../utils/assetUrl';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  emojiFallback?: string;
  eager?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  emojiFallback = '🍫',
  eager = false
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-primary-container via-primary to-inverse-surface text-white ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-4xl drop-shadow">{emojiFallback}</span>
      </div>
    );
  }

  return (
    <img
      src={resolveAssetUrl(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
