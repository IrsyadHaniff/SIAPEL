/* ================================================================
   SIAPEL – app.js 
   ================================================================ */

// ── STATE ─────────────────────────────────────────────────────────
let ALUMNI_DB = []; // diisi dari API
let UNIT_KERJA_API = []; // diisi dari API  [{ id, nama_unit }]
let selectedUnitKerja = ""; // label string
let selectedProvinsi = ""; // label string

// ── PROVINSI  ────────────
const PROVINSI = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bengkulu",
  "Lampung",
  "Bangka Belitung",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Bali",
  "NTB",
  "NTT",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua Barat",
  "Papua",
];

// ================================================================
//  INIT – fetch data dari Apps Script
// ================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();

  // Tampilkan skeleton stats selama loading
  setHeroStats(null);

  try {
    const data = await fetchAllData();

    ALUMNI_DB = data.alumni || [];
    UNIT_KERJA_API = (data.unitKerjaList || []).map((u, i) => ({ id: i + 1, nama_unit: u }));

    // Update hero stats
    setHeroStats(data);

    // Inisialisasi dropdown
    if (document.getElementById("unit-kerja-btn")) {
      initDropdown({
        btnId: "unit-kerja-btn",
        dropdownId: "unit-kerja-dropdown",
        listId: "unit-kerja-list",
        searchId: "unit-kerja-search",
        items: UNIT_KERJA_API,
        labelKey: "nama_unit",
        onSelect: (id, label) => {
          selectedUnitKerja = label;
          document.getElementById("unit-kerja-label").textContent = label || "Semua Unit Kerja";
          document.getElementById("unit-kerja-id").value = label;
          triggerSearch();
        },
      });

      const provItems = PROVINSI.map((p, i) => ({ id: i + 1, nama_provinsi: p }));
      initDropdown({
        btnId: "provinsi-btn",
        dropdownId: "provinsi-dropdown",
        listId: "provinsi-list",
        searchId: "provinsi-search",
        items: provItems,
        labelKey: "nama_provinsi",
        onSelect: (id, label) => {
          selectedProvinsi = label;
          document.getElementById("provinsi-label").textContent = label || "Semua";
          document.getElementById("provinsi-id").value = label;
          triggerSearch();
        },
      });
    }
  } catch (err) {
    console.error("Gagal load data SIAPEL:", err);
    setHeroStats("error");
  }

  initCounters();
});

// ================================================================
//  HERO STATS – update angka counter dari data API
// ================================================================
function setHeroStats(data) {
  const statAlumni = document.querySelector("#hero-stats .stat-value[data-key='alumni']");
  const statUnit = document.querySelector("#hero-stats .stat-value[data-key='unit']");
  const statProvinsi = document.querySelector("#hero-stats .stat-value[data-key='provinsi']");

  if (!statAlumni) return; // bukan di halaman beranda

  if (data === null) {
    // loading state
    [statAlumni, statUnit, statProvinsi].forEach((el) => {
      if (el) el.textContent = "...";
    });
    return;
  }
  if (data === "error") {
    [statAlumni, statUnit, statProvinsi].forEach((el) => {
      if (el) el.textContent = "-";
    });
    return;
  }

  const jumlahAlumni = (data.alumni || []).length;
  const jumlahUnit = (data.unitKerjaList || []).length;
  const jumlahProvinsi = new Set((data.alumni || []).map((a) => a.provinsi).filter(Boolean)).size;

  // Set data-target untuk animasi counter
  if (statAlumni) {
    statAlumni.dataset.target = jumlahAlumni;
    statAlumni.textContent = jumlahAlumni;
  }
  if (statUnit) {
    statUnit.dataset.target = jumlahUnit;
    statUnit.textContent = jumlahUnit;
  }
  if (statProvinsi) {
    statProvinsi.dataset.target = jumlahProvinsi;
    statProvinsi.textContent = jumlahProvinsi;
  }

  // Update about-section stats juga
  const aboutAlumni = document.querySelector(".about-stat-value[data-key='alumni']");
  const aboutUnit = document.querySelector(".about-stat-value[data-key='unit']");
  const aboutProvinsi = document.querySelector(".about-stat-value[data-key='provinsi']");
  if (aboutAlumni) aboutAlumni.textContent = jumlahAlumni.toLocaleString("id-ID");
  if (aboutUnit) aboutUnit.textContent = jumlahUnit;
  if (aboutProvinsi) aboutProvinsi.textContent = jumlahProvinsi;
}

// ================================================================
//  NAVBAR
// ================================================================
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  // Scroll effect
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 12);
    },
    { passive: true },
  );

  // Hamburger
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen);
      mobileMenu.hidden = !isOpen;
    });
  }

  // Tutup menu saat klik link mobile
  document.querySelectorAll(".mobile-nav-link, .mobile-btn-cari").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
    });
  });

  // Scroll spy
  const sections = ["beranda", "alumni", "tentang", "kontak"];
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === e.target.id));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// ================================================================
//  HERO COUNTERS (animasi angka)
// ================================================================
function initCounters() {
  const statsEl = document.getElementById("hero-stats");
  if (!statsEl) return;
  const counters = statsEl.querySelectorAll(".stat-value");
  let animated = false;

  const runCounters = () => {
    if (animated) return;
    animated = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counters.forEach((c) => (c.textContent = parseInt(c.dataset.target || 0).toLocaleString("id-ID")));
      return;
    }

    const duration = 900;
    const start = performance.now();
    const targets = Array.from(counters).map((c) => parseInt(c.dataset.target || 0));

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      counters.forEach((c, i) => {
        c.textContent = Math.round(targets[i] * ease).toLocaleString("id-ID");
      });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) runCounters();
    },
    { threshold: 0.4 },
  );
  io.observe(statsEl);
}

