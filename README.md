# Portofolio Shevie Putri Ariandani

Website statis (HTML, CSS, JavaScript biasa). Tanpa framework, tanpa build step. Tema: "cat cafe notebook".

## Menjalankan di komputer
Buka `index.html` langsung di browser, atau jalankan server statis:

```
python -m http.server 8000
```

Lalu buka http://localhost:8000

## Deploy ke GitHub Pages
1. Push folder ini ke repository GitHub (branch `main`).
2. Buka **Settings > Pages**.
3. Pada "Build and deployment", pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu Save.
4. Tunggu beberapa menit. Semua path di website relatif, jadi aman dipakai di sub-path seperti `username.github.io/nama-repo/`.
5. Setelah punya alamat final, ubah `og:image` di `index.html` menjadi alamat lengkap (https://...) supaya preview link tampil di media sosial.

## Menambahkan video perkenalan
Tips merekam: posisi landscape, hadap jendela supaya cahaya bagus, bicara pelan, durasi sekitar 20 detik. Unggah ke YouTube dengan visibilitas **Unlisted**.

Buka `data/config.js`, lalu isi bagian `video`:

- YouTube: `provider: "youtube"` dan `id: "ID_VIDEO"` (bagian setelah `v=` pada link).
- File sendiri: `provider: "file"` dan `src: "assets/video/intro.mp4"`. Subtitle (opsional) di `captions: "assets/video/intro.vtt"`.
- Poster (opsional): `poster: "assets/video/poster.jpg"`.

Selama `id` dan `src` kosong, website menampilkan kotak "Introduction video coming soon". Video tidak pernah diputar otomatis. Pemutar baru dimuat setelah tombol play diklik.

## Mengedit isi
Semua teks ada di folder `data/`:

| File | Isi |
|---|---|
| `config.js` | Hero, video, teks script, tombol CV PDF, catatan jurnal, footer |
| `cv.js` | Profil, pendidikan, pengalaman, minat, kontak |
| `shopping.js` | Esai belanja online, daftar kebiasaan, cerita skincare |
| `journals.js` | Lima jurnal (judul, sitasi, ringkasan, link, DOI) |
| `photos.js` | Slot foto |

Setelah mengedit, jalankan sekali:

```
python tools/prerender.py
```

Perintah ini memperbarui salinan statis di `index.html` supaya isi tetap terbaca tanpa JavaScript. (Butuh `pip install playwright` dan Google Chrome.)

## Menambahkan bagian yang masih tersembunyi
- **Cerita skincare**: tulis di `data/shopping.js` pada `story`, misalnya `{ platform: "...", when: "...", text: "90 sampai 130 kata, sudut pandang orang pertama", links: "bad-1" }`. `links` adalah id kartu kelebihan atau kekurangan yang cocok (`good-1` sampai `good-4`, `bad-1` sampai `bad-4`). Kartu muncul otomatis dengan label "My experience".
- **Internship**: isi `internship` di `data/cv.js` dengan `{ company, role, period, description }`. Jangan diisi kalau belum dikonfirmasi.
- **Skills**: isi `skills` di `data/cv.js` dengan daftar teks, misalnya `["Skill 1", "Skill 2"]`.
- **Tombol Download CV (PDF)**: simpan PDF yang sudah bebas data pribadi di `assets/docs/`, lalu isi `cvPdf: "assets/docs/cv-shevie.pdf"` di `data/config.js`. Selama kosong, tombolnya tersembunyi.

Bagian yang kosong tidak ditampilkan sama sekali.

## Menambahkan foto
1. Kecilkan foto dan hapus EXIF: `tools/optimize-images.sh foto-asli.jpg assets/images/profile/portrait.jpg` (butuh ImageMagick).
2. Isi `src` pada slot yang sesuai di `data/photos.js`, misalnya `src: "assets/images/profile/portrait.jpg"`, dan sesuaikan `alt` (bahasa Inggris).
3. Slot `optional: true` (foto CV, gambar, poster) baru muncul setelah `src` diisi. `hidden: true` menghapus slot.

Aturan nama dan ukuran ada di `assets/images/README.md`.

## Menghapus EXIF
Dengan ImageMagick: `magick foto.jpg -auto-orient -strip foto-bersih.jpg`. Atau pakai `tools/optimize-images.sh`, yang sudah menyertakan `-strip`. Cek hasilnya dengan `magick identify -verbose foto-bersih.jpg` dan pastikan tidak ada baris `exif:` atau `GPS`.

## Struktur
```
index.html          halaman utama
css/                style.css (dasar), sections.css (per bagian)
js/                 render.js (data ke HTML), app.js (perilaku), motion.js (GSAP)
js/vendor/          GSAP dan ScrollTrigger (self-hosted)
fonts/              Fredoka, Figtree, Caveat (self-hosted)
data/               semua teks yang bisa diedit
assets/             gambar, video, dokumen
tools/              prerender, optimasi gambar, pembuat og-image
```

Mengganti gambar preview link: timpa `assets/images/og-image.jpg` (1200x630). File saat ini hanya placeholder.
