import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_ORIGIN = 'https://sachinatjane.github.io/crave';
const TODAY = new Date().toISOString().slice(0, 10);

const CATEGORIES = [
  { id: 'healthy-light', label: 'Healthy & Zero-Sugar' },
  { id: 'chocolate-brownies', label: 'Chocolate & Brownies' },
  { id: 'cookies-bars', label: 'Cookies & Bars' },
  { id: 'cakes-cupcakes', label: 'Cakes & Mug Cakes' },
  { id: 'cheesecake-tiramisu', label: 'Cheesecake & Tiramisu' },
  { id: 'pastries-donuts', label: 'Pastries & Donuts' },
  { id: 'pies-tarts', label: 'Pies, Tarts & Crumbles' },
  { id: 'puddings-custards', label: 'Puddings & Custards' },
  { id: 'frozen-candy', label: 'Frozen & Tanghulu' },
  { id: 'global-viral', label: 'Global Classics' }
];

const flagship = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/flagshipRecipes.json'), 'utf8')
);
const generated = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/generatedRecipes.json'), 'utf8')
);
const ALL_RECIPES = [...flagship, ...generated];

const baseHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(str = '') {
  return escapeHtml(str).replace(/'/g, '&apos;');
}

function toAbsoluteUrl(img) {
  if (!img) return `${SITE_ORIGIN}/ai-images/dubai-brownie-hero.jpg`;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${SITE_ORIGIN}/${img.replace(/^\.\//, '')}`;
}

function resolveStepText(template, recipe) {
  const allItems = (recipe.ingredientGroups || []).flatMap((g) => g.items || []);
  const byId = new Map(allItems.map((it) => [it.id, it]));
  return String(template || '').replace(/\{([a-zA-Z0-9_]+)\}/g, (_, id) => {
    const it = byId.get(id);
    if (!it) return id;
    return `${it.baseAmount} ${it.usUnit} ${it.name.toLowerCase()}`;
  });
}

function injectHeadTags(html, { title, desc, canonical, ogType, ogImage, jsonLd, depthPrefix }) {
  let out = html;
  if (depthPrefix !== './') {
    out = out
      .replace(/href="\.\/manifest\.webmanifest"/g, `href="${depthPrefix}manifest.webmanifest"`)
      .replace(/href="\.\/favicon\.svg"/g, `href="${depthPrefix}favicon.svg"`)
      .replace(/href="\.\/favicon-32x32\.png"/g, `href="${depthPrefix}favicon-32x32.png"`)
      .replace(/href="\.\/favicon\.ico"/g, `href="${depthPrefix}favicon.ico"`)
      .replace(/href="\.\/apple-touch-icon\.png"/g, `href="${depthPrefix}apple-touch-icon.png"`)
      .replace(/src="\.\/assets\//g, `src="${depthPrefix}assets/`)
      .replace(/href="\.\/assets\//g, `href="${depthPrefix}assets/`);
  }

  out = out
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(desc)}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${escapeHtml(canonical)}" />`
    )
    .replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:type" content="${escapeHtml(ogType)}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${escapeHtml(canonical)}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtml(desc)}" />`
    )
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtml(desc)}" />`
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
    );

  const ldScript = `<script id="crave-recipe-jsonld" type="application/ld+json">${JSON.stringify(
    jsonLd
  )}</script>`;
  out = out.replace('</head>', `  ${ldScript}\n  </head>`);
  return out;
}

// 1. Enrich root dist/index.html with WebSite + ItemList JSON-LD and semantic crawler fallback
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Crave',
      url: `${SITE_ORIGIN}/`,
      description: `Explore ${ALL_RECIPES.length}+ trending American, European & global viral dessert recipes with instant scaling and Cook Mode.`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_ORIGIN}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'ItemList',
      name: 'Top Viral Dessert Recipes on Crave',
      numberOfItems: 12,
      itemListElement: ALL_RECIPES.slice(0, 12).map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: r.title,
        url: `${SITE_ORIGIN}/recipes/${r.slug}/`
      }))
    }
  ]
};

