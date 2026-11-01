"use client";

import {
  FaLayerGroup,
  FaFlask,
  FaRocket,
  FaBroadcastTower,
  FaLightbulb,
  FaBuilding,
} from "react-icons/fa";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: <FaLayerGroup />,
    title: "FCC Programs",
    text: "Structured programs designed to help learners build strong technical and practical skills.",
  },
  {
    icon: <FaFlask />,
    title: "Simulation Lab",
    text: "A hands-on learning environment where learners practice real-world scenarios and workflows.",
  },
  {
    icon: <FaRocket />,
    title: "Career Accelerator",
    text: "Focused training that prepares students for careers through projects, guidance and skill building.",
  },
  {
    icon: <FaBroadcastTower />,
    title: "CGKAA — Live Program",
    text: "Interactive live sessions that keep learners engaged and learning directly, in real time.",
  },
  {
    icon: <FaLightbulb />,
    title: "Insights",
    text: "Access valuable knowledge, updates and ideas that support continuous learning and growth.",
  },
  {
    icon: <FaBuilding />,
    title: "Corporate Training",
    text: "Professional training solutions designed for teams and organisations to upskill effectively.",
  },
];

export default function LearningApproach() {
  return (
    <section className="k-section k-approach" id="approach">
      <div className="k-container">
        <div className="k-approach-head">
          <Reveal>
            <span className="k-eyebrow k-eyebrow--light">Our Learning Approach</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="k-display">
              How we deliver <em>the experience.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="k-body">
              Learning at KAWS Academy combines structured programmes, practice
              and live guidance — so knowledge is applied, not just acquired.
            </p>
          </Reveal>
        </div>

        <div className="k-approach-grid">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              className="k-approach-item"
              delay={(index % 3) * 0.08}
            >
              <div className="k-approach-top">
                <span className="k-approach-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="k-approach-icon">{step.icon}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="k-approach-thread" aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
