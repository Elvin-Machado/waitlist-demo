import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: "80px 24px", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p style={{ margin: "16px 0" }}>The page you requested could not be found.</p>
      <Link href="/">Back to home</Link>
    </main>
  );
}
