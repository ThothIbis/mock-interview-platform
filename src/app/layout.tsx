import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import "./config-init";

export const metadata: Metadata = {
  title: "AI Mock Interview Platform",
  description: "Practice your interview skills with an AI interviewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
