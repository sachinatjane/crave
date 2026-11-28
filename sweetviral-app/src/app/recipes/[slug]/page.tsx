import type { Metadata } from 'next';
import { App } from '../../../App';
import { DESSERT_CATEGORIES, RECIPES } from '../../../data/recipes';
import { Recipe } from '../../../types/recipe';

const SITE_ORIGIN = 'https://crave.devyy.com';

function toAbsoluteUrl(img?: string): string {
  if (!img) return `${SITE_ORIGIN}/ai-images/dubai-brownie-hero.jpg`;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${SITE_ORIGIN}/${img.replace(/^\.\//, '')}`;
}

function resolveStepText(template: string, recipe: Recipe): string {
  const allItems = recipe.ingredientGroups.flatMap((g) => g.items);
  const byId = new Map(allItems.map((it) => [it.id, it]));
  return String(template || '').replace(/\{([a-zA-Z0-9_]+)\}/g, (_, id: string) => {
    const it = byId.get(id);
    if (!it) return id;
    return `${it.baseAmount} ${it.usUnit} ${it.name.toLowerCase()}`;
  });
}

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({
    slug: recipe.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = RECIPES.find((r) => r.slug === slug) || RECIPES[0];
  const title = `${recipe.title} Recipe (${recipe.totalMin} Mins) — Easy ${recipe.cuisine} Dessert | Crave Recipes`;
  const description = `${recipe.hookLine} Ready in ${recipe.totalMin} mins (${recipe.baseServings} servings). ${recipe.rating.toFixed(1)}★ rated with US/Metric scaling & hands-free Cook Mode.`;
  const canonical = `${SITE_ORIGIN}/recipes/${recipe.slug}/`;
  const ogImage = toAbsoluteUrl(recipe.heroImage);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${recipe.title} — Crave Recipes`,
      description,
      images: [{ url: ogImage, width: 1024, height: 1024, alt: recipe.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function RecipePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = RECIPES.find((r) => r.slug === slug) || RECIPES[0];
  const recipeUrl = `${SITE_ORIGIN}/recipes/${recipe.slug}/`;
  const absImg = toAbsoluteUrl(recipe.heroImage);
  const catLabel =
    DESSERT_CATEGORIES.find((c) => c.id === recipe.dessertCategory)?.label || 'Dessert';
  const desc = `${recipe.hookLine} Ready in ${recipe.totalMin} mins (${recipe.baseServings} servings). ${recipe.rating.toFixed(1)}★ rated with US/Metric scaling & hands-free Cook Mode.`;

  const ingredients = recipe.ingredientGroups.flatMap((g) =>
    g.items.map((it) => `${it.baseAmount} ${it.usUnit} ${it.name}`)
  );

  const reviewCountNum = Math.max(
    40,
    Math.round(
      parseFloat(String(recipe.ratingCount || '120').replace(/k/i, '')) *
        (/k/i.test(String(recipe.ratingCount)) ? 1000 : 1)
    ) || 120
  );

  const relatedRecipes = RECIPES.filter(
    (r) => r.dessertCategory === recipe.dessertCategory && r.slug !== recipe.slug
  ).slice(0, 6);

  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Recipe',
        mainEntityOfPage: recipeUrl,
        name: recipe.title,
        image: [absImg, toAbsoluteUrl(recipe.pinterestImage)],
        datePublished: '2026-11-01',
        author: { '@type': 'Person', name: recipe.creatorHandle || '@crave_kitchen' },
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
        description: desc,
        prepTime: `PT${recipe.prepMin}M`,
        cookTime: `PT${recipe.bakeMin}M`,
        totalTime: `PT${recipe.totalMin}M`,
        recipeYield: `${recipe.baseServings} servings`,
        recipeCategory: catLabel,
        recipeCuisine: recipe.cuisine,
        keywords: [recipe.title, recipe.cuisine, catLabel, ...recipe.hashtags].join(', '),
        nutrition: { '@type': 'NutritionInformation', calories: `${recipe.kcal} calories` },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: recipe.rating,
          reviewCount: reviewCountNum
        },
        recipeIngredient: ingredients,
        recipeInstructions: recipe.steps.map((s) => ({
          '@type': 'HowToStep',
          name: s.title,
          text: resolveStepText(s.instructionTemplate, recipe),
          url: `${recipeUrl}#step-${s.stepNumber}`
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: catLabel,
            item: `${SITE_ORIGIN}/category/${recipe.dessertCategory}/`
          },
          { '@type': 'ListItem', position: 3, name: recipe.title, item: recipeUrl }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How long does it take to make ${recipe.title}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${recipe.title} takes ${recipe.totalMin} minutes total (${recipe.prepMin} minutes prep) and yields ${recipe.baseServings} servings at ${recipe.kcal} calories per serving.`
            }
          },
          {
            '@type': 'Question',
            name: `Can I make ${recipe.title} healthier or with zero refined sugar?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes! Toggle the Healthy Swap mode on this ${recipe.title} recipe page to convert ingredients into lower-sugar, higher-protein, or wholesome alternatives automatically.`
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        id="crave-recipe-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />
      <noscript>
        <article>
          <h1>{recipe.title}</h1>
          <p>{desc}</p>
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <h2>Step-by-Step Instructions</h2>
          <ol>
            {recipe.steps.map((s) => (
              <li key={s.stepNumber}>
                <h3>{s.title}</h3>
                <p>{resolveStepText(s.instructionTemplate, recipe)}</p>
              </li>
            ))}
          </ol>
          {relatedRecipes.length > 0 && (
            <ul>
              {relatedRecipes.map((rel) => (
                <li key={rel.id}>
                  <a href={`/recipes/${rel.slug}/`}>{rel.title}</a>
                </li>
              ))}
            </ul>
          )}
        </article>
      </noscript>
      <App initialRecipeSlug={recipe.slug} initialRecipe={recipe} />
    </>
  );
}
