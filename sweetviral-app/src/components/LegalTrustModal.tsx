import React, { useEffect } from 'react';

export type LegalTab = 'privacy' | 'about' | 'contact';

interface LegalTrustModalProps {
  tab: LegalTab | null;
  onChangeTab: (tab: LegalTab) => void;
  onClose: () => void;
}

export const LegalTrustModal: React.FC<LegalTrustModalProps> = ({
  tab,
  onChangeTab,
  onClose
}) => {
  useEffect(() => {
    if (!tab) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tab, onClose]);

  if (!tab) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crave Recipes Site Information"
      className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex flex-col justify-end sm:items-center sm:justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-lg bg-surface rounded-t-xl sm:rounded-xl p-gutter pb-safe max-h-[88dvh] overflow-y-auto shadow-2xl flex flex-col gap-space-sm">
        <div className="flex items-center justify-between pt-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
            Crave Recipes — Trust &amp; Policies
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex bg-surface-container-high p-1 rounded-full gap-1">
          {(['privacy', 'about', 'contact'] as LegalTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChangeTab(t)}
              className={`flex-1 py-2 rounded-full font-label-sm text-label-sm font-bold capitalize transition-all ${
                tab === t ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              {t === 'privacy' ? 'Privacy Policy' : t === 'about' ? 'About Us' : 'Contact'}
            </button>
          ))}
        </div>

        {tab === 'privacy' && (
          <div className="font-body-sm text-body-sm text-on-surface-variant space-y-3 leading-relaxed">
            <p>
              <strong className="text-on-surface">Crave Recipes</strong> (`https://crave.devyy.com/`)
              is committed to protecting your privacy. You can browse all 415+ recipes with zero
              account registration. Saved recipes and ingredient checklists are stored locally in
              your browser&apos;s `localStorage`.
            </p>
            <p>
              <strong className="text-on-surface">Google AdSense &amp; Advertising Cookies:</strong>{' '}
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s
              prior visits to this website or other websites. Google&apos;s use of advertising
              cookies enables it and its partners to serve ads to users based on their visit to
              Crave Recipes and/or other sites on the Internet.
            </p>
            <p>
              You may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline font-semibold"
              >
                Google Ads Settings
              </a>{' '}
              or learn more at{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline font-semibold"
              >
                Google Advertising Privacy &amp; Terms
              </a>
              .
            </p>
            <p>
              <strong className="text-on-surface">Analytics:</strong> We use Google Analytics
              (`G-ELWDRG4J22`) to understand aggregate page traffic and improve recipe discovery.
            </p>
          </div>
        )}

        {tab === 'about' && (
          <div className="font-body-sm text-body-sm text-on-surface-variant space-y-3 leading-relaxed">
            <p>
              <strong className="text-on-surface">Crave Recipes</strong> is a mobile-first dessert
              recipe hub featuring 415+ viral, classic, and zero-refined-sugar treats—complete with
              instant US/Metric scaling, 1-tap Healthy Swaps, and hands-free Cook Mode timers.
            </p>
            <p>
              Every recipe is structured for fast, clutter-free kitchen use with no paywalls or
              forced sign-ups.
            </p>
          </div>
        )}

        {tab === 'contact' && (
          <div className="font-body-sm text-body-sm text-on-surface-variant space-y-3 leading-relaxed">
            <p>
              Have a recipe request, partnership inquiry, or feedback for{' '}
              <strong className="text-on-surface">Crave Recipes</strong>?
            </p>
            <p>
              Website:{' '}
              <a
                href="https://crave.devyy.com/"
                className="text-primary underline font-semibold"
              >
                https://crave.devyy.com/
              </a>
              <br />
              eBook &amp; Healthy Cravings:{' '}
              <a
                href="https://crave.thewellnessherb.com/healthy-cravings.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline font-semibold"
              >
                crave.thewellnessherb.com
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
