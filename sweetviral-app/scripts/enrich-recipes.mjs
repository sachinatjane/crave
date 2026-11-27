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
  if (
    recipe.bakeMin === 0 &&
    !/\bbake\b|\boven\b|\bpreheat\b/.test(hay)
  ) {
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

function cleanStepTitle(title) {
  return (title || '')
    .replace(/^Build the Build /i, 'Build the ')
    .replace(/\bLayer Layer\b/gi, 'Layer')
    .replace(/\s+/g, ' ')
    .trim();
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

function enrichExistingStep(step, recipe, method, allItems, stepIndex, totalSteps) {
  let text = (step.instructionTemplate || '').trim();
  const cleanTitle = cleanStepTitle(step.title);
  const stepItems = allItems.filter((i) => i.stepRef === step.stepNumber);
  const ingRef = stepItems.length > 0 ? formatIngList(stepItems) : formatIngList(allItems.slice(0, 2));

  if (text && !/[.!?]$/.test(text)) {
    text += '.';
  }

  if (text.length >= 130) {
    return {
      ...step,
      title: cleanTitle,
      instructionTemplate: text
    };
  }

  const lower = `${cleanTitle} ${text}`.toLowerCase();
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  let addition = '';

  if (/\bheat oil\b|\bhot oil\b|\bdeep[\s-]?fry\b|\bfry\b/.test(lower) && !isLast) {
    if (/\bheat oil\b/.test(lower)) {
      addition = ` Bring the oil to 350°F (175°C) over medium heat—you can test readiness by dipping the handle of a wooden spoon and looking for steady, gentle bubbles.`;
    } else {
      addition = ` Work in small batches so the oil temperature stays steady, frying for 2–3 minutes per side until deeply golden and crisp all around.`;
    }
  } else if (/\bdip\b|\bcoat\b|\bpanko\b|\bbreadcrumb\b|\bdredge\b/.test(lower)) {
    addition = ` Gently press the coating onto every side so it adheres evenly, then let excess drip off before transferring to a clean tray.`;
  } else if (/\bsift\b|\bdry ingredients\b|\bflour\b/.test(lower)) {
    addition = ` Sifting aerates the dry ingredients and removes any stubborn cocoa or flour lumps so the finished crumb bakes up light and even.`;
  } else if (/\bdissolve\b|\bmelt\b|\bsimmer\b|\bboil\b/.test(lower)) {
    addition = ` Stir gently over low to medium-low heat until completely dissolved and glossy, scraping the sides so nothing crystallizes or scorches.`;
  } else if (/\bwaffle\b|\biron\b|\bgriddle\b/.test(lower)) {
    addition = ` Close the lid and cook until deeply golden brown and steam slows down, then lift carefully onto a wire rack so the crust stays crisp.`;
  } else if (/\bserve\b|\bdecorate\b|\bgarnish\b|\bice cream\b|\bberries\b|\bicing sugar\b/.test(lower) || isLast) {
    if (method === 'fry') {
      addition = ` Drain briefly on a wire cooling rack lined with paper towels for 1–2 minutes so the outside stays shatteringly crisp, then plate into ${recipe.baseServings} servings and enjoy warm.`;
    } else if (method === 'freeze' || method === 'no-bake') {
      addition = ` Chill or freeze until completely firm and set, then portion into ${recipe.baseServings} servings and store leftovers in an airtight container.`;
    } else if (method === 'bake') {
      addition = ` Let ${recipe.title} cool for 10–15 minutes so the crumb sets cleanly before slicing into ${recipe.baseServings} portions, then garnish and serve.`;
    } else {
      addition = ` Plate into ${recipe.baseServings} generous servings while the flavors and textures are at their peak, and store any leftovers covered.`;
    }
  } else if (isFirst) {
    if (method === 'bake') {
      addition = ` Line your baking pan with parchment paper or grease lightly, and make sure ${ingRef} are measured and at room temperature so they blend smoothly.`;
    } else if (method === 'no-bake' || method === 'freeze') {
      addition = ` Line your chilling pan or tray with parchment paper for easy lifting, and keep ${ingRef} measured and ready to combine.`;
    } else {
      addition = ` Keep ${ingRef} prepped and measured within reach so each step comes together smoothly and evenly.`;
    }
  } else if (method === 'bake') {
    addition = ` Mix gently until just combined with no dry streaks remaining, then bake until the edges are golden and a toothpick comes out with moist crumbs.`;
  } else if (method === 'stovetop') {
    addition = ` Whisk steadily around the bottom and corners of the pan until glossy, thickened, and smooth enough to coat the back of a spoon.`;
  } else {
    addition = ` Combine until completely smooth, uniform, and free of lumps before moving to the next stage.`;
  }

  return {
    ...step,
    title: cleanTitle,
    instructionTemplate: `${text}${addition}`.trim()
  };
}

function buildExpandedSteps(recipe, method, allItems) {
  const existing = (recipe.steps || []).map((s, idx) =>
    enrichExistingStep(s, recipe, method, allItems, idx, (recipe.steps || []).length)
  );

  const firstHalf = allItems.slice(0, Math.max(1, Math.ceil(allItems.length / 2)));
  const secondHalf = allItems.slice(Math.max(1, Math.ceil(allItems.length / 2)));
  const firstRef = formatIngList(firstHalf);
  const secondRef = secondHalf.length > 0 ? formatIngList(secondHalf) : formatIngList(allItems.slice(-2));

  const prepTime = Math.max(2, Math.round((recipe.prepMin || 10) * 0.4));
  const cookTime = Math.max(2, recipe.bakeMin || Math.round((recipe.totalMin || 15) * 0.5));

  const prepStepByMethod = {
    bake: {
      phaseLabel: 'Prep & Preheat',
      title: 'Preheat Oven & Prep Your Pan',
      instructionTemplate: `Preheat your oven to 350°F (175°C) and line your baking pan with parchment paper, leaving a slight overhang for effortless lifting. Measure out ${firstRef} so everything is ready and at room temperature for a silky, lump-free batter.`,
      durationMin: prepTime,
      timerSeconds: prepTime * 60,
      activeMeasureSummary: '350°F (175°C) • Line Pan'
    },
    'air-fryer': {
      phaseLabel: 'Prep Basket',
      title: 'Preheat Air Fryer & Measure Ingredients',
      instructionTemplate: `Preheat your air fryer to 330°F (165°C) for 3 minutes and line the basket with perforated parchment or a light oil mist. Measure out ${firstRef} in a mixing bowl so they combine evenly.`,
      durationMin: prepTime,
      timerSeconds: prepTime * 60,
      activeMeasureSummary: '330°F (165°C) • Prep Basket'
    },
    microwave: {
      phaseLabel: 'Prep Mug',
      title: 'Grease Mug & Measure Base',
      instructionTemplate: `Lightly coat a wide, microwave-safe mug or ramekin with a thin swipe of oil or butter so the cake releases cleanly. Measure ${firstRef} right into the mug and whisk with a fork until completely smooth.`,
      durationMin: 2,
      timerSeconds: 120,
      activeMeasureSummary: 'Wide Microwave Mug • Smooth Base'
    },
    'no-bake': {
      phaseLabel: 'Prep & Line',
      title: 'Line Pan & Prep Base Ingredients',
      instructionTemplate: `Line a loaf pan, baking dish, or serving glasses with parchment paper or chill them in the fridge for 5 minutes. Measure out ${firstRef} so your base whips up thick, creamy, and clump-free.`,
      durationMin: prepTime,
      timerSeconds: prepTime * 60,
      activeMeasureSummary: 'Parchment-Lined • Zero Oven'
    },
    freeze: {
      phaseLabel: 'Prep Tray',
      title: 'Line Freezer Tray & Prep Mix-Ins',
      instructionTemplate: `Line a rimmed baking sheet or loaf pan with parchment paper so your frozen treat lifts out cleanly. Measure out ${firstRef} and keep toppings like ${secondRef} prepped within reach.`,
      durationMin: prepTime,
      timerSeconds: prepTime * 60,
      activeMeasureSummary: 'Parchment Tray • Ready to Chill'
    },
    stovetop: {
      phaseLabel: 'Mise en Place',
      title: 'Set Up Heavy Saucepan & Ingredients',
      instructionTemplate: `Place a heavy-bottomed saucepan over medium-low heat and have a heatproof silicone whisk ready. Measure out ${firstRef} and ${secondRef} in advance—stovetop desserts move fast once they start bubbling.`,
      durationMin: prepTime,
      timerSeconds: prepTime * 60,
      activeMeasureSummary: 'Heavy Pan • Medium-Low Heat'
    },
    fry: {
      phaseLabel: 'Heat Oil',
      title: 'Heat Oil & Prep Cooling Rack',
      instructionTemplate: `Pour neutral frying oil into a heavy pot to 2 inches deep and heat steadily to 350°F (175°C). Set a wire cooling rack over paper towels nearby and measure out ${firstRef} so everything is ready to fry cleanly.`,
      durationMin: Math.max(4, prepTime),
      timerSeconds: Math.max(4, prepTime) * 60,
      activeMeasureSummary: '350°F (175°C) Oil • Wire Rack'
    },
    griddle: {
      phaseLabel: 'Preheat Iron',
      title: 'Preheat Waffle Iron & Prep Batter',
      instructionTemplate: `Preheat your waffle iron or griddle to medium-high heat and brush lightly with butter or neutral oil. Measure out ${firstRef} in a mixing bowl so the batter or dough is ready as soon as the iron is hot.`,
      durationMin: prepTime,
      timerSeconds: prepTime * 60,
      activeMeasureSummary: 'Medium-High Heat • Lightly Greased'
    }
  };

  const finishStepByMethod = {
    bake: {
      phaseLabel: 'Cool & Slice',
      title: 'Cool Completely, Garnish & Serve',
      instructionTemplate: `Transfer ${recipe.title} to a wire cooling rack and let it cool for 15–20 minutes so the interior sets cleanly without crumbling. Lift out using the parchment overhang, garnish as desired, and slice into ${recipe.baseServings} portions.`,
      durationMin: 15,
      timerSeconds: 900,
      activeMeasureSummary: `Cool 15m • ${recipe.baseServings} Servings`
    },
    'air-fryer': {
      phaseLabel: 'Rest & Serve',
      title: 'Rest 5 Minutes & Serve Warm',
      instructionTemplate: `Carefully lift ${recipe.title} out of the air-fryer basket and rest 5 minutes on a cooling rack so the crust crisps up. Plate into ${recipe.baseServings} servings and enjoy warm.`,
      durationMin: 5,
      timerSeconds: 300,
      activeMeasureSummary: `Crisp Rest • ${recipe.baseServings} Servings`
    },
    microwave: {
      phaseLabel: 'Rest & Top',
      title: 'Rest 1 Minute & Add Toppings',
      instructionTemplate: `Let the mug rest 60 seconds after microwaving so the steam settles and the center finishes setting into a tender, spoonable crumb. Top with ${secondRef} and enjoy warm right from the mug.`,
      durationMin: 1,
      timerSeconds: 60,
      activeMeasureSummary: 'Rest 60s • Eat Warm'
    },
    'no-bake': {
      phaseLabel: 'Chill & Set',
      title: 'Chill Until Firm, Slice & Store',
      instructionTemplate: `Cover and refrigerate ${recipe.title} until completely firm and sliceable. Portion into ${recipe.baseServings} servings, add any crisp toppings right before serving, and keep leftovers chilled in an airtight container for up to 5 days.`,
      durationMin: 10,
      timerSeconds: 600,
      activeMeasureSummary: `Chill Firm • ${recipe.baseServings} Servings`
    },
    freeze: {
      phaseLabel: 'Freeze & Snap',
      title: 'Freeze Solid, Portion & Enjoy',
      instructionTemplate: `Freeze ${recipe.title} flat until completely solid, then let sit 3 minutes at room temperature before slicing, snapping, or scooping into ${recipe.baseServings} servings. Store leftovers in a freezer-safe container.`,
      durationMin: 10,
      timerSeconds: 600,
      activeMeasureSummary: `Freeze Solid • ${recipe.baseServings} Servings`
    },
    stovetop: {
      phaseLabel: 'Cool & Plate',
      title: 'Remove from Heat, Cool & Serve',
      instructionTemplate: `Pull the pan off the heat as soon as ${recipe.title} coats the spoon thickly. Let cool slightly so the glaze or custard thickens even more, then spoon into ${recipe.baseServings} bowls and garnish before serving.`,
      durationMin: 5,
      timerSeconds: 300,
      activeMeasureSummary: `Glossy Set • ${recipe.baseServings} Servings`
    },
    fry: {
      phaseLabel: 'Drain & Coat',
      title: 'Drain Crisp, Toss & Serve Fresh',
      instructionTemplate: `Transfer to the wire rack to drain excess oil for 1–2 minutes while still piping hot, then finish with ${secondRef}. Serve ${recipe.title} fresh while the exterior is shatteringly crisp.`,
      durationMin: 3,
      timerSeconds: 180,
      activeMeasureSummary: `Crisp Drain • ${recipe.baseServings} Servings`
    },
    griddle: {
      phaseLabel: 'Crisp & Serve',
      title: 'Cool 1 Minute on Rack & Plate',
      instructionTemplate: `Transfer ${recipe.title} onto a wire rack for 60 seconds so steam escapes and the outside stays crisp. Top with ${secondRef} and serve immediately into ${recipe.baseServings} portions.`,
      durationMin: 2,
      timerSeconds: 120,
      activeMeasureSummary: `Crisp Rack • ${recipe.baseServings} Servings`
    }
  };

  let result = [...existing];

  if (result.length < 4) {
    const firstTitle = (result[0]?.title || '').toLowerCase();
    const hasPrep = /preheat|prep|line|mise|heat oil|grease/.test(firstTitle);
    if (!hasPrep) {
      result.unshift({
        stepNumber: 1,
        ...prepStepByMethod[method]
      });
    }
  }

  if (result.length < 4) {
    const lastTitle = (result[result.length - 1]?.title || '').toLowerCase();
    const hasFinish = /cool|chill|freeze|serve|slice|garnish|plate|drain|rest/.test(lastTitle);
    if (!hasFinish) {
      result.push({
        stepNumber: result.length + 1,
        ...finishStepByMethod[method]
      });
    }
  }

  if (result.length < 4) {
    const insertAt = Math.max(1, result.length - 1);
    const middleStep =
      method === 'bake' || method === 'air-fryer'
        ? {
            phaseLabel: 'Bake & Check',
            title: `Bake ${recipe.title} & Check Doneness`,
            instructionTemplate: `Bake for ${cookTime} minutes until the edges turn golden and set while the center remains tender. Test with a toothpick—if it comes out with a few moist crumbs rather than wet batter, it is ready.`,
            durationMin: cookTime,
            timerSeconds: cookTime * 60,
            activeMeasureSummary: `Bake ${cookTime}m • Toothpick Check`
          }
        : method === 'no-bake' || method === 'freeze'
          ? {
              phaseLabel: 'Layer & Smooth',
              title: 'Transfer, Smooth Top & Add Garnish',
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

    result.splice(insertAt, 0, {
      stepNumber: insertAt + 1,
      ...middleStep
    });
  }

  if (result.length < 4) {
    result.push({
      stepNumber: result.length + 1,
      ...finishStepByMethod[method]
    });
  }

  result = result.map((s, idx) => ({
    ...s,
    stepNumber: idx + 1
  }));

  const hasSecret = result.some((s) => s.creatorSecret && s.creatorSecret.trim().length > 10);
  if (!hasSecret && result.length > 0) {
    const secretIdx = Math.min(1, result.length - 1);
    result[secretIdx] = {
      ...result[secretIdx],
      creatorSecret: defaultProTip(recipe, method)
    };
  }

  return result;
}

function processFile(filePath) {
  const recipes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;

  const enriched = recipes.map((recipe) => {
    const allItems = getAllItems(recipe);
    const method = detectMethod(recipe);
    const nextSteps = buildExpandedSteps(recipe, method, allItems);

    if (
      nextSteps.length !== (recipe.steps || []).length ||
      JSON.stringify(nextSteps) !== JSON.stringify(recipe.steps)
    ) {
      updatedCount++;
    }

    return {
      ...recipe,
      steps: nextSteps
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');
  return { total: enriched.length, updatedCount };
}

const r1 = processFile(FLAGSHIP_PATH);
const r2 = processFile(GENERATED_PATH);
console.log('Enrichment complete:', { flagship: r1, generated: r2 });
