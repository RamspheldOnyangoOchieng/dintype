"use client"

import { useTranslations } from "@/lib/use-translations"

export function AboutUsContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t("aboutUs.title")}</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-xl leading-relaxed">
          {t("aboutUs.intro")}
        </p>

        <section>
          <h2 className="text-3xl font-semibold mt-12 mb-6">{t("aboutUs.newEra")}</h2>
          <p>
            {t("aboutUs.newEraDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-12 mb-6">{t("aboutUs.chatConnect")}</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t("aboutUs.feature1")}</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t("aboutUs.feature2")}</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t("aboutUs.feature3")}</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t("aboutUs.feature4")}</span>
            </li>
          </ul>
        </section>

        <section className="bg-muted/50 p-6 rounded-lg mt-12">
          <h2 className="text-3xl font-semibold mb-6">{t("aboutUs.fictional")}</h2>
          <p>
            {t("aboutUs.fictionalDesc1")}
          </p>
          <p className="mt-4">
            {t("aboutUs.fictionalDesc2")}
          </p>
        </section>

        <section className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">{t("aboutUs.getStarted")}</h2>
          <p className="mb-6">{t("aboutUs.getStartedDesc")}</p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/generera" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("aboutUs.createImage")}
            </a>
            <a 
              href="/skapa-karaktar" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t("aboutUs.createCompanion")}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
