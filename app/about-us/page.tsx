import { Metadata } from "next";
import { AboutUsContent } from "./content";

export const metadata: Metadata = {
  title: "About Us – Meet the team behind Dintype",
  description: "Get to know the team behind Dintype. Our vision is to create a safe, personal, and innovative AI experience for all users.",
};

export const dynamic = 'force-dynamic';

export default function AboutUsPage() {
  return <AboutUsContent />;
}
