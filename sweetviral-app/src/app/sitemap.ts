import type { MetadataRoute } from 'next';
import { DESSERT_CATEGORIES, RECIPES } from '../data/recipes';

export const dynamic = 'force-static';

const SITE_ORIGIN = 'https://crave.devyy.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeEntry: MetadataRoute.Sitemap = [
    {
      url: `${SITE_ORIGIN}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    }
  ];

  const categoryEntries: MetadataRoute.Sitemap = DESSERT_CATEGORIES.filter(
    (c) => c.id !== 'all'
  ).map((cat) => ({
    url: `${SITE_ORIGIN}/category/${cat.id}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  const recipeEntries: MetadataRoute.Sitemap = RECIPES.map((r) => ({
    url: `${SITE_ORIGIN}/recipes/${r.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  return [...homeEntry, ...categoryEntries, ...recipeEntries];
}
