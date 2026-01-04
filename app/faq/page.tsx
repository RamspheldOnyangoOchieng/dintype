import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Pocketlove",
  description: "Need help or have questions? Visit our support section and FAQ where you find answers to common questions and helpful guides to optimize your experience.",
};

export const dynamic = 'force-dynamic';

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">Frequently Asked Questions: FAQ</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          Welcome to the Pocketlove FAQ! We have compiled a list of common questions to help you understand our platform and get the most out of your experience. If you can't find the answer you're looking for, don't hesitate to contact our support team at{" "}
          <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">
            support@pocketlove.ai
          </a>
        </p>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">Getting Started with Pocketlove</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">What is Pocketlove?</h3>
              <p>
                Pocketlove is an innovative platform that allows you to create unique AI characters and engage in interactive conversations with them using generative artificial intelligence. You can customize your experience and explore creative interactions. Additionally, Pocketlove offers an AI-powered feature for image generation based on your text descriptions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">How does your platform work?</h3>
              <p>
                Our platform uses advanced AI models to understand your text inputs and generate relevant and engaging responses from your AI characters. For image generation, you provide text prompts, and our AI creates visual content based on those descriptions. Our systems also include content moderation to ensure a safe and respectful environment.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Is your service free to use?</h3>
              <p>
                Pocketlove offers both free and premium features. The free version may have limitations in usage, the number of AI interactions, or access to certain features. Our premium subscription unlocks additional benefits and removes these limitations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">What is a premium subscription and what does it cost?</h3>
              <p>
                Our premium subscription offers enhanced features such as unlimited messages, faster response times, access to exclusive features, and higher limits for image generation. You can find detailed pricing information on our premium page.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">How do I create an account?</h3>
              <p>Creating an account on Pocketlove is easy! You can register using one of the following methods:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Social Login:</strong> Log in quickly using your existing Discord or Google account.</li>
                <li><strong>Email Registration:</strong> Register with a valid email address and create a secure password. You will typically need to verify your email address after registration.</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">Your AI Characters and Interactions</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Can I customize my AI character?</h3>
              <p>
                Yes, Pocketlove allows you to customize your AI characters. You can typically define various aspects such as name, personality traits, backstory, and interests. The degree of customization may vary depending on the specific features offered.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Can I ask for photos in the chat?</h3>
              <p>
                The ability to request and receive photos in the chat interface with your AI character is a feature of Pocketlove. Please refer to the specific features available in the chat interface. Keep in mind that all generated content is subject to our content moderation policies to ensure safety and appropriateness.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Are images generated in real-time?</h3>
              <p>
                Generation time for images can vary depending on the complexity of your request and current system load. While we strive for fast generation, it may not always be instantaneous.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">Account and Subscription Management</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">How do I pay for the premium subscription?</h3>
              <p>
                You can pay for the premium subscription via our website or app using the available payment methods. You typically choose a subscription length (e.g., monthly, annually) and provide your payment details during the checkout process.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">What payment methods do you use?</h3>
              <p>We accept a variety of payment methods, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Credit and debit cards (Visa, MasterCard, American Express)</li>
                <li>PayPal, Google Pay, Apple Pay</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Note that the availability of specific payment methods may vary depending on your region.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">How do I cancel my subscription?</h3>
              <p>You can cancel your subscription at any time using one of the following methods:</p>

              <div className="bg-muted/50 p-4 rounded-lg mt-4 space-y-3">
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-white">Method 1: Quick Access</p>
                  <p className="text-sm">Click here to go directly to your profile settings and manage your subscription.</p>
                </div>

                <div>
                  <p className="font-semibold text-zinc-800 dark:text-white">Method 2: Self-Service Navigation</p>
                  <ol className="list-decimal pl-6 space-y-1 text-sm mt-2">
                    <li>Open My Account menu (typically found in the top right corner or in the app's navigation menu)</li>
                    <li>Click on Profile or Account Settings</li>
                    <li>Under the section describing your current plan, click "Unsubscribe" or "Cancel Subscription"</li>
                    <li>Follow the on-screen instructions to confirm your cancellation</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold text-zinc-800 dark:text-white">Method 3: Contact Support</p>
                  <p className="text-sm">
                    Alternatively, you can email our support team at{" "}
                    <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">
                      support@pocketlove.ai
                    </a>{" "}
                    to request cancellation of your subscription.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground italic">
                <strong>Effect of Cancellation:</strong> Your access to premium features continues until the end of your current billing period. You will not receive a refund for the unused portion of your subscription.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">How do I delete my account?</h3>
              <p>You can permanently delete your Pocketlove account via your account settings. Follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Go to your Profile or Account Settings</li>
                <li>Look for an option like "Delete account", "Close account", or similar</li>
                <li>Read the information carefully, as this action is irreversible and will result in a permanent loss of your data</li>
                <li>Confirm that you want to proceed with the deletion of the account</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">Privacy and Security</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Is it safe to use your platform?</h3>
              <p>Yes, our users' safety is a top priority. We implement various measures to ensure a safe and respectful environment, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Content Moderation:</strong> We use both automated and manual moderation systems to detect and remove inappropriate content and behavior.</li>
                <li><strong>Reporting Tools:</strong> We provide users with tools to easily report content that violates our <a href="/guidelines" className="text-primary hover:underline">Community Guidelines</a>.</li>
                <li><strong>Data Security:</strong> We use security measures to protect your personal data. See our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> for more information.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Are my conversations truly private?</h3>
              <p>
                We understand the importance of privacy. Your direct conversations with your AI characters are generally considered private to you. However, keep in mind that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Our systems may process and store these conversations for the purpose of providing and improving the service, including training AI models.</li>
                <li>In some cases, to comply with legal obligations or address safety concerns, we may need to access and review conversations.</li>
              </ul>
              <p className="mt-2">
                Please refer to our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> for a comprehensive explanation of how we handle your communication.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Can other users access my chats?</h3>
              <p>
                Generally, other users cannot directly access your private conversations with your AI characters. Our system is designed to keep these interactions private to you. However, if you choose to share your conversations or content publicly via the features we offer, that information may become available to others.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">How do you handle my personal data?</h3>
              <p>
                We are committed to protecting your personal data in accordance with applicable data protection laws. Our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> provides detailed information on:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>What types of personal data we collect</li>
                <li>How we use your personal data</li>
                <li>How we store and protect your personal data</li>
                <li>Your rights regarding your personal data</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">How do I report inappropriate content?</h3>
              <p>
                We encourage our users to help us maintain a safe and respectful community. If you encounter content that violates our <a href="/guidelines" className="text-primary hover:underline">Community Guidelines</a>, please report it immediately:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>In-app Reporting:</strong> Click the "Report" button near the content</li>
                <li><strong>Contact Support:</strong> Email us at <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">support@pocketlove.ai</a></li>
              </ul>
              <p className="mt-2">
                Read more in our <a href="/report" className="text-primary hover:underline">Reporting and Complaints Policy</a>.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">Billing and Refunds</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Do you offer refunds?</h3>
              <p>
                Generally, due to the nature of our services and immediate access to premium features, we do not offer refunds for subscription fees or purchases, unless required by applicable consumer protection laws. We may offer a free trial or a limited free version so you can evaluate our services before committing to a paid subscription.
              </p>
              <p className="mt-2">
                Please review our <a href="/terms" className="text-primary hover:underline">Refund Policy in our Terms of Use</a> for detailed information.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mt-12 mb-6">Technical Issues and Support</h2>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">What should I do if I encounter a technical issue?</h3>
              <p>If you experience any technical difficulties while using Pocketlove, please try the following steps:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Check your internet connection</li>
                <li>Ensure your app or browser is updated to the latest version</li>
                <li>Try clearing your browser's cache and cookies or the app's cache</li>
                <li>Restart the app or your browser</li>
              </ol>
              <p className="mt-4">
                If the problem persists, please contact our support team at{" "}
                <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">
                  support@pocketlove.ai
                </a>{" "}
                with a detailed description of the issue, including any error messages you see, the steps you took when the problem occurred, and information about your device/browser.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 bg-primary/10 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Have more questions?</h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            We hope this FAQ page has been helpful! If you have further questions or need help, don't hesitate to contact our support team.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:support@pocketlove.ai"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              More Contact Options
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Thank you for being part of the Pocketlove community!
          </p>
        </section>
      </div>
    </div>
  );
}
