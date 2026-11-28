import { DESSERT_CATEGORIES, RECIPE_SUMMARIES as RECIPES } from '../data/catalog';
import { Recipe, UnitSystem } from '../types/recipe';
import { formatScaledIngredient, renderStepInstruction } from './scaler';

const SITE_ORIGIN = 'https://crave.devyy.com';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

function toAbsoluteUrl(img: string): string {
  if (!img) return `${SITE_ORIGIN}/ai-images/dubai-brownie-hero.jpg`;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${SITE_ORIGIN}/${img.replace(/^\.\//, '')}`;
}

function upsertJsonLd(id: string, payload: unknown) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

export function updateRecipeMetadata(
  recipe: Recipe | null,
  servings?: number,
  unit: UnitSystem = 'us'
): void {
  if (typeof document === 'undefined') return;

  if (!recipe) {
    const homeTitle = `Crave Recipes — ${RECIPES.length}+ Healthy & Viral Dessert Recipes (Zero Refined Sugar Swaps)`;
    const homeDesc = `Explore ${RECIPES.length}+ healthy & viral dessert recipes with zero-refined-sugar swaps, under-250-cal treats, high-protein bakes & hands-free Cook Mode.`;
    const homeImg = `${SITE_ORIGIN}/ai-images/dubai-brownie-hero.jpg`;

    document.title = homeTitle;
    upsertCanonical(`${SITE_ORIGIN}/`);
    upsertMeta('name', 'description', homeDesc);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', `${SITE_ORIGIN}/`);
    upsertMeta('property', 'og:title', homeTitle);
    upsertMeta('property', 'og:description', homeDesc);
    upsertMeta('property', 'og:image', homeImg);
    upsertMeta('name', 'twitter:title', homeTitle);
    upsertMeta('name', 'twitter:description', homeDesc);
    upsertMeta('name', 'twitter:image', homeImg);

    upsertJsonLd('crave-recipe-jsonld', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'Crave Recipes',
          url: `${SITE_ORIGIN}/`,
          description: homeDesc,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_ORIGIN}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'ItemList',
          name: 'Top Viral Dessert Recipes on Crave Recipes',
          numberOfItems: 12,
          itemListElement: RECIPES.slice(0, 12).map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: r.title,
            url: `${SITE_ORIGIN}/recipes/${r.slug}/`
          }))
        }
      ]
    });
    return;
  }

  const activeServings = servings || recipe.baseServings;
  const canonicalUrl = `${SITE_ORIGIN}/recipes/${recipe.slug}/`;
  const absImg = toAbsoluteUrl(recipe.heroImage);
  const pageTitle = `${recipe.title} Recipe (${recipe.totalMin} Mins) — Easy ${recipe.cuisine} Dessert | Crave Recipes`;
  const metaDesc = `${recipe.hookLine} Ready in ${recipe.totalMin} mins (${activeServings} servings). ${recipe.rating.toFixed(1)}★ rated with US/Metric scaling & hands-free Cook Mode.`;
  const catLabel =
    DESSERT_CATEGORIES.find((c) => c.id === recipe.dessertCategory)?.label || 'Dessert';

  document.title = pageTitle;
  upsertCanonical(canonicalUrl);
  upsertMeta('name', 'description', metaDesc);
  upsertMeta('property', 'og:type', 'article');
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:title', `${recipe.title} — Crave Recipes`);
  upsertMeta('property', 'og:description', metaDesc);
  upsertMeta('property', 'og:image', absImg);
  upsertMeta('name', 'twitter:title', pageTitle);
  upsertMeta('name', 'twitter:description', metaDesc);
  upsertMeta('name', 'twitter:image', absImg);

  const ingredients = recipe.ingredientGroups.flatMap((g) =>
    g.items.map(
      (item) => `${formatScaledIngredient(item, activeServings, recipe.baseServings, unit)} ${item.name}`
    )
  );

  const reviewCountNum = Math.max(
    40,
    Math.round(parseFloat(recipe.ratingCount.replace(/k/i, '')) * (/k/i.test(recipe.ratingCount) ? 1000 : 1)) || 120
  );

  upsertJsonLd('crave-recipe-jsonld', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Recipe',
        mainEntityOfPage: canonicalUrl,
        name: recipe.title,
        image: [absImg, toAbsoluteUrl(recipe.pinterestImage)],
        datePublished: '2026-11-01',
        author: {
          '@type': 'Person',
          name: recipe.creatorHandle
        },
        publisher: {
          '@type': 'Organization',
          name: 'Crave Recipes',
          url: `${SITE_ORIGIN}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_ORIGIN}/icon-512.png`,
            width: 512,
            height: 512
          }
        },
        description: metaDesc,
        prepTime: `PT${recipe.prepMin}M`,
        cookTime: `PT${recipe.bakeMin}M`,
        totalTime: `PT${recipe.totalMin}M`,
        recipeYield: `${activeServings} servings`,
        recipeCategory: catLabel,
        recipeCuisine: recipe.cuisine,
        keywords: [recipe.title, recipe.cuisine, catLabel, ...recipe.hashtags].join(', '),
        nutrition: {
          '@type': 'NutritionInformation',
          calories: `${recipe.kcal} calories`
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: recipe.rating,
          reviewCount: reviewCountNum
        },
        recipeIngredient: ingredients,
        recipeInstructions: recipe.steps.map((s) => ({
          '@type': 'HowToStep',
          name: s.title,
          text: renderStepInstruction(s.instructionTemplate, recipe, activeServings, unit),
          url: `${canonicalUrl}#step-${s.stepNumber}`
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_ORIGIN}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: catLabel,
            item: `${SITE_ORIGIN}/category/${recipe.dessertCategory}/`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: recipe.title,
            item: canonicalUrl
          }
        ]
      }
    ]
  });
}
