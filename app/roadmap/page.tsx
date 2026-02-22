import { Metadata } from "next";
import { RoadmapContent } from "./content";

export const metadata: Metadata = {
  title: "Roadmap - Future Plans | Dintype",
  description: "View our product roadmap and upcoming features for Dintype. Discover what we are working on and what's coming next.",
};

export default function RoadmapPage() {
  return <RoadmapContent />;
}
