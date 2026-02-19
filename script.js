// script.js
(function () {
  const root = document.documentElement;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove("preload");
      root.classList.add("loaded");
    });
  });

  const themeToggle = document.getElementById("themeToggle");
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");

  const tabs = document.querySelectorAll(".tab");
  const panes = document.querySelectorAll(".pane");

  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  function renderThemeIcon(isLight) {
    if (!themeToggle) return;
    themeToggle.title = isLight ? "Switch to dark" : "Switch to light";
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark" : "Switch to light",
    );

    themeToggle.innerHTML = isLight
      ? `
      <svg class="themeIcon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    `
      : `
      <svg class="themeIcon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle>
        <path d="M12 2v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M12 19v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M2 12h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M19 12h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M4.22 4.22l2.12 2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M17.66 17.66l2.12 2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M19.78 4.22l-2.12 2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M6.34 17.66l-2.12 2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </svg>
    `;
  }

  // Theme: default dark; only set light if saved.
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") root.classList.add("light");
  else root.classList.remove("light");
  renderThemeIcon(root.classList.contains("light"));

  themeToggle?.addEventListener("click", () => {
    root.classList.toggle("light");
    const nowLight = root.classList.contains("light");
    localStorage.setItem("theme", nowLight ? "light" : "dark");
    renderThemeIcon(nowLight);
  });

  function setTab(id, { updateHash = true } = {}) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === id));

    panes.forEach((p) => p.classList.toggle("is-active", p.id === id));

    if (updateHash) {
      history.replaceState(null, "", `#${id}`);
    }
  }

  tabs.forEach((t) => t.addEventListener("click", () => setTab(t.dataset.tab)));

  const hash = location.hash.replace("#", "");

  if (hash && document.getElementById(hash)) {
    setTab(hash, { updateHash: false });

    // 👇 Prevent browser scroll jump
    requestAnimationFrame(() => window.scrollTo(0, 0));
  } else {
    setTab("about", { updateHash: false });
  }

  // Filters
  function setFilter(tag) {
    filters.forEach((f) =>
      f.classList.toggle("is-active", f.dataset.filter === tag),
    );
    projects.forEach((p) => {
      const tags = (p.getAttribute("data-tags") || "")
        .split(/\s+/)
        .filter(Boolean);
      const show = tag === "all" || tags.includes(tag);
      p.style.display = show ? "" : "none";
    });
  }

  filters.forEach((f) =>
    f.addEventListener("click", () => setFilter(f.dataset.filter)),
  );
})();

const form = document.getElementById("contactForm");
const status = document.getElementById("formHint");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const response = await fetch(form.action, {
    method: "POST",
    body: data,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    status.textContent = "Message sent ✨";
    form.reset();
  } else {
    status.textContent = "Oops — something went wrong.";
  }
});
