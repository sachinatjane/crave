import { Recipe, UnitSystem } from '../types/recipe';
import { formatScaledIngredient } from './scaler';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function updateRecipeMetadata(
  recipe: Recipe | null,
  servings?: number,
  unit: UnitSystem = 'us'
): void {
  if (typeof document === 'undefined') return;

  if (!recipe) {
    document.title = 'Crave — Viral Dessert Recipes (Zero Fluff, Instant Cook Mode)';
    return;
  }

  const activeServings = servings || recipe.baseServings;
  document.title = `${recipe.title} (${recipe.totalMin}m) — Crave`;
  upsertMeta('property', 'og:title', `${recipe.title} — ${recipe.viewsLabel}`);
  upsertMeta('property', 'og:description', recipe.hookLine);
  upsertMeta('property', 'og:image', recipe.heroImage);

  const schemaId = 'crave-recipe-jsonld';
  let script = document.getElementById(schemaId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const ingredients = recipe.ingredientGroups.flatMap((g) =>
    g.items.map(
      (item) => `${formatScaledIngredient(item, activeServings, recipe.baseServings, unit)} ${item.name}`
    )
  );

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    image: [recipe.heroImage, recipe.pinterestImage],
    author: {
      '@type': 'Person',
      name: recipe.creatorHandle
    },
    description: recipe.hookLine,
    prepTime: `PT${recipe.prepMin}M`,
    cookTime: `PT${recipe.bakeMin}M`,
    totalTime: `PT${recipe.totalMin}M`,
    recipeYield: `${activeServings} servings`,
    recipeCategory: 'Dessert',
    keywords: recipe.hashtags.join(', '),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.kcal} calories`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating,
      reviewCount: 2800
    },
    recipeIngredient: ingredients,
    recipeInstructions: recipe.steps.map((s) => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.instructionTemplate
    }))
  };

  script.textContent = JSON.stringify(jsonLd);
}
