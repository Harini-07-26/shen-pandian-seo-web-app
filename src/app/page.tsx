import { redirect } from "next/navigation";

/**
 * Root page – redirect straight to the dashboard.
 * In production this would check auth and redirect to /login if needed.
 */
export default function HomePage() {
  redirect("/dashboard");
}
