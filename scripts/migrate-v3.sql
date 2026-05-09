-- v3: works portfolio tables

CREATE TABLE IF NOT EXISTS works (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(500) NOT NULL,
  slug          VARCHAR(500) UNIQUE NOT NULL,
  client_name   VARCHAR(200) DEFAULT '',
  category      VARCHAR(200) DEFAULT '',
  year          VARCHAR(10)  DEFAULT '',
  website_url   VARCHAR(500) DEFAULT '',
  logo_url      VARCHAR(500) DEFAULT '',
  cover_image   VARCHAR(500) DEFAULT '',
  banner_url    VARCHAR(500) DEFAULT '',
  banner_type   VARCHAR(10)  DEFAULT 'video',
  bg_color      VARCHAR(30)  DEFAULT '#e9e8e9',
  grid_bg_color VARCHAR(30)  DEFAULT '#dedbdf',
  accent_color  VARCHAR(30)  DEFAULT '#000000',
  overview      TEXT         DEFAULT '',
  highlight_quote VARCHAR(500) DEFAULT 'Simplicity, elegance, innovation!',
  highlight_body  TEXT         DEFAULT '',
  meta_title      VARCHAR(500) DEFAULT '',
  meta_description TEXT        DEFAULT '',
  status        VARCHAR(20)  DEFAULT 'draft',
  sort_order    INTEGER      DEFAULT 0,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_images (
  id         SERIAL PRIMARY KEY,
  work_id    INTEGER REFERENCES works(id) ON DELETE CASCADE,
  url        VARCHAR(500) NOT NULL,
  type       VARCHAR(10)  DEFAULT 'image',
  layout     VARCHAR(10)  DEFAULT 'full',
  alt_text   VARCHAR(300) DEFAULT '',
  sort_order INTEGER      DEFAULT 0,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);
