import { Recipe, SocialPlatform, UnitSystem } from '../types/recipe';
import { getSiteRootPath, resolveAssetUrl } from './assetUrl';
import { formatScaledIngredient } from './scaler';

export interface InAppBrowserInfo {
  isInApp: boolean;
  appName: 'TikTok' | 'Instagram' | 'Facebook' | 'Pinterest' | 'YouTube' | null;
  isIOS: boolean;
}

export function detectInAppBrowser(): InAppBrowserInfo {
  if (typeof navigator === 'undefined') {
    return { isInApp: false, appName: null, isIOS: false };
  }
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  if (/BytedanceWebview|musical_ly|TikTok/i.test(ua)) {
    return { isInApp: true, appName: 'TikTok', isIOS };
  }
  if (/Instagram/i.test(ua)) {
    return { isInApp: true, appName: 'Instagram', isIOS };
  }
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) {
    return { isInApp: true, appName: 'Facebook', isIOS };
  }
  if (/Pinterest/i.test(ua)) {
    return { isInApp: true, appName: 'Pinterest', isIOS };
  }
  if (/YouTube/i.test(ua)) {
    return { isInApp: true, appName: 'YouTube', isIOS };
  }
  return { isInApp: false, appName: null, isIOS };
}

export function buildDeepRecipeUrl(
  slug: string,
  servings?: number,
  unit?: UnitSystem,
  source?: SocialPlatform
): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(`${window.location.origin}${getSiteRootPath()}recipes/${slug}/`);
  if (servings) url.searchParams.set('s', String(servings));
  if (unit) url.searchParams.set('u', unit);
  if (source) url.searchParams.set('utm_source', source);
  return url.toString();
}

export function buildPlatformCaption(recipe: Recipe): string {
  return `Made the viral ${recipe.title} (${recipe.viewsLabel}) in ${recipe.totalMin} mins! 🔥\n${recipe.hookLine}\n\n${recipe.hashtags.join(' ')}`;
}

