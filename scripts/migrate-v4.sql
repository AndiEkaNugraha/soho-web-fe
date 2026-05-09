-- v4: SEO settings per static page

CREATE TABLE IF NOT EXISTS page_seo (
  id               SERIAL PRIMARY KEY,
  page_key         VARCHAR(100) UNIQUE NOT NULL,
  page_label       VARCHAR(200) NOT NULL,
  meta_title       VARCHAR(500) DEFAULT '',
  meta_description TEXT         DEFAULT '',
  og_image         VARCHAR(500) DEFAULT '',
  updated_at       TIMESTAMPTZ  DEFAULT NOW()
);

INSERT INTO page_seo (page_key, page_label, meta_title, meta_description, og_image) VALUES
  ('home',             'Homepage',                        'Soho Solusi Digital',                                'Empowering Businesses Through Smart Solutions. Kami membantu bisnis Anda menemukan cara terbaik untuk tumbuh, beradaptasi, dan berkembang di era digital.', ''),
  ('works',            'Works / Portfolio',               'Works | Soho Solusi Digital',                        'Explore our portfolio — websites, custom software, and digital systems we''ve built for clients across Indonesia.', ''),
  ('blog',             'Blog',                            'Blog | Soho Solusi Digital',                         'Latest news, insights and articles from Soho Solusi Digital.', ''),
  ('contact',          'Contact',                         'Contact Us | Soho Solusi Digital',                   'Hubungi kami untuk pertanyaan, dukungan, atau peluang kerja sama. Kami di sini untuk membantu Anda sukses.', ''),
  ('services',         'Services',                        'Our Services | Soho Solusi Digital',                 'Temukan bagaimana layanan Soho dalam Web Design, Custom Software Development, dan IT Consulting dapat mentransformasi bisnis Anda.', ''),
  ('service-website',  'Service: Website Design & Dev',   'Website Design & Development | Soho Solusi Digital', 'Kami membantu bisnis membangun kehadiran digital yang bukan hanya indah secara visual, tapi juga efisien dan cepat.', ''),
  ('service-software', 'Service: Custom Software Dev',    'Custom Software Development | Soho Solusi Digital',  'Kami mengembangkan perangkat lunak yang didesain sepenuhnya sesuai kebutuhan bisnis Anda — efisien, hemat biaya, dan produktif.', ''),
  ('service-it',       'Service: IT Consultation',        'IT Consultation | Soho Solusi Digital',              'Kami membantu perusahaan mengambil keputusan teknologi yang tepat, efisien, dan berdampak jangka panjang.', '')
ON CONFLICT (page_key) DO NOTHING;
