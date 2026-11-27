export function getSiteRootPath(): string {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname;
  const idxRecipes = path.indexOf('/recipes/');
  if (idxRecipes !== -1) return path.slice(0, idxRecipes + 1);
  const idxCat = path.indexOf('/category/');
  if (idxCat !== -1) return path.slice(0, idxCat + 1);
  if (path.endsWith('/')) return path;
  const lastSlash = path.lastIndexOf('/');
  return lastSlash >= 0 ? path.slice(0, lastSlash + 1) : '/';
}

export function resolveAssetUrl(src: string): string {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const clean = src.replace(/^\.\//, '');
  if (typeof window === 'undefined') return clean;
  return `${window.location.origin}${getSiteRootPath()}${clean}`;
}
