import { FiBookOpen, FiBriefcase, FiLayers, FiArrowUpRight } from "react-icons/fi";

const BENEFITS = [
  { icon: FiBookOpen, title: "Build your knowledge", text: "Follow structured programs across AML, KYC, sanctions and global regulatory frameworks. Start with the foundations and progress at your level.", tag: "Structured FCC programs" },
  { icon: FiLayers, title: "Practice the real work", text: "Connect the theory to practical scenarios. Develop investigation techniques, assess risk and work through the decisions compliance teams make every day.", tag: "Simulation lab & live learning" },
  { icon: FiBriefcase, title: "Prepare for what’s next", text: "Turn your knowledge into career readiness with interview preparation, professional branding and guidance for financial crime and compliance roles.", tag: "Career accelerator" },
];

export default function LearningApproach() {
  return (
    <section className="academy-approach" id="approach">
      <div className="k-container">
        <div className="academy-section-head"><div><span className="k-eyebrow">The KAWS approach</span><h2 className="k-display">Knowledge you can<br /><em>put to work.</em></h2></div><p>Built to bridge the gap between academic theory and the everyday work of financial crime and compliance teams.</p></div>
        <div className="academy-benefits" id="provide">{BENEFITS.map(({ icon: Icon, title, text, tag }, index) => <article key={title}><div className="academy-benefit-top"><Icon aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p><span className="academy-benefit-tag">{tag}<FiArrowUpRight aria-hidden="true" /></span></article>)}</div>
        <div className="academy-formats"><span>More ways to grow</span><p>CGKAA live program <span>·</span> Industry insights <span>·</span> Corporate training</p></div>
      </div>
    </section>
  );
}