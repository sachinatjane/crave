import type { Metadata } from 'next';
import { App } from '../../../App';
import { DESSERT_CATEGORIES, RECIPES } from '../../../data/recipes';
import { DessertCategory } from '../../../types/recipe';

const SITE_ORIGIN = 'https://crave.devyy.com';

function toAbsoluteUrl(img?: string): string {
  if (!img) return `${SITE_ORIGIN}/ai-images/dubai-brownie-hero.jpg`;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${SITE_ORIGIN}/${img.replace(/^\.\//, '')}`;
}

export function generateStaticParams() {
  return DESSERT_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => ({
    slug: cat.id
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = DESSERT_CATEGORIES.find((c) => c.id === slug);
  const catLabel = cat?.label || 'Dessert';
  const catRecipes = RECIPES.filter((r) => r.dessertCategory === slug);
  const title = `${catLabel} Recipes (${catRecipes.length} Viral Desserts) | Crave Recipes`;
  const description = `Make ${catRecipes.length} trending ${catLabel.toLowerCase()} recipes with instant US/Metric scaling, Cook Mode timers & 1-tap story sharing. No login required.`;
  const canonical = `${SITE_ORIGIN}/category/${slug}/`;
  const ogImage = toAbsoluteUrl(catRecipes[0]?.heroImage);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [{ url: ogImage, alt: title }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = DESSERT_CATEGORIES.find((c) => c.id === slug);
  const catLabel = cat?.label || 'Dessert';
  const catRecipes = RECIPES.filter((r) => r.dessertCategory === slug);
  const catUrl = `${SITE_ORIGIN}/category/${slug}/`;
  const catDesc = `Make ${catRecipes.length} trending ${catLabel.toLowerCase()} recipes with instant US/Metric scaling, Cook Mode timers & 1-tap story sharing. No login required.`;

  const catJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: catLabel,
    url: catUrl,
    description: catDesc,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: Math.min(20, catRecipes.length),
      itemListElement: catRecipes.slice(0, 20).map((r, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: r.title,
        url: `${SITE_ORIGIN}/recipes/${r.slug}/`
      }))
    }
  };

  return (
    <>
      <script
        id="crave-recipe-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catJsonLd) }}
      />
      <noscript>
        <main>
          <h1>{catLabel} Recipes</h1>
          <p>{catDesc}</p>
          <ul>
            {catRecipes.map((r) => (
              <li key={r.id}>
                <a href={`/recipes/${r.slug}/`}>{r.title}</a>
              </li>
            ))}
          </ul>
        </main>
      </noscript>
      <App initialCategorySlug={slug as DessertCategory} />
    </>
  );
}
