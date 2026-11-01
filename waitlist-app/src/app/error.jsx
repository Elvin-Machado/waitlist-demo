"use client";

export default function PageError({ reset }) {
  return (
    <main style={{ padding: "80px 24px", textAlign: "center" }}>
      <h1>Something went wrong</h1>
      <p style={{ margin: "16px 0" }}>Please try loading this page again.</p>
      <button type="button" onClick={reset}>Try again</button>
    </main>
  );
}
