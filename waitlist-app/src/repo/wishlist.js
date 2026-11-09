import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../utils/firebase";
import { validateEmail } from "../utils/validate-email";

/**
 * Adds a person to the Firestore waitlist collection.
 *
 * @param {string} name     - Full name (required)
 * @param {string} email    - Email address (required, used as the document ID)
 * @param {string} [phone]  - Phone number with country code (optional)
 * @param {string} [interest] - Selected interest area / domain (optional)
 */
export async function addToWaitlist(name, email, phone, interest) {

  const fullName = String(name || "").trim();
  const emailId = String(email || "").trim().toLowerCase();
  if (fullName.length < 2) throw new Error("Please enter your full name.");
  if (!validateEmail(emailId)) throw new Error("Please enter a valid email address.");

  if (!db) {
    throw new Error("The waitlist is temporarily unavailable. Please try again later.");
  }

  const waitlistRef = doc(
    db,
    "waitlist",
    emailId
  );

  const payload = {
    name: fullName,
    email: emailId,
    createdAt: serverTimestamp(),
  };

  if (phone && phone.trim()) {
    payload.phone = phone.trim();
  }

  if (interest && interest.trim()) {
    payload.interest = interest.trim();
  }

  try {
    await setDoc(waitlistRef, payload);
  } catch (err) {
    if (err?.code === "permission-denied" || err?.message?.includes("permission")) {
      throw new Error("We couldn’t save your details. Please contact our team or try again later.");
    }
    throw new Error("The waitlist is temporarily unavailable. Please try again later.");
  }
}
