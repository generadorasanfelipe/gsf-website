"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const SOURCE_ASPECT_RATIO = 2440 / 1372;

type LocaleString = { en: string; es: string };

type Hotspot = {
  id: number;
  cx: number;
  cy: number;
  /** Optional bounding box, in viewBox coords, for a translucent zone fill */
  zone?: { x: number; y: number; width: number; height: number };
  name: LocaleString;
  description?: LocaleString;
};

// Coordinates extracted programmatically from gsf-plotplan-anotado.png
// via Swift flood-fill component detection on the colored zone highlights.
const HOTSPOTS: Hotspot[] = [
  {
    id: 1,
    cx: 465,
    cy: 941,
    zone: { x: 165, y: 825, width: 531, height: 210 },
    name: { es: "Subestación", en: "Substation" },
  },
  {
    id: 2,
    cx: 455,
    cy: 749,
    zone: { x: 377, y: 717, width: 158, height: 71 },
    name: {
      es: "Cuarto de Control — Subestación",
      en: "Substation Control Room",
    },
  },
  {
    id: 3,
    cx: 435,
    cy: 576,
    zone: { x: 163, y: 479, width: 536, height: 190 },
    name: {
      es: "Edificio de Almacén, Taller y Mantenimiento",
      en: "Warehouse, Workshop & Maintenance Building",
    },
  },
  {
    id: 4,
    cx: 601,
    cy: 325,
    zone: { x: 429, y: 288, width: 346, height: 77 },
    name: { es: "Edificio Administrativo", en: "Administration Building" },
  },
  {
    id: 5,
    cx: 1133,
    cy: 356,
    zone: { x: 1065, y: 321, width: 138, height: 72 },
    name: { es: "Almacén de Químicos", en: "Chemical Storage" },
  },
  {
    id: 6,
    cx: 1820,
    cy: 260,
    zone: { x: 1743, y: 155, width: 162, height: 240 },
    name: {
      es: "Planta de Tratamiento de Agua",
      en: "Water Treatment Plant",
    },
  },
  {
    id: 7,
    cx: 2207,
    cy: 732,
    zone: { x: 2147, y: 330, width: 122, height: 806 },
    name: { es: "Torre de Enfriamiento", en: "Cooling Tower" },
  },
  {
    id: 8,
    cx: 2235,
    cy: 1250,
    zone: { x: 2123, y: 1180, width: 232, height: 137 },
    name: {
      es: "Patio de Interconexión — Gas Natural",
      en: "Natural Gas Interconnection Yard",
    },
  },
  {
    id: 9,
    cx: 1768,
    cy: 1087,
    zone: { x: 1618, y: 1015, width: 299, height: 146 },
    name: {
      es: "HRSG — Caldera de Recuperación de Calor",
      en: "HRSG — Heat Recovery Steam Generator",
    },
  },
  {
    id: 10,
    cx: 1583,
    cy: 1080,
    zone: { x: 1550, y: 1040, width: 65, height: 80 },
    name: { es: "Chimenea By-Pass", en: "By-Pass Stack" },
  },
  {
    id: 11,
    cx: 1431,
    cy: 1075,
    zone: { x: 1247, y: 1024, width: 374, height: 108 },
    name: {
      es: "Turbina de Gas (GE 7HA.02)",
      en: "Gas Turbine (GE 7HA.02)",
    },
  },
  {
    id: 12,
    cx: 952,
    cy: 994,
    zone: { x: 911, y: 941, width: 81, height: 109 },
    name: {
      es: "Generador Turbina de Gas (H65)",
      en: "Gas Turbine Generator (H65)",
    },
  },
  {
    id: 13,
    cx: 1161,
    cy: 729,
    zone: { x: 1051, y: 683, width: 221, height: 96 },
    name: { es: "Edificio de Control", en: "Control Building" },
  },
  {
    id: 14,
    cx: 1243,
    cy: 525,
    zone: { x: 1209, y: 504, width: 73, height: 52 },
    name: {
      es: "Generador Turbina de Vapor (H35)",
      en: "Steam Turbine Generator (H35)",
    },
  },
  {
    id: 15,
    cx: 1577,
    cy: 655,
    zone: { x: 1433, y: 599, width: 288, height: 113 },
    name: {
      es: "Turbina de Vapor (GE STF-A650)",
      en: "Steam Turbine (GE STF-A650)",
    },
  },
];

