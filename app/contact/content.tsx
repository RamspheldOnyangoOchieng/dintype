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
          <h2 className="text-3xl font-semibold mt-12 mb-6 text-zinc-800 dark:text-white">How can we help you today?</h2>
          <p>Our knowledgeable support team can assist you with a wide variety of topics, including:</p>

          <div className="space-y-6 mt-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.accountHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Troubleshooting login issues (e.g., password reset, account recovery)</li>
                <li>Guidance on managing your profile settings and customizing your account</li>
                <li>Assistance with account verification processes</li>
                <li>Help with updating your account information</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.technicalHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Resolving technical issues, bugs, or performance problems on our website, in our app(s), or in our services</li>
                <li>Providing guidance on browser and app compatibility</li>
                <li>Assisting with troubleshooting error messages</li>
                <li>Offering solutions for connectivity problems</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.billingHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clarifying transaction details and billing cycles</li>
                <li>Providing information about our subscription plans and pricing</li>
                <li>Answering questions related to payment methods and processing</li>
                <li>Handling inquiries regarding potential refunds</li>
                <li>Helping to manage or cancel your subscriptions</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.safetyHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing clarifications on our <a href="/terms" className="text-primary hover:underline">Terms of Use</a> and <a href="/guidelines" className="text-primary hover:underline">Community Guidelines</a></li>
                <li>Handling reports and complaints about user-generated content or behavior (see our <a href="/report" className="text-primary hover:underline">Complaints and Reports Policy</a>)</li>
                <li>Answering questions about content moderation processes</li>
                <li>Guiding you on how to report violations</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.generalHelp")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing information on how to use specific features of Dintype (e.g., AI character creation, image generation, chat features)</li>
                <li>Offering tips and tricks to improve your experience</li>
                <li>Answering questions about feature limitations or updates</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-12 mb-6 text-zinc-800 dark:text-white">How to Contact Us</h2>
          <p>We offer several convenient ways to reach our support team:</p>

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
                We strive to respond to all email inquiries within 24 hours.
              </p>
            </div>

            <div className="border border-border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">💬 Live Chat</h3>
              <p>
                For quick questions and real-time help, our Live Chat feature is often available on our website and in our app(s). Look for the chat icon in the bottom right corner of the screen.
              </p>
            </div>

            <div className="border border-border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">{t("contact.visitFaq")}</h3>
              <p>
                {t("contact.visitFaqDesc")}{" "}
                <a href="/faq" className="text-primary hover:underline">Help Center or Frequently Asked Questions (FAQ) section</a>.
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
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">Quick acknowledgement</h3>
                <p className="text-sm text-muted-foreground">We aim to acknowledge all inquiries within 24 hours of receipt.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">Efficient and effective assistance</h3>
                <p className="text-sm text-muted-foreground">Our team is dedicated to providing you with accurate and helpful solutions as quickly as possible.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">Professional and respectful communication</h3>
                <p className="text-sm text-muted-foreground">You can expect to be treated with courtesy and respect by our support agents.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">Confidentiality</h3>
                <p className="text-sm text-muted-foreground">We handle your personal information and support inquiries with the utmost confidentiality, in accordance with our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl text-primary">✓</span>
              <div>
                <h3 className="font-semibold mb-1 text-zinc-800 dark:text-white">Impartiality</h3>
                <p className="text-sm text-muted-foreground">We strive to handle all matters fairly and impartially, in accordance with our policies and guidelines.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 bg-primary/10 p-8 rounded-lg">
          <h2 className="text-3xl font-semibold mb-6 text-zinc-800 dark:text-white">We value your feedback</h2>
          <p>
            Your feedback is essential in helping us improve our services and support. After interacting with our support team, you may receive a survey or be invited to share your experience. We encourage you to provide your honest feedback so we can continue to enhance our support services.
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
            Contact Support
          </a>
        </section>
      </div>
    </div>
  )
}
