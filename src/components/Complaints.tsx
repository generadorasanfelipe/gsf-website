"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import FadeIn from "./FadeIn";
import SectionEyebrow from "./SectionEyebrow";

export default function Complaints() {
  const { t } = useI18n();

  return (
    <section id="complaints" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-50 to-white border border-navy-100 px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <SectionEyebrow label={t.complaintsSection.tag} className="mb-3" />
              <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                {t.complaintsSection.title}
              </h2>
              <p className="mt-4 text-base text-navy-500 leading-relaxed sm:text-lg">
                {t.complaintsSection.desc}
              </p>
            </div>
            <Link
              href="/complaints"
              className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-navy-950 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-800 hover:shadow-lg lg:flex-shrink-0"
            >
              {t.complaintsSection.btn}
              <svg aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
