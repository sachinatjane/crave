import React, { useMemo, useState } from 'react';
import { PANTRY_INGREDIENTS, RECIPE_SUMMARIES as RECIPES } from '../data/catalog';
import { Recipe } from '../types/recipe';
import { SafeImage } from './SafeImage';

interface SearchPantryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const SearchPantryModal: React.FC<SearchPantryModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe
}) => {
  const [query, setQuery] = useState('');
  const [selectedPantry, setSelectedPantry] = useState<string[]>([]);

  const togglePantry = (key: string) => {
    setSelectedPantry((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.map((recipe) => {
      const matchCount = selectedPantry.filter((k) =>
        recipe.pantryCore.includes(k)
      ).length;
      const textMatch =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.shortTag.toLowerCase().includes(q) ||
        recipe.cuisine.toLowerCase().includes(q) ||
        recipe.pantryCore.some((p) => p.includes(q)) ||
        recipe.pantryCore.some((k) => k.toLowerCase().includes(q)) ||
        recipe.hashtags.some((h) => h.toLowerCase().includes(q));
      return { recipe, matchCount, textMatch };
    })
      .filter((item) => item.textMatch)
      .filter((item) => selectedPantry.length === 0 || item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount || b.recipe.viewsNumeric - a.recipe.viewsNumeric)
      .slice(0, 30);
  }, [query, selectedPantry]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search 200 viral desserts and pantry ingredients"
      className="fixed inset-0 z-50 bg-inverse-surface/65 backdrop-blur-md flex flex-col justify-start pt-safe"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl mx-auto bg-surface rounded-b-xl sm:mt-4 sm:rounded-xl p-gutter shadow-2xl max-h-[86dvh] flex flex-col gap-space-sm">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px]">
              search
            </span>
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${RECIPES.length} desserts (tiramisu, pistachio, oreo...)`}
              className="w-full h-12 pl-10 pr-4 rounded-full bg-surface-container-low text-on-surface placeholder:text-secondary font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
              Tap What&apos;s In Your Kitchen
            </span>
            {selectedPantry.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedPantry([])}
                className="font-label-sm text-label-sm text-secondary underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {PANTRY_INGREDIENTS.map((item) => {
              const active = selectedPantry.includes(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => togglePantry(item.key)}
                  className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all active:scale-95 ${active
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-high text-on-surface'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pt-1 pb-2">
          {results.length === 0 ? (
            <div className="text-center py-8 text-secondary font-body-md">
              No desserts matched that exact combo — try clearing a pantry chip!
            </div>
          ) : (
            results.map(({ recipe, matchCount }) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => {
                  onSelectRecipe(recipe);
                  onClose();
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container-low text-left active:scale-[0.99] transition-all"
              >
                <SafeImage
                  src={recipe.thumbImage}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-DEFAULT object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm text-primary uppercase">
                      {recipe.viewsLabel}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary">
                      • {recipe.cuisine}
                    </span>
                    {matchCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pistachio/15 text-pistachio-dark font-label-sm text-label-sm">
                        {matchCount} match{matchCount > 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface truncate">
                    {recipe.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-secondary">
                    ⏱️ {recipe.totalMin} mins • ★ {recipe.rating.toFixed(1)}
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary">chevron_right</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
