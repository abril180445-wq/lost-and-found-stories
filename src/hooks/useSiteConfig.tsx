import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteConfig = Record<string, string>;

let cache: SiteConfig | null = null;
let inflight: Promise<SiteConfig> | null = null;

async function fetchConfig(): Promise<SiteConfig> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error) {
    console.error("[useSiteConfig] fetch error", error);
    return {};
  }
  const map: SiteConfig = {};
  (data ?? []).forEach((row) => {
    if (row.value) map[row.key] = row.value;
  });
  cache = map;
  return map;
}

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    if (!inflight) inflight = fetchConfig();
    inflight
      .then((c) => setConfig(c))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
};
