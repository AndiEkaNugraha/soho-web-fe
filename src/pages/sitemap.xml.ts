export const prerender = false;

import { query } from '../lib/db';

export async function GET() {
  const site = (import.meta.env.SITE_URL || 'https://sohodigital.id').replace(/\/$/, '');

  const staticPages = [
    { path: '/',                                      priority: '1.0', freq: 'weekly' },
    { path: '/works',                                 priority: '0.9', freq: 'weekly' },
    { path: '/blog',                                  priority: '0.9', freq: 'daily'  },
    { path: '/contact',                               priority: '0.8', freq: 'monthly' },
    { path: '/services',                              priority: '0.8', freq: 'monthly' },
    { path: '/service/website-design-and-development', priority: '0.7', freq: 'monthly' },
    { path: '/service/custom-software-development',   priority: '0.7', freq: 'monthly' },
    { path: '/service/it-consultation',               priority: '0.7', freq: 'monthly' },
  ];

  const articles = await query(
    `SELECT slug, updated_at FROM articles WHERE status = 'published' ORDER BY published_at DESC`
  ).then(r => r.rows).catch(() => [] as any[]);

  const works = await query(
    `SELECT slug, updated_at FROM works WHERE status = 'published' ORDER BY sort_order ASC`
  ).then(r => r.rows).catch(() => [] as any[]);

  const fmt = (d: string | Date) => new Date(d).toISOString().split('T')[0];

  const urlNodes = [
    ...staticPages.map(p => `  <url>
    <loc>${site}${p.path}</loc>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...articles.map((a: any) => `  <url>
    <loc>${site}/blog/${a.slug}</loc>
    <lastmod>${fmt(a.updated_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),
    ...works.map((w: any) => `  <url>
    <loc>${site}/portofolio/${w.slug}</loc>
    <lastmod>${fmt(w.updated_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
