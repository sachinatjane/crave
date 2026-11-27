import React, { useState } from 'react';
import { DESSERT_CATEGORIES } from '../data/recipes';
import { Recipe, UnitSystem } from '../types/recipe';
import {
  formatScaledIngredient,
  getHealthyIngredientSwap,
  renderStepInstruction
} from '../utils/scaler';
import { triggerHaptic } from '../utils/audioHaptics';
import { AdUnit } from './AdUnit';
import { SafeImage } from './SafeImage';

interface AutoLoadedRecipeBlockProps {
  recipe: Recipe;
  index: number;
  unit: UnitSystem;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe, stepIndex?: number) => void;
  onOpenShare: (recipe: Recipe, format?: 'story' | 'pinterest') => void;
  onOpenRecipe?: (recipe: Recipe) => void;
}

export const AutoLoadedRecipeBlock: React.FC<AutoLoadedRecipeBlockProps> = ({
  recipe,
  index,
  unit: initialUnit,
  isSaved,
  onToggleSave,
  onStartCookMode,
  onOpenShare,
  onOpenRecipe
}) => {
  const [servings, setServings] = useState(recipe.baseServings);
  const [unit, setUnit] = useState<UnitSystem>(initialUnit);
  const [healthyMode, setHealthyMode] = useState(Boolean(recipe.zeroRefinedSugar));
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const catMeta = DESSERT_CATEGORIES.find((c) => c.id === recipe.dessertCategory);
  const displayKcal =
    healthyMode && !recipe.zeroRefinedSugar ? Math.round(recipe.kcal * 0.72) : recipe.kcal;
  const stepUnit = recipe.baseServings <= 2 ? 1 : 2;
  const minServings = recipe.baseServings <= 2 ? 1 : 2;

  return (
    <section
      aria-label={`Up next recipe: ${recipe.title}`}
      className="mt-space-xl pt-space-lg border-t-4 border-primary/20 flex flex-col"
    >
      {/* Up Next Banner */}
      <div className="px-gutter mb-space-sm flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 bg-primary-container/15 text-primary px-3 py-1 rounded-full">
          <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
          <span className="font-label-sm text-label-sm font-extrabold uppercase tracking-wider">
            Up Next #{index + 1} • {catMeta?.label || 'Dessert'}
          </span>
        </div>
        {onOpenRecipe && (
          <button
            type="button"
            onClick={() => onOpenRecipe(recipe)}
            className="font-label-sm text-label-sm text-primary font-bold hover:underline"
          >
            Open Full Page →
          </button>
        )}
      </div>

      {/* Hero Photo & Title */}
      <div className="px-gutter">
        <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[16/10] bg-surface-container">
          <SafeImage
            src={recipe.heroImage}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {recipe.zeroRefinedSugar && (
                <span className="px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[10px] font-extrabold uppercase">
                  🌿 Zero Refined Sugar
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                ⏱ {recipe.totalMin} mins
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                ★ {recipe.rating.toFixed(1)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                🔥 {displayKcal} cal
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm sm:text-headline-md font-extrabold leading-tight">
              {recipe.title}
            </h2>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mt-3">{recipe.hookLine}</p>
      </div>

      {/* Quick Action Bar + Healthy Swap + Scaler */}
      <div className="px-gutter mt-space-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-surface-container-high rounded-full p-1">
          <button
            type="button"
            aria-label="Decrease servings"
            onClick={() => {
              triggerHaptic(12);
              setServings((s) => Math.max(minServings, s - stepUnit));
            }}
            className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center font-bold"
          >
            −
          </button>
          <span className="px-2 font-label-md text-label-md font-extrabold text-on-surface">
            {servings} serv
          </span>
          <button
            type="button"
            aria-label="Increase servings"
            onClick={() => {
              triggerHaptic(12);
              setServings((s) => s + stepUnit);
            }}
            className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center font-bold"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setHealthyMode((v) => !v);
            }}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm font-bold transition-colors ${
              healthyMode
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {healthyMode ? '🌿 Healthy Swap ON' : '🌿 Healthy Swap'}
          </button>
          <button
            type="button"
            onClick={() => setUnit((u) => (u === 'us' ? 'metric' : 'us'))}
            className="px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold"
          >
            {unit === 'us' ? 'US Cups' : 'Metric (g)'}
          </button>
        </div>
      </div>

      {/* Ingredients */}
      <div className="px-gutter mt-space-md">
        <h3 className="font-title-md text-title-md text-on-surface font-extrabold mb-2">
          Ingredients ({servings} servings)
        </h3>
        <div className="flex flex-col gap-3">
          {recipe.ingredientGroups.map((group, gIdx) => (
            <div
              key={`${recipe.id}-g-${gIdx}`}
              className="rounded-lg bg-surface-container-lowest p-3 shadow-sm"
            >
              <p className="font-label-sm text-label-sm text-primary uppercase font-extrabold mb-2">
                {group.title}
              </p>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => {
                  const isChecked = Boolean(checked[item.id]);
                  const swap = healthyMode ? getHealthyIngredientSwap(item.name) : null;
                  const amount = formatScaledIngredient(
                    item,
                    servings,
                    recipe.baseServings,
                    unit
                  );
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className="w-full flex items-start gap-2.5 text-left"
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-primary border-primary text-white'
                              : 'border-outline-variant bg-surface'
                          }`}
                        >
                          {isChecked && (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          )}
                        </span>
                        <span
                          className={`font-body-sm text-body-sm ${
                            isChecked ? 'line-through text-secondary' : 'text-on-surface'
                          }`}
                        >
                          <strong className="text-primary">{amount}</strong>{' '}
                          {swap?.swapped ? swap.text : item.name}
                          {swap?.swapped && (
                            <span className="ml-1.5 text-[10px] font-bold text-[#059669] bg-[#e8f8f2] px-1.5 py-0.5 rounded">
                              🌿 Healthy Swap
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="px-gutter mt-space-md">
        <h3 className="font-title-md text-title-md text-on-surface font-extrabold mb-2">
          Step-by-Step Instructions
        </h3>
        <ol className="flex flex-col gap-3">
          {recipe.steps.map((step) => (
            <li
              key={`${recipe.id}-s-${step.stepNumber}`}
              className="rounded-lg bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-label-sm text-label-sm text-primary font-extrabold uppercase">
                  Step {step.stepNumber} • {step.phaseLabel}
                </span>
                <span className="font-label-sm text-label-sm text-secondary">
                  ⏱ {step.durationMin}m
                </span>
              </div>
              <h4 className="font-title-sm text-title-sm text-on-surface font-bold">
                {step.title}
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {renderStepInstruction(step.instructionTemplate, recipe, servings, unit)}
              </p>
              {step.creatorSecret && (
                <p className="mt-1 text-xs bg-tertiary-container/15 text-on-surface px-3 py-2 rounded-DEFAULT">
                  <strong>💡 Chef Tip:</strong> {step.creatorSecret}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="px-gutter mt-space-md flex items-center gap-2">
        <button
          type="button"
          onClick={() => onStartCookMode(recipe, 0)}
          className="flex-1 h-11 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Start Cook Mode</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleSave(recipe)}
          className={`px-4 h-11 rounded-full font-label-md text-label-md font-bold flex items-center gap-1 shadow-sm ${
            isSaved
              ? 'bg-pistachio text-white'
              : 'bg-primary-container text-on-primary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSaved ? 'bookmark_added' : 'bookmark'}
          </span>
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
        <button
          type="button"
          onClick={() => onOpenShare(recipe, 'story')}
          aria-label={`Share ${recipe.title}`}
          className="w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>

      {/* High-RPM In-Feed Ad Slot */}
      <div className="px-gutter mt-space-md">
        <AdUnit placementId={`infinite-recipe-${recipe.id}`} />
      </div>
    </section>
  );
};
