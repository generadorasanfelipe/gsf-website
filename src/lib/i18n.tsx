"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";

const STORAGE_KEY = "gsf-locale";
const ANNOUNCEMENT_CLEAR_MS = 1500;

export type Locale = "en" | "es";

type Translations = typeof en;

const en = {
  skipToContent: "Skip to main content",
  langToggleAriaLabel: "Switch to Spanish",
  langChanged: "Language changed to English",
  form: {
    requiredHint: "Fields marked with * are required.",
    requiredMark: "required",
  },
  slideshow: {
    slideOf: "of",
  },
  nav: {
    project: "Project",
    sustainability: "Sustainability",
    contact: "Contact Us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Navigation menu",
  },
  hero: {
    badge: "467MW Combined Cycle — Under Construction",
    headline1: "Efficient energy",
    headlineAccent: "powering",
    headline2: "the Dominican Republic",
    subtitle:
      "GSF-1 is a high-efficiency combined cycle plant delivering reliable, sustainable, and competitive power to the national grid — strengthening energy security for generations to come.",
    cta: "Contact Us",
    ctaSecondary: "Explore the Project",
    stat1value: "467",
    stat1unit: "MW",
    stat1label: "Net Capacity",
    stat2value: "64%",
    stat2label: "Thermal Efficiency",
    stat3value: "+$700M",
    stat3label: "Investment",
    turbineBadgeLabel: "GE Vernova",
    turbineBadgeValue: "7HA.02",
  },
  project: {
    tag: "The Project",
    title1: "World-class technology,",
    title2: "built for the future",
    subtitle:
      "The first power plant in the Caribbean and Central America to feature the GE Vernova 7HA.02 turbine — setting a new regional standard in efficiency and performance.",
    specConfig: "Configuration",
    specConfigVal: "Multi-shaft 1x1 Combined Cycle",
    specGas: "Gas Turbine",
    specGasVal: "GE Vernova 7HA.02",
    specSteam: "Steam Turbine",
    specSteamVal: "GE STF-A650",
    specNet: "Net Capacity",
    specNetVal: "467 MW",
    specContract: "Contract",
    specContractVal: "400 MW",
    turbineZoomAria: "Open full-size view of the GE Vernova 7HA.02 turbine",
    turbineLightboxDialogLabel: "GE Vernova 7HA.02 turbine — full size",
    locationTitle: "Strategic Location",
    locationValue: "Punta Caucedo, Boca Chica, Dominican Republic",
    locationGas: "Natural gas supplied via ENADOM storage & regasification",
    timelineTag: "Timeline",
    timelineTitle: "Project Milestones",
    statusCompleted: "Completed",
    statusUpcoming: "Upcoming",
    statusInProgress: "In Progress",
    tlProgressLabel: "Project progress",
    tlToday: "Today",
    tlDaysAgo: "{n} days ago",
    tlDaysUntil: "In {n} days",
    tlExpand: "Show details",
    tlCollapse: "Hide details",
    tlExpandAria: "Show details for",
    tlCollapseAria: "Hide details for",
    tl1year: "2024",
    tl1quarter: "April",
    tl1title: "Notice to Proceed",
    tl1desc:
      "Formal start of the EPC contract, contractor mobilization, and beginning of major civil works.",
    tl2year: "2025",
    tl2quarter: "Jul — Dec",
    tl2title: "Major Equipment Arrival",
    tl2desc:
      "Reception of the GE Vernova 7HA.02 gas turbine, steam turbine, generators, and HRSG modules on site.",
    tl3year: "2026",
    tl3quarter: "November",
    tl3title: "First Fire & Commissioning",
    tl3desc:
      "Initial ignition of the gas turbine, functional testing, performance validation, and reliability run.",
    tl4year: "2027",
    tl4quarter: "May",
    tl4title: "Commercial Operation",
    tl4desc:
      "Official declaration of commercial operation, delivering 400 MW under PPA contract.",
    constructionTag: "Construction Progress",
    constructionTitle: "Current Images",
    constructionSubtitle:
      "Aerial views of the GSF-1 construction site showing the latest progress.",
    constructionDate: "September 4, 2026",
    constructionZoomHint: "Click to enlarge",
    constructionPause: "Pause slideshow",
    constructionPlay: "Play slideshow",
    impactTag: "Impact",
    impactTitle: "Strategic infrastructure for sustainable development",
    impactSubtitle:
      "Generadora San Felipe strengthens the Dominican Republic's energy security while driving economic competitiveness.",
    impact1title: "Energy Security",
    impact1desc:
      "Firm, dispatchable capacity available 24/7 — reducing structural energy deficit risk and providing critical backup for renewable integration.",
    impact2title: "Competitiveness",
    impact2desc:
      "Highly efficient generation that reduces the marginal cost of the electric system, contributing to tariff stability and economic predictability.",
    impact3title: "Local Development",
    impact3desc:
      "Multiplier effect on employment, productive linkages, and local development during both the construction and operational phases.",
  },
  sustainability: {
    tag: "Sustainability",
    title1: "Built under the highest",
    titleAccent: "environmental standards",
    subtitle:
      "Aligned with the country's energy transition and sustainable development goals, GSF-1 sets new benchmarks in efficient power generation.",
    envTitle: "Environmental Performance",
    env1title: "Lower Emissions per MWh",
    env1desc:
      "Significantly reduced emissions per megawatt-hour generated, thanks to high-efficiency combined cycle technology.",
    env2title: "Reduced Carbon Footprint",
    env2desc:
      "Measurably lower carbon footprint compared to conventional thermal generation technologies.",
    env3title: "Optimized Fuel Consumption",
    env3desc:
      "Maximized energy output with minimal environmental impact through best-in-class thermal efficiency.",
    env4title: "Regulatory Compliance",
    env4desc:
      "Strict adherence to national and international environmental standards and regulations.",
    transTitle: "Responsible Energy Transition",
    trans1title: "Natural Gas Transition",
    trans1desc:
      "Using natural gas as a transition fuel, contributing to a cleaner and more diversified energy matrix.",
    trans2title: "Renewable Enabler",
    trans2desc:
      "Facilitating greater renewable penetration by providing flexibility and stability to the electrical grid.",
    trans3title: "Future-Ready Infrastructure",
    trans3desc:
      "Infrastructure designed for future technological improvements, including potential integration with decarbonization solutions.",
    socialTitle: "Social Commitment & Local Development",
    socialDesc:
      "Direct and indirect job creation during construction and operations. Support for local suppliers and productive linkages, with transparent and responsible governance focused on long-term sustainability.",
    reportsTitle: "Sustainability Reports",
    report1: "Environmental Impact Study",
    report2: "Climate Change Assessment",
    report3: "Human Rights Evaluation",
    report4: "GHG Emissions Report",
  },
  complaintsSection: {
    tag: "Transparency",
    title: "Complaints & Grievance Channel",
    desc: "We maintain a transparent and accessible channel for all complaints, grievances, and reports related to our operations.",
    btn: "Submit a Report",
  },
  news: {
    tag: "In the News",
    title: "GSF in the",
    titleAccent: "Media",
    subtitle:
      "Coverage and mentions of the Generadora San Felipe project in national and international media.",
    readMore: "Read Article",
  },
  locations: {
    tag: "Our Locations",
    title: "Where to Find Us",
    corporateLabel: "Corporate Office",
    corporateAddress: "Av. Gustavo Mejia Ricart #102, Suite 701\nPiantini, Sto. Dgo., Rep. Dom.",
    gsf1Label: "GSF-1",
    gsf1Address: "Calle Aurora Núm. 1, paraje Punta Caucedo\nAndrés Boca Chica, Sto. Dgo., Rep. Dom.",
    openMaps: "Open in Google Maps",
  },
  notFound: {
    title: "Page not found",
    subtitle:
      "The page you are looking for has moved, no longer exists, or never did. Use one of the buttons below to get back on track.",
    ctaHome: "Back to home",
    ctaProject: "Explore the Project",
    brand: "Generadora San Felipe — 467 MW Combined Cycle",
  },
  plantMap: {
    sectionTag: "Site Layout",
    sectionTitle: "Plant Plot Plan",
    sectionSubtitle:
      "Official EPC plot plan of the GSF-1 site with 15 identified zones. Click any numbered marker to see the working description of that zone.",
    zoneDetail: "Zone detail",
    close: "Close",
    emptyHelp:
      "Click a numbered marker on the map to see the working description of that zone.",
    openZoneAria: "Open details for zone",
  },
  footer: {
    company: "Generadora San Felipe Limited Partnership",
    navTitle: "Navigation",
    navNews: "News",
    navLocations: "Locations",
    resourcesTitle: "Resources",
    sitemap: "XML Sitemap",
    complaints: "Complaints & Grievances",
    epc: "EPC Contractor — TSK",
    contactTitle: "Contact",
    copyright: "All rights reserved.",
    sponsoredBy: "Sponsored by",
    followUs: "Follow us",
    instagramLabel: "Generadora San Felipe on Instagram",
    linkedinLabel: "Generadora San Felipe on LinkedIn",
    privacy: "Privacy Notice",
    languageToggleLabel: "Language",
  },
  complaints: {
    back: "Back to Home",
    title: "Complaints & Grievance Mechanism",
    subtitle:
      "We are committed to maintaining a transparent and accessible channel for all complaints, grievances, and reports related to our operations.",
    classGateTitle: "Who is submitting this report?",
    classGateSubtitle:
      "Select the option that applies so your report reaches the right team. This determines the department that will handle it.",
    classInternal: "Internal — GSF employee",
    classInternalDesc:
      "You are a member of the Generadora San Felipe staff.",
    classExternal: "External — community, supplier or third party",
    classExternalDesc:
      "You are part of the community, a supplier, or an external party.",
    classChange: "Change",
    typeLabel: "Type of Report",
    typeComplaint: "Complaint",
    typeGrievance: "Grievance",
    typeReport: "General Report",
    anonymous: "Submit anonymously",
    nameLabel: "Full Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone (optional)",
    phonePlaceholder: "(809) 000-0000",
    subjectLabel: "Subject",
    subjectPlaceholder: "Brief summary of your report",
    descLabel: "Description",
    descPlaceholder:
      "Please provide as much detail as possible about the complaint, grievance, or report.",
    submit: "Submit Report",
    submitting: "Submitting…",
    cancel: "Cancel",
    successTitle: "Report Submitted",
    successDesc:
      "Thank you for your submission. Our team will review your report and respond according to our grievance management procedures.",
    referenceLabel: "Reference code",
    referenceNote:
      "Save this code. You will need it to follow up on your report.",
    errorTitle: "We could not submit your report",
    errorDesc:
      "Please try again in a moment. If the problem persists, contact us at contacto@gsf.com.do.",
    errorCaptchaTitle: "Verification needed",
    errorCaptchaDesc:
      "Please complete the security check below before submitting.",
    errorRateLimitTitle: "Too many submissions",
    errorRateLimitDesc:
      "You have submitted several reports recently. Please try again later.",
    errorRetry: "Try again",
    captchaLabel: "Security verification",
    returnHome: "Return Home",
    submitAnother: "Submit Another",
    consentBefore: "By submitting this form you accept our",
    consentLink: "Privacy Notice",
    consentAfter: ".",
  },
  privacy: {
    back: "Back to Home",
    title: "Privacy Notice",
    subtitle:
      "How Generadora San Felipe collects, uses, and protects your personal data.",
    lastUpdated: "Last updated: May 14, 2026",
    controller: {
      title: "1. Data controller",
      body: [
        "Generadora San Felipe Limited Partnership (“GSF”, “we”, “us”) is the entity responsible for processing the personal data described in this notice.",
        "Address: Av. Gustavo Mejia Ricart #102, Suite 701, Piantini, Santo Domingo, Dominican Republic.",
        "Contact for data protection matters: contacto@gsf.com.do.",
      ],
    },
    dataCollected: {
      title: "2. Data we collect",
      intro: "When you submit a report through our complaints channel we may process:",
      items: [
        "Full name (only when you choose not to remain anonymous)",
        "Email address (only when you choose not to remain anonymous)",
        "Phone number (only when you provide it and choose not to remain anonymous)",
        "Subject and full description of the report",
        "Type of report (complaint, grievance, or general report)",
        "Language preference",
        "Reference code generated by our system",
        "Technical access data such as IP address, browser type, and timestamp, retained briefly by our hosting provider for security and operational reasons",
      ],
    },
    purposes: {
      title: "3. Why we process this data",
      intro: "We process the data described above for the following purposes:",
      items: [
        "To register, investigate, and follow up on complaints, grievances, and reports related to our operations",
        "To communicate the outcome of the investigation to the reporting party when contact information has been provided",
        "To comply with legal, regulatory, and contractual obligations applicable to GSF as a regulated power generation company",
        "To protect the integrity of the channel against abuse (anti-spam, rate limiting)",
      ],
    },
    legalBasis: {
      title: "4. Legal basis",
      items: [
        "Compliance with legal obligations under Dominican law and applicable regulations",
        "The consent you provide when you submit the form",
        "The legitimate interest of GSF in operating a compliant grievance mechanism",
      ],
    },
    retention: {
      title: "5. How long we keep your data",
      body: [
        "We retain the information related to each report for seven (7) years from the closure of the matter, in line with our document retention obligations as a regulated entity.",
        "Technical access logs retained by our hosting provider are kept for a shorter period as defined by that provider.",
        "After the retention period, the data is deleted or anonymized.",
      ],
    },
    thirdParties: {
      title: "6. Third parties that process your data",
      intro:
        "To operate the complaints channel we rely on trusted technology service providers (“data processors”), each bound by contract to handle your data only on our behalf and under appropriate security measures. The categories are:",
      items: [
        "Transactional email provider (notification and acknowledgement messages) — United States",
        "Database hosting provider where reports are stored — United States",
        "Anti-bot protection and automated-traffic filtering provider — United States",
        "Website hosting provider that retains brief operational access logs — United States",
        "Rate-limiting provider that prevents abuse of the form — United States",
        "Corporate email provider where internal notifications are received — United States",
      ],
      howTo:
        "A detailed list with the commercial names of each current provider is available upon request at contacto@gsf.com.do.",
    },
    internationalTransfers: {
      title: "7. International data transfers",
      body: [
        "Because the providers listed above are based outside of the Dominican Republic, your data may be transferred to and processed in the United States and other jurisdictions where these providers operate.",
        "We rely on contractual safeguards and the security commitments of each provider to ensure your data is protected to a comparable standard.",
      ],
    },
    rights: {
      title: "8. Your rights",
      intro:
        "Under the Dominican Personal Data Protection Act (Law 172-13), you have the following rights regarding your personal data — collectively known as ARCO rights:",
      items: [
        "Access — request a copy of the data we hold about you",
        "Rectification — request that we correct inaccurate or outdated data",
        "Cancellation — request that we delete your data when the legal basis no longer applies",
        "Opposition — object to the processing of your data in specific circumstances",
      ],
      howTo:
        "To exercise any of these rights, write to contacto@gsf.com.do including your reference code (if any) and a clear description of your request. We will respond within the timeframe required by applicable law.",
      authority:
        "If you consider that your rights have not been adequately addressed, you may file a complaint with the Dominican Institute of Telecommunications (INDOTEL), the authority responsible for personal data protection in the Dominican Republic.",
    },
    security: {
      title: "9. How we protect your data",
      items: [
        "All communication with the site uses HTTPS encryption in transit",
        "Form submissions pass through a bot-protection layer and per-IP rate limiting",
        "Access to the reports database is restricted to the compliance team using authenticated, audited credentials",
        "Database-level row security is enabled as a defense-in-depth measure",
        "Sensitive credentials are stored in secure, environment-isolated configuration",
      ],
    },
    cookies: {
      title: "10. Cookies and similar technologies",
      body: [
        "This website does not use tracking cookies, advertising cookies, or web analytics.",
        "We use the browser's local storage only to remember your language preference between visits. You can clear this at any time from your browser settings.",
        "The Cloudflare Turnstile anti-bot widget may set short-lived technical cookies on its own domain (challenges.cloudflare.com) strictly for security purposes. These are not used for tracking.",
      ],
    },
    anonymity: {
      title: "11. About anonymous reports",
      body: [
        "When you choose to submit a report anonymously, we do not collect your name, email, or phone number. The report can therefore not be linked to you within our records.",
        "However, please be aware that our hosting provider (Vercel) records short-lived access logs that include your IP address and the timestamp of your submission for security and operational reasons. These logs are not part of our compliance records and are not accessible to the compliance team, but they are kept temporarily by the infrastructure provider.",
        "If you require absolute anonymity, consider using a network that masks your IP address (such as Tor) before submitting your report.",
      ],
    },
    changes: {
      title: "12. Changes to this notice",
      body: [
        "We may update this notice from time to time to reflect changes in our practices or in applicable law. The “Last updated” date at the top of this page indicates when the most recent revision was published.",
        "Material changes will be highlighted on the website.",
      ],
    },
    contact: {
      title: "13. Contact us",
      body: [
        "If you have any questions about this Privacy Notice or about how we handle your personal data, please contact us at contacto@gsf.com.do.",
      ],
    },
  },
  lightbox: {
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    dialogLabel: "Enlarged image",
  },
};

