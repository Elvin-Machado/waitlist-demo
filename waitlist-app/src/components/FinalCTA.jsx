"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Reveal from "./Reveal";

export default function FinalCTA() {
  return (
    <section className="k-final" id="join">
      <div className="k-final-grid" aria-hidden="true" />
      <div className="k-final-glow" aria-hidden="true" />

      <div className="k-container">
        <div className="k-final-inner">
          <Reveal>
            <span className="k-eyebrow k-eyebrow--light">Join the Academy</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="k-display">
              Your Journey Towards <em>Professional Excellence</em> Starts Here.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p>
              Take the first step towards developing the knowledge and skills to
              shape your professional future.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="k-final-ctas">
            <Link href="/waitlist" className="k-btn k-btn--light">
              Join the Waitlist
              <FaArrowRight size={13} />
            </Link>
            <a href="#domains" className="k-btn k-btn--outline-light">
              Explore Domains
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
