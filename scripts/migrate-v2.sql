-- v2: meta fields for articles + status/note for contact submissions

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(500) DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';
