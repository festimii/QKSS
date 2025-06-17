const LANG_LABELS = {
  en: "English",
  sq: "Shqip",
  sr: "Srpski",
};
const UI_STRINGS = {
  en: {
    locations: "Locations",
    searchPlaceholder: "Filter by title...",
    searchNavPlaceholder: "Search pins...",
    close: "Close",
    pinDetailsTitle: "Pin Details",
    coordsLabel: "Coordinates:",
    categoryLabel: "Category:",
    cityLabel: "Location:",
    footerText: "©2025 QKSS Map Viewer",
    navBrand: "Pin Admin",
    navLogout: "Logout",
    formHeading: "Create New Pin",
    formSubheading: "Click on the map to choose latitude/longitude.",
    labelTitleEn: "Title (English)",
    labelTitleSq: "Titulli (Shqip)",
    labelTitleSr: "Наслов (Srpski)",
    labelDescEn: "Description (English)",
    labelDescSq: "Përshkrimi (Shqip)",
    labelDescSr: "Опис (Srpski)",
    labelCity: "City (optional)",
    labelCategory: "Category",
    labelLat: "Latitude",
    labelLng: "Longitude",
    labelUrl: "Article URL",
    btnSubmit: "Submit",
    btnBack: "⬅ Back",
  },
  sq: {
    locations: "Vendndodhjet",
    searchPlaceholder: "Filtro sipas titullit…",
    searchNavPlaceholder: "Kërko pika…",
    close: "Mbylle",
    pinDetailsTitle: "Detajet e Pikës",
    coordsLabel: "Koordinatat:",
    categoryLabel: "Kategoria:",
    cityLabel: "Vendndodhja:",
    footerText: "©2025 Harta QKSS",
    navBrand: "Admin Pikash",
    navLogout: "Dil",
    formHeading: "Krijo Pikë të Re",
    formSubheading: "Klikoni në hartë për të zgjedhur koordinatat.",
    labelTitleEn: "Titulli (Anglisht)",
    labelTitleSq: "Titulli (Shqip)",
    labelTitleSr: "Titulli (Srpski)",
    labelDescEn: "Përshkrimi (Anglisht)",
    labelDescSq: "Përshkrimi (Shqip)",
    labelDescSr: "Përshkrimi (Srpski)",
    labelCity: "Qyteti (opsional)",
    labelCategory: "Kategoria",
    labelLat: "Gjerësia",
    labelLng: "Gjatësia",
    labelUrl: "URL Artikulli",
    btnSubmit: "Dërgo",
    btnBack: "⬅ Kthehu",
  },
  sr: {
    locations: "Lokacije",
    searchPlaceholder: "Filtriraj po nazivu…",
    searchNavPlaceholder: "Pretraži pinove…",
    close: "Zatvori",
    pinDetailsTitle: "Detalji Pin-a",
    coordsLabel: "Koordinate:",
    categoryLabel: "Kategorija:",
    cityLabel: "Lokacija:",
    footerText: "©2025 QKSS Pregled Karte",
    navBrand: "Admin Pinova",
    navLogout: "Odjavi se",
    formHeading: "Kreiraj Novi Pin",
    formSubheading: "Kliknite na mapu za izbor koordinata.",
    labelTitleEn: "Naslov (Engleski)",
    labelTitleSq: "Naslov (Šqip)",
    labelTitleSr: "Naslov (Srpski)",
    labelDescEn: "Opis (Engleski)",
    labelDescSq: "Opis (Šqip)",
    labelDescSr: "Opis (Srpski)",
    labelCity: "Grad (opciono)",
    labelCategory: "Kategorija",
    labelLat: "Geografska širina",
    labelLng: "Geografska dužina",
    labelUrl: "URL Članka",
    btnSubmit: "Sačuvaj",
    btnBack: "⬅ Nazad",
  },
};

let map;
let markers = [];
let allPins = [];

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  updateLangDropdownDisplay();
  updateUIStrings();
  addMarkers(allPins);
  populateList(allPins);
}
function updateLangDropdownDisplay() {
  const current = getLang();
  const toggle = document.getElementById("langDropdown");
  toggle.innerHTML = `<i class="bi bi-translate"></i> ${LANG_LABELS[current]}`;
}

