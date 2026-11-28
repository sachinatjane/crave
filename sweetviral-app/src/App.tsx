'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { BrandHeader } from './components/BrandHeader';
import { BottomNav } from './components/BottomNav';
import { RecipeDetailView } from './components/RecipeDetailView';
import { TrendingFeedView } from './components/TrendingFeedView';
import {
  DESSERT_CATEGORIES,
  RECIPE_SUMMARIES as RECIPES,
  fetchFullRecipe,
  primeRecipeCache
} from './data/catalog';
import { AppTab, DessertCategory, Recipe, UnitSystem } from './types/recipe';
import { getSiteRootPath } from './utils/assetUrl';
import { detectInAppBrowser } from './utils/shareEngine';
import { updateRecipeMetadata } from './utils/seoSchema';
import { triggerHaptic } from './utils/audioHaptics';

const CommunityRemakesView = dynamic(
  () => import('./components/CommunityRemakesView').then((m) => m.CommunityRemakesView),
  { ssr: false }
);
const CookModeView = dynamic(
  () => import('./components/CookModeView').then((m) => m.CookModeView),
  { ssr: false }
);
const PantryDiscoverView = dynamic(
  () => import('./components/PantryDiscoverView').then((m) => m.PantryDiscoverView),
  { ssr: false }
);
const SavedView = dynamic(
  () => import('./components/SavedView').then((m) => m.SavedView),
  { ssr: false }
);
const SearchPantryModal = dynamic(
  () => import('./components/SearchPantryModal').then((m) => m.SearchPantryModal),
  { ssr: false }
);
const ShareModal = dynamic(
  () => import('./components/ShareModal').then((m) => m.ShareModal),
  { ssr: false }
);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or private mode
  }
}

type ScreenState =
  | { type: 'tab'; tab: AppTab }
  | { type: 'recipe'; recipeId: string }
  | { type: 'cook'; recipeId: string; stepIndex: number };

interface AppProps {
  initialRecipeSlug?: string;
  initialCategorySlug?: DessertCategory;
  initialRecipe?: Recipe;
}

