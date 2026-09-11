"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { imageGallerySchema, GalleryImageInput } from "@/lib/schema";
import Lightbox from "./Lightbox";
import SectionEyebrow from "./SectionEyebrow";
import StructuredData from "./StructuredData";

const AUTO_ADVANCE_MS = 4000;

const GALLERY_PUBLISHED = "2026-03-02";

const images = [
  { src: "/images/construction-1.jpg", alt: "Construction progress — aerial view 1" },
  { src: "/images/construction-2.jpg", alt: "Construction progress — aerial view 2" },
  { src: "/images/construction-3.jpg", alt: "Construction progress — aerial view 3" },
  { src: "/images/construction-4.jpg", alt: "Construction progress — aerial view 4" },
  { src: "/images/construction-5.jpg", alt: "Construction progress — aerial view 5" },
  { src: "/images/construction-6.jpg", alt: "Construction progress — aerial view 6" },
  { src: "/images/construction-7.jpg", alt: "Construction progress — aerial view 7" },
  { src: "/images/construction-8.jpg", alt: "Construction progress — aerial view 8" },
];

const galleryImages: GalleryImageInput[] = images.map((img) => ({
  src: img.src,
  caption: img.alt,
  description: `${img.alt} — Generadora San Felipe 467 MW combined cycle plant under construction at Punta Caucedo, Boca Chica, Dominican Republic.`,
  datePublished: GALLERY_PUBLISHED,
}));

export default function ConstructionGallery() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  // Auto-advance unless paused by hover/focus, an open lightbox, the user's
  // explicit toggle, or the OS reduced-motion preference.
  useEffect(() => {
    if (prefersReducedMotion || userPaused || isPaused || lightboxOpen) return;
    const interval = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, userPaused, isPaused, lightboxOpen, next]);

  const effectivelyPaused = prefersReducedMotion || userPaused;

  return (
    <div className="bg-navy-50 py-16 lg:py-20 overflow-hidden">
      <StructuredData
        id="ld-construction-gallery"
        data={imageGallerySchema(
          "GSF-1 construction progress aerial views",
          galleryImages
        )}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <SectionEyebrow label={t.project.constructionTag} centered />
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {t.project.constructionTitle}
            </h2>
            <p className="mt-3 text-navy-500">
              {t.project.constructionSubtitle}
            </p>
          </div>

          {/* Slideshow */}
          <div
            className="relative rounded-2xl overflow-hidden bg-navy-900 shadow-xl focus-within:ring-2 focus-within:ring-accent-500 focus-within:ring-offset-2"
            role="region"
            aria-label={t.project.constructionTitle}
            aria-roledescription="carousel"
            tabIndex={0}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onKeyDown={(e) => {
              if (lightboxOpen) return;
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                prev();
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                next();
              } else if (e.key === "Enter" || e.key === " ") {
                if ((e.target as HTMLElement).tagName !== "BUTTON") {
                  e.preventDefault();
                  setLightboxOpen(true);
                }
              }
            }}
          >
            {/* Main Image */}
            <div
              className="group relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[2.5/1]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${current + 1} ${t.slideshow.slideOf} ${images.length}: ${images[current].alt}`}
            >
              {/* Live region announces the current slide to screen readers */}
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {`${current + 1} ${t.slideshow.slideOf} ${images.length}`}
              </div>
              <Image
                src={images[current].src}
                alt={images[current].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                quality={70}
                priority={current === 0}
              />

              {/* Click-to-open overlay (sits behind nav controls) */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute inset-0 z-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-inset"
                aria-label={t.project.constructionZoomHint}
              />

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Zoom hint — appears on hover */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5">
                  <svg aria-hidden="true"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                    />
                  </svg>
                  <span className="text-xs font-medium text-white">
                    {t.project.constructionZoomHint}
                  </span>
                </div>
              </div>

              {/* Date badge */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 pointer-events-none">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2">
                  <svg aria-hidden="true"
                    className="h-4 w-4 text-accent-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white">
                    {t.project.constructionDate}
                  </span>
                </div>
              </div>

              {/* Counter */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-none">
                <span className="text-sm font-mono text-white/70">
                  {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
              </div>

              {/* Prev/Next Arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                aria-label={t.lightbox.previous}
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                aria-label={t.lightbox.next}
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Progress Dots + Pause/Play */}
            <div className="relative flex items-center justify-center gap-2 py-4 bg-navy-950">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="group grid place-items-center min-h-[44px] min-w-[44px] -mx-2.5"
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  <span
                    aria-hidden="true"
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-8 bg-accent-500"
                        : "w-1.5 bg-navy-600 group-hover:bg-navy-400"
                    }`}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                disabled={!!prefersReducedMotion}
                aria-pressed={effectivelyPaused}
                aria-label={
                  effectivelyPaused ? t.project.constructionPlay : t.project.constructionPause
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              >
                {effectivelyPaused ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Lightbox
        open={lightboxOpen}
        images={images}
        index={current}
        onClose={() => setLightboxOpen(false)}
        onPrev={prev}
        onNext={next}
        caption={t.project.constructionDate}
        labels={t.lightbox}
      />
    </div>
  );
}
