import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EduGrade AI", template: "%s · EduGrade AI" },
  description: "Smart Teaching. Faster Feedback. Better Learning.",
  applicationName: "EduGrade AI",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
