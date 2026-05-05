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
  const pageShell = document.querySelector(".shell");

  const tabs = document.querySelectorAll(".tab");
  const tabsContainer = document.querySelector(".tabs");
  const tabIndicator = document.querySelector(".tabIndicator");
  const panes = document.querySelectorAll(".pane");

  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  const projectModal = document.getElementById("projectModal");
  const modalCard = projectModal?.querySelector(".projectModalCard");
  const modalImageBg = document.getElementById("modalProjectImageBg");
  const modalImage = document.getElementById("modalProjectImage");
  const modalTitle = document.getElementById("modalProjectTitle");
  const modalLinks = document.getElementById("modalProjectLinks");
  const modalText = document.getElementById("modalProjectText");
  const modalTags = document.getElementById("modalProjectTags");
  let lastFocusedElement = null;

  const iconSvgs = {
    api: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 8 3 12l4 4"></path>
        <path d="m17 8 4 4-4 4"></path>
        <path d="m14 5-4 14"></path>
      </svg>
    `,
    atom: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="1.8"></circle>
        <ellipse cx="12" cy="12" rx="9" ry="3.8"></ellipse>
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"></ellipse>
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)"></ellipse>
      </svg>
    `,
    beaker: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3h6"></path>
        <path d="M10 3v6l-5 8.5A2.2 2.2 0 0 0 6.9 21h10.2a2.2 2.2 0 0 0 1.9-3.5L14 9V3"></path>
        <path d="M8 15h8"></path>
      </svg>
    `,
    braces: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h1"></path>
        <path d="M16 4h1a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-1"></path>
      </svg>
    `,
    branch: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="6" r="2"></circle>
        <circle cx="18" cy="6" r="2"></circle>
        <circle cx="12" cy="18" r="2"></circle>
        <path d="M8 6h8"></path>
        <path d="M6 8c0 5 6 5 6 8"></path>
        <path d="M18 8c0 5-6 5-6 8"></path>
      </svg>
    `,
    checklist: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 7 1.5 1.5L10 5"></path>
        <path d="M13 7h6"></path>
        <path d="m5 15 1.5 1.5L10 13"></path>
        <path d="M13 15h6"></path>
      </svg>
    `,
    cloud: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.3-1.8A4.8 4.8 0 0 0 7 18Z"></path>
      </svg>
    `,
    database: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7" ry="3"></ellipse>
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"></path>
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path>
      </svg>
    `,
    cLogo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"></path>
        <path d="M15.5 9.3A4.2 4.2 0 1 0 15.5 14.7"></path>
      </svg>
    `,
    csharpLogo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"></path>
        <path d="M11.2 9.3A3.4 3.4 0 1 0 11.2 14.7"></path>
        <path d="M14 9h5"></path>
        <path d="M13.5 12h5"></path>
        <path d="M15.2 7.8 14.4 16.2"></path>
        <path d="M18.1 7.8 17.3 16.2"></path>
      </svg>
    `,
    cssLogo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3h14l-1.3 15L12 21l-5.7-3L5 3Z"></path>
        <path d="M9 8h6l-.3 3H9.3l.3 4L12 16.2l2.4-1.2.2-2"></path>
      </svg>
    `,
    flask: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3h6"></path>
        <path d="M10 3v5.5L5.6 17a2.6 2.6 0 0 0 2.3 4h8.2a2.6 2.6 0 0 0 2.3-4L14 8.5V3"></path>
        <path d="M8 16h8"></path>
      </svg>
    `,
    hexagon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"></path>
        <path d="M9 15V9l6 6V9"></path>
      </svg>
    `,
    javaLogo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 4c2 1.6-3 2.8-.4 4.8"></path>
        <path d="M14 3c2.7 2.1-4.4 3.5-1 6.3"></path>
        <path d="M7 11.5c3.2 1 7.6.9 10 0"></path>
        <path d="M8 14c2.8.8 6.9.8 9 0"></path>
        <path d="M6.5 16.5c3.3 1.5 8.9 1.4 11.3-.2"></path>
        <path d="M8 19c2.6.8 6.7.8 9 0"></path>
      </svg>
    `,
    jsLogo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
        <path d="M9 9v6.2c0 1.1-.7 1.8-1.8 1.8-.6 0-1.1-.2-1.5-.5"></path>
        <path d="M12.2 16.2c.5.5 1.2.8 2 .8 1 0 1.8-.4 1.8-1.2 0-.8-.7-1.1-1.7-1.5-1-.4-1.8-.8-1.8-1.9 0-1 .8-1.8 2.1-1.8.8 0 1.4.2 1.9.6"></path>
      </svg>
    `,
    lightning: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 5 14h6l-1 8 9-13h-6l0-7Z"></path>
      </svg>
    `,
    lock: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2"></rect>
        <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
      </svg>
    `,
    lint: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4h8"></path>
        <rect x="5" y="6" width="14" height="15" rx="2"></rect>
        <path d="m8.5 11 1.5 1.5 3-3"></path>
        <path d="M14.5 12h2"></path>
        <path d="m8.5 16 1.5 1.5 3-3"></path>
        <path d="M14.5 17h2"></path>
      </svg>
    `,
    monitor: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2"></rect>
        <path d="M8 20h8"></path>
        <path d="M12 16v4"></path>
      </svg>
    `,
    neural: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7" cy="8" r="2"></circle>
        <circle cx="17" cy="7" r="2"></circle>
        <circle cx="12" cy="16" r="2"></circle>
        <path d="M8.8 8.8 10.6 14"></path>
        <path d="m15.4 8.7-2.2 5.5"></path>
        <path d="M9 8h6"></path>
        <path d="m18 15 .7 1.8 1.8.7-1.8.7L18 21l-.7-1.8-1.8-.7 1.8-.7L18 15Z"></path>
      </svg>
    `,
    palette: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 0 0 0 18h1.2a2.2 2.2 0 0 0 1.5-3.8 1.8 1.8 0 0 1 1.2-3.2H18a3 3 0 0 0 3-3c0-4.4-4-8-9-8Z"></path>
        <circle cx="7.8" cy="10" r=".9" class="logoFill"></circle>
        <circle cx="10.8" cy="7.5" r=".9" class="logoFill"></circle>
        <circle cx="14.4" cy="8.2" r=".9" class="logoFill"></circle>
      </svg>
    `,
    pythonLogo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3h3.2A3.8 3.8 0 0 1 19 6.8V10h-7a3 3 0 0 0-3 3v1H5.8A2.8 2.8 0 0 1 3 11.2V8.8A3.8 3.8 0 0 1 6.8 5H12V3Z"></path>
        <path d="M12 21H8.8A3.8 3.8 0 0 1 5 17.2V14h7a3 3 0 0 0 3-3v-1h3.2a2.8 2.8 0 0 1 2.8 2.8v2.4a3.8 3.8 0 0 1-3.8 3.8H12v2Z"></path>
        <circle cx="8" cy="8" r=".7" class="logoFill"></circle>
        <circle cx="16" cy="16" r=".7" class="logoFill"></circle>
      </svg>
    `,
    pipeline: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="6" height="5" rx="1.4"></rect>
        <rect x="15" y="5" width="6" height="5" rx="1.4"></rect>
        <rect x="9" y="15" width="6" height="5" rx="1.4"></rect>
        <path d="M9 7.5h6"></path>
        <path d="M12 10v5"></path>
      </svg>
    `,
    package: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"></path>
        <path d="M4.4 7.8 12 12l7.6-4.2"></path>
        <path d="M12 12v8.5"></path>
        <path d="m8.2 5.4 7.6 4.2"></path>
      </svg>
    `,
    rocket: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 4c2.5.4 4.6 2.5 5 5l-6.8 6.8-4-4L14 4Z"></path>
        <path d="M7 13 5 19l6-2"></path>
        <circle cx="14.5" cy="8.5" r="1.4"></circle>
      </svg>
    `,
    shield: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v5c0 4.5-2.7 7.8-7 10-4.3-2.2-7-5.5-7-10V6l7-3Z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    `,
    sparkle: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"></path>
        <path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"></path>
      </svg>
    `,
    squareCode: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3"></rect>
        <path d="m10 9-3 3 3 3"></path>
        <path d="m14 9 3 3-3 3"></path>
      </svg>
    `,
    tsLogo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
        <path d="M7 9h6"></path>
        <path d="M10 9v8"></path>
        <path d="M14 16.2c.5.5 1.2.8 2 .8 1 0 1.8-.4 1.8-1.2 0-.8-.7-1.1-1.7-1.5-1-.4-1.8-.8-1.8-1.9 0-1 .8-1.8 2.1-1.8.8 0 1.4.2 1.9.6"></path>
      </svg>
    `,
    stopwatch: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="13" r="7"></circle>
        <path d="M9 2h6"></path>
        <path d="M12 6V3"></path>
        <path d="M12 13l3-3"></path>
      </svg>
    `,
    test: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3h8"></path>
        <path d="M10 3v5l-4.5 8.5A3 3 0 0 0 8.2 21h7.6a3 3 0 0 0 2.7-4.5L14 8V3"></path>
        <path d="m9 16 2 2 4-5"></path>
      </svg>
    `,
    transactions: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7h10l-3-3"></path>
        <path d="M17 17H7l3 3"></path>
        <path d="M17 7c2 1.4 3 3.1 3 5"></path>
        <path d="M7 17c-2-1.4-3-3.1-3-5"></path>
      </svg>
    `,
    wind: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8h10a3 3 0 1 0-3-3"></path>
        <path d="M3 13h15a3 3 0 1 1-3 3"></path>
        <path d="M5 18h5"></path>
      </svg>
    `,
  };

  const techIconNames = {
    ".net": "monitor",
    ai: "neural",
    "ai feature": "neural",
    "ai sdk": "neural",
    apis: "api",
    authentication: "lock",
    axios: "package",
    bcrypt: "package",
    c: "cLogo",
    "c#": "csharpLogo",
    "ci/cd pipelines": "pipeline",
    checklists: "checklist",
    cookies: "database",
    css: "cssLogo",
    dapper: "database",
    "data modelling": "database",
    deepseek: "neural",
    deployment: "cloud",
    downtimer: "package",
    dsa: "branch",
    "express.js": "api",
    eslint: "lint",
    fastendpoints: "rocket",
    flask: "flask",
    linting: "lint",
    frontend: "monitor",
    git: "branch",
    jest: "test",
    java: "javaLogo",
    javascript: "jsLogo",
    "javascript/typescript": "jsLogo",
    "jwt auth": "shield",
    "langchain": "neural",
    crypto: "package",
    "highlight.js": "package",
    llm: "neural",
    llms: "neural",
    "machine learning": "neural",
    "node.js": "hexagon",
    openai: "neural",
    prettier: "lint",
    "stylelint": "lint",
    pyhtml: "squareCode",
    python: "pythonLogo",
    react: "atom",
    "react router dom": "package",
    "responsive ui": "monitor",
    rest: "api",
    "radix ui": "palette",
    radixui: "palette",
    "shadcn/ui": "palette",
    shadcn: "palette",
    "slide editing": "monitor",
    sql: "database",
    sqlite: "database",
    "systems design / architecture": "branch",
    tailwindcss: "palette",
    testing: "test",
    "time-based resets": "stopwatch",
    transactions: "transactions",
    typescript: "tsLogo",
    vercel: "cloud",
    vite: "lightning",
    uuid: "package",
    "uuid-int": "package",
    validator: "package",
    xunit: "package",
  };

  function normaliseTag(tag) {
    return tag.trim().toLowerCase();
  }

  function getTechIconSvg(tag) {
    const key = normaliseTag(tag);
    return iconSvgs[techIconNames[key]] || iconSvgs.squareCode;
  }

  function enhanceTechPill(pill) {
    if (pill.dataset.enhanced === "true") return;

    const label = pill.dataset.tagLabel || pill.textContent.trim();
    pill.dataset.tagLabel = label;
    pill.textContent = "";

    const icon = document.createElement("span");
    icon.className = "t2TagIcon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getTechIconSvg(label);

    const text = document.createElement("span");
    text.className = "t2TagText";
    text.textContent = label;

    pill.append(icon, text);
    pill.dataset.enhanced = "true";
  }

  function createTechPill(label) {
    const pill = document.createElement("span");
    pill.className = "t2Tag";
    pill.dataset.tagLabel = label;
    pill.textContent = label;
    enhanceTechPill(pill);
    return pill;
  }

  function enhanceTechPills(scope = document) {
    scope.querySelectorAll(".t2Tag, .tag").forEach(enhanceTechPill);
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Local file previews can block storage; the theme toggle still works.
    }
  }

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
  const savedTheme = getSavedTheme();
  if (savedTheme === "light") root.classList.add("light");
  else root.classList.remove("light");
  renderThemeIcon(root.classList.contains("light"));

  themeToggle?.addEventListener("click", () => {
    root.classList.toggle("light");
    const nowLight = root.classList.contains("light");
    saveTheme(nowLight ? "light" : "dark");
    renderThemeIcon(nowLight);
  });

  function updateTabIndicator() {
    if (!tabsContainer || !tabIndicator) return;

    const activeTab = tabsContainer.querySelector(".tab.is-active");
    if (!activeTab) {
      tabsContainer.style.setProperty("--tabIndicatorOpacity", "0");
      return;
    }

    const inset = Math.min(12, activeTab.offsetWidth * 0.18);
    const width = Math.max(18, activeTab.offsetWidth - inset * 2);
    const x = activeTab.offsetLeft + inset;
    const y = activeTab.offsetTop + activeTab.offsetHeight + 4;

    tabsContainer.style.setProperty("--tabIndicatorX", `${x}px`);
    tabsContainer.style.setProperty("--tabIndicatorWidth", `${width}px`);
    tabsContainer.style.setProperty("--tabIndicatorTop", `${y}px`);
    tabsContainer.style.setProperty("--tabIndicatorOpacity", "1");
  }

  function setTab(id, { updateHash = true } = {}) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === id));

    panes.forEach((p) => p.classList.toggle("is-active", p.id === id));
    requestAnimationFrame(updateTabIndicator);

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

  window.addEventListener("resize", updateTabIndicator);
  requestAnimationFrame(updateTabIndicator);

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

  function cloneProjectLinks(project) {
    if (!modalLinks) return;
    modalLinks.textContent = "";

    const links = project.querySelectorAll(".projLinks .link");
    links.forEach((link) => {
      const clonedLink = link.cloneNode(true);
      clonedLink.classList.add("modalProjectLink");
      if (clonedLink.target === "_blank") {
        clonedLink.rel = "noreferrer";
      }
      modalLinks.appendChild(clonedLink);
    });

    modalLinks.hidden = links.length === 0;
  }

  function cloneProjectTags(project) {
    if (!modalTags) return;
    modalTags.textContent = "";

    const explicitTags = (project.dataset.modalTags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const fallbackTags = Array.from(project.querySelectorAll(".t2Tag")).map(
      (tag) => tag.dataset.tagLabel || tag.textContent.trim(),
    );
    const tags = explicitTags.length > 0 ? explicitTags : fallbackTags;

    tags.forEach((tag) => {
      modalTags.appendChild(createTechPill(tag));
    });
  }

  function openProjectModal(project) {
    if (!projectModal || !modalCard) return;

    const title = project.querySelector(".projTitle")?.textContent.trim() || "";
    const fallbackText =
      project.querySelector(".projText")?.textContent.trim() || "";
    const description = project.dataset.description || fallbackText;
    const image = project.dataset.image || "./images/site-preview.png";
    const imageAccent = project.dataset.imageAccent || "";

    lastFocusedElement = document.activeElement;

    if (modalTitle) modalTitle.textContent = title;
    if (modalText) modalText.textContent = description;
    if (modalImage) {
      modalImage.src = image;
      modalImage.alt = `${title} project preview`;
    }
    if (modalImageBg) {
      modalImageBg.src = image;
    }
    modalCard.style.setProperty(
      "--modalImageAccent",
      imageAccent || "var(--accent)",
    );

    cloneProjectLinks(project);
    cloneProjectTags(project);

    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    projectModal.removeAttribute("inert");
    pageShell?.setAttribute("inert", "");
    document.body.classList.add("modal-open");
    modalCard.focus();
  }

  function closeProjectModal() {
    if (!projectModal) return;

    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    projectModal.setAttribute("inert", "");
    pageShell?.removeAttribute("inert");
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
  }

  projects.forEach((project) => {
    project.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      openProjectModal(project);
    });
  });

  projectModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      projectModal?.classList.contains("is-open")
    ) {
      closeProjectModal();
    }
  });

  enhanceTechPills();
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
