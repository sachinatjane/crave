export type SocialPlatform = 'tiktok' | 'instagram' | 'pinterest' | 'youtube' | 'facebook';

export type CategoryTag =
  | 'all'
  | 'healthy'
  | 'zero-sugar'
  | 'high-protein'
  | 'under250'
  | 'under15'
  | 'nobake'
  | 'three-ing'
  | 'airfryer'
  | 'vegan-gf';

export type DessertCategory =
  | 'all'
  | 'healthy-light'
  | 'chocolate-brownies'
  | 'cookies-bars'
  | 'cakes-cupcakes'
  | 'cheesecake-tiramisu'
  | 'pastries-donuts'
  | 'pies-tarts'
  | 'puddings-custards'
  | 'frozen-candy'
  | 'global-viral';

export type UnitSystem = 'us' | 'metric';

export type AppTab = 'trending' | 'discover' | 'remakes' | 'saved';

export interface IngredientItem {
  id: string;
  name: string;
  baseAmount: number;
  usUnit: string;
  metricAmount: number;
  metricUnit: string;
  pantryKey: string;
  stepRef?: number;
}

export interface IngredientGroup {
  title: string;
  badge: string;
  tone: 'tertiary' | 'primary';
  items: IngredientItem[];
}

export interface RecipeStep {
  stepNumber: number;
  phaseLabel: string;
  title: string;
  instructionTemplate: string;
  durationMin: number;
  timerSeconds?: number;
  image?: string;
  creatorSecret?: string;
  criticalTip?: string;
  activeMeasureSummary?: string;
}

export interface UgcQuote {
  id: string;
  handle: string;
  image: string;
  quote: string;
  rating: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  shortTag: string;
  storyViews: string;
  viewsLabel: string;
  viewsNumeric: number;
  remakeSuccessRate: string;
  rating: number;
  ratingCount: string;
  prepMin: number;
  bakeMin: number;
  totalMin: number;
  skill: 'Easy' | 'Quick' | 'Medium';
  baseServings: number;
  kcal: number;
  zeroMixer: boolean;
  isHealthy?: boolean;
  zeroRefinedSugar?: boolean;
  cuisine: string;
  dessertCategory: Exclude<DessertCategory, 'all'>;
  primaryPlatform: SocialPlatform;
  platforms: SocialPlatform[];
  categories: CategoryTag[];
  soundName: string;
  badgeChip: string;
  creatorHandle: string;
  hookLine: string;
  heroImage: string;
  thumbImage: string;
  pinterestImage: string;
  hashtags: string[];
  pantryCore: string[];
  ingredientGroups: IngredientGroup[];
  steps: RecipeStep[];
  ugcQuotes: UgcQuote[];
}

export interface CommunityStitch {
  id: string;
  recipeSlug: string;
  creator: string;
  avatarLetter: string;
  avatarTone: string;
  platform: SocialPlatform;
  viewsLabel: string;
  likes: number;
  quote: string;
  image: string;
  isVideo: boolean;
  isStitch: boolean;
  tags: ('viral' | 'rated' | 'fails' | 'staff')[];
}
