"use client";
import { useState, useCallback } from "react";
import { CONSENT_VERSION, POLICY_VERSION } from "@/lib/consent-config";
import { Button } from "@/components/ui/button";

import { useTranslations } from "@/lib/use-translations";

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

interface ConsentPayload {
  version: number;
  policyVersion: number;
  timestamp: number;
  preferences: CookiePreferences;
  confirmations: { age: boolean; terms: boolean };
}

export default function LandingDisclaimerModal({
  open,
  onConfirm,
  onCookieSettings,
  lang = "en",
  initialPreferences,
}: {
  open: boolean;
  // Called with final saved preferences (either accept all or custom)
  onConfirm: (prefs: CookiePreferences, full?: ConsentPayload) => void;
  onCookieSettings: () => void;
  lang?: "en";
  initialPreferences?: Partial<CookiePreferences>;
}) {
  const { t } = useTranslations();
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    analytics: initialPreferences?.analytics ?? true,
    marketing: initialPreferences?.marketing ?? false,
  });
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const ready = ageConfirmed && termsAccepted;
  const [showValidation, setShowValidation] = useState(false);

  const ensureReady = useCallback((action: () => void) => {
    if (!ready) {
      // trigger validation message highlight
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 1600);
      return;
    }
    action();
  }, [ready]);

  if (!open) return null;

  const buildConsent = (finalPrefs: CookiePreferences): ConsentPayload => ({
    version: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    timestamp: Date.now(),
    preferences: finalPrefs,
    confirmations: { age: ageConfirmed, terms: termsAccepted },
  });

  const saveAndClose = (finalPrefs: CookiePreferences) => {
    const consent = buildConsent(finalPrefs);
    onConfirm(finalPrefs, consent);
  };

  const acceptAll = () => ensureReady(() => saveAndClose({ analytics: true, marketing: true }));
  const rejectNonEssential = () => ensureReady(() => saveAndClose({ analytics: false, marketing: false }));
  const saveCustom = () => ensureReady(() => saveAndClose(prefs));

  return (
    <div className="fixed inset-0 z-[10000] flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 shadow-2xl w-full max-w-2xl overflow-y-auto flex flex-col p-5 sm:p-7 md:p-9 relative border border-white/15 my-auto"
        style={{
          borderRadius: '1.5rem 0.25rem 1.5rem 0.25rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
          maxHeight: 'min(90vh, 820px)',
        }}
      >
        {/* Top accent strip */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-rose-300 to-red-400 pointer-events-none flex-shrink-0"
          style={{ borderRadius: '1.5rem 0.25rem 0 0' }}
        />
        {/* 18+ Badge */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] sm:text-[11px] font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-widest cursor-default select-none z-10 flex items-center gap-1">
          🔞 <span>18+</span>
        </div>
        {!showSettings && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-primary-foreground">{t("disclaimer.ageTitle")}</h2>
            <p className="text-primary-foreground mb-3">{t("disclaimer.ageDesc")}</p>
            <p className="text-primary-foreground text-xs mb-4 space-x-4">
              <a href="/villkor" className="underline hover:text-white/80 transition-colors" target="_blank" rel="noopener noreferrer">{t("disclaimer.termsLink")}</a>
              <a href="/integritet" className="underline hover:text-white/80 transition-colors" target="_blank" rel="noopener noreferrer">{t("disclaimer.privacyLink")}</a>
            </p>
            <h3 className="text-lg font-bold mb-2 text-primary-foreground">{t("disclaimer.cookieTitle")}</h3>
            <p className="text-primary-foreground mb-4">{t("disclaimer.cookieDesc")}</p>
            <h3 className="text-lg font-bold mb-2 text-primary-foreground">{t("disclaimer.rulesTitle")}</h3>
            <ul className="text-primary-foreground text-sm mb-6 list-disc pl-6 max-h-48 overflow-y-auto">
              {Array.from({ length: 78 }, (_, i) => i + 1).map((idx) => (
                <li key={idx}>{t(`disclaimer.rule${idx}` as any)}</li>
              ))}
            </ul>
            <div className="space-y-3 mb-4">
              <label className="flex items-start gap-2 text-primary-foreground text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-primary-foreground/50 text-primary focus:ring-primary-foreground/50 bg-white/10"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                />
                <span>{t("disclaimer.ageCheckbox")}</span>
              </label>
              <label className="flex items-start gap-2 text-primary-foreground text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-primary-foreground/50 text-primary focus:ring-primary-foreground/50 bg-white/10"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>{t("disclaimer.termsCheckbox")}</span>
              </label>
              {(!ready || showValidation) && (
                <p className={`text-xs font-medium transition-colors ${showValidation ? "text-red-200 animate-pulse" : "text-white/80"}`}>{t("disclaimer.needConfirm")}</p>
              )}
            </div>
            <div className="flex flex-col lg:flex-row gap-3 mt-2">
              <div className="flex flex-1 gap-3">
                <Button
                  className="bg-white text-primary hover:text-primary/80 font-semibold flex-1 border border-white/20 hover:border-white/40 shadow-sm pointer-events-auto hover:bg-white/90 cursor-pointer"
                  type="button"
                  onClick={() => setShowSettings(true)}
                >
                  {t("disclaimer.cookieSettings")}
                </Button>
                <Button
                  variant="destructive"
                  className={`bg-red-500 hover:bg-red-600 text-white font-semibold flex-1 shadow cursor-pointer ${!ready && "opacity-60"}`}
                  type="button"
                  onClick={rejectNonEssential}
                  aria-disabled={!ready}
                >
                  {t("disclaimer.reject")}
                </Button>
              </div>
              <Button
                className={`bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold flex-1 shadow focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${!ready && "opacity-60"}`}
                type="button"
                onClick={acceptAll}
                aria-disabled={!ready}
              >
                {t("disclaimer.confirmAll")}
              </Button>
            </div>
          </>
        )}

        {showSettings && (
          <div className="text-primary-foreground space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t("disclaimer.cookieTitle")}</h2>
              <button
                className="text-sm underline hover:text-white/80 transition-colors cursor-pointer"
                onClick={() => setShowSettings(false)}
              >
                ← {t("disclaimer.back")}
              </button>
            </div>
            <p className="text-sm opacity-90">{t("disclaimer.cookieDesc")}</p>
            <div className="bg-black/10 rounded-lg p-4 border border-white/10">
              <h3 className="font-semibold">{t("disclaimer.necessary")}</h3>
              <p className="text-xs opacity-80">
                {t("disclaimer.necessaryDesc")}
              </p>
              <div className="mt-2 text-xs inline-block px-2 py-1 rounded bg-black/20 border border-white/10">
                {t("disclaimer.active")}
              </div>
            </div>
            <div className="bg-black/10 rounded-lg p-4 border border-white/10 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{t("disclaimer.analytics")}</h3>
                <p className="text-xs opacity-80 max-w-md">
                  {t("disclaimer.analyticsDesc")}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-primary-foreground/50 text-primary focus:ring-primary-foreground/50 bg-white/10"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                />
                <span className="text-sm">{prefs.analytics ? t("disclaimer.on") : t("disclaimer.off")}</span>
              </label>
            </div>
            <div className="bg-black/10 rounded-lg p-4 border border-white/10 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{t("disclaimer.marketing")}</h3>
                <p className="text-xs opacity-80 max-w-md">
                  {t("disclaimer.marketingDesc")}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-primary-foreground/50 text-primary focus:ring-primary-foreground/50 bg-white/10"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                />
                <span className="text-sm">{prefs.marketing ? t("disclaimer.on") : t("disclaimer.off")}</span>
              </label>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 pt-2">
              <div className="flex flex-1 gap-3">
                <Button
                  variant="outline"
                  className={`bg-white text-primary hover:text-primary/80 font-semibold flex-1 border border-white/20 hover:border-white/40 shadow-sm cursor-pointer ${!ready && "opacity-60"}`}
                  type="button"
                  onClick={saveCustom}
                  aria-disabled={!ready}
                >
                  {t("disclaimer.savePreferences")}
                </Button>
                <Button
                  variant="destructive"
                  className={`bg-red-500 hover:bg-red-600 text-white font-semibold flex-1 shadow cursor-pointer ${!ready && "opacity-60"}`}
                  type="button"
                  onClick={rejectNonEssential}
                  aria-disabled={!ready}
                >
                  {t("disclaimer.reject")}
                </Button>
              </div>
              <Button
                className={`bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold flex-1 shadow focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${!ready && "opacity-60"}`}
                type="button"
                onClick={acceptAll}
                aria-disabled={!ready}
              >
                {t("disclaimer.acceptAll")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
