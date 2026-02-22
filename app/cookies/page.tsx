import { Metadata } from "next";
import { CookiesContent } from "./content";

export const metadata: Metadata = {
  title: "Cookies – How we use cookies | Dintype",
  description: "Dintype.se uses cookies to improve your experience. Learn more about the types of cookies we use and how you can manage your settings.",
};

export const dynamic = 'force-dynamic';

export default function CookiesPage() {
  return <CookiesContent />;
}
