import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Pocketlove",
  description: "Your privacy is important to us. Read how Pocketlove collects, uses, and protects your personal data according to GDPR.",
};

export const dynamic = 'force-dynamic';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">Privacy Policy</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-sm text-muted-foreground">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br />
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Welcome to Pocketlove. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains what personal data we collect, how we use it, who we share it with, and your rights under the EU General Data Protection Regulation (Regulation (EU) 2016/679, "GDPR").
        </p>

        <p className="text-zinc-600 dark:text-zinc-400">
          Please read this policy carefully. If you have questions, you are welcome to contact us via the details in the "Contact Us" section.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">1. Who We Are (Data Controller)</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            This website, https://pocketlove.ai, is the data controller for the processing of your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">2. What is Personal Data?</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            "Personal data" refers to any information relating to an identified or identifiable individual. This includes names, email addresses, IP addresses, and more.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Identifiable data:</strong> Includes names, email addresses, or IP addresses.</li>
            <li><strong>Pseudonymized data:</strong> Still considered personal data if they can be re-identified.</li>
            <li><strong>Anonymous data:</strong> Not considered personal data under GDPR.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">3. What Personal Data We Collect</h2>
          <p className="text-zinc-600 dark:text-zinc-400">We may collect the following types of data depending on your interaction with our website:</p>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">a. Visitors (without login)</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Device type, browser, and operating system</li>
            <li>IP address and time zone</li>
            <li>Website usage data (e.g., pages visited)</li>
            <li>Cookies and tracking technologies</li>
          </ul>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">b. Registered Users</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Email address and username</li>
            <li>Login credentials for Google or Patreon (email, profile picture)</li>
            <li>Profile details (avatar, settings)</li>
            <li>Generated content and chat history</li>
            <li>Communication history with our support team</li>
            <li>Usage data (e.g., most used features)</li>
            <li>Payment-related information (handled by third-party providers – we do not store card data)</li>
          </ul>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">c. Special Categories of Data (Sensitive)</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            If you voluntarily provide information about your sex life or sexual orientation when using our services, we will only process it with your explicit consent in accordance with Article 9(2)(a) of the GDPR. We do not share this data with third parties, and you control whether it is disclosed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">4. How We Collect Your Data</h2>
          <p className="text-zinc-600 dark:text-zinc-400">We collect your personal data through:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Direct interactions (e.g., registration, contacting support)</li>
            <li>Automated technologies (e.g., cookies, server logs)</li>
            <li>Third-party login integrations (e.g., Google, Patreon)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">5. Why We Process Your Data (Legal Basis)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-4 py-2 text-left text-zinc-800 dark:text-white">Purpose</th>
                  <th className="border border-border px-4 py-2 text-left text-zinc-800 dark:text-white">Legal Basis</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr>
                  <td className="border border-border px-4 py-2">Account registration and access</td>
                  <td className="border border-border px-4 py-2">Contractual Necessity</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Provide and improve our services</td>
                  <td className="border border-border px-4 py-2">Legitimate Interest</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Respond to inquiries</td>
                  <td className="border border-border px-4 py-2">Legitimate Interest or Consent</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Send updates and service communications</td>
                  <td className="border border-border px-4 py-2">Legitimate Interest</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Analyze usage to improve services</td>
                  <td className="border border-border px-4 py-2">Legitimate Interest</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Process special categories of data</td>
                  <td className="border border-border px-4 py-2">Explicit Consent</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Compliance with laws</td>
                  <td className="border border-border px-4 py-2">Legal Obligation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">6. Data Transfer and Sharing</h2>
          <p className="text-zinc-600 dark:text-zinc-400">We may share your data with trusted third-party service providers for:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Hosting and infrastructure</li>
            <li>Analytics and support tools</li>
            <li>Legal, accounting, or consulting services</li>
            <li>Payment processors (for transactions)</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            These third parties act on our instructions and are bound by data processing agreements to ensure your data remains secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">7. International Data Transfers</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your data is primarily processed within the European Economic Area (EEA). If we transfer your data outside the EEA, we will ensure that appropriate safeguards are in place, such as the EU Standard Contractual Clauses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">8. Data Security</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We implement industry-standard technical and organizational measures to protect data from unauthorized access, alteration, or loss. However, no system is 100% secure. In the event of a data breach, we will notify you and regulatory authorities in accordance with the law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">9. Children's Privacy</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Our services are not intended for persons under 18 years of age. We do not knowingly collect data from children. If we become aware of such data, we will delete it immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">10. Data Retention</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We retain your personal data only as long as necessary to provide our services, fulfill legal obligations, resolve disputes, and enforce agreements. When the data is no longer needed, we securely delete or anonymize it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">11. Your Rights</h2>
          <p className="text-zinc-600 dark:text-zinc-400">If you are within the EEA, UK, or Switzerland, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> Request deletion ("right to be forgotten")</li>
            <li><strong>Restrict processing:</strong> Ask us to limit how we use your data</li>
            <li><strong>Object to:</strong> Object to processing based on legitimate interest</li>
            <li><strong>Data portability:</strong> Receive your data in a machine-readable format</li>
            <li><strong>Withdraw consent:</strong> At any time without affecting previous processing</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            To exercise any of your rights, contact us at <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">support@pocketlove.ai</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">12. Contact Us</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            For questions about this policy or your personal data, please contact:<br />
            Email: <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">support@pocketlove.ai</a>
          </p>
        </section>
      </div>
    </div>
  );
}
