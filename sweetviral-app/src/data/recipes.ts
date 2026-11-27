import { CommunityStitch, DessertCategory, Recipe } from '../types/recipe';
import generatedData from './generatedRecipes.json';

const FLAGSHIP_RECIPES: Recipe[] = [
  {
    id: 'dubai-brownies',
    slug: 'dubai-pistachio-brownies',
    title: 'Giant Stuffed Dubai Pistachio & Kataifi Brownies',
    shortTag: '#DubaiChoc',
    storyViews: '482K',
    viewsLabel: '482K Views',
    viewsNumeric: 482,
    remakeSuccessRate: '98.4%',
    rating: 4.9,
    ratingCount: '840',
    prepMin: 15,
    bakeMin: 25,
    totalMin: 40,
    skill: 'Easy',
    baseServings: 8,
    kcal: 420,
    zeroMixer: true,
    cuisine: 'Dubai Viral',
    dessertCategory: 'chocolate-brownies',
    primaryPlatform: 'tiktok',
    platforms: ['tiktok', 'instagram', 'pinterest', 'youtube', 'facebook'],
    categories: ['all'],
    soundName: 'asmr kataifi crunch',
    badgeChip: 'TikTok #1 Viral',
    creatorHandle: '@sweetcraver',
    hookLine: 'Crispy toasted kataifi, emerald pistachio cream & molten dark chocolate fudge.',
    heroImage: './ai-images/dubai-brownie-hero.jpg',
    thumbImage: './ai-images/dubai-brownie-hero.jpg',
    pinterestImage: './ai-images/dubai-brownie-hero.jpg',
    hashtags: ['#DubaiChocolate', '#DubaiBrownieRemake', '#CraveMadeMeDoIt', '#ViralDessert'],
    pantryCore: ['chocolate', 'pistachio', 'butter', 'eggs', 'sugar'],
    ingredientGroups: [
      {
        title: 'Pistachio Kataifi Crunch Layer',
        badge: 'The Signature',
        tone: 'tertiary',
        items: [
          {
            id: 'kataifi',
            name: 'Kataifi (Kadayif) shredded dough noodles',
            baseAmount: 2,
            usUnit: 'cups',
            metricAmount: 150,
            metricUnit: 'g',
            pantryKey: 'flour',
            stepRef: 1
          },
          {
            id: 'butter',
            name: 'Unsalted pure butter',
            baseAmount: 3,
            usUnit: 'tbsp',
            metricAmount: 45,
            metricUnit: 'g',
            pantryKey: 'butter',
            stepRef: 1
          },
          {
            id: 'pistachio',
            name: 'Sweetened pistachio cream paste',
            baseAmount: 0.75,
            usUnit: 'cup',
            metricAmount: 200,
            metricUnit: 'g',
            pantryKey: 'pistachio',
            stepRef: 2
          },
          {
            id: 'tahini',
            name: 'Creamy sesame tahini',
            baseAmount: 1.5,
            usUnit: 'tbsp',
            metricAmount: 22,
            metricUnit: 'ml',
            pantryKey: 'pistachio',
            stepRef: 2
          }
        ]
      },
      {
        title: 'Fudgy Brownie Base',
        badge: 'Rich Dark Cocoa',
        tone: 'primary',
        items: [
          {
            id: 'darkchoc',
            name: 'Bittersweet 70% dark chocolate (chopped)',
            baseAmount: 1,
            usUnit: 'cup',
            metricAmount: 175,
            metricUnit: 'g',
            pantryKey: 'chocolate',
            stepRef: 3
          },
          {
            id: 'cocoa',
            name: 'Dutch-process cocoa powder',
            baseAmount: 0.5,
            usUnit: 'cup',
            metricAmount: 50,
            metricUnit: 'g',
            pantryKey: 'chocolate',
            stepRef: 3
          },
          {
            id: 'sugar',
            name: 'Dark brown sugar & cane sugar',
            baseAmount: 1,
            usUnit: 'cup',
            metricAmount: 200,
            metricUnit: 'g',
            pantryKey: 'sugar',
            stepRef: 3
          },
          {
            id: 'eggs',
            name: 'Large room-temperature eggs',
            baseAmount: 2,
            usUnit: 'eggs',
            metricAmount: 2,
            metricUnit: 'whole',
            pantryKey: 'eggs',
            stepRef: 3
          }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        phaseLabel: 'The Viral Crunch Layer',
        title: 'Toast Kataifi to Golden Perfection',
        instructionTemplate:
          'Chop {kataifi} into 1-inch lengths. Melt {butter} in a wide skillet over medium heat, add noodles, and stir continuously until deep amber golden and ultra-crisp (listen for the ASMR sizzle).',
        durationMin: 5,
        timerSeconds: 300,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBmPOz-k4gJmsZTMWBM4nZ27l5VDmuv6xxDPk4jPkrnjyNH_R5fTANRzCwZAOiTK6Kfq6BfPHCXxjyC6-9wawsz211l8AvfAvoTyE7r8hkXtLo--AyQvz17SpCnB5MSMs7taasaVAVvnOAM71gqQpJYyTkVQYN2ssPZYnKGz7ZNtCQeiYwLbAgOZC0xImwEQ4TddSLajWpU6VboZdWLkonyVE9ravcUbd_4k9Pfizo',
        activeMeasureSummary: 'Kataifi + Unsalted Butter (medium heat)'
      },
      {
        stepNumber: 2,
        phaseLabel: 'Emerald Cream Core',
        title: 'Mix Pistachio Velvet',
        instructionTemplate:
          'In a bowl, whisk {pistachio} and {tahini} until glossy and pourable. Gently fold in the cooled toasted kataifi until every crispy shard is coated in emerald velvet.',
        durationMin: 3,
        timerSeconds: 180,
        creatorSecret:
          "Don't skip the tahini! Its roasted nuttiness balances the sweet pistachio paste and replicates the original Dubai chocolate bar mouthfeel.",
        activeMeasureSummary: 'Pistachio Cream + Sesame Tahini'
      },
      {
        stepNumber: 3,
        phaseLabel: 'Fudge Layering',
        title: 'The Fudgy Pour & Stuffing',
        instructionTemplate:
          'Whisk melted {darkchoc}, {cocoa}, {sugar}, and {eggs} until glossy. Pour 55% into a parchment-lined 8x8 pan, spread the pistachio kataifi edge-to-edge, then ladle the remaining batter on top.',
        durationMin: 7,
        timerSeconds: 420,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCbfYIFBFVeq7vNKNfnACFjal1LwKLxdaNlDcXJeBwo9IRo6ecfkPxwQstn1bLcdzBf8TMPJ_Pf-yRw2c4zFNU4mhWWugWpp9FvYX54ch6OkE8BOI7FoxD0B7W9vizkMiUpDX9Et1vfHP41bFHNEj-FbLSxKXykuzu2xPYL0l_h7vnrpUDPizeJH0Fhq0c2gpcDi_MgZ0U1B9BPuoSXxZYd_nKNfHD-n3h8ByMuZCI',
        activeMeasureSummary: '70% Dark Chocolate + Cocoa + Eggs'
      },
      {
        stepNumber: 4,
        phaseLabel: 'Bake & ASMR Slice',
        title: 'Bake & The Viral Cut',
        instructionTemplate:
          'Bake at 350°F (175°C) for 25 minutes until edges set and the center has a gentle fudge wobble. Chill 20 minutes before slicing for clean emerald cross-section lines.',
        durationMin: 25,
        timerSeconds: 1500,
        criticalTip:
          'CRITICAL CUT TIP: Chill in fridge for 20 mins before cutting for the famous viral cross-section clean line & crisp ASMR crunch sound.',
        activeMeasureSummary: '350°F / 175°C • 25 min bake'
      }
    ],
    ugcQuotes: [
      {
        id: 'u1',
        handle: '@foodie_maya',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDiWn8HqJgYJW4zmkFwZYqi9VIyNs2uD6qMbvBseGQ8rbykgmmvmcsEGV0IhtR1qynHfg_1WlgXHQIg5Wurla71JcqJ56kgzxHDCzvkVE6On8z3A09fcs8TBuaQa53HymAGT-6UmLNvu11zccjwkEnjFlKK2JCK0zD31IsS_SEG2YMSInEwV2lWLGVsSLyL_fpeF4L5I4wm3o9HaPzz5TXMYNaZM-61jKxIU8F-emg',
        quote: 'Tasted 10x better than the viral chocolate bar! The crunch is absolutely insane.',
        rating: 5
      },
      {
        id: 'u2',
        handle: '@bakingwithjules',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuALFUoxiBECZzAWaXtC0z6_3fyyb4Oglkh7z2ln-RSCul7GG6ndbYOoj--j5SFwYwV_nA5i_reJmnufNBC2JrtLLQRGLH6QPoSme6rp552VmPorovB6N3mIRKlda6oHIOkgW0Qxq8P6ToAK2QbbXecQbA0hUvtwjt1cI7JQ7IVffcm-p5IA5uTMRGziGueb_OuEEzRvPL16NCnBv8SgQMorzoA2A86PQVLtSD_uOp0',
        quote: 'Followed the 20-min chill trick. Cleanest slice ever and took only 40 mins total.',
        rating: 5
      }
    ]
  },
  {
    id: 'mochi-donuts',
    slug: 'strawberry-glazed-mochi-donuts',
    title: 'Strawberry Glazed Mochi Donuts',
    shortTag: 'Mochi Donut',
    storyViews: '210K',
    viewsLabel: '210K Views',
    viewsNumeric: 210,
    remakeSuccessRate: '96.2%',
    rating: 4.9,
    ratingCount: '410',
    prepMin: 12,
    bakeMin: 8,
    totalMin: 20,
    skill: 'Easy',
    baseServings: 6,
    kcal: 240,
    zeroMixer: true,
    cuisine: 'Japanese-Hawaiian',
    dessertCategory: 'pastries-donuts',
    primaryPlatform: 'instagram',
    platforms: ['instagram', 'tiktok', 'pinterest'],
    categories: ['all', 'airfryer', 'vegan-gf'],
    soundName: 'viral crunch',
    badgeChip: 'IG Reels Hot',
    creatorHandle: '@mochibites',
    hookLine: 'Bouncy gluten-free sweet rice bubbles dipped in glossy freeze-dried strawberry glaze.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkLkRROOfFeh_-zzFFJwD1gM_7GtUU1xzIEnk-EqfylEIlLOGa7sM6MHAqLkUXfZU0jxXk6sF4Ff0WUSTDKGGtVtpba93vEm3zBYJhl30Rsb951Jfk45ovvYrCHvUEg-KGOAhBwM5cH4IG5PU2Vz2U0nRrF9ZNGU7vB0_xwnOW7S4PMwWqzz4I3pLf1s313KjPI52nnaw2lAnCWYLnlqQSHR5u-wO0RDUVuVgOv3Y',
    thumbImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkLkRROOfFeh_-zzFFJwD1gM_7GtUU1xzIEnk-EqfylEIlLOGa7sM6MHAqLkUXfZU0jxXk6sF4Ff0WUSTDKGGtVtpba93vEm3zBYJhl30Rsb951Jfk45ovvYrCHvUEg-KGOAhBwM5cH4IG5PU2Vz2U0nRrF9ZNGU7vB0_xwnOW7S4PMwWqzz4I3pLf1s313KjPI52nnaw2lAnCWYLnlqQSHR5u-wO0RDUVuVgOv3Y',
    pinterestImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkLkRROOfFeh_-zzFFJwD1gM_7GtUU1xzIEnk-EqfylEIlLOGa7sM6MHAqLkUXfZU0jxXk6sF4Ff0WUSTDKGGtVtpba93vEm3zBYJhl30Rsb951Jfk45ovvYrCHvUEg-KGOAhBwM5cH4IG5PU2Vz2U0nRrF9ZNGU7vB0_xwnOW7S4PMwWqzz4I3pLf1s313KjPI52nnaw2lAnCWYLnlqQSHR5u-wO0RDUVuVgOv3Y',
    hashtags: ['#MochiDonuts', '#PonDeRing', '#GlutenFreeDessert', '#CraveMadeMeDoIt'],
    pantryCore: ['flour', 'strawberry', 'milk', 'sugar'],
    ingredientGroups: [
      {
        title: 'Chewy Mochi Dough',
        badge: 'Gluten-Free',
        tone: 'tertiary',
        items: [
          {
            id: 'mochiko',
            name: 'Glutinous sweet rice flour (Mochiko)',
            baseAmount: 1.5,
            usUnit: 'cups',
            metricAmount: 210,
            metricUnit: 'g',
            pantryKey: 'flour',
            stepRef: 1
          },
          {
            id: 'tofu',
            name: 'Silken tofu or warm coconut milk',
            baseAmount: 0.75,
            usUnit: 'cup',
            metricAmount: 180,
            metricUnit: 'g',
            pantryKey: 'milk',
            stepRef: 1
          },
          {
            id: 'sugar_m',
            name: 'Granulated cane sugar',
            baseAmount: 3,
            usUnit: 'tbsp',
            metricAmount: 38,
            metricUnit: 'g',
            pantryKey: 'sugar',
            stepRef: 1
          }
        ]
      },
      {
        title: 'Mirror Strawberry Glaze',
        badge: 'Baby Pink Gloss',
        tone: 'primary',
        items: [
          {
            id: 'powdered',
            name: 'Powdered icing sugar',
            baseAmount: 1,
            usUnit: 'cup',
            metricAmount: 120,
            metricUnit: 'g',
            pantryKey: 'sugar',
            stepRef: 3
          },
          {
            id: 'berry',
            name: 'Crushed freeze-dried strawberries',
            baseAmount: 2,
            usUnit: 'tbsp',
            metricAmount: 12,
            metricUnit: 'g',
            pantryKey: 'strawberry',
            stepRef: 3
          }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        phaseLabel: '1-Bowl Dough',
        title: 'Knead Bouncy Mochi Balls',
        instructionTemplate:
          'Mix {mochiko}, {sugar_m}, and {tofu} until a smooth play-dough texture forms. Roll into 48 mini spheres and connect 8 spheres per ring on parchment squares.',
        durationMin: 10,
        timerSeconds: 600,
        activeMeasureSummary: 'Mochiko + Silken Base'
      },
      {
        stepNumber: 2,
        phaseLabel: 'Crisp Bubble Puff',
        title: 'Air Fry or Flash Fry Golden',
        instructionTemplate:
          'Mist lightly with oil and air-fry at 360°F (180°C) for 8 minutes (or fry 2 mins per side) until puffed and crisp outside.',
        durationMin: 8,
        timerSeconds: 480,
        creatorSecret:
          'Leaving the parchment square underneath makes transferring delicate rings effortless—peel paper away after 60 seconds.',
        activeMeasureSummary: '360°F Air Fryer • 8 mins'
      },
      {
        stepNumber: 3,
        phaseLabel: 'Gloss Dip',
        title: 'Dip in Strawberry Mirror Glaze',
        instructionTemplate:
          'Whisk {powdered}, {berry}, and 2 tbsp warm milk until silky. Dip warm donut tops and finish with crisp sugar pearls.',
        durationMin: 2,
        timerSeconds: 120,
        activeMeasureSummary: 'Powdered Sugar + Berry Dust'
      }
    ],
    ugcQuotes: [
      {
        id: 'um1',
        handle: '@pastelkitchen',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAkLkRROOfFeh_-zzFFJwD1gM_7GtUU1xzIEnk-EqfylEIlLOGa7sM6MHAqLkUXfZU0jxXk6sF4Ff0WUSTDKGGtVtpba93vEm3zBYJhl30Rsb951Jfk45ovvYrCHvUEg-KGOAhBwM5cH4IG5PU2Vz2U0nRrF9ZNGU7vB0_xwnOW7S4PMwWqzz4I3pLf1s313KjPI52nnaw2lAnCWYLnlqQSHR5u-wO0RDUVuVgOv3Y',
        quote: 'So chewy inside and genuinely took 20 mins in my air fryer!',
        rating: 5
      }
    ]
  },
  {
    id: 'nutella-lava-skillet',
    slug: 'molten-nutella-lava-cookie-skillet',
    title: 'Molten Nutella Lava Cookie Skillet',
    shortTag: 'Lava Skillet',
    storyViews: '295K',
    viewsLabel: '295K Views',
    viewsNumeric: 295,
    remakeSuccessRate: '99.1%',
    rating: 5.0,
    ratingCount: '620',
    prepMin: 5,
    bakeMin: 10,
    totalMin: 15,
    skill: 'Quick',
    baseServings: 4,
    kcal: 460,
    zeroMixer: true,
    cuisine: 'American',
    dessertCategory: 'chocolate-brownies',
    primaryPlatform: 'facebook',
    platforms: ['facebook', 'youtube', 'tiktok', 'instagram'],
    categories: ['all', 'under15', 'airfryer'],
    soundName: 'easy 1-bowl',
    badgeChip: '5.0 ★ Crowd Hit',
    creatorHandle: '@skilletbae',
    hookLine: '1-bowl brown-butter cookie dough hiding a frozen molten Nutella core in 15 mins.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4JgxIaxwGhr1Mqdr-CPxA2lQDf9ZwcZh8pSzv-Ke8RjY4igDoSfwl4UyM77BIdr7EYuJDX2Kb8ktHvud6P82EAGVulcep1No4-Tfb6fdnI6TH_DCNOPNgWkLmnJMSdT6Q7hL_YOL5xaCJWweQ1kzdp2SPpyTVnwc8pKZBUhjtrMpdQ38aD896PJZT_lhE94dfJEz6MagxvlWkMSWVaYx3yaJTd7jKKAanJDgXQbY',
    thumbImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpiJy6GMiVyARoo-pC3q7AMmu4aCKJKp0QwG82rwNlys9g1b6wWU4agLoTgg96bgzWQ9MBN8tX_4ESEUyNW_ZtqIM4apfZS9s1a7itJ8JSBQR5AvWQNt30w6pPc5vmDpeD9YJAlTRuzukzkwkv-DeBTA5upCRHY0EBuerC8J1NH_7Wl3xg2anYAZAXk0HrttaJjDh0y-Y4HVHNcfCmq8XxAJciugfeYmYrhoggUiY',
    pinterestImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4JgxIaxwGhr1Mqdr-CPxA2lQDf9ZwcZh8pSzv-Ke8RjY4igDoSfwl4UyM77BIdr7EYuJDX2Kb8ktHvud6P82EAGVulcep1No4-Tfb6fdnI6TH_DCNOPNgWkLmnJMSdT6Q7hL_YOL5xaCJWweQ1kzdp2SPpyTVnwc8pKZBUhjtrMpdQ38aD896PJZT_lhE94dfJEz6MagxvlWkMSWVaYx3yaJTd7jKKAanJDgXQbY',
    hashtags: ['#NutellaSkillet', '#15MinDessert', '#Pizookie', '#CraveMadeMeDoIt'],
    pantryCore: ['nutella', 'chocolate', 'butter', 'flour', 'eggs'],
    ingredientGroups: [
      {
        title: '1-Bowl Cookie Dough',
        badge: 'Zero Mixer',
        tone: 'primary',
        items: [
          {
            id: 'nutella',
            name: 'Creamy Nutella hazelnut spread',
            baseAmount: 0.5,
            usUnit: 'cup',
            metricAmount: 140,
            metricUnit: 'g',
            pantryKey: 'nutella',
            stepRef: 1
          },
          {
            id: 'butter_n',
            name: 'Melted salted butter',
            baseAmount: 4,
            usUnit: 'tbsp',
            metricAmount: 56,
            metricUnit: 'g',
            pantryKey: 'butter',
            stepRef: 1
          },
          {
            id: 'flour_n',
            name: 'All-purpose flour',
            baseAmount: 0.75,
            usUnit: 'cup',
            metricAmount: 95,
            metricUnit: 'g',
            pantryKey: 'flour',
            stepRef: 1
          },
          {
            id: 'chips_n',
            name: 'Semi-sweet chocolate chunks',
            baseAmount: 0.5,
            usUnit: 'cup',
            metricAmount: 85,
            metricUnit: 'g',
            pantryKey: 'chocolate',
            stepRef: 2
          }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        phaseLabel: '1-Bowl Mix',
        title: 'Whisk Dough & Stuff Nutella Core',
        instructionTemplate:
          'Stir {butter_n} with 1/3 cup brown sugar and 1 egg yolk, then fold in {flour_n}. Press half into a mini skillet, spoon {nutella} into the center, and seal with remaining dough.',
        durationMin: 5,
        timerSeconds: 300,
        activeMeasureSummary: 'Nutella Core + 1-Bowl Dough'
      },
      {
        stepNumber: 2,
        phaseLabel: 'Golden Edge Bake',
        title: 'Bake Until Gooey & Scoop Ice Cream',
        instructionTemplate:
          'Top with {chips_n}. Bake or air-fry at 350°F (175°C) for 10 minutes until edges are golden crisp while center stays molten. Top immediately with vanilla bean ice cream!',
        durationMin: 10,
        timerSeconds: 600,
        criticalTip:
          'Pull it out 2 minutes earlier than you think—the hot cast iron keeps baking the base while you grab spoons.',
        activeMeasureSummary: '350°F • 10 mins'
      }
    ],
    ugcQuotes: [
      {
        id: 'un1',
        handle: '@midnight_crave',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA4JgxIaxwGhr1Mqdr-CPxA2lQDf9ZwcZh8pSzv-Ke8RjY4igDoSfwl4UyM77BIdr7EYuJDX2Kb8ktHvud6P82EAGVulcep1No4-Tfb6fdnI6TH_DCNOPNgWkLmnJMSdT6Q7hL_YOL5xaCJWweQ1kzdp2SPpyTVnwc8pKZBUhjtrMpdQ38aD896PJZT_lhE94dfJEz6MagxvlWkMSWVaYx3yaJTd7jKKAanJDgXQbY',
        quote: 'Literally 15 mins from craving to spooning hot Nutella + cold vanilla ice cream.',
        rating: 5
      }
    ]
  },
  {
    id: 'crispy-caramel-croffle',
    slug: 'crispy-caramel-croffle',
    title: 'Crispy Caramel Croissant Waffle (Croffle)',
    shortTag: 'Crookie & Croffle',
    storyViews: '164K',
    viewsLabel: '164K Views',
    viewsNumeric: 164,
    remakeSuccessRate: '97.5%',
    rating: 4.8,
    ratingCount: '310',
    prepMin: 3,
    bakeMin: 5,
    totalMin: 8,
    skill: 'Quick',
    baseServings: 4,
    kcal: 310,
    zeroMixer: true,
    cuisine: 'Korean Cafe',
    dessertCategory: 'pastries-donuts',
    primaryPlatform: 'pinterest',
    platforms: ['pinterest', 'tiktok', 'instagram'],
    categories: ['all', 'under15', 'three-ing'],
    soundName: '3 items only',
    badgeChip: '8 Min Crunch',
    creatorHandle: '@seoulcafevibes',
    hookLine: 'Only 3 ingredients! Shattering amber caramelized sugar shell around flaky croissant layers.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhzuJSsNEfRnkTplBhs4Zz8pJsExT80MGGCgmLOtIlYRttyPlSoy5z2YhXvRxZ7aXlM8glxlQUsBs0jwZImlhmq4o9l0WU4B6hvrYbJFusyMs9M2jSyBXUo4x8G8GRPnUPZUJF1BqXAgmGe3Gb5LyZ8OR6YI4rq3BznHwUdOejZlezHqHAFkYUDiQj7tu5z9Pq8849-Go6CJr9TkNiyYHmoGRhximwntmAI76oLBc',
    thumbImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDglXu6kUAZHXePaYsYagsI81NlsuyqTZtaYGo1kf-WJAbtSyZVc3KI4iPuGafi8gYeGlfCTofG1luDdVwQthZwFdg2DySMCJvBGLpLqDnBUhxWhwpGjUzKYHZ3roIZH5cBpadNGr0SK5LBhLrJ8Pn4oD2iYJ3AXmv7LEfiQDuxaqxwoGD6R506yv9kFcUlG8neW3xg2qzlEsgg2KJGcgNOns2eRVSp2Et0WoGlqiE',
    pinterestImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBAVBJ7DitXi2oersBlJ6MGsFd17dWgIb7mH145l8pXSpl-DvXdrKFCeOIPnHJ6a2q0lrRdIWpvqh-bzXHxcJxjeqjvh2RVdxfW2etZcEoWpFoIUzeZ5gTii1IMz4b_XnK7P28KeT7vUep1Q7ALmk3GKZGbblAUawj7JvAg_li7iXWTdX-kBcbeWESYnrM6_1L1legKezQvrlyhzhKMeokp-oWG1oMfQVCkld3v1w',
    hashtags: ['#Croffle', '#3IngredientDessert', '#CafeAtHome', '#CraveMadeMeDoIt'],
    pantryCore: ['flour', 'sugar', 'milk'],
    ingredientGroups: [
      {
        title: '3-Ingredient Viral Crunch',
        badge: '3 Items Only',
        tone: 'tertiary',
        items: [
          {
            id: 'croissants',
            name: 'Unbaked butter croissant dough (or thawed)',
            baseAmount: 4,
            usUnit: 'pcs',
            metricAmount: 4,
            metricUnit: 'pcs',
            pantryKey: 'flour',
            stepRef: 1
          },
          {
            id: 'pearl_sugar',
            name: 'Coarse pearl or turbinado raw sugar',
            baseAmount: 4,
            usUnit: 'tbsp',
            metricAmount: 50,
            metricUnit: 'g',
            pantryKey: 'sugar',
            stepRef: 1
          },
          {
            id: 'whip_cream',
            name: 'Whipped mascarpone & salted caramel drizzle',
            baseAmount: 0.5,
            usUnit: 'cup',
            metricAmount: 120,
            metricUnit: 'ml',
            pantryKey: 'milk',
            stepRef: 2
          }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        phaseLabel: 'Sugar Coat',
        title: 'Coat Croissant Dough in Raw Sugar',
        instructionTemplate:
          'Roll {croissants} generously in {pearl_sugar}, pressing sugar crystals lightly into the pastry butter layers.',
        durationMin: 3,
        timerSeconds: 180,
        activeMeasureSummary: '4 Croissants + Pearl Sugar'
      },
      {
        stepNumber: 2,
        phaseLabel: 'Caramel Press',
        title: 'Press in Waffle Iron Until Glassy',
        instructionTemplate:
          'Press in a preheated waffle iron for 4–5 minutes until sugar melts into a glassy amber caramel crust. Rest 60 seconds to harden crunch, then crown with {whip_cream}.',
        durationMin: 5,
        timerSeconds: 300,
        creatorSecret:
          'Wait 60 seconds on a cooling rack before biting—the molten sugar turns into a shattering crème-brûlée crust!',
        activeMeasureSummary: 'Waffle Iron • 4–5 mins'
      }
    ],
    ugcQuotes: [
      {
        id: 'uc1',
        handle: '@foodie_dan',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAtLbHaWsOS9y8b9SY_YASH6Lsne4Q-lNDCeuYqCFtpYGFfpicVITHGBJ6ETwub5p71X_ceLD2WKxvxMUDRpbMbW2xPZ2dAVWSvHWOrEyPLT9DKlSIc8hSYWvUJ80qSTYOWPqpl8EkZcv33sqcn1etJcjsJ9eS1xLFfkfWU1s42NtBYPUb7DElMVkRo-7NZz5Z3WqQjwqKeMBKnyhEXGu0x_gsN_Nwje4m3WTmpcfY',
        quote: 'Game changer breakfast. Crispy exterior, airy layers inside!',
        rating: 5
      }
    ]
  },
  {
    id: 'cinnamon-roll-mug-cake',
    slug: 'microwave-cinnamon-roll-mug-cake',
    title: 'Microwave Cinnamon Roll Mug Cake',
    shortTag: 'Lava Mug',
    storyViews: '248K',
    viewsLabel: '248K Views',
    viewsNumeric: 248,
    remakeSuccessRate: '98.0%',
    rating: 4.9,
    ratingCount: '490',
    prepMin: 3,
    bakeMin: 2,
    totalMin: 5,
    skill: 'Quick',
    baseServings: 1,
    kcal: 290,
    zeroMixer: true,
    cuisine: 'American',
    dessertCategory: 'cakes-cupcakes',
    primaryPlatform: 'youtube',
    platforms: ['youtube', 'tiktok', 'instagram'],
    categories: ['all', 'under15', 'three-ing'],
    soundName: '2 min bake',
    badgeChip: '2 Min Microwave',
    creatorHandle: '@mugmagic',
    hookLine: 'Warm fluffy bakery cinnamon roll in a coffee mug in literally 90 seconds of microwave time.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZyHVnozv23AlpKcIr4c-MKbclHyWZ9rUAxdI3a2YG7XdY3AFdTyAT5rTWqWXwtwPD5s9rWdZuTqJMCWosX3lB2iwgcXhXD-z8_p9HviJnNBVnRThUhFMV0iPRWUYxNWWNpgsW7zgedBenY2sJOwS7HrVyOR879N_mTXwv09VkZ0Yl93QjbOP3reT0PuotI3QmTMTz7zp3Y6XjOjuNI9M3EJaCqjPpXBTNTblHV6Q',
    thumbImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZyHVnozv23AlpKcIr4c-MKbclHyWZ9rUAxdI3a2YG7XdY3AFdTyAT5rTWqWXwtwPD5s9rWdZuTqJMCWosX3lB2iwgcXhXD-z8_p9HviJnNBVnRThUhFMV0iPRWUYxNWWNpgsW7zgedBenY2sJOwS7HrVyOR879N_mTXwv09VkZ0Yl93QjbOP3reT0PuotI3QmTMTz7zp3Y6XjOjuNI9M3EJaCqjPpXBTNTblHV6Q',
    pinterestImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZyHVnozv23AlpKcIr4c-MKbclHyWZ9rUAxdI3a2YG7XdY3AFdTyAT5rTWqWXwtwPD5s9rWdZuTqJMCWosX3lB2iwgcXhXD-z8_p9HviJnNBVnRThUhFMV0iPRWUYxNWWNpgsW7zgedBenY2sJOwS7HrVyOR879N_mTXwv09VkZ0Yl93QjbOP3reT0PuotI3QmTMTz7zp3Y6XjOjuNI9M3EJaCqjPpXBTNTblHV6Q',
    hashtags: ['#MugCake', '#2MinDessert', '#CinnamonRoll', '#CraveMadeMeDoIt'],
    pantryCore: ['flour', 'milk', 'cinnamon', 'sugar', 'butter'],
    ingredientGroups: [
      {
        title: '2-Minute Mug Swirl',
        badge: 'Single Serve',
        tone: 'primary',
        items: [
          {
            id: 'self_flour',
            name: 'Self-rising flour (or flour + 1/4 tsp baking powder)',
            baseAmount: 4,
            usUnit: 'tbsp',
            metricAmount: 32,
            metricUnit: 'g',
            pantryKey: 'flour',
            stepRef: 1
          },
          {
            id: 'milk_m',
            name: 'Whole milk or oat milk',
            baseAmount: 3,
            usUnit: 'tbsp',
            metricAmount: 45,
            metricUnit: 'ml',
            pantryKey: 'milk',
            stepRef: 1
          },
          {
            id: 'cinn_sugar',
            name: 'Brown sugar + ground cinnamon swirl',
            baseAmount: 1.5,
            usUnit: 'tbsp',
            metricAmount: 20,
            metricUnit: 'g',
            pantryKey: 'cinnamon',
            stepRef: 2
          }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        phaseLabel: 'Whisk in Mug',
        title: 'Mix Batter Right in Your Mug',
        instructionTemplate:
          'Whisk {self_flour}, {milk_m}, and 1 tbsp melted butter in a microwave-safe mug until lump-free.',
        durationMin: 2,
        timerSeconds: 120,
        activeMeasureSummary: 'Flour + Milk + Melted Butter'
      },
      {
        stepNumber: 2,
        phaseLabel: '90s Swirl & Frost',
        title: 'Swirl Cinnamon & Microwave 75 Seconds',
        instructionTemplate:
          'Swirl {cinn_sugar} into the center with a toothpick. Microwave 75 seconds until pillowy, then drizzle cream cheese icing while steaming.',
        durationMin: 2,
        timerSeconds: 75,
        criticalTip:
          'Do not overcook! 75 seconds keeps the center velvety and cake-soft.',
        activeMeasureSummary: 'Microwave 75s • Cream Cheese Drizzle'
      }
    ],
    ugcQuotes: [
      {
        id: 'umg1',
        handle: '@dormchef',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDZyHVnozv23AlpKcIr4c-MKbclHyWZ9rUAxdI3a2YG7XdY3AFdTyAT5rTWqWXwtwPD5s9rWdZuTqJMCWosX3lB2iwgcXhXD-z8_p9HviJnNBVnRThUhFMV0iPRWUYxNWWNpgsW7zgedBenY2sJOwS7HrVyOR879N_mTXwv09VkZ0Yl93QjbOP3reT0PuotI3QmTMTz7zp3Y6XjOjuNI9M3EJaCqjPpXBTNTblHV6Q',
        quote: 'Late night study savior. Took 2 mins and tasted like Cinnabon.',
        rating: 5
      }
    ]
  },
  {
    id: 'ice-bath-tanghulu',
    slug: 'glass-crunch-ice-bath-tanghulu',
    title: 'Glass Crunch Ice Bath Tanghulu',
    shortTag: 'Tanghulu',
    storyViews: '340K',
    viewsLabel: '340K Views',
    viewsNumeric: 340,
    remakeSuccessRate: '95.4%',
    rating: 4.8,
    ratingCount: '540',
    prepMin: 5,
    bakeMin: 7,
    totalMin: 12,
    skill: 'Easy',
    baseServings: 4,
    kcal: 165,
    zeroMixer: true,
    cuisine: 'Chinese Street',
    dessertCategory: 'frozen-candy',
    primaryPlatform: 'tiktok',
    platforms: ['tiktok', 'youtube', 'instagram', 'pinterest'],
    categories: ['all', 'under15', 'nobake', 'three-ing', 'vegan-gf'],
    soundName: 'glass candy crack',
    badgeChip: '3-Ingred ASMR',
    creatorHandle: '@sweettoothsam',
    hookLine: 'No thermometer needed! Ice-bath method creates a thin shattering glass candy shell.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxeFso8tBoMkY8Zl0qZOXbSZ0k-5qogj6GQedtWEL3cyub51YNvaj2HPEGDlnsfhMqUBkpesKh08afj-0_fpzQeLbN97A3B0hI6ABRTzzGE4qSCQ7BWO9C50ZZa9ALZntVsz4vpkPDRSFvn0Rix7KfZmcyVTc6pu0jXhE1FQ76ni2sBPubk4TSvXmetDs0GswueRmnugBZ2XTX_gWWWLC5E--B21WCNqdtJB99z4U',
    thumbImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxeFso8tBoMkY8Zl0qZOXbSZ0k-5qogj6GQedtWEL3cyub51YNvaj2HPEGDlnsfhMqUBkpesKh08afj-0_fpzQeLbN97A3B0hI6ABRTzzGE4qSCQ7BWO9C50ZZa9ALZntVsz4vpkPDRSFvn0Rix7KfZmcyVTc6pu0jXhE1FQ76ni2sBPubk4TSvXmetDs0GswueRmnugBZ2XTX_gWWWLC5E--B21WCNqdtJB99z4U',
    pinterestImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_xN_STLdPDQ5-cD7rP08N6Z-jdyxjz9l66dHlvXsWOHIjD0odZsWUskvN2KX_o-O0ADBPqdTQbLnXoKsDyKZuisUHszPizUoChC0mvrVdtrGTYI40F6GKtLV2LTjrTLAv6TXYwtZQjFlwKaMoSJHrhmNyRSB50biBZNC7gzu4h6P2FVqO0FtC4tFJk8Bt-MZef55X_5PYYARwTST09059EkOZqW7jF-SG2hoJBaw',
    hashtags: ['#Tanghulu', '#GlassFruit', '#3Ingredients', '#CraveMadeMeDoIt'],
    pantryCore: ['strawberry', 'sugar'],
    ingredientGroups: [
      {
        title: 'Glass Candy Coating',
        badge: 'Vegan & GF',
        tone: 'tertiary',
        items: [
          {
            id: 'strawberries',
            name: 'Fresh dry strawberries (patted bone-dry)',
            baseAmount: 16,
            usUnit: 'berries',
            metricAmount: 300,
            metricUnit: 'g',
            pantryKey: 'strawberry',
            stepRef: 1
          },
          {
            id: 'sugar_t',
            name: 'White granulated sugar',
            baseAmount: 1,
            usUnit: 'cup',
            metricAmount: 200,
            metricUnit: 'g',
            pantryKey: 'sugar',
            stepRef: 2
          },
          {
            id: 'water_t',
            name: 'Filtered water (2:1 ratio)',
            baseAmount: 0.5,
            usUnit: 'cup',
            metricAmount: 120,
            metricUnit: 'ml',
            pantryKey: 'sugar',
            stepRef: 2
          }
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        phaseLabel: 'Bone-Dry Prep',
        title: 'Skewer & Dry Strawberries Completely',
        instructionTemplate:
          'Pat {strawberries} completely dry with paper towels (any moisture prevents candy sticking) and thread onto bamboo skewers. Prepare a bowl of ice water.',
        durationMin: 4,
        timerSeconds: 240,
        activeMeasureSummary: 'Dry Strawberries + Ice Bowl'
      },
      {
        stepNumber: 2,
        phaseLabel: '300°F Sugar Crack',
        title: 'Boil Syrup & Ice-Bath Dip',
        instructionTemplate:
          'Simmer {sugar_t} and {water_t} without stirring for 6–7 minutes until pale straw gold (hard-crack test in ice water). Spin skewers through syrup, then plunge 3 seconds into ice water for instant glass crunch!',
        durationMin: 8,
        timerSeconds: 480,
        criticalTip:
          'NEVER stir the sugar while boiling—swirl the pan gently so it stays crystal clear without crystallizing.',
        activeMeasureSummary: '2:1 Sugar Water • Do Not Stir'
      }
    ],
    ugcQuotes: [
      {
        id: 'ut1',
        handle: '@sweettoothsam',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDYqi0tojA8SoFikq8dGDgui93c3OGmoBZ0bHG7DhX7MuGj9TdzR-z1Me8i__9Ffi5NkUGL6FWnTcbr6XxiFuP27G34xY1SFzyn1mq6OZuAqHqYyPcUkKDOYspat9VyiqPcfJEwg4z0KjklIWrhNqgTlcAmn1ndsJ43pPMTgN2puRsV1JrUL_KS9JVvaveYxG8EdIboFfMbZlwfWRt68CA2nBnHsHGl-MZUd7PyTLo',
        quote: 'The ice bath trick worked! No burnt sugar finally 😭🙌',
        rating: 5
      }
    ]
  }
];

export const RECIPES: Recipe[] = [
  ...FLAGSHIP_RECIPES,
  ...(generatedData as Recipe[])
];

export const DESSERT_CATEGORIES: Array<{
  id: DessertCategory;
  label: string;
  emoji: string;
}> = [
  { id: 'all', label: 'All Desserts', emoji: '✨' },
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
