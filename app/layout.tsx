import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/lib/demo-context";
import { GCoreProvider } from "@/lib/gcore-context";

export const metadata: Metadata = {
  title: "Merit | Behavioral banking loyalty infrastructure",
  description:
    "Merit turns everyday banking behavior into personalized goals, meaningful rewards and a portable financial-consistency status — for banks, customers and merchants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <DemoProvider>
          <GCoreProvider>{children}</GCoreProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
