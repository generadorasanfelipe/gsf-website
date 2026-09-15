"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

type CountUpProps = {
  /** Final value as a string. May include prefix like "+$" or suffix like "%", "M". */
  value: string;
  /** Animation duration in ms. Defaults to 1400ms. */
  durationMs?: number;
  /**
   * Animate on mount instead of waiting for scroll-into-view. Use for
   * above-the-fold content (e.g. hero stats) that can sit below the fold on
   * small screens — otherwise useInView never fires and the value stays at 0.
   */
  immediate?: boolean;
};

type ParsedValue = {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
};

function parseStatValue(input: string): ParsedValue {
  // Match optional prefix (non-digit / minus chars), the number, then optional suffix
  const match = input.match(/^([^\d-]*)(-?\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) {
    return { prefix: input, number: 0, suffix: "", decimals: 0 };
  }
  const [, prefix, numStr, suffix] = match;
  const normalized = numStr.replace(",", ".");
  const decimals = normalized.includes(".") ? normalized.split(".")[1].length : 0;
  return {
    prefix,
    number: parseFloat(normalized),
    suffix,
    decimals,
  };
}

export default function CountUp({
  value,
  durationMs = 1400,
  immediate = false,
}: CountUpProps) {
  const { locale } = useI18n();
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const bcp47 = locale === "es" ? "es-DO" : "en-US";
  const integerFormat = useMemo(
    () => new Intl.NumberFormat(bcp47, { maximumFractionDigits: 0 }),
    [bcp47]
  );
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? parsed.number : 0);
  const shouldAnimate = immediate || inView;

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(parsed.number * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(parsed.number);
      }
    };
    raf = requestAnimationFrame(tick);
    // Guarantee the final value even if requestAnimationFrame never ticks —
    // e.g. the tab is backgrounded (rAF is fully paused there, setTimeout is
    // only throttled) or the animation is interrupted. Without this the
    // counter can stay stuck at 0.
    const settle = setTimeout(() => setDisplay(parsed.number), durationMs + 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [shouldAnimate, reduceMotion, parsed.number, durationMs]);

  const formatted =
    parsed.decimals > 0
      ? display.toFixed(parsed.decimals)
      : integerFormat.format(Math.round(display));

  return (
    <span ref={ref} aria-label={value}>
      {parsed.prefix}
      {formatted}
      {parsed.suffix}
    </span>
  );
}