// ================================================================
//  DROPDOWN (Unit Kerja & Provinsi)
// ================================================================
function initDropdown(config) {
  const { btnId, dropdownId, listId, searchId, onSelect, items, labelKey } = config;
  const btn = document.getElementById(btnId);
  const dropdown = document.getElementById(dropdownId);
  const list = document.getElementById(listId);
  const searchInput = document.getElementById(searchId);
  if (!btn || !dropdown) return;

  const renderList = (query = "") => {
    const q = query.toLowerCase().trim();
    const filtered = q ? items.filter((i) => i[labelKey].toLowerCase().includes(q)) : items;
    list.innerHTML = `
      <li>
        <button type="button" class="dropdown-item" data-id="" data-label="">
          Semua ${labelKey === "nama_unit" ? "Unit Kerja" : "Provinsi"}
        </button>
      </li>
      ${filtered
        .map(
          (i) => `
        <li>
          <button type="button" class="dropdown-item" data-id="${i.id}" data-label="${i[labelKey]}">
            ${i[labelKey]}
          </button>
        </li>
      `,
        )
        .join("")}
      ${filtered.length === 0 ? '<li class="dropdown-empty">Tidak ada hasil</li>' : ""}
    `;
    list.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.id ? parseInt(item.dataset.id) : null;
        const label = item.dataset.label;
        onSelect(id, label);
        dropdown.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        searchInput.value = "";
        renderList();
        list.querySelectorAll(".dropdown-item").forEach((b) => b.classList.remove("selected"));
        item.classList.add("selected");
      });
    });
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.hidden;
    closeAllDropdowns();
    if (!isOpen) {
      dropdown.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      renderList();
      setTimeout(() => searchInput.focus(), 50);
    }
  });

  searchInput.addEventListener("input", () => renderList(searchInput.value));
  searchInput.addEventListener("click", (e) => e.stopPropagation());

  renderList();
}

function closeAllDropdowns() {
  ["unit-kerja-dropdown", "provinsi-dropdown"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  ["unit-kerja-btn", "provinsi-btn"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-expanded", "false");
  });
}

document.addEventListener("click", closeAllDropdowns);

// ================================================================
//  ALUMNI SEARCH
// ================================================================
// trigger pencarian tanpa perlu event (dipanggil dari dropdown)
function triggerSearch() {
  const fakeEvent = { preventDefault: () => {} };
  cariAlumni(fakeEvent);
}

async function cariAlumni(e) {
  e.preventDefault();
  const q = document.getElementById("q").value.trim().toLowerCase();

  //  pencarian tetap jalan pakai filter unit/provinsi

  const hasilSection = document.getElementById("hasil-section");
  const skeleton = document.getElementById("skeleton");
  const tabelHasil = document.getElementById("tabel-hasil");
  const notFound = document.getElementById("not-found");
  const hasilLabel = document.getElementById("hasil-label");
  const tabelBody = document.getElementById("tabel-body");

  // Tampilkan loading
  hasilSection.hidden = false;
  skeleton.hidden = false;
  tabelHasil.hidden = true;
  notFound.hidden = true;
  hasilLabel.textContent = "Memuat data...";
  hasilSection.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    // Ambil data (dari cache jika ada)
    const data = await fetchAllData();
    ALUMNI_DB = data.alumni || [];

    skeleton.hidden = true;

    // Filter
    const results = ALUMNI_DB.filter((a) => {
      const matchQ = !q || a.nama.toLowerCase().includes(q) || a.nip.includes(q);
      const matchUnit = !selectedUnitKerja || a.unitKerja === selectedUnitKerja;
      const matchProv = !selectedProvinsi || a.provinsi === selectedProvinsi;
      return matchQ && matchUnit && matchProv;
    });

    if (results.length > 0) {
      tabelBody.innerHTML = results
        .map(
          (a) => `
        <tr>
          <td class="mono" style="color:#0F0F0F">${a.nip || "-"}</td>
          <td style="font-weight:600;color:#0F0F0F">${a.nama || "-"}</td>
          <td style="color:#0F0F0F">${a.jabatan || "-"}</td>
          <td style="color:#0F0F0F">${a.unitKerja || "-"}</td>
          <td style="color:#0F0F0F">${a.provinsi || "-"}</td>
        </tr>
      `,
        )
        .join("");
      tabelHasil.hidden = false;
      notFound.hidden = true;
      hasilLabel.textContent = `Hasil Pencarian (${results.length} ditemukan)`;
    } else {
      tabelHasil.hidden = true;
      notFound.hidden = false;
      hasilLabel.textContent = "Tidak Ditemukan";
    }
  } catch (err) {
    skeleton.hidden = true;
    notFound.hidden = false;
    hasilLabel.textContent = "Gagal memuat data";
    console.error("cariAlumni error:", err);
  }
}

function resetSearch() {
  document.getElementById("q").value = "";
  selectedUnitKerja = "";
  selectedProvinsi = "";

  const ukLabel = document.getElementById("unit-kerja-label");
  const pLabel = document.getElementById("provinsi-label");
  const ukId = document.getElementById("unit-kerja-id");
  const pId = document.getElementById("provinsi-id");
  if (ukLabel) ukLabel.textContent = "Semua Unit Kerja";
  if (pLabel) pLabel.textContent = "Semua";
  if (ukId) ukId.value = "";
  if (pId) pId.value = "";

  const hasilSection = document.getElementById("hasil-section");
  if (hasilSection) hasilSection.hidden = true;
}
