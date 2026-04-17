// Centralized event tracking. Pushes to dataLayer (GTM) and falls back to gtag/fbq when present.

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

const CONSENT_KEY = "lovable_cookie_consent";

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "granted";
}

export function setConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  window.dispatchEvent(new CustomEvent("consent-changed", { detail: { granted } }));
}

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // Always push to dataLayer (GTM decides what to do based on consent)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // Direct fallbacks (only fire if consent granted to respect LGPD/GDPR)
  if (!hasConsent()) return;
  try {
    if (window.gtag) window.gtag("event", event, params);
    if (window.fbq) window.fbq("track", event, params);
    if (window.ttq) window.ttq.track(event, params);
  } catch (e) {
    console.warn("[tracking] event error", e);
  }
}

export const track = {
  pageView: (path: string) => trackEvent("page_view", { page_path: path }),
  formSubmit: (form: string, extra: Record<string, unknown> = {}) =>
    trackEvent("form_submit", { form_name: form, ...extra }),
  whatsappClick: () => trackEvent("whatsapp_click"),
  phoneClick: () => trackEvent("phone_click"),
  emailClick: () => trackEvent("email_click"),
  ctaClick: (label: string, location?: string) =>
    trackEvent("cta_click", { cta_label: label, cta_location: location }),
  scrollDepth: (percent: number) => trackEvent("scroll_depth", { percent }),
  conversion: (type: string, value?: number) =>
    trackEvent("conversion", { conversion_type: type, value }),
};
