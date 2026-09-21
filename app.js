/* ================================================================
   SIAPEL – app.js 
   ================================================================ */

// ── DATA DUMMY ────────────────────────────────────────────────────
const UNIT_KERJA = [
  { id: 1, nama_unit: "bpsdm" },
];

const PROVINSI = [
  { id: 1, nama_provinsi: "Aceh" },
  { id: 2, nama_provinsi: "Sumatera Utara" },
  { id: 3, nama_provinsi: "Sumatera Barat" },
  { id: 4, nama_provinsi: "Riau" },
  { id: 5, nama_provinsi: "Kepulauan Riau" },
  { id: 6, nama_provinsi: "Jambi" },
  { id: 7, nama_provinsi: "Sumatera Selatan" },
  { id: 8, nama_provinsi: "Bengkulu" },
  { id: 9, nama_provinsi: "Lampung" },
  { id: 10, nama_provinsi: "Bangka Belitung" },
  { id: 11, nama_provinsi: "DKI Jakarta" },
  { id: 12, nama_provinsi: "Jawa Barat" },
  { id: 13, nama_provinsi: "Jawa Tengah" },
  { id: 14, nama_provinsi: "DI Yogyakarta" },
  { id: 15, nama_provinsi: "Jawa Timur" },
  { id: 16, nama_provinsi: "Banten" },
  { id: 17, nama_provinsi: "Bali" },
  { id: 18, nama_provinsi: "NTB" },
  { id: 19, nama_provinsi: "NTT" },
  { id: 20, nama_provinsi: "Kalimantan Barat" },
  { id: 21, nama_provinsi: "Kalimantan Tengah" },
  { id: 22, nama_provinsi: "Kalimantan Selatan" },
  { id: 23, nama_provinsi: "Kalimantan Timur" },
  { id: 24, nama_provinsi: "Kalimantan Utara" },
  { id: 25, nama_provinsi: "Sulawesi Utara" },
  { id: 26, nama_provinsi: "Sulawesi Tengah" },
  { id: 27, nama_provinsi: "Sulawesi Selatan" },
  { id: 28, nama_provinsi: "Sulawesi Tenggara" },
  { id: 29, nama_provinsi: "Gorontalo" },
  { id: 30, nama_provinsi: "Sulawesi Barat" },
  { id: 31, nama_provinsi: "Maluku" },
  { id: 32, nama_provinsi: "Maluku Utara" },
  { id: 33, nama_provinsi: "Papua Barat" },
  { id: 34, nama_provinsi: "Papua" },
];

const ALUMNI_DB = [
  { id: 1, nip: "198203152006041002", nama: "Ridwan Kamil Prasetyo", jabatan: "Kepala Bidang", unit_kerja: "BKN Pusat", unit_kerja_id: 1, provinsi: "DKI Jakarta", provinsi_id: 11, pkp: "Lulus", pka: "Lulus" },
  { id: 2, nip: "197908252004012003", nama: "Siti Rahayu Wulandari", jabatan: "Kepala Sub Bagian", unit_kerja: "Kemendagri", unit_kerja_id: 2, provinsi: "Jawa Barat", provinsi_id: 12, pkp: "Lulus", pka: "Tidak Lulus" },
  { id: 3, nip: "198506102009031005", nama: "Ahmad Fauzi Hakim", jabatan: "Analis Kebijakan", unit_kerja: "Kemenkeu", unit_kerja_id: 3, provinsi: "Jawa Tengah", provinsi_id: 13, pkp: "Lulus", pka: null },
  { id: 4, nip: "198712052010012001", nama: "Dewi Lestari Safitri", jabatan: "Kepala Seksi", unit_kerja: "Kemenkes", unit_kerja_id: 4, provinsi: "Jawa Timur", provinsi_id: 15, pkp: "Belum", pka: "Belum" },
  { id: 5, nip: "198001302003121004", nama: "Budi Santoso Permadi", jabatan: "Kepala Bidang", unit_kerja: "BPS Nasional", unit_kerja_id: 5, provinsi: "Sumatera Utara", provinsi_id: 2, pkp: "Lulus", pka: "Lulus" },
  { id: 6, nip: "199003201912012002", nama: "Rina Fitriani Putri", jabatan: "Perencana", unit_kerja: "Kemenpan RB", unit_kerja_id: 6, provinsi: "Bali", provinsi_id: 17, pkp: "Tidak Lulus", pka: null },
  { id: 7, nip: "197805142001121003", nama: "Hendra Kurniawan Susilo", jabatan: "Auditor", unit_kerja: "BPKP", unit_kerja_id: 7, provinsi: "Sulawesi Selatan", provinsi_id: 27, pkp: "Lulus", pka: "Lulus" },
  { id: 8, nip: "198904162012012004", nama: "Yulia Permatasari", jabatan: "Kasubbid", unit_kerja: "Kementan", unit_kerja_id: 8, provinsi: "Kalimantan Timur", provinsi_id: 23, pkp: "Lulus", pka: "Belum" },
];

