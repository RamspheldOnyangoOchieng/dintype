"use client"

import { useTranslations } from "@/lib/use-translations"
import Link from "next/link"

export function TermsContent() {
  const { t, language } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("terms.title")}</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("terms.intro")}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.acceptance")}</h2>
          <p>
            {t("terms.acceptanceDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.eligibility")}</h2>
          <div className="space-y-4">
            <p>{t("terms.eligibilityDesc")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("terms.eligibilityItem1")}</li>
              <li>{t("terms.eligibilityItem2")}</li>
              <li>{t("terms.eligibilityItem3")}</li>
              <li>{t("terms.eligibilityItem4")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.useOfService")}</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>{t("terms.useOfServiceDesc")}</p>
            
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mt-4">{t("terms.prohibitedTitle")}</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("terms.prohibited1")}</li>
              <li>{t("terms.prohibited2")}</li>
              <li>{t("terms.prohibited3")}</li>
              <li>{t("terms.prohibited4")}</li>
              <li>{t("terms.prohibited5")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.contentAndAI")}</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              {t("terms.contentAndAIDesc")}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t("terms.aiNatureTitle")}</strong> {t("terms.aiNatureDesc")}</li>
              <li><strong>{t("terms.userContentTitle")}</strong> {t("terms.userContentDesc")}</li>
              <li><strong>{t("terms.moderationTitle")}</strong> {t("terms.moderationDesc")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.premiumAndPayments")}</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>{t("terms.premiumAndPaymentsDesc")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t("terms.feesTitle")}</strong> {t("terms.feesDesc")}</li>
              <li><strong>{t("terms.billingTitle")}</strong> {t("terms.billingDesc")}</li>
              <li><strong>{t("terms.refundsTitle")}</strong> {t("terms.refundsDesc")}</li>
              <li><strong>{t("terms.cancellationTitle")}</strong> {t("terms.cancellationDesc")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.intellectualProperty")}</h2>
          <p>
            {t("terms.intellectualPropertyDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.privacyAndData")}</h2>
          <p>
            {t("terms.privacyAndDataDesc")}
            <Link href="/integritetspolicy" className="text-primary hover:underline mx-1">{t("footer.legal.privacyPolicy")}</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.limitation")}</h2>
          <p>
            {t("terms.limitationDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.changesToTerms")}</h2>
          <p>
            {t("terms.changesToTermsDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.contactUs")}</h2>
          <p>
            {t("terms.contactUsDesc")}
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-semibold">{t("terms.supportTitle")}</p>
            <p>{t("general.email")}: <a href="mailto:support@dintype.se" className="text-primary hover:underline">support@dintype.se</a></p>
          </div>
        </section>

        <div className="text-sm text-zinc-500 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          {t("general.lastUpdated")}: {new Date().toLocaleDateString(language === "sv" ? "sv-SE" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
    </div>
  );
}
