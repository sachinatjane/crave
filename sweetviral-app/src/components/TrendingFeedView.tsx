import React, { useEffect, useMemo, useState } from 'react';
import { DESSERT_CATEGORIES, RECIPES } from '../data/recipes';
import { CategoryTag, DessertCategory, Recipe, SocialPlatform } from '../types/recipe';
import { getSiteRootPath } from '../utils/assetUrl';
import { SafeImage } from './SafeImage';
import { triggerHaptic } from '../utils/audioHaptics';

interface TrendingFeedViewProps {
  savedIds: string[];
  initialCategory?: DessertCategory;
  onCategoryChange?: (cat: DessertCategory) => void;
  onToggleSave: (recipe: Recipe) => void;
  onOpenRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onOpenShare: (recipe: Recipe, format?: 'story' | 'pinterest') => void;
  onOpenRemakes: () => void;
}

const FILTER_PILLS: Array<{ id: CategoryTag; label: string }> = [
  { id: 'all', label: '✨ All Viral' },
  { id: 'under15', label: '⚡ Under 15 Mins' },
  { id: 'nobake', label: '❄️ No-Bake' },
  { id: 'three-ing', label: '🥣 3-4 Ingred.' },
  { id: 'airfryer', label: '🌪️ Air Fryer' },
  { id: 'vegan-gf', label: '🌱 Vegan / GF' }
];