function normalizePinTitle(pin) {
  if (typeof pin.title === "string") {
    try {
      const parsed = JSON.parse(pin.title);
      pin.title =
        parsed && typeof parsed === "object" ? parsed : { en: pin.title };
    } catch {
      pin.title = { en: pin.title };
    }
  }
}

function getLocalizedTitle(pin) {
  const lang = getLang();
  if (pin.title && typeof pin.title === "object") {
    return (
      pin.title[lang] ||
      pin.title.en ||
      Object.values(pin.title).find((v) => v) ||
      "(no title)"
    );
  }
  return String(pin.title || "(no title)");
}

function normalizePinDescription(pin) {
  if (typeof pin.description === "string") {
    try {
      const parsed = JSON.parse(pin.description);
      pin.description =
        parsed && typeof parsed === "object" ? parsed : { en: pin.description };
    } catch {
      pin.description = { en: pin.description };
    }
  }
}

function getLocalizedDescription(pin) {
  const lang = getLang();
  if (pin.description && typeof pin.description === "object") {
    return (
      pin.description[lang] ||
      pin.description.en ||
      Object.values(pin.description).find((v) => v) ||
      ""
    );
  }
  return String(pin.description || "");
}

async function fetchPins(filters = {}) {
  const params = new URLSearchParams();
  if (filters.categories && filters.categories.length) {
    params.set("categories", filters.categories.join(","));
  }
  if (filters.start) {
    params.set("start", filters.start.toISOString());
  }
  if (filters.end) {
    params.set("end", filters.end.toISOString());
  }
  const url = `${API_BASE_URL}/pins${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch pins");
  return await res.json();
}

function addMarkers(pins) {
  markers.forEach((m) => m.remove());
  markers = [];

  pins.forEach((pin) => {
    const marker = L.marker([pin.lat, pin.lng])
      .addTo(map)
      .bindPopup(
        `<b>${getLocalizedTitle(pin)}</b><br><a href="news/?id=${
          pin.id
        }">Read more</a>`
      )
      .on("click", () => showPinDetails(pin));
    markers.push(marker);
  });
}

function populateList(pins) {
  const list = document.getElementById("pinList");
  list.innerHTML = "";
  pins.forEach((pin) => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.textContent = getLocalizedTitle(pin);
    li.onclick = () => {
      map.setView([pin.lat, pin.lng], 14);
      markers
        .find((m) => {
          const { lat, lng } = m.getLatLng();
          return lat === pin.lat && lng === pin.lng;
        })
        ?.openPopup();
      showPinDetails(pin);
    };
    list.appendChild(li);
  });
}

let searchQuery = "";
let activeCategories = new Set();
let startFilter = null;
let endFilter = null;

function applyFilters() {
  const q = searchQuery.trim().toLowerCase();
  const filtered = allPins.filter((pin) => {
    const title = getLocalizedTitle(pin).toLowerCase();
    const desc = getLocalizedDescription(pin).toLowerCase();
    if (!title.includes(q) && !desc.includes(q)) return false;

    if (startFilter || endFilter) {
      if (!pin.timestamp) return false;
      const ts = new Date(pin.timestamp);
      if (startFilter && ts < startFilter) return false;
      if (endFilter && ts > endFilter) return false;
    }

    if (activeCategories.size > 0) {
      const cat = pin.subcategory || pin.category;
      if (!activeCategories.has(cat)) return false;
    }
    return true;
  });
  populateList(filtered);
  addMarkers(filtered);
}

function showPinDetails(pin) {
  document.getElementById("pinDescription").textContent =
    getLocalizedDescription(pin);
  const cityEl = document.getElementById("pinCity");
  if (cityEl) cityEl.textContent = pin.city || "";
  const catEl = document.getElementById("pinCategory");
  if (catEl) catEl.textContent = pin.category || "";
  document.getElementById("pinModalTitle").textContent = getLocalizedTitle(pin);
  const readMore = document.getElementById("modalReadMore");
  if (readMore) readMore.href = `news/?id=${pin.id}`;
  const modal = new bootstrap.Modal(document.getElementById("pinModal"));
  modal.show();
}

function copyModalLink() {
  const link = document.getElementById("modalReadMore").href;
  navigator.clipboard.writeText(link).then(() => {
    const btn = document.activeElement;
    if (btn && btn.tagName === "BUTTON") {
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy Link"), 1500);
    }
  });
}

