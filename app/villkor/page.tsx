import { Metadata } from "next";
import { TermsContent } from "./content";

export const metadata: Metadata = {
  title: "Rules and Terms of Use | Dintype",
  description: "Read our rules and terms to understand how Dintype works, what applies to usage, and how we protect your privacy.",
};

export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return <TermsContent />;
}
