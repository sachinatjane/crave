import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../src/data');

const FLAGSHIP_PATH = path.join(DATA_DIR, 'flagshipRecipes.json');
const GENERATED_PATH = path.join(DATA_DIR, 'generatedRecipes.json');

function detectMethod(recipe) {
  const hay = [
    recipe.title,
    recipe.hookLine,
    recipe.dessertCategory,
    ...(recipe.steps || []).map((s) => `${s.title} ${s.instructionTemplate}`)
  ]
    .join(' ')
    .toLowerCase();

  if (/\bmicrowave\b|\bmug cake\b|\b90-sec|\b2-min.*mug\b/.test(hay)) return 'microwave';
  if (/\bair[\s-]?fry/.test(hay)) return 'air-fryer';
  if (/\bdeep[\s-]?fry\b|\bhot oil\b|\bchurro|\bdonut|\bdoughnut|\bfritter|\bbeignet|\bfried\b/.test(hay)) {
    return 'fry';
  }
  if (/\bwaffle|\bcroffle|\bpancake|\bcrepe/.test(hay)) return 'griddle';
  if (/\bfreeze|\bfrozen|\bice cream|\bsorbet|\bgelato|\bbark\b|\bnice cream/.test(hay) && recipe.bakeMin === 0) {
    return 'freeze';
  }
  if (recipe.bakeMin === 0 && !/\bbake\b|\boven\b|\bpreheat\b/.test(hay)) {
    if (/\bboil|\bsimmer|\bsyrup|\btanghulu|\bcompote|\bcurd|\bcustard|\bpudding/.test(hay)) return 'stovetop';
    return 'no-bake';
  }
  if (/\bcustard\b|\bpudding\b|\bcurd\b|\bfudge\b|\bcompote\b|\bcreme brulee\b/.test(hay)) return 'stovetop';
  return 'bake';
}

function formatIngList(items) {
  if (!items || items.length === 0) return 'the measured ingredients';
  const tokens = items.map((i) => `{${i.id}}`);
  if (tokens.length === 1) return tokens[0];
  if (tokens.length === 2) return `${tokens[0]} and ${tokens[1]}`;
  return `${tokens.slice(0, -1).join(', ')}, and ${tokens[tokens.length - 1]}`;
}

function getAllItems(recipe) {
  return (recipe.ingredientGroups || []).flatMap((g) => g.items || []);
}

function smartStepTitle(rawTitle, instructionText, method, stepIdx, totalSteps) {
  const title = (rawTitle || '').replace(/\s+/g, ' ').trim();
  const isAwkward =
    /^(Build the |Mix the Prep|Finish & Serve)/i.test(title) ||
    /\bLayer Layer\b/i.test(title) ||
    title.length < 6;

  if (!isAwkward) return title;

  const lower = `${title} ${instructionText}`.toLowerCase();

  if (/\bheat oil\b/.test(lower)) return 'Heat Oil to 350°F (175°C)';
  if (/\bhot oil\b|\bfry\b/.test(lower) && !/\bdrain\b|\bserve\b/.test(lower)) {
    return 'Fry Until Golden & Crisp';
  }
  if (/\bdip\b|\bcoat\b|\bpanko\b|\bbreadcrumb|\bdredge\b/.test(lower)) return 'Dip & Coat Evenly';
  if (/\bsift\b|\bdry ingredients\b/.test(lower)) return 'Sift & Whisk Dry Ingredients';
  if (/\bcream\b|\bbutter\b.*sugar/.test(lower)) return 'Cream Butter & Sugar Fluffy';
  if (/\bwhip\b|\bsoft peaks\b|\bstiff peaks\b|\bmeringue\b/.test(lower)) return 'Whip Until Airy & Glossy';
  if (/\bmelt\b|\bchocolate\b.*butter|\bganache\b/.test(lower)) return 'Melt & Whisk Smooth';
  if (/\bdissolve\b|\bsimmer\b|\bboil\b|\bcaramel\b/.test(lower)) return 'Simmer & Dissolve Smoothly';
  if (/\bknead\b|\bdough\b|\broll\b|\bpress\b.*crust/.test(lower)) return 'Shape & Press Dough Evenly';
  if (/\bwaffle\b|\biron\b|\bgriddle\b/.test(lower)) return 'Cook on Hot Iron Until Crisp';
  if (/\bpreheat\b|\bline\b.*pan/.test(lower)) return 'Preheat & Prep Your Pan';
  if (/\bbake\b|\btoothpick\b/.test(lower) && stepIdx < totalSteps - 1) return 'Bake Until Golden & Set';
  if (/\bchill\b|\brefrigerate\b|\bfreeze\b/.test(lower) && stepIdx < totalSteps - 1) {
    return 'Chill Until Firmly Set';
  }
  if (/^Finish & Serve/i.test(title) || stepIdx === totalSteps - 1) {
    if (method === 'fry') return 'Drain Crisp, Garnish & Serve Warm';
    if (method === 'freeze') return 'Freeze Solid, Slice & Serve';
    if (method === 'no-bake') return 'Chill Firm, Slice & Serve';
    return 'Cool, Garnish & Serve';
  }
  if (/Mix the Prep/i.test(title) || stepIdx === 0) return 'Whisk & Combine Base Ingredients';
  if (/Build the Flavor/i.test(title)) return 'Fold In Flavorings & Mix-Ins';
  if (/Build the Shape/i.test(title)) return 'Portion, Shape & Layer Evenly';
  if (/Build the Bake/i.test(title)) {
    return method === 'no-bake' || method === 'freeze' ? 'Chill & Set Structure' : 'Bake & Check Doneness';
  }
  return title.replace(/^Build the /i, '').trim() || 'Prepare Mixture';
}

