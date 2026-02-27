"use client"

import { useTranslations } from "@/lib/use-translations"
import Link from "next/link"

export default function FAQPage() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("faq.pageTitle")}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("faq.pageIntro")}{" "}
          <a href="mailto:support@dintype.se" className="text-primary hover:underline">
            support@dintype.se
          </a>
        </p>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">{t("faq.section.gettingStarted")}</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.whatIs")}</h3>
              <p>{t("faq.a.whatIs")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.howWorks")}</h3>
              <p>{t("faq.a.howWorks")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.isFree")}</h3>
              <p>{t("faq.a.isFree")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.whatIsPremium")}</h3>
              <p>{t("faq.a.whatIsPremium")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.createAccount")}</h3>
              <p>{t("faq.a.createAccount")}</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>{t("faq.a.createAccountSocial")}</li>
                <li>{t("faq.a.createAccountEmail")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">{t("faq.section.aiChars")}</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.customize")}</h3>
              <p>{t("faq.a.customize")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.askPhotos")}</h3>
              <p>{t("faq.a.askPhotos")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.realtimeImages")}</h3>
              <p>{t("faq.a.realtimeImages")}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">{t("faq.section.accountMgmt")}</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.howToPay")}</h3>
              <p>{t("faq.a.howToPay")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.paymentMethods")}</h3>
              <p>{t("faq.a.paymentMethods")}</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>{t("faq.a.paymentMethodsList")}</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">{t("faq.a.paymentMethodsNote")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.howToCancel")}</h3>
              <p>{t("faq.a.howToCancel")}</p>

              <div className="bg-muted/50 p-4 rounded-lg mt-4 space-y-3">
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-white">{t("faq.a.cancelMethod1")}</p>
                  <p className="text-sm">{t("faq.a.cancelMethod1Desc")}</p>
                </div>

                <div>
                  <p className="font-semibold text-zinc-800 dark:text-white">{t("faq.a.cancelMethod2")}</p>
                  <ol className="list-decimal pl-6 space-y-1 text-sm mt-2">
                    <li>{t("faq.a.cancelMethod2Step1")}</li>
                    <li>{t("faq.a.cancelMethod2Step2")}</li>
                    <li>{t("faq.a.cancelMethod2Step3")}</li>
                    <li>{t("faq.a.cancelMethod2Step4")}</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold text-zinc-800 dark:text-white">{t("faq.a.cancelMethod3")}</p>
                  <p className="text-sm">
                    {t("faq.a.cancelMethod3Desc")}{" "}
                    <a href="mailto:support@dintype.se" className="text-primary hover:underline">
                      support@dintype.se
                    </a>
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground italic">
                <strong>{t("faq.a.cancelNote")}</strong>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.howToDelete")}</h3>
              <p>{t("faq.a.howToDelete")}</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>{t("faq.a.deleteStep1")}</li>
                <li>{t("faq.a.deleteStep2")}</li>
                <li>{t("faq.a.deleteStep3")}</li>
                <li>{t("faq.a.deleteStep4")}</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">{t("faq.section.privacy")}</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.isSafe")}</h3>
              <p>{t("faq.a.isSafe")}</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>{t("faq.a.isSafeModeration")}</li>
                <li>{t("faq.a.isSafeReporting")}</li>
                <li>{t("faq.a.isSafeSecurity")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.isPrivate")}</h3>
              <p>{t("faq.a.isPrivate")}</p>
              <p className="mt-2">
                <Link href="/integritetspolicy" className="text-primary hover:underline">{t("footer.legal.privacyPolicy")}</Link>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.canOthersSee")}</h3>
              <p>{t("faq.a.canOthersSee")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.personalData")}</h3>
              <p>{t("faq.a.personalData")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.reportContent")}</h3>
              <p>{t("faq.a.reportContent")}</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>{t("faq.a.reportInApp")}</li>
                <li>{t("faq.a.reportEmail")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">{t("faq.section.billing")}</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.refunds")}</h3>
              <p>{t("faq.a.refunds")}</p>
              <p className="mt-2">
                <Link href="/villkor" className="text-primary hover:underline">{t("footer.legal.terms")}</Link>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">{t("faq.section.technical")}</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("faq.q.techIssue")}</h3>
              <p>{t("faq.a.techIssue")}</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>{t("faq.a.techStep1")}</li>
                <li>{t("faq.a.techStep2")}</li>
                <li>{t("faq.a.techStep3")}</li>
                <li>{t("faq.a.techStep4")}</li>
              </ol>
              <p className="mt-4">{t("faq.a.techContact")}</p>
            </div>
          </div>
        </section>

        <section className="mt-12 bg-primary/10 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("faq.cta.title")}</h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">{t("faq.cta.desc")}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:support@dintype.se"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("faq.cta.contactSupport")}
            </a>
            <Link
              href="/kontakta"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t("faq.cta.moreOptions")}
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t("faq.cta.thanks")}</p>
        </section>
      </div>
    </div>
  )
}
