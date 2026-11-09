"use client";

import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
  FaArrowRight,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const SECTION_LINKS = [
  { id: "domains", label: "Courses" },
  { id: "approach", label: "How you’ll learn" },
  { id: "team", label: "Our team" },
  { id: "faq", label: "FAQs" },
];

// Profile avatar with graceful fallback if photoURL is missing or fails to load
function UserAvatar({ src }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  return (
    <span className="profilePillAvatar">
      {src && !imgError ? (
        <img
          src={src}
          alt=""
          className="profileAvatarImg"
          onError={() => setImgError(true)}
        />
      ) : (
        <FaUser className="profileDefaultAvatarIcon" />
      )}
    </span>
  );
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close the drawer with the Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Active section indication while scrolling the landing page
  useEffect(() => {
    if (!isHome) {
      setActiveId("");
      return;
    }
    const sections = SECTION_LINKS.map((link) =>
      document.getElementById(link.id)
    ).filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setUserName("");
        localStorage.removeItem("kaws_cart");
        window.dispatchEvent(new Event("kaws_cart_updated"));
        return;
      }

      try {
        setUserName(user.displayName || user.email);

        // Sync cart from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (Array.isArray(userData.cart)) {
            localStorage.setItem("kaws_cart", JSON.stringify(userData.cart));
            window.dispatchEvent(new Event("kaws_cart_updated"));
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsOpen(false);
    router.push("/");
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      alert("Sign-in is temporarily unavailable. Please try again later.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      setUserName(result.user.displayName || result.user.email);
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  const goToSection = (event, id) => {
    event?.preventDefault();
    setIsOpen(false);

    if (isHome) {
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

  const navClass = [
    "k-nav",
    scrolled ? "is-solid" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className="k-nav-header">
    <nav className={navClass} aria-label="Primary">
      <div className="k-nav-inner">
        <Link href="/" className="k-brand" onClick={() => setIsOpen(false)}>
          <img src="/logo_edt.png" alt="KAWS Academy" className="k-brand-logo" />
          <span>
            <span className="k-brand-name">KAWS Academy</span>
            <span className="k-brand-tag">Financial Crime &amp; Compliance</span>
          </span>
        </Link>

        <div className="k-nav-links">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              className={`k-nav-link ${activeId === link.id ? "is-active" : ""}`}
              onClick={(event) => goToSection(event, link.id)}
              aria-current={activeId === link.id ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="k-nav-actions">
          {currentUser ? (
            <div className="profileDropdownContainer" ref={dropdownRef}>
              <button
                type="button"
                className={`profilePillTrigger ${isDropdownOpen ? "active" : ""}`}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
              >
                <UserAvatar src={currentUser.photoURL} />
                <span className="profilePillName">
                  {userName || "My Account"}
                </span>
                <FaChevronDown
                  className={`profileChevron ${isDropdownOpen ? "open" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="profileDropdownMenu">
                  <div className="profileDropdownHeader">
                    <p className="profileDropdownHeaderName">
                      {userName || "User"}
                    </p>
                    <p className="profileDropdownHeaderEmail">
                      {currentUser.email}
                    </p>
                  </div>
                  <div className="profileDropdownDivider" />
                  <button
                    type="button"
                    className="profileDropdownItem profileDropdownLogout"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <FaSignOutAlt className="profileDropdownItemIcon" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="modernSignInBtn"
            >
              <FcGoogle className="googleBtnIcon" />
              <span>Sign In</span>
            </button>
          )}

          <Link href="/waitlist" className="k-btn k-btn--sm k-nav-cta">
            Join the waitlist
            <FaArrowRight size={11} />
          </Link>
        </div>

        <button
          type="button"
          className="k-nav-burger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="k-drawer-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="k-drawer" role="dialog" aria-modal="true">
            <div className="k-drawer-top">
              <Link
                href="/"
                className="k-brand"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src="/logo_edt.png"
                  alt="KAWS Academy"
                  className="k-brand-logo"
                />
                <span className="k-brand-name" style={{ color: "#0b1220" }}>
                  KAWS Academy
                </span>
              </Link>
              <button
                type="button"
                className="k-drawer-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="k-drawer-links">
              <Link
                href="/"
                className="k-drawer-link"
                onClick={() => setIsOpen(false)}
              >
                Home
                <span className="k-drawer-index">01</span>
              </Link>
              {SECTION_LINKS.map((link, index) => (
                <a
                  key={link.id}
                  href={`/#${link.id}`}
                  className="k-drawer-link"
                  onClick={(event) => goToSection(event, link.id)}
                >
                  {link.label}
                  <span className="k-drawer-index">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </div>

            <div className="k-drawer-auth">
              {currentUser ? (
                <div className="mobileProfileSection" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
                  <div className="mobileProfileHeader">
                    <UserAvatar src={currentUser.photoURL} />
                    <div>
                      <p className="mobileProfileName">{userName || "User"}</p>
                      <p className="mobileProfileEmail">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="mobileProfileItem mobileLogoutBtn"
                  >
                    <FaSignOutAlt className="mobileItemIcon" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="mobileSignInBtn"
                  style={{ marginTop: 0 }}
                >
                  <FcGoogle className="googleBtnIcon" />
                  <span>Sign In with Google</span>
                </button>
              )}
              <Link
                href="/waitlist"
                className="k-btn k-drawer-cta"
                onClick={() => setIsOpen(false)}
              >
                Join the Waitlist
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>

    </header>
  );
}