/**
 * Reliable clipboard copy with textarea + execCommand fallback for in-app WebViews and HTTP.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback
    }
  }
  if (typeof document === 'undefined') return false;
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = test;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
}

export async function generateShareCardDataUrl(
  recipe: Recipe,
  format: 'story' | 'pinterest',
  servings: number,
  unit: UnitSystem,
  madeBadge = false
): Promise<{ dataUrl: string; blob: Blob | null }> {
  const width = format === 'story' ? 1080 : 1000;
  const height = format === 'story' ? 1920 : 1500;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  // Base custard-espresso canvas
  ctx.fillStyle = '#271811';
  ctx.fillRect(0, 0, width, height);

  // Draw cover-fit dessert image
  try {
    const imgUrl = resolveAssetUrl(
      format === 'pinterest' ? recipe.pinterestImage : recipe.heroImage
    );
    const img = await loadImage(imgUrl);
    const scale = Math.max(width / img.width, height / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  } catch {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#b80035');
    grad.addColorStop(1, '#3e2d25');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // Editorial top & bottom scrim
  const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.35);
  topGrad.addColorStop(0, 'rgba(30, 19, 14, 0.72)');
  topGrad.addColorStop(1, 'rgba(30, 19, 14, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, height * 0.35);

  const botGrad = ctx.createLinearGradient(0, height * 0.42, 0, height);
  botGrad.addColorStop(0, 'rgba(30, 19, 14, 0)');
  botGrad.addColorStop(0.55, 'rgba(30, 19, 14, 0.85)');
  botGrad.addColorStop(1, 'rgba(20, 13, 10, 0.96)');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, height * 0.42, width, height * 0.58);

  const pad = 72;

  // Top Brand Pill
  drawRoundedRect(ctx, pad, 88, 300, 64, 32);
  ctx.fillStyle = 'rgba(255, 248, 246, 0.92)';
  ctx.fill();
  ctx.fillStyle = '#e11d48';
  ctx.font = '800 28px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('🔥 CRAVE', pad + 34, 130);

  // Views / Made Badge on top-right
  const badgeLabel = madeBadge ? '✓ I MADE THIS!' : recipe.viewsLabel.toUpperCase();
  ctx.font = '800 24px "Plus Jakarta Sans", system-ui, sans-serif';
  const badgeW = ctx.measureText(badgeLabel).width + 64;
  drawRoundedRect(ctx, width - pad - badgeW, 88, badgeW, 64, 32);
  ctx.fillStyle = madeBadge ? '#10B981' : '#e11d48';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(badgeLabel, width - pad - badgeW + 32, 130);

  // Bottom Content Block
  let cursorY = height - (format === 'story' ? 680 : 590);

  // Tag chip
  drawRoundedRect(ctx, pad, cursorY, 290, 48, 24);
  ctx.fillStyle = '#ffb95f';
  ctx.fill();
  ctx.fillStyle = '#2a1700';
  ctx.font = '800 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(recipe.badgeChip.toUpperCase(), pad + 26, cursorY + 32);
  cursorY += 76;

  // Recipe Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 62px "Plus Jakarta Sans", system-ui, sans-serif';
  const titleLines = wrapLines(ctx, recipe.title, width - pad * 2, 3);
  for (const line of titleLines) {
    ctx.fillText(line, pad, cursorY);
    cursorY += 74;
  }

  cursorY += 12;

  // Meta Pills row
  const stats = [
    `⏱ ${recipe.totalMin} mins`,
    `★ ${recipe.rating.toFixed(1)}`,
    `🍽 ${servings} servings`,
    `🔥 ${recipe.kcal} kcal`
  ];
  let chipX = pad;
  ctx.font = '700 24px "Plus Jakarta Sans", system-ui, sans-serif';
  for (const stat of stats) {
    const w = ctx.measureText(stat).width + 44;
    if (chipX + w > width - pad) break;
    drawRoundedRect(ctx, chipX, cursorY, w, 54, 27);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.fill();
    ctx.fillStyle = '#fff8f6';
    ctx.fillText(stat, chipX + 22, cursorY + 36);
    chipX += w + 14;
  }

  cursorY += 86;

  // Key Ingredients Card
  const cardH = 220;
  drawRoundedRect(ctx, pad, cursorY, width - pad * 2, cardH, 28);
  ctx.fillStyle = 'rgba(255, 248, 246, 0.94)';
  ctx.fill();

  ctx.fillStyle = '#b80035';
  ctx.font = '800 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('KEY INGREDIENTS • ZERO LOGIN RECIPE', pad + 32, cursorY + 46);

  const previewItems = recipe.ingredientGroups.flatMap((g) => g.items).slice(0, 3);
  ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif';
  previewItems.forEach((item, idx) => {
    const qty = formatScaledIngredient(item, servings, recipe.baseServings, unit);
    const y = cursorY + 96 + idx * 44;
    ctx.fillStyle = '#b80035';
    ctx.fillText(qty, pad + 32, y);
    ctx.fillStyle = '#271811';
    const qtyW = ctx.measureText(qty).width + 20;
    const maxNameW = width - pad * 2 - 64 - qtyW;
    let label = item.name;
    while (ctx.measureText(label).width > maxNameW && label.length > 10) {
      label = label.slice(0, -4) + '...';
    }
    ctx.fillText(`• ${label}`, pad + 32 + qtyW, y);
  });

  // Footer CTA pill
  const footerY = height - 118;
  drawRoundedRect(ctx, pad, footerY, width - pad * 2, 68, 34);
  ctx.fillStyle = '#e11d48';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 25px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(
    'Tap link for Hands-Free Cook Mode & Instant Scaler →',
    pad + 44,
    footerY + 43
  );

  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob((b) => res(b), 'image/png')
  );
  return { dataUrl, blob };
}
