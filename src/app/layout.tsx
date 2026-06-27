import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaOps CRM",
  description: "Instagram DM order OS for small business owners",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