export function App({ initialRecipeSlug, initialCategorySlug, initialRecipe }: AppProps = {}) {
  const [fullRecipesById, setFullRecipesById] = useState<Record<string, Recipe>>(() => {
    if (initialRecipe) {
      primeRecipeCache(initialRecipe);
      return { [initialRecipe.id]: initialRecipe };
    }
    return {};
  });
  const [savedIds, setSavedIds] = useState<string[]>(['dubai-brownies']);
  const [madeIds, setMadeIds] = useState<string[]>([]);
  const [likedStitches, setLikedStitches] = useState<string[]>(['cs1', 'cs3']);
  const [checkedByRecipe, setCheckedByRecipe] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [unit, setUnit] = useState<UnitSystem>('us');
  const [servingsByRecipe, setServingsByRecipe] = useState<Record<string, number>>({});
  const [storageHydrated, setStorageHydrated] = useState(false);

  const [initialCategory, setInitialCategory] = useState<DessertCategory>(() => {
    if (initialCategorySlug) return initialCategorySlug;
    if (typeof window !== 'undefined') {
      const m = window.location.pathname.match(/\/category\/([a-z0-9-]+)\/?$/i);
      if (m) {
        const foundCat = DESSERT_CATEGORIES.find((c) => c.id === m[1]);
        if (foundCat) return foundCat.id;
      }
    }
    return 'all';
  });

  // Hydrate initial route from Next.js props, /recipes/<slug>/, OR URL query params
  const [screen, setScreen] = useState<ScreenState>(() => {
    const slugFromProp = initialRecipeSlug;
    if (slugFromProp) {
      const found = RECIPES.find((r) => r.slug === slugFromProp || r.id === slugFromProp);
      if (found) return { type: 'recipe', recipeId: found.id };
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pathMatch = window.location.pathname.match(/\/recipes\/([a-z0-9-]+)\/?$/i);
      const slug = pathMatch?.[1] || params.get('r');
      const mode = params.get('mode');
      if (slug) {
        const found = RECIPES.find((r) => r.slug === slug || r.id === slug);
        if (found) {
          if (mode === 'cook') {
            return { type: 'cook', recipeId: found.id, stepIndex: 0 };
          }
          return { type: 'recipe', recipeId: found.id };
        }
      }
    }
    return { type: 'tab', tab: 'trending' };
  });

  // Hydrate localStorage & deep-linked servings/unit on client mount (prevents SSR mismatch)
  useEffect(() => {
    setSavedIds(
      readStorage<string[]>('crave_saved', readStorage<string[]>('sweetviral_saved', ['dubai-brownies']))
    );
    setMadeIds(readStorage<string[]>('crave_made', readStorage<string[]>('sweetviral_made', [])));
    setLikedStitches(
      readStorage<string[]>('crave_likes', readStorage<string[]>('sweetviral_likes', ['cs1', 'cs3']))
    );
    setCheckedByRecipe(
      readStorage<Record<string, Record<string, boolean>>>(
        'crave_checked',
        readStorage<Record<string, Record<string, boolean>>>('sweetviral_checked', {})
      )
    );
    setUnit(readStorage<UnitSystem>('crave_unit', readStorage<UnitSystem>('sweetviral_unit', 'us')));
    setStorageHydrated(true);

    const params = new URLSearchParams(window.location.search);
    const pathMatch = window.location.pathname.match(/\/recipes\/([a-z0-9-]+)\/?$/i);
    const slug = initialRecipeSlug || pathMatch?.[1] || params.get('r');
    const sParam = Number(params.get('s'));
    const uParam = params.get('u');
    const mode = params.get('mode');
    if (slug) {
      const found = RECIPES.find((r) => r.slug === slug || r.id === slug);
      if (found) {
        if (mode === 'cook') {
          setScreen({ type: 'cook', recipeId: found.id, stepIndex: 0 });
        }
        if (sParam >= 1 && sParam <= 24) {
          setServingsByRecipe((prev) => ({ ...prev, [found.id]: sParam }));
        }
      }
    }
    if (uParam === 'metric' || uParam === 'us') {
      setUnit(uParam);
    }
    if (params.get('q')) {
      setSearchOpen(true);
    }
  }, [initialRecipeSlug]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [shareState, setShareState] = useState<{
    recipe: Recipe;
    format: 'story' | 'pinterest';
    madeBadge: boolean;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);
  const [showInAppBanner, setShowInAppBanner] = useState(true);

  const inAppInfo = useMemo(() => detectInAppBrowser(), []);

  const showToast = useCallback((message: string, icon = 'check_circle') => {
    setToast({ message, icon });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Persist zero-login local preferences after initial hydration
  useEffect(() => {
    if (storageHydrated) writeStorage('crave_saved', savedIds);
  }, [savedIds, storageHydrated]);
  useEffect(() => {
    if (storageHydrated) writeStorage('crave_made', madeIds);
  }, [madeIds, storageHydrated]);
  useEffect(() => {
    if (storageHydrated) writeStorage('crave_likes', likedStitches);
  }, [likedStitches, storageHydrated]);
  useEffect(() => {
    if (storageHydrated) writeStorage('crave_checked', checkedByRecipe);
  }, [checkedByRecipe, storageHydrated]);
  useEffect(() => {
    if (storageHydrated) writeStorage('crave_unit', unit);
  }, [unit, storageHydrated]);

  const activeRecipe = useMemo(() => {
    if (screen.type === 'recipe' || screen.type === 'cook') {
      const full = fullRecipesById[screen.recipeId];
      if (full) return full;
      if (initialRecipe && initialRecipe.id === screen.recipeId) return initialRecipe;
      return null;
    }
    return null;
  }, [screen, fullRecipesById, initialRecipe]);

  // Fetch ~4KB full recipe JSON on-demand when navigating to a recipe or Cook Mode
  useEffect(() => {
    if (screen.type !== 'recipe' && screen.type !== 'cook') return;
    if (fullRecipesById[screen.recipeId]) return;
    const summary = RECIPES.find((r) => r.id === screen.recipeId);
    if (!summary) return;
    let cancelled = false;
    fetchFullRecipe(summary.slug).then((loaded) => {
      if (!cancelled && loaded) {
        setFullRecipesById((prev) => ({ ...prev, [loaded.id]: loaded }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [screen, fullRecipesById]);

  const lastTabRef = useRef<AppTab>('trending');
  const isPopStateRef = useRef(false);
  const hasMountedRef = useRef(false);

  const activeServings = activeRecipe
    ? servingsByRecipe[activeRecipe.id] ?? activeRecipe.baseServings
    : 8;

  useEffect(() => {
    if (screen.type === 'tab') {
      lastTabRef.current = screen.tab;
    }
  }, [screen]);

  // Sync SEO Schema.org + clean canonical URL + browser history stack
  useEffect(() => {
    updateRecipeMetadata(activeRecipe, activeServings, unit);

    const rootPath = getSiteRootPath();
    const url = new URL(window.location.origin + rootPath);
    if (screen.type === 'tab') {
      if (screen.tab === 'trending' && initialCategory !== 'all') {
        url.pathname = `${rootPath}category/${initialCategory}/`;
      }
    } else if (activeRecipe) {
      url.pathname = `${rootPath}recipes/${activeRecipe.slug}/`;
      if (activeServings !== activeRecipe.baseServings) {
        url.searchParams.set('s', String(activeServings));
      }
      if (unit !== 'us') {
        url.searchParams.set('u', unit);
      }
      if (screen.type === 'cook') {
        url.searchParams.set('mode', 'cook');
      }
    }

    const pathChanged = url.pathname !== window.location.pathname;
    if (hasMountedRef.current && !isPopStateRef.current && pathChanged) {
      window.history.pushState({}, '', url.toString());
    } else {
      window.history.replaceState({}, '', url.toString());
    }
    hasMountedRef.current = true;
    isPopStateRef.current = false;

    // GA4 SPA page_view on every screen / recipe navigation
    if (typeof (window as unknown as Record<string, unknown>).gtag === 'function') {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'page_view', {
        page_title: document.title,
        page_path: url.pathname + url.search,
      });
    }
  }, [screen, activeRecipe, activeServings, unit, initialCategory]);

  // Browser back/forward button support
  useEffect(() => {
    const onPopState = () => {
      isPopStateRef.current = true;
      const params = new URLSearchParams(window.location.search);
      const pathMatch = window.location.pathname.match(/\/recipes\/([a-z0-9-]+)\/?$/i);
      const slug = pathMatch?.[1] || params.get('r');
      if (slug) {
        const found = RECIPES.find((r) => r.slug === slug);
        if (found) {
          setScreen(
            params.get('mode') === 'cook'
              ? { type: 'cook', recipeId: found.id, stepIndex: 0 }
              : { type: 'recipe', recipeId: found.id }
          );
          return;
        }
      }
      const catMatch = window.location.pathname.match(/\/category\/([a-z0-9-]+)\/?$/i);
      if (catMatch?.[1]) {
        setInitialCategory(catMatch[1] as DessertCategory);
      } else {
        setInitialCategory('all');
      }
      setScreen({ type: 'tab', tab: lastTabRef.current });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Always snap to the very top immediately after screen or recipe changes
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [
    screen.type,
    screen.type === 'tab' ? screen.tab : screen.recipeId,
    screen.type === 'cook' ? screen.stepIndex : 0
  ]);

  const navigateToRecipe = (recipe: Recipe) => {
    if (!fullRecipesById[recipe.id]) {
      fetchFullRecipe(recipe.slug).then((loaded) => {
        if (loaded) setFullRecipesById((prev) => ({ ...prev, [loaded.id]: loaded }));
      });
    }
    setScreen({ type: 'recipe', recipeId: recipe.id });
  };

  const navigateToCookMode = (recipe: Recipe, stepIndex = 0) => {
    triggerHaptic(30);
    if (!fullRecipesById[recipe.id]) {
      fetchFullRecipe(recipe.slug).then((loaded) => {
        if (loaded) setFullRecipesById((prev) => ({ ...prev, [loaded.id]: loaded }));
      });
    }
    setScreen({ type: 'cook', recipeId: recipe.id, stepIndex });
  };

  const handleToggleSave = (recipe: Recipe) => {
    triggerHaptic(20);
    setSavedIds((prev) => {
      const exists = prev.includes(recipe.id);
      const next = exists ? prev.filter((id) => id !== recipe.id) : [...prev, recipe.id];
      showToast(
        exists ? 'Removed from Saved Box' : `Saved "${recipe.shortTag}" (No login needed!)`,
        exists ? 'bookmark_remove' : 'bookmark_added'
      );
      return next;
    });
  };

  const handleToggleIngredient = (recipeId: string, ingredientId: string) => {
    setCheckedByRecipe((prev) => {
      const current = prev[recipeId] || {};
      return {
        ...prev,
        [recipeId]: {
          ...current,
          [ingredientId]: !current[ingredientId]
        }
      };
    });
  };

  const handleToggleLikeStitch = (stitchId: string) => {
    setLikedStitches((prev) =>
      prev.includes(stitchId) ? prev.filter((id) => id !== stitchId) : [...prev, stitchId]
    );
  };

  const handleBack = () => {
    if (screen.type === 'cook') {
      setScreen({ type: 'recipe', recipeId: screen.recipeId });
    } else {
      setScreen({ type: 'tab', tab: lastTabRef.current });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerTopPadding =
    showInAppBanner && inAppInfo.isInApp ? 'pt-[94px]' : 'pt-16';

  return (
    <div className="min-h-[100dvh] bg-surface text-on-surface flex flex-col">
      <BrandHeader
        mode={screen.type === 'tab' ? 'tab' : 'stack'}
        title={
          screen.type === 'cook'
            ? 'Active Cook Session'
            : screen.type === 'recipe'
              ? 'Recipe Detail'
              : undefined
        }
        savedCount={savedIds.length}
        inAppInfo={inAppInfo}
        showInAppBanner={showInAppBanner}
        onDismissInApp={() => setShowInAppBanner(false)}
        onBack={handleBack}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSaved={() => {
          setScreen({ type: 'tab', tab: 'saved' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onShare={
          activeRecipe
            ? () =>
              setShareState({
                recipe: activeRecipe,
                format: 'story',
                madeBadge: madeIds.includes(activeRecipe.id)
              })
            : undefined
        }
      />

      <main className={`flex-1 w-full ${headerTopPadding}`}>
        {screen.type === 'tab' && screen.tab === 'trending' && (
          <TrendingFeedView
            savedIds={savedIds}
            initialCategory={initialCategory}
            onCategoryChange={setInitialCategory}
            onToggleSave={handleToggleSave}
            onOpenRecipe={navigateToRecipe}
            onStartCookMode={(r) => navigateToCookMode(r, 0)}
            onOpenShare={(r, format = 'story') =>
              setShareState({ recipe: r, format, madeBadge: false })
            }
            onOpenRemakes={() => {
              setScreen({ type: 'tab', tab: 'remakes' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {screen.type === 'tab' && screen.tab === 'discover' && (
          <PantryDiscoverView
            onOpenRecipe={navigateToRecipe}
            onStartCookMode={(r) => navigateToCookMode(r, 0)}
            onOpenShare={(r, format = 'story') =>
              setShareState({ recipe: r, format, madeBadge: false })
            }
          />
        )}

        {screen.type === 'tab' && screen.tab === 'saved' && (
          <SavedView
            savedIds={savedIds}
            madeIds={madeIds}
            onToggleSave={handleToggleSave}
            onOpenRecipe={navigateToRecipe}
            onStartCookMode={(r) => navigateToCookMode(r, 0)}
            onOpenShare={(r, format = 'story') =>
              setShareState({ recipe: r, format, madeBadge: madeIds.includes(r.id) })
            }
            onExploreTrending={() => {
              setScreen({ type: 'tab', tab: 'trending' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {screen.type === 'tab' && screen.tab === 'remakes' && (
          <CommunityRemakesView
            likedIds={likedStitches}
            onToggleLike={handleToggleLikeStitch}
            onOpenRecipe={navigateToRecipe}
            onOpenShare={(r, format = 'story', madeBadge = false) =>
              setShareState({ recipe: r, format, madeBadge })
            }
            onToast={showToast}
          />
        )}

        {screen.type === 'recipe' && activeRecipe && (
          <RecipeDetailView
            key={activeRecipe.id}
            recipe={activeRecipe}
            servings={activeServings}
            unit={unit}
            isSaved={savedIds.includes(activeRecipe.id)}
            isMade={madeIds.includes(activeRecipe.id)}
            checkedItems={checkedByRecipe[activeRecipe.id] || {}}
            onChangeServings={(next) =>
              setServingsByRecipe((prev) => ({ ...prev, [activeRecipe.id]: next }))
            }
            onChangeUnit={setUnit}
            onToggleIngredient={(itemId) => handleToggleIngredient(activeRecipe.id, itemId)}
            onToggleSave={() => handleToggleSave(activeRecipe)}
            onMarkMade={() =>
              setMadeIds((prev) =>
                prev.includes(activeRecipe.id) ? prev : [...prev, activeRecipe.id]
              )
            }
            onStartCookMode={(stepIdx = 0) => navigateToCookMode(activeRecipe, stepIdx)}
            onOpenShare={(format = 'story', madeBadge = false) =>
              setShareState({ recipe: activeRecipe, format, madeBadge })
            }
            onSelectCategory={(cat) => {
              setInitialCategory(cat);
              setScreen({ type: 'tab', tab: 'trending' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRecipe={navigateToRecipe}
            onToast={showToast}
          />
        )}

        {screen.type === 'cook' && activeRecipe && (
          <CookModeView
            key={`${activeRecipe.id}-${screen.stepIndex}`}
            recipe={activeRecipe}
            servings={activeServings}
            unit={unit}
            initialStepIndex={screen.stepIndex}
            checkedItems={checkedByRecipe[activeRecipe.id] || {}}
            onToggleIngredient={(itemId) => handleToggleIngredient(activeRecipe.id, itemId)}
            onFinishCook={() => {
              setMadeIds((prev) =>
                prev.includes(activeRecipe.id) ? prev : [...prev, activeRecipe.id]
              );
              setScreen({ type: 'recipe', recipeId: activeRecipe.id });
              setShareState({ recipe: activeRecipe, format: 'story', madeBadge: true });
              showToast('Bake complete! Share your Story Card 🎉', 'celebration');
            }}
            onToast={showToast}
          />
        )}
      </main>

      {screen.type === 'tab' && (
        <BottomNav
          activeTab={screen.tab}
          savedCount={savedIds.length}
          onSelectTab={(tab) => {
            setScreen({ type: 'tab', tab });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLaunchCookMode={() => {
            const firstSaved = RECIPES.find((r) => savedIds.includes(r.id)) || RECIPES[0];
            navigateToCookMode(firstSaved, 0);
          }}
        />
      )}

      <SearchPantryModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectRecipe={navigateToRecipe}
      />

      <ShareModal
        recipe={shareState?.recipe || null}
        servings={
          shareState?.recipe
            ? servingsByRecipe[shareState.recipe.id] ?? shareState.recipe.baseServings
            : 8
        }
        unit={unit}
        initialFormat={shareState?.format || 'story'}
        madeBadge={shareState?.madeBadge || false}
        onClose={() => setShareState(null)}
        onToast={showToast}
      />

      {/* Toast Notification Pill */}
      {toast && (
        <div
          role="status"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full bg-inverse-surface/95 text-inverse-on-surface backdrop-blur-md font-label-md text-label-md shadow-xl flex items-center gap-2 max-w-[90vw]"
        >
          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed shrink-0">
            {toast.icon}
          </span>
          <span className="truncate">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