// ── STATE ─────────────────────────────────────────────────────────
let selectedUnitKerjaId = null;
let selectedUnitKerjaLabel = "";
let selectedProvinsiId = null;
let selectedProvinsiLabel = "";
let searchStatus = "idle"; // idle | loading | done | notfound

// ================================================================
//  NAVBAR
// ================================================================
(function initNavbar() {
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
})();

// ================================================================
//  HERO 
// ================================================================
(function initCounters() {
  const statsEl = document.getElementById("hero-stats");
  if (!statsEl) return;
  const counters = statsEl.querySelectorAll(".stat-value");
  let animated = false;

  const runCounters = () => {
    if (animated) return;
    animated = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counters.forEach((c) => (c.textContent = parseInt(c.dataset.target).toLocaleString("id-ID")));
      return;
    }

    const duration = 900;
    const start = performance.now();
    const targets = Array.from(counters).map((c) => parseInt(c.dataset.target));

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
})();

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
                <button type="button" class="dropdown-item" data-id="" data-label="">Semua ${labelKey === "nama_unit" ? "Unit Kerja" : "Provinsi"}</button>
            </li>
            ${filtered
              .map(
                (i) => `
                <li>
                    <button type="button" class="dropdown-item" data-id="${i.id}" data-label="${i[labelKey]}">${i[labelKey]}</button>
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
        // Update active class
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

// Init dropdowns if on public page
if (document.getElementById("unit-kerja-btn")) {
  initDropdown({
    btnId: "unit-kerja-btn",
    dropdownId: "unit-kerja-dropdown",
    listId: "unit-kerja-list",
    searchId: "unit-kerja-search",
    items: UNIT_KERJA,
    labelKey: "nama_unit",
    onSelect: (id, label) => {
      selectedUnitKerjaId = id;
      selectedUnitKerjaLabel = label;
      document.getElementById("unit-kerja-label").textContent = label || "Semua Unit Kerja";
      document.getElementById("unit-kerja-id").value = id || "";
    },
  });

  initDropdown({
    btnId: "provinsi-btn",
    dropdownId: "provinsi-dropdown",
    listId: "provinsi-list",
    searchId: "provinsi-search",
    items: PROVINSI,
    labelKey: "nama_provinsi",
    onSelect: (id, label) => {
      selectedProvinsiId = id;
      selectedProvinsiLabel = label;
      document.getElementById("provinsi-label").textContent = label || "Semua";
      document.getElementById("provinsi-id").value = id || "";
    },
  });
}

// ================================================================
//  ALUMNI SEARCH
// ================================================================
function cariAlumni(e) {
  e.preventDefault();
  const q = document.getElementById("q").value.trim().toLowerCase();

  const hasilSection = document.getElementById("hasil-section");
  const skeleton = document.getElementById("skeleton");
  const tabelHasil = document.getElementById("tabel-hasil");
  const notFound = document.getElementById("not-found");
  const hasilLabel = document.getElementById("hasil-label");
  const tabelBody = document.getElementById("tabel-body");

  // Show section, loading
  hasilSection.hidden = false;
  skeleton.hidden = false;
  tabelHasil.hidden = true;
  notFound.hidden = true;
  hasilLabel.textContent = "Memuat data...";

  hasilSection.scrollIntoView({ behavior: "smooth", block: "start" });

  // Simulasi delay API
  setTimeout(() => {
    skeleton.hidden = true;

    // Filter data
    const results = ALUMNI_DB.filter((a) => {
      const matchQ = !q || a.nama.toLowerCase().includes(q) || a.nip.includes(q);
      const matchUnit = !selectedUnitKerjaId || a.unit_kerja_id === selectedUnitKerjaId;
      const matchProv = !selectedProvinsiId || a.provinsi_id === selectedProvinsiId;
      return matchQ && matchUnit && matchProv;
    });

    if (results.length > 0) {
      tabelBody.innerHTML = results
        .map(
          (a) => `
                <tr>
                    <td class="mono" style="color:rgba(15,15,15,.7)">${a.nip}</td>
                    <td style="font-weight:600;color:#0F0F0F">${a.nama}</td>
                    <td style="color:rgba(15,15,15,.7)">${a.jabatan || "-"}</td>
                    <td style="color:rgba(15,15,15,.7)">${a.unit_kerja || "-"}</td>
                    <td style="color:rgba(15,15,15,.7)">${a.provinsi || "-"}</td>
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
  }, 800);
}

function resetSearch() {
  document.getElementById("q").value = "";
  selectedUnitKerjaId = null;
  selectedUnitKerjaLabel = "";
  selectedProvinsiId = null;
  selectedProvinsiLabel = "";

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
