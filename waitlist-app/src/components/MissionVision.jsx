"use client";

import { FaBullseye, FaEye } from "react-icons/fa";
import Reveal from "./Reveal";

export default function MissionVision() {
  return (
    <section className="k-section k-mv" id="mission">
      <div className="k-container">
        <div className="k-mv-head">
          <Reveal>
            <span className="k-eyebrow">What Drives Us</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="k-display">
              A clear purpose. <em>A shared future.</em>
            </h2>
          </Reveal>
        </div>

        <div className="k-mv-grid">
          <Reveal className="k-mv-panel k-mv-panel--mission" delay={0.05}>
            <span className="k-mv-panel-num">01 / Mission</span>
            <div className="k-mv-panel-icon">
              <FaBullseye />
            </div>
            <h3>Our Mission</h3>
            <p>
              To close the gap between academic theory and real-world financial
              crime compliance by providing structured, hands-on training — so
              every learner can step into a professional role with knowledge,
              practical skill and confidence.
            </p>
          </Reveal>

          <Reveal className="k-mv-panel k-mv-panel--vision" delay={0.16}>
            <span className="k-mv-panel-num">02 / Vision</span>
            <div className="k-mv-panel-icon">
              <FaEye />
            </div>
            <h3>Our Vision</h3>
            <p>
              A compliance profession where practical preparation is the
              starting point, not an afterthought — and where ambitious learners
              from any background can build credible, confident careers in
              financial crime and compliance.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.24}>
          <div className="k-mv-connector">Learn · Develop · Lead</div>
        </Reveal>
      </div>
    </section>
  );
}
