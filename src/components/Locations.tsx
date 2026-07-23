"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import SectionEyebrow from "./SectionEyebrow";

const locations = [
  {
    id: "corporate",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.2!2d-69.9378025!3d18.4749218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89e626c1afed%3A0xe2cb4f15f0f3a999!2sEdificio%20Corporativo%202010!5e0!3m2!1sen!2sdo!4v1709500000000",
    mapsLink: "https://maps.app.goo.gl/UEyqim4fnhBpP18j8",
  },
  {
    id: "gsf1",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.5!2d-69.6361023!3d18.4104366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea58167e1793a69%3A0x3534108ea34f63fa!2sGeneradora%20San%20Felipe%20LP%20-%20Planta%20Andr%C3%A9s%20GSF-1%20CCPP!5e0!3m2!1ses!2sdo!4v1709500000000",
    mapsLink:
      "https://www.google.com/maps/place/Generadora+San+Felipe+LP+-+Planta+Andr%C3%A9s+GSF-1+CCPP/@18.4104366,-69.6361023,17z/data=!3m1!4b1!4m6!3m5!1s0x8ea58167e1793a69:0x3534108ea34f63fa!8m2!3d18.4104366!4d-69.6361023!16s%2Fg%2F11xzr1s_yl",
  },
];

export default function Locations() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState(0);

  const loc = locations[selected];

  return (
    <div id="locations" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <SectionEyebrow label={t.locations.tag} centered />
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {t.locations.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left — Address cards */}
            <div className="lg:col-span-2 space-y-4">
              {locations.map((location, i) => {
                const isSelected = selected === i;
                const label =
                  location.id === "corporate"
                    ? t.locations.corporateLabel
                    : t.locations.gsf1Label;
                const address =
                  location.id === "corporate"
                    ? t.locations.corporateAddress
                    : t.locations.gsf1Address;

                return (
                  <button
                    key={location.id}
                    onClick={() => setSelected(i)}
                    aria-pressed={isSelected}
                    aria-label={`${label} — ${address.replace(/\n/g, ", ")}`}
                    className={`w-full text-left rounded-xl border p-5 transition-all duration-300 ${
                      isSelected
                        ? "border-accent-500 bg-accent-50 shadow-sm"
                        : "border-navy-200 bg-white hover:border-navy-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 rounded-lg p-2.5 ${
                          isSelected
                            ? "bg-accent-500 text-white"
                            : "bg-navy-100 text-navy-500"
                        }`}
                      >
                        <svg aria-hidden="true"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div
                          className={`text-sm font-semibold ${
                            isSelected ? "text-accent-700" : "text-navy-900"
                          }`}
                        >
                          {label}
                        </div>
                        <div className="mt-1 text-sm text-navy-500 leading-relaxed whitespace-pre-line">
                          {address}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Link to Google Maps */}
              <a
                href={loc.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-accent-700 hover:text-accent-800 transition-colors mt-2"
              >
                {t.locations.openMaps}
                <svg aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>

            {/* Right — Google Maps embed */}
            <div className="lg:col-span-3">
              <a
                href={loc.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-navy-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <iframe
                  key={loc.id}
                  src={loc.embedUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none"
                  title={
                    loc.id === "corporate"
                      ? t.locations.corporateLabel
                      : t.locations.gsf1Label
                  }
                />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
