import type { Metadata } from "next";
import { profile } from "@/data/portfolio";
import { AboutLyrics } from "./AboutLyrics";

export const metadata: Metadata = { title: "About Me", description: `About ${profile.name}, in lyrics.` };

export default function AboutPage() {
  return <AboutLyrics />;
}
