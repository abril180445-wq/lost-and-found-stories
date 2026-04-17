import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE_URL = "https://rorschachmotion.com.br";

const STATIC_ROUTES = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/servicos", changefreq: "monthly", priority: "0.9" },
  { loc: "/sobre", changefreq: "monthly", priority: "0.7" },
  { loc: "/projetos", changefreq: "monthly", priority: "0.8" },
  { loc: "/contato", changefreq: "monthly", priority: "0.8" },
  { loc: "/orcamento", changefreq: "monthly", priority: "0.9" },
  { loc: "/blog", changefreq: "weekly", priority: "0.7" },
  { loc: "/politica-privacidade", changefreq: "yearly", priority: "0.3" },
  { loc: "/termos", changefreq: "yearly", priority: "0.3" },
];

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("published", true);

  const urls = [
    ...STATIC_ROUTES.map(
      (r) => `<url><loc>${SITE_URL}${r.loc}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`,
    ),
    ...(posts ?? []).map(
      (p) =>
        `<url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${
          p.updated_at ?? new Date().toISOString()
        }</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    ),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
