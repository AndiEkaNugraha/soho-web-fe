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

## 📋 Status Konversi

### ✅ Selesai
- [x] Struktur dasar proyek Astro
- [x] BaseLayout.astro (layout utama dengan navbar dan animasi)
- [x] Menu.astro (komponen navigasi)
- [x] index.astro (halaman home dari home-1.html)
- [x] home-2.astro (halaman personal)
- [x] services.astro (daftar layanan)
- [x] service.astro (detail layanan)
- [x] contact.astro (halaman kontak dengan form dan peta)
- [x] team.astro (halaman tim dengan grid member)
- [x] 404.astro (halaman error)
- [x] Copy semua aset (CSS, JS, gambar)
- [x] Setup development server
- [x] Fixed navbar dan animasi geometris

### 🚧 Dalam Progress
- [ ] Halaman portfolio (portfolio-1, portfolio-2, portfolio-3)
- [ ] Halaman project detail (project-1 sampai project-6)
- [ ] Halaman blog (blog.html, publication.html, blog-inner.html)
- [ ] Komponen terpisah (Footer, Header, dll)
- [ ] Optimisasi gambar dan aset
- [ ] TypeScript integration yang lebih baik

### 📝 Catatan
- Template Ashley berhasil dikonversi ke Astro dengan mempertahankan semua styling dan fungsionalitas
- Script tags menggunakan `is:inline` directive untuk kompatibilitas dengan Vite bundling
- Struktur komponen modular memudahkan maintenance dan pengembangan lebih lanjut

## 🔗 Links Berguna
- [Astro Documentation](https://docs.astro.build)
- [Ashley Original Template](./ashley-creative-portfolio-template-2024-01-08-13-05-20-utc/)