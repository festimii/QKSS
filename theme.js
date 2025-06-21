const THEMES = ["light", "dark", "qkss"];

function setTheme(theme) {
  // 1) Apply BS data-theme & persist
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);

  // 2) Theme the sidebar
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.remove("bg-light", "bg-dark");
    if (theme === "light" || theme === "qkss") {
      sidebar.classList.add("bg-light");
    } else if (theme === "dark") {
      sidebar.classList.add("bg-dark");
    }
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
  } else if (theme === "qkss") {
    btn.classList.add("btn-outline-light");
    btn.innerHTML = '<i class="bi bi-moon-stars"></i>';
  }
}

function toggleTheme() {
  const current = localStorage.getItem("theme") || "light";
  const nextIndex = (THEMES.indexOf(current) + 1) % THEMES.length;
  setTheme(THEMES[nextIndex]);
}

document.addEventListener("DOMContentLoaded", () => {
  setTheme(localStorage.getItem("theme") || "light");
  const btn = document.getElementById("themeToggle");
  if (btn) btn.addEventListener("click", toggleTheme);
});
