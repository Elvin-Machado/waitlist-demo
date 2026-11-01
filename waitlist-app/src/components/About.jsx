"use client";

import { FaLayerGroup, FaTools, FaUserGraduate } from "react-icons/fa";
import Reveal from "./Reveal";

const PILLARS = [
  {
    icon: <FaLayerGroup />,
    title: "Structured knowledge",
    text: "Learning organised around how compliance work is actually done.",
  },
  {
    icon: <FaTools />,
    title: "Practical application",
    text: "Real-world scenarios, simulation and professional techniques.",
  },
  {
    icon: <FaUserGraduate />,
    title: "Career readiness",
    text: "Preparation for opportunities in financial crime and compliance.",
  },
];

export default function About() {
  return (
    <section className="k-section k-about" id="about">
      <div className="k-container">
        <div className="k-about-grid">
          <div className="k-about-copy">
            <Reveal>
              <span className="k-eyebrow">About the Academy</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="k-display">
                More Than Learning. <br />
                <em>Building Professional Futures.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="k-body">
                KAWS Academy exists to simplify financial crime compliance — and
                to make it learnable. We bridge the gap between academic theory
                and the real-world work of compliance teams through practical
                learning, real-world insight and career-focused guidance.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="k-body">
                In an evolving regulatory landscape, we provide structured,
                hands-on training that empowers learners to step into global
                banking roles with confidence. Our ecosystem serves students,
                early-career professionals and practitioners moving into
                compliance, financial crime and risk — anyone who wants
                knowledge they can use on the job, not just in an exam.
              </p>
            </Reveal>

            <ul className="k-about-pillars">
              {PILLARS.map((pillar, index) => (
                <Reveal as="li" key={pillar.title} delay={0.1 + index * 0.08} className="k-about-pillar">
                  <span className="k-about-pillar-icon">{pillar.icon}</span>
                  <span>
                    <strong>{pillar.title}</strong>
                    <span>{pillar.text}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="k-about-visual">
            <div className="k-about-blob" aria-hidden="true" />
            <div className="k-about-dots" aria-hidden="true" />
            <Reveal className="k-about-card" delay={0.1} duration={0.9}>
              <img src="/kaws.png" alt="KAWS Academy identity" loading="lazy" />
            </Reveal>
            <Reveal delay={0.3} className="k-about-badge">
              <strong>6+</strong>
              <span>Years of industry expertise</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
