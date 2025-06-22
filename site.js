const LANG_LABELS = { en: "English", sq: "Shqip", sr: "Srpski" };
const SITE_STRINGS = {
  en: {
    title: "QKSS Map",
    footer:
      "This site is part of a project supported by NED (National Endowment for Democracy), titled 'Increasing Government Transparency and Accountability in Interethnic Dialogue,' and implemented by KCSS. The authors wrote the specific chapters within their own capacities. As such, the views presented in this site do not necessarily reflect the views of KCSS or NED.",
  },
  sq: {
    title: "Harta e QKSS",
    footer:
      "Kjo faqe është pjesë e një projekti të mbështetur nga NED (National Endowment for Democracy), të titulluar 'Rritja e Transparencës së Qeverisë dhe Llogaridhënies në Dialogun Ndëretnik', dhe zbatohet nga KCSS. Autorët kanë shkruar kapitujt përkatës në kapacitetet e tyre personale. Prandaj, pikëpamjet e shprehura në këtë faqe nuk pasqyrojnë domosdoshmërisht pikëpamjet e KCSS ose NED.",
  },
  sr: {
    title: "KCSS Mapa",
    footer:
      "Ovaj sajt je deo projekta koji podržava NED (National Endowment for Democracy) pod nazivom 'Povećanje transparentnosti vlade i odgovornosti u međuetničkom dijalogu', a sprovodi ga KCSS. Autori su pisali pojedina poglavlja u ličnom kapacitetu, pa stavovi izneti na ovom sajtu ne odražavaju nužno stavove KCSS-a ili NED-a.",
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
