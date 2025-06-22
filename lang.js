/**
 * Shared language utilities used across the QKSS site.
 */
const LANG_LABELS = {
  en: "English",
  sq: "Shqip",
  sr: "Srpski",
};

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  updateLangDropdownDisplay();
  if (window.SiteLang && typeof window.SiteLang.apply === "function") {
    window.SiteLang.apply();
  }
  if (typeof updateLanguageUI === "function") updateLanguageUI();
  if (typeof updateUIStrings === "function") updateUIStrings();
  if (typeof refreshPinsLanguage === "function") refreshPinsLanguage();
}

function updateLangDropdownDisplay() {
  const toggle = document.getElementById("langDropdown");
  if (toggle) {
    toggle.innerHTML = `<i class="bi bi-translate"></i> ${LANG_LABELS[getLang()]}`;
  }
}

// expose helpers globally
window.LANG_LABELS = LANG_LABELS;
window.getLang = getLang;
window.setLang = setLang;
window.updateLangDropdownDisplay = updateLangDropdownDisplay;
window.addEventListener("storage", (e) => {
  if (e.key === "lang") {
    updateLangDropdownDisplay();
    if (window.SiteLang && typeof window.SiteLang.apply === "function") {
      window.SiteLang.apply();
    }
    if (typeof updateLanguageUI === "function") updateLanguageUI();
    if (typeof updateUIStrings === "function") updateUIStrings();
    if (typeof refreshPinsLanguage === "function") refreshPinsLanguage();
  }
});
