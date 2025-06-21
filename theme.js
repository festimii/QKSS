function setTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    if (theme === 'dark') {
      btn.classList.remove('btn-outline-dark');
      btn.classList.add('btn-outline-light');
      btn.innerHTML = '<i class="bi bi-sun"></i>';
    } else {
      btn.classList.remove('btn-outline-light');
      btn.classList.add('btn-outline-dark');
      btn.innerHTML = '<i class="bi bi-moon"></i>';
    }
  }
}
function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}
document.addEventListener('DOMContentLoaded', () => {
  setTheme(localStorage.getItem('theme') || 'light');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggleTheme);
});
