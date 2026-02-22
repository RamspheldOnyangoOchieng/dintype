import { Metadata } from "next";
import { GuidelinesContent } from "./content";

export const metadata: Metadata = {
  title: "Guidelines – Usage and Behavior on Dintype",
  description: "Read our guidelines on how you are expected to use Dintype. We promote respect, safety, and a positive experience for all users.",
};

export const dynamic = 'force-dynamic';

export default function GuidelinesPage() {
  return <GuidelinesContent />;
}
