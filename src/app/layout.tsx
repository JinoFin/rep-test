import type { Metadata } from "next";
import DemoActions from "./DemoActions";
import "./globals.css";
import "./product-visuals.css";

export const metadata: Metadata = {
  title: "InstaOps CRM",
  description: "Instagram DM order OS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <DemoActions />
      </body>
    </html>
  );
}
