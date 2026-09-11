"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const { locale, setLocale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "#project", label: t.nav.project },
    { href: "#sustainability", label: t.nav.sustainability },
  ];

  // Body scroll lock + focus management while menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      // Move focus into the menu after the open animation has had a moment
      const t = setTimeout(() => {
        menuRef.current
          ?.querySelector<HTMLElement>('a, button')
          ?.focus();
      }, 50);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
    // On close: restore focus to hamburger and unlock scroll
    document.body.style.overflow = "";
    hamburgerRef.current?.focus();
  }, [mobileOpen]);

  // Tab trap + Escape to close while the menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key === "Tab" && menuRef.current) {
        const focusables = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            'a, button:not([disabled])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  const toggleLocale = () => {
    setLocale(locale === "en" ? "es" : "en");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md shadow-sm"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <Link href="/" className="relative h-[3.75rem] w-[210px]">
            <Image
              src="/images/logo-gsf-new.png"
              alt="Generadora San Felipe"
              width={200}
              height={60}
              className="absolute inset-0 h-[3.75rem] w-auto object-contain object-left"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center min-h-[44px] px-2 text-sm font-medium tracking-wide text-navy-700 hover:text-accent-500 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={toggleLocale}
              className="inline-flex items-center min-h-[44px] text-xs font-bold tracking-wider uppercase border border-navy-200 text-navy-600 rounded-full px-4 hover:bg-navy-50 transition-all duration-300"
            >
              {locale === "en" ? "ES" : "EN"}
              <span className="sr-only"> — {t.langToggleAriaLabel}</span>
            </button>

            <a
              href="#complaints"
              className="inline-flex items-center min-h-[44px] rounded-full bg-accent-500 px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25"
            >
              {t.nav.contact}
            </a>
          </div>

          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-50 h-11 w-11 flex items-center justify-center"
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  mobileOpen
                    ? "rotate-45 translate-y-2 bg-white"
                    : "bg-navy-900"
                }`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "bg-navy-900"
                }`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  mobileOpen
                    ? "-rotate-45 -translate-y-2 bg-white"
                    : "bg-navy-900"
                }`}
              />
            </div>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menuLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-navy-950 flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-2xl font-medium text-white hover:text-accent-400 transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button
              onClick={() => {
                toggleLocale();
                setMobileOpen(false);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-medium text-white/60 hover:text-white transition-colors"
            >
              {locale === "en" ? "Cambiar a Español" : "Switch to English"}
            </motion.button>
            <motion.a
              href="#complaints"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 rounded-full bg-accent-500 px-8 py-3 text-lg font-bold text-black"
            >
              {t.nav.contact}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
