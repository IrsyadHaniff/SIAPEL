/* ================================================================
   SIAPEL – api.js
   Semua komunikasi ke Google Apps Script terpusat di sini.
   ================================================================ */

const API_URL =
  "https://script.google.com/macros/s/AKfycbzKwr0mZkJfKBe9Kbwd5g7FUk1H4bJNa5tLrHy2-v7TAwa7dGql9zaa06FjFlmWKAt7/exec";

const CACHE_KEY  = "siapel_cache";
const CACHE_TTL  = 5 * 60 * 1000; // 5 menit (ms)

/* ────────────────────────────────────────────────
   Cache via sessionStorage
   ──────────────────────────────────────────────── */
function cacheGet() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(CACHE_KEY); return null; }
    return data;
  } catch { return null; }
}

function cacheSet(data) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); }
  catch { /* storage penuh – skip */ }
}

/* ────────────────────────────────────────────────
   Fetch semua data (alumni, rekap, unitKerja, kegiatan)
   Mengembalikan Promise<{ alumni, rekapAlumni, unitKerjaList, kegiatan }>
   ──────────────────────────────────────────────── */
async function fetchAllData(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = cacheGet();
    if (cached) return cached;
  }

  const res  = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  cacheSet(data);
  return data;
}

/* ────────────────────────────────────────────────
   POST helper (create / update / delete kegiatan,
   savePresensi, uploadTTD, verifyTurnstile)
   ──────────────────────────────────────────────── */
async function postAction(body) {
  const res = await fetch(API_URL, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────────
   Invalidate cache (panggil setelah ada perubahan data)
   ──────────────────────────────────────────────── */
function invalidateCache() {
  sessionStorage.removeItem(CACHE_KEY);
}
