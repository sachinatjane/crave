import { Recipe } from '../types/recipe';
import { getSiteRootPath } from '../utils/assetUrl';
import {
  COMMUNITY_STITCHES,
  DESSERT_CATEGORIES,
  PANTRY_INGREDIENTS
} from './constants';
import summariesData from './recipeSummaries.json';

export { COMMUNITY_STITCHES, DESSERT_CATEGORIES, PANTRY_INGREDIENTS };

export const RECIPE_SUMMARIES: Recipe[] = summariesData as unknown as Recipe[];

const recipeCache = new Map<string, Recipe>();

export function primeRecipeCache(recipe: Recipe): void {
  if (recipe?.slug) recipeCache.set(recipe.slug, recipe);
}

export async function fetchFullRecipe(slug: string): Promise<Recipe | null> {
  if (recipeCache.has(slug)) {
    return recipeCache.get(slug) || null;
  }
  try {
    const res = await fetch(`${getSiteRootPath()}recipes-data/${slug}.json`);
    if (!res.ok) return null;
    const data = (await res.json()) as Recipe;
    recipeCache.set(slug, data);
    return data;
  } catch {
    return null;
  }
}
