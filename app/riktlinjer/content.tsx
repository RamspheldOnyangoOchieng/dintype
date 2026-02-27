"use client"

import { useTranslations } from "@/lib/use-translations"

export function GuidelinesContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("guidelines.title")}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("guidelines.intro")}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.ageRequirements")}</h2>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.ageItem1")}</li>
            <li>{t("guidelines.ageItem2")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.illegalActivities")}</h2>
          <p>{t("guidelines.illegalDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.illegalItem1")}</li>
            <li>{t("guidelines.illegalItem2")}</li>
            <li>{t("guidelines.illegalItem3")}</li>
            <li>{t("guidelines.illegalItem4")}</li>
            <li>{t("guidelines.illegalItem5")}</li>
            <li>{t("guidelines.illegalItem6")}</li>
            <li>{t("guidelines.illegalItem7")}</li>
            <li>{t("guidelines.illegalItem8")}</li>
            <li>{t("guidelines.illegalItem9")}</li>
            <li>{t("guidelines.illegalItem10")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.childProtection")}</h2>
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 my-4">
            <p className="font-semibold text-destructive">{t("guidelines.zeroTolerance")}</p>
            <p className="text-destructive">{t("guidelines.zeroToleranceDesc")}</p>
          </div>
          <p>{t("guidelines.prohibitedTitle")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.childItem1")}</li>
            <li>{t("guidelines.childItem2")}</li>
            <li>{t("guidelines.childItem3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.sexualContent")}</h2>
          <p>{t("guidelines.sexualDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.sexualItem1")}</li>
            <li>{t("guidelines.sexualItem2")}</li>
          </ul>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">{t("guidelines.fetishTitle")}</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.fetishItem1")}</li>
            <li>{t("guidelines.fetishItem2")}</li>
            <li>{t("guidelines.fetishItem3")}</li>
            <li>{t("guidelines.fetishItem4")}</li>
            <li>{t("guidelines.fetishItem5")}</li>
            <li>{t("guidelines.fetishItem6")}</li>
            <li>{t("guidelines.fetishItem7")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.violence")}</h2>
          <p>{t("guidelines.violenceDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.violenceItem1")}</li>
            <li>{t("guidelines.violenceItem2")}</li>
            <li>{t("guidelines.violenceItem3")}</li>
            <li>{t("guidelines.violenceItem4")}</li>
            <li>{t("guidelines.violenceItem5")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.hateSpeech")}</h2>
          <p>{t("guidelines.hateSpeechDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.hateItem1")}</li>
            <li>{t("guidelines.hateItem2")}</li>
            <li>{t("guidelines.hateItem3")}</li>
            <li>{t("guidelines.hateItem4")}</li>
            <li>{t("guidelines.hateItem5")}</li>
            <li>{t("guidelines.hateItem6")}</li>
            <li>{t("guidelines.hateItem7")}</li>
          </ul>
          <p className="mt-4">
            {t("guidelines.hateNote")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.privacyFraud")}</h2>
          <p>{t("guidelines.privacyDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.privacyItem1")}</li>
            <li>{t("guidelines.privacyItem2")}</li>
            <li>{t("guidelines.privacyItem3")}</li>
            <li>{t("guidelines.privacyItem4")}</li>
            <li>{t("guidelines.privacyItem5")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.misinformation")}</h2>
          <p>{t("guidelines.misinformationDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.misinfoItem1")}</li>
            <li>{t("guidelines.misinfoItem2")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.spam")}</h2>
          <p>{t("guidelines.spamDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("guidelines.spamItem1")}</li>
            <li>{t("guidelines.spamItem2")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("guidelines.restrictedGoods")}</h2>
          <p>{t("guidelines.restrictedGoodsDesc")}</p>
        </section>

        <section className="mt-12 bg-primary/10 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("guidelines.reportViolations")}</h2>
          <p className="mb-4">
            {t("guidelines.reportDesc")}
          </p>
          <div className="flex gap-4">
            <a
              href="/rapportera"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("guidelines.reportContent")}
            </a>
            <a
              href="/kontakta"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t("guidelines.contactSupport")}
            </a>
          </div>
        </section>

        <p className="mt-8 text-sm text-muted-foreground text-zinc-500">
          {t("guidelines.agreement")}
        </p>
      </div>
    </div>
  );
}
