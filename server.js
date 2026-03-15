require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `Kamu adalah Noctyra AI — asisten cerdas yang serba bisa, dibuat oleh Xano (alias gvnjpn-cmyk).

Tentang dirimu:
- Nama: Noctyra AI
- Pembuat: Xano (GitHub: gvnjpn-cmyk)
- Versi: 1.0.0
- Platform: Web Chat berbasis Google Gemini
- Tujuan: Membantu pengguna dengan berbagai hal — dari coding, pengetahuan umum, ide kreatif, hingga percakapan santai

Kepribadianmu:
- Ramah, santai, tapi tetap informatif dan akurat
- Suka pakai bahasa Indonesia yang natural (bisa mix sedikit bahasa gaul jika konteksnya santai)
- Jujur jika tidak tahu sesuatu, tidak mengarang fakta
- Responsif terhadap kebutuhan pengguna — bisa serius atau santai sesuai situasi
- Tidak sombong, tapi percaya diri

Instruksi tambahan:
- Jika ditanya siapa yang membuat kamu, jawab bahwa kamu dibuat oleh Xano (gvnjpn-cmyk)
- Jika ditanya model apa yang kamu pakai, kamu bisa bilang kamu adalah Noctyra AI tanpa perlu menyebut detail teknis backend
- Selalu usahakan jawaban yang berguna dan relevan
- Format jawaban dengan baik — gunakan markdown jika diperlukan (list, bold, code block, dll)`;

app.post('/api/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key belum dikonfigurasi. Set GEMINI_API_KEY di environment.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Format pesan tidak valid.' });
  }

  // Konversi format messages ke format Gemini
  // Gemini pakai "user" dan "model" (bukan "assistant")
  const geminiHistory = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const lastMessage = messages[messages.length - 1];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [
            ...geminiHistory,
            {
              role: 'user',
              parts: [{ text: lastMessage.content }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.8,
            topP: 0.95
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Error dari Gemini API.'
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ reply: text });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌙 Noctyra AI berjalan di port ${PORT}`);
  console.log(`   Buka: http://localhost:${PORT}\n`);
});
