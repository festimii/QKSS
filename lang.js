// lang.js

/**
 * Language management module for map-viewer, create-pin, and admin management pages.
 * Include <script src="lang.js"></script> before app.js on your HTML pages.
 */

// Human-readable names for each language code
const LANG_LABELS = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski",
  };
  
  // All UI strings to translate across the app
  const UI_STRINGS = {
    en: {
      // Map viewer
      locations:            "Locations",
      searchPlaceholder:    "Filter by title...",
      searchNavPlaceholder: "Search pins...",
      close:                "Close",
      pinDetailsTitle:      "Pin Details",
      coordsLabel:          "Coordinates:",
      categoryLabel:        "Category:",
      footerText:           "© 2025 QKSS Map Viewer. Data sourced from our API.",
  
      // Create-pin page
      navBrand:             "Pin Admin",
      navLogout:            "Logout",
      formHeading:          "Create New Pin",
      formSubheading:       "Click on the map to choose latitude/longitude.",
      labelTitleEn:         "Title (English)",
      labelTitleSq:         "Titulli (Shqip)",
      labelTitleSr:         "Наслов (Srpski)",
      labelDescEn:          "Description (English)",
      labelDescSq:          "Përshkrimi (Shqip)",
      labelDescSr:          "Опис (Srpski)",
      labelCity:            "City (optional)",
      labelLat:             "Latitude",
      labelLng:             "Longitude",
      labelUrl:             "Article URL",
      btnSubmit:            "Submit",
      btnBack:              "⬅ Back",
  
      // Admin management page
      adminTitle:           "Manage Map Pins",
      btnCreateNewPin:      "Create New Pin",
      tableHeaderTitle:     "Title",
      tableHeaderLat:       "Lat",
      tableHeaderLng:       "Lng",
      tableHeaderUrl:       "URL",
      tableHeaderActions:   "Actions",
      alertDeleteSuccess:   "Pin deleted.",
      alertDeleteUnauthorized: "Unauthorized. Please log in again.",
      alertDeleteForbidden: "Forbidden. You do not have permission to delete this pin.",
      alertDeleteFail:      "Failed to delete pin (status {status}).",
      alertFetchFail:       "Failed to fetch pins.",
    },
    sq: {
      locations:            "Vendndodhjet",
      searchPlaceholder:    "Filtro sipas titullit…",
      searchNavPlaceholder: "Kërko pika…",
      close:                "Mbylle",
      pinDetailsTitle:      "Detajet e Pikës",
      coordsLabel:          "Koordinatat:",
      categoryLabel:        "Kategoria:",
      footerText:           "© 2025 Pamje Harta QKSS. të dhënat nga API-ja jonë.",
  
      navBrand:             "Admin Pikash",
      navLogout:            "Dil",
      formHeading:          "Krijo Pikë të Re",
      formSubheading:       "Klikoni në hartë për të zgjedhur koordinatat.",
      labelTitleEn:         "Titulli (Anglisht)",
      labelTitleSq:         "Titulli (Shqip)",
      labelTitleSr:         "Titulli (Srpski)",
      labelDescEn:          "Përshkrimi (Anglisht)",
      labelDescSq:          "Përshkrimi (Shqip)",
      labelDescSr:          "Përshkrimi (Srpski)",
      labelCity:            "Qyteti (opsional)",
      labelLat:             "Gjerësia",
      labelLng:             "Gjatësia",
      labelUrl:             "URL Artikulli",
      btnSubmit:            "Dërgo",
      btnBack:              "⬅ Kthehu",
  
      adminTitle:           "Menaxho Pikët e Hartës",
      btnCreateNewPin:      "Krijo Pikë të Re",
      tableHeaderTitle:     "Titulli",
      tableHeaderLat:       "Gjerësia",
      tableHeaderLng:       "Gjatësia",
      tableHeaderUrl:       "URL",
      tableHeaderActions:   "Veprimet",
      alertDeleteSuccess:   "Pika u fshi.",
      alertDeleteUnauthorized: "Jo i autorizuar. Ju lutemi identifikohuni përsëri.",
      alertDeleteForbidden: "Nuk keni leje për këtë veprim.",
      alertDeleteFail:      "Dështoi fshirja e pikës (status {status}).",
      alertFetchFail:       "Dështoi marrja e pikave.",
    },
    sr: {
      locations:            "Lokacije",
      searchPlaceholder:    "Filtriraj po nazivu…",
      searchNavPlaceholder: "Pretraži pinove…",
      close:                "Zatvori",
      pinDetailsTitle:      "Detalji Pin-a",
      coordsLabel:          "Koordinate:",
      categoryLabel:        "Kategorija:",
      footerText:           "© 2025 QKSS Pregled Karte. Podaci sa našeg API-ja.",
  
      navBrand:             "Admin Pinova",
      navLogout:            "Odjavi se",
      formHeading:          "Kreiraj Novi Pin",
      formSubheading:       "Kliknite na mapu za izbor koordinata.",
      labelTitleEn:         "Naslov (Engleski)",
      labelTitleSq:         "Naslov (Šqip)",
      labelTitleSr:         "Naslov (Srpski)",
      labelDescEn:          "Opis (Engleski)",
      labelDescSq:          "Opis (Šqip)",
      labelDescSr:          "Opis (Srpski)",
      labelCity:            "Grad (opciono)",
      labelLat:             "Geografska širina",
      labelLng:             "Geografska dužina",
      labelUrl:             "URL Članka",
      btnSubmit:            "Sačuvaj",
      btnBack:              "⬅ Nazad",
  
      adminTitle:           "Upravljanje Pinovima",
      btnCreateNewPin:      "Kreiraj Novi Pin",
      tableHeaderTitle:     "Naslov",
      tableHeaderLat:       "Lat",
      tableHeaderLng:       "Lng",
      tableHeaderUrl:       "URL",
      tableHeaderActions:   "Akcije",
      alertDeleteSuccess:   "Pin je obrisan.",
      alertDeleteUnauthorized: "Niste autorizovani. Molimo ponovo se prijavite.",
      alertDeleteForbidden: "Nemate dozvolu za ovu akciju.",
      alertDeleteFail:      "Brisanje pina nije uspelo (status {status}).",
      alertFetchFail:       "Neuspešno preuzimanje pinova.",
    }
  };
  
  /**
   * Get current language code.
   */
  function getLang() {
    return localStorage.getItem('lang') || 'en';
  }
  
  /**
   * Set language and update all UI in-place.
   */
  function setLang(lang) {
    localStorage.setItem('lang', lang);
    updateLangDropdownDisplay();
    updateLanguageUI();
    updateUIStrings();
  }
  
  /**
   * Update the language dropdown label.
   */
  function updateLangDropdownDisplay() {
    const lbl = document.querySelector('#languageSwitcher');
    const current = getLang();
    if (lbl) lbl.value = current;
  }
  
  /**
   * Update navbar & form headings and labels.
   */
  function updateLanguageUI() {
    const s = UI_STRINGS[getLang()];
    document.querySelector('.navbar-brand').textContent = '🗺 ' + s.navBrand;
    document.querySelector('button[onclick="logout()"]').textContent = s.navLogout;
    const title = document.querySelector('h2');
    if (title) title.textContent = s.adminTitle;
    const createBtn = document.querySelector('a.btn-dark');
    if (createBtn) createBtn.textContent = s.btnCreateNewPin;
    // Table headers
    const ths = document.querySelectorAll('table thead th');
    if (ths.length >= 5) {
      ths[0].textContent = s.tableHeaderTitle;
      ths[1].textContent = s.tableHeaderLat;
      ths[2].textContent = s.tableHeaderLng;
      ths[3].textContent = s.tableHeaderUrl;
      ths[4].textContent = s.tableHeaderActions;
    }
  }
  
  /**
   * Update sidebar/modal/footer for map-viewer (if present).
   */
  function updateUIStrings() {
    const u = UI_STRINGS[getLang()];
    // Optional: implement if map-viewer elements exist
  }
  
  // Expose globally
  window.getLang = getLang;
  window.setLang = setLang;
  window.updateLangDropdownDisplay = updateLangDropdownDisplay;
  window.updateLanguageUI = updateLanguageUI;
  window.updateUIStrings = updateUIStrings;