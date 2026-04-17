import { useEffect } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { hasConsent } from "@/lib/tracking";

/**
 * Loads tracking scripts (GTM, GA4, Meta Pixel, TikTok Pixel, Clarity)
 * based on IDs configured in site_settings. Respects cookie consent.
 *
 * GTM is loaded as the central hub; other tags can be managed via GTM,
 * but for convenience we also support direct injection of GA4/Meta/TikTok/Clarity.
 */
const TrackingScripts = () => {
  const { config } = useSiteConfig();

  useEffect(() => {
    const load = () => {
      if (!hasConsent()) return;

      // ---- Google Tag Manager ----
      if (config.gtm_id && !document.getElementById("gtm-script")) {
        const s = document.createElement("script");
        s.id = "gtm-script";
        s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.gtm_id}');`;
        document.head.appendChild(s);
      }

      // ---- Google Analytics 4 ----
      if (config.ga4_id && !document.getElementById("ga4-script")) {
        const s = document.createElement("script");
        s.id = "ga4-script";
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga4_id}`;
        document.head.appendChild(s);
        const inline = document.createElement("script");
        inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.ga4_id}');`;
        document.head.appendChild(inline);
      }

      // ---- Google Ads ----
      if (config.google_ads_id && !document.getElementById("gads-script")) {
        const s = document.createElement("script");
        s.id = "gads-script";
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${config.google_ads_id}`;
        document.head.appendChild(s);
        const inline = document.createElement("script");
        inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.google_ads_id}');`;
        document.head.appendChild(inline);
      }

      // ---- Meta Pixel ----
      if (config.meta_pixel_id && !document.getElementById("meta-pixel-script")) {
        const s = document.createElement("script");
        s.id = "meta-pixel-script";
        s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${config.meta_pixel_id}');fbq('track','PageView');`;
        document.head.appendChild(s);
      }

      // ---- TikTok Pixel ----
      if (config.tiktok_pixel_id && !document.getElementById("tiktok-pixel-script")) {
        const s = document.createElement("script");
        s.id = "tiktok-pixel-script";
        s.innerHTML = `!function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${config.tiktok_pixel_id}');ttq.page();}(window, document, 'ttq');`;
        document.head.appendChild(s);
      }

      // ---- Microsoft Clarity ----
      if (config.clarity_id && !document.getElementById("clarity-script")) {
        const s = document.createElement("script");
        s.id = "clarity-script";
        s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${config.clarity_id}");`;
        document.head.appendChild(s);
      }
    };

    load();
    const handler = () => load();
    window.addEventListener("consent-changed", handler);
    return () => window.removeEventListener("consent-changed", handler);
  }, [config]);

  return null;
};

export default TrackingScripts;
