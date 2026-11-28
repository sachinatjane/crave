import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DESSERT_CATEGORIES, RECIPE_SUMMARIES as RECIPES } from '../data/catalog';
import { DessertCategory, Recipe, UnitSystem } from '../types/recipe';
import { getSiteRootPath } from '../utils/assetUrl';
import {
  buildShoppingListText,
  formatScaledIngredient,
  getHealthyIngredientSwap,
  renderStepInstruction
} from '../utils/scaler';
import { buildDeepRecipeUrl } from '../utils/shareEngine';
import { triggerHaptic } from '../utils/audioHaptics';
import { AdUnit } from './AdUnit';
import { EbookPromoCard } from './EbookPromoCard';
import { SafeImage } from './SafeImage';

interface RecipeDetailViewProps {
  recipe: Recipe;
  servings: number;
  unit: UnitSystem;
  isSaved: boolean;
  isMade: boolean;
  checkedItems: Record<string, boolean>;
  onChangeServings: (next: number) => void;
  onChangeUnit: (next: UnitSystem) => void;
  onToggleIngredient: (ingredientId: string) => void;
  onToggleSave: () => void;
  onMarkMade: () => void;
  onStartCookMode: (startStepIndex?: number) => void;
  onOpenShare: (format?: 'story' | 'pinterest', madeBadge?: boolean) => void;
  onSelectCategory?: (cat: DessertCategory) => void;
  onOpenRecipe?: (recipe: Recipe) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  servings,
  unit,
  isSaved,
  isMade,
  checkedItems,
  onChangeServings,
  onChangeUnit,
  onToggleIngredient,
  onToggleSave,
  onMarkMade,
  onStartCookMode,
  onOpenShare,
  onSelectCategory,
  onOpenRecipe,
  onToast
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [healthyMode, setHealthyMode] = useState(Boolean(recipe.zeroRefinedSugar));
  const ingredientsRef = useRef<HTMLDivElement>(null);

  const displayKcal =
    healthyMode && !recipe.zeroRefinedSugar ? Math.round(recipe.kcal * 0.72) : recipe.kcal;

  const rootPath = getSiteRootPath();
  const catMeta = DESSERT_CATEGORIES.find((c) => c.id === recipe.dessertCategory);
  const relatedRecipes = useMemo(
    () =>
      RECIPES.filter(
        (r) => r.id !== recipe.id && r.dessertCategory === recipe.dessertCategory
      ).slice(0, 4),
    [recipe.id, recipe.dessertCategory]
  );

  const handleCopyShoppingList = async () => {
    triggerHaptic(20);
    const url = buildDeepRecipeUrl(recipe.slug, servings, unit);
    const listText = buildShoppingListText(recipe, servings, unit, url);
    try {
      await navigator.clipboard.writeText(listText);
      onToast('Ingredient checklist copied for Notes / WhatsApp!', 'checklist');
    } catch {
      onToast('Checklist ready to share!', 'checklist');
    }
  };

  const handleWhatsAppList = () => {
    triggerHaptic(20);
    const url = buildDeepRecipeUrl(recipe.slug, servings, unit);
    const listText = buildShoppingListText(recipe, servings, unit, url);
    window.open(`https://wa.me/?text=${encodeURIComponent(listText)}`, '_blank', 'noopener,noreferrer');
  };

