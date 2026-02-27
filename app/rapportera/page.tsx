import { Metadata } from "next";
import { ReportContent } from "./content";

export const metadata: Metadata = {
  title: "Reporting and Complaints – Content Policy | Dintype",
  description: "Learn how you can report inappropriate content or file a complaint on Dintype. We take responsibility for safety and swift handling.",
};

export const dynamic = 'force-dynamic';

export default function ReportPage() {
  return <ReportContent />;
}
