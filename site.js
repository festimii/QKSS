const SITE_STRINGS = {
  en: {
    title: "Online Risk Monitor Platform on Interethnic Events in Kosovo",
    footer:
      "Implemented by KCSS | Supported by NED (National Endowment for Democracy)  ",
  },
  sq: {
    title:
      "Platforma Online e Monitorimit të Rrezikut për Ngjarjet Ndëretnike në Kosovë",
    footer:
      "Implementuar nga KCSS | Mbështetur nga NED (National Endowment for Democracy)",
  },
  sr: {
    title:
      "Onlajn platforma za praćenje rizika od međunacionalnih događaja na Kosovu",
    footer:
      "Implementirano od strane KCSS | Podržano od strane NED (National Endowment for Democracy)",
  },
};
const SiteLang = {
  get() {
    return localStorage.getItem("lang") || "en";
  },
  set(lang) {
    localStorage.setItem("lang", lang);
    SiteLang.apply();
  },
  apply() {
    const lang = SiteLang.get();
    const brand = document.getElementById("siteTitle");
    if (brand) brand.textContent = SITE_STRINGS[lang].title;
    const footer = document.getElementById("footerText");
    if (footer) footer.textContent = SITE_STRINGS[lang].footer;
    const toggle = document.getElementById("langDropdown");
    if (toggle)
      toggle.innerHTML = `<i class="bi bi-translate"></i> ${LANG_LABELS[lang]}`;
  },
};
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-option").forEach((btn) => {
    btn.addEventListener("click", () => SiteLang.set(btn.dataset.lang));
  });
  SiteLang.apply();
});
window.SiteLang = SiteLang;