const es: Translations = {
  skipToContent: "Saltar al contenido principal",
  langToggleAriaLabel: "Cambiar a inglés",
  langChanged: "Idioma cambiado al español",
  form: {
    requiredHint: "Los campos marcados con * son obligatorios.",
    requiredMark: "obligatorio",
  },
  slideshow: {
    slideOf: "de",
  },
  nav: {
    project: "Proyecto",
    sustainability: "Sostenibilidad",
    contact: "Contáctenos",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    menuLabel: "Menú de navegación",
  },
  hero: {
    badge: "467MW Ciclo Combinado — En Construcción",
    headline1: "Energía eficiente que",
    headlineAccent: "impulsa",
    headline2: "la República Dominicana",
    subtitle:
      "GSF-1 es una central de ciclo combinado de alta eficiencia que aporta energía confiable, sostenible y competitiva al Sistema Eléctrico Nacional — fortaleciendo la seguridad energética para las generaciones venideras.",
    cta: "Contáctenos",
    ctaSecondary: "Explorar el Proyecto",
    stat1value: "467",
    stat1unit: "MW",
    stat1label: "Capacidad Neta",
    stat2value: "64%",
    stat2label: "Eficiencia Térmica",
    stat3value: "+$700M",
    stat3label: "Inversión",
    turbineBadgeLabel: "GE Vernova",
    turbineBadgeValue: "7HA.02",
  },
  project: {
    tag: "El Proyecto",
    title1: "Tecnología de clase mundial,",
    title2: "construida para el futuro",
    subtitle:
      "La primera central en el Caribe y Centroamérica en incorporar la turbina GE Vernova 7HA.02 — estableciendo un nuevo estándar regional en eficiencia y rendimiento.",
    specConfig: "Configuración",
    specConfigVal: "Ciclo Combinado Multi-shaft 1x1",
    specGas: "Turbina de Gas",
    specGasVal: "GE Vernova 7HA.02",
    specSteam: "Turbina de Vapor",
    specSteamVal: "GE STF-A650",
    specNet: "Capacidad Neta",
    specNetVal: "467 MW",
    specContract: "Contrato",
    specContractVal: "400 MW",
    turbineZoomAria: "Abrir vista a tamaño completo de la turbina GE Vernova 7HA.02",
    turbineLightboxDialogLabel: "Turbina GE Vernova 7HA.02 — tamaño completo",
    locationTitle: "Ubicación Estratégica",
    locationValue: "Punta Caucedo, Boca Chica, República Dominicana",
    locationGas:
      "Abastecimiento de gas natural a través de almacenamiento y regasificación de ENADOM",
    timelineTag: "Cronograma",
    timelineTitle: "Hitos del Proyecto",
    statusCompleted: "Completado",
    statusUpcoming: "Próximo",
    statusInProgress: "En curso",
    tlProgressLabel: "Avance del proyecto",
    tlToday: "Hoy",
    tlDaysAgo: "Hace {n} días",
    tlDaysUntil: "En {n} días",
    tlExpand: "Ver detalles",
    tlCollapse: "Ocultar detalles",
    tlExpandAria: "Mostrar detalles de",
    tlCollapseAria: "Ocultar detalles de",
    tl1year: "2024",
    tl1quarter: "Abril",
    tl1title: "Aviso de Inicio",
    tl1desc:
      "Inicio formal del contrato EPC, movilización de contratistas y comienzo de obras civiles mayores.",
    tl2year: "2025",
    tl2quarter: "Jul — Dic",
    tl2title: "Llegada de Equipos Mayores",
    tl2desc:
      "Recepción de la turbina de gas GE Vernova 7HA.02, turbina de vapor, generadores y módulos del HRSG en sitio.",
    tl3year: "2026",
    tl3quarter: "Noviembre",
    tl3title: "Primer Fuego y Comisionamiento",
    tl3desc:
      "Encendido inicial de la turbina de gas, pruebas funcionales, validación de desempeño y prueba de confiabilidad.",
    tl4year: "2027",
    tl4quarter: "Mayo",
    tl4title: "Operación Comercial",
    tl4desc:
      "Declaratoria oficial de operación comercial, entregando 400 MW bajo contrato PPA.",
    constructionTag: "Avance de Construcción",
    constructionTitle: "Imágenes Actuales",
    constructionSubtitle:
      "Vistas aéreas del sitio de construcción de GSF-1 mostrando el avance más reciente.",
    constructionDate: "4 de septiembre de 2026",
    constructionZoomHint: "Click para ampliar",
    constructionPause: "Pausar presentación",
    constructionPlay: "Reanudar presentación",
    impactTag: "Impacto",
    impactTitle:
      "Infraestructura estratégica para el desarrollo sostenible",
    impactSubtitle:
      "Generadora San Felipe fortalece la seguridad energética de la República Dominicana e impulsa la competitividad económica.",
    impact1title: "Seguridad Energética",
    impact1desc:
      "Capacidad firme y despachable 24/7 — reduciendo el riesgo estructural de déficit energético y proporcionando respaldo crítico para la integración de renovables.",
    impact2title: "Competitividad",
    impact2desc:
      "Generación altamente eficiente que reduce el costo marginal del sistema eléctrico, contribuyendo a la estabilidad tarifaria y previsibilidad económica.",
    impact3title: "Desarrollo Local",
    impact3desc:
      "Efecto multiplicador en empleo, encadenamientos productivos y desarrollo local durante las fases de construcción y operación.",
  },
  sustainability: {
    tag: "Sostenibilidad",
    title1: "Construida bajo los más altos",
    titleAccent: "estándares ambientales",
    subtitle:
      "Alineada con los objetivos de transición energética y desarrollo sostenible del país, GSF-1 establece nuevos referentes en generación eficiente.",
    envTitle: "Desempeño Ambiental",
    env1title: "Menores Emisiones por MWh",
    env1desc:
      "Emisiones significativamente menores por megavatio-hora generado, gracias a tecnología de ciclo combinado de alta eficiencia.",
    env2title: "Huella de Carbono Reducida",
    env2desc:
      "Huella de carbono mediblemente menor en comparación con tecnologías convencionales de generación térmica.",
    env3title: "Consumo de Combustible Optimizado",
    env3desc:
      "Máxima producción energética con mínimo impacto ambiental mediante eficiencia térmica de primera clase.",
    env4title: "Cumplimiento Regulatorio",
    env4desc:
      "Cumplimiento estricto de normativas ambientales nacionales e internacionales.",
    transTitle: "Transición Energética Responsable",
    trans1title: "Transición a Gas Natural",
    trans1desc:
      "Uso de gas natural como combustible de transición, contribuyendo a una matriz más limpia y diversificada.",
    trans2title: "Facilitador de Renovables",
    trans2desc:
      "Facilitando mayor penetración renovable al aportar flexibilidad y estabilidad a la red eléctrica.",
    trans3title: "Infraestructura Preparada para el Futuro",
    trans3desc:
      "Infraestructura diseñada para futuras mejoras tecnológicas, incluyendo potencial integración con soluciones de descarbonización.",
    socialTitle: "Compromiso Social y Desarrollo Local",
    socialDesc:
      "Generación de empleo directo e indirecto durante construcción y operación. Impulso a proveedores y encadenamientos productivos locales, con gobernanza transparente y responsable enfocada en la sostenibilidad a largo plazo.",
    reportsTitle: "Reportes de Sostenibilidad",
    report1: "Estudio de Impacto Ambiental",
    report2: "Evaluación de Cambio Climático",
    report3: "Evaluación de Derechos Humanos",
    report4: "Reporte de Emisiones GEI",
  },
  complaintsSection: {
    tag: "Transparencia",
    title: "Canal de Quejas y Denuncias",
    desc: "Mantenemos un canal transparente y accesible para todas las quejas, reclamos y denuncias relacionadas con nuestras operaciones.",
    btn: "Enviar un Reporte",
  },
  news: {
    tag: "En los Medios",
    title: "GSF en la",
    titleAccent: "Prensa",
    subtitle:
      "Cobertura y menciones del proyecto Generadora San Felipe en medios nacionales e internacionales.",
    readMore: "Leer Artículo",
  },
  locations: {
    tag: "Ubicaciones",
    title: "Dónde Encontrarnos",
    corporateLabel: "Oficina Corporativa",
    corporateAddress: "Av. Gustavo Mejia Ricart #102, Suite 701\nPiantini, Sto. Dgo., Rep. Dom.",
    gsf1Label: "GSF-1",
    gsf1Address: "Calle Aurora Núm. 1, paraje Punta Caucedo\nAndrés Boca Chica, Sto. Dgo., Rep. Dom.",
    openMaps: "Abrir en Google Maps",
  },
  notFound: {
    title: "Página no encontrada",
    subtitle:
      "La página que estás buscando se movió, ya no existe, o nunca existió. Usa uno de los botones de abajo para retomar la navegación.",
    ctaHome: "Volver al inicio",
    ctaProject: "Explorar el Proyecto",
    brand: "Generadora San Felipe — 467 MW Ciclo Combinado",
  },
  plantMap: {
    sectionTag: "Distribución del Sitio",
    sectionTitle: "Plano General de la Planta",
    sectionSubtitle:
      "Plot plan oficial EPC del sitio GSF-1 con 15 zonas identificadas. Haz clic en cualquier marcador numerado para ver la descripción de esa zona.",
    zoneDetail: "Detalle de zona",
    close: "Cerrar",
    emptyHelp:
      "Haz clic en un marcador numerado del mapa para ver la descripción de esa zona.",
    openZoneAria: "Abrir detalles de la zona",
  },
  footer: {
    company: "Generadora San Felipe Limited Partnership",
    navTitle: "Navegación",
    navNews: "Noticias",
    navLocations: "Ubicaciones",
    resourcesTitle: "Recursos",
    sitemap: "Mapa del sitio XML",
    complaints: "Quejas y Denuncias",
    epc: "Contratista EPC — TSK",
    contactTitle: "Contacto",
    copyright: "Todos los derechos reservados.",
    sponsoredBy: "Patrocinado por",
    followUs: "Síguenos",
    instagramLabel: "Generadora San Felipe en Instagram",
    linkedinLabel: "Generadora San Felipe en LinkedIn",
    privacy: "Aviso de Privacidad",
    languageToggleLabel: "Idioma",
  },
  complaints: {
    back: "Volver al Inicio",
    title: "Canal de Quejas y Denuncias",
    subtitle:
      "Estamos comprometidos a mantener un canal transparente y accesible para todas las quejas, reclamos y denuncias relacionadas con nuestras operaciones.",
    classGateTitle: "¿Quién presenta este reporte?",
    classGateSubtitle:
      "Selecciona la opción que aplica para que tu reporte llegue al equipo correcto. Esto determina el departamento que lo gestionará.",
    classInternal: "Interno — empleado de GSF",
    classInternalDesc:
      "Eres parte del personal de Generadora San Felipe.",
    classExternal: "Externo — comunidad, proveedor o tercero",
    classExternalDesc:
      "Eres parte de la comunidad, un proveedor, o un tercero externo.",
    classChange: "Cambiar",
    typeLabel: "Tipo de Reporte",
    typeComplaint: "Queja",
    typeGrievance: "Reclamo",
    typeReport: "Reporte General",
    anonymous: "Enviar de forma anónima",
    nameLabel: "Nombre Completo",
    namePlaceholder: "Su nombre",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "su@correo.com",
    phoneLabel: "Teléfono (opcional)",
    phonePlaceholder: "(809) 000-0000",
    subjectLabel: "Asunto",
    subjectPlaceholder: "Breve resumen de su reporte",
    descLabel: "Descripción",
    descPlaceholder:
      "Por favor proporcione el mayor detalle posible sobre la queja, reclamo o denuncia.",
    submit: "Enviar Reporte",
    submitting: "Enviando…",
    cancel: "Cancelar",
    successTitle: "Reporte Enviado",
    successDesc:
      "Gracias por su envío. Nuestro equipo revisará su reporte y responderá según nuestros procedimientos de gestión de quejas.",
    referenceLabel: "Código de referencia",
    referenceNote:
      "Guarde este código. Lo va a necesitar para hacer seguimiento de su reporte.",
    errorTitle: "No pudimos enviar su reporte",
    errorDesc:
      "Por favor intente nuevamente en unos momentos. Si el problema persiste, escríbanos a contacto@gsf.com.do.",
    errorCaptchaTitle: "Verificación requerida",
    errorCaptchaDesc:
      "Por favor complete la verificación de seguridad antes de enviar.",
    errorRateLimitTitle: "Demasiados envíos",
    errorRateLimitDesc:
      "Ha enviado varios reportes recientemente. Por favor intente nuevamente más tarde.",
    errorRetry: "Reintentar",
    captchaLabel: "Verificación de seguridad",
    returnHome: "Volver al Inicio",
    submitAnother: "Enviar Otro",
    consentBefore: "Al enviar este formulario usted acepta nuestro",
    consentLink: "Aviso de Privacidad",
    consentAfter: ".",
  },
  privacy: {
    back: "Volver al Inicio",
    title: "Aviso de Privacidad",
    subtitle:
      "Cómo Generadora San Felipe recopila, utiliza y protege sus datos personales.",
    lastUpdated: "Última actualización: 14 de mayo de 2026",
    controller: {
      title: "1. Responsable del tratamiento",
      body: [
        "Generadora San Felipe Limited Partnership (“GSF”, “nosotros”) es la entidad responsable del tratamiento de los datos personales descritos en este aviso.",
        "Dirección: Av. Gustavo Mejia Ricart #102, Suite 701, Piantini, Santo Domingo, República Dominicana.",
        "Contacto para temas de protección de datos: contacto@gsf.com.do.",
      ],
    },
    dataCollected: {
      title: "2. Datos que recopilamos",
      intro:
        "Cuando usted envía un reporte a través de nuestro canal de quejas y denuncias, podemos tratar:",
      items: [
        "Nombre completo (únicamente cuando usted elige no enviar el reporte de forma anónima)",
        "Dirección de correo electrónico (únicamente cuando usted elige no enviar el reporte de forma anónima)",
        "Número de teléfono (únicamente cuando usted lo proporciona y elige no enviar el reporte de forma anónima)",
        "Asunto y descripción completa del reporte",
        "Tipo de reporte (queja, reclamo o denuncia general)",
        "Preferencia de idioma",
        "Código de referencia generado por nuestro sistema",
        "Datos técnicos de acceso como dirección IP, tipo de navegador y marca de tiempo, retenidos brevemente por nuestro proveedor de alojamiento por razones operativas y de seguridad",
      ],
    },
    purposes: {
      title: "3. Por qué tratamos estos datos",
      intro: "Tratamos los datos descritos para las siguientes finalidades:",
      items: [
        "Registrar, investigar y dar seguimiento a quejas, reclamos y denuncias relacionadas con nuestras operaciones",
        "Comunicar el resultado de la investigación al reportante cuando se haya suministrado información de contacto",
        "Cumplir con obligaciones legales, regulatorias y contractuales aplicables a GSF como empresa de generación eléctrica regulada",
        "Proteger la integridad del canal contra abuso (anti-spam, limitación de frecuencia)",
      ],
    },
    legalBasis: {
      title: "4. Base legal",
      items: [
        "Cumplimiento de obligaciones legales bajo la normativa dominicana y regulación aplicable",
        "El consentimiento que usted otorga al enviar el formulario",
        "El interés legítimo de GSF en operar un mecanismo de denuncias conforme a sus procedimientos de cumplimiento",
      ],
    },
    retention: {
      title: "5. Tiempo de conservación",
      body: [
        "Conservamos la información asociada a cada reporte por un período de siete (7) años contados desde el cierre del caso, en línea con nuestras obligaciones de conservación documental como entidad regulada.",
        "Los registros técnicos de acceso retenidos por nuestro proveedor de alojamiento se conservan por períodos más cortos definidos por dicho proveedor.",
        "Una vez transcurrido el plazo de conservación, los datos se eliminan o anonimizan.",
      ],
    },
    thirdParties: {
      title: "6. Terceros que tratan sus datos",
      intro:
        "Para operar el canal de quejas y denuncias dependemos de proveedores de servicios tecnológicos de confianza (“encargados del tratamiento”), cada uno contractualmente obligado a tratar sus datos únicamente por cuenta de GSF y bajo medidas de seguridad apropiadas. Las categorías son:",
      items: [
        "Proveedor de envío de correo transaccional (notificación y acuse) — Estados Unidos",
        "Proveedor de hosting de base de datos donde se almacenan los reportes — Estados Unidos",
        "Proveedor de protección anti-bots y filtrado de tráfico automatizado — Estados Unidos",
        "Proveedor de hosting del sitio web que retiene brevemente registros operativos de acceso — Estados Unidos",
        "Proveedor de limitación de frecuencia (rate limit) que previene el abuso del formulario — Estados Unidos",
        "Proveedor de correo corporativo donde se reciben las notificaciones internas — Estados Unidos",
      ],
      howTo:
        "Una lista detallada con los nombres comerciales de cada proveedor actual está disponible mediante solicitud a contacto@gsf.com.do.",
    },
    internationalTransfers: {
      title: "7. Transferencias internacionales",
      body: [
        "Dado que los proveedores mencionados están ubicados fuera de la República Dominicana, sus datos pueden ser transferidos y tratados en Estados Unidos y otras jurisdicciones donde dichos proveedores operan.",
        "Nos apoyamos en salvaguardas contractuales y en los compromisos de seguridad de cada proveedor para asegurar que sus datos reciban un nivel de protección comparable.",
      ],
    },
    rights: {
      title: "8. Sus derechos",
      intro:
        "Bajo la Ley 172-13 de Protección Integral de Datos Personales de la República Dominicana, usted tiene los siguientes derechos sobre sus datos personales — conocidos colectivamente como derechos ARCO:",
      items: [
        "Acceso — solicitar copia de los datos que tratamos sobre usted",
        "Rectificación — solicitar la corrección de datos inexactos o desactualizados",
        "Cancelación — solicitar la supresión de sus datos cuando la base legal ya no aplique",
        "Oposición — oponerse al tratamiento de sus datos en circunstancias específicas",
      ],
      howTo:
        "Para ejercer cualquiera de estos derechos, escriba a contacto@gsf.com.do incluyendo su código de referencia (si lo tiene) y una descripción clara de su solicitud. Responderemos dentro del plazo establecido por la ley aplicable.",
      authority:
        "Si considera que sus derechos no han sido adecuadamente atendidos, puede presentar una denuncia ante el Instituto Dominicano de las Telecomunicaciones (INDOTEL), autoridad responsable de la protección de datos personales en la República Dominicana.",
    },
    security: {
      title: "9. Cómo protegemos sus datos",
      items: [
        "Toda comunicación con el sitio utiliza cifrado HTTPS en tránsito",
        "Los envíos del formulario pasan por una capa de protección anti-bots y limitación de frecuencia por IP",
        "El acceso a la base de datos de reportes está restringido al equipo de cumplimiento mediante credenciales autenticadas y auditadas",
        "Se encuentra habilitada seguridad a nivel de fila en la base de datos como medida de defensa en profundidad",
        "Las credenciales sensibles se almacenan en configuración aislada y segura",
      ],
    },
    cookies: {
      title: "10. Cookies y tecnologías similares",
      body: [
        "Este sitio no utiliza cookies de seguimiento, cookies publicitarias ni analítica web.",
        "Utilizamos el almacenamiento local del navegador únicamente para recordar su preferencia de idioma entre visitas. Puede borrarlo en cualquier momento desde la configuración de su navegador.",
        "El widget de protección Cloudflare Turnstile puede establecer cookies técnicas de corta duración en su propio dominio (challenges.cloudflare.com) estrictamente con fines de seguridad. No se utilizan para seguimiento.",
      ],
    },
    anonymity: {
      title: "11. Sobre los reportes anónimos",
      body: [
        "Cuando usted elige enviar un reporte de forma anónima, no recopilamos su nombre, correo electrónico ni número de teléfono. Por lo tanto, el reporte no puede vincularse a usted dentro de nuestros registros.",
        "Sin embargo, tenga en cuenta que nuestro proveedor de alojamiento (Vercel) registra brevemente datos de acceso que incluyen su dirección IP y la marca de tiempo del envío, por razones operativas y de seguridad. Estos registros no forman parte de nuestros archivos de cumplimiento y no son accesibles para el equipo de cumplimiento, pero son retenidos temporalmente por el proveedor de infraestructura.",
        "Si usted requiere anonimato absoluto, considere utilizar una red que enmascare su dirección IP (por ejemplo Tor) antes de enviar el reporte.",
      ],
    },
    changes: {
      title: "12. Cambios a este aviso",
      body: [
        "Podremos actualizar este aviso de tiempo en tiempo para reflejar cambios en nuestras prácticas o en la normativa aplicable. La fecha de “Última actualización” al inicio de esta página indica cuándo se publicó la revisión más reciente.",
        "Los cambios materiales serán destacados en el sitio web.",
      ],
    },
    contact: {
      title: "13. Contáctenos",
      body: [
        "Si tiene preguntas sobre este Aviso de Privacidad o sobre cómo manejamos sus datos personales, escríbanos a contacto@gsf.com.do.",
      ],
    },
  },
  lightbox: {
    close: "Cerrar",
    previous: "Imagen anterior",
    next: "Imagen siguiente",
    dialogLabel: "Imagen ampliada",
  },
};

