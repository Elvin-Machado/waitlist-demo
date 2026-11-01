"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCopy,
  FaFacebook,
  FaLinkedin,
  FaLock,
  FaShieldAlt,
  FaTwitter,
} from "react-icons/fa";
import { validateEmail } from "../utils/validate-email";
import { addToWaitlist } from "../repo/wishlist";
import coursesData from "../data/CoursesData";
import "../Waitlist.css";

const DOMAIN_NAMES = coursesData.map((d) => d.domain);

export default function WaitingListForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const [joined, setJoined] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);

  // Derive a reproducible referral code for the confirmation state
  const refCode = submittedEmail
    ? Math.abs(
        submittedEmail
          .split("")
          .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      )
        .toString(36)
        .toUpperCase()
        .slice(0, 6)
    : "KW8421";

  const referralLink = `https://kawsacademy.com/waitlist?ref=${refCode}`;

  const shareText = encodeURIComponent(
    "I just joined the waitlist for KAWS Academy — the premier academy for financial crime compliance and risk professionals!"
  );
  const shareUrl = encodeURIComponent(referralLink);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(referralLink);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  async function onSubmit(data) {
    if (isSubmitting) return;
    setFormError("");

    if (!validateEmail(data.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      await addToWaitlist(
        data.name,
        data.email,
        data.phone || "",
        data.interest || ""
      );
      setSubmittedEmail(data.email);
      setJoined(true);
      reset();
    } catch (err) {
      setFormError(
        err?.message || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="kwl-split-page">
      {/* ─────────────────────────────────────────────────────────────
          LEFT COLUMN: White background, 50% width, Form / Confirmation
          ───────────────────────────────────────────────────────────── */}
      <section className="kwl-left-col" aria-label="Waitlist Form and Queue">
        <div className="kwl-left-container">
          {/* Top navigation: Back to home */}
          <Link href="/" className="kwl-back-link">
            <FaArrowLeft size={11} aria-hidden="true" />
            <span>Back to Home</span>
          </Link>

          {/* Brand Logo & Title */}
          <div className="kwl-brand-badge">
            <Link href="/" className="kwl-brand-link">
              <img
                src="/logo_edt.png"
                alt="KAWS Academy"
                className="kwl-brand-img"
              />
              <span className="kwl-brand-info">
                <span className="kwl-brand-name">KAWS Academy</span>
                <span className="kwl-brand-tagline">
                  Financial Crime &amp; Compliance
                </span>
              </span>
            </Link>
          </div>

          {/* ── STATE 1: Initial Waitlist Form ───────────────────────── */}
          {!joined ? (
            <div className="kwl-state-form">
              <h1 className="kwl-page-title">
                Be among the first to learn with{" "}
                <span className="kwl-title-accent">KAWS Academy.</span>
              </h1>
              <p className="kwl-page-desc">
                We&apos;re building a focused learning platform for the next
                generation of compliance and financial crime professionals.
                Reserve your spot today.
              </p>

              <form
                className="kwl-clean-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {formError && (
                  <div className="kwl-alert-error" role="alert">
                    {formError}
                  </div>
                )}

                {/* Full Name */}
                <div className="kwl-form-group">
                  <label htmlFor="wl-name" className="kwl-label">
                    Full Name
                  </label>
                  <input
                    id="wl-name"
                    type="text"
                    className={`kwl-input ${errors.name ? "has-error" : ""}`}
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name", { required: true })}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span className="kwl-err-msg">Please enter your name.</span>
                  )}
                </div>

                {/* Email Address */}
                <div className="kwl-form-group">
                  <label htmlFor="wl-email" className="kwl-label">
                    Email Address
                  </label>
                  <input
                    id="wl-email"
                    type="email"
                    className={`kwl-input ${errors.email ? "has-error" : ""}`}
                    placeholder="john@example.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", { required: true })}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className="kwl-err-msg">
                      Please enter a valid email.
                    </span>
                  )}
                </div>

                {/* Phone Number (+91) */}
                <div className="kwl-form-group">
                  <label htmlFor="wl-phone" className="kwl-label">
                    Phone Number (+91)
                  </label>
                  <div className="kwl-phone-box">
                    <span className="kwl-prefix">+91</span>
                    <input
                      id="wl-phone"
                      type="tel"
                      className="kwl-input kwl-phone-input"
                      placeholder="9876543210"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      {...register("phone")}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Your Interest Area (Optional) */}
                <div className="kwl-form-group">
                  <label htmlFor="wl-interest" className="kwl-label">
                    Your Interest Area (Optional)
                  </label>
                  <div className="kwl-select-box">
                    <select
                      id="wl-interest"
                      className="kwl-select"
                      defaultValue=""
                      {...register("interest")}
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>
                        Select a domain…
                      </option>
                      {DOMAIN_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <span className="kwl-arrow" aria-hidden="true">
                      ▾
                    </span>
                  </div>
                </div>

                {/* Primary CTA Submit Button */}
                <button
                  type="submit"
                  className="kwl-primary-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="kwl-btn-spinner" aria-hidden="true" />
                      <span>Joining…</span>
                    </>
                  ) : (
                    <>
                      <span>Join the Waitlist</span>
                      <FaArrowRight size={13} aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="kwl-security-note">
                  <FaLock size={10} aria-hidden="true" />
                  <span>Your information is secure. No spam, ever.</span>
                </p>
              </form>
            </div>
          ) : (
            /* ── STATE 2: Confirmation & Queue Referral Flow ─────────── */
            <div className="kwl-state-confirmed" role="status" aria-live="polite">
              <div className="kwl-success-check-badge">
                <FaCheck size={18} aria-hidden="true" />
              </div>

              <h1 className="kwl-page-title">Get access sooner!</h1>
              <p className="kwl-page-desc">
                We&apos;ve added{" "}
                <strong className="kwl-email-highlight">
                  {submittedEmail || "your email"}
                </strong>{" "}
                to the waitlist. You&apos;ll be the first to know when we launch
                our compliance programs.
              </p>

              <hr className="kwl-flow-divider" />

              {/* Queue status & referral sharing block */}
              <div className="kwl-referral-block">
                <div className="kwl-queue-stat">
                  <span className="kwl-queue-count">1,216</span>
                  <span className="kwl-queue-label">
                    people are ahead of you
                  </span>
                </div>
                <p className="kwl-share-subtext">
                  The more you share, the sooner you&apos;ll get access.
                </p>

                {/* Referral copy field */}
                <div className="kwl-ref-field-wrap">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="kwl-ref-input"
                    aria-label="Your personal referral link"
                  />
                  <button
                    type="button"
                    className={`kwl-copy-btn ${copied ? "is-copied" : ""}`}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <FaCheck size={12} aria-hidden="true" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy size={12} aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="kwl-social-row">
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kwl-social-btn kwl-social-twitter"
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter size={14} aria-hidden="true" />
                    <span>Twitter</span>
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kwl-social-btn kwl-social-facebook"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebook size={14} aria-hidden="true" />
                    <span>Facebook</span>
                  </a>

                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kwl-social-btn kwl-social-linkedin"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin size={14} aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              <hr className="kwl-flow-divider" />

              {/* Solid primary Return to home button */}
              <Link href="/" className="kwl-return-home-btn">
                Return to home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT COLUMN: Soft Cool Gray (#F4F6F9), 50% width
          Browser / App Mockup with 3px solid #0A2540 border bleeding right
          ───────────────────────────────────────────────────────────── */}
      <section
        className="kwl-right-col"
        aria-label="KAWS Academy Platform Preview"
      >
        <div className="kwl-mockup-wrapper">
          <div className="kwl-app-window">
            {/* Window chrome topbar */}
            <div className="kwl-window-bar">
              <div className="kwl-window-controls" aria-hidden="true">
                <span className="kwl-dot kwl-dot-red" />
                <span className="kwl-dot kwl-dot-yellow" />
                <span className="kwl-dot kwl-dot-green" />
              </div>
              <div className="kwl-window-url">
                <FaLock size={9} aria-hidden="true" />
                <span>kawsacademy.com/portal/curriculum</span>
              </div>
              <div className="kwl-window-brand">
                <img
                  src="/logo_edt.png"
                  alt=""
                  className="kwl-window-brand-img"
                  aria-hidden="true"
                />
                <span className="kwl-window-brand-text">KAWS Portal</span>
              </div>
            </div>

            {/* App Window Body */}
            <div className="kwl-app-body">
              {/* Abstract navy/gold gradient header banner */}
              <div className="kwl-banner-header">
                <div className="kwl-banner-badge">
                  <FaShieldAlt size={11} aria-hidden="true" />
                  <span>Interactive Curriculum Preview</span>
                </div>
                <h3 className="kwl-banner-title">
                  Professional Compliance &amp; AML Certification
                </h3>
                <p className="kwl-banner-sub">
                  Master transaction monitoring, sanctions screening &amp; CDD
                  with practical scenarios.
                </p>
              </div>

              {/* Learner / Professional Profile & Curriculum Preview Card */}
              <div className="kwl-profile-preview-card">
                {/* Profile row */}
                <div className="kwl-profile-row">
                  <div className="kwl-avatar-circle" aria-hidden="true">
                    AM
                  </div>
                  <div className="kwl-profile-meta">
                    <div className="kwl-name-badge-row">
                      <span className="kwl-user-name">Alex Morgan</span>
                      <span className="kwl-verified-tag">
                        <FaCheck size={9} aria-hidden="true" />
                        <span>Verified Specialist</span>
                      </span>
                    </div>
                    <span className="kwl-user-role">
                      Compliance Analyst • Global Banking Track
                    </span>
                  </div>
                </div>

                {/* Selected Domain Tags */}
                <div className="kwl-domain-chips">
                  <span className="kwl-chip kwl-chip-gold">AML</span>
                  <span className="kwl-chip">KYC &amp; CDD</span>
                  <span className="kwl-chip">Sanctions</span>
                  <span className="kwl-chip">Transaction Monitoring</span>
                  <span className="kwl-chip">Risk Assessment</span>
                </div>

                {/* Modules Preview List */}
                <div className="kwl-modules-list">
                  {/* Module 1: Active Progress */}
                  <div className="kwl-module-card kwl-module-active">
                    <div className="kwl-module-header">
                      <div>
                        <span className="kwl-module-num">MODULE 01</span>
                        <h4 className="kwl-module-title">
                          Customer Due Diligence (CDD) Mastery
                        </h4>
                      </div>
                      <span className="kwl-status-pill kwl-pill-progress">
                        75% Completed
                      </span>
                    </div>
                    <div className="kwl-progress-track" aria-hidden="true">
                      <div
                        className="kwl-progress-bar"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <div className="kwl-module-footer">
                      <span>8 of 10 Lessons Done</span>
                      <span>Case Simulation Lab</span>
                    </div>
                  </div>

                  {/* Module 2: Upcoming */}
                  <div className="kwl-module-card">
                    <div className="kwl-module-header">
                      <div>
                        <span className="kwl-module-num">MODULE 02</span>
                        <h4 className="kwl-module-title">
                          Sanctions Screening &amp; Watchlist Management
                        </h4>
                      </div>
                      <span className="kwl-status-pill kwl-pill-next">
                        Next Up
                      </span>
                    </div>
                    <div className="kwl-module-footer">
                      <span>6 Real-world Scenarios</span>
                      <span>PEP Resolution</span>
                    </div>
                  </div>

                  {/* Module 3: Scheduled */}
                  <div className="kwl-module-card">
                    <div className="kwl-module-header">
                      <div>
                        <span className="kwl-module-num">MODULE 03</span>
                        <h4 className="kwl-module-title">
                          Transaction Monitoring &amp; Financial Crime
                        </h4>
                      </div>
                      <span className="kwl-status-pill kwl-pill-scheduled">
                        Upcoming
                      </span>
                    </div>
                    <div className="kwl-module-footer">
                      <span>Alert Triage &amp; SAR Drafting</span>
                      <span>Capstone Project</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
