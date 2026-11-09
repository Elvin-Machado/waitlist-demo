import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function FinalCTA() {
  return <section className="academy-final" id="join"><div className="k-container"><div className="academy-final-inner"><div><span className="k-eyebrow">Your next chapter</span><h2>Be ready for what’s next.</h2><p>Join the KAWS Academy waitlist and be the first to hear when our programs launch.</p></div><div><Link href="/waitlist" className="k-btn">Join the waitlist <FiArrowRight aria-hidden="true" /></Link><span className="academy-final-note">Free to join. No commitment.</span></div></div></div></section>;
}