import type { Metadata } from "next";

// Per-page SEO metadata for the (client-component) privacy page, so it no longer
// inherits the homepage title and a canonical pointing at "/".
export const metadata: Metadata = {
  title: "Aviso de Privacidad | Generadora San Felipe",
  description:
    "Aviso de privacidad de Generadora San Felipe: cómo recopilamos, usamos y protegemos los datos personales en gsf.com.do.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Aviso de Privacidad | Generadora San Felipe",
    description:
      "Cómo Generadora San Felipe recopila, usa y protege los datos personales.",
    url: "/privacy",
    type: "website",
    images: ["/images/og-image.jpg"],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