const translations = { en, es };

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
};

const I18nContext = createContext<I18nContextType>({
  locale: "es",
  setLocale: () => {},
  t: es,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");
  const [hydrated, setHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const announcementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = translations[locale];

  // On mount: detect saved preference, or fall back to browser language
  useEffect(() => {
    let detected: Locale = "es";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es") {
        detected = saved;
      } else {
        const browserLang = navigator.language?.toLowerCase();
        if (browserLang?.startsWith("en")) detected = "en";
      }
    } catch {
      // localStorage may be unavailable (private mode, blocked storage)
    }
    // Client-side hydration of saved/browser locale. Intentional setState in
    // effect — localStorage and navigator are not available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(detected);
    setHydrated(true);
  }, []);

  // Persist locale and keep <html lang> in sync for SEO + screen readers.
  // Skip until hydrated so we don't clobber a saved preference with the default.
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale, hydrated]);

  // Read current locale via ref so side effects below can run outside the
  // setState updater (updaters fire twice under Strict Mode).
  const localeRef = useRef<Locale>(locale);
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    if (newLocale === localeRef.current) return;
    setLocale(newLocale);
    setAnnouncement(translations[newLocale].langChanged);
    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current);
    }
    announcementTimerRef.current = setTimeout(() => {
      setAnnouncement("");
      announcementTimerRef.current = null;
    }, ANNOUNCEMENT_CLEAR_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) {
        clearTimeout(announcementTimerRef.current);
      }
    };
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
