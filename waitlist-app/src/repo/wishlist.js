import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../utils/firebase";

/**
 * Adds a person to the Firestore waitlist collection.
 *
 * @param {string} name     - Full name (required)
 * @param {string} email    - Email address (required, used as the document ID)
 * @param {string} [phone]  - Phone number with country code (optional)
 * @param {string} [interest] - Selected interest area / domain (optional)
 */
export async function addToWaitlist(name, email, phone, interest) {

  if (!email) {
    throw new Error("Email is required");
  }

  if (!db) {
    throw new Error("The waitlist is temporarily unavailable. Please try again later.");
  }

  const emailId = email.trim().toLowerCase();

  const waitlistRef = doc(
    db,
    "waitlist",
    emailId
  );

  const payload = {
    name,
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
      throw new Error("This email is already on the waitlist.");
    }
    throw err;
  }
}