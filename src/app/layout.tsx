import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVYN",
  description: "Your saved content, made searchable and revisitable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
