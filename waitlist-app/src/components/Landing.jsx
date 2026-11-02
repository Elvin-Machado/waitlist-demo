"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaShieldAlt,
  FaFingerprint,
  FaGlobeAmericas,
  FaChartLine,
  FaSearchDollar,
  FaGraduationCap,
} from "react-icons/fa";

const CHIPS = [
  { label: "KYC", icon: <FaFingerprint />, className: "k-chip--1", delay: 0.55 },
  { label: "AML", icon: <FaShieldAlt />, className: "k-chip--2", delay: 0.68 },
  { label: "Sanctions", icon: <FaGlobeAmericas />, className: "k-chip--3", delay: 0.8 },
  { label: "Analytics", icon: <FaChartLine />, className: "k-chip--4", delay: 0.92 },
  { label: "Investigation", icon: <FaSearchDollar />, className: "k-chip--5", delay: 1.04 },
  { label: "Education", icon: <FaGraduationCap />, className: "k-chip--6", delay: 1.14 },
];



export default function LandingPage() {
  const reduce = useReducedMotion();

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.85,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        };

  return (
    <section className="k-hero" id="home">
      
      <div className="k-hero-grid" aria-hidden="true" />
      <div className="k-hero-glow k-hero-glow--blue" aria-hidden="true" />
      <div className="k-hero-glow k-hero-glow--amber" aria-hidden="true" />

      <div className="k-hero-inner">
        <div className="k-hero-copy">
          

          <motion.h1 className="k-hero-title" {...fade(0.14)}>
            <span>KAWS</span>
            <span className="accent">Academy</span>
          </motion.h1>

          <motion.p className="k-hero-lead" {...fade(0.26)}>
            Building the next generation of compliance and financial crime
            professionals.
          </motion.p>

          <motion.p className="k-hero-sub" {...fade(0.36)}>
            Discover knowledge, develop practical expertise and prepare yourself
            for opportunities in the evolving world of financial crime,
            compliance and professional education.
          </motion.p>

          <motion.div className="k-hero-ctas" {...fade(0.46)}>
            <a href="#domains" className="k-btn">
              Explore Domains
              <FaArrowRight size={13} />
            </a>
            <Link
              href="/waitlist"
              className="k-btn k-btn--outline-light"
            >
              Join the Waitlist
            </Link>
          </motion.div>

          <motion.div className="k-hero-stats" {...fade(0.58)}>
            <div className="k-hero-stat">
              <strong>100+</strong>
              <span>Modules</span>
            </div>
            <div className="k-hero-stat-divider" aria-hidden="true" />
            <div className="k-hero-stat">
              <strong>12</strong>
              <span>Domains</span>
            </div>
            <div className="k-hero-stat-divider" aria-hidden="true" />
            <div className="k-hero-stat">
              <strong>6+</strong>
              <span>Years Expertise</span>
            </div>
          </motion.div>
        </div>

        <div className="k-hero-visual">
          <svg
            className="k-hero-scribble"
            viewBox="0 0 180 120"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 96C34 26 74 8 96 34c22 26-18 54-32 32-14-22 40-46 74-24 20 13 28 38 36 52"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="5 7"
            />
          </svg>

          <motion.div
            className="k-hero-medallion"
            initial={reduce ? false : { opacity: 0, scale: 0.88 }}
            animate={reduce ? false : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/logo_edt.png"
              alt="KAWS Academy emblem"
              className="k-hero-logo"
              animate={
                reduce
                  ? undefined
                  : { y: [0, -10, 0] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 7, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </motion.div>

          {CHIPS.map((chip) => (
            <motion.span
              key={chip.label}
              className={`k-chip ${chip.className}`}
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
              animate={reduce ? false : { opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: chip.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {chip.icon}
              {chip.label}
            </motion.span>
          ))}
        </div>
      </div>

     
    </section>
  );
}
