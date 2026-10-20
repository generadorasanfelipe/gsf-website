import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import SkipLink from "@/components/SkipLink";
import StructuredData from "@/components/StructuredData";
import { Providers } from "@/components/Providers";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gsf-website-sable.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Generadora San Felipe | Central de ciclo combinado de 467 MW",
  description:
    "Generadora San Felipe construye una central de ciclo combinado de 467 MW en República Dominicana — fortaleciendo la seguridad energética del país con tecnología GE Vernova 7HA.02 de clase mundial.",
  keywords: [
    "Generadora San Felipe",
    "GSF",
    "ciclo combinado",
    "467 MW",
    "República Dominicana",
    "generación eléctrica",
    "GE Vernova 7HA.02",
    "energía",
    "sostenibilidad",
    "Pantone 2955",
    "power generation",
    "Dominican Republic",
    "combined cycle",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "es-DO": "/",
      en: "/",
    },
  },
  openGraph: {
    title: "Generadora San Felipe | Central de ciclo combinado de 467 MW",
    description:
      "Construyendo el futuro energético de la República Dominicana: 467 MW de generación eficiente, confiable y sostenible.",
    type: "website",
    url: "/",
    locale: "es_DO",
    alternateLocale: ["en_US"],
    siteName: "Generadora San Felipe",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vista aérea del sitio de construcción de Generadora San Felipe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generadora San Felipe | Central de ciclo combinado de 467 MW",
    description:
      "Construyendo el futuro energético de la República Dominicana: 467 MW de generación eficiente, confiable y sostenible.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <StructuredData id="ld-organization" data={organizationSchema()} />
        <StructuredData id="ld-website" data={websiteSchema()} />
        <Providers>
          <SkipLink />
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
