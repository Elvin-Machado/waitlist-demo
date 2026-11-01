import "@/App.css";
import "@/NewDesign.css";
import ConditionalNav from "@/components/ConditionalNav";

export const metadata = {
  title: "KAWS Academy — Financial Crime & Compliance Education",
  description:
    "Building the next generation of compliance and financial crime professionals through structured, practical and career-focused education.",
  icons: { icon: [{ url: "/faviconlogo2.png", type: "image/png" }] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <div className="app-wrapper">
            <ConditionalNav />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
