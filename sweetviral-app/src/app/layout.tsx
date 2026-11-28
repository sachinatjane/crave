import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://crave.devyy.com'),
  title: {
    default: 'Crave Recipes — Healthy & Viral Dessert Recipes (Zero Refined Sugar Swaps)',
    template: '%s'
  },
  description:
    'Explore 415+ healthy & viral dessert recipes with zero-refined-sugar swaps, under-250-cal treats, high-protein bakes, instant US/Metric scaling & hands-free Cook Mode.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  alternates: {
    canonical: 'https://crave.devyy.com/'
  },
  openGraph: {
    type: 'website',
    siteName: 'Crave Recipes',
    url: 'https://crave.devyy.com/',
    title: 'Crave Recipes — 400+ Viral Dessert Recipes (Zero Login)',
    description:
      '400+ viral desserts including Dubai Pistachio Brownies, Basque Cheesecake, Biscoff Tiramisu & American/European classics with instant scaling and Cook Mode.',
    images: [
      {
        url: 'https://crave.devyy.com/ai-images/dubai-brownie-hero.jpg',
        width: 1024,
        height: 1024,
        alt: 'Crave Recipes — Healthy & Viral Dessert Recipes'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crave Recipes — 400+ Viral Dessert Recipes',
    description:
      'Zero-login mobile dessert hub with US/Metric scaling, 9:16 Story Cards & hands-free Cook Mode.',
    images: ['https://crave.devyy.com/ai-images/dubai-brownie-hero.jpg']
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }]
  },
  manifest: '/manifest.webmanifest',
  other: {
    'google-adsense-account': 'ca-pub-6889606875840958',
    'pinterest-rich-pin': 'true',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#e11d48'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6889606875840958"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-surface font-sans text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ELWDRG4J22"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELWDRG4J22', { send_page_view: true });
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
