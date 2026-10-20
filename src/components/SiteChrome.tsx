"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Renders the public marketing chrome (Navbar + Footer) around the page, but
 * omits it on the /admin surface. The admin panel has its own header (with the
 * logout control) in src/app/admin/layout.tsx, so the marketing nav would be
 * both confusing and out of place there.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <>
      {!isAdmin && <Navbar />}
      <main id="main">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
