import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guidelines – Usage and Behavior on Pocketlove",
  description: "Read our guidelines on how you are expected to use Pocketlove. We promote respect, safety, and a positive experience for all users.",
};

export const dynamic = 'force-dynamic';

export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">Community Guidelines</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          Our goal is to provide a safe, respectful place where users can enjoy exciting, creative, and fun conversations with virtual chatbots. To help maintain this environment, we kindly ask all users to follow these guidelines.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Age Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>All users must be at least <strong>18 years old</strong>.</li>
            <li>All chatbots created on the platform must be portrayed as adults over 18. If this is not obvious, please specify the age in the chatbot's Personality.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Illegal Activities and Criminal Behavior</h2>
          <p>The following are strictly prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Commercial sexual activities (including prostitution)</li>
            <li>Human trafficking</li>
            <li>Sexual exploitation and pornography (including child pornography)</li>
            <li>Soliciting or promoting criminal activity</li>
            <li>Exploitation of child labor</li>
            <li>Promotion of illegal drugs or abuse</li>
            <li>Promotion of illegal weapons</li>
            <li>Use of the service for phishing, scams, or account hijacking</li>
            <li>Distribution of or discussion about cannibalism</li>
            <li>Violation of local, national, or international laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Child Exploitation and Protection of Minors</h2>
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 my-4">
            <p className="font-semibold text-destructive">Zero Tolerance:</p>
            <p className="text-destructive">We have zero tolerance for any content that involves or exploits minors.</p>
          </div>
          <p>Strictly prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Creation or depiction of minor characters (realistic, fictional, AI-generated, or "aged-up")</li>
            <li>Sharing of sexualized or exploitative material involving minors (including drawings, art, or AI-generated images)</li>
            <li>Any content that harms, lures, or endangers minors</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Sexual Content Restrictions</h2>
          <p>The following types of sexual content are prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Explicit images showing real or realistic nudity or sexual acts</li>
            <li>Overt or implied sexual acts, unless they are clearly fictionalized and within permitted contexts</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mt-6 mb-3">Prohibited fetish content involving:</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Death or serious injury to humans or animals</li>
            <li>Amputation, dismemberment</li>
            <li>Cannibalism</li>
            <li>Body fluids (feces, urine, semen, saliva, mucus, menstrual blood, vomit)</li>
            <li>Bestiality (real animals)</li>
            <li>Non-consensual sexual acts (rape, sexual assault, sextortion, revenge porn, etc.)</li>
            <li>Incest (including non-blood-related scenarios, like step-relationships)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Violence and Harm</h2>
          <p>Prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Incitement to, glorification of, or depiction of violence, murder, or terrorism</li>
            <li>Threats of physical harm or violence</li>
            <li>Promotion or encouragement of self-harm, suicide, eating disorders, or substance abuse</li>
            <li>Depictions of gore and entrails, animal death, or intense violence</li>
            <li>Discussions encouraging or promoting necrophilia</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Hate Speech and Discrimination</h2>
          <p>Content that promotes hate or violence against individuals or groups based on the following is prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Race or ethnicity</li>
            <li>Nationality</li>
            <li>Religion</li>
            <li>Disability</li>
            <li>Gender or gender identity</li>
            <li>Sexual orientation</li>
            <li>Age or veteran status</li>
          </ul>
          <p className="mt-4">
            Idolization or glorification of hate figures (e.g., Adolf Hitler, Josef Stalin, Pol Pot) is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Privacy, Fraud, and Impersonation</h2>
          <p>Prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Sharing others' personal or confidential information without consent</li>
            <li>Impersonation of real individuals, including celebrities or public figures</li>
            <li>Uploading real images or AI-generated images that resemble real individuals without consent</li>
            <li>Use of the service for fraudulent behavior (false information, multiple accounts, fake identities)</li>
            <li>Soliciting payments from users under fraudulent pretexts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Misinformation and Political Interference</h2>
          <p>Prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Posting false information that could lead to violence, harm, or disrupt political processes</li>
            <li>Discussions of political views or religious and spiritual beliefs (explicitly prohibited topics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Spam and Irrelevant Content</h2>
          <p>Prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Spam, including sending unsolicited promotional, commercial, or mass messages</li>
            <li>Generation of meaningless, irrelevant, or purposeless content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mt-8 mb-4">Restricted Goods and Transactions</h2>
          <p>Advertising or attempting to trade in regulated or restricted goods is prohibited.</p>
        </section>

        <section className="mt-12 bg-primary/10 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Report Violations</h2>
          <p className="mb-4">
            If you encounter content that violates these guidelines, please report it immediately. Together we can maintain a safe and respectful environment for all users.
          </p>
          <div className="flex gap-4">
            <a 
              href="/report" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Report Content
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Contact Support
            </a>
          </div>
        </section>

        <p className="mt-8 text-sm text-muted-foreground text-zinc-500">
          By using Pocketlove, you agree to abide by these Community Guidelines. Violating these guidelines may lead to warnings, temporary suspension, or permanent termination of your account.
        </p>
      </div>
    </div>
  );
}
