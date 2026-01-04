import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reporting and Complaints – Content Policy | Pocketlove",
  description: "Learn how you can report inappropriate content or file a complaint on Pocketlove. We take responsibility for safety and swift handling.",
};

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">Reporting and Content Complaints Policy</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          At Pocketlove, we strive to foster a safe, respectful, and lawful environment for all our users. Your attention in reporting content that you believe to be illegal, harmful, or in violation of our <a href="/terms" className="text-primary hover:underline">Terms of Use</a> and <a href="/guidelines" className="text-primary hover:underline">Community Guidelines</a> is crucial to achieving this goal. We encourage you to report any such content you encounter.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">What to Report?</h2>
          <p>Please report content that falls within, but is not limited to, the following categories:</p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Illegal Content:</strong> Content that violates applicable local, national, or international laws and regulations.</li>
            <li><strong>Violations of Terms of Use:</strong> Content that contravenes any of the rules and guidelines described in our <a href="/terms" className="text-primary hover:underline">Terms of Use</a>.</li>
            <li><strong>Violations of Community Guidelines:</strong> Content that breaches the behavioral standards and content rules described in our <a href="/guidelines" className="text-primary hover:underline">Community Guidelines</a>, including but not limited to:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Hate speech, harassment, and discrimination</li>
                <li>Obscene, pornographic, or sexually explicit material (where prohibited)</li>
                <li>Violent or threatening content</li>
                <li>Spam or unauthorized advertising</li>
                <li>Intellectual property infringement</li>
                <li>Impersonation</li>
                <li>Content that exploits, abuses, or endangers children</li>
                <li>False information or disinformation (where explicitly prohibited)</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">How to Submit a Report or Complaint</h2>
          <p>To help us investigate and resolve your report effectively, please provide as many details as possible. You can typically submit a report via the following methods:</p>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">In-Platform Reporting:</h3>
          <p>
            Look for a "Report" button, link, or flag icon near the content in question. This is the most efficient way to submit a report as it often includes contextual information. Follow the on-screen instructions to provide details about the issue.
          </p>

          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">Contact Support:</h3>
          <p>
            If you cannot find an in-platform reporting option or have a more complex issue to report, please contact our dedicated support team at <a href="mailto:support@pocketlove.ai" className="text-primary hover:underline">support@pocketlove.ai</a>. When contacting us, please include the following information:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Your Full Name and Email:</strong> This allows us to contact you for clarifications or updates.</li>
            <li><strong>Clear Description of the Issue:</strong> Be specific about the content or behavior you are reporting and why you believe it violates our policies or is illegal. Include the exact location of the content (e.g., URL, username, post ID).</li>
            <li><strong>Date and Time of Occurrence (if applicable):</strong> This helps us locate the specific content or activity.</li>
            <li><strong>Supporting Documentation (if applicable):</strong> Include screenshots, links, or other evidence that supports your report. Ensure screenshots are clear and show the full context.</li>
            <li><strong>Category of Violation:</strong> If possible, specify which particular rule or guideline you believe has been violated.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">What Happens After You Submit a Complaint?</h2>
          <p>Once your complaint has been submitted, you can expect the following:</p>

          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">Acknowledgement:</h3>
              <p>
                Our customer support team will acknowledge receipt of your report within 24 hours via email to the address you provided. This acknowledgement indicates that your report has been received and is being processed.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">Review and Investigation:</h3>
              <p>
                Our dedicated moderation team will carefully review the reported content and any provided information. We aim to conduct this review impartially and in accordance with our policies and applicable laws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">Actions Taken:</h3>
              <p>Based on the findings of our review, one or more of the following actions may be taken:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Removal or Modification of Content:</strong> If the content is found to violate our policies or laws, it will be immediately removed or modified.</li>
                <li><strong>Account Actions:</strong> Depending on the severity of the violation, we may issue warnings, temporarily suspend account access, or permanently terminate accounts.</li>
                <li><strong>No Action:</strong> If the review determines that the reported content does not violate our policies, it may remain available.</li>
                <li><strong>Escalation to Legal Authorities:</strong> In cases involving potentially illegal activity, we may escalate the matter to appropriate authorities.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">Resolution Timeline:</h3>
              <p>
                We strive to review and resolve all complaints within seven (7) business days from the date of receipt. However, the complexity of the case and the volume of reports may sometimes require a longer investigation period. We appreciate your patience and understanding in such situations.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Important Considerations</h2>

          <div className="bg-muted/50 p-6 rounded-lg space-y-4 text-zinc-600 dark:text-zinc-400">
            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">False Reporting:</h3>
              <p>
                Please note that intentional submission of false or misleading reports is a violation of our terms and may lead to actions against your own account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">Objectivity:</h3>
              <p>
                Our review process is designed to be objective and based on our established policies and legal requirements.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">Continuous Improvement:</h3>
              <p>
                We continuously evaluate and improve our reporting and moderation processes to ensure effectiveness and fairness.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Your commitment to reporting inappropriate content is invaluable in helping us maintain a safe and respectful platform for everyone. Thank you for your cooperation and for contributing to a positive user experience on Pocketlove.
          </p>
        </section>

        <section className="mt-12 bg-primary/10 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Need to Report Something?</h2>
          <p className="mb-4">Contact our support team directly:</p>
          <a
            href="mailto:support@pocketlove.ai"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Send Report to support@pocketlove.ai
          </a>
        </section>
      </div>
    </div>
  );
}
