# 🌙 Noctyra AI Web

Web chat interface untuk Noctyra AI, powered by Anthropic Claude.

> Dibuat oleh **Xano** (gvnjpn-cmyk)

---

## 📁 Struktur File

```
noctyra-ai-web/
├── server.js          ← Express backend + API proxy
├── package.json       ← Dependencies
├── .env               ← API key (buat sendiri, jangan di-commit!)
├── .env.example       ← Contoh format .env
└── public/
    └── index.html     ← UI chat
```

---

## 🚀 Deploy ke Pterodactyl

### 1. Upload ke GitHub dulu
Push semua file ini ke repo GitHub kamu.

### 2. Setting di Pterodactyl
- **Startup Command:** `node server.js`
- **Node.js version:** >= 18

### 3. Set Environment Variable
Di panel Pterodactyl, tambahkan variabel:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```
> Port biasanya sudah otomatis di-set oleh Pterodactyl via env `PORT`.

### 4. Install dependencies & jalankan
```bash
npm install
npm start
```

---

## 💻 Jalankan Lokal (Dev)

```bash
# Clone / download project
cd noctyra-ai-web

# Buat file .env dari contoh
cp .env.example .env
# Edit .env, isi ANTHROPIC_API_KEY

# Install dependencies
npm install

# Jalankan
npm start
# Buka http://localhost:3000
```

---

## 🔑 Dapatkan API Key

1. Buka https://console.anthropic.com
2. Login / daftar
3. Buat API Key baru
4. Paste ke file `.env`

---

## ✨ Fitur

- 🌙 Dark / Light mode toggle
- 💬 Chat multi-turn (ingat konteks percakapan)
- 📝 Markdown rendering lengkap (code, bold, list, dll)
- 🎨 Syntax highlighting untuk kode
- ⚡ Typing indicator animasi
- 📱 Responsive (mobile friendly)
- 🤖 AI tahu siapa pembuatnya (Xano / gvnjpn-cmyk)
