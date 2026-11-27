import React from 'react';

export const EBOOK_URL = 'https://craveable.click/healthy-cravings.html';

interface EbookPromoCardProps {
  variant?: 'banner' | 'inline' | 'compact';
  contextLabel?: string;
}

export const EbookPromoCard: React.FC<EbookPromoCardProps> = ({
  variant = 'banner',
  contextLabel
}) => {
  if (variant === 'inline') {
    return (
      <a
        href={EBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-3 rounded-lg bg-gradient-to-r from-[#e8f8f2] via-surface-container-low to-tertiary-fixed/40 border border-pistachio/25 shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-full bg-pistachio text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </span>
          <div className="min-w-0">
            <span className="block font-label-sm text-label-sm text-pistachio-dark uppercase tracking-wider font-extrabold">
              {contextLabel || 'Also See My eBook • Zero Refined Sugar'}
            </span>
            <span className="block font-title-md text-title-md text-on-surface font-bold truncate">
              Guilt-Free Cravings — 120 Healthy Recipes
            </span>
          </div>
        </div>
        <span className="shrink-0 px-3 py-1.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-extrabold whitespace-nowrap">
          View PDF →
        </span>
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={EBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 shadow-sm flex items-center justify-between gap-3 hover:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-DEFAULT bg-gradient-to-br from-pistachio-dark to-inverse-surface text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[22px]">auto_stories</span>
          </div>
          <div className="min-w-0">
            <span className="block font-label-sm text-label-sm text-pistachio-dark uppercase font-extrabold">
              Guilt-Free Cravings eBook
            </span>
            <p className="font-body-sm text-body-sm text-on-surface font-semibold truncate">
              120 Zero-Refined-Sugar Recipes • Most &lt;250 cal
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-primary shrink-0">open_in_new</span>
      </a>
    );
  }

  return (
    <a
      href={EBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block w-full overflow-hidden rounded-lg bg-gradient-to-br from-inverse-surface via-[#2d1e17] to-[#1a110d] text-inverse-on-surface p-space-md shadow-lg active:scale-[0.99] transition-transform"
    >
      <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-pistachio/20 blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-primary-container/25 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pistachio text-white font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
            <span className="material-symbols-outlined text-[13px]">eco</span>
            <span>Zero Refined Sugar</span>
          </span>
          <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold uppercase tracking-wider">
            Instant PDF Download
          </span>
        </div>

        <div>
          <h3 className="font-headline-sm text-headline-sm text-white font-extrabold leading-snug">
            Also See My eBook: Guilt-Free Cravings
          </h3>
          <p className="font-body-sm text-body-sm text-inverse-on-surface/85 mt-1 leading-relaxed">
            Dessert without the sugar crash — 120 recipes (desserts, breakfasts, mains &amp; drinks) with a photo for every recipe, most treats under 250 calories, plus a 4-week plan.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-tertiary-fixed font-label-sm text-label-sm">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>45 Five-Star Reader Reviews</span>
          </div>
          <span className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-extrabold shadow-md whitespace-nowrap">
            Get the eBook →
          </span>
        </div>
      </div>
    </a>
  );
};