function setupSearchUI() {
  const navInput = document.getElementById("searchInputNav");
  const sidebarInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");

  if (navInput)
    navInput.addEventListener("input", () => {
      searchQuery = navInput.value;
      applyFilters();
    });
  if (sidebarInput)
    sidebarInput.addEventListener("input", () => {
      searchQuery = sidebarInput.value;
      applyFilters();
    });

  clearBtn.addEventListener("click", () => {
    if (navInput) navInput.value = "";
    if (sidebarInput) sidebarInput.value = "";
    searchQuery = "";
    applyFilters();
  });
}

function setupFilterControls() {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const applyBtn = document.getElementById("applyFilters");

  if (!applyBtn) return;

  applyBtn.addEventListener("click", async () => {
    startFilter = startInput.value ? new Date(startInput.value + "-01") : null;

    if (endInput.value) {
      const d = new Date(endInput.value + "-01");
      d.setMonth(d.getMonth() + 1);
      d.setDate(0);
      endFilter = d;
    } else {
      endFilter = null;
    }

    activeCategories = new Set(
      Array.from(document.querySelectorAll(".category-filter:checked")).map(
        (c) => c.value
      )
    );

    try {
      const raw = await fetchPins({
        categories: Array.from(activeCategories),
        start: startFilter,
        end: endFilter,
      });
      allPins = raw.map((pin) => {
        normalizePinTitle(pin);
        normalizePinDescription(pin);
        return pin;
      });
    } catch (e) {
      console.error("Error fetching pins:", e);
    }

    applyFilters();

    const modalEl = document.getElementById("filterModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  });
}

function setupSidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  document.getElementById("toggleSidebar").addEventListener("click", () => {
    sidebar.classList.toggle("d-none");
  });
}

function setupLangDropdown() {
  document.querySelectorAll(".lang-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
    });
  });
}
updateLangDropdownDisplay();
updateUIStrings();

async function init() {
  map = L.map("map").setView([42.6629, 21.1655], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  try {
    const raw = await fetchPins();
    allPins = raw.map((pin) => {
      normalizePinTitle(pin);
      normalizePinDescription(pin);
      return pin;
    });
    addMarkers(allPins);
    populateList(allPins);
    setupSearchUI();
    setupFilterControls();
  } catch (e) {
    console.error("Error loading pins:", e);
  }

  setupSidebarToggle();
  setupLangDropdown();
}
function updateUIStrings() {
  const u = UI_STRINGS[getLang()];

  document.querySelector("#sidebar h5").textContent = u.locations + " ";
  document
    .getElementById("searchInput")
    .setAttribute("placeholder", u.searchPlaceholder);

  document.getElementById("pinModalTitle").textContent = u.pinDetailsTitle;
  const cityLbl = document.getElementById("cityLabel");
  if (cityLbl) cityLbl.textContent = u.cityLabel;
  const catLbl = document.getElementById("categoryLabel");
  if (catLbl) catLbl.textContent = u.categoryLabel;
  document
    .querySelector("#pinModal .btn-close")
    .setAttribute("aria-label", u.close);
  document.querySelector("footer small").textContent = u.footerText;
}
function updateCreateFormStrings() {
  const u = UI_STRINGS[getLang()];

  document.querySelector("h4").textContent = u.createPinTitle;
  document.querySelector("p.text-muted").textContent = u.clickMapHelper;

  document.querySelector('label[for="title_en"]').textContent = u.labelTitleEn;
  document.querySelector('label[for="title_sq"]').textContent = u.labelTitleSq;
  document.querySelector('label[for="title_sr"]').textContent = u.labelTitleSr;

  document.querySelector('label[for="desc_en"]').textContent = u.labelDescEn;
  document.querySelector('label[for="desc_sq"]').textContent = u.labelDescSq;
  document.querySelector('label[for="desc_sr"]').textContent = u.labelDescSr;

  const catLabel = document.querySelector('label[for="category"]');
  if (catLabel) catLabel.textContent = u.labelCategory;
  document.querySelector('label[for="city"]').textContent = u.labelCity;
  document.querySelector('label[for="lat"]').textContent = u.labelLat;
  document.querySelector('label[for="lng"]').textContent = u.labelLng;
  document.querySelector('label[for="url"]').textContent = u.labelUrl;

  document.querySelector('button[type="submit"]').textContent = u.btnSubmit;
  document.querySelector("a.btn-secondary").textContent = u.btnBack;
}
window.onload = init;
