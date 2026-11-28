import React, { useMemo, useState } from 'react';
import { COMMUNITY_STITCHES, RECIPE_SUMMARIES as RECIPES } from '../data/catalog';
import { Recipe } from '../types/recipe';
import { triggerHaptic } from '../utils/audioHaptics';
import { copyTextToClipboard } from '../utils/shareEngine';
import { AdUnit } from './AdUnit';
import { EbookPromoCard } from './EbookPromoCard';
import { SafeImage } from './SafeImage';

interface CommunityRemakesViewProps {
  likedIds: string[];
  onToggleLike: (stitchId: string) => void;
  onOpenRecipe: (recipe: Recipe) => void;
  onOpenShare: (recipe: Recipe, format?: 'story' | 'pinterest', madeBadge?: boolean) => void;
  onToast: (msg: string, icon?: string) => void;
}

type LeaderboardFilter = 'viral' | 'rated' | 'fails' | 'staff';

export const CommunityRemakesView: React.FC<CommunityRemakesViewProps> = ({
  likedIds,
  onToggleLike,
  onOpenRecipe,
  onOpenShare,
  onToast
}) => {
  const [filter, setFilter] = useState<LeaderboardFilter>('viral');
  const [showRemakeComposer, setShowRemakeComposer] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(RECIPES[0].slug);
  const [alertSaved, setAlertSaved] = useState(false);

  const visibleStitches = useMemo(() => {
    return COMMUNITY_STITCHES.filter((s) => s.tags.includes(filter));
  }, [filter]);

  const pinterestShowcase = [
    {
      recipe: RECIPES[0],
      tag: 'Step 03 / Glaze',
      shortTitle: 'Kataifi Molten Bar',
      meta: '⏱️ 40m • 🔥 420 kcal'
    },
    {
      recipe: RECIPES[5],
      tag: 'Viral Trick',
      shortTitle: 'Ice Bath Tanghulu',
      meta: '⏱️ 12m • 🍓 3 Ingred.'
    },
    {
      recipe: RECIPES[3],
      tag: 'Brunch Trend',
      shortTitle: 'Ganache Croffle',
      meta: '⏱️ 08m • 🥐 5 Stars'
    }
  ];

  const handleCopyChallengeTags = async () => {
    const recipe = RECIPES.find((r) => r.slug === selectedSlug) || RECIPES[0];
    const text = `My #DubaiBrownieRemake attempt! Made using @Crave zero-login Cook Mode 🔥\n${recipe.hashtags.join(
      ' '
    )}`;
    const copied = await copyTextToClipboard(text);
    if (copied) {
      onToast('Remake caption + hashtags copied!', 'content_copy');
    } else {
      onToast('Could not access clipboard — long press to copy', 'content_copy');
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto">
      {/* Viral Challenge Hero Banner */}
      <div className="px-gutter pt-space-xs pb-space-sm">
        <div className="relative overflow-hidden rounded-lg bg-surface-container-high shadow-sm p-space-md flex flex-col gap-space-sm">
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-tertiary-container/10 blur-xl pointer-events-none" />

          <div className="flex items-center justify-between gap-space-xs z-10">
            <div className="inline-flex items-center gap-1.5 bg-primary-container px-space-xs py-1 rounded-full text-on-primary shadow-sm">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">
                Weekly Challenge
              </span>
            </div>
            <div className="inline-flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md px-space-xs py-1 rounded-full text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              <span className="font-label-sm text-label-sm font-semibold">No Login Needed</span>
            </div>
          </div>

          <div className="z-10 flex flex-col gap-1">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">
              #DubaiBrownieRemake
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Crispy toasted kataifi, thick pistachio butter cream, and gooey dark molten chocolate glaze. Generate your remake story card &amp; stitch!
            </p>
          </div>

          <div className="z-10 flex items-center gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md p-space-xs rounded-DEFAULT shadow-sm">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0 text-on-tertiary-fixed">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trophy
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface truncate">
                Weekly Creator Spotlight Feature
              </span>
              <span className="font-body-sm text-body-sm text-secondary truncate">
                340 Bakers entered • Tag #CraveMadeMeDoIt
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(25);
              setShowRemakeComposer(true);
            }}
            className="z-10 w-full min-h-[52px] bg-primary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider font-extrabold rounded-full flex items-center justify-center gap-space-xs shadow-[0_8px_20px_rgba(225,29,72,0.3)] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            <span>Create Remake Story Card &amp; Stitch</span>
          </button>
        </div>
      </div>

      {/* Filter & Sort Rail */}
      <div className="w-full overflow-x-auto no-scrollbar px-gutter py-space-xs flex items-center gap-space-xs">
        {(
          [
            { id: 'viral', icon: 'trending_up', label: 'Most Viral' },
            { id: 'rated', icon: 'grade', label: 'Highest Rated' },
            { id: 'fails', icon: 'mood_bad', label: 'Fails & Saves' },
            { id: 'staff', icon: 'verified', label: 'Staff Picks' }
          ] as const
        ).map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 px-space-md py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                active
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pinterest-Optimized Aesthetic Graphic Cards (2:3) */}
      <div className="px-gutter pt-space-md pb-space-xs flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-primary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              push_pin
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Aesthetic Graphic Cards
            </h2>
          </div>
          <span className="font-body-sm text-body-sm text-secondary">Tap Pin to Export 2:3</span>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar flex gap-space-sm pt-space-2xs pb-space-xs">
          {pinterestShowcase.map((card) => (
            <div
              key={card.recipe.id}
              onClick={() => onOpenRecipe(card.recipe)}
              className="relative w-[210px] h-[315px] shrink-0 rounded-lg overflow-hidden shadow-[0_8px_24px_-4px_rgba(30,19,14,0.12)] flex flex-col justify-between p-space-sm group cursor-pointer"
            >
              <SafeImage
                src={card.recipe.pinterestImage}
                alt={card.shortTitle}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-inverse-surface/60 via-transparent to-inverse-surface/90" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="px-2 py-0.5 rounded-full bg-surface-container-lowest/85 backdrop-blur-md">
                  <span className="font-label-sm text-label-sm text-on-surface font-extrabold uppercase">
                    {card.tag}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Generate Pinterest card for ${card.shortTitle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShare(card.recipe, 'pinterest', false);
                  }}
                  className="w-9 h-9 rounded-full bg-[#E60023] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    push_pin
                  </span>
                </button>
              </div>

              <div className="relative z-10 flex flex-col gap-1 text-inverse-on-surface">
                <span className="font-headline-sm text-headline-sm font-bold leading-tight drop-shadow-sm">
                  {card.shortTitle}
                </span>
                <span className="font-body-sm text-body-sm text-inverse-on-surface/90">
                  {card.meta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Stitches 2-Col Grid */}
      <div className="px-gutter pt-space-md pb-space-xs flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Community Stitches</h2>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
            Verified Bakes
          </span>
        </div>
        <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
          <span>Live Trends</span>
          <span className="w-2 h-2 rounded-full bg-pistachio animate-pulse" />
        </div>
      </div>

      <div className="px-gutter grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        {visibleStitches.map((stitch) => {
          const liked = likedIds.includes(stitch.id);
          const countDisplay = liked
            ? `${((stitch.likes + 100) / 1000).toFixed(1)}k`
            : `${(stitch.likes / 1000).toFixed(1)}k`;
          const linkedRecipe =
            RECIPES.find((r) => r.slug === stitch.recipeSlug) || RECIPES[0];

          return (
            <div
              key={stitch.id}
              onClick={() => onOpenRecipe(linkedRecipe)}
              className="flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm group cursor-pointer"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container">
                <SafeImage
                  src={stitch.image}
                  alt={`Remake by ${stitch.creator}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent" />

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-inverse-surface/75 backdrop-blur-md px-2 py-0.5 rounded-full text-inverse-on-surface font-label-sm text-label-sm">
                  <span
                    className="material-symbols-outlined text-[13px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {stitch.isVideo ? 'play_arrow' : 'videocam'}
                  </span>
                  <span>{stitch.viewsLabel}</span>
                </div>

                {stitch.isStitch && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">repeat</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic(20);
                    onToggleLike(stitch.id);
                  }}
                  className="absolute bottom-2 right-2 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded-full text-on-surface active:scale-90 transition-transform"
                >
                  <span
                    className={`material-symbols-outlined text-[15px] ${
                      liked ? 'text-primary' : 'text-outline'
                    }`}
                    style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                  <span className="font-label-sm text-label-sm font-bold">{countDisplay}</span>
                </button>
              </div>

              <div className="p-space-xs flex flex-col gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-label-sm text-label-sm shrink-0 ${stitch.avatarTone}`}
                  >
                    {stitch.avatarLetter}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface truncate">
                    {stitch.creator}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                  {stitch.quote}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline eBook Promo */}
      <div className="px-gutter pt-space-sm">
        <EbookPromoCard variant="inline" />
      </div>

      {/* Mid-Page High-RPM Ad Slot */}
      <AdUnit placementId="remakes-mid" minHeightClass="min-h-[250px]" />

      {/* Zero-Login Add To Home Screen / Weekly Radar Reminder */}
      <div className="px-gutter pt-space-md">
        <EbookPromoCard variant="banner" />
      </div>

      <div className="px-gutter pt-space-lg">
        <div className="relative overflow-hidden bg-inverse-surface text-inverse-on-surface rounded-lg p-space-md flex flex-col gap-space-sm shadow-md">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary-container/30 blur-2xl pointer-events-none" />
          <div className="flex items-start gap-space-xs z-10">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider">
                Zero-Signup Trend Radar
              </span>
              <h2 className="font-headline-sm text-headline-sm font-bold leading-snug">
                Keep Crave Recipes 1 Tap Away
              </h2>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-inverse-on-surface/80 z-10">
            No account, no password, no spam. Pin our Weekly Dessert Radar to your WhatsApp/Share sheet or bookmark it directly to your phone&apos;s home screen.
          </p>
          <button
            type="button"
            onClick={() => {
              setAlertSaved(true);
              onOpenShare(RECIPES[0], 'story', false);
            }}
            className="z-10 w-full min-h-[48px] bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-extrabold rounded-full flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <span>
              {alertSaved ? 'Radar Card Ready to Save!' : 'Grab Weekly Viral Card & Link'}
            </span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Zero-Login Remake Composer Modal */}
      {showRemakeComposer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create Remake Story Card"
          className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex flex-col justify-end sm:items-center sm:justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRemakeComposer(false);
          }}
        >
          <div className="w-full sm:max-w-md bg-surface rounded-t-xl sm:rounded-xl p-gutter pb-safe flex flex-col gap-space-sm shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase">
                  Zero-Login Stitch Helper
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                  Post Your Remake &amp; Go Viral
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRemakeComposer(false)}
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <label className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-secondary">
                Which viral dessert did you make?
              </span>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="h-12 px-4 rounded-full bg-surface-container-low text-on-surface font-title-md text-title-md outline-none"
              >
                {RECIPES.map((r) => (
                  <option key={r.id} value={r.slug}>
                    {r.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const chosen =
                    RECIPES.find((r) => r.slug === selectedSlug) || RECIPES[0];
                  setShowRemakeComposer(false);
                  onOpenShare(chosen, 'story', true);
                }}
                className="h-12 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Generate &ldquo;I Made This!&rdquo; 9:16 Card</span>
              </button>

              <button
                type="button"
                onClick={handleCopyChallengeTags}
                className="h-12 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">tag</span>
                <span>Copy TikTok / IG / Shorts Hashtags</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
