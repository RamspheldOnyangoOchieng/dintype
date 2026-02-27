import { Metadata } from "next";
import { PrivacyPolicyContent } from "./content";

export const metadata: Metadata = {
  title: "Privacy Policy | Dintype",
  description: "Your privacy is important to us. Read how Dintype collects, uses, and protects your personal data according to GDPR.",
};

export const dynamic = 'force-dynamic';

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
