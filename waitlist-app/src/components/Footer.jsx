"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const EXPLORE = [
  { id: "about", label: "About" },
  { id: "domains", label: "Learning domains" },
  { id: "approach", label: "How you’ll learn" },
  { id: "team", label: "Our team" },
  { id: "faq", label: "FAQs" },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const goToSection = (event, id) => {
    event.preventDefault();
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
        window.history.replaceState(null, "", `/#${id}`);
      }
      return;
    }
    router.push(`/#${id}`);
  };

  return (
    <footer className="k-footer">
      <div className="k-container">
        <div className="k-footer-grid">
          <div>
            <div className="k-footer-brand">
              <img
                src="/logo_edt.png"
                alt="KAWS Academy"
                className="k-footer-logo"
              />
              <span className="k-footer-brand-name">KAWS® Academy</span>
            </div>
            <p className="k-footer-desc">
              Simplifying financial crime compliance through practical learning,
              real-world insight and career-focused guidance. Training for
              future-ready compliance professionals.
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul className="k-footer-links">
              {EXPLORE.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    onClick={(event) => goToSection(event, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Academy</h4>
            <ul className="k-footer-links">
              <li>
                <a href="/#domains" onClick={(event) => goToSection(event, "domains")}>
                  Explore Domains
                </a>
              </li>
              <li>
                <Link href="/waitlist">Join the Waitlist</Link>
              </li>
              <li>
                <a
                  href="mailto:kawsacademy@gmail.com"
                  className="k-footer-contact"
                >
                  kawsacademy@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919962017206" className="k-footer-contact">
                  +91 9962017206
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="k-footer-bottom">
          <p>
            © {new Date().getFullYear()} KAWS® Academy. All rights reserved.
          </p>
          <div className="k-footer-legal">
            <Link href="/courses">Course catalog</Link>
            <a href="mailto:kawsacademy@gmail.com">Contact us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
