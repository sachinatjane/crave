import React, { useMemo, useState } from 'react';
import { PANTRY_INGREDIENTS, RECIPES } from '../data/recipes';
import { Recipe, SocialPlatform } from '../types/recipe';
import { triggerHaptic } from '../utils/audioHaptics';
import { EbookPromoCard } from './EbookPromoCard';
import { SafeImage } from './SafeImage';

interface PantryDiscoverViewProps {
  onOpenRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onOpenShare: (recipe: Recipe, format?: 'story' | 'pinterest') => void;
}

const PLATFORMS: Array<{ id: SocialPlatform; name: string; tag: string }> = [
  { id: 'tiktok', name: 'TikTok Viral', tag: 'Short Cuts & ASMR' },
  { id: 'instagram', name: 'IG Reels', tag: 'Aesthetic Glazes' },
  { id: 'pinterest', name: 'Pinterest', tag: '2:3 Pin Ready' },
  { id: 'youtube', name: 'YouTube Shorts', tag: 'Quick Tutorials' },
  { id: 'facebook', name: 'Facebook Reels', tag: 'Family Hits' }
];

export const PantryDiscoverView: React.FC<PantryDiscoverViewProps> = ({
  onOpenRecipe,
  onStartCookMode,
  onOpenShare
}) => {
  const [selectedPantry, setSelectedPantry] = useState<string[]>(['chocolate', 'sugar']);
  const [maxMinutes, setMaxMinutes] = useState<number>(60);
  const [limit, setLimit] = useState(20);

  const toggleIngredient = (key: string) => {
    triggerHaptic(15);
    setLimit(20);
    setSelectedPantry((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const matchedRecipes = useMemo(() => {
    return RECIPES.filter((r) => r.totalMin <= maxMinutes)
      .map((recipe) => {
        const matches = selectedPantry.filter((p) => recipe.pantryCore.includes(p));
        return { recipe, matchCount: matches.length };
      })
      .sort((a, b) => b.matchCount - a.matchCount || b.recipe.viewsNumeric - a.recipe.viewsNumeric);
  }, [selectedPantry, maxMinutes]);

  const visible = matchedRecipes.slice(0, limit);

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto px-gutter pt-space-sm gap-space-md">
      <section className="p-space-md rounded-lg bg-gradient-to-br from-surface-container-high to-surface-container-low shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
              Zero-Login Pantry Engine • {RECIPES.length} Desserts
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold">
              What&apos;s In Your Kitchen?
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm">
            ≤ {maxMinutes}m
          </span>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Tap ingredients you already have — we instantly rank all {RECIPES.length} viral &amp; global desserts you can make right now.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {PANTRY_INGREDIENTS.map((ing) => {
            const active = selectedPantry.includes(ing.key);
            return (
              <button
                key={ing.key}
                type="button"
                onClick={() => toggleIngredient(ing.key)}
                className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                  active
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface'
                }`}
              >
                {ing.label}
              </button>
            );
          })}
        </div>

        <div className="pt-1">
          <div className="flex justify-between font-label-sm text-label-sm text-secondary mb-1">
            <span>Max Total Time</span>
            <span className="text-primary font-bold">{maxMinutes} mins</span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={maxMinutes}
            onChange={(e) => setMaxMinutes(Number(e.target.value))}
            className="w-full accent-[#e11d48]"
          />
        </div>
      </section>

      <EbookPromoCard variant="banner" />

      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Best Matches ({matchedRecipes.length})
          </h2>
          <span className="font-label-sm text-label-sm text-secondary">
            Showing {visible.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          {visible.map(({ recipe, matchCount }) => (
            <div
              key={recipe.id}
              onClick={() => onOpenRecipe(recipe)}
              className="flex gap-3 p-3 rounded-lg bg-surface-container-lowest shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
            >
              <SafeImage
                src={recipe.thumbImage}
                alt={recipe.title}
                className="w-24 h-28 rounded-DEFAULT object-cover shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {matchCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pistachio/15 text-pistachio-dark font-label-sm text-label-sm font-extrabold">
                        {matchCount} Pantry Match{matchCount > 1 ? 'es' : ''}
                      </span>
                    )}
                    <span className="font-label-sm text-label-sm text-secondary">
                      ⏱️ {recipe.totalMin}m • {recipe.cuisine}
                    </span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold mt-1 line-clamp-2">
                    {recipe.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartCookMode(recipe);
                    }}
                    className="px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span>Cook</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShare(recipe, 'story');
                    }}
                    className="px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">ios_share</span>
                    <span>Share Card</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {limit < matchedRecipes.length && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setLimit((l) => l + 20)}
              className="px-6 py-2.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md"
            >
              Show More Matches ({matchedRecipes.length - limit} left)
            </button>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-space-xs pt-2">
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
          Social Traffic Ready
        </span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
          Optimized For Every Social Feed
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PLATFORMS.map((p) => (
            <div key={p.id} className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-0.5">
              <span className="font-title-md text-title-md text-on-surface font-bold">
                {p.name}
              </span>
              <span className="font-body-sm text-body-sm text-secondary">{p.tag}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
