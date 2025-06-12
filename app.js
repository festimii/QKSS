// app.js

// Language labels
const LANG_LABELS = {
  en: "English",
  sq: "Shqip",
  sr: "Srpski",
};

// All the UI text you want to translate (map viewer + create-pin page)
const UI_STRINGS = {
  en: {
    // Map viewer
    locations:           "Locations",
    searchPlaceholder:   "Filter by title...",
    searchNavPlaceholder:"Search pins...",
    close:               "Close",
    pinDetailsTitle:     "Pin Details",
    coordsLabel:         "Coordinates:",
    categoryLabel:       "Category:",
    footerText:          "© 2025 QKSS Map Viewer. Data sourced from our API.",
    // Create pin
    navBrand:            "Pin Admin",
    navLogout:           "Logout",
    formHeading:         "Create New Pin",
    formSubheading:      "Click on the map to choose latitude/longitude.",
    labelTitleEn:        "Title (English)",
    labelTitleSq:        "Titulli (Shqip)",
    labelTitleSr:        "Наслов (Srpski)",
    labelDescEn:         "Description (English)",
    labelDescSq:         "Përshkrimi (Shqip)",
    labelDescSr:         "Опис (Srpski)",
    labelCity:           "City (optional)",
    labelLat:            "Latitude",
    labelLng:            "Longitude",
    labelUrl:            "Article URL",
    btnSubmit:           "Submit",
    btnBack:             "⬅ Back",
  },
  sq: {
    locations:           "Vendndodhjet",
    searchPlaceholder:   "Filtro sipas titullit…",
    searchNavPlaceholder:"Kërko pika…",
    close:               "Mbylle",
    pinDetailsTitle:     "Detajet e Pikës",
    coordsLabel:         "Koordinatat:",
    categoryLabel:       "Kategoria:",
    footerText:          "© 2025 Pamje Harta QKSS. të dhënat nga API-ja jonë.",
    navBrand:            "Admin Pikash",
    navLogout:           "Dil",
    formHeading:         "Krijo Pikë të Re",
    formSubheading:      "Klikoni në hartë për të zgjedhur koordinatat.",
    labelTitleEn:        "Titulli (Anglisht)",
    labelTitleSq:        "Titulli (Shqip)",
    labelTitleSr:        "Titulli (Srpski)",
    labelDescEn:         "Përshkrimi (Anglisht)",
    labelDescSq:         "Përshkrimi (Shqip)",
    labelDescSr:         "Përshkrimi (Srpski)",
    labelCity:           "Qyteti (opsional)",
    labelLat:            "Gjerësia",
    labelLng:            "Gjatësia",
    labelUrl:            "URL Artikulli",
    btnSubmit:           "Dërgo",
    btnBack:             "⬅ Kthehu",
  },
  sr: {
    locations:           "Lokacije",
    searchPlaceholder:   "Filtriraj po nazivu…",
    searchNavPlaceholder:"Pretraži pinove…",
    close:               "Zatvori",
    pinDetailsTitle:     "Detalji Pin-a",
    coordsLabel:         "Koordinate:",
    categoryLabel:       "Kategorija:",
    footerText:          "© 2025 QKSS Pregled Karte. Podaci sa našeg API-ja.",
    navBrand:            "Admin Pinova",
    navLogout:           "Odjavi se",
    formHeading:         "Kreiraj Novi Pin",
    formSubheading:      "Kliknite na mapu za izbor koordinata.",
    labelTitleEn:        "Naslov (Engleski)",
    labelTitleSq:        "Naslov (Šqip)",
    labelTitleSr:        "Naslov (Srpski)",
    labelDescEn:         "Opis (Engleski)",
    labelDescSq:         "Opis (Šqip)",
    labelDescSr:         "Opis (Srpski)",
    labelCity:           "Grad (opciono)",
    labelLat:            "Geografska širina",
    labelLng:            "Geografska dužina",
    labelUrl:            "URL Članka",
    btnSubmit:           "Sačuvaj",
    btnBack:             "⬅ Nazad",
  }
};


let map;
let markers = [];
let allPins = []; // hold normalized pins for reuse in filters

/**
 * Returns the currently selected language code (default "en").
 */
function getLang() {
    return localStorage.getItem("lang") || "en";
}

/** Persist a new language and re-render UI in-place **/
function setLang(lang) {
    localStorage.setItem("lang", lang);
    updateLangDropdownDisplay();
    updateUIStrings();         // ← translate all static UI
    addMarkers(allPins);       // re-draw popups
    populateList(allPins);     // re-draw sidebar
  }
function updateLangDropdownDisplay() {
    const current = getLang();
    // the <a id="langDropdown">…</a> contains an <i> icon already
    const toggle = document.getElementById("langDropdown");
    toggle.innerHTML = `<i class="bi bi-translate"></i> ${LANG_LABELS[current]}`;
  }
  
