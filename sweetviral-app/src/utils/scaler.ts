import { IngredientItem, Recipe, UnitSystem } from '../types/recipe';

const FRACTION_MAP: Array<[number, string]> = [
  [0.125, '1/8'],
  [0.25, '1/4'],
  [0.333, '1/3'],
  [0.375, '3/8'],
  [0.5, '1/2'],
  [0.625, '5/8'],
  [0.667, '2/3'],
  [0.75, '3/4'],
  [0.875, '7/8']
];

export function formatCulinaryNumber(value: number): string {
  if (value <= 0) return '0';
  const whole = Math.floor(value);
  const remainder = value - whole;

  if (remainder < 0.06) {
    return `${whole}`;
  }
  if (remainder > 0.94) {
    return `${whole + 1}`;
  }

  let closestFrac = '';
  let minDiff = 0.08;
  for (const [num, label] of FRACTION_MAP) {
    const diff = Math.abs(remainder - num);
    if (diff < minDiff) {
      minDiff = diff;
      closestFrac = label;
    }
  }

  if (closestFrac) {
    return whole > 0 ? `${whole} ${closestFrac}` : closestFrac;
  }

  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

export function formatScaledIngredient(
  item: IngredientItem,
  servings: number,
  baseServings: number,
  unit: UnitSystem
): string {
  const ratio = servings / baseServings;

  if (unit === 'metric') {
    const scaled = item.metricAmount * ratio;
    const rounded = scaled >= 10 ? Math.round(scaled) : Math.round(scaled * 10) / 10;
    return `${rounded}${item.metricUnit === 'whole' || item.metricUnit === 'pcs' ? ` ${item.metricUnit}` : item.metricUnit}`;
  }

  const scaledUs = item.baseAmount * ratio;
  return `${formatCulinaryNumber(scaledUs)} ${item.usUnit}`;
}

export function renderStepInstruction(
  template: string,
  recipe: Recipe,
  servings: number,
  unit: UnitSystem
): string {
  const allItems = recipe.ingredientGroups.flatMap((g) => g.items);
  const byId = new Map(allItems.map((item) => [item.id, item]));

  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, id: string) => {
    const item = byId.get(id);
    if (!item) return id;
    const qty = formatScaledIngredient(item, servings, recipe.baseServings, unit);
    return `${qty} ${item.name.toLowerCase()}`;
  });
}

export function buildShoppingListText(
  recipe: Recipe,
  servings: number,
  unit: UnitSystem,
  shareUrl: string
): string {
  const lines: string[] = [
    `🍫 ${recipe.title} (${servings} servings)`,
    `⏱️ Ready in ${recipe.totalMin} mins`,
    ''
  ];

  for (const group of recipe.ingredientGroups) {
    lines.push(`*${group.title}*`);
    for (const item of group.items) {
      const qty = formatScaledIngredient(item, servings, recipe.baseServings, unit);
      lines.push(`☐ ${qty} — ${item.name}`);
    }
    lines.push('');
  }

  lines.push(`Open interactive Cook Mode: ${shareUrl}`);
  return lines.join('\n');
}
