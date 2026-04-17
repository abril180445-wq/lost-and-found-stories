import { useEffect, useState } from "react";

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

const STORAGE_KEY = "lovable_utm_data";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

export function readUTMs(): UTMData {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export const useUTMTracking = () => {
  const [utms, setUtms] = useState<UTMData>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captured: UTMData = {};
    let hasNew = false;
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) {
        captured[key] = value;
        hasNew = true;
      }
    });

    const existing = readUTMs();
    const merged = hasNew ? { ...existing, ...captured } : existing;

    if (hasNew) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {}
    }
    setUtms(merged);
  }, []);

  return utms;
};
