// script.js
(function () {
  const root = document.documentElement;
  const isChromeMac =
    /Macintosh/.test(navigator.userAgent) &&
    /Chrome\//.test(navigator.userAgent) &&
    !/Edg\/|OPR\//.test(navigator.userAgent);

  if (isChromeMac) {
    root.classList.add("chrome-mac");
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove("preload");
      root.classList.add("loaded");
    });
  });

  const themeToggle = document.getElementById("themeToggle");
  const backgroundLayer = document.querySelector(".bg");
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  const pageShell = document.querySelector(".shell");

  const tabs = document.querySelectorAll(".tab");
  const tabsContainer = document.querySelector(".tabs");
  const tabIndicator = document.querySelector(".tabIndicator");
  const panes = document.querySelectorAll(".pane");

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

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
    langchain: "neural",
    crypto: "package",
    "highlight.js": "package",
    llm: "neural",
    llms: "neural",
    "machine learning": "neural",
    "node.js": "hexagon",
    openai: "neural",
    prettier: "lint",
    stylelint: "lint",
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

  function setupAsciiAvatar() {
    const canvas = document.getElementById("asciiCanvas");
    const image = document.getElementById("sourceImage");
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    const particles = [];
    const mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vx: 0,
      vy: 0,
      coreRadius: 10,
      fieldRadius: 80,
      active: false,
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = null;
    let assemblyUntil = 0;
    let revealFrameId = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    class Particle {
      constructor(x, y, char, color, brightness) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.vx = 0;
        this.vy = 0;
        this.char = char;
        this.color = color;
        this.brightness = brightness;
        this.opacity = 1;
        this.assembleStart = 0;
        this.assembleDelay = 0;
        this.assembleHold = 120;
        this.assembleDuration = 780;
        this.startX = x;
        this.startY = y;
      }

      getCursorInfluence() {
        if (!mouse.active) {
          return null;
        }

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance >= mouse.fieldRadius || distance <= 0.01) {
          return null;
        }

        const angle = Math.atan2(dy, dx);
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const fieldFalloff = 1 - distance / mouse.fieldRadius;
        const coreFalloff =
          distance < mouse.coreRadius ? 1 - distance / mouse.coreRadius : 0;

        return {
          distance,
          ux,
          uy,
          field: fieldFalloff ** 2,
          core: coreFalloff ** 0.72,
        };
      }

      update(time) {
        if (this.assembleStart > 0) {
          const rawProgress =
            (time -
              this.assembleStart -
              this.assembleHold -
              this.assembleDelay) /
            this.assembleDuration;

          if (rawProgress < 1) {
            const progress = Math.max(0, rawProgress);
            const eased = 1 - (1 - progress) ** 3;
            const drift = Math.sin(time * 0.004 + this.originX * 0.05) * 8;

            this.x =
              this.startX +
              (this.originX - this.startX) * eased +
              Math.sin(progress * Math.PI) * drift;
            this.y =
              this.startY +
              (this.originY - this.startY) * eased +
              Math.sin(progress * Math.PI) * drift * 0.55;
            this.vx = 0;
            this.vy = 0;
            return;
          }

          this.x = this.originX;
          this.y = this.originY;
          this.vx = 0;
          this.vy = 0;
          this.assembleStart = 0;
        }

        if (mouse.active) {
          const influence = this.getCursorInfluence();

          if (influence) {
            const orbit =
              Math.sin(time * 0.006 + this.originX * 0.045 + this.originY) *
              influence.field;
            const radialForce = influence.core * 28 + influence.field * 4.8;
            const orbitForce = orbit * 2.4;

            this.vx += influence.ux * radialForce;
            this.vy += influence.uy * radialForce;
            this.vx += -influence.uy * orbitForce;
            this.vy += influence.ux * orbitForce;
            this.vx += mouse.vx * influence.field * 0.055;
            this.vy += mouse.vy * influence.field * 0.055;
          }
        }

        const spring = 0.24;
        const friction = 0.82;

        this.vx += (this.originX - this.x) * spring;
        this.vy += (this.originY - this.y) * spring;

        this.vx *= friction;
        this.vy *= friction;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        const isDark = !root.classList.contains("light");
        const influence = this.getCursorInfluence();
        let drawX = this.x;
        let drawY = this.y;

        if (influence) {
          const lens = influence.field * 24;
          drawX += influence.ux * lens;
          drawY += influence.uy * lens;
        } else if (!reduceMotion.matches && this.assembleStart === 0) {
          const time = performance.now();
          const wave =
            Math.sin(time * 0.0014 + this.originY * 0.055 + this.originX * 0.01) *
            0.32;
          drawX += wave * 0.45;
          drawY += wave;
        }

        if (isDark) {
          const tone = Math.pow(this.brightness / 255, 1.18);
          const shadowLift = Math.pow(1 - tone, 2) * 0.1;

          const r = 126 + tone * 84;
          const g = 122 + tone * 82;
          const b = 112 + tone * 76;

          const alpha = (0.17 + tone * 0.54 + shadowLift) * this.opacity;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(20, 20, 22, ${0.64 * this.opacity})`;
        }

        ctx.fillText(this.char, drawX, drawY);
      }
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const imageRatio =
        image.naturalHeight > 0
          ? image.naturalWidth / image.naturalHeight
          : 465 / 536;

      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(width / imageRatio));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getPixel(x, y, pixels) {
      const safeX = Math.max(0, Math.min(width - 1, x));
      const safeY = Math.max(0, Math.min(height - 1, y));
      const index = (safeY * width + safeX) * 4;

      return {
        r: pixels[index],
        g: pixels[index + 1],
        b: pixels[index + 2],
        a: pixels[index + 3],
      };
    }

    function getBrightness(pixel) {
      return (pixel.r + pixel.g + pixel.b) / 3;
    }

    function chooseAsciiChar(x, y, pixel) {
      const brightness = getBrightness(pixel);
      const isDark = !root.classList.contains("light");

      const chars = "@#W$9876543210?!abc;:+=-,._ ";

      const value = isDark ? 1 - brightness / 255 : brightness / 255;
      const index = Math.floor(value * (chars.length - 1));

      return chars[index];
    }

    function imageToParticles({ assemble = false } = {}) {
      if (!image.complete || width <= 1 || height <= 1) return;

      particles.length = 0;

      offscreen.width = width;
      offscreen.height = height;
      offCtx.clearRect(0, 0, width, height);
      const isDark = !root.classList.contains("light");
      offCtx.filter = isDark
        ? "grayscale(1) contrast(0.95) brightness(1.04)"
        : "grayscale(1) contrast(0.82) brightness(1.08)";
      offCtx.drawImage(image, 0, 0, width, height);

      const pixels = offCtx.getImageData(0, 0, width, height).data;
      const gap = Math.max(3, Math.round(width / 50));

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const pixel = getPixel(x, y, pixels);

          if (pixel.a < 115) continue;

          const brightness = getBrightness(pixel);
          if (brightness > 252) continue;

          const particle = new Particle(
            x,
            y,
            chooseAsciiChar(x, y, pixel, pixels, gap),
            "",
            brightness,
          );

          if (assemble) {
            particle.startX = Math.random() * width;
            particle.startY = Math.random() * height;
            particle.x = particle.startX;
            particle.y = particle.startY;
            particle.assembleDelay = Math.random() * 180;
          }

          particles.push(particle);
        }
      }
    }

    function triggerInitialAssembly() {
      if (particles.length === 0 || width <= 1 || height <= 1) return;

      const now = performance.now();
      assemblyUntil = now + 1300;

      for (const particle of particles) {
        particle.assembleStart = now;
        particle.opacity = 1;
        particle.vx = 0;
        particle.vy = 0;
      }
    }

    function rebuildParticles(options) {
      resizeCanvas();
      imageToParticles(options);
    }

    function reserveAssemblyWindow() {
      assemblyUntil = performance.now() + 1300;
    }

    function revealAsciiAvatar() {
      if (revealFrameId !== null) {
        cancelAnimationFrame(revealFrameId);
      }

      mouse.active = false;
      mouse.vx = 0;
      mouse.vy = 0;
      reserveAssemblyWindow();
      rebuildParticles({ assemble: true });
      revealFrameId = requestAnimationFrame(() => {
        revealFrameId = null;
        triggerInitialAssembly();
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${Math.max(7, Math.round(width / 38))}px monospace`;
      ctx.textBaseline = "middle";

      const particleColor = getComputedStyle(root)
        .getPropertyValue("--ascii-color")
        .trim();

      const time = performance.now();

      for (const particle of particles) {
        particle.color = particleColor;
        particle.update(time);
        particle.draw();
      }

      frameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (frameId !== null) return;
      reserveAssemblyWindow();
      rebuildParticles({ assemble: true });
      triggerInitialAssembly();
      animate();
    }

    window.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;
      const margin = mouse.fieldRadius;
      const isNearCanvas =
        nextX >= -margin &&
        nextX <= rect.width + margin &&
        nextY >= -margin &&
        nextY <= rect.height + margin;

      if (!isNearCanvas) {
        mouse.active = false;
        mouse.vx = 0;
        mouse.vy = 0;
        return;
      }

      mouse.vx = mouse.active ? nextX - mouse.prevX : 0;
      mouse.vy = mouse.active ? nextY - mouse.prevY : 0;
      mouse.prevX = nextX;
      mouse.prevY = nextY;
      mouse.x = nextX;
      mouse.y = nextY;
      mouse.active = true;
    });

    window.addEventListener("pointerleave", () => {
      mouse.active = false;
      mouse.vx = 0;
      mouse.vy = 0;
    });

    window.addEventListener("asciiAvatar:reveal", revealAsciiAvatar);
    window.addEventListener("asciiAvatar:themechange", () => {
      if (performance.now() < assemblyUntil) return;
      rebuildParticles();
    });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => {
        if (performance.now() < assemblyUntil) return;
        rebuildParticles();
      });
      observer.observe(canvas);
    } else {
      window.addEventListener("resize", () => {
        if (performance.now() < assemblyUntil) return;
        rebuildParticles();
      });
    }

    image.addEventListener("load", startAnimation, { once: true });

    if (image.complete) {
      startAnimation();
    }
  }

  function setupStarfield() {
    if (!backgroundLayer) return;

    const desktopStarfield = window.matchMedia("(min-width: 721px)");
    if (!desktopStarfield.matches) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.className = "bgCanvas";
    canvas.setAttribute("aria-hidden", "true");
    backgroundLayer.appendChild(canvas);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prevX: window.innerWidth / 2,
      prevY: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      active: false,
    };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let frameId = null;
    let lastRenderTime = 0;

    function createStars() {
      const area = width * height;
      const count = isChromeMac
        ? Math.max(32, Math.min(68, Math.floor(area / 24000)))
        : Math.max(42, Math.min(110, Math.floor(area / 15000)));

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.00055 + 0.00025,
        drift: Math.random() * 10 + 4,
        depth: Math.random() * 0.7 + 0.3,
        twinkle: Math.random() * 0.28 + 0.35,
        rotationVariation: Math.random() * 0.08 + 0.08,
      }));
    }

    function resizeStarfield() {
      dpr = Math.min(window.devicePixelRatio || 1, isChromeMac ? 1.25 : 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars();
    }

    function drawFourPointStar(radius) {
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.lineTo(radius * 0.22, -radius * 0.22);
      ctx.lineTo(radius, 0);
      ctx.lineTo(radius * 0.22, radius * 0.22);
      ctx.lineTo(0, radius);
      ctx.lineTo(-radius * 0.22, radius * 0.22);
      ctx.lineTo(-radius, 0);
      ctx.lineTo(-radius * 0.22, -radius * 0.22);
      ctx.closePath();
    }

    function drawStar(star, time) {
      const driftX =
        Math.sin(time * star.speed + star.phase) *
        star.drift *
        (0.5 + star.depth);
      const driftY =
        Math.cos(time * star.speed * 0.8 + star.phase) *
        star.drift *
        (0.5 + star.depth);
      let x = star.x + driftX;
      let y = star.y + driftY;

      if (pointer.active && !reduceMotion.matches) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = 170;

        if (distance < radius && distance > 0.01) {
          const force = (1 - distance / radius) ** 2;
          const strength = 1.8;

          star.vx += pointer.vx * force * 0.015 * star.depth;
          star.vy += pointer.vy * force * 0.015 * star.depth;
        }
      }

      star.x += star.vx;
      star.y += star.vy;

      star.vx *= 0.96;
      star.vy *= 0.96;

      if (star.x < -20) star.x = width + 20;
      if (star.x > width + 20) star.x = -20;
      if (star.y < -20) star.y = height + 20;
      if (star.y > height + 20) star.y = -20;

      x = star.x + driftX;
      y = star.y + driftY;

      const isLight = root.classList.contains("light");
      const alpha =
        star.twinkle +
        (reduceMotion.matches
          ? 0
          : Math.sin(time * 0.0016 + star.phase) * 0.18);
      const color = isLight
        ? `rgba(40, 40, 60, ${Math.max(0.18, alpha * 0.6)})`
        : `rgba(255, 255, 255, ${Math.max(0.18, alpha)})`;

      ctx.save();
      ctx.translate(x, y);

      ctx.scale(1, 1 + Math.sin(time * 0.002 + star.phase) * 0.05);

      // base glow strength (ties into twinkle)
      const glowStrength = star.twinkle * 10;

      const sizeFactor = star.size;

      if (isLight) {
        ctx.shadowBlur = (isChromeMac ? 3 : 6) + glowStrength * 0.65;
        ctx.shadowColor = "rgba(80, 80, 120, 0.35)";
      } else {
        ctx.shadowBlur = (isChromeMac ? 2 : 5) + glowStrength * 0.65;
        ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
      }

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, star.size * star.depth * 0.7, 0, Math.PI * 2);
      ctx.fill();

      if (star.size > 1.6) {
        const starRadius = star.size * 3.2;

        ctx.save();
        ctx.rotate(
          Math.sin(time * 0.0007 + star.phase) * star.rotationVariation,
        );

        ctx.globalAlpha = Math.min(0.85, Math.max(0.35, alpha));
        ctx.fillStyle = color;

        drawFourPointStar(starRadius);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, star.size * 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.restore();
      }

      ctx.shadowBlur = 0;

      ctx.restore();
    }

    function renderStarfield(time = 0) {
      if (isChromeMac && time - lastRenderTime < 1000 / 30) {
        frameId = requestAnimationFrame(renderStarfield);
        return;
      }

      lastRenderTime = time;
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => drawStar(star, time));

      if (!reduceMotion.matches) {
        frameId = requestAnimationFrame(renderStarfield);
      }
    }

    window.addEventListener("resize", () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
      resizeStarfield();
      renderStarfield();
    });
    window.addEventListener("pointermove", (event) => {
      const nextVx = event.clientX - pointer.prevX;
      const nextVy = event.clientY - pointer.prevY;

      pointer.vx = pointer.vx * 0.75 + nextVx * 0.25;
      pointer.vy = pointer.vy * 0.75 + nextVy * 0.25;

      pointer.prevX = event.clientX;
      pointer.prevY = event.clientY;

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });
    window.addEventListener("pointerleave", () => {
      pointer.active = false;
      pointer.vx = 0;
      pointer.vy = 0;
    });
    reduceMotion.addEventListener("change", () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
      renderStarfield();
    });
    desktopStarfield.addEventListener("change", () => {
      if (desktopStarfield.matches) return;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
      canvas.remove();
    });

    resizeStarfield();
    renderStarfield();
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

  function playThemeCrossfade() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.remove("theme-crossfade");
    root.style.setProperty(
      "--themeFadeColor",
      getComputedStyle(root).getPropertyValue("--bg0"),
    );
    void root.offsetWidth;
    root.classList.add("theme-crossfade");

    window.setTimeout(() => {
      root.classList.remove("theme-crossfade");
      root.style.removeProperty("--themeFadeColor");
    }, 460);
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
    playThemeCrossfade();
    root.classList.toggle("light");
    const nowLight = root.classList.contains("light");
    saveTheme(nowLight ? "light" : "dark");
    renderThemeIcon(nowLight);
    window.dispatchEvent(new CustomEvent("asciiAvatar:themechange"));
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

    if (id === "about") {
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent("asciiAvatar:reveal"));
      });
    }

    if (updateHash) {
      history.replaceState(null, "", `#${id}`);
    }
  }

  tabs.forEach((t) => t.addEventListener("click", () => setTab(t.dataset.tab)));

  function setupMagneticTabs() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const strength = 0.16;
    const maxShift = 4;

    tabs.forEach((tab) => {
      let frameId = null;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let glow = 0;
      let targetGlow = 0;

      function render() {
        currentX += (targetX - currentX) * 0.22;
        currentY += (targetY - currentY) * 0.22;
        glow += (targetGlow - glow) * 0.2;

        tab.style.setProperty("--magnetX", `${currentX.toFixed(2)}px`);
        tab.style.setProperty("--magnetY", `${currentY.toFixed(2)}px`);
        tab.style.setProperty("--magnetGlow", glow.toFixed(3));

        const settled =
          Math.abs(targetX - currentX) < 0.02 &&
          Math.abs(targetY - currentY) < 0.02 &&
          Math.abs(targetGlow - glow) < 0.01;

        if (settled) {
          currentX = targetX;
          currentY = targetY;
          glow = targetGlow;
          tab.style.setProperty("--magnetX", `${currentX.toFixed(2)}px`);
          tab.style.setProperty("--magnetY", `${currentY.toFixed(2)}px`);
          tab.style.setProperty("--magnetGlow", glow.toFixed(3));
          frameId = null;
          return;
        }

        frameId = requestAnimationFrame(render);
      }

      function start() {
        if (frameId === null) frameId = requestAnimationFrame(render);
      }

      tab.addEventListener("pointermove", (event) => {
        const rect = tab.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);

        targetX = Math.max(-maxShift, Math.min(maxShift, x * strength));
        targetY = Math.max(-maxShift, Math.min(maxShift, y * strength));
        targetGlow = 1;
        start();
      });

      tab.addEventListener("pointerleave", () => {
        targetX = 0;
        targetY = 0;
        targetGlow = 0;
        start();
      });
    });
  }

  setupMagneticTabs();

  const hash = location.hash.replace("#", "");

  function keepInitialHashRouteAtTop(target) {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.scrollingElement?.scrollTo(0, 0);

      for (let el = target; el; el = el.parentElement) {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      }
    };

    resetScroll();
    requestAnimationFrame(resetScroll);
    window.addEventListener("load", resetScroll, {
      once: true,
    });
    window.addEventListener("pageshow", resetScroll, {
      once: true,
    });
    setTimeout(resetScroll, 80);
  }

  const initialHashTarget = hash && document.getElementById(hash);

  if (initialHashTarget) {
    setTab(hash, { updateHash: false });
    keepInitialHashRouteAtTop(initialHashTarget);
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
    if (event.key === "Escape" && projectModal?.classList.contains("is-open")) {
      closeProjectModal();
    }
  });

  enhanceTechPills();
  setupAsciiAvatar();
  setupStarfield();
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
