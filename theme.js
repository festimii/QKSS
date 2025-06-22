const THEMES = ["light", "dark"];

function setTheme(theme) {
  // 1) Apply BS data-theme & persist
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);

  // 2) Theme the sidebar
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.remove("bg-light", "bg-dark");
    if (theme === "light") {
      sidebar.classList.add("bg-light");
    } else if (theme === "dark") {
      sidebar.classList.add("bg-dark");
    }
  }
  // 4) Update logout button (“logbuton”)
  const logBtn = document.getElementById("logbuton");
  if (logBtn) {
    // remove any old outline classes
    logBtn.classList.remove(
      "btn-outline-dark",
      "btn-outline-light",
      "btn-outline-primary"
    );
    // re-apply the correct outline for each theme
    if (theme === "light") {
      logBtn.classList.add("btn-outline-dark");
    } else if (theme === "dark") {
      logBtn.classList.add("btn-outline-light");
    } else {
      // qkss
      logBtn.classList.add("btn-outline-primary");
    }
    // ensure the btn and size class remain
    if (!logBtn.classList.contains("btn")) logBtn.classList.add("btn");
    if (!logBtn.classList.contains("btn-sm")) logBtn.classList.add("btn-sm");
  }

  // 3) Update toggle button
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
