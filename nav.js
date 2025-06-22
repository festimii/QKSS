(function(){
  const NAV_HTML = `\
<nav class="navbar navbar-expand-lg bg-body">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center" href="/">
      <img src="/KCSS-logo.png" alt="KCSS logo" height="40" class="me-2" />
      <span id="siteTitle" class="text-center py-0.5 fs-4"></span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navMenu">
      <div class="d-flex align-items-center gap-2">
        <div class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="langDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-translate"></i>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="langDropdown">
            <li><button class="dropdown-item lang-option" data-lang="en">English</button></li>
            <li><button class="dropdown-item lang-option" data-lang="sq">Shqip</button></li>
            <li><button class="dropdown-item lang-option" data-lang="sr">Srpski</button></li>
          </ul>
        </div>
        <a class="btn btn-outline-dark me-2" href="/about/">About</a>
        <button class="btn btn-outline-dark" id="toggleSidebar">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <button class="btn btn-outline-dark" id="themeToggle">
          <i class="bi bi-moon"></i>
        </button>
      </div>
    </div>
  </div>
</nav>`;

  function insertNav(){
    const temp = document.createElement('div');
    temp.innerHTML = NAV_HTML.trim();
    const nav = temp.firstElementChild;
    document.body.prepend(nav);
  }

  document.addEventListener('DOMContentLoaded', insertNav);
})();