function defaultProTip(recipe, method) {
  const title = recipe.title;
  switch (method) {
    case 'microwave':
      return `Stop microwaving while the center of ${title} still looks slightly glossy—residual heat finishes cooking it in 45 seconds so it stays fudgy, never rubbery.`;
    case 'air-fryer':
      return `Leave a little space around each piece in the air-fryer basket so hot air circulates evenly and creates crisp golden edges on ${title}.`;
    case 'freeze':
      return `Let ${title} sit at room temperature for 3–5 minutes before slicing or scooping so the texture turns creamy and slices cleanly without cracking.`;
    case 'no-bake':
      return `Chill ${title} until completely firm before portioning, and wipe your knife with a warm damp cloth between cuts for bakery-sharp edges.`;
    case 'stovetop':
      return `Keep the heat on medium-low and whisk constantly around the corners of the saucepan so ${title} thickens velvety smooth without scorching.`;
    case 'fry':
      return `Use a thermometer or test with a tiny bit of batter—keeping oil steady around 350°F (175°C) gives ${title} a crisp shell without soaking up grease.`;
    case 'griddle':
      return `Preheat your waffle iron or griddle fully and wait until steam noticeably slows before opening so ${title} releases cleanly with a caramelized crust.`;
    default:
      return `Use room-temperature dairy and eggs for ${title}, and pull it from the oven when the edges are set and a toothpick has moist crumbs—overbaking dries it out.`;
  }
}

function ensureAllIngredientsReferenced(steps, allItems) {
  const fullText = steps.map((s) => s.instructionTemplate || '').join(' ');
  const unused = allItems.filter((item) => !fullText.includes(`{${item.id}}`));
  if (unused.length === 0) return steps;

  const updated = steps.map((s) => ({ ...s }));
  // Distribute unused ingredients to their stepRef step (or step 1 / middle step)
  const buckets = new Map();
  for (const item of unused) {
    const targetIdx = Math.min(
      updated.length - 1,
      Math.max(0, (item.stepRef || 1) - 1)
    );
    if (!buckets.has(targetIdx)) buckets.set(targetIdx, []);
    buckets.get(targetIdx).push(item);
  }

  for (const [idx, items] of buckets.entries()) {
    const ingStr = formatIngList(items);
    const step = updated[idx];
    const isLast = idx === updated.length - 1;
    const phrase = isLast
      ? ` Finish with ${ingStr} right before serving.`
      : ` Incorporate ${ingStr} smoothly until evenly distributed.`;
    step.instructionTemplate = `${(step.instructionTemplate || '').trim()}${phrase}`;
  }

  return updated;
}

