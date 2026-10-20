import type { Metadata } from "next";

// The page itself is a client component, so its per-page SEO metadata lives here
// in a route layout. Without this, /complaints inherited the homepage title and
// a canonical pointing at "/", so Google treated it as a duplicate of the home
// page and link previews showed the homepage card.
export const metadata: Metadata = {
  title: "Canal de Quejas y Denuncias | Generadora San Felipe",
  description:
    "Canal confidencial de quejas, reclamos y denuncias de Generadora San Felipe. Reporta de forma segura — puedes hacerlo de forma anónima.",
  alternates: { canonical: "/complaints" },
  openGraph: {
    title: "Canal de Quejas y Denuncias | Generadora San Felipe",
    description:
      "Canal confidencial de quejas, reclamos y denuncias. Reporta de forma segura, incluso de forma anónima.",
    url: "/complaints",
    type: "website",
    images: ["/images/og-image.jpg"],
  },
};

export default function ComplaintsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
