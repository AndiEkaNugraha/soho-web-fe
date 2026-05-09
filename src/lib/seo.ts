import { query } from './db';

export interface PageSeo {
  meta_title: string;
  meta_description: string;
  og_image: string;
}

export async function getPageSeo(key: string): Promise<PageSeo | null> {
  try {
    const res = await query<PageSeo>(
      'SELECT meta_title, meta_description, og_image FROM page_seo WHERE page_key = $1',
      [key]
    );
    return res.rows[0] || null;
  } catch {
    return null;
  }
}
