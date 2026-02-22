"use client"

import { useTranslations } from "@/lib/use-translations"

export function TermsContent() {
  const { t } = useTranslations()

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
            By accessing or using Dintype, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you may not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.eligibility")}</h2>
          <div className="space-y-4">
            <p>To use Dintype, you must meet the following requirements:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old.</li>
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for keeping your login credentials confidential.</li>
              <li>All activities occurring under your account are your responsibility.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.useOfService")}</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Dintype is a platform for interacting with AI-generated characters. You agree to use the service in a responsible and respectful manner.</p>
            
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mt-4">Prohibited Activities:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Using the service for illegal purposes or in violation of local laws.</li>
              <li>Attempting to bypass security measures or exploit vulnerabilities.</li>
              <li>Uploading or generating content that is illegal, harmful, or violates others' rights.</li>
              <li>Using automated systems (bots, scrapers) to access the service without permission.</li>
              <li>Impersonating others or misrepresenting your identity.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.contentAndAI")}</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              All interactions on Dintype are with Artificial Intelligence (AI). The characters are fictional and do not represent real people.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>AI Nature:</strong> AI-generated content can be unpredictable. We do not guarantee the accuracy, suitability, or quality of AI responses.</li>
              <li><strong>User Content:</strong> You retain ownership of content you upload, but you grant Dintype a license to use it to provide and improve the service.</li>
              <li><strong>Moderation:</strong> We reserve the right to monitor and remove content that violates our guidelines or is deemed inappropriate.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.premiumAndPayments")}</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Dintype offers premium features through paid subscriptions.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Fees:</strong> Subscription fees are clearly stated at the time of purchase.</li>
              <li><strong>Billing:</strong> By subscribing, you authorize us to charge the applicable fees via our payment provider.</li>
              <li><strong>Refunds:</strong> Since the service provides immediate access to digital content, refunds are generally not offered unless required by law.</li>
              <li><strong>Cancellation:</strong> You can cancel your subscription at any time through your account settings.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.intellectualProperty")}</h2>
          <p>
            All materials on Dintype, including brand name, logo, design, software, and AI models, are owned by us or our licensors and are protected by intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.privacyAndData")}</h2>
          <p>
            Your privacy is important to us. How we collect, use, and protect your data is described in our 
            <a href="/privacy-policy" className="text-primary hover:underline mx-1">Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.limitation")}</h2>
          <p>
            Dintype is provided "as is" and "as available". To the maximum extent permitted by law, we are not liable for direct, indirect, or incidental damages resulting from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.changesToTerms")}</h2>
          <p>
            We reserve the right to modify these terms at any time. Significant changes will be communicated via the website or email. Continued use of the service after such changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">{t("terms.contactUs")}</h2>
          <p>
            If you have questions about these terms, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-semibold">Dintype Support</p>
            <p>Email: <a href="mailto:support@dintype.se" className="text-primary hover:underline">support@dintype.se</a></p>
          </div>
        </section>

        <div className="text-sm text-zinc-500 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
