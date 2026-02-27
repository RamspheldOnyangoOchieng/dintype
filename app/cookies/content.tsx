"use client"

import { useTranslations } from "@/lib/use-translations"

export function CookiesContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("cookies.title")}</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>{t("cookies.effectiveDate")}: 2024-12-01</p>
          <p>{t("cookies.lastUpdated")}: 2024-12-01</p>
        </div>
        
        <p className="text-zinc-600 dark:text-zinc-400">
          {t("cookies.intro")}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.whatAreCookies")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("cookies.whatAreCookiesDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.howWeUse")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("cookies.howWeUseDesc")}
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-600 dark:text-zinc-400">
            <li>{t("cookies.useItem1")}</li>
            <li>{t("cookies.useItem2")}</li>
            <li>{t("cookies.useItem3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.types")}</h2>
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("cookies.essential")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("cookies.essentialDesc")}
              </p>
            </div>
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("cookies.analytics")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("cookies.analyticsDesc")}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.yourChoices")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("cookies.yourChoicesDesc")}
          </p>
          
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">{t("cookies.browserControl")}</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google Chrome
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Microsoft Edge
              </a>
            </li>
            <li>
              <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Apple Safari
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.gdprTitle")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("cookies.gdprDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.contactTitle")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("cookies.contactDesc")}
          </p>
          <p className="mt-4">
            📧 Email: <a href="mailto:support@dintype.se" className="text-primary hover:underline">support@dintype.se</a>
          </p>
        </section>
      </div>
    </div>
  )
}
