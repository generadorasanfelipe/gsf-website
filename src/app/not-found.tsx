"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  const nf = t.notFound;

  return (
    <div className="relative min-h-[80vh] bg-navy-950 overflow-hidden">
      {/* Background gradient + faint diagonal lines */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.06]">
        <div className="absolute top-[20%] left-[-10%] w-[120%] h-px bg-white rotate-[-8deg]" />
        <div className="absolute top-[50%] left-[-10%] w-[120%] h-px bg-white rotate-[-8deg]" />
        <div className="absolute top-[80%] left-[-10%] w-[120%] h-px bg-white rotate-[-8deg]" />
      </div>

      <div className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-bold leading-none tracking-tight bg-gradient-to-br from-accent-400 to-accent-600 bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
        >
          {nf.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-xl text-base text-navy-300 leading-relaxed sm:text-lg"
        >
          {nf.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {nf.ctaHome}
          </Link>
          <Link
            href="/#project"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
          >
            {nf.ctaProject}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-xs text-navy-500"
        >
          {nf.brand}
        </motion.div>
      </div>
    </div>
  );
}
