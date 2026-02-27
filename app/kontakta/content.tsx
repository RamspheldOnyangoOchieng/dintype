"use client"

import { useTranslations } from "@/lib/use-translations"

export function ContactContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("contact.title")}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-xl leading-relaxed">
          {t("contact.subtitle")}
        </p>

        <section>
          <h2 className="text-3xl font-semibold mt-12 mb-6 text-zinc-800 dark:text-white">{t("contact.howCanWeHelp")}</h2>
          <p>{t("contact.howCanWeHelpDesc")}</p>

          <div className="space-y-6 mt-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.accountHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("contact.accountHelpItem1")}</li>
                <li>{t("contact.accountHelpItem2")}</li>
                <li>{t("contact.accountHelpItem3")}</li>
                <li>{t("contact.accountHelpItem4")}</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.technicalHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("contact.techHelpItem1")}</li>
                <li>{t("contact.techHelpItem2")}</li>
                <li>{t("contact.techHelpItem3")}</li>
                <li>{t("contact.techHelpItem4")}</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.billingHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("contact.billingHelpItem1")}</li>
                <li>{t("contact.billingHelpItem2")}</li>
                <li>{t("contact.billingHelpItem3")}</li>
                <li>{t("contact.billingHelpItem4")}</li>
                <li>{t("contact.billingHelpItem5")}</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.safetyHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("contact.safetyHelpItem1")}</li>
                <li>{t("contact.safetyHelpItem2")}</li>
                <li>{t("contact.safetyHelpItem3")}</li>
                <li>{t("contact.safetyHelpItem4")}</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.generalHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("contact.generalHelpItem1")}</li>
                <li>{t("contact.generalHelpItem2")}</li>
                <li>{t("contact.generalHelpItem3")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-12 mb-6 text-zinc-800 dark:text-white">{t("contact.howToContact")}</h2>
          <p>{t("contact.howToContactDesc")}</p>

          <div className="space-y-6 mt-6">
            <div className="border border-border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.emailUs")}</h3>
              <p>
                {t("contact.emailUsDesc")}{" "}
                <a href="mailto:support@dintype.se" className="text-primary hover:underline font-semibold">
                  support@dintype.se
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t("contact.responseTime")}
              </p>
            </div>

            <div className="border border-border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">💬 {t("contact.liveChat")}</h3>
              <p>
                {t("contact.liveChatDesc")}
              </p>
            </div>

            <div className="border border-border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.visitFaq")}</h3>
              <p>
                {t("contact.visitFaqDesc")}{" "}
                <a href="/faq" className="text-primary hover:underline">{t("contact.visitFaq")}</a>.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-12 mb-6 text-zinc-800 dark:text-white">{t("contact.supportExpect")}</h2>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">{t("contact.expectedQuick")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.expectedQuickDesc")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">{t("contact.expectedEfficient")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.expectedEfficientDesc")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">{t("contact.expectedProfessional")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.expectedProfessionalDesc")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">{t("contact.expectedConfidential")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.expectedConfidentialDesc")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">{t("contact.expectedImpartial")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.expectedImpartialDesc")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 bg-primary/10 p-8 rounded-lg">
          <h2 className="text-3xl font-semibold mb-6 text-zinc-800 dark:text-white">{t("contact.valueFeedback")}</h2>
          <p>
            {t("contact.valueFeedbackDesc")}
          </p>
        </section>

        <section className="mt-12 text-center bg-gradient-to-br from-primary/20 to-primary/10 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-white">{t("contact.communityGuidelines")}</h2>
          <p className="mb-6 text-muted-foreground">
            {t("contact.communityGuidelinesDesc")}
          </p>
          <a
            href="mailto:support@dintype.se"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("contact.supportContact")}
          </a>
        </section>
      </div>
    </div>
  )
}
