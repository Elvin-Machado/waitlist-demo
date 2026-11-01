import { redirect } from "next/navigation";

/**
 * /waiting-list is a legacy alias — redirect permanently to the canonical /waitlist route.
 */
export default function Page() {
  redirect("/waitlist");
}
