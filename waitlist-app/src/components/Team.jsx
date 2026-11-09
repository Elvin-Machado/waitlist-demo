export default function Team() {
  return (
    <section className="k-section academy-team" id="team">
      <div className="k-container">
        <div className="academy-section-head" id="about"><div><span className="k-eyebrow">The people behind the academy</span><h2 className="k-display">Learn from people<br /><em>who know the work.</em></h2></div><p>We’re here to make complex compliance topics practical and accessible, for students, career changers and working professionals.</p></div>
        <div className="academy-team-grid">
          <article className="academy-founder"><img src="/sid.jpeg" alt="Siddarth Shenoy, Founder and CEO" loading="lazy" /><div><span className="academy-role">Founder &amp; CEO</span><h3>Siddarth Shenoy</h3><p>Over six years of experience in AML, KYC and financial crime operations, with a mission to make professional knowledge easier to put into practice.</p><blockquote>“My mission is to simplify these complex domains and open doors for the next generation of compliance professionals.”</blockquote></div></article>
          <article className="academy-mentor"><div className="academy-mentor-top"><span className="academy-monogram" aria-hidden="true">SE</span><span className="academy-role">Leadership team</span></div><h3>Saranya E</h3><p>An AML specialist and dedicated mentor, translating complex global cases into actionable learning experiences.</p><span className="academy-mentor-note">Industry experience. A shared purpose.</span></article>
        </div>
      </div>
    </section>
  );
}