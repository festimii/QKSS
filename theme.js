const THEMES = ["light", "dark"];

function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.remove("bg-light", "bg-dark");
    if (theme === "light") {
      sidebar.classList.add("bg-light");
    } else if (theme === "dark") {
      sidebar.classList.add("bg-dark");
    }
  }
  const modal = document.getElementById("modalc");
  if (modal) {
    modal.classList.remove("bg-light", "bg-dark");
    if (theme === "light") {
      modal.classList.add("bg-light");
    } else if (theme === "dark") {
      modal.classList.add("bg-dark");
    }
  }

  const logBtn = document.getElementById("logbuton");
  if (logBtn) {
    logBtn.classList.remove(
      "btn-outline-dark",
      "btn-outline-light",
      "btn-outline-primary"
    );

    if (theme === "light") {
      logBtn.classList.add("btn-outline-dark");
    } else if (theme === "dark") {
      logBtn.classList.add("btn-outline-light");
    } else {
      logBtn.classList.add("btn-outline-primary");
    }
    if (!logBtn.classList.contains("btn")) logBtn.classList.add("btn");
    if (!logBtn.classList.contains("btn-sm")) logBtn.classList.add("btn-sm");
  }

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.classList.remove(
    "btn-outline-dark",
    "btn-outline-light",
    "btn-outline-primary"
  );
  if (theme === "light") {
    btn.classList.add("btn-outline-dark");
    btn.innerHTML = '<i class="bi bi-moon"></i>';
  } else if (theme === "dark") {
    btn.classList.add("btn-outline-primary");
    btn.innerHTML = '<i class="bi bi-sun"></i>';
  }
}

function toggleTheme() {
  const stored = localStorage.getItem("theme");
  const current = THEMES.includes(stored) ? stored : "light";
  const nextIndex = (THEMES.indexOf(current) + 1) % THEMES.length;
  setTheme(THEMES[nextIndex]);
}

document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("theme");
  const initial = THEMES.includes(stored) ? stored : "light";
  setTheme(initial);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.addEventListener("click", toggleTheme);
});
