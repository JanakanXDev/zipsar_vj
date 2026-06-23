import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SkipToContent, ScanlineOverlay, CRTVignette, FloatingNav } from "@/components/ui";
import { brand, seoContent, services } from "@/content/contentBible";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoContent.url),
  title: {
    default: seoContent.title,
    template: `%s · ${brand.name}`,
  },
  description: seoContent.description,
  applicationName: brand.name,
  keywords: [
    brand.name,
    brand.tagline,
    ...services.items.map((service) => service.name),
    "software development studio",
    "product design",
  ],
  authors: [{ name: brand.name, url: seoContent.url }],
  creator: brand.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: seoContent.title,
    description: seoContent.description,
    url: seoContent.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: seoContent.title,
    description: seoContent.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="bg-void text-foreground font-sans antialiased">
        <SkipToContent />
        <ScanlineOverlay />
        <CRTVignette />
        <FloatingNav />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

