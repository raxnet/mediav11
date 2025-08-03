# raxnet

Aplikasi tugas berbasis koin, fullstack dan modern untuk Cloudflare Pages.

## Fitur
- Register/Login user
- Dashboard user (saldo koin, tugas)
- Dashboard developer (daftar user, leaderboard)
- Buat tugas: potong koin, link & like target, judul
- Selesaikan tugas: redirect ke link, dapat koin, proof upload (opsional)
- Transfer koin ke user lain
- Notifikasi real-time
- Gamifikasi: badge, leaderboard
- Responsive, dark mode, multi bahasa

## Deploy
1. Setup D1 dan KV di Cloudflare
2. Jalankan SQL migrasi di D1: `setup.sql`
3. Upload project ke Pages (GitHub atau ZIP), pastikan file utama di root.
4. Atur build command: `npm run build`, output: `dist`
5. Atur environment D1 & KV di dashboard Pages
6. Deploy!

## Struktur
- Backend: functions/ (Cloudflare Pages Functions)
- Frontend: src/ (React, Tailwind, modern UI/UX)
- Database: D1 (users, tasks, submissions), KV (sessions, notifications)

---

**Project raxnet siap deploy di Cloudflare Pages dengan fitur premium!**