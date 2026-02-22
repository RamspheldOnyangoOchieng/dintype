"use client"

import { useTranslations } from "@/lib/use-translations"

export function CookiesContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("cookies.title")}</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-sm text-muted-foreground">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br />
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <p className="text-zinc-600 dark:text-zinc-400">
          {t("cookies.intro")}
        </p>
        
        <p className="text-zinc-600 dark:text-zinc-400">
          {t("cookies.manageCookiesDesc")}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.whatAreCookies")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("cookies.whatAreCookiesDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.typesTitle")}</h2>

          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("cookies.essentialTitle")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("cookies.essentialDesc")}
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("cookies.functionalTitle")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("cookies.functionalDesc")}
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("cookies.analyticsTitle")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("cookies.analyticsDesc")}
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("cookies.marketingTitle")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("cookies.marketingDesc")}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("cookies.manageCookies")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("cookies.manageCookiesDesc")}
          </p>
          
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">Browser-specific Cookie Control:</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Edge</a></li>
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
