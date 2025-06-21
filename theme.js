const THEMES = ['light', 'dark', 'qkss'];

function setTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.classList.remove('btn-outline-dark', 'btn-outline-light', 'btn-outline-primary');

  if (theme === 'light') {
    btn.classList.add('btn-outline-dark');
    btn.innerHTML = '<i class="bi bi-moon"></i>';
  } else if (theme === 'dark') {
    btn.classList.add('btn-outline-light');
    btn.innerHTML = '<i class="bi bi-palette"></i>';
  } else {
    btn.classList.add('btn-outline-primary');
    btn.innerHTML = '<i class="bi bi-sun"></i>';
  }
}

function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  const nextIndex = (THEMES.indexOf(current) + 1) % THEMES.length;
  setTheme(THEMES[nextIndex]);
}

document.addEventListener('DOMContentLoaded', () => {
  setTheme(localStorage.getItem('theme') || 'light');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggleTheme);
});
