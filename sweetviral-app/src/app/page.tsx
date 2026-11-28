import { App } from '../App';
import { DESSERT_CATEGORIES, RECIPES } from '../data/recipes';

const SITE_ORIGIN = 'https://crave.devyy.com';

export default function HomePage() {
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
      {
        '@type': 'WebSite',
        name: 'Crave Recipes',
        url: `${SITE_ORIGIN}/`,
        description: `Explore ${RECIPES.length}+ healthy & viral dessert recipes with zero-refined-sugar swaps, instant US/Metric scaling, and hands-free Cook Mode.`,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_ORIGIN}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'ItemList',
        name: 'Top Viral & Healthy Dessert Recipes on Crave Recipes',
        numberOfItems: 12,
        itemListElement: RECIPES.slice(0, 12).map((r, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: r.title,
          url: `${SITE_ORIGIN}/recipes/${r.slug}/`
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Are Crave Recipes desserts healthy or refined-sugar-free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Crave Recipes includes dedicated Zero-Refined-Sugar recipes plus a 1-tap Healthy Swap mode on every recipe page that converts refined sugars and flours into wholesome alternatives.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I scale servings and switch between US and Metric units?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Every recipe on Crave Recipes has an instant serving scaler and a US/Metric unit converter that updates all ingredients and step-by-step instructions live.'
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <noscript>
        <main>
          <h1>Crave Recipes — {RECIPES.length}+ Healthy &amp; Viral Dessert Recipes</h1>
          <nav aria-label="Dessert Categories">
            {DESSERT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <a key={c.id} href={`/category/${c.id}/`}>
                {c.label}
              </a>
            ))}
          </nav>
          <ul>
            {RECIPES.slice(0, 60).map((r) => (
              <li key={r.id}>
                <a href={`/recipes/${r.slug}/`}>{r.title}</a>
              </li>
            ))}
          </ul>
        </main>
      </noscript>
      <App />
    </>
  );
}
