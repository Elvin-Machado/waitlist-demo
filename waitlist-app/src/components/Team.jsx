"use client";

import Reveal from "./Reveal";

export default function Team() {
  return (
    <section className="k-section k-team" id="team">
      <div className="k-container">
        <div className="k-team-head">
          <div>
            <Reveal>
              <span className="k-eyebrow">Meet Our Team</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="k-display">
                Practitioners who <em>teach what they do.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="k-body" style={{ maxWidth: "34ch" }}>
              The Academy is led by people who work in financial crime and
              compliance — and who understand what the job demands.
            </p>
          </Reveal>
        </div>

        <div className="k-team-grid">
          <Reveal className="k-team-feature" duration={0.85}>
            <div className="k-team-photo-wrap">
              <img
                src="/sid.jpeg"
                alt="Siddarth Shenoy, Founder and CEO of KAWS Academy"
                loading="lazy"
              />
            </div>
            <div className="k-team-info">
              <span className="k-team-role">Founder &amp; CEO</span>
              <h3 className="k-team-name">Siddarth Shenoy</h3>
              <p className="k-team-bio">
                With over six years of experience in AML, KYC and financial crime
                operations, Siddarth founded KAWS Academy to make complex
                compliance domains practical and accessible.
              </p>
              <blockquote className="k-team-quote">
                “I’ve seen firsthand the need for practical knowledge. My mission
                is to simplify these complex domains and open doors for the next
                generation of compliance professionals.”
              </blockquote>
            </div>
          </Reveal>

          <div className="k-team-side">
            <Reveal className="k-team-card" delay={0.12}>
              <div className="k-team-monogram" aria-hidden="true">
                SE
              </div>
              <span className="k-team-card-role">Leadership Team</span>
              <h3>Saranya E</h3>
              <p>
                An AML specialist and dedicated mentor, Saranya translates
                complex global cases into actionable learning experiences.
              </p>
            </Reveal>

            <Reveal className="k-team-note" delay={0.2}>
              <p>
                Two practitioners, one shared focus: making financial crime
                compliance practical, learnable and career-ready.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
