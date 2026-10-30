# Foto untuk website

Semua foto bersifat opsional. Tanpa foto, website tetap tampil rapi.

## Aturan nama dan ukuran
- Format JPEG atau WebP, sisi terpanjang 1600 px, ukuran file 150 sampai 400 KB.
- Nama file huruf kecil dan pakai tanda hubung, contoh: `drawing-01.jpg`.
- Teks alternatif (alt) dalam bahasa Inggris, isi di `data/photos.js`.

## Letak file
| Slot | File | Rasio |
|---|---|---|
| hero-portrait | `profile/portrait.jpg` | 4:5 |
| cv-photo | `profile/cv-photo.jpg` | 3:4 |
| drawings | `interests/drawing-01.jpg` sampai `drawing-03.jpg` | 1:1 |
| video-poster | `../video/poster.jpg` | 16:9 |
| og-image | `og-image.jpg` | 1200x630 |

## Privasi
- Hapus EXIF dan GPS sebelum diunggah (lihat `tools/optimize-images.sh`).
- Jangan pakai foto yang menampilkan alamat rumah, plat nomor, atau data pribadi.
- Foto orang lain hanya dengan izin orang tersebut.
- Setelah file ada, isi `src` pada slot terkait di `data/photos.js`.
