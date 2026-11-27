# Crave — Viral Mobile Dessert Recipe Hub

Zero-login, mobile-first viral dessert web app built for social media traffic (TikTok, Instagram Reels, Pinterest, YouTube Shorts, and Facebook), featuring **400+ curated recipes** across all dessert categories with a focus on American and European classics.

## Project Structure

- `sweetviral-app/` — Vite + React + TypeScript + Tailwind CSS production web app
- `decadent_kinetic/` — Design system tokens & brand specification (`DESIGN.md`)
- `trending_viral_desserts/`, `dubai_pistachio_brownie_recipe/`, `hands_free_cook_mode/`, `community_remakes_social_proof/` — Original Stitch mobile prototypes

## Key Features

- **Zero Login / Zero Sign-Up:** Instant `localStorage` Saved Recipe Box, checked ingredient state, and URL-encoded scaled deep links (`?r=slug&s=12&u=metric`).
- **400 Viral & Global Recipes:** Full category filtering, USA/Europe regional filter, social platform filters, Pantry Matcher, and 400-Dessert Roulette.
- **Viral Share Engine:** Client-side HTML5 `<canvas>` generator exporting 9:16 IG/TikTok Story PNGs and 2:3 Pinterest Pin Cards, plus 1-tap WhatsApp, Pinterest, Facebook, and caption/hashtag copying.
- **Hands-Free Cook Mode:** Screen Wake Lock API, Web Audio API chime, haptic feedback, Web Speech voice commands & Read Aloud, swipe gestures, and per-step timers.

## Local Development & Deployment

```bash
cd sweetviral-app
npm install
npm run dev
```

For Vercel / Cloudflare Pages / Netlify deployment:
- **Root Directory:** `sweetviral-app`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
