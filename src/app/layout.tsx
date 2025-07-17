import { ThemeProvider } from "next-themes";
import "~/styles/globals.css";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="A modern, offline-first travel checklist app. Plan, pack, and never forget your essentials." />
        <meta property="og:title" content="Travel Checklist" />
        <meta property="og:description" content="A modern, offline-first travel checklist app. Plan, pack, and never forget your essentials." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://travel-checklist.matv.io" />
        <meta property="og:image" content="/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Travel Checklist" />
        <meta name="twitter:description" content="A modern, offline-first travel checklist app. Plan, pack, and never forget your essentials." />
        <meta name="twitter:image" content="/opengraph-image.png" />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
