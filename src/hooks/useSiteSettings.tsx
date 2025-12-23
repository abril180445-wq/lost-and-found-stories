import { useState } from 'react';

interface SiteSettings {
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  linkedin_url: string;
  youtube_url: string;
  website_url: string;
}

const defaultSettings: SiteSettings = {
  whatsapp: "5541997539084",
  email: "contato@rorschachmotion.com.br",
  phone: "(41) 99753-9084",
  address: "Curitiba, PR - Brasil",
  instagram_url: "https://instagram.com/rorschachmotion",
  facebook_url: "",
  linkedin_url: "https://linkedin.com/in/emersoncordeiro",
  youtube_url: "",
  website_url: "https://rorschachmotion.com.br",
};

export const useSiteSettings = () => {
  const [settings] = useState<SiteSettings>(defaultSettings);
  const [loading] = useState(false);

  return { settings, loading };
};
