import React from 'react';
import { RECIPE_SUMMARIES as RECIPES } from '../data/catalog';
import { Recipe } from '../types/recipe';
import { EbookPromoCard } from './EbookPromoCard';
import { SafeImage } from './SafeImage';

interface SavedViewProps {
  savedIds: string[];
  madeIds: string[];
  onToggleSave: (recipe: Recipe) => void;
  onOpenRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onOpenShare: (recipe: Recipe, format?: 'story' | 'pinterest') => void;
  onExploreTrending: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedIds,
  madeIds,
  onToggleSave,
  onOpenRecipe,
  onStartCookMode,
  onOpenShare,
  onExploreTrending
}) => {
  const savedRecipes = RECIPES.filter((r) => savedIds.includes(r.id));

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto px-gutter pt-space-sm gap-space-md">
      <div className="p-space-md rounded-lg bg-surface-container-low flex items-center justify-between gap-3">
        <div>
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
            No Account Needed • Stored On Your Device
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold">
            Your Saved Recipe Box ({savedRecipes.length})
          </h1>
          <p className="font-body-sm text-body-sm text-secondary mt-0.5">
            {madeIds.length > 0
              ? `You've baked ${madeIds.length} viral dessert${madeIds.length > 1 ? 's' : ''} so far! 🏆`
              : 'Bookmark any viral dessert for instant 1-tap Cook Mode access.'}
          </p>
        </div>
      </div>

      <EbookPromoCard variant="compact" />

      {savedRecipes.length === 0 ? (
        <div className="p-8 rounded-lg bg-surface-container-lowest shadow-sm text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">bookmark_add</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Your recipe box is empty
          </h2>
          <p className="font-body-md text-body-md text-secondary max-w-xs">
            Tap the bookmark icon on any TikTok, IG, or Pinterest hit to save it right here—zero sign-up required.
          </p>
          <button
            type="button"
            onClick={onExploreTrending}
            className="px-6 py-3 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-md active:scale-95 transition-transform"
          >
            Browse Trending Desserts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          {savedRecipes.map((recipe) => {
            const madeIt = madeIds.includes(recipe.id);
            return (
              <div
                key={recipe.id}
                onClick={() => onOpenRecipe(recipe)}
                className="flex gap-3 p-3 rounded-lg bg-surface-container-lowest shadow-sm cursor-pointer"
              >
                <SafeImage
                  src={recipe.thumbImage}
                  alt={recipe.title}
                  className="w-24 h-28 rounded-DEFAULT object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-sm text-label-sm text-primary uppercase">
                        {recipe.viewsLabel}
                      </span>
                      <button
                        type="button"
                        aria-label="Remove bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(recipe);
                        }}
                        className="text-primary"
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold line-clamp-2">
                      {recipe.title}
                    </h3>
                    {madeIt && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-pistachio/15 text-pistachio-dark font-label-sm text-label-sm font-bold">
                        ✓ Made It
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartCookMode(recipe);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <span>Cook Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenShare(recipe, 'story');
                      }}
                      className="px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
