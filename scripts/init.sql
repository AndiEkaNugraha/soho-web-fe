-- CMS Users (Google OAuth accounts)
CREATE TABLE IF NOT EXISTS cms_users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(200),
  avatar VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES cms_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image VARCHAR(500) DEFAULT '',
  author_name VARCHAR(200) DEFAULT '',
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  type VARCHAR(20) DEFAULT 'blog',
  status VARCHAR(20) DEFAULT 'draft',
  tags TEXT DEFAULT '',
  meta_title VARCHAR(500) DEFAULT '',
  meta_description TEXT DEFAULT '',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Works / Portfolio
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

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  subject VARCHAR(500) DEFAULT '',
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