const homeFallback = `<main style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><h1>Crave — ${ALL_RECIPES.length}+ Viral Dessert Recipes</h1><nav>${CATEGORIES.map(
  (c) => `<a href="./category/${c.id}/">${escapeHtml(c.label)}</a>`
).join(' ')}</nav><ul>${ALL_RECIPES.slice(0, 40)
  .map((r) => `<li><a href="./recipes/${r.slug}/">${escapeHtml(r.title)}</a></li>`)
  .join('')}</ul></main>`;

const enrichedHome = injectHeadTags(baseHtml, {
  title: `Crave — ${ALL_RECIPES.length}+ Healthy & Viral Dessert Recipes (Zero Refined Sugar Swaps)`,
  desc: `Explore ${ALL_RECIPES.length}+ healthy & viral dessert recipes with zero-refined-sugar swaps, under-250-cal treats, US/Metric scaling & Cook Mode.`,
  canonical: `${SITE_ORIGIN}/`,
  ogType: 'website',
  ogImage: `${SITE_ORIGIN}/ai-images/dubai-brownie-hero.jpg`,
  jsonLd: homeJsonLd,
  depthPrefix: './'
}).replace('<div id="root"></div>', `<div id="root">${homeFallback}</div>`);

fs.writeFileSync(path.join(DIST, 'index.html'), enrichedHome, 'utf8');
fs.writeFileSync(path.join(DIST, '404.html'), enrichedHome, 'utf8');

// 2. Generate 9 Category Landing Pages (dist/category/<id>/index.html)
for (const cat of CATEGORIES) {
  const catRecipes = ALL_RECIPES.filter((r) => r.dessertCategory === cat.id);
  const catUrl = `${SITE_ORIGIN}/category/${cat.id}/`;
  const catTitle = `${cat.label} Recipes (${catRecipes.length} Viral Desserts) | Crave`;
  const catDesc = `Make ${catRecipes.length} trending ${cat.label.toLowerCase()} recipes with instant US/Metric scaling, Cook Mode timers & 1-tap story sharing. No login required.`;
  const catImg = toAbsoluteUrl(catRecipes[0]?.heroImage);

  const catJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cat.label,
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

  const catFallback = `<main style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><h1>${escapeHtml(
    cat.label
  )} Recipes</h1><p>${escapeHtml(catDesc)}</p><ul>${catRecipes
    .map((r) => `<li><a href="../../recipes/${r.slug}/">${escapeHtml(r.title)}</a></li>`)
    .join('')}</ul></main>`;

  const catHtml = injectHeadTags(baseHtml, {
    title: catTitle,
    desc: catDesc,
    canonical: catUrl,
    ogType: 'website',
    ogImage: catImg,
    jsonLd: catJsonLd,
    depthPrefix: '../../'
  }).replace('<div id="root"></div>', `<div id="root">${catFallback}</div>`);

  const dir = path.join(DIST, 'category', cat.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), catHtml, 'utf8');
}

