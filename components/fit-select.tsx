"use client";

import { useEffect, useRef } from "react";

type FitSelectProps = {
  /** aria-label for the select. */
  label: string;
  options: readonly string[];
};

/**
 * The setup sentence's inline <select>. Native selects size to their longest
 * option; this fits each one to the chosen option so the dashed underline hugs
 * the word (ported from the inline script in prototype/landing.html).
 */
export function FitSelect({ label, options }: FitSelectProps) {
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const select = ref.current;
    if (!select) return;

    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;visibility:hidden;white-space:pre;" +
      "font:600 italic " +
      getComputedStyle(select).fontSize +
      " " +
      getComputedStyle(select).fontFamily;
    document.body.appendChild(probe);

    const fit = () => {
      probe.textContent = select.options[select.selectedIndex].text;
      select.style.width = probe.getBoundingClientRect().width + 34 + "px";
    };

    select.addEventListener("change", fit);
    fit();

    return () => {
      select.removeEventListener("change", fit);
      probe.remove();
    };
  }, []);

  return (
    <span className="sel">
      <select ref={ref} aria-label={label}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </span>
  );
}