const PLATFORM_CHIPS: Array<{ id: 'all' | SocialPlatform; label: string }> = [
  { id: 'all', label: 'All Social' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'IG Reels' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' }
];

type SortOption = 'viral' | 'fastest' | 'rating' | 'calories';
type RegionFilter = 'all' | 'usa' | 'europe';

const EUROPEAN_CUISINES = new Set([
  'French',
  'Italian',
  'British',
  'German',
  'Austrian',
  'Swiss',
  'Spanish',
  'Portuguese',
  'Dutch & Belgian',
  'Nordic',
  'Central & Eastern European',
  'Turkish / Greek',
  'Belgian',
  'Irish',
  'Polish',
  'Greek',
  'Croatian',
  'Ukrainian',
  'Norwegian',
  'American & European'
]);

const PAGE_SIZE = 24;

export const TrendingFeedView: React.FC<TrendingFeedViewProps> = ({
  savedIds,
  initialCategory = 'all',
  onCategoryChange,
  onToggleSave,
  onOpenRecipe,
  onStartCookMode,
  onOpenShare,
  onOpenRemakes
}) => {
  const [activeCategory, setActiveCategory] = useState<DessertCategory>(initialCategory);
  const [activeFilter, setActiveFilter] = useState<CategoryTag>('all');
  const [activePlatform, setActivePlatform] = useState<'all' | SocialPlatform>('all');
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('viral');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setActiveCategory(initialCategory);
    setVisibleCount(PAGE_SIZE);
  }, [initialCategory]);

  const selectCategory = (cat: DessertCategory) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
    onCategoryChange?.(cat);
  };

  const heroRecipe = RECIPES[0];
  const storyRadarRecipes = useMemo(() => RECIPES.slice(0, 16), []);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: RECIPES.length };
    for (const r of RECIPES) {
      map[r.dessertCategory] = (map[r.dessertCategory] || 0) + 1;
    }
    return map;
  }, []);

  const filteredRecipes = useMemo(() => {
    const list = RECIPES.filter((r) => {
      const catMainOk = activeCategory === 'all' || r.dessertCategory === activeCategory;
      const attrOk = activeFilter === 'all' || r.categories.includes(activeFilter);
      const platOk = activePlatform === 'all' || r.platforms.includes(activePlatform);
      const regionOk =
        activeRegion === 'all' ||
        (activeRegion === 'usa' &&
          (r.cuisine === 'American' ||
            r.cuisine === 'New Orleans' ||
            r.cuisine === 'American & European')) ||
        (activeRegion === 'europe' && EUROPEAN_CUISINES.has(r.cuisine));
      return catMainOk && attrOk && platOk && regionOk;
    });

    if (sortBy === 'fastest') {
      return [...list].sort((a, b) => a.totalMin - b.totalMin);
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating || b.viewsNumeric - a.viewsNumeric);
    }
    if (sortBy === 'calories') {
      return [...list].sort((a, b) => a.kcal - b.kcal);
    }
    return [...list].sort((a, b) => b.viewsNumeric - a.viewsNumeric);
  }, [activeCategory, activeFilter, activePlatform, activeRegion, sortBy]);

  const displayedRecipes = useMemo(
    () => filteredRecipes.slice(0, visibleCount),
    [filteredRecipes, visibleCount]
  );

  const rouletteRecipe = RECIPES[rouletteIndex % RECIPES.length];

  const handleSpinRoulette = () => {
    if (isSpinning) return;
    triggerHaptic([20, 30, 20]);
    setIsSpinning(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      setRouletteIndex(Math.floor(Math.random() * RECIPES.length));
      ticks++;
      if (ticks > 8) {
        window.clearInterval(timer);
        setIsSpinning(false);
        triggerHaptic(40);
      }
    }, 80);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto">
      {/* Top Viral Story Bubbles Rail */}
      <section className="w-full pt-space-xs pb-space-sm">
        <div className="flex items-center justify-between px-gutter mb-space-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-extrabold">
              Viral Radar ({RECIPES.length} Recipes)
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-secondary tracking-normal">
            Zero Sign-Up • Tap Any Trend
          </span>
        </div>

        <div className="flex gap-space-sm overflow-x-auto px-gutter no-scrollbar py-1 snap-x scroll-smooth">
          {storyRadarRecipes.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => onOpenRecipe(recipe)}
              className="flex flex-col items-center gap-1 shrink-0 snap-start group focus:outline-none"
            >
              <div className="w-[68px] h-[68px] rounded-full p-[2.5px] bg-gradient-to-tr from-primary via-tertiary-container to-amber-300 shadow-[0_4px_14px_rgba(225,29,72,0.20)] group-active:scale-95 transition-transform">
                <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-surface-container-lowest">
                  <SafeImage
                    src={recipe.thumbImage}
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-full"
                    eager
                  />
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface font-bold max-w-[74px] truncate text-center">
                {recipe.shortTag}
              </span>
              <span className="font-label-sm text-label-sm text-primary -mt-1 font-semibold">
                {recipe.storyViews}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Spotlight Hero Section: #1 Viral */}
      <section className="px-gutter w-full mt-space-xs">
        <div className="relative w-full rounded-lg overflow-hidden bg-surface-container-lowest shadow-[0_8px_30px_rgba(30,19,14,0.08)]">
          <div
            onClick={() => onOpenRecipe(heroRecipe)}
            className="relative w-full h-[380px] sm:h-[430px] cursor-pointer group"
          >
            <SafeImage
              src={heroRecipe.heroImage}
              alt={heroRecipe.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              eager
            />
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/40 to-transparent" />

            <div className="absolute top-space-sm left-space-sm right-space-sm flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                <span
                  className="material-symbols-outlined text-[16px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trending_up
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-extrabold tracking-wide uppercase">
                  {heroRecipe.badgeChip}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Share or Pin to Pinterest"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShare(heroRecipe, 'pinterest');
                  }}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-[#E60023] shadow-md active:scale-90 transition-transform"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    push_pin
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Bookmark hero recipe"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(heroRecipe);
                  }}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-primary shadow-md active:scale-90 transition-transform"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: savedIds.includes(heroRecipe.id)
                        ? "'FILL' 1"
                        : "'FILL' 0"
                    }}
                  >
                    bookmark
                  </span>
                </button>
              </div>
            </div>

            <div className="absolute bottom-space-sm left-space-sm right-space-sm flex flex-col gap-space-xs">
              <div className="inline-flex items-center gap-2 bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface px-2.5 py-1 rounded-full self-start">
                <span className="text-xs">🔥</span>
                <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold">
                  {heroRecipe.viewsLabel}
                </span>
                <span className="text-outline-variant text-[10px]">•</span>
                <span className="font-label-sm text-label-sm text-primary-fixed font-semibold">
                  {heroRecipe.remakeSuccessRate} Remake Success
                </span>
              </div>

              <h1 className="font-headline-lg-mobile sm:font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-white leading-tight font-extrabold drop-shadow-sm">
                {heroRecipe.title}
              </h1>

              <div className="flex items-center gap-space-xs text-white/95 font-label-md text-label-md pt-0.5 flex-wrap">
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[15px]">timer</span>
                  <span>{heroRecipe.totalMin} Mins</span>
                </div>
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[15px]">bar_chart</span>
                  <span>{heroRecipe.skill}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <span
                    className="material-symbols-outlined text-[15px] text-amber-300"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-bold">{heroRecipe.rating.toFixed(1)}</span>
                  <span className="text-white/70">({heroRecipe.ratingCount})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-space-sm bg-surface-container-lowest flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => onStartCookMode(heroRecipe)}
              className="flex-1 min-h-[48px] rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(225,29,72,0.32)] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Cook Mode</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenRecipe(heroRecipe)}
              className="flex-1 min-h-[48px] rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>Jump to Recipe</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Full Dessert Category Shelf */}
      <section className="w-full mt-space-md">
        <div className="px-gutter flex items-center justify-between mb-1.5">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-extrabold">
            Explore All Dessert Categories
          </span>
          <span className="font-label-sm text-label-sm text-secondary">
            {RECIPES.length} Total
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto px-gutter no-scrollbar pb-1">
          {DESSERT_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  selectCategory(cat.id);
                }}
                className={`shrink-0 px-3.5 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all active:scale-95 ${
                  active
                    ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                    : 'bg-surface-container-lowest text-on-surface shadow-sm'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-surface-container text-primary'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sticky Quick Attribute Filters + Platform Strip */}
      <section className="sticky top-16 z-30 bg-surface/95 backdrop-blur-xl py-space-xs mt-space-xs shadow-[0_2px_12px_rgba(39,24,17,0.04)]">
        <div className="flex gap-space-2xs overflow-x-auto px-gutter no-scrollbar scroll-smooth">
          {FILTER_PILLS.map((pill) => {
            const active = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  setActiveFilter(pill.id);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`shrink-0 px-space-md py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                  active
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-high text-on-surface font-semibold'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 px-gutter mt-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="font-label-sm text-label-sm text-secondary uppercase shrink-0 mr-0.5">
              From:
            </span>
            {PLATFORM_CHIPS.map((plat) => {
              const active = activePlatform === plat.id;
              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => {
                    setActivePlatform(plat.id);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                    active
                      ? 'bg-inverse-surface text-inverse-on-surface'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {plat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              aria-label="Filter by region"
              value={activeRegion}
              onChange={(e) => {
                setActiveRegion(e.target.value as RegionFilter);
                setVisibleCount(PAGE_SIZE);
              }}
              className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded-full outline-none"
            >
              <option value="all">🌎 All</option>
              <option value="usa">🇺🇸 USA</option>
              <option value="europe">🇪🇺 Europe</option>
            </select>
            <select
              aria-label="Sort recipes"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded-full outline-none"
            >
              <option value="viral">🔥 Viral</option>
              <option value="fastest">⚡ Fastest</option>
              <option value="rating">⭐ Top Rated</option>
              <option value="calories">🪶 Lightest</option>
            </select>
          </div>
        </div>
      </section>

      {/* Viral Recipe Feed Grid */}
      <section className="px-gutter w-full mt-space-md">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              {DESSERT_CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Trending'}
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
            {displayedRecipes.length} of {filteredRecipes.length}
          </span>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="p-6 rounded-lg bg-surface-container-low text-center flex flex-col items-center gap-2">
            <p className="font-body-md text-on-surface-variant">
              No desserts match that exact filter combo.
            </p>
            <button
              type="button"
              onClick={() => {
                selectCategory('all');
                setActiveFilter('all');
                setActivePlatform('all');
                setActiveRegion('all');
              }}
              className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md"
            >
              Show All {RECIPES.length} Desserts
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-sm w-full">
              {displayedRecipes.map((recipe) => {
                const isSaved = savedIds.includes(recipe.id);
                return (
                  <article
                    key={recipe.id}
                    onClick={() => onOpenRecipe(recipe)}
                    className="flex flex-col rounded-lg overflow-hidden bg-surface-container-lowest shadow-[0_4px_16px_rgba(30,19,14,0.06)] group cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container">
                      <SafeImage
                        src={recipe.thumbImage}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-inverse-surface/80 backdrop-blur-md px-2 py-0.5 rounded-full text-inverse-on-surface">
                        <span
                          className="material-symbols-outlined text-[13px] text-primary-fixed"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          play_circle
                        </span>
                        <span className="font-label-sm text-label-sm font-bold text-white">
                          {recipe.storyViews}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm max-w-[78%]">
                        <span className="material-symbols-outlined text-[13px] text-tertiary shrink-0">
                          public
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface truncate">
                          {recipe.cuisine}
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label={`Bookmark ${recipe.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(recipe);
                        }}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform ${
                          isSaved
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-lowest/85 text-on-surface'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>

                    <div className="p-space-xs flex flex-col justify-between flex-1 gap-space-2xs">
                      <h3 className="font-title-md text-title-md text-on-surface font-bold leading-snug line-clamp-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1 text-secondary font-label-sm text-label-sm">
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>{recipe.totalMin}m</span>
                        </div>
                        <div className="flex items-center gap-0.5 font-bold text-on-surface">
                          <span
                            className="material-symbols-outlined text-[14px] text-amber-500"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span>{recipe.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {visibleCount < filteredRecipes.length && (
              <div className="mt-space-md flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  className="px-6 py-3 rounded-full bg-inverse-surface text-inverse-on-surface font-label-lg text-label-lg shadow-md active:scale-95 transition-transform"
                >
                  Load More Recipes ({filteredRecipes.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Interactive Viral Bake Roulette (Spins across all 200 desserts!) */}
      <section className="px-gutter w-full mt-space-md">
        <div className="relative w-full p-space-md rounded-lg bg-gradient-to-br from-surface-container-high to-surface-container shadow-[0_8px_24px_rgba(30,19,14,0.06)] overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-space-xs shadow-md">
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isSpinning ? 'animate-spin' : ''
                }`}
              >
                casino
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-primary uppercase font-extrabold tracking-widest">
              {RECIPES.length}-Dessert Wheel
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold mt-0.5">
              Viral Bake Roulette
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-1">
              Spin across all {RECIPES.length} viral &amp; global desserts and jump straight into Cook Mode.
            </p>

            <div className="w-full max-w-md mt-space-sm p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between gap-2 shadow-sm min-h-[52px]">
              <button
                type="button"
                onClick={() => onOpenRecipe(rouletteRecipe)}
                className="flex items-center gap-2 pl-3 min-w-0 flex-1 text-left"
              >
                <span className="text-lg shrink-0">🍮</span>
                <span className="font-title-md text-title-md text-on-surface font-bold truncate underline decoration-primary/40">
                  {rouletteRecipe.title}
                </span>
              </button>
              <button
                type="button"
                disabled={isSpinning}
                onClick={handleSpinRoulette}
                className="shrink-0 px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold active:scale-95 transition-transform shadow-sm disabled:opacity-70"
              >
                {isSpinning ? 'Spinning...' : 'Spin 🎲'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="px-gutter w-full mt-space-md mb-space-lg">
        <div className="w-full p-space-md rounded-lg bg-surface-container-lowest shadow-[0_4px_20px_rgba(30,19,14,0.05)] flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <div className="flex -space-x-2.5 overflow-hidden py-1">
              {['E', 'S', 'D'].map((letter, idx) => (
                <div
                  key={letter}
                  className={`inline-flex h-8 w-8 rounded-full ring-2 ring-surface-container-lowest items-center justify-center font-label-md text-label-md font-extrabold ${
                    idx === 0
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : idx === 1
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                      : 'bg-secondary-fixed text-on-secondary-fixed'
                  }`}
                >
                  {letter}
                </div>
              ))}
              <div className="inline-flex h-8 w-8 rounded-full bg-primary-container text-on-primary-container ring-2 ring-surface-container-lowest items-center justify-center font-label-sm text-label-sm font-extrabold">
                +4.8k
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-primary font-extrabold uppercase tracking-wide">
                Community Baked
              </p>
              <p className="font-body-sm text-body-sm text-on-surface font-semibold truncate">
                4,820+ Remakes this month
              </p>
            </div>
          </div>
          <p className="font-body-md text-body-md text-secondary leading-relaxed">
            Tag your creations with{' '}
            <span className="font-bold text-primary">#CraveMadeMeDoIt</span> on TikTok, IG,
            FB &amp; Shorts to unlock the weekly showcase!
          </p>
          <button
            type="button"
            onClick={onOpenRemakes}
            className="w-full min-h-[46px] rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span>View Community Stitches &amp; Share Card</span>
          </button>
        </div>
      </section>

      {/* Crawlable Semantic SEO Footer */}
      <footer className="px-gutter pb-space-md text-secondary">
        <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-title-md text-title-md text-on-surface font-extrabold">
              Crave — {RECIPES.length}+ Viral Dessert Recipes
            </span>
            <span className="font-label-sm text-label-sm text-primary uppercase">
              Zero Login • Mobile First
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Browse trending American, European &amp; global desserts with instant US/Metric scaling, hands-free Cook Mode timers, and 1-tap Story &amp; Pinterest card sharing.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {DESSERT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <a
                key={c.id}
                href={`${getSiteRootPath()}category/${c.id}/`}
                onClick={(e) => {
                  e.preventDefault();
                  selectCategory(c.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:text-primary transition-colors"
              >
                {c.emoji} {c.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-outline-variant/40">
            {RECIPES.slice(0, 8).map((r) => (
              <a
                key={r.id}
                href={`${getSiteRootPath()}recipes/${r.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenRecipe(r);
                }}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline decoration-outline-variant"
              >
                {r.title}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
