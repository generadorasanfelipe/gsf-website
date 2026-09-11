"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import TurnstileWidget from "@/components/TurnstileWidget";

type ErrorKind = "generic" | "captcha" | "rateLimit";

type ReporterClass = "internal" | "external";

type FormData = {
  reporterClass: ReporterClass | "";
  type: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  anonymous: boolean;
  website: string;
};

const initialForm: FormData = {
  reporterClass: "",
  type: "complaint",
  name: "",
  email: "",
  phone: "",
  subject: "",
  description: "",
  anonymous: false,
  website: "",
};

const honeypotStyle: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  opacity: 0,
};

export default function ComplaintsPage() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);
  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!turnstileToken) {
      setErrorKind("captcha");
      return;
    }
    setSubmitting(true);
    setErrorKind(null);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale, turnstileToken }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        if (res.status === 429 || json?.error === "rate-limited") {
          setErrorKind("rateLimit");
        } else if (json?.error === "captcha-failed") {
          setErrorKind("captcha");
          setTurnstileToken(null);
          setWidgetKey((k) => k + 1);
        } else {
          setErrorKind("generic");
        }
        return;
      }
      setReferenceId(json.referenceId);
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission failed:", err);
      setErrorKind("generic");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setSubmitted(false);
    setReferenceId(null);
    setErrorKind(null);
    setTurnstileToken(null);
    setWidgetKey((k) => k + 1);
  };

  const typeOptions = [
    { value: "complaint", label: t.complaints.typeComplaint },
    { value: "grievance", label: t.complaints.typeGrievance },
    { value: "report", label: t.complaints.typeReport },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-navy-950 pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-[30%] left-[-10%] w-[120%] h-px bg-white rotate-[-8deg]" />
          <div className="absolute top-[60%] left-[-10%] w-[120%] h-px bg-white rotate-[-8deg]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-white transition-colors mb-8"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.complaints.back}
            </Link>
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t.complaints.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-navy-300 leading-relaxed">
              {t.complaints.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24 lg:px-8">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-accent-50 flex items-center justify-center mb-6">
              <svg aria-hidden="true" className="h-8 w-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-navy-900">{t.complaints.successTitle}</h2>
            <p className="mt-3 text-navy-500 max-w-md mx-auto">{t.complaints.successDesc}</p>

            {referenceId && (
              <div className="mt-8 mx-auto max-w-md rounded-2xl bg-navy-50 border border-navy-100 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-accent-700">
                  {t.complaints.referenceLabel}
                </div>
                <div className="mt-2 text-2xl font-bold text-navy-900 font-mono tracking-tight">
                  {referenceId}
                </div>
                <p className="mt-3 text-xs text-navy-500">
                  {t.complaints.referenceNote}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-4">
              <Link href="/" className="rounded-full bg-navy-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
                {t.complaints.returnHome}
              </Link>
              <button
                onClick={reset}
                className="rounded-full border border-navy-200 px-6 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50 transition-colors"
              >
                {t.complaints.submitAnother}
              </button>
            </div>
          </motion.div>
        ) : !form.reporterClass ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-navy-900">
              {t.complaints.classGateTitle}
            </h2>
            <p className="mt-2 text-sm text-navy-500 leading-relaxed">
              {t.complaints.classGateSubtitle}
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                {
                  value: "internal" as const,
                  label: t.complaints.classInternal,
                  desc: t.complaints.classInternalDesc,
                },
                {
                  value: "external" as const,
                  label: t.complaints.classExternal,
                  desc: t.complaints.classExternalDesc,
                },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, reporterClass: opt.value }))
                  }
                  className="group rounded-2xl border border-navy-200 bg-white p-6 text-left transition-all hover:border-accent-400 hover:bg-accent-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <span className="block text-base font-semibold text-navy-900 group-hover:text-accent-700">
                    {opt.label}
                  </span>
                  <span className="mt-2 block text-sm text-navy-500 leading-relaxed">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Selected classification + change control */}
            <div className="flex items-center justify-between rounded-xl border border-navy-200 bg-navy-50 px-4 py-3">
              <span className="text-sm text-navy-700">
                <span className="font-semibold">
                  {form.reporterClass === "internal"
                    ? t.complaints.classInternal
                    : t.complaints.classExternal}
                </span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, reporterClass: "" }))
                }
                className="text-xs font-medium text-accent-600 hover:text-accent-700 underline underline-offset-2"
              >
                {t.complaints.classChange}
              </button>
            </div>
            {/* Honeypot — visually hidden, ignored by humans, filled by bots */}
            <div style={honeypotStyle} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <p className="text-xs text-navy-500">
              {t.form.requiredHint}
            </p>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">{t.complaints.typeLabel}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: option.value }))}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      form.type === option.value
                        ? "border-accent-300 bg-accent-50 text-accent-700"
                        : "border-navy-200 text-navy-600 hover:border-navy-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.anonymous}
                aria-label={t.complaints.anonymous}
                onClick={() => setForm((prev) => ({ ...prev, anonymous: !prev.anonymous }))}
                className={`relative h-6 w-11 rounded-full transition-colors ${form.anonymous ? "bg-accent-500" : "bg-navy-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.anonymous ? "translate-x-5" : ""}`} />
              </button>
              <span className="text-sm text-navy-700">{t.complaints.anonymous}</span>
            </div>

            {/* Contact Fields */}
            {!form.anonymous && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-navy-900 mb-2">{t.complaints.nameLabel}</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 focus:outline-none transition-all" placeholder={t.complaints.namePlaceholder} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy-900 mb-2">{t.complaints.emailLabel}</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 focus:outline-none transition-all" placeholder={t.complaints.emailPlaceholder} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-navy-900 mb-2">{t.complaints.phoneLabel}</label>
                  <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 focus:outline-none transition-all" placeholder={t.complaints.phonePlaceholder} />
                </div>
              </motion.div>
            )}

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-navy-900 mb-2">
                {t.complaints.subjectLabel}
                <span aria-hidden="true" className="text-amber-700 ml-1">*</span>
                <span className="sr-only"> ({t.form.requiredMark})</span>
              </label>
              <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} required aria-required="true" className="w-full rounded-xl border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 focus:outline-none transition-all" placeholder={t.complaints.subjectPlaceholder} />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-navy-900 mb-2">
                {t.complaints.descLabel}
                <span aria-hidden="true" className="text-amber-700 ml-1">*</span>
                <span className="sr-only"> ({t.form.requiredMark})</span>
              </label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} required aria-required="true" rows={6} className="w-full rounded-xl border border-navy-200 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 focus:outline-none transition-all resize-none" placeholder={t.complaints.descPlaceholder} />
            </div>

            {/* Captcha */}
            <div>
              <span className="sr-only">{t.complaints.captchaLabel}</span>
              <TurnstileWidget
                key={widgetKey}
                onVerify={handleTurnstileVerify}
                onExpire={handleTurnstileExpire}
                onError={handleTurnstileError}
                locale={locale}
              />
            </div>

            {errorKind && (
              <div
                role="alert"
                aria-live="assertive"
                className="rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <div className="text-sm font-semibold text-red-900">
                  {errorKind === "captcha"
                    ? t.complaints.errorCaptchaTitle
                    : errorKind === "rateLimit"
                    ? t.complaints.errorRateLimitTitle
                    : t.complaints.errorTitle}
                </div>
                <p className="mt-1 text-sm text-red-700">
                  {errorKind === "captcha"
                    ? t.complaints.errorCaptchaDesc
                    : errorKind === "rateLimit"
                    ? t.complaints.errorRateLimitDesc
                    : t.complaints.errorDesc}
                </p>
              </div>
            )}

            {/* Consent notice */}
            <p className="text-xs text-navy-500 leading-relaxed">
              {t.complaints.consentBefore}{" "}
              <Link
                href="/privacy"
                className="underline hover:text-accent-600 transition-colors"
              >
                {t.complaints.consentLink}
              </Link>
              {t.complaints.consentAfter}
            </p>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-navy-950 disabled:hover:shadow-none"
              >
                {submitting && (
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                )}
                {submitting ? t.complaints.submitting : t.complaints.submit}
              </button>
              <Link href="/" className="text-sm font-medium text-navy-500 hover:text-navy-700 transition-colors">
                {t.complaints.cancel}
              </Link>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
}
