import React from 'react';
import { InAppBrowserInfo } from '../utils/shareEngine';
import { EBOOK_URL } from './EbookPromoCard';

interface BrandHeaderProps {
  mode: 'tab' | 'stack';
  title?: string;
  savedCount: number;
  inAppInfo: InAppBrowserInfo;
  onBack?: () => void;
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  onShare?: () => void;
  onDismissInApp?: () => void;
  showInAppBanner: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  mode,
  title,
  savedCount,
  inAppInfo,
  onBack,
  onOpenSearch,
  onOpenSaved,
  onShare,
  onDismissInApp,
  showInAppBanner
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/88 backdrop-blur-xl shadow-[0_1px_12px_rgba(39,24,17,0.05)]">
      {showInAppBanner && inAppInfo.isInApp && (
        <div className="bg-inverse-surface text-inverse-on-surface px-gutter py-1.5 flex items-center justify-between gap-2 text-[11px]">
          <span className="truncate font-medium">
            In {inAppInfo.appName} browser — tap <strong className="text-tertiary-fixed">••• → Open in Browser</strong> for Wake Lock &amp; PNG saves
          </span>
          {onDismissInApp && (
            <button
              type="button"
              onClick={onDismissInApp}
              aria-label="Dismiss browser tip"
              className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
      )}

      <div className="h-16 max-w-5xl mx-auto px-gutter flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs min-w-0">
          {mode === 'stack' && onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:scale-90 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
          ) : null}

          {/* Crisp Inline Brand Mark (Zero external image dependency) */}
          <button
            type="button"
            onClick={mode === 'stack' ? onBack : undefined}
            className="flex items-center gap-2 min-w-0 text-left focus:outline-none"
          >
            <svg
              viewBox="0 0 36 36"
              className="w-8 h-8 shrink-0 drop-shadow-sm"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="svGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#815100" />
                </linearGradient>
              </defs>
              <rect width="36" height="36" rx="12" fill="url(#svGrad)" />
              <path
                d="M18 7.5c2.4 3.4 6.2 5.4 6.2 10.2a6.2 6.2 0 1 1-12.4 0c0-2.1.9-3.9 2.1-5.4.5 1.5 1.8 2.4 2.9 2.4-.7-2.6.2-5.1 1.2-7.2Z"
                fill="#fff8f6"
              />
              <circle cx="18" cy="20.2" r="2.2" fill="#ffb95f" />
            </svg>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate font-extrabold">
              {mode === 'stack' && title ? title : 'Crave'}
            </span>
          </button>
        </div>

        {/* Zero-Login Action Cluster */}
        <div className="flex items-center gap-1.5 shrink-0">
          {mode === 'tab' && (
            <a
              href={EBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#e8f8f2] text-pistachio-dark px-2.5 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[15px]">menu_book</span>
              <span className="font-label-sm text-label-sm font-extrabold uppercase tracking-wider">
                eBook
              </span>
            </a>
          )}

          {mode === 'tab' && (
            <div className="hidden sm:inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(39,24,17,0.05)]">
              <span className="text-xs leading-none">🔥</span>
              <span className="font-label-sm text-label-sm text-primary font-extrabold uppercase tracking-wider">
                3.2K Baking
              </span>
            </div>
          )}

          {mode === 'tab' && (
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search desserts or match pantry ingredients"
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
          )}

          {mode === 'stack' && onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="Share recipe card"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-primary hover:bg-surface-container-high active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
            </button>
          )}

          {/* Saved Recipe Box (Zero Login LocalStorage) */}
          <button
            type="button"
            onClick={onOpenSaved}
            aria-label={`Saved recipes (${savedCount})`}
            className="relative h-9 px-3 rounded-full bg-primary-container text-on-primary-container flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
          >
            <span
              className="material-symbols-outlined text-[17px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bookmark
            </span>
            <span className="font-label-sm text-label-sm font-extrabold">{savedCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
