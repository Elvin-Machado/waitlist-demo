"use client";

import { FaBookOpen, FaTools, FaFlag } from "react-icons/fa";
import Reveal from "./Reveal";

const FEATURES = [
  {
    icon: <FaBookOpen />,
    word: "Learn",
    text: "Structured learning, domain knowledge and educational resources — organised around the frameworks and concepts that shape financial crime compliance.",
    tags: ["Structured programmes", "Domain depth", "Resources"],
  },
  {
    icon: <FaTools />,
    word: "Develop",
    text: "Practical skills, professional development and industry-oriented learning that turns understanding into techniques you can apply in a working environment.",
    tags: ["Simulation lab", "Live sessions", "Skill building"],
  },
  {
    icon: <FaFlag />,
    word: "Lead",
    text: "Confidence, professional readiness and the ability to contribute to the industry — supported by interview preparation and career-focused guidance.",
    tags: ["Career accelerator", "Interview prep", "Professional branding"],
  },
];

export default function WhatWeProvide() {
  return (
    <section className="k-section k-provide" id="provide">
      <div className="k-container">
        <div className="k-provide-head">
          <div>
            <Reveal>
              <span className="k-eyebrow">What We Provide</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="k-display">
                Three stages. <em>One professional journey.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="k-body">
              From first principles to professional confidence, every part of the
              Academy is built to move you forward.
            </p>
          </Reveal>
        </div>

        <div className="k-provide-grid">
          {FEATURES.map((feature, index) => (
            <Reveal
              key={feature.word}
              className="k-provide-card"
              delay={index * 0.1}
            >
              <div className="k-provide-icon">{feature.icon}</div>
              <h3 className="k-provide-word">{feature.word}</h3>
              <p>{feature.text}</p>
              <div className="k-provide-tags">
                {feature.tags.map((tag) => (
                  <span key={tag} className="k-provide-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
