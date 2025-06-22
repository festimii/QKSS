const SITE_STRINGS = {
  en: {
    title: "KoRelate: Kosovo Interethnic Relations Monitor",
    footer:
      "Implemented by KCSS | Supported by NED (National Endowment for Democracy)  ",
  },
  sq: {
    title: "KoRelate: Monitori i marrëdhënieve ndëretnike në Kosovë",
    footer:
      "Implementuar nga KCSS | Mbështetur nga NED (National Endowment for Democracy)",
  },
  sr: {
    title: "KoRelate: Monitor međunacionalnih odnosa na Kosovu",
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
    btn.addEventListener("click", () => {
      if (typeof window.setLang === "function") {
        window.setLang(btn.dataset.lang);
      } else {
        SiteLang.set(btn.dataset.lang);
      }
    });
  });
  SiteLang.apply();
});
window.SiteLang = SiteLang;
