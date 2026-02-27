import { Metadata } from "next";
import { ContactContent } from "./content";

export const metadata: Metadata = {
  title: "Contact Us | Dintype",
  description: "Have questions or need help? Don't hesitate to contact us! We are here to provide support, answer your questions, and help you get the most out of your experience.",
};

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  return <ContactContent />;
}
