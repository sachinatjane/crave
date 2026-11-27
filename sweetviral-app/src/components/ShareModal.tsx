import React, { useEffect, useState } from 'react';
import { Recipe, UnitSystem } from '../types/recipe';
import {
  buildDeepRecipeUrl,
  buildPlatformCaption,
  generateShareCardDataUrl
} from '../utils/shareEngine';
import { triggerHaptic } from '../utils/audioHaptics';
import { EbookPromoCard } from './EbookPromoCard';

interface ShareModalProps {
  recipe: Recipe | null;
  servings: number;
  unit: UnitSystem;
  madeBadge?: boolean;
  initialFormat?: 'story' | 'pinterest';
  onClose: () => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  recipe,
  servings,
  unit,
  madeBadge = false,
  initialFormat = 'story',
  onClose,
  onToast
}) => {
  const [format, setFormat] = useState<'story' | 'pinterest'>(initialFormat);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setFormat(initialFormat);
  }, [initialFormat, recipe]);

  useEffect(() => {
    if (!recipe) return;
    let cancelled = false;
    setIsGenerating(true);

    generateShareCardDataUrl(recipe, format, servings, unit, madeBadge)
      .then(({ dataUrl, blob }) => {
        if (!cancelled) {
          setPreviewUrl(dataUrl);
          setCardBlob(blob);
          setIsGenerating(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsGenerating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recipe, format, servings, unit, madeBadge]);

  if (!recipe) return null;

  const deepUrl = buildDeepRecipeUrl(recipe.slug, servings, unit);
  const captionText = buildPlatformCaption(recipe);

  const handleCopyLink = async () => {
    triggerHaptic(25);
    try {
      await navigator.clipboard.writeText(deepUrl);
      onToast('Scaled recipe link copied!', 'link');
    } catch {
      onToast('Copy this URL from your address bar', 'link');
    }
  };

  const handleCopyCaption = async () => {
    triggerHaptic(25);
    try {
      await navigator.clipboard.writeText(`${captionText}\n\nRecipe: ${deepUrl}`);
      onToast('TikTok/IG caption & hashtags copied!', 'content_copy');
    } catch {
      onToast('Copied hashtags!', 'content_copy');
    }
  };

  const handleDownloadCard = () => {
    if (!previewUrl) return;
    triggerHaptic([30, 20, 30]);
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${recipe.slug}-${format}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onToast(
      format === 'story' ? '9:16 Story Card downloaded!' : '2:3 Pinterest Card downloaded!',
      'download_done'
    );
  };

  const handleNativeShare = async () => {
    triggerHaptic(30);
    const shareData: ShareData = {
      title: recipe.title,
      text: `${recipe.title} (${servings} servings • ${recipe.totalMin} mins) 🔥`,
      url: deepUrl
    };

    try {
      if (cardBlob && navigator.canShare) {
        const file = new File([cardBlob], `${recipe.slug}-${format}.png`, {
          type: 'image/png'
        });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            ...shareData,
            files: [file]
          });
          onToast('Shared card + recipe link!', 'send');
          return;
        }
      }
      if (navigator.share) {
        await navigator.share(shareData);
        onToast('Shared recipe!', 'send');
        return;
      }
    } catch {
      // User dismissed share sheet or WebView blocked native share
    }
    await handleCopyLink();
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `Look at this viral dessert: ${recipe.title} (${recipe.totalMin} mins, ${servings} servings) 🍫🔥\n${deepUrl}`
  )}`;

  const pinterestHref = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
    deepUrl
  )}&media=${encodeURIComponent(recipe.pinterestImage)}&description=${encodeURIComponent(
    `${recipe.title} — Ready in ${recipe.totalMin} mins • ${recipe.viewsLabel} • No-fluff viral recipe!`
  )}`;

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    deepUrl
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share Recipe & Generate Viral Card"
      className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex flex-col justify-end sm:items-center sm:justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-md bg-surface rounded-t-xl sm:rounded-xl p-gutter pb-safe max-h-[92dvh] overflow-y-auto shadow-2xl flex flex-col gap-space-sm">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
              {madeBadge ? '🎉 Remake Unlocked' : 'Zero-Login Viral Share Hub'}
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              Share or Save Graphic Card
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share sheet"
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Format Toggle: IG/TikTok 9:16 vs Pinterest 2:3 */}
        <div className="flex bg-surface-container-high p-1 rounded-full">
          <button
            type="button"
            onClick={() => setFormat('story')}
            className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all ${
              format === 'story'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            IG / TikTok Story (9:16)
          </button>
          <button
            type="button"
            onClick={() => setFormat('pinterest')}
            className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all ${
              format === 'pinterest'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            Pinterest Pin Card (2:3)
          </button>
        </div>

        {/* Live Canvas Preview */}
        <div className="flex justify-center bg-surface-container-low rounded-lg p-3">
          {isGenerating || !previewUrl ? (
            <div className="h-56 w-36 rounded-DEFAULT bg-surface-container animate-pulse flex items-center justify-center text-secondary font-label-sm text-label-sm">
              Rendering Card...
            </div>
          ) : (
            <img
              src={previewUrl}
              alt={`${recipe.title} ${format} card`}
              className="h-60 w-auto rounded-DEFAULT shadow-lg object-contain"
            />
          )}
        </div>

        {/* Primary Share & Download Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleNativeShare}
            className="h-12 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Share Card</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={!previewUrl}
            className="h-12 rounded-full bg-inverse-surface text-inverse-on-surface font-label-lg text-label-lg flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Save PNG</span>
          </button>
        </div>

        {/* 1-Tap Social Platform Targets */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-DEFAULT bg-surface-container-lowest shadow-sm active:scale-95 transition-transform"
          >
            <span className="w-9 h-9 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center font-extrabold text-sm">
              WA
            </span>
            <span className="font-label-sm text-label-sm text-on-surface">WhatsApp</span>
          </a>

          <a
            href={pinterestHref}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-DEFAULT bg-surface-container-lowest shadow-sm active:scale-95 transition-transform"
          >
            <span className="w-9 h-9 rounded-full bg-[#E60023]/15 text-[#E60023] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                push_pin
              </span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface">Pinterest</span>
          </a>

          <a
            href={facebookHref}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-DEFAULT bg-surface-container-lowest shadow-sm active:scale-95 transition-transform"
          >
            <span className="w-9 h-9 rounded-full bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center font-extrabold text-sm">
              FB
            </span>
            <span className="font-label-sm text-label-sm text-on-surface">Facebook</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1 p-2 rounded-DEFAULT bg-surface-container-lowest shadow-sm active:scale-95 transition-transform"
          >
            <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">link</span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface">Copy Link</span>
          </button>
        </div>

        {/* Copy Creator Caption & Hashtags */}
        <button
          type="button"
          onClick={handleCopyCaption}
          className="w-full py-3 px-4 rounded-DEFAULT bg-surface-container-low text-on-surface-variant flex items-center justify-between gap-2 active:scale-[0.98] transition-transform"
        >
          <div className="text-left min-w-0">
            <p className="font-label-md text-label-md text-primary uppercase">
              Posting to TikTok / IG / Shorts?
            </p>
            <p className="font-body-sm text-body-sm text-on-surface truncate">
              {recipe.hashtags.join(' ')}
            </p>
          </div>
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm">
            Copy Tags
          </span>
        </button>

        <EbookPromoCard variant="compact" />
      </div>
    </div>
  );
};