export default function PlantMap({
  showAnnotationOverlay = false,
}: {
  /** Debug mode: overlay the user's annotated PNG above the inverted plan so we can verify hotspot positions visually. */
  showAnnotationOverlay?: boolean;
}) {
  const { locale, t } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const pick = (s: LocaleString) => (locale === "es" ? s.es : s.en);

  // ESC closes the panel
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const activeHotspot = HOTSPOTS.find((h) => h.id === active) ?? null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 shadow-2xl">
        {/* Grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className="relative w-full"
          style={{ aspectRatio: `${SOURCE_ASPECT_RATIO}` }}
        >
          {/* Inverted plot plan — optimized by next/image (WebP, responsive) */}
          <Image
            src="/images/gsf-plotplan-source.png"
            alt="GSF-1 plant plot plan"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="select-none object-contain"
            style={{
              filter: "invert(1) brightness(1.05) contrast(1.1)",
              mixBlendMode: "screen",
              opacity: 0.88,
            }}
            draggable={false}
          />

          {/* DEBUG: user annotation overlay — exact pixels the user painted */}
          {showAnnotationOverlay && (
            <Image
              src="/images/gsf-plotplan-anotado.png"
              alt="User annotation overlay (debug)"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="pointer-events-none select-none object-contain"
              style={{ opacity: 0.5, mixBlendMode: "normal" }}
              draggable={false}
            />
          )}

          {/* SVG overlay: accents + hotspots */}
          <svg
            viewBox="0 0 2440 1372"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="GSF-1 stylized plant map with numbered zones"
          >
            <defs>
              <radialGradient id="pm-accent-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Accent zone fills (rendered first so markers sit above) */}
            <g className="pointer-events-none">
              {HOTSPOTS.map((h) => {
                if (!h.zone) return null;
                const isActive = h.id === active;
                return (
                  <rect
                    key={`zone-${h.id}`}
                    x={h.zone.x}
                    y={h.zone.y}
                    width={h.zone.width}
                    height={h.zone.height}
                    rx="16"
                    fill="#f59e0b"
                    fillOpacity={isActive ? 0.22 : 0.05}
                    stroke="#f59e0b"
                    strokeOpacity={isActive ? 0.8 : 0.25}
                    strokeWidth={isActive ? 3 : 1.5}
                    strokeDasharray={isActive ? "0" : "8 6"}
                    style={{ transition: "fill-opacity 0.3s, stroke-opacity 0.3s" }}
                  />
                );
              })}
            </g>

            {/* Compass */}
            <g transform="translate(140, 160)" className="pointer-events-none">
              <circle cx="0" cy="0" r="44" fill="#0a1929" fillOpacity="0.7" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
              <path d="M 0 -32 L 9 8 L 0 0 L -9 8 Z" fill="#f59e0b" />
              <text x="0" y="-52" textAnchor="middle" fill="#ffffff" fillOpacity="0.9" fontSize="16" fontWeight="700">N</text>
            </g>

            {/* Scale bar */}
            <g transform="translate(2200, 1300)" className="pointer-events-none">
              <rect x="-10" y="-22" width="170" height="40" rx="6" fill="#0a1929" fillOpacity="0.7" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="10" y1="0" x2="140" y2="0" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2" />
              <line x1="10" y1="-6" x2="10" y2="6" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2" />
              <line x1="75" y1="-5" x2="75" y2="5" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />
              <line x1="140" y1="-6" x2="140" y2="6" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2" />
              <text x="75" y="-14" textAnchor="middle" fill="#ffffff" fillOpacity="0.8" fontSize="13" fontFamily="ui-monospace, monospace">≈ 50 m</text>
            </g>

            {/* Disclaimer */}
            <text x="120" y="1340" fill="#ffffff" fillOpacity="0.4" fontSize="14" fontFamily="ui-monospace, monospace" className="pointer-events-none">
              GSF-1 PLOT PLAN · STYLIZED REFERENCE · NOT TO SCALE
            </text>

            {/* Hotspot markers (rendered last so they stay on top) */}
            <g>
              {HOTSPOTS.map((h) => {
                const isActive = h.id === active;
                return (
                  <g key={`mark-${h.id}`}>
                    {/* Pulse ring */}
                    {!reduceMotion && (
                      <motion.circle
                        cx={h.cx}
                        cy={h.cy}
                        r={28}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: h.id * 0.18,
                        }}
                        style={{ transformOrigin: `${h.cx}px ${h.cy}px` }}
                      />
                    )}
                    {/* Outer halo */}
                    <circle
                      cx={h.cx}
                      cy={h.cy}
                      r={38}
                      fill="url(#pm-accent-glow)"
                      className="pointer-events-none"
                    />
                    {/* Visible focus ring for keyboard users (replaces the
                        suppressed default outline). */}
                    {focused === h.id && (
                      <circle
                        cx={h.cx}
                        cy={h.cy}
                        r={36}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={4}
                        strokeDasharray="7 5"
                        className="pointer-events-none"
                      />
                    )}
                    {/* Marker button — invisible bigger hit area */}
                    <circle
                      cx={h.cx}
                      cy={h.cy}
                      r={44}
                      fill="transparent"
                      className="cursor-pointer focus:outline-none"
                      onClick={() => setActive(h.id === active ? null : h.id)}
                      onFocus={() => setFocused(h.id)}
                      onBlur={() => setFocused((f) => (f === h.id ? null : f))}
                      role="button"
                      tabIndex={0}
                      aria-label={`${t.plantMap.openZoneAria} ${h.id}: ${pick(h.name)}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActive(h.id === active ? null : h.id);
                        }
                      }}
                    />
                    {/* Visible disc */}
                    <circle
                      cx={h.cx}
                      cy={h.cy}
                      r={isActive ? 26 : 22}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeOpacity={isActive ? 1 : 0.85}
                      strokeWidth={isActive ? 3 : 2.5}
                      className="pointer-events-none"
                      style={{ transition: "r 0.2s, stroke-opacity 0.2s" }}
                    />
                    {/* Number label */}
                    <text
                      x={h.cx}
                      y={h.cy + 7}
                      textAnchor="middle"
                      fill="#0a1929"
                      fontSize="22"
                      fontWeight="800"
                      className="pointer-events-none select-none"
                    >
                      {h.id}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Side panel */}
      <aside
        ref={panelRef}
        className="rounded-2xl border border-navy-200 bg-white p-6 lg:sticky lg:top-24"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-navy-500">
          {t.plantMap.zoneDetail}
        </h2>
        <AnimatePresence mode="wait">
          {activeHotspot ? (
            <motion.div
              key={activeHotspot.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-base font-bold text-black">
                  {activeHotspot.id}
                </span>
                <h3 className="text-lg font-semibold text-navy-900">
                  {pick(activeHotspot.name)}
                </h3>
              </div>
              {activeHotspot.description && (
                <p className="mt-3 text-sm leading-relaxed text-navy-600">
                  {pick(activeHotspot.description)}
                </p>
              )}
              <button
                type="button"
                onClick={() => setActive(null)}
                className="mt-4 text-xs font-medium uppercase tracking-wider text-accent-600 hover:text-accent-700"
              >
                {t.plantMap.close}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <p className="text-sm text-navy-500">{t.plantMap.emptyHelp}</p>
              <ol className="mt-4 space-y-1 text-sm text-navy-700">
                {HOTSPOTS.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => setActive(h.id)}
                      className="text-left hover:text-accent-600"
                    >
                      <span className="inline-block w-6 font-mono font-bold text-accent-600">
                        {h.id}.
                      </span>{" "}
                      {pick(h.name)}
                    </button>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
