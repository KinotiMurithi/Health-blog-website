
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Afya Notes | Clear Health Information",
    template: "%s | Afya Notes",
  },
  description:
    "Explore accessible health education, maternal and child health, adolescent health, and information about common medical conditions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
