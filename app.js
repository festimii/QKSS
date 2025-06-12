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

async function fetchPins() {
  const res = await fetch(`${API_BASE_URL}/pins`);
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
        `<b>${getLocalizedTitle(pin)}</b><br><a href="${
          pin.articleUrl
        }" target="_blank">Read more</a>`
      );
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
    };
    list.appendChild(li);
  });
}

function filterPins(query) {
  const q = query.trim().toLowerCase();
  const filtered = allPins.filter((pin) =>
    getLocalizedTitle(pin).toLowerCase().includes(q)
  );
  populateList(filtered);
  addMarkers(filtered);
}

function setupSearchUI() {
  const navInput = document.getElementById("searchInputNav");
  const sidebarInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");

  navInput.addEventListener("input", () => filterPins(navInput.value));
  sidebarInput.addEventListener("input", () => filterPins(sidebarInput.value));

  clearBtn.addEventListener("click", () => {
    navInput.value = "";
    sidebarInput.value = "";
    filterPins("");
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
      return pin;
    });
    addMarkers(allPins);
    populateList(allPins);
    setupSearchUI();
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

  document.getElementById("pinModalLabel").textContent = u.pinDetailsTitle;
  document.querySelector(
    "#pinCoords"
  ).previousElementSibling.firstChild.textContent = u.coordsLabel + " ";
  document.querySelector(
    "#pinCategory"
  ).previousElementSibling.firstChild.textContent = u.categoryLabel + " ";
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

  document.querySelector('label[for="city"]').textContent = u.labelCity;
  document.querySelector('label[for="lat"]').textContent = u.labelLat;
  document.querySelector('label[for="lng"]').textContent = u.labelLng;
  document.querySelector('label[for="url"]').textContent = u.labelUrl;

  document.querySelector('button[type="submit"]').textContent = u.btnSubmit;
  document.querySelector("a.btn-secondary").textContent = u.btnBack;
}
window.onload = init;