  const handleMadeItClick = () => {
    triggerHaptic([35, 30, 60]);
    onMarkMade();
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 1400);
    onToast('Awesome bake! Share your "I Made This!" Story Card 🎉', 'celebration');
    window.setTimeout(() => {
      onOpenShare('story', true);
    }, 550);
  };

  const stepUnit = recipe.baseServings <= 2 ? 1 : 2;
  const minServings = recipe.baseServings <= 2 ? 1 : 2;

  return (
    <article className="flex flex-col w-full pb-28 max-w-3xl mx-auto">
      {/* Semantic Breadcrumb Trail */}
      <nav
        aria-label="Breadcrumb"
        className="px-gutter py-2 flex items-center gap-1.5 text-[11px] font-semibold text-secondary overflow-x-auto no-scrollbar whitespace-nowrap"
      >
        <a
          href={rootPath}
          onClick={(e) => {
            if (onSelectCategory) {
              e.preventDefault();
              onSelectCategory('all');
            }
          }}
          className="hover:text-primary transition-colors"
        >
          Home
        </a>
        <span aria-hidden="true">›</span>
        <a
          href={`${rootPath}category/${recipe.dessertCategory}/`}
          onClick={(e) => {
            if (onSelectCategory) {
              e.preventDefault();
              onSelectCategory(recipe.dessertCategory);
            }
          }}
          className="hover:text-primary transition-colors"
        >
          {catMeta?.label || 'Desserts'}
        </a>
        <span aria-hidden="true">›</span>
        <span className="text-on-surface truncate max-w-[180px]" aria-current="page">
          {recipe.title}
        </span>
      </nav>

      {/* Confetti Burst */}
      {showConfetti && (
        <div className="fixed inset-x-0 top-20 z-50 pointer-events-none flex justify-center gap-3 overflow-hidden h-36">
          {['🍫', '✨', '🍓', '💚', '🎉', '🔥', '🍪', '⭐'].map((emoji, idx) => (
            <span
              key={idx}
              className="confetti-piece text-2xl"
              style={{ animationDelay: `${idx * 65}ms` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full aspect-[4/5] max-h-[500px] overflow-hidden bg-inverse-surface sm:rounded-b-lg">
        <SafeImage
          src={recipe.heroImage}
          alt={recipe.title}
          className="w-full h-full object-cover"
          eager
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/35 to-transparent" />

        {/* Top Floating Metric Pills */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-inverse-surface/85 backdrop-blur-md shadow-md">
            <span
              className="material-symbols-outlined text-[16px] text-tertiary-fixed"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-label-md text-label-md text-inverse-on-surface tracking-wider uppercase">
              {recipe.viewsLabel}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface">
            <span
              className="material-symbols-outlined text-[16px] text-tertiary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-label-md text-label-md font-bold">
              {recipe.rating.toFixed(1)}
            </span>
            <span className="font-label-sm text-label-sm text-secondary">
              ({recipe.ratingCount})
            </span>
          </div>
        </div>

        {/* Bottom Scrim Title */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm">
              {recipe.badgeChip.toUpperCase()}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest/85 backdrop-blur-sm text-on-surface-variant font-label-sm text-label-sm">
              {recipe.cuisine.toUpperCase()} • ZERO LOGIN
            </span>
          </div>
          <h1 className="font-headline-lg-mobile sm:font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-inverse-on-surface leading-tight drop-shadow-sm">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
            </div>
            <p className="font-label-md text-label-md text-inverse-on-surface/90">
              By <span className="font-bold text-primary-fixed">{recipe.creatorHandle}</span> •{' '}
              {displayKcal} kcal / serving
            </p>
          </div>
        </div>
      </div>

      {/* Quick Social Proof Bar */}
      <div className="px-gutter py-3 bg-surface-container-low flex items-center justify-between gap-2 text-on-secondary-container flex-wrap">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-[18px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            thumb_up
          </span>
          <span className="font-label-md text-label-md font-bold">
            {recipe.remakeSuccessRate} Make Again Rate
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-secondary">
            Ready in {recipe.totalMin} mins
          </span>
          {recipe.zeroMixer && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
              <span className="font-label-sm text-label-sm text-secondary">Zero Mixer Needed</span>
            </>
          )}
        </div>
      </div>

      {/* Macro Stats & Yield Scaler */}
      <div className="px-gutter mt-space-md flex flex-col gap-space-md">
        <div className="grid grid-cols-4 gap-2 p-3 bg-surface-container rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-center text-center py-1">
            <span className="material-symbols-outlined text-[20px] text-primary">timer</span>
            <span className="font-label-sm text-label-sm text-secondary mt-1">PREP</span>
            <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
              {recipe.prepMin}m
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center py-1">
            <span className="material-symbols-outlined text-[20px] text-primary">oven_gen</span>
            <span className="font-label-sm text-label-sm text-secondary mt-1">BAKE</span>
            <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
              {recipe.bakeMin}m
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center py-1">
            <span className="material-symbols-outlined text-[20px] text-tertiary">pace</span>
            <span className="font-label-sm text-label-sm text-secondary mt-1">TOTAL</span>
            <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
              {recipe.totalMin}m
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center py-1">
            <span className="material-symbols-outlined text-[20px] text-primary">psychology</span>
            <span className="font-label-sm text-label-sm text-secondary mt-1">SKILL</span>
            <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
              {recipe.skill}
            </span>
          </div>
        </div>

        {/* Inline Healthy eBook Cross-Link */}
        <EbookPromoCard
          variant="inline"
          contextLabel="Want Zero Refined Sugar & <250 Cal Swaps?"
        />

        {/* High-RPM Upper-Mid Ad Slot */}
        <AdUnit
          key={`${recipe.id}-top`}
          placementId={`${recipe.id}-top`}
          className="px-0"
          minHeightClass="min-h-[100px]"
        />

        {/* Servings Stepper + Unit System */}
        <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">groups</span>
              <div>
                <span className="font-title-md text-title-md text-on-surface block">
                  Yield / Servings
                </span>
                <span className="font-label-sm text-label-sm text-secondary">
                  Auto-scales ingredients &amp; Cook Mode
                </span>
              </div>
            </div>

            <div className="flex items-center bg-surface-container-high rounded-full p-1 shadow-inner">
              <button
                type="button"
                aria-label="Decrease servings"
                onClick={() => {
                  triggerHaptic(15);
                  onChangeServings(Math.max(minServings, servings - stepUnit));
                }}
                className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center active:scale-90 transition-transform shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="w-10 text-center font-headline-sm text-headline-sm text-on-surface tabular-nums">
                {servings}
              </span>
              <button
                type="button"
                aria-label="Increase servings"
                onClick={() => {
                  triggerHaptic(15);
                  onChangeServings(Math.min(24, servings + stepUnit));
                }}
                className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center active:scale-90 transition-transform shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
              Unit System
            </span>
            <div className="flex bg-surface-container-high p-1 rounded-full text-on-surface">
              <button
                type="button"
                onClick={() => onChangeUnit('us')}
                className={`px-3.5 py-1 rounded-full font-label-md text-label-md transition-all ${
                  unit === 'us'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                US Customary
              </button>
              <button
                type="button"
                onClick={() => onChangeUnit('metric')}
                className={`px-3.5 py-1 rounded-full font-label-md text-label-md transition-all ${
                  unit === 'metric'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                Metric
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Ingredients Section */}
      <div ref={ingredientsRef} className="px-gutter mt-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Ingredients</h2>
            <p className="font-body-sm text-body-sm text-secondary">
              Tap items as you prep • Saved locally
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyShoppingList}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copy List</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsAppList}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#25D366]/15 text-[#128C7E] font-label-md text-label-md shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Healthy Swap (Zero Refined Sugar) Mode Toggle */}
        <div className="p-2.5 rounded-lg bg-[#e8f8f2] border border-pistachio/25 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-pistachio-dark shrink-0">
              eco
            </span>
            <div className="min-w-0">
              <span className="block font-label-md text-label-md text-pistachio-dark font-extrabold">
                {recipe.zeroRefinedSugar
                  ? 'Naturally Zero Refined Sugar ✓'
                  : healthyMode
                  ? `Healthy Swap Active (~${displayKcal} kcal)`
                  : 'Make It Zero Refined Sugar'}
              </span>
              <span className="block font-body-sm text-body-sm text-on-surface-variant truncate">
                {recipe.zeroRefinedSugar
                  ? 'Made with whole foods & natural sweetness'
                  : '1-tap swap: Monk fruit, oat/almond flour & Greek yogurt'}
              </span>
            </div>
          </div>
          {!recipe.zeroRefinedSugar && (
            <div className="flex bg-white p-0.5 rounded-full shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setHealthyMode(false)}
                className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all ${
                  !healthyMode ? 'bg-inverse-surface text-white' : 'text-secondary'
                }`}
              >
                Classic
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  setHealthyMode(true);
                }}
                className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all ${
                  healthyMode ? 'bg-pistachio text-white font-bold' : 'text-pistachio-dark'
                }`}
              >
                🌿 Healthy
              </button>
            </div>
          )}
        </div>

        {recipe.ingredientGroups.map((group) => (
          <div
            key={group.title}
            className={`flex flex-col gap-2 p-space-md rounded-lg shadow-sm ${
              group.tone === 'tertiary' ? 'bg-surface-container-low' : 'bg-surface-container'
            }`}
          >
            <div className="flex items-center justify-between pb-1">
              <span
                className={`font-label-lg text-label-lg uppercase tracking-wide ${
                  group.tone === 'tertiary' ? 'text-tertiary' : 'text-primary'
                }`}
              >
                {group.title}
              </span>
              <span
                className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold ${
                  group.tone === 'tertiary'
                    ? 'bg-tertiary-container/15 text-tertiary-container'
                    : 'bg-primary-fixed text-on-primary-fixed-variant'
                }`}
              >
                {group.badge}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {group.items.map((item) => {
                const checked = Boolean(checkedItems[item.id]);
                const qtyLabel = formatScaledIngredient(
                  item,
                  servings,
                  recipe.baseServings,
                  unit
                );
                const swap = healthyMode
                  ? getHealthyIngredientSwap(item.name)
                  : { text: item.name, swapped: false };
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      onToggleIngredient(item.id);
                    }}
                    className="flex items-center justify-between p-3 rounded-DEFAULT bg-surface-container-lowest active:bg-surface-container transition-colors text-left min-h-[48px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          checked
                            ? 'bg-pistachio text-white animate-pop'
                            : 'bg-surface-container-highest text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                      <div className="min-w-0">
                        <span
                          className={`font-body-md text-body-md text-on-surface transition-all ${
                            checked ? 'line-through opacity-40' : ''
                          }`}
                        >
                          {swap.text}
                        </span>
                        {swap.swapped && (
                          <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded-full bg-[#e8f8f2] text-pistachio-dark font-label-sm text-[9px] font-extrabold uppercase">
                            Swapped
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-title-md text-title-md text-primary shrink-0 ml-3 tabular-nums">
                      {qtyLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* High-RPM Middle-Post Ad Slot (Between Ingredients & Steps) */}
      <AdUnit
        key={`${recipe.id}-mid`}
        placementId={`${recipe.id}-mid`}
        minHeightClass="min-h-[250px]"
      />

      {/* Step-by-Step Instructions */}
      <div className="px-gutter mt-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Step-by-Step Guide
            </h2>
            <p className="font-body-sm text-body-sm text-secondary">
              Tap any step timer to launch Cook Mode right there
            </p>
          </div>
          <span className="material-symbols-outlined text-[24px] text-tertiary">
            restaurant_menu
          </span>
        </div>

        {recipe.steps.map((step, idx) => {
          const renderedText = renderStepInstruction(
            step.instructionTemplate,
            recipe,
            servings,
            unit
          );
          return (
            <div
              key={step.stepNumber}
              id={`step-${step.stepNumber}`}
              className="flex flex-col bg-surface-container-lowest rounded-lg p-space-md shadow-sm gap-space-sm scroll-mt-20"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md flex items-center justify-center font-bold shrink-0">
                    {step.stepNumber}
                  </span>
                  <h3 className="font-title-md text-title-md text-on-surface truncate">
                    {step.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onStartCookMode(idx)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-primary-fixed text-on-surface font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">timer</span>
                  <span>{step.durationMin}m</span>
                </button>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {renderedText}
              </p>

              {step.image && (
                <div className="w-full aspect-[16/9] rounded-DEFAULT overflow-hidden mt-1">
                  <SafeImage
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {step.creatorSecret && (
                <div className="flex items-start gap-2.5 p-3 rounded-DEFAULT bg-tertiary-fixed/35 text-on-tertiary-fixed">
                  <span
                    className="material-symbols-outlined text-[20px] text-tertiary shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lightbulb
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-tertiary">
                      Creator Secret
                    </span>
                    <p className="font-body-sm text-body-sm mt-0.5">{step.creatorSecret}</p>
                  </div>
                </div>
              )}

              {step.criticalTip && (
                <div className="flex items-center gap-2 p-3 rounded-DEFAULT bg-primary-fixed/40 text-on-primary-fixed-variant">
                  <span
                    className="material-symbols-outlined text-[20px] text-primary shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    ac_unit
                  </span>
                  <p className="font-label-md text-label-md">{step.criticalTip}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Editorial Nutrition, Storage & Meal-Prep Guide (Boosts AdSense Contextual RPM & Time-on-Page) */}
      <section className="px-gutter mt-space-lg">
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Nutrition, Storage &amp; Healthy Prep Notes
          </h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-DEFAULT bg-surface-container-lowest">
              <span className="block font-label-sm text-label-sm text-secondary">CALORIES</span>
              <span className="font-title-md text-title-md text-primary font-extrabold">
                {displayKcal} kcal
              </span>
            </div>
            <div className="p-2.5 rounded-DEFAULT bg-surface-container-lowest">
              <span className="block font-label-sm text-label-sm text-secondary">SERVINGS</span>
              <span className="font-title-md text-title-md text-on-surface font-extrabold">
                {servings}
              </span>
            </div>
            <div className="p-2.5 rounded-DEFAULT bg-surface-container-lowest">
              <span className="block font-label-sm text-label-sm text-secondary">SUGAR MODE</span>
              <span className="font-title-md text-title-md text-pistachio-dark font-extrabold">
                {healthyMode || recipe.zeroRefinedSugar ? 'Zero Refined' : 'Classic'}
              </span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <strong>Make-Ahead &amp; Storage:</strong> Keep {recipe.title.toLowerCase()} in an airtight glass container in the refrigerator for up to 4 days (or freeze individual portions up to 1 month). Pair with unsweetened Greek yogurt, fresh berries, or espresso for a balanced treat.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <strong>Keto &amp; Low-Sugar Tip:</strong> Toggle <em>Healthy Swap</em> above to substitute refined sugar with monk fruit or coconut sugar and white flour with oat or almond flour.
          </p>
        </div>
      </section>

      {/* High-RPM Post-Recipe Ad Slot */}
      <AdUnit
        key={`${recipe.id}-bottom`}
        placementId={`${recipe.id}-bottom`}
        minHeightClass="min-h-[250px]"
      />

      {/* 1-Tap "I Made This!" Viral Trigger */}
      <div className="px-gutter mt-space-lg">
        <div className="p-space-md rounded-lg bg-gradient-to-br from-inverse-surface to-[#271811] text-inverse-on-surface flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-wider">
                Zero-Login Celebration
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold">
                Did you bake this dessert?
              </h3>
            </div>
            <span className="text-2xl">🏆</span>
          </div>
          <p className="font-body-sm text-body-sm text-inverse-on-surface/80">
            Tap below to unlock your custom &ldquo;I Made This!&rdquo; 9:16 Story Card &amp; Pinterest Pin to share with friends.
          </p>
          <button
            type="button"
            onClick={handleMadeItClick}
            className="w-full h-12 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">celebration</span>
            <span>{isMade ? 'Share My Remake Card Again!' : 'I Made This! Unlock Story Card'}</span>
          </button>
        </div>
      </div>

      {/* eBook Banner inside Recipe Page */}
      <div className="px-gutter mt-space-md">
        <EbookPromoCard variant="banner" />
      </div>

      {/* Community Remakes Carousel */}
      {recipe.ugcQuotes.length > 0 && (
        <div className="mt-space-lg flex flex-col gap-space-md">
          <div className="px-gutter flex items-center justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Viral Community Bakes
              </h3>
              <p className="font-body-sm text-body-sm text-secondary">
                {recipe.ratingCount} bakers made this recently
              </p>
            </div>
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
              {recipe.shortTag}
            </span>
          </div>

          <div className="flex overflow-x-auto gap-space-md px-gutter pb-2 no-scrollbar">
            {recipe.ugcQuotes.map((ugc) => (
              <div
                key={ugc.id}
                className="shrink-0 w-64 bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-surface-container-highest">
                  <SafeImage
                    src={ugc.image}
                    alt={`Bake by ${ugc.handle}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-inverse-surface/80 text-inverse-on-surface font-label-sm text-label-sm">
                    {ugc.handle}
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <div className="flex items-center text-tertiary-container">
                    {Array.from({ length: ugc.rating }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[15px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface italic line-clamp-2">
                    &ldquo;{ugc.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Recipes Internal Linking (SEO + Discovery) */}
      {relatedRecipes.length > 0 && (
        <section className="px-gutter mt-space-lg flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              More {catMeta?.label || 'Dessert'} Recipes
            </h3>
            <a
              href={`${rootPath}category/${recipe.dessertCategory}/`}
              onClick={(e) => {
                if (onSelectCategory) {
                  e.preventDefault();
                  onSelectCategory(recipe.dessertCategory);
                }
              }}
              className="font-label-sm text-label-sm text-primary uppercase font-bold"
            >
              View All →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-space-sm">
            {relatedRecipes.map((rel) => (
              <a
                key={rel.id}
                href={`${rootPath}recipes/${rel.slug}/`}
                onClick={(e) => {
                  if (onOpenRecipe) {
                    e.preventDefault();
                    onOpenRecipe(rel);
                  }
                }}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container-low transition-colors"
              >
                <SafeImage
                  src={rel.thumbImage}
                  alt={rel.title}
                  className="w-14 h-14 rounded-DEFAULT object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-label-sm text-label-sm text-primary">{rel.totalMin}m • {rel.viewsLabel}</p>
                  <p className="font-body-sm text-body-sm text-on-surface font-bold line-clamp-2">
                    {rel.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Social Action HUD */}
      <div className="fixed bottom-3 left-4 right-4 z-40 max-w-[480px] mx-auto pb-safe flex items-center gap-2">
        <button
          type="button"
          onClick={() => onStartCookMode(0)}
          className="flex-1 h-14 rounded-full bg-inverse-surface text-inverse-on-surface flex items-center justify-between px-5 shadow-2xl active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-title-md text-title-md leading-none text-surface-container-lowest">
                Cook Mode
              </span>
              <span className="font-label-sm text-label-sm text-tertiary-fixed leading-none mt-1">
                Screen stays awake
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-surface-container-highest">
            arrow_forward
          </span>
        </button>

        <button
          type="button"
          aria-label="Save Recipe"
          onClick={onToggleSave}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform shrink-0 ${
            isSaved
              ? 'bg-pistachio text-white'
              : 'bg-primary-container text-on-primary-container'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
          >
            {isSaved ? 'bookmark_added' : 'bookmark'}
          </span>
        </button>

        <button
          type="button"
          aria-label="Share Recipe Story Card"
          onClick={() => onOpenShare('story', false)}
          className="w-14 h-14 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-2xl active:scale-95 transition-transform shrink-0"
        >
          <span className="material-symbols-outlined text-[22px] text-primary">send</span>
        </button>
      </div>
    </article>
  );
};
