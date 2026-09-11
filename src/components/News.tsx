"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import FadeIn from "./FadeIn";
import SectionEyebrow from "./SectionEyebrow";

const featuredArticles = [
  {
    image: "/images/news/diariolibre.jpg",
    source: "Diario Libre",
    date: "Aug 10, 2026",
    dateEs: "10 Ago 2026",
    dateIso: "2026-08-10",
    titleEn:
      "Abinader visits plant that will add 467 MW to the electrical grid and start operations in 2027",
    titleEs:
      "Abinader visita planta que aportará 467 MW al sistema eléctrico y entrará en operación en 2027",
    url: "https://www.diariolibre.com/economia/energia/2026/08/10/generadora-san-felipe-andres-i-y-su-impacto-en-la-generacion-electrica/3625278",
  },
  {
    image: "/images/news/mem.jpg",
    source: "Ministerio de Energía y Minas",
    date: "Apr 19, 2026",
    dateEs: "19 Abr 2026",
    dateIso: "2026-04-19",
    titleEn:
      "San Felipe I takes shape: Government supervises project that will add 470 MW and strengthen the country's electrical security",
    titleEs:
      "San Felipe I toma forma: Gobierno supervisa obra que sumará 470 MW y reforzará la seguridad eléctrica del país",
    url: "https://mem.gob.do/san-felipe-i-toma-forma-gobierno-supervisa-obra-que-sumara-470-mw-y-reforzara-la-seguridad-electrica-del-pais/",
  },
  {
    image: "/images/news/presidencia.jpg",
    source: "Presidencia de la República",
    date: "Aug 11, 2025",
    dateEs: "11 Ago 2025",
    dateIso: "2025-08-11",
    titleEn:
      "Minister Joel Santos supervises construction of Generadora San Felipe I alongside the Electric Cabinet",
    titleEs:
      "Ministro Joel Santos supervisa, junto con representantes del Gabinete Eléctrico, construcción Generadora San Felipe I",
    url: "https://presidencia.gob.do/noticias/ministro-joel-santos-supervisa-junto-con-representantes-del-gabinete-electrico",
  },
];

const articles = [
  {
    image: "/images/news/gevernova.jpg",
    source: "GE Vernova",
    date: "Dec 17, 2024",
    dateEs: "17 Dic 2024",
    dateIso: "2024-12-17",
    titleEn:
      "GE Vernova announces the first Class H order in the Caribbean",
    titleEs:
      "GE Vernova anuncia el primer pedido de Clase H en el Caribe",
    url: "https://www.gevernova.com/news/press-releases/ge-vernova-anuncia-el-primer-pedido-de-clase-h-en-el-caribe",
  },
  {
    image: "/images/news/eldia.webp",
    source: "El Día",
    date: "Aug 11, 2025",
    dateEs: "11 Ago 2025",
    dateIso: "2025-08-11",
    titleEn:
      "Generadora San Felipe I will create more than 650 jobs",
    titleEs:
      "Generadora San Felipe I creará más 650 empleos",
    url: "https://eldia.com.do/generadora-san-felipe-i-creara-mas-650-empleos/",
  },
  {
    image: "/images/news/hoy.jpeg",
    source: "Hoy Digital",
    date: "Jul 28, 2025",
    dateEs: "28 Jul 2025",
    dateIso: "2025-07-28",
    titleEn:
      "By 2028, the Dominican Republic will have robust energy generation",
    titleEs:
      "Hacia el año 2028 la República Dominicana tendrá una generación robusta de energía",
    url: "https://hoy.com.do/economia/hacia-el-ano-2028-la-republica-dominicana-tendra-una-generacion-robusta-de-energia_1047689.html",
  },
  {
    image: "/images/news/bnamericas.jpg",
    source: "BNAmericas",
    date: "2025",
    dateEs: "2025",
    dateIso: "2025-01-01",
    titleEn:
      "Pending agreements from 800MW tender approved in Dominican Republic",
    titleEs:
      "Aprueban acuerdos pendientes de licitación de 800MW en República Dominicana",
    url: "https://www.bnamericas.com/es/noticias/aprueban-acuerdos-pendientes-de-licitacion-de-800mw-en-republica-dominicana",
  },
  {
    image: "/images/news/acento.webp",
    source: "Acento",
    date: "Feb 27, 2026",
    dateEs: "27 Feb 2026",
    dateIso: "2026-02-27",
    titleEn:
      "Accountability Report 2026: Joel Santos explains plan to incorporate new megawatts into the system",
    titleEs:
      "Rendición de Cuentas 2026: Joel Santos explica plan de incorporación de nuevos megavatios al sistema",
    url: "https://acento.com.do/economia/rendicion-de-cuentas-2026-joel-santos-explica-plan-de-incorporacion-de-nuevos-megavatios-al-sistema-9630783.html",
  },
];

// Note: we intentionally do NOT emit NewsArticle JSON-LD here.
// These cards are external press coverage about GSF, not articles
// published on this site. Marking them as NewsArticle would be a
// semantic misattribution (mainEntityOfPage points off-domain) and
// would not yield Rich Results for us either. The site-level
// Organization, WebSite, Event, and ImageGallery schemas remain.

export default function News() {
  const { t, locale } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="news" className="bg-gray-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <SectionEyebrow label={t.news.tag} />
          <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            {t.news.title}{" "}
            <span className="text-accent-500">{t.news.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-navy-500 leading-relaxed">
            {t.news.subtitle}
          </p>
        </FadeIn>

        {/* Featured articles */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article, i) => (
            <FadeIn key={article.url} delay={0.1 + i * 0.1}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:border-accent-200"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={locale === "es" ? article.titleEs : article.titleEn}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent" />
                </div>
                <div className="flex flex-col p-6 lg:p-8">
                  <div className="flex items-center gap-2 text-xs font-medium text-navy-500">
                    <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-700 font-semibold">
                      {article.source}
                    </span>
                    <span>•</span>
                    <span>{locale === "es" ? article.dateEs : article.date}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy-900 leading-tight group-hover:text-accent-600 transition-colors lg:text-xl">
                    {locale === "es" ? article.titleEs : article.titleEn}
                  </h3>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-500 group-hover:text-accent-600 transition-colors">
                    {t.news.readMore}
                    <svg aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* Grid of remaining articles */}
        <motion.div
          ref={ref}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {articles.map((article, i) => (
            <motion.a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:border-accent-200"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={locale === "es" ? article.titleEs : article.titleEn}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold text-navy-700">
                    {article.source}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-medium text-navy-500">
                  {locale === "es" ? article.dateEs : article.date}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-navy-900 leading-snug line-clamp-3 group-hover:text-accent-600 transition-colors">
                  {locale === "es" ? article.titleEs : article.titleEn}
                </h3>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent-500 group-hover:text-accent-600 transition-colors">
                  {t.news.readMore}
                  <svg aria-hidden="true"
                    className="h-3 w-3 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
