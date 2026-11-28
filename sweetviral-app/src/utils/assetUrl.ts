export function getSiteRootPath(): string {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname;
  if (path === '/crave' || path.startsWith('/crave/')) return '/crave/';
  return '/';
}

export function resolveAssetUrl(src: string): string {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const clean = src.replace(/^\.?\//, '');
  return `${getSiteRootPath()}${clean}`;
}
