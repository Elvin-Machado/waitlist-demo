"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaFingerprint,
  FaChartLine,
  FaGlobeAmericas,
  FaUserShield,
  FaShieldAlt,
  FaBalanceScale,
  FaCube,
  FaBolt,
  FaBriefcase,
  FaCompass,
  FaSitemap,
  FaTimes,
} from "react-icons/fa";

import coursesData from "../data/CoursesData";
import domainMeta from "../data/DomainMeta";
import Reveal from "./Reveal";

const ICONS = {
  identity: <FaFingerprint />,
  activity: <FaChartLine />,
  globe: <FaGlobeAmericas />,
  userShield: <FaUserShield />,
  shield: <FaShieldAlt />,
  scale: <FaBalanceScale />,
  cube: <FaCube />,
  spark: <FaBolt />,
  chart: <FaChartLine />,
  briefcase: <FaBriefcase />,
  compass: <FaCompass />,
  sitemap: <FaSitemap />,
};

function CourseRow({ course }) {
  const [imgError, setImgError] = useState(false);
  const src = course.image ? `/coursethumbnails/${course.image}` : null;

  return (
    <li className="k-course-item">
      {src && !imgError ? (
        <img
          src={src}
          alt=""
          className="k-course-thumb"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="k-course-thumb-fallback">{course.code}</span>
      )}
      <div className="k-course-info">
        <p className="k-course-title">{course.title}</p>
        <div className="k-course-meta">
          <span className={`k-course-level ${course.level.toLowerCase()}`}>
            {course.level}
          </span>
          <span>{course.duration}</span>
          <span aria-hidden="true">·</span>
          <span>{course.code}</span>
        </div>
      </div>
    </li>
  );
}

export default function Domains() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => setMounted(true), []);

  const domains = useMemo(
    () =>
      coursesData.map((domain, index) => {
        const meta = domainMeta[domain.domain] || {};
        return {
          ...domain,
          index,
          number: String(index + 1).padStart(2, "0"),
          short: meta.short || "",
          overview: meta.overview || "",
          icon: ICONS[meta.icon] || <FaShieldAlt />,
        };
      }),
    []
  );

  const active = activeIndex === null ? null : domains[activeIndex];

  // Lock body scroll, compensate for the scrollbar and restore focus on exit.
  useEffect(() => {
    if (activeIndex === null) return;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.body.classList.add("k-modal-open");

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      document.body.classList.remove("k-modal-open");
      lastFocused.current?.focus?.();
    };
  }, [activeIndex]);

  const close = () => setActiveIndex(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = document.getElementById("k-domain-modal");
      if (!panel) return;

      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  const openDomain = (index, event) => {
    lastFocused.current = event?.currentTarget || null;
    setActiveIndex(index);
  };

  return (
    <section className="k-section k-domains" id="domains">
      <div className="k-container">
        <div className="k-domains-head">
          <div>
            <Reveal>
              <span className="k-eyebrow">Explore the curriculum</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="k-display">
                Find your <em>starting point.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="k-body" style={{ maxWidth: "52ch" }}>
                From essential foundations to specialist skills. Explore a domain
                to discover its modules, levels and learning time.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="k-domains-count">
            {domains.length} Domains ·{" "}
            {domains.reduce((total, d) => total + d.courses.length, 0)} Modules
          </Reveal>
        </div>

        <div className="k-domain-grid">
          {(showAll ? domains : domains.slice(0, 6)).map((domain, index) => (
            <Reveal key={domain.domain} delay={(index % 3) * 0.07} amount={0.15}>
              <button
                type="button"
                className="k-domain-card"
                onClick={(event) => openDomain(index, event)}
                aria-haspopup="dialog"
              >
                <span className="k-domain-top">
                  <span className="k-domain-icon">{domain.icon}</span>
                  <span className="academy-domain-status">Coming soon</span>
                </span>
                <span className="k-domain-name">{domain.domain}</span>
                <span className="k-domain-desc">{domain.short}</span>
                <span className="k-domain-foot">
                  <span className="k-domain-count">
                    {domain.courses.length} modules
                  </span>
                  <span className="k-domain-go">
                    <FaArrowRight size={10} />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <div className="academy-domain-actions">
          <button type="button" className="academy-secondary-btn" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show fewer domains" : `Explore all ${domains.length} domains`}
            <FaArrowRight size={12} aria-hidden="true" />
          </button>
          <Link href="/courses" className="academy-text-link">Browse every module <FaArrowRight size={12} aria-hidden="true" /></Link>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                className="k-modal-backdrop"
                onClick={close}
                initial={reduce ? false : { opacity: 0 }}
                animate={reduce ? false : { opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  id="k-domain-modal"
                  className="k-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="k-domain-modal-title"
                  onClick={(event) => event.stopPropagation()}
                  initial={
                    reduce ? false : { opacity: 0, y: 30, scale: 0.98 }
                  }
                  animate={reduce ? false : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: 20, scale: 0.99 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="k-modal-head">
                    <button
                      type="button"
                      className="k-modal-close"
                      onClick={close}
                      aria-label="Close domain details"
                      ref={closeRef}
                    >
                      <FaTimes size={15} />
                    </button>

                    <div className="k-modal-top">
                      <span className="k-modal-num">{active.number}</span>
                      <span className="k-modal-icon">{active.icon}</span>
                    </div>

                    <h3 className="k-modal-title" id="k-domain-modal-title">
                      {active.domain}
                    </h3>
                    <p className="k-modal-overview">{active.overview}</p>
                  </div>

                  <div className="k-modal-body">
                    <div className="k-modal-body-head">
                      <h4>Planned curriculum</h4>
                      <span>{active.courses.length} modules</span>
                    </div>

                    <ul className="k-course-list">
                      {active.courses.map((course) => (
                        <CourseRow key={course.code} course={course} />
                      ))}
                    </ul>
                    <div className="academy-modal-cta">
                      <p>Interested in this domain? Get notified when programs launch.</p>
                      <Link href={`/waitlist?interest=${encodeURIComponent(active.domain)}`} className="k-btn" onClick={close}>Join the waitlist <FaArrowRight size={12} aria-hidden="true" /></Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
