"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

/**
 * Client wrapper that renders the NavBar only on pages that need it.
 * The /waitlist route uses a full-screen split layout and renders its own
 * navigation chrome inside the page component.
 */
export default function ConditionalNav() {
  const pathname = usePathname();
  if (pathname === "/waitlist") return null;
  return <NavBar />;
}