/**
 * Normalize pin.title to an object { en: "...", sq: "...", ... }
 */
function normalizePinTitle(pin) {
    if (typeof pin.title === "string") {
        try {
            const parsed = JSON.parse(pin.title);
            pin.title = (parsed && typeof parsed === "object")
              ? parsed
              : { en: pin.title };
        } catch {
            pin.title = { en: pin.title };
        }
    }
}

/**
 * Get the localized title with fallbacks.
 */
function getLocalizedTitle(pin) {
    const lang = getLang();
    if (pin.title && typeof pin.title === "object") {
        return pin.title[lang] 
            || pin.title.en 
            || Object.values(pin.title).find(v=>v) 
            || "(no title)";
    }
    return String(pin.title || "(no title)");
}

/**
 * Fetch all pins from the backend.
 */
async function fetchPins() {
    const res = await fetch(`${API_BASE_URL}/pins`);
    if (!res.ok) throw new Error("Failed to fetch pins");
    return await res.json();
}

/**
 * Place markers on the map, binding localized popups.
 */
function addMarkers(pins) {
    markers.forEach(m => m.remove());
    markers = [];

    pins.forEach(pin => {
        const marker = L.marker([pin.lat, pin.lng])
            .addTo(map)
            .bindPopup(`<b>${getLocalizedTitle(pin)}</b><br><a href="${pin.articleUrl}" target="_blank">Read more</a>`);
        markers.push(marker);
    });
}

/**
 * Populate the sidebar list.
 */
function populateList(pins) {
    const list = document.getElementById("pinList");
    list.innerHTML = "";
    pins.forEach(pin => {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.textContent = getLocalizedTitle(pin);
        li.onclick = () => {
            map.setView([pin.lat, pin.lng], 14);
            markers
              .find(m => {
                const { lat, lng } = m.getLatLng();
                return lat === pin.lat && lng === pin.lng;
              })
              ?.openPopup();
        };
        list.appendChild(li);
    });
}

/**
 * Shared filter logic.
 */
function filterPins(query) {
    const q = query.trim().toLowerCase();
    const filtered = allPins.filter(pin =>
        getLocalizedTitle(pin).toLowerCase().includes(q)
    );
    populateList(filtered);
    addMarkers(filtered);
}

/**
 * Wire up search inputs.
 */
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

/**
 * Sidebar show/hide toggle.
 */
function setupSidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    document.getElementById("toggleSidebar")
        .addEventListener("click", () => {
            sidebar.classList.toggle("d-none");
        });
}

/**
 * Language dropdown buttons.
 */
function setupLangDropdown() {
    document.querySelectorAll(".lang-option").forEach(btn => {
      btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
      });
    });
  }
updateLangDropdownDisplay();
updateUIStrings();
/**
 * Initialize map, load pins, and wire up UI.
 */
async function init() {
    map = L.map("map").setView([42.6629, 21.1655], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    try {
        const raw = await fetchPins();
        allPins = raw.map(pin => {
            normalizePinTitle(pin);
            return pin;
        });
        // first render
        addMarkers(allPins);
        populateList(allPins);
        // wire filter
        setupSearchUI();
    } catch (e) {
        console.error("Error loading pins:", e);
    }

    // UI behaviors
    setupSidebarToggle();
    setupLangDropdown();
}
function updateUIStrings() {
    const u = UI_STRINGS[getLang()];
  
    // Sidebar heading
    document.querySelector("#sidebar h5").textContent = u.locations + " ";
    // sidebar input placeholder
    document.getElementById("searchInput")
            .setAttribute("placeholder", u.searchPlaceholder);
    // navbar search placeholder
    document.getElementById("searchInputNav")
            .setAttribute("placeholder", u.searchNavPlaceholder);
    // modal title
    document.getElementById("pinModalLabel").textContent = u.pinDetailsTitle;
    // modal labels
    document.querySelector("#pinCoords").previousElementSibling
            .firstChild.textContent = u.coordsLabel + " ";
    document.querySelector("#pinCategory").previousElementSibling
            .firstChild.textContent = u.categoryLabel + " ";
    // modal close button
    document.querySelector("#pinModal .btn-close")
            .setAttribute("aria-label", u.close);
    // footer
    document.querySelector("footer small").textContent = u.footerText;
  }
  function updateCreateFormStrings() {
    const u = UI_STRINGS[getLang()];
  
    // Update page title and helper text
    document.querySelector("h4").textContent = u.createPinTitle;
    document.querySelector("p.text-muted").textContent = u.clickMapHelper;
  
    // Update form labels
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
  
    // Update buttons
    document.querySelector('button[type="submit"]').textContent = u.btnSubmit;
    document.querySelector('a.btn-secondary').textContent = u.btnBack;
  }
window.onload = init;
