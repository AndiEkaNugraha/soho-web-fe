# Ashley Portfolio - Astro Version

Konversi template HTML Ashley Creative Portfolio ke framework Astro.

## 🚀 Struktur Proyek

```text
/
├── public/
│   ├── css/           # CSS files dari template Ashley
│   ├── js/            # JavaScript files dari template Ashley  
│   └── img/           # Semua gambar dan aset media
├── src/
│   ├── components/    # Komponen Astro (Menu, dll)
│   ├── layouts/       # Layout template (BaseLayout.astro)
│   └── pages/         # Halaman-halaman website
│       └── index.astro # Halaman utama (konversi dari home-1.html)
└── package.json
```

## 🧞 Perintah Dasar

Semua perintah dijalankan dari root proyek, di terminal:

| Perintah                   | Aksi                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Menginstall dependencies                        |
| `npm run dev`             | Menjalankan dev server di `localhost:4321`     |
| `npm run build`           | Build production ke `./dist/`                  |
| `npm run preview`         | Preview build secara lokal, sebelum deploy     |
| `npm run astro ...`       | Menjalankan CLI commands seperti `astro add`, `astro check` |
| `npm run astro -- --help` | Bantuan untuk menggunakan Astro CLI            |