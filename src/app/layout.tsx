import type { Metadata } from "next";
import DemoActions from "./DemoActions";
import EfficiencyShowcase from "./EfficiencyShowcase";
import "./globals.css";
import "./product-visuals.css";
import "./efficiency-showcase.css";

export const metadata: Metadata = {
  title: "InstaOps CRM",
  description: "Instagram DM order OS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EfficiencyShowcase />
        {children}
        <DemoActions />
      </body>
    </html>
  );
}
