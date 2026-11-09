"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiArrowRight, FiCheck, FiCheckCircle, FiMail, FiBookOpen, FiLayers, FiTrendingUp } from "react-icons/fi";
import { validateEmail } from "../utils/validate-email";
import { addToWaitlist } from "../repo/wishlist";
import coursesData from "../data/CoursesData";
import Footer from "./Footer";
import "../Waitlist.css";

const DOMAIN_NAMES = coursesData.map((domain) => domain.domain);
const BENEFITS = [
  { icon: FiBookOpen, title: "A clear path through compliance", text: "Explore 12 learning domains, from AML foundations to advanced investigations." },
  { icon: FiLayers, title: "Skills for the work ahead", text: "Build understanding through practical scenarios, simulation and live learning." },
  { icon: FiTrendingUp, title: "Support for your next step", text: "Prepare for opportunities with career guidance and professional development." },
];

export default function WaitingListForm() {
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting, errors } } = useForm({
    defaultValues: { name: "", email: "", phone: "", interest: "" },
  });
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [formError, setFormError] = useState("");
  const successRef = useRef(null);

  useEffect(() => {
    const interest = new URLSearchParams(window.location.search).get("interest");
    if (DOMAIN_NAMES.includes(interest)) setValue("interest", interest);
  }, [setValue]);

  useEffect(() => {
    if (submittedEmail) successRef.current?.focus();
  }, [submittedEmail]);

  async function onSubmit(data) {
    setFormError("");
    try {
      await addToWaitlist(data.name, data.email, data.phone ? `+91${data.phone}` : "", data.interest);
      setSubmittedEmail(data.email.trim().toLowerCase());
      reset();
    } catch (error) {
      setFormError(error?.message || "We couldn’t save your details. Please try again.");
    }
  }

  return (
    <>
      <main className="academy-waitlist" id="main-content">
        <div className="k-container">
          <Link href="/" className="academy-waitlist-back"><FiArrowLeft aria-hidden="true" /> Back to the academy</Link>
          <div className="academy-waitlist-grid">
            <div className="academy-waitlist-copy">
              <h1>Your next chapter<br />in compliance<br /><span>starts here.</span></h1>
              <p>Be among the first to learn with KAWS Academy. Join the waitlist for practical, career-focused education in financial crime and compliance.</p>
              <div className="academy-waitlist-benefits">{BENEFITS.map(({ icon: Icon, title, text }) => <div key={title}><span><Icon aria-hidden="true" /></span><div><h2>{title}</h2><p>{text}</p></div></div>)}</div>
              <div className="academy-waitlist-note"><FiCheck aria-hidden="true" /><span>For students, career changers and working professionals.</span></div>
            </div>
            <div className="academy-form-card">
              {!submittedEmail ? (
                <>
                  <span className="academy-form-kicker">STAY ONE STEP AHEAD</span>
                  <h2>Join the waitlist</h2>
                  <p className="academy-form-intro">Leave your details. We’ll let you know when our programs are ready.</p>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting}>
                    <div className="academy-field">
                      <label htmlFor="wl-name">Full name <span>*</span></label>
                      <input id="wl-name" autoComplete="name" placeholder="Your full name" maxLength={100} disabled={isSubmitting} aria-invalid={!!errors.name} aria-describedby={errors.name ? "wl-name-error" : undefined} {...register("name", { setValueAs: value => value.trim(), required: "Please enter your full name.", minLength: { value: 2, message: "Please enter at least two characters." } })} />
                      {errors.name && <p className="academy-field-error" id="wl-name-error">{errors.name.message}</p>}
                    </div>
                    <div className="academy-field">
                      <label htmlFor="wl-email">Email address <span>*</span></label>
                      <input id="wl-email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} disabled={isSubmitting} aria-invalid={!!errors.email} aria-describedby={errors.email ? "wl-email-error" : undefined} {...register("email", { setValueAs: value => value.trim(), required: "Please enter your email address.", validate: value => validateEmail(value) || "Please enter a valid email address." })} />
                      {errors.email && <p className="academy-field-error" id="wl-email-error">{errors.email.message}</p>}
                    </div>
                    <div className="academy-field">
                      <label htmlFor="wl-phone">Phone number <span className="academy-optional">(optional)</span></label>
                      <div className="academy-phone"><span aria-hidden="true">+91</span><input id="wl-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile number" maxLength={10} disabled={isSubmitting} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "wl-phone-error wl-phone-hint" : "wl-phone-hint"} {...register("phone", { setValueAs: value => value.trim(), validate: value => !value || /^[6-9][0-9]{9}$/.test(value) || "Enter a valid 10-digit Indian mobile number." })} /></div>
                      <span id="wl-phone-hint" className="academy-visually-hidden">India country code +91</span>
                      {errors.phone && <p className="academy-field-error" id="wl-phone-error">{errors.phone.message}</p>}
                    </div>
                    <div className="academy-field">
                      <label htmlFor="wl-interest">Area of interest <span className="academy-optional">(optional)</span></label>
                      <select id="wl-interest" disabled={isSubmitting} {...register("interest")}><option value="">I’m still exploring</option>{DOMAIN_NAMES.map(name => <option key={name} value={name}>{name}</option>)}</select>
                    </div>
                    {formError && <div className="academy-form-error" role="alert">{formError} <a href="mailto:kawsacademy@gmail.com">Contact our team</a></div>}
                    <button className="k-btn academy-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Joining the waitlist…" : "Join the waitlist"} {!isSubmitting && <FiArrowRight aria-hidden="true" />}</button>
                    <p className="academy-form-fineprint">Free to join. No payment required.<br />We’ll use your details to keep you informed about KAWS Academy.</p>
                  </form>
                </>
              ) : (
                <div className="academy-form-success" ref={successRef} tabIndex={-1}>
                  <FiCheckCircle aria-hidden="true" />
                  <h2>You’re on the list.</h2>
                  <p>We’ve saved <strong>{submittedEmail}</strong> to the KAWS Academy waitlist.</p>
                  <div className="academy-success-next"><FiMail aria-hidden="true" /><p>Look out for launch updates and program announcements in your inbox.</p></div>
                  <Link href="/courses" className="k-btn">Explore the curriculum <FiArrowRight aria-hidden="true" /></Link>
                  <Link href="/" className="academy-text-link">Back to the academy</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}