import { CommunityStitch, DessertCategory, Recipe } from '../types/recipe';
import flagshipData from './flagshipRecipes.json';
import generatedData from './generatedRecipes.json';

export const RECIPES: Recipe[] = [
  ...(flagshipData as Recipe[]),
  ...(generatedData as Recipe[])
];

export const DESSERT_CATEGORIES: Array<{
  id: DessertCategory;
  label: string;
  emoji: string;
}> = [
  { id: 'all', label: 'All Desserts', emoji: '✨' },
  { id: 'healthy-light', label: 'Healthy & Zero-Sugar', emoji: '🌿' },
  { id: 'chocolate-brownies', label: 'Chocolate & Brownies', emoji: '🍫' },
  { id: 'cookies-bars', label: 'Cookies & Bars', emoji: '🍪' },
  { id: 'cakes-cupcakes', label: 'Cakes & Mug Cakes', emoji: '🎂' },
  { id: 'cheesecake-tiramisu', label: 'Cheesecake & Tiramisu', emoji: '🍰' },
  { id: 'pastries-donuts', label: 'Pastries & Donuts', emoji: '🥐' },
  { id: 'pies-tarts', label: 'Pies, Tarts & Crumbles', emoji: '🥧' },
  { id: 'puddings-custards', label: 'Puddings & Custards', emoji: '🍮' },
  { id: 'frozen-candy', label: 'Frozen & Tanghulu', emoji: '🍨' },
  { id: 'global-viral', label: 'Global Classics', emoji: '🌍' }
];

export const COMMUNITY_STITCHES: CommunityStitch[] = [
  {
    id: 'cs1',
    recipeSlug: 'dubai-pistachio-brownies',
    creator: '@bakesbyemma',
    avatarLetter: 'E',
    avatarTone: 'bg-primary-fixed text-on-primary-fixed',
    platform: 'tiktok',
    viewsLabel: '142K',
    likes: 4800,
    quote: '"Made this in 20 mins! Absolute 10/10 gooey perfection."',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvA6dGrc1SkEswF4bQdL29pDjKz219IrSFPycrTbhg1X-fRzL-EjTiQgk8oe-Y5F0WXI4NggWAswUCKdXBZl-SO0Y6_WMm3niYx_gxo0JEKLW6O-at7GHWywMIjKYoYZ2K5NQfoOMmlz2WCqosT6Cf3D_doxQ8euBCyZUM68_4Xw1C1eyHsEiHFpjf7a8edWnE4UsZ8C0mvirUZeqsIwfh-eYtQKrPDOyPrBNnZ1Q',
    isVideo: true,
    isStitch: true,
    tags: ['viral', 'rated', 'staff']
  },
  {
    id: 'cs2',
    recipeSlug: 'glass-crunch-ice-bath-tanghulu',
    creator: '@sweettoothsam',
    avatarLetter: 'S',
    avatarTone: 'bg-tertiary-fixed text-on-tertiary-fixed',
    platform: 'youtube',
    viewsLabel: '68K',
    likes: 2100,
    quote: '"The ice bath trick worked! No burnt sugar finally 😭🙌"',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYqi0tojA8SoFikq8dGDgui93c3OGmoBZ0bHG7DhX7MuGj9TdzR-z1Me8i__9Ffi5NkUGL6FWnTcbr6XxiFuP27G34xY1SFzyn1mq6OZuAqHqYyPcUkKDOYspat9VyiqPcfJEwg4z0KjklIWrhNqgTlcAmn1ndsJ43pPMTgN2puRsV1JrUL_KS9JVvaveYxG8EdIboFfMbZlwfWRt68CA2nBnHsHGl-MZUd7PyTLo',
    isVideo: true,
    isStitch: false,
    tags: ['viral', 'fails']
  },
  {
    id: 'cs3',
    recipeSlug: 'crispy-caramel-croffle',
    creator: '@foodie_dan',
    avatarLetter: 'D',
    avatarTone: 'bg-secondary-fixed text-on-secondary-fixed',
    platform: 'instagram',
    viewsLabel: '94K',
    likes: 3400,
    quote: '"Game changer breakfast. Crispy exterior, airy layers inside!"',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtLbHaWsOS9y8b9SY_YASH6Lsne4Q-lNDCeuYqCFtpYGFfpicVITHGBJ6ETwub5p71X_ceLD2WKxvxMUDRpbMbW2xPZ2dAVWSvHWOrEyPLT9DKlSIc8hSYWvUJ80qSTYOWPqpl8EkZcv33sqcn1etJcjsJ9eS1xLFfkfWU1s42NtBYPUb7DElMVkRo-7NZz5Z3WqQjwqKeMBKnyhEXGu0x_gsN_Nwje4m3WTmpcfY',
    isVideo: true,
    isStitch: true,
    tags: ['viral', 'rated', 'staff']
  },
  {
    id: 'cs4',
    recipeSlug: 'molten-nutella-lava-cookie-skillet',
    creator: '@bakingqueen',
    avatarLetter: 'Q',
    avatarTone: 'bg-primary-fixed-dim text-on-primary-fixed',
    platform: 'facebook',
    viewsLabel: '51K',
    likes: 1900,
    quote: '"Subbed pistachio for peanut butter, divine! Bake at 375F."',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdrSVhYerFJJsUYIKEThOX3zmQPrp4y3Y7dEfzVXyDbwptaAm__ziWhvs2aHtVl8wnhVGv0EYL6ohXZM0sk56Gc5l6hxQUaGF1qE6ZqiKx0uuH0tmwAiUP4kIBHOpsxJ2BELHbM-SSqTcqY3DoqtntpY7B1RprFwkZWmELyofdRBAy3WcNZkGwIb-KQM5chtEU1zY3Fw38NjzKkA8Bku9BWJoAZTn0hJBaXWhCIQ8',
    isVideo: true,
    isStitch: false,
    tags: ['rated', 'fails']
  }
];

export const PANTRY_INGREDIENTS = [
  { key: 'chocolate', label: '🍫 Chocolate' },
  { key: 'pistachio', label: '💚 Pistachio & Nuts' },
  { key: 'nutella', label: '🌰 Nutella' },
  { key: 'strawberry', label: '🍓 Berries / Fruit' },
  { key: 'cream_cheese', label: '🧀 Cream Cheese' },
  { key: 'butter', label: '🧈 Butter' },
  { key: 'sugar', label: '🧂 Sugar' },
  { key: 'milk', label: '🥛 Milk / Cream' },
  { key: 'flour', label: '🌾 Flour / Pastry' },
  { key: 'eggs', label: '🥚 Eggs' },
  { key: 'banana', label: '🍌 Banana' },
  { key: 'lemon', label: '🍋 Lemon / Citrus' },
  { key: 'cinnamon', label: '✨ Cinnamon / Spice' },
  { key: 'coffee', label: '☕ Espresso / Coffee' },
  { key: 'honey', label: '🍯 Honey / Caramel' },
  { key: 'vanilla', label: '🌼 Vanilla' }
];
