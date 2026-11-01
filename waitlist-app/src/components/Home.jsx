"use client";

import { useEffect } from "react";
import Footer from "./Footer";
import LandingPage from "./Landing";
import About from "./About";
import MissionVision from "./MissionVision";
import WhatWeProvide from "./WhatWeProvide";
import Domains from "./Domains";
import LearningApproach from "./LearningApproach";
import Team from "./Team";
import FinalCTA from "./FinalCTA";

export default function Home() {
  // Honour hash links when arriving from another route (e.g. /#domains).
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash?.replace("#", "");
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      });
    };

    const timer = window.setTimeout(scrollToHash, 90);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <main className="k-main">
      <LandingPage />
      <About />
      <MissionVision />
      <WhatWeProvide />
      <Domains />
      <LearningApproach />
      <Team />
      <FinalCTA />
      <Footer />
    </main>
  );
}