function buildFinalSteps(recipe) {
  const allItems = getAllItems(recipe);
  const method = detectMethod(recipe);
  const firstHalf = allItems.slice(0, Math.max(1, Math.ceil(allItems.length / 2)));
  const secondHalf = allItems.slice(Math.max(1, Math.ceil(allItems.length / 2)));
  const firstRef = formatIngList(firstHalf);
  const secondRef = secondHalf.length > 0 ? formatIngList(secondHalf) : formatIngList(allItems.slice(-2));
  const prepTime = Math.max(2, Math.round((recipe.prepMin || 10) * 0.4));
  const cookTime = Math.max(2, recipe.bakeMin || Math.round((recipe.totalMin || 15) * 0.5));

  let steps = (recipe.steps || []).map((s) => ({ ...s }));

  // Deduplicate identical instructions if any exist
  const seenText = new Set();
  steps = steps.filter((s) => {
    const key = (s.instructionTemplate || '').trim();
    if (seenText.has(key)) return false;
    seenText.add(key);
    return true;
  });

  // If < 4 steps, add a distinct middle assembly/texture step so we never duplicate finish steps
  if (steps.length < 4) {
    const insertAt = Math.max(1, steps.length - 1);
    const middleStep =
      method === 'bake' || method === 'air-fryer'
        ? {
            phaseLabel: 'Bake & Check',
            title: 'Bake Until Golden & Check Doneness',
            instructionTemplate: `Bake for ${cookTime} minutes until the edges turn golden and set while the center remains tender. Test with a toothpick—if it comes out with a few moist crumbs rather than wet batter, it is ready.`,
            durationMin: cookTime,
            timerSeconds: cookTime * 60,
            activeMeasureSummary: `Bake ${cookTime}m • Toothpick Check`
          }
        : method === 'no-bake' || method === 'freeze'
          ? {
              phaseLabel: 'Layer & Smooth',
              title: 'Transfer, Smooth Top & Garnish',
              instructionTemplate: `Pour or press the mixture evenly into your prepared dish, smoothing the surface with a spatula. Scatter ${secondRef} evenly across the top and press gently so it adheres cleanly.`,
              durationMin: 3,
              timerSeconds: 180,
              activeMeasureSummary: 'Even Layer • Smooth Top'
            }
          : {
              phaseLabel: 'Combine & Fold',
              title: 'Combine Wet & Dry Smoothly',
              instructionTemplate: `Fold ${secondRef} into the base in two additions using gentle strokes until glossy and uniform with zero dry pockets. Avoid overmixing so the final texture stays light and tender.`,
              durationMin: 3,
              timerSeconds: 180,
              activeMeasureSummary: 'Glossy Batter • Zero Lumps'
            };
    steps.splice(insertAt, 0, { stepNumber: insertAt + 1, ...middleStep });
  }

  // If still < 4, add a Prep step at the start
  if (steps.length < 4) {
    steps.unshift({
      stepNumber: 1,
      phaseLabel: 'Prep & Measure',
      title: 'Prep Equipment & Measure Ingredients',
      instructionTemplate: `Prepare your pan, dish, or heat source and measure out ${firstRef} in advance so every stage comes together smoothly without lumps or scorching.`,
      durationMin: prepTime,
      timerSeconds: prepTime * 60,
      activeMeasureSummary: 'Mise en Place • Ready'
    });
  }

  // Clean all step titles and ensure all ingredients are referenced
  steps = steps.map((s, idx) => ({
    ...s,
    stepNumber: idx + 1,
    title: smartStepTitle(s.title, s.instructionTemplate || '', method, idx, steps.length)
  }));

  steps = ensureAllIngredientsReferenced(steps, allItems);

  // Ensure every step has a valid pro tip on at least one key step
  const hasSecret = steps.some((s) => s.creatorSecret && s.creatorSecret.trim().length > 10);
  if (!hasSecret && steps.length > 0) {
    const secretIdx = Math.min(1, steps.length - 1);
    steps[secretIdx] = {
      ...steps[secretIdx],
      creatorSecret: defaultProTip(recipe, method)
    };
  }

  return steps;
}

function processFile(filePath) {
  const recipes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const enriched = recipes.map((recipe) => ({
    ...recipe,
    steps: buildFinalSteps(recipe)
  }));
  fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');
  return enriched.length;
}

const c1 = processFile(FLAGSHIP_PATH);
const c2 = processFile(GENERATED_PATH);
console.log('Polished all recipes:', { flagship: c1, generated: c2, total: c1 + c2 });
