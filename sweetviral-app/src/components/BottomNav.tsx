import React from 'react';
import { AppTab } from '../types/recipe';

interface BottomNavProps {
  activeTab: AppTab;
  savedCount: number;
  onSelectTab: (tab: AppTab) => void;
  onLaunchCookMode: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  savedCount,
  onSelectTab,
  onLaunchCookMode
}) => {
  const itemClass = (tab: AppTab) =>
    `flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[44px] rounded-full transition-transform active:scale-95 ${
      activeTab === tab
        ? 'text-primary font-bold'
        : 'text-on-surface-variant hover:text-on-surface'
    }`;

  return (
    <nav
      aria-label="Primary Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 pb-safe pointer-events-none"
    >
      <div className="px-gutter pb-space-sm w-full max-w-lg mx-auto pointer-events-auto">
        <div className="bg-surface-container-lowest/92 backdrop-blur-2xl rounded-full px-space-xs py-space-2xs shadow-[0_12px_32px_-6px_rgba(30,19,14,0.16),0_4px_12px_-2px_rgba(225,29,72,0.08)] border border-white/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelectTab('trending')}
            className={itemClass('trending')}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{
                fontVariationSettings: activeTab === 'trending' ? "'FILL' 1" : "'FILL' 0"
              }}
            >
              local_fire_department
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">Trending</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('discover')}
            className={itemClass('discover')}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{
                fontVariationSettings: activeTab === 'discover' ? "'FILL' 1" : "'FILL' 0"
              }}
            >
              explore
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">Pantry</span>
          </button>

          <button
            type="button"
            onClick={onLaunchCookMode}
            className="flex flex-col items-center justify-center min-h-[44px] px-space-sm -my-space-xs py-2 rounded-full bg-primary-container text-on-primary-container shadow-[0_6px_20px_rgba(225,29,72,0.38)] active:scale-95 transition-transform shrink-0"
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span className="font-label-md text-label-md uppercase tracking-wider font-extrabold whitespace-nowrap">
                Cook Mode
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('saved')}
            className={itemClass('saved')}
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{
                  fontVariationSettings: activeTab === 'saved' ? "'FILL' 1" : "'FILL' 0"
                }}
              >
                bookmark
              </span>
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[9px] font-extrabold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </div>
            <span className="font-label-sm text-label-sm mt-0.5">Saved</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('remakes')}
            className={itemClass('remakes')}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{
                fontVariationSettings: activeTab === 'remakes' ? "'FILL' 1" : "'FILL' 0"
              }}
            >
              videocam
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">Remakes</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
