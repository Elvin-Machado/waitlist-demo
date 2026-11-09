import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiLock,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import coursesData from "../data/CoursesData";

const MODULE_COUNT = coursesData.reduce(
  (total, domain) => total + domain.courses.length,
  0
);

const PREVIEW = [
  {
    number: "01",
    title: "Understand the fundamentals",
    detail: "AML foundations · KYC & due diligence",
  },
  {
    number: "02",
    title: "Put your knowledge into practice",
    detail: "Transaction monitoring · Investigations",
  },
  {
    number: "03",
    title: "Take your next career step",
    detail: "Interview preparation · Professional branding",
  },
];

const STATS = [
  { value: MODULE_COUNT, label: "Focused modules" },
  { value: coursesData.length, label: "Learning domains" },
  { value: "3", label: "Learning levels" },
  { value: "6+", label: "Years of industry expertise" },
];

const HERO_STYLES = `
.kaws-hero {
  --kh-white: #ffffff;
  --kh-bg: #f5f8ff;
  --kh-ink: #101828;
  --kh-muted: #64748b;
  --kh-blue: #2457e8;
  --kh-blue-deep: #1b44c6;
  --kh-blue-soft: #eaf1ff;
  --kh-gold: #ffb000;
  --kh-line: rgba(36, 87, 232, 0.12);
  --kh-line-soft: rgba(16, 24, 40, 0.07);
  --kh-shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 26px -14px rgba(36, 87, 232, 0.2);
  --kh-shadow-md: 0 1px 2px rgba(16, 24, 40, 0.04), 0 22px 48px -20px rgba(36, 87, 232, 0.26);
  --kh-shadow-lg: 0 2px 6px rgba(16, 24, 40, 0.04), 0 48px 90px -34px rgba(36, 87, 232, 0.32);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(26px, 3.4vw, 44px) 0 0;
  background:
    radial-gradient(880px 520px at 86% -14%, rgba(36, 87, 232, 0.13), transparent 62%),
    radial-gradient(720px 480px at 6% 112%, rgba(36, 87, 232, 0.07), transparent 62%),
    linear-gradient(180deg, #ffffff 0%, #ffffff 58%, #f5f8ff 100%);
  border-bottom: 1px solid var(--kh-line);
}

.kaws-hero .kaws-ambient {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.kaws-hero .kaws-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(46px);
  opacity: 0.6;
}
.kaws-hero .kaws-orb-one {
  width: 420px;
  height: 420px;
  right: -120px;
  top: -160px;
  background: radial-gradient(circle, rgba(36, 87, 232, 0.22), transparent 70%);
}
.kaws-hero .kaws-orb-two {
  width: 360px;
  height: 360px;
  left: -140px;
  bottom: -120px;
  background: radial-gradient(circle, rgba(36, 87, 232, 0.12), transparent 70%);
}
.kaws-hero .kaws-orb-three {
  width: 220px;
  height: 220px;
  left: 44%;
  top: 34%;
  background: radial-gradient(circle, rgba(255, 176, 0, 0.14), transparent 70%);
}

.kaws-hero .kaws-network {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.kaws-hero .kaws-dotfield {
  position: absolute;
  right: -40px;
  top: -40px;
  width: 460px;
  height: 460px;
  opacity: 0.18;
  background-image: radial-gradient(rgba(36, 87, 232, 0.35) 1.3px, transparent 1.4px);
  background-size: 18px 18px;
  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 70%);
  mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 70%);
}

.kaws-hero .kaws-hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.06fr 0.94fr;
  align-items: center;
  gap: clamp(36px, 4.4vw, 68px);
  padding-top: clamp(26px, 3.6vw, 54px);
  padding-bottom: clamp(34px, 4.6vw, 64px);
}

.kaws-hero .kaws-hero-copy {
  position: relative;
  z-index: 2;
  max-width: 560px;
}

.kaws-hero .kaws-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 14px 7px 12px;
  margin-bottom: 26px;
  border: 1px solid rgba(36, 87, 232, 0.16);
  border-radius: 999px;
  background: linear-gradient(180deg, #ffffff, var(--kh-blue-soft));
  color: var(--kh-blue);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  box-shadow: var(--kh-shadow-sm);
}
.kaws-hero .kaws-pulse {
  position: relative;
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: var(--kh-gold);
  box-shadow: 0 0 0 4px rgba(255, 176, 0, 0.16);
}
.kaws-hero .kaws-pulse::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(255, 176, 0, 0.5);
  animation: kaws-ping 2.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes kaws-ping {
  0% { transform: scale(0.6); opacity: 0.9; }
  70%, 100% { transform: scale(1.9); opacity: 0; }
}

.kaws-hero .kaws-hero-copy h1 {
  margin: 0 0 22px;
  max-width: 13ch;
  font-family: var(--k-sans);
  font-size: clamp(2.55rem, 4.9vw, 4.1rem);
  font-weight: 700;
  line-height: 1.045;
  letter-spacing: -0.045em;
  color: var(--kh-ink);
}
.kaws-hero .kaws-hero-copy h1 span {
  color: var(--kh-blue);
  background: linear-gradient(180deg, transparent 72%, rgba(36, 87, 232, 0.12) 0);
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding-bottom: 0.04em;
}

.kaws-hero .kaws-lede {
  margin: 0;
  max-width: 50ch;
  color: var(--kh-muted);
  font-size: clamp(14.5px, 1.05vw, 16px);
  line-height: 1.78;
}

.kaws-hero .kaws-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 30px;
}
.kaws-hero .kaws-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 26px;
  border: 1px solid rgba(36, 87, 232, 0.9);
  border-radius: 999px;
  background: linear-gradient(180deg, #3264f2 0%, #2457e8 58%, #1f4ce0 100%);
  color: #ffffff;
  font-family: var(--k-sans);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow: 0 16px 34px -14px rgba(36, 87, 232, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, background 0.2s ease;
}
.kaws-hero .kaws-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(180deg, #2b5df0, var(--kh-blue-deep));
  box-shadow: 0 24px 48px -18px rgba(36, 87, 232, 0.72), inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.kaws-hero .kaws-btn:focus-visible {
  outline: 3px solid rgba(255, 176, 0, 0.9);
  outline-offset: 3px;
}
.kaws-hero .kaws-btn svg {
  width: 17px;
  height: 17px;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.kaws-hero .kaws-btn:hover svg {
  transform: translateX(3px);
}

.kaws-hero .kaws-text-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--kh-ink);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease, gap 0.2s ease;
}
.kaws-hero .kaws-text-link svg {
  width: 16px;
  height: 16px;
}
.kaws-hero .kaws-text-link:hover {
  color: var(--kh-blue);
  gap: 13px;
}
.kaws-hero .kaws-text-link:focus-visible {
  outline: 3px solid rgba(36, 87, 232, 0.35);
  outline-offset: 4px;
  border-radius: 6px;
}

.kaws-hero .kaws-trust {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
  color: var(--kh-muted);
  font-size: 11.5px;
  font-weight: 500;
}
.kaws-hero .kaws-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.kaws-hero .kaws-trust svg {
  width: 14px;
  height: 14px;
  color: var(--kh-blue);
}
.kaws-hero .kaws-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--kh-gold);
  box-shadow: 0 0 0 3px rgba(255, 176, 0, 0.12);
}

.kaws-hero .kaws-visual {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 0;
}

.kaws-hero .kaws-chip {
  position: absolute;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: 1px solid var(--kh-line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: var(--kh-shadow-md);
}
.kaws-hero .kaws-chip b {
  display: block;
  color: var(--kh-ink);
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.01em;
}
.kaws-hero .kaws-chip small {
  display: block;
  color: var(--kh-muted);
  font-size: 9px;
  line-height: 1.4;
}
.kaws-hero .kaws-chip-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border-radius: 9px;
  border: 1px solid rgba(36, 87, 232, 0.14);
  background: var(--kh-blue-soft);
  color: var(--kh-blue);
}
.kaws-hero .kaws-chip-icon svg {
  width: 16px;
  height: 16px;
}
.kaws-hero .kaws-chip-icon--gold {
  border-color: rgba(255, 176, 0, 0.3);
  background: #fff7e6;
  color: #b97a00;
}
.kaws-hero .kaws-chip-top {
  top: -40px;
  left: -26px;
  animation: kaws-float 7s ease-in-out infinite;
}
.kaws-hero .kaws-chip-bottom {
  right: -16px;
  bottom: -44px;
  animation: kaws-float 8s ease-in-out infinite reverse;
}
@keyframes kaws-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}

.kaws-hero .kaws-dashboard {
  position: relative;
  z-index: 2;
  width: min(100%, 442px);
  padding: 20px 20px 0;
  border: 1px solid var(--kh-line);
  border-radius: 26px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  box-shadow: var(--kh-shadow-lg);
}

.kaws-hero .kaws-dashboard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--kh-line-soft);
}
.kaws-hero .kaws-brandmark {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.kaws-hero .kaws-logo {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--kh-blue), #5a83ff);
  color: #ffffff;
  box-shadow: 0 10px 20px -10px rgba(36, 87, 232, 0.7);
}
.kaws-hero .kaws-logo svg {
  width: 17px;
  height: 17px;
}
.kaws-hero .kaws-brandmark b {
  display: block;
  color: var(--kh-ink);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.13em;
  line-height: 1.3;
}
.kaws-hero .kaws-brandmark small {
  display: block;
  color: var(--kh-muted);
  font-size: 7.5px;
  letter-spacing: 0.13em;
  line-height: 1.4;
  white-space: nowrap;
}
.kaws-hero .kaws-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px solid rgba(255, 176, 0, 0.3);
  border-radius: 999px;
  background: #fff8ea;
  color: #8a5c00;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.kaws-hero .kaws-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--kh-gold);
  box-shadow: 0 0 0 3px rgba(255, 176, 0, 0.18);
}

.kaws-hero .kaws-cover {
  position: relative;
  margin-top: 16px;
  padding: 16px 18px 20px;
  border: 1px solid rgba(36, 87, 232, 0.13);
  border-radius: 18px;
  overflow: hidden;
  background: radial-gradient(120% 140% at 82% 0%, #ffffff 0%, #f3f7ff 52%, #eaf1ff 100%);
}
.kaws-hero .kaws-cover-kicker {
  position: relative;
  z-index: 2;
  display: inline-block;
  color: #a06b00;
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.kaws-hero .kaws-cover-art {
  position: relative;
  display: grid;
  place-items: center;
  height: 118px;
  margin: 4px 0 6px;
}
.kaws-hero .kaws-dotted-map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.kaws-hero .kaws-orbit {
  position: absolute;
  border: 1px solid rgba(36, 87, 232, 0.18);
  border-radius: 50%;
}
.kaws-hero .kaws-orbit-one {
  width: 220px;
  height: 92px;
  transform: rotate(-18deg);
}
.kaws-hero .kaws-orbit-two {
  width: 168px;
  height: 108px;
  transform: rotate(24deg);
  border-color: rgba(36, 87, 232, 0.12);
}
.kaws-hero .kaws-orbit-node {
  position: absolute;
  top: 36%;
  right: 24%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kh-gold);
  box-shadow: 0 0 0 4px rgba(255, 176, 0, 0.16);
}
.kaws-hero .kaws-shield {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 62px;
  height: 68px;
  border: 1px solid rgba(36, 87, 232, 0.22);
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff, #eef4ff);
  color: var(--kh-blue);
  box-shadow: 0 18px 34px -18px rgba(36, 87, 232, 0.5), inset 0 1px 0 #ffffff;
  transform: rotate(-8deg);
}
.kaws-hero .kaws-shield svg {
  width: 30px;
  height: 30px;
  stroke-width: 1.4;
}
.kaws-hero .kaws-float-icon {
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(36, 87, 232, 0.16);
  border-radius: 10px;
  background: #ffffff;
  color: var(--kh-blue);
  box-shadow: var(--kh-shadow-sm);
}
.kaws-hero .kaws-float-icon svg {
  width: 14px;
  height: 14px;
}
.kaws-hero .kaws-float-icon--lock {
  left: 10%;
  top: 16%;
  animation: kaws-float 6s ease-in-out infinite;
}
.kaws-hero .kaws-float-icon--check {
  right: 12%;
  bottom: 20%;
  border-color: rgba(255, 176, 0, 0.3);
  color: #b97a00;
  animation: kaws-float 7.5s ease-in-out infinite reverse;
}
.kaws-hero .kaws-cover h2 {
  position: relative;
  z-index: 2;
  margin: 6px 0 0;
  color: var(--kh-ink);
  font-family: var(--k-sans);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.kaws-hero .kaws-journey {
  padding-top: 14px;
}
.kaws-hero .kaws-journey-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 9px;
  color: var(--kh-ink);
  font-size: 11.5px;
  font-weight: 700;
}
.kaws-hero .kaws-journey-head svg {
  width: 15px;
  height: 15px;
  color: var(--kh-blue);
}
.kaws-hero .kaws-journey-head small {
  margin-left: auto;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--kh-blue-soft);
  color: var(--kh-blue);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.kaws-hero .kaws-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--kh-line-soft);
  transition: transform 0.22s ease;
}
.kaws-hero .kaws-step:last-of-type {
  border-bottom: 0;
}
.kaws-hero .kaws-step:hover {
  transform: translateX(3px);
}
.kaws-hero .kaws-step-number {
  display: grid;
  place-items: center;
  width: 29px;
  height: 31px;
  flex: 0 0 29px;
  border: 1px solid rgba(36, 87, 232, 0.16);
  border-radius: 8px;
  background: linear-gradient(180deg, #ffffff, var(--kh-blue-soft));
  color: var(--kh-blue);
  font-size: 9.5px;
  font-weight: 700;
}
.kaws-hero .kaws-step-copy {
  min-width: 0;
}
.kaws-hero .kaws-step h3 {
  margin: 0 0 4px;
  color: var(--kh-ink);
  font-family: var(--k-sans);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.45;
}
.kaws-hero .kaws-step p {
  margin: 0;
  color: var(--kh-muted);
  font-size: 9.5px;
  line-height: 1.5;
}
.kaws-hero .kaws-step > svg {
  width: 13px;
  height: 13px;
  margin-left: auto;
  flex: 0 0 13px;
  color: #98a2b3;
  transition: color 0.2s ease, transform 0.2s ease;
}
.kaws-hero .kaws-step:hover > svg {
  color: var(--kh-blue);
  transform: translateX(2px);
}
.kaws-hero .kaws-journey-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 2px -20px 0;
  padding: 14px 20px;
  border-top: 1px solid var(--kh-line-soft);
  border-radius: 0 0 26px 26px;
  background: linear-gradient(180deg, #fbfdff, #f5f8ff);
  color: var(--kh-muted);
  font-size: 9.5px;
}
.kaws-hero .kaws-foot-arrow {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border-radius: 50%;
  background: var(--kh-blue-soft);
  color: var(--kh-blue);
  font-size: 11px;
  font-weight: 700;
}

.kaws-hero .kaws-facts {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.55fr 1fr 1fr 0.85fr 1.25fr;
  align-items: center;
  gap: 24px;
  margin: 0 0 clamp(26px, 3.6vw, 42px);
  padding: 24px 30px;
  border: 1px solid var(--kh-line);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: var(--kh-shadow-md);
}
.kaws-hero .kaws-facts > p {
  margin: 0;
  color: var(--kh-muted);
  font-size: 12px;
  line-height: 1.7;
}
.kaws-hero .kaws-facts > p strong {
  color: var(--kh-ink);
  font-weight: 700;
}
.kaws-hero .kaws-fact {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 22px;
  border-left: 1px solid var(--kh-line-soft);
}
.kaws-hero .kaws-fact strong {
  color: var(--kh-ink);
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}
.kaws-hero .kaws-fact span {
  color: var(--kh-muted);
  font-size: 10px;
  line-height: 1.45;
}

@media (max-width: 1100px) {
  .kaws-hero .kaws-hero-grid { gap: 40px; }
  .kaws-hero .kaws-hero-copy h1 { font-size: clamp(2.4rem, 4.4vw, 3.3rem); }
  .kaws-hero .kaws-facts { grid-template-columns: 1.4fr 1fr 1fr 0.85fr 1.2fr; gap: 18px; padding: 22px 24px; }
  .kaws-hero .kaws-chip-top { left: -14px; }
  .kaws-hero .kaws-chip-bottom { right: -8px; }
}

@media (max-width: 960px) {
  .kaws-hero .kaws-hero-grid { grid-template-columns: 1fr; gap: 44px; padding-top: 38px; padding-bottom: 40px; }
  .kaws-hero .kaws-hero-copy { max-width: none; }
  .kaws-hero .kaws-hero-copy h1 { max-width: 16ch; }
  .kaws-hero .kaws-visual { order: 2; padding-top: 26px; }
  .kaws-hero .kaws-chip { display: none; }
  .kaws-hero .kaws-facts { grid-template-columns: repeat(2, 1fr); gap: 20px 24px; }
  .kaws-hero .kaws-facts > p { grid-column: 1 / -1; }
  .kaws-hero .kaws-fact:nth-of-type(odd) { border-left: 0; padding-left: 0; }
}

@media (max-width: 640px) {
  .kaws-hero { padding-top: 20px; }
  .kaws-hero .kaws-hero-copy h1 { max-width: 14ch; font-size: clamp(2.3rem, 9.4vw, 2.9rem); }
  .kaws-hero .kaws-lede { font-size: 14px; }
  .kaws-hero .kaws-actions { gap: 18px; }
  .kaws-hero .kaws-btn { width: 100%; }
  .kaws-hero .kaws-text-link { width: 100%; justify-content: flex-start; }
  .kaws-hero .kaws-dashboard { padding: 16px 16px 0; border-radius: 22px; }
  .kaws-hero .kaws-cover { padding: 14px; }
  .kaws-hero .kaws-cover h2 { font-size: 17px; }
  .kaws-hero .kaws-journey-foot { margin-left: -16px; margin-right: -16px; padding: 13px 16px; border-radius: 0 0 22px 22px; }
  .kaws-hero .kaws-facts { grid-template-columns: 1fr 1fr; padding: 20px; border-radius: 16px; }
  .kaws-hero .kaws-fact strong { font-size: 22px; }
  .kaws-hero .kaws-dotfield { opacity: 0.12; }
}

@media (prefers-reduced-motion: reduce) {
  .kaws-hero *,
  .kaws-hero *::before,
  .kaws-hero *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

function NetworkBackdrop() {
  return (
    <svg
      className="kaws-network"
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#2457e8" strokeWidth="1">
        <path
          d="M-60 610C170 470 320 640 560 520S980 320 1500 420"
          strokeOpacity=".08"
        />
        <path
          d="M-40 250C240 180 360 380 640 320S1040 160 1520 240"
          strokeOpacity=".06"
        />
        <path
          d="M760 -40C820 160 980 220 1160 180S1360 60 1460 120"
          strokeOpacity=".05"
        />
      </g>
      <g fill="#2457e8">
        <circle cx="180" cy="560" r="3" opacity=".16" />
        <circle cx="560" cy="520" r="2.5" opacity=".14" />
        <circle cx="930" cy="380" r="3" opacity=".14" />
        <circle cx="1180" cy="300" r="2.5" opacity=".12" />
        <circle cx="340" cy="230" r="2.5" opacity=".12" />
      </g>
    </svg>
  );
}

function DottedWorldMap() {
  return (
    <svg
      className="kaws-dotted-map"
      viewBox="0 0 460 220"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="kawsDotGrid"
          width="7.5"
          height="7.5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.55" cy="1.55" r="1.25" fill="#2457e8" />
        </pattern>
        <mask id="kawsWorldMask">
          <rect width="460" height="220" fill="#000000" />
          <g fill="#ffffff">
            <path d="M40 66c6-18 28-30 50-27 23 3 38 15 40 31 2 15-10 25-24 30-9 3-15 10-25 10-14 0-20-9-26-20-4-8-9-14-15-24Z" />
            <path d="M104 108c10-6 22-2 26 9 4 12-2 26-9 38-6 10-16 16-24 10-8-5-8-19-4-31 3-10 3-20 11-26Z" />
            <path d="M196 47c8-9 24-13 36-8 12 5 18 17 12 27-5 9-18 13-30 10-12-3-20-13-21-22 0-3 1-5 3-7Z" />
            <path d="M198 88c11-8 28-6 35 5 8 12 5 28-4 41-8 12-20 21-30 15-10-6-11-22-10-35 1-10 2-20 9-26Z" />
            <path d="M238 46c14-12 40-16 61-9 22 7 38 24 35 42-3 17-22 27-42 27-18 0-34-7-45-19-9-10-15-25-9-41Z" />
            <path d="M322 132c9-9 26-10 36-3 9 6 12 18 6 27-6 8-19 11-30 8-10-3-16-13-15-22 0-4 1-7 3-10Z" />
          </g>
        </mask>
        <linearGradient id="kawsArc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2457e8" stopOpacity=".05" />
          <stop offset=".5" stopColor="#2457e8" stopOpacity=".5" />
          <stop offset="1" stopColor="#2457e8" stopOpacity=".05" />
        </linearGradient>
      </defs>
      <rect
        width="460"
        height="220"
        fill="url(#kawsDotGrid)"
        mask="url(#kawsWorldMask)"
        opacity=".55"
      />
      <g fill="none" stroke="url(#kawsArc)" strokeWidth="1.1">
        <path d="M92 74C160 26 250 26 318 62" />
        <path d="M118 128C186 92 268 96 344 132" strokeDasharray="4 6" />
        <path d="M210 60C230 100 258 122 300 140" strokeDasharray="3 7" />
      </g>
      <g>
        <circle cx="92" cy="74" r="3" fill="#2457e8" />
        <circle cx="318" cy="62" r="3" fill="#2457e8" />
        <circle cx="118" cy="128" r="2.4" fill="#ffb000" />
        <circle cx="344" cy="132" r="2.4" fill="#ffb000" />
        <circle cx="210" cy="60" r="2.2" fill="#2457e8" opacity=".75" />
        <circle cx="300" cy="140" r="2.2" fill="#2457e8" opacity=".75" />
      </g>
      <g fill="none" stroke="#2457e8" strokeOpacity=".16">
        <circle cx="318" cy="62" r="7" />
        <circle cx="118" cy="128" r="6" />
      </g>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <section className="kaws-hero" id="home">
      <style>{HERO_STYLES}</style>

      <div className="kaws-ambient" aria-hidden="true">
        <span className="kaws-orb kaws-orb-one" />
        <span className="kaws-orb kaws-orb-two" />
        <span className="kaws-orb kaws-orb-three" />
        <span className="kaws-dotfield" />
        <NetworkBackdrop />
      </div>

      <div className="k-container kaws-hero-grid">
        <div className="kaws-hero-copy">
          <h1>
            Build your future in <span>financial crime compliance.</span>
          </h1>
          <p className="kaws-lede">
            Go from understanding the rules to knowing how to apply them.
            Practical, career-focused learning for the next generation of
            compliance professionals.
          </p>
          <div className="kaws-actions">
            <Link href="/waitlist" className="kaws-btn">
              Join the waitlist <FiArrowRight aria-hidden="true" />
            </Link>
            <a href="#domains" className="kaws-text-link">
              Explore courses <FiArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="kaws-trust">
            <span className="kaws-trust-item">
              <FiCheck aria-hidden="true" /> Free to join
            </span>
            <i className="kaws-sep" aria-hidden="true" />
            <span className="kaws-trust-item">
              <FiLock aria-hidden="true" /> Get notified when programs launch
            </span>
          </div>
        </div>

        <div className="kaws-visual">
          <div className="kaws-chip kaws-chip-top">
            <span className="kaws-chip-icon">
              <FiShield aria-hidden="true" />
            </span>
            <span>
              <b>AML · KYC · Sanctions</b>
              <small>Compliance core</small>
            </span>
          </div>
          <div className="kaws-chip kaws-chip-bottom">
            <span className="kaws-chip-icon kaws-chip-icon--gold">
              <FiTrendingUp aria-hidden="true" />
            </span>
            <span>
              <b>Career-ready</b>
              <small>Practical by design</small>
            </span>
          </div>

          <div className="kaws-dashboard">
            <div className="kaws-dashboard-head">
              <div className="kaws-brandmark">
                <span className="kaws-logo">
                  <FiAward aria-hidden="true" />
                </span>
                <span>
                  <b>KAWS ACADEMY</b>
                  <small>FINANCIAL CRIME &amp; COMPLIANCE</small>
                </span>
              </div>
            </div>

            <div className="kaws-cover">
              <span className="kaws-cover-kicker">
                KNOWLEDGE · PRACTICE · CONFIDENCE
              </span>
              <div className="kaws-cover-art">
                <DottedWorldMap />
                <span className="kaws-orbit kaws-orbit-one" />
                <span className="kaws-orbit kaws-orbit-two" />
                <span className="kaws-orbit-node" />
                <span className="kaws-float-icon kaws-float-icon--lock">
                  <FiLock aria-hidden="true" />
                </span>
                <span className="kaws-float-icon kaws-float-icon--check">
                  <FiCheck aria-hidden="true" />
                </span>
                <span className="kaws-shield">
                  <FiShield aria-hidden="true" />
                </span>
              </div>
              <h2>
                Your next chapter
                <br />
                starts with a strong foundation.
              </h2>
            </div>

            <div className="kaws-journey">
              <div className="kaws-journey-head">
                <FiBookOpen aria-hidden="true" />
                <span>Your learning journey</span>
                <small>3 steps</small>
              </div>
              {PREVIEW.map((item) => (
                <div className="kaws-step" key={item.number}>
                  <span className="kaws-step-number">{item.number}</span>
                  <div className="kaws-step-copy">
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <FiArrowRight aria-hidden="true" />
                </div>
              ))}
            </div>

            <div className="kaws-journey-foot">
              <span>From first principles to professional practice</span>
              <span className="kaws-foot-arrow">↗</span>
            </div>
          </div>
        </div>
      </div>

      <div className="k-container">
        <div className="kaws-facts">
          <p>
            A focused path to
            <br />
            <strong>professional confidence.</strong>
          </p>
          {STATS.map((stat) => (
            <div className="kaws-fact" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
