import { Metadata } from "next";
import { HowItWorksContent } from "./content";

export const metadata: Metadata = {
  title: "How it Works | Dintype",
  description: "Learn how Dintype works - Create AI characters, chat, and generate images in a few simple steps.",
};

export const dynamic = 'force-dynamic';

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
