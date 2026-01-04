import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies – How we use cookies | Pocketlove",
  description: "Pocketlove.ai uses cookies to improve your experience. Learn more about the types of cookies we use and how you can manage your settings.",
};

export const dynamic = 'force-dynamic';

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">Cookie Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-sm text-muted-foreground">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br />
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <p className="text-zinc-600 dark:text-zinc-400">
          This Cookie Policy ("Policy") explains how Pocketlove ("we", "us", or "our") uses cookies and similar technologies on our website https://pocketlove.ai ("the Website").
        </p>
        
        <p className="text-zinc-600 dark:text-zinc-400">
          By using our Website, you agree to the use of cookies in accordance with this Policy. You can manage or withdraw your consent at any time by adjusting your cookie preferences.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">1. Who We Are</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            This website is operated by Pocketlove.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">2. What are Cookies?</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help the website remember your actions and preferences over time to improve your user experience. Cookies also enable analysis and targeted advertising.
          </p>
          
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">Cookies can be:</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Session Cookies:</strong> Deleted when you close your browser.</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device for a specified period or until manually deleted.</li>
            <li><strong>First-party Cookies:</strong> Set by us.</li>
            <li><strong>Third-party Cookies:</strong> Set by third-party services we use (e.g., Google Analytics, advertising platforms).</li>
          </ul>
          
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Cookies do not collect personal information directly, but in some cases, they can be linked to data that identifies you, especially when combined with other information (e.g., login status).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">3. Types of Cookies We Use</h2>

          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">A. Strictly Necessary Cookies</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                These cookies are crucial for the Website to function correctly. They:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 text-zinc-600 dark:text-zinc-400">
                <li>Enable basic functionality (e.g., page navigation, secure login)</li>
                <li>Cannot be disabled via the cookie banner</li>
                <li>Store no personally identifiable information</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">B. Functional Cookies</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                These cookies enhance functionality and customization by remembering your preferences and settings. They can:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 text-zinc-600 dark:text-zinc-400">
                <li>Store login details or language settings</li>
                <li>Remember your cookie consent choices</li>
                <li>Provide improved features tailored to your usage</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground italic">
                If disabled, some parts of the website may not function correctly.
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">C. Analytical / Performance Cookies</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Used to collect anonymous data about how users interact with the Website, helping us improve content and user experience. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 text-zinc-600 dark:text-zinc-400">
                <li>Google Analytics cookies</li>
                <li>Page visit tracking</li>
                <li>Insights into device and browser usage</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground italic">
                These cookies do not collect personal data and are only used to understand usage patterns.
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">D. Targeted / Advertising Cookies</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                These cookies track your browsing habits to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 text-zinc-600 dark:text-zinc-400">
                <li>Show relevant advertisements</li>
                <li>Limit the number of times you see an ad</li>
                <li>Measure the performance of advertising campaigns</li>
                <li>Prevent fraudulent activity</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground italic">
                They are only activated with your explicit consent.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">4. How to Manage Your Cookie Preferences</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            When you visit our Website for the first time, you will see a cookie banner that allows you to accept or customize cookie settings. Your preferences are stored in a consent management system.
          </p>
          
          <div className="bg-primary/10 p-6 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-white">You can:</h3>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Change your settings at any time by revisiting the cookie preferences link on the website.</li>
              <li>Delete or block cookies via your browser settings. Note, however, that some features on the website may not function as intended.</li>
            </ul>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground italic">
            <strong>Note:</strong> If you clear cookies or use a different device or browser, you will need to set your preferences again.
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
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">5. Data Protection</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We are committed to protecting your privacy. All data collected via cookies is handled in accordance with our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and applicable data protection laws, including the General Data Protection Regulation (GDPR).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">6. Policy Updates</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We may update this Policy from time to time to reflect changes in technology, legal requirements, or our business. Any updates will be published on this page with the new effective date.
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            We encourage you to review this page regularly to stay informed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">7. Contact Us</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            If you have questions about this Cookie Policy or want to exercise your data protection rights, you can contact us at:
          </p>
          <p className="mt-4">
            📧 Email: <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">support@pocketlove.ai</a>
          </p>
        </section>
      </div>
    </div>
  );
}