// 3. Generate 400 Static Recipe Pages (dist/recipes/<slug>/index.html)
for (const recipe of ALL_RECIPES) {
  const recipeUrl = `${SITE_ORIGIN}/recipes/${recipe.slug}/`;
  const absImg = toAbsoluteUrl(recipe.heroImage);
  const catLabel =
    CATEGORIES.find((c) => c.id === recipe.dessertCategory)?.label || 'Dessert';
  const title = `${recipe.title} Recipe (${recipe.totalMin} Mins) — Easy ${recipe.cuisine} Dessert | Crave`;
  const desc = `${recipe.hookLine} Ready in ${recipe.totalMin} mins (${recipe.baseServings} servings). ${recipe.rating.toFixed(1)}★ rated with US/Metric scaling & hands-free Cook Mode.`;

  const ingredients = (recipe.ingredientGroups || []).flatMap((g) =>
    (g.items || []).map((it) => `${it.baseAmount} ${it.usUnit} ${it.name}`)
  );

  const reviewCountNum = Math.max(
    40,
    Math.round(
      parseFloat(String(recipe.ratingCount || '120').replace(/k/i, '')) *
        (/k/i.test(String(recipe.ratingCount)) ? 1000 : 1)
    ) || 120
  );

  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Recipe',
        mainEntityOfPage: recipeUrl,
        name: recipe.title,
        image: [absImg, toAbsoluteUrl(recipe.pinterestImage)],
        author: { '@type': 'Person', name: recipe.creatorHandle || '@crave_kitchen' },
        publisher: { '@type': 'Organization', name: 'Crave', url: `${SITE_ORIGIN}/` },
        description: desc,
        prepTime: `PT${recipe.prepMin}M`,
        cookTime: `PT${recipe.bakeMin}M`,
        totalTime: `PT${recipe.totalMin}M`,
        recipeYield: `${recipe.baseServings} servings`,
        recipeCategory: catLabel,
        recipeCuisine: recipe.cuisine,
        keywords: [recipe.title, recipe.cuisine, catLabel, ...(recipe.hashtags || [])].join(', '),
        nutrition: { '@type': 'NutritionInformation', calories: `${recipe.kcal} calories` },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: recipe.rating,
          reviewCount: reviewCountNum
        },
        recipeIngredient: ingredients,
        recipeInstructions: (recipe.steps || []).map((s) => ({
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
      }
    ]
  };

  const recipeFallback = `<article style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><h1>${escapeHtml(
    recipe.title
  )}</h1><p>${escapeHtml(desc)}</p><h2>Ingredients</h2><ul>${ingredients
    .map((ing) => `<li>${escapeHtml(ing)}</li>`)
    .join('')}</ul><h2>Instructions</h2><ol>${(recipe.steps || [])
    .map((s) => `<li><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(resolveStepText(s.instructionTemplate, recipe))}</p></li>`)
    .join('')}</ol><nav><a href="../../">Home</a> <a href="../../category/${
    recipe.dessertCategory
  }/">${escapeHtml(catLabel)}</a></nav></article>`;

  const recipeHtml = injectHeadTags(baseHtml, {
    title,
    desc,
    canonical: recipeUrl,
    ogType: 'article',
    ogImage: absImg,
    jsonLd: recipeJsonLd,
    depthPrefix: '../../'
  }).replace('<div id="root"></div>', `<div id="root">${recipeFallback}</div>`);

  const dir = path.join(DIST, 'recipes', recipe.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), recipeHtml, 'utf8');
}

// 4. Generate sitemap.xml (Home + 9 Categories + 400 Recipes = 410 URLs)
const sitemapUrls = [
  `  <url>\n    <loc>${SITE_ORIGIN}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  ...CATEGORIES.map(
    (c) =>
      `  <url>\n    <loc>${SITE_ORIGIN}/category/${c.id}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`
  ),
  ...ALL_RECIPES.map(
    (r) =>
      `  <url>\n    <loc>${escapeXml(`${SITE_ORIGIN}/recipes/${r.slug}/`)}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <image:image>\n      <image:loc>${escapeXml(toAbsoluteUrl(r.heroImage))}</image:loc>\n      <image:title>${escapeXml(r.title)}</image:title>\n    </image:image>\n  </url>`
  )
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapUrls.join(
  '\n'
)}\n</urlset>\n`;

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemapXml, 'utf8');

// 5. Generate robots.txt and ads.txt
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robotsTxt, 'utf8');

const adsTxt = `google.com, pub-6889606875840958, DIRECT, f08c47fec0942fa0\n`;
fs.writeFileSync(path.join(DIST, 'ads.txt'), adsTxt, 'utf8');

console.log(
  `SEO generation complete: 1 home + ${CATEGORIES.length} categories + ${ALL_RECIPES.length} recipes = ${
    1 + CATEGORIES.length + ALL_RECIPES.length
  } HTML pages + sitemap.xml + robots.txt`
);
