import { Metadata } from "next";
import { GuideContent } from "./content";

export const metadata: Metadata = {
  title: "Guide - User Guide | Dintype",
  description: "Complete guide to getting started with Dintype. Learn how to create AI characters, chat, generate images, and much more.",
};

export const dynamic = 'force-dynamic';

export default function GuidePage() {
  return <GuideContent />;
}
