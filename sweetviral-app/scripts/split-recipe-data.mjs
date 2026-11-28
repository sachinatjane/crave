import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src/data');
const OUT_RECIPES_DIR = path.join(ROOT, 'public/recipes-data');

const flagship = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'flagshipRecipes.json'), 'utf8'));
const generated = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'generatedRecipes.json'), 'utf8'));
const all = [...flagship, ...generated];

fs.mkdirSync(OUT_RECIPES_DIR, { recursive: true });

const summaries = all.map((r) => {
  // Write individual full recipe JSON (~4-6 KB) for instant on-demand client fetch
  fs.writeFileSync(
    path.join(OUT_RECIPES_DIR, `${r.slug}.json`),
    JSON.stringify(r),
    'utf8'
  );

  // Strip heavy steps & ingredientGroups for the lightweight browse/search catalog
  const { steps: _s, ingredientGroups: _ig, ...summary } = r;
  return summary;
});

fs.writeFileSync(
  path.join(DATA_DIR, 'recipeSummaries.json'),
  JSON.stringify(summaries),
  'utf8'
);

console.log(
  `Split ${all.length} recipes -> src/data/recipeSummaries.json (${Math.round(
    fs.statSync(path.join(DATA_DIR, 'recipeSummaries.json')).size / 1024
  )} KB) + public/recipes-data/*.json`
);
