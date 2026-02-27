"use client"

import { useTranslations } from "@/lib/use-translations"

export function PrivacyPolicyContent() {
  const { t, language } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("privacy.title")}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-sm text-muted-foreground">
          {t("general.effectiveDate")}: {new Date().toLocaleDateString(language === "sv" ? "sv-SE" : "en-US", { year: "numeric", month: "long", day: "numeric" })}<br />
          {t("general.lastUpdated")}: {new Date().toLocaleDateString(language === "sv" ? "sv-SE" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("privacy.intro")}
        </p>

        <p className="text-zinc-600 dark:text-zinc-400">
          {t("privacy.contactUsSection")}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.whoWeAre")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.whoWeAreDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.whatIsPersonalData")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.whatIsPersonalDataDesc")}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("privacy.identifiableData")}</li>
            <li>{t("privacy.pseudonymizedData")}</li>
            <li>{t("privacy.anonymousData")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.whatWeCollect")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{t("privacy.whatWeCollectDesc")}</p>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">{t("privacy.visitorsTitle")}</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("privacy.visitorItem1")}</li>
            <li>{t("privacy.visitorItem2")}</li>
            <li>{t("privacy.visitorItem3")}</li>
            <li>{t("privacy.visitorItem4")}</li>
          </ul>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">{t("privacy.registeredTitle")}</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("privacy.registeredItem1")}</li>
            <li>{t("privacy.registeredItem2")}</li>
            <li>{t("privacy.registeredItem3")}</li>
            <li>{t("privacy.registeredItem4")}</li>
            <li>{t("privacy.registeredItem5")}</li>
            <li>{t("privacy.registeredItem6")}</li>
            <li>{t("privacy.registeredItem7")}</li>
          </ul>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">{t("privacy.specialTitle")}</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.specialDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.howWeCollect")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{t("privacy.howWeCollectDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("privacy.howItem1")}</li>
            <li>{t("privacy.howItem2")}</li>
            <li>{t("privacy.howItem3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.whyWeProcess")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-4 py-2 text-left text-zinc-800 dark:text-white">{t("privacy.tablePurpose")}</th>
                  <th className="border border-border px-4 py-2 text-left text-zinc-800 dark:text-white">{t("privacy.tableLegalBasis")}</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr>
                  <td className="border border-border px-4 py-2">{t("privacy.purpose1")}</td>
                  <td className="border border-border px-4 py-2">{t("privacy.legalBasis1")}</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">{t("privacy.purpose2")}</td>
                  <td className="border border-border px-4 py-2">{t("privacy.legalBasis2")}</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">{t("privacy.purpose3")}</td>
                  <td className="border border-border px-4 py-2">{t("privacy.legalBasis3")}</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">{t("privacy.purpose4")}</td>
                  <td className="border border-border px-4 py-2">{t("privacy.legalBasis4")}</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">{t("privacy.purpose5")}</td>
                  <td className="border border-border px-4 py-2">{t("privacy.legalBasis5")}</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">{t("privacy.purpose6")}</td>
                  <td className="border border-border px-4 py-2">{t("privacy.legalBasis6")}</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">{t("privacy.purpose7")}</td>
                  <td className="border border-border px-4 py-2">{t("privacy.legalBasis7")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.dataSharing")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{t("privacy.dataSharingDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("privacy.sharingItem1")}</li>
            <li>{t("privacy.sharingItem2")}</li>
            <li>{t("privacy.sharingItem3")}</li>
            <li>{t("privacy.sharingItem4")}</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {t("privacy.sharingNote")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.internationalTransfers")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.internationalTransfersDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.dataSecurity")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.dataSecurityDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.childrenPrivacy")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.childrenPrivacyDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.dataRetention")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.dataRetentionDesc")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.yourRights")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{t("privacy.yourRightsDesc")}</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>{t("privacy.rights1")}</li>
            <li>{t("privacy.rights2")}</li>
            <li>{t("privacy.rights3")}</li>
            <li>{t("privacy.rights4")}</li>
            <li>{t("privacy.rights5")}</li>
            <li>{t("privacy.rights6")}</li>
            <li>{t("privacy.rights7")}</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {t("privacy.rightsNote")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">{t("privacy.contactUs")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("privacy.contactUsDesc")}<br />
            {t("general.email")}: <a href="mailto:support@dintype.se" className="text-primary hover:underline">support@dintype.se</a>
          </p>
        </section>
      </div>
    </div>
  );
}
