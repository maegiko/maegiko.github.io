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

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

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
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const navLinks = document.querySelectorAll(".navLink");
  const panes = document.querySelectorAll(".pane");

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const filters = document.querySelectorAll(".projFilter");
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
  let scrollLockOffset = 0;
  const blurredImageCache = new Map();
  let modalImageRequestId = 0;

  const deviconBaseUrl =
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

  function deviconSvg(path) {
    return `<img class="brandIconImg" src="${deviconBaseUrl}/${path}" alt="" loading="lazy" decoding="async" />`;
  }

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
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#A9B9CB" d="M566.6 176.4q0-15-6.5-26.7a51 51 0 0 0-19.3-18.8L327.8 8.1a52 52 0 0 0-56.7.5C242.8 25.3 101.3 106.5 59 131a49 49 0 0 0-25.7 45.5v247.2q0 14.8 6.2 26.2A51 51 0 0 0 59.2 469c42.1 24.4 183.6 105.6 211.9 122.3a52 52 0 0 0 56.7.5l213-122.8a51 51 0 0 0 19.6-19.4 53 53 0 0 0 6.3-26.1z"/><path fill="#7F8B99" d="M327.3 8.6a52 52 0 0 0-56.6.6c-28.2 16.6-169.5 97.5-211.6 122a49 49 0 0 0-25.7 45.3V423a53 53 0 0 0 6.2 26A51 51 0 0 0 59 468.5l42 24.2L491 103z"/><path fill="#fff" d="m355.1 262.4 83 .6c0-34.6-35-119.2-135.3-119.2-64 0-150 40.6-150 157.5 0 116.8 84.3 155 150 155 106.2 0 131.6-73.6 131.6-115.2l-79.1-4.5s2 48-53 48c-50.8 0-59.3-62.2-59.3-83.3 0-32.2 11.5-83.9 59.3-83.9 47.9 0 52.8 45 52.8 45"/></svg>
    `,
    csharpLogo: `
      ${deviconSvg("csharp/csharp-original.svg")}
    `,
    cssLogo: `
      ${deviconSvg("css3/css3-original.svg")}
    `,
    flask: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3h6"></path>
        <path d="M10 3v5.5L5.6 17a2.6 2.6 0 0 0 2.3 4h8.2a2.6 2.6 0 0 0 2.3-4L14 8.5V3"></path>
        <path d="M8 16h8"></path>
      </svg>
    `,
    gitLogo: `
      ${deviconSvg("git/git-original.svg")}
    `,
    dapperLogo: `
      <img class="brandIconImg" src="https://raw.githubusercontent.com/DapperLib/Dapper/main/Dapper.png" alt="" loading="lazy" decoding="async" />
    `,
    node: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#539E43" d="M300 600q-12.4-.2-23.2-6l-73.3-43.6c-11-6-5.5-8.3-2.2-9.4 15-5 17.7-6 33.1-14.9 1.7-1 3.9-.5 5.5.6l56.2 33.6c2.2 1.1 5 1.1 6.7 0L522.7 433q3.3-1.8 3.3-6V172.7c0-2.7-1.1-5-3.3-6L302.7 40c-2.1-1.1-4.9-1.1-6.6 0L76.2 166.7c-2.2 1.1-3.3 3.9-3.3 6.1V427c0 2.2 1.1 5 3.3 6l60 34.8c32.6 16.5 53-2.7 53-22V194.9c0-3.4 2.8-6.7 6.6-6.7H224c3.3 0 6.6 2.8 6.6 6.7v250.8c0 43.5-23.7 68.9-65 68.9-12.7 0-22.6 0-50.7-13.8l-57.9-33a47 47 0 0 1-23.1-40.3V173.4c0-16.6 8.8-32 23.1-40.3L277 5.8a49 49 0 0 1 46.3 0L543 133a47 47 0 0 1 23.1 40.3v254c0 16.6-8.8 32-23.1 40.3L323 595c-7.1 3.3-15.4 5-23.1 5m67.8-174.7c-96.5 0-116.3-44.1-116.3-81.6 0-3.3 2.7-6.6 6.6-6.6h28.7c3.3 0 6 2.2 6 5.5 4.4 29.2 17.1 43.5 75.6 43.5 46.3 0 66.1-10.4 66.1-35.2 0-14.4-5.5-24.9-77.7-32-60.1-6-97.6-19.3-97.6-67.3 0-44.6 37.5-71 100.3-71 70.6 0 105.3 24.2 109.7 77q0 2.6-1.6 5c-1.1 1.2-2.8 2.3-4.4 2.3h-28.7a6.5 6.5 0 0 1-6-5c-6.7-30.3-23.8-40.2-69-40.2-50.7 0-56.7 17.6-56.7 30.8 0 16 7.1 21 75.5 29.8C446 289 478 301.8 478 349.2c-.5 48.5-40.2 76-110.2 76"/></svg>
    `,
    javaLogo: `
      ${deviconSvg("java/java-original.svg")}
    `,
    jsLogo: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-javascript-1-a)"><path fill="#F7DF1E" d="M0 0h600v600H0z"/><path fill="#000" d="m157.8 501.4 45.9-27.8c8.8 15.7 16.9 29 36.2 29 18.5 0 30.2-7.2 30.2-35.4V275.5h56.4V468c0 58.4-34.2 85-84.2 85-45 0-71.2-23.4-84.5-51.6m199.3-6 46-26.6c12 19.7 27.7 34.2 55.5 34.2 23.4 0 38.3-11.7 38.3-27.8 0-19.3-15.3-26.2-41-37.4l-14.2-6c-40.7-17.4-67.6-39.1-67.6-85 0-42.3 32.2-74.6 82.5-74.6 35.9 0 61.6 12.5 80.2 45.1l-44 28.2c-9.6-17.3-20-24.1-36.2-24.1-16.5 0-27 10.4-27 24.1 0 17 10.5 23.8 34.7 34.3l14 6c48 20.6 75 41.5 75 88.6 0 50.8-39.9 78.6-93.5 78.6-52.3 0-86.1-25-102.7-57.6"/></g><defs><clipPath id="devicon-javascript-1-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg>
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
      ${deviconSvg("python/python-original.svg")}
    `,
    reactLogo: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#00D8FF" d="M493.3 206.1q-9.3-3.2-19.3-6l3-13.2c14.6-71 5-128.2-27.6-147-31.3-18-82.5.7-134.2 45.7q-7.5 6.6-15 13.7l-9.9-9.1c-54.1-48.1-108.5-68.4-141-49.5-31.3 18-40.6 71.8-27.4 139q1.8 9.8 4.4 20-11.5 3.2-22.2 7C40.6 228.6 0 263.4 0 299.4c0 37.2 43.6 74.5 109.7 97q7.9 2.8 16.2 5.2-2.7 11-4.7 21.4c-12.5 66-2.7 118.6 28.5 136.5 32.2 18.6 86.2-.5 138.9-46.5q6.2-5.4 12.5-11.5 8.1 7.8 16.2 14.8c51 43.8 101.4 61.6 132.5 43.5 32.2-18.6 42.7-75 29.1-143.6q-1.5-7.9-3.6-16l11.2-3.5C555.2 374 600 337.2 600 299.5c0-36.1-41.9-71-106.7-93.4m-14.9 166.4-10 3.1q-11.7-36.2-30.5-76a601 601 0 0 0 29.2-74.9q9.3 2.7 17.9 5.6c55.5 19.2 89.4 47.4 89.4 69.2 0 23.2-36.6 53.3-96 73m-24.6 48.8a217 217 0 0 1 2.8 79.2c-3.5 19.3-10.7 32.1-19.6 37.2-19 11-59.3-3.2-103-40.8q-7.5-6.5-15-13.7 25.4-27.9 50.3-63.9c29-2.6 56.4-6.8 81.2-12.5zM204.6 536c-18.5 6.5-33.2 6.7-42.1 1.5-19-10.9-26.8-53-16-109.5q1.7-9.8 4.3-20a603 603 0 0 0 80.8 11.7 624 624 0 0 0 51.6 63.7q-5.8 5.5-11.5 10.5a217 217 0 0 1-67.1 42M118 372.3a217 217 0 0 1-70-37.1c-14.9-12.8-22.4-25.4-22.4-35.7 0-21.9 32.6-49.7 87-68.7q9.8-3.4 20.6-6.5 11.3 37 29.2 75.8c-12 26.2-22 52.2-29.6 76.9q-7.5-2.2-14.8-4.7M147 175c-11.3-57.7-3.8-101.1 15-112 20.1-11.7 64.5 4.9 111.3 46.4l9 8.3a614 614 0 0 0-51 63.3 626 626 0 0 0-80.2 12.4q-2.3-9.3-4-18.4m258.8 63.9q-9-15.5-18.2-30 28.8 3.6 54.7 9.5A548 548 0 0 1 423 270a892 892 0 0 0-17.3-31.2M300.3 136a548 548 0 0 1 35.3 42.6 755 755 0 0 0-71 0 566 566 0 0 1 35.7-42.6M194 239a757 757 0 0 0-17 31 566 566 0 0 1-19-52q25.6-5.8 54.4-9.3Q203 223.5 194 239m19 153a545 545 0 0 1-55.4-8.9 576 576 0 0 1 19.5-53 754 754 0 0 0 35.8 62m87.9 72.7a576 576 0 0 1-36.1-43.2 895 895 0 0 0 71.3 0 545 545 0 0 1-35.2 43.2m122.3-135.5q12 27.5 20.2 52.8-26.2 6-56 9.5a896 896 0 0 0 35.8-62.3m-39.6 19q-14 24.4-28.8 46.5a772 772 0 0 1-109.2.2 727 727 0 0 1-55-94.9 720 720 0 0 1 54.6-94.7 726 726 0 0 1 109.4 0 772 772 0 0 1 54.8 94.3q-11.7 24.2-25.8 48.6m53-286.2c20 11.6 27.8 58.3 15.2 119.6l-2.7 12a614 614 0 0 0-80.2-12.8 602 602 0 0 0-50.8-63.3l14-12.6c44.3-38.6 85.7-53.8 104.6-43M300 245.9a53.6 53.6 0 1 1 0 107.2 53.6 53.6 0 0 1 0-107.2"/></svg>
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
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-typescript-icon-1-a)"><path fill="#3178C6" d="M46.9 0H553c26 0 46.9 21 46.9 46.9V553c0 26-21 46.9-46.9 46.9H47C20.9 600 0 579 0 553.1V47C0 20.9 21 0 46.9 0"/><path fill="#fff" d="M352.8 469.9v64.7q15.8 8 37.3 12.1 21.6 4 45.5 4 23.3 0 44.2-4.4t36.8-14.6a75 75 0 0 0 25-26.7q9.2-16.5 9.2-40.8 0-17.6-5.3-30.8a72 72 0 0 0-15.2-23.6q-9.9-10.3-23.8-18.5a255 255 0 0 0-31.2-15.5 395 395 0 0 1-23-10.2 116 116 0 0 1-17.1-10.1 44 44 0 0 1-11-11 23 23 0 0 1-3.8-13q0-6.7 3.4-12 3.5-5.4 9.8-9.2a52 52 0 0 1 15.3-6q9.2-2.1 20.3-2.1a129 129 0 0 1 35.2 5q9 2.4 17.7 6.3t16 8.9v-60.5q-15-5.7-32.4-8.4t-40.2-2.7q-23 0-43.7 5a111 111 0 0 0-36.3 15.4q-15.8 10.6-24.8 26.8a79 79 0 0 0-9.1 39q0 28.8 16.7 49.3T419 421q13.3 5.5 24.9 10.7 11.5 5.3 20 11 8.3 5.5 13.2 12.3a25 25 0 0 1 1.8 26.8 27 27 0 0 1-9.2 9.3 51 51 0 0 1-15.4 6.2 93 93 0 0 1-21.6 2.2 123 123 0 0 1-80-29.5m-108-161.1H328v-53.3H96v53.3h82.8V546h66z"/></g><defs><clipPath id="devicon-typescript-icon-1-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg>
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
    dotNet: `
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-dotnet-1-a)"><path fill="#512BD4" d="M600 0H0v600h600z"/><path fill="#fff" d="M107 383.3q-6.5 0-10.9-4.2a14 14 0 0 1-4.4-10.3q0-6.2 4.4-10.5A15 15 0 0 1 107 354q6.5 0 11 4.3a14 14 0 0 1 4.5 10.5q0 6-4.5 10.3-4.5 4.2-11 4.2m169.5-2.4H249l-72.7-114.6q-2.8-4.3-4.6-9h-.6l.1.7.1.8.1 1 .1 1 .1 1.7.1 2 .1 2.1v2.4l.1 2.7v109.2h-24.3V225h29.3l70.3 111.9 1.7 2.7 1.1 1.8 1 1.6.8 1.4.4.8.4.7.3.6h.4v-.5l-.2-1-.2-1.2v-1.3l-.1-.7-.2-1.4V339l-.1-1.6-.1-2.6-.1-2.9V225h24.2zm118.8 0H310V225h82v22h-56.7v44h52.3v22h-52.3v46h60.1zm121.4-134H473v134h-25.3V247h-43.6v-22h112.6z"/></g><defs><clipPath id="devicon-dotnet-1-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg> 
    `,
    sqLite: `
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#0F80CC" d="M454.1 26.6H77.6a46 46 0 0 0-45.8 45.9v415.2a46 46 0 0 0 45.8 45.9h248c-2.8-123.4 39.3-362.8 128.5-507"/><path fill="url(#devicon-sqlite-icon-1-a)" d="M440.4 40H77.6a32.6 32.6 0 0 0-32.5 32.5v384.9c82.2-31.5 205.5-58.7 290.8-57.5C353 310.3 403.4 134.7 440.4 40"/><path fill="#003B57" d="M542 13c-25.9-23-57-13.7-88 13.6q-6.9 6.1-13.7 13.4c-52.7 56-101.6 159.5-116.8 238.6a218 218 0 0 1 15.6 47.3l2.1 9.3-2.4-7.4-2-5.7c-3.5-8-13-24.8-17.2-32.2a804 804 0 0 0-9.4 29.4c12 22.1 19.4 60 19.4 60s-.6-2.4-3.6-11a408 408 0 0 0-19.3-36.6c-5.5 20-7.6 33.6-5.7 37 3.8 6.3 7.4 17.4 10.6 29.6 7.1 27.5 12 61 12 61l.5 5.6c-1 23-.4 47 1.4 68.7 2.4 28.6 6.8 53.2 12.5 66.4l3.9-2.1c-8.4-26-11.8-60-10.3-99.2 2.3-60 16-132.2 41.6-207.6 43-113.7 102.8-205 157.5-248.6-49.9 45-117.3 190.7-137.5 244.7A978 978 0 0 0 345 458.6c16.6-50.9 70.5-72.8 70.5-72.8s26.4-32.6 57.3-79.1a562 562 0 0 0-59 15.7c-15 6.3-19 8.4-19 8.4s48.5-29.6 90.2-43C542.4 197.5 605 69.2 542 13"/><defs><linearGradient id="devicon-sqlite-icon-1-a" x1="22838.9" x2="22838.9" y1="894.2" y2="39458.2" gradientUnits="userSpaceOnUse"><stop stop-color="#97D9F6"/><stop offset=".9" stop-color="#0F80CC"/><stop offset="1" stop-color="#0F80CC"/></linearGradient></defs></svg>
    `,
    jest: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#99425B" d="M537.6 295.4A56 56 0 0 0 476 240l76.7-226.3h-326l76.6 226h-3.4a55.8 55.8 0 0 0-17 109A244 244 0 0 1 239 404a224 224 0 0 1-78.3 48.6c-34-17.5-50.2-56.5-35.7-90.6l5-11.7a55.9 55.9 0 1 0-44.8-8.7C71.3 373 51 406 44.7 444.1c-7.6 45.8 0 94.3 39.5 121.8 92.2 63.8 192.2-39.6 297.7-65.6 38.2-9.5 80.2-8 113.9-27.4 25.2-14.7 42-39 46.6-66.2 4.7-27-2-53.7-17.8-75.5 8.1-9.7 13-22.2 13-35.8"/><path fill="#fff" d="M529 404.3a82 82 0 0 1-40 56.7c-20 11.6-43.9 15-69.1 18.7-13.6 2-27.6 4-41.3 7.3-36.1 9-71.2 26.3-105 43.2-67.8 33.6-126.4 62.7-181.6 24.5-40.4-28-38.6-80-33.8-108.3 4.3-26.4 16.1-50.6 27.5-74l5.8-12a69 69 0 0 0 18 4.5c-11.6 38.3 6.6 80 45 99.7l5.2 2.7 5.6-2a236 236 0 0 0 83-51.5 259 259 0 0 0 41.1-49.7 69.7 69.7 0 0 0 79.3-59.5c14.4-.5 29.7-.5 44.2 0a69.6 69.6 0 0 0 108.5 47.9c7.8 16 10.7 34 7.6 51.8M117.2 253.6a42.3 42.3 0 1 1 0 84.5 42.3 42.3 0 0 1 0-84.5m140.4 41.8a42.3 42.3 0 1 1 84.6.1 42.3 42.3 0 0 1-84.6 0m176.2-50.2a70 70 0 0 0-19.1 32.2c-15.6-.6-32.2-.6-47.8 0-3.5-13.3-11-25-20.9-33.9l43.7-88.3zm-188.1-218h287.9l-68 200.6q-4.4 1.1-8.6 2.7l-67.2-137-67.4 136.2q-4.3-1.5-9-2.4zM524 295.5a42 42 0 0 1-42.2 42.2 42.3 42.3 0 1 1 42.2-42.2m27.3 0c0-34-24.5-62.2-56.7-68.3L571.6 0h-364l77.1 227.6a69.6 69.6 0 0 0-21.5 126.8 233 233 0 0 1-33.6 39.6 211 211 0 0 1-67.7 43.5c-24.7-15.5-35.2-44.8-24.3-70.3l.8-2 1.6-3.8a69.6 69.6 0 0 0-22.8-135 69.6 69.6 0 0 0-48.7 118.9q-3.5 7.5-7.3 15c-11.7 24.1-25 51.4-30 81.6-10 60 6.1 108 45.3 135.2a123 123 0 0 0 72 22.9c45.8 0 92-23 137.2-45.4 32.5-16.2 66.2-32.9 99.5-41.1 12.3-3 25-4.9 38.5-6.8 26.8-3.9 54.4-7.9 78.9-22a109 109 0 0 0 53.3-75.7c4.7-27.1-1-54.4-14.8-77.4a69 69 0 0 0 10.2-36.2"/></svg>
    `,
    vercel: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path class="logoFill" d="m300 40.2 300 519.6H0z"/></svg>
    `,
    deepseek: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-deepseek-1-a)"><path fill="#4D6BFE" d="M593.7 112c-6.3-3-9.1 2.9-12.8 5.9q-1.9 1.6-3.4 3.4c-9.3 10-20.2 16.4-34.3 15.6a67 67 0 0 0-54.1 21.3 49 49 0 0 0-31.2-38.7c-8.8-4-17.7-7.8-23.9-16.3-4.3-6-5.4-12.8-7.6-19.4-1.4-4-2.7-8-7.3-8.7-5-.8-7 3.4-9 6.9a91 91 0 0 0-10.5 46 99 99 0 0 0 46 84.8c3.4 2.3 4.3 4.7 3.2 8.1-2 7-4.5 13.8-6.6 20.8-1.4 4.5-3.5 5.5-8.3 3.5-16.2-7-31-17-43.4-29.5-21.4-20.7-40.7-43.5-64.9-61.4q-8.4-6.2-17.2-11.8c-24.6-24 3.2-43.6 9.7-45.9 6.7-2.5 2.3-10.8-19.5-10.7s-41.7 7.4-67.2 17.1a76 76 0 0 1-11.6 3.4q-35.8-6.7-72-2.5a155 155 0 0 0-112.5 65.5c-33.2 45.8-41 97.7-31.5 151.9a232 232 0 0 0 84 141.3 224 224 0 0 0 161 53.5c37-2.1 78.3-7.1 124.8-46.5 11.8 5.8 24 8.1 44.5 9.9 15.8 1.5 30.9-.7 42.6-3.2 18.4-3.9 17.1-21 10.5-24-53.9-25.1-42-14.9-52.8-23.2 27.4-32.4 68.6-66 84.8-175 1.2-8.7.2-14.2 0-21.2-.1-4.2.9-5.9 5.7-6.4q20.6-2.2 38.7-11.8c34.9-19.1 49-50.4 52.3-88 .5-5.7-.1-11.6-6.2-14.7M289.5 450c-52.2-41-77.5-54.6-88-54-9.8.6-8 11.8-5.8 19a70 70 0 0 0 9.2 18.6c2.9 4.1 4.8 10.3-2.8 15-16.8 10.4-46-3.5-47.4-4.2-34-20-62.5-46.4-82.5-82.6a253 253 0 0 1-32.5-112c-.5-9.7 2.3-13.1 12-14.9q18.9-3.6 38.2-1a240 240 0 0 1 136.7 69.4c21.7 21.5 38 47.2 55 72.3 18 26.6 37.4 52 62 72.8a195 195 0 0 0 22.3 17c-20 2.2-53.5 2.7-76.4-15.4m25-161a7.6 7.6 0 0 1 10.4-7.2 7.5 7.5 0 0 1 5 7.2 7.7 7.7 0 0 1-10.7 7.1 8 8 0 0 1-4.7-7.1m77.8 39.9c-5 2-10 3.8-14.8 4-7.2.3-14.2-2-20-6.3-6.8-5.8-11.7-9-13.7-19q-1-7.4.4-14.7c1.7-8.2-.2-13.4-6-18.2-4.7-3.9-10.6-5-17.2-5a14 14 0 0 1-6.3-1.9 6.3 6.3 0 0 1-2.9-9c.7-1.3 4-4.6 4.8-5.2 8.9-5 19.2-3.4 28.7.4 8.8 3.6 15.4 10.2 25 19.6 9.8 11.2 11.5 14.3 17.1 22.8a95 95 0 0 1 11.1 21.2q2.5 7.4-6.2 11.3"/></g><defs><clipPath id="devicon-deepseek-1-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg>
    `,
    huggingface: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#fff" d="M598 431q-2.4-9-7.5-16.6 1.1-4 1.6-8.2a55 55 0 0 0-15-45.6 52 52 0 0 0-19.7-14A264 264 0 0 0 503.7 118a263 263 0 0 0-67.1-58.2A265.2 265.2 0 0 0 40.8 347.3q-9.4 4-18 13.2a55 55 0 0 0-13.2 53.9Q4.4 422 2 431a54 54 0 0 0 2 35.7 53 53 0 0 0 2.7 41 67 67 0 0 0 19.2 23c9.6 7.6 21.6 14 36.1 20.3a422 422 0 0 0 48 16.8 298 298 0 0 0 72.6 10.7c34.3.3 63.8-7.8 85-28.4a257 257 0 0 0 64.4-.2c21.1 20.8 50.8 29 85.2 28.6a296 296 0 0 0 72.5-10.7c9.7-2.5 30.8-9.4 48-16.8a160 160 0 0 0 36.2-20.3c8-6.4 14.6-13.6 19.2-22.9a53 53 0 0 0 2.7-41 55 55 0 0 0 2-35.8m-24.6 34.8a33 33 0 0 1 .9 29.4c-6.5 14.8-22.7 26.4-54.2 38.8-19.5 7.8-37.4 12.7-37.5 12.8a282 282 0 0 1-69.5 10q-50.4 0-74.3-27.4a249 249 0 0 1-80.8.4q-23.8 27-73.9 27c-20.2 0-43.6-3.3-69.4-10-.2 0-18-5-37.6-12.8-31.4-12.4-47.6-24-54.1-38.8a33 33 0 0 1 2.3-31.9 37 37 0 0 1-5-30.1q3.2-11.1 11.3-17.9-4-6.4-5-14a37 37 0 0 1 10.1-30.4 34 34 0 0 1 25-10.7h.3a246.2 246.2 0 1 1 470 .2l3.5-.2c9.9 0 18.7 3.8 25 10.6a37 37 0 0 1 5.1 44.5 34 34 0 0 1 11.4 17.9 37 37 0 0 1-5 30.1z"/><path fill="#FF9D00" d="M571.8 463.3a37 37 0 0 0 5-30.1q-3.1-11.2-11.4-17.9 4-6.5 5-14a37 37 0 0 0-10-30.5 34 34 0 0 0-28.6-10.4 246.2 246.2 0 1 0-470-.2h-.3c-9.8 0-18.7 3.8-25 10.6a37 37 0 0 0-5 44.5A34 34 0 0 0 20 433.2a37 37 0 0 0 5 30.1l-1.4 2.5a33 33 0 0 0-.9 29.4c6.5 14.7 22.7 26.3 54.1 38.8 19.6 7.8 37.5 12.7 37.6 12.8a282 282 0 0 0 69.5 10q50 0 73.8-27c26.8 4.3 54.1 4.1 80.9-.4q23.8 27.4 74.2 27.5 30.6 0 69.5-10.1c.1 0 18-5 37.6-12.8 31.4-12.4 47.6-24 54.1-38.8a33 33 0 0 0-2.3-31.9m-325.2 38.4-4.4 7q-6.1 8.9-15.7 14c-12 6.5-27 8.7-42.4 8.7-24.3 0-49.1-5.6-63-9.3-.8-.1-85.5-24-74.8-44.5q2.8-5 8.5-4.8c15.1 0 42.6 22.5 54.5 22.5q4 .1 5.2-3.8c5-18.1-76.6-25.7-69.7-51.9q2-6.7 9.2-6.5c20 0 64.8 35.1 74.2 35.1q1 0 1.5-.6l.1-.2c4.4-7.3 1.9-12.6-28.3-31l-2.9-1.8C65.3 414.5 42 402.4 55.3 388q2.3-2.5 6.3-2.4 4.7 0 11 2.8c17.6 7.4 41.8 27.5 52 36.3l4.8 4.2s12.8 13.4 20.6 13.4q2.8.1 4.3-2.5c5.5-9.3-51.2-52.2-54.4-70-2.1-12 1.6-18 8.4-18q5 0 11.5 4.1c13.6 8.6 39.8 53.6 49.3 71 3.2 6 8.7 8.4 13.7 8.4 9.8 0 17.4-9.7.9-22.1-25-18.6-16.2-49-4.3-51h1.5c10.8 0 15.6 18.6 15.6 18.6s14 35 38 59c21.7 21.8 24.8 39.6 12 61.9m77.6 4.1-1.2.2-2.2.2-3.3.3-1.1.1-1 .1-1.4.1-1.6.1-1.5.1h-.4l-1.2.1h-.5l-1.5.1-1.7.1h-3.1l-1 .1h-11l-1.2-.1h-1.5l-1.3-.1h-.4l-1.3-.1h-1l-1-.1-3.1-.2-1.1-.1-1.4-.1-1.6-.2q-1.5 0-2.8-.3c13.3-29.7 6.6-57.4-20.3-84.3a173 173 0 0 1-31.9-49.3c-4.9-17-18-35.8-39.6-35.8q-2.7 0-5.5.5c-9.5 1.5-17.8 7-23.7 15.2a83 83 0 0 0-18.2-17.9 47 47 0 0 0-25.2-8.1 33 33 0 0 0-25.9 11.9l-.2.2-.3-1.5v-.1q-2-7.8-3.1-15.8l-.2-1.3-.3-2-.2-1.5-.2-1.6-.2-1.7-.2-1.5v-.1l-.7-7.1v-1.4l-.2-1.1V300l-.2-1.7v-1.6l-.1-1.5v-1.7l-.1-1.2v-5.6a220.8 220.8 0 0 1 441.5 0v7.8l-.2 3v.3l-.1 1.4v1.2l-.7 8.1-.5 5.1-.2 1.2-.2 1.4-.2 1.5-.2 1.7-.2 1.3-.3 1.6-.2 1.5-.3 1.5-2.1 10.4c-6.2-6-14.4-9.3-23.5-9.3a47 47 0 0 0-25.2 8 83 83 0 0 0-18.2 18 36 36 0 0 0-29.2-15.7c-21.7 0-34.7 18.8-39.7 35.7a174 174 0 0 1-31.8 49.4c-26.9 26.8-33.7 54.4-20.6 84m228-59.5-.1.3-.2.5-1.3 2.4-1.6 2-.4.5-.7.7a60 60 0 0 1-19 11.4l-.7.4-1.6.7-1.6.6-1.7.7-11.5 4.5-1.6.7-1.6.6-3.1 1.3-1.6.6-1.5.6-.8.3-1.4.6c-11.2 4.8-19.2 9.7-17.6 15.8l.2.5a6 6 0 0 0 1.1 1.9c2 2 5.6 1.7 10.2.1l1.1-.4.8-.3.4-.2 3.3-1.5.8-.4c5.6-2.7 12-6.4 18.2-9.7l2.9-1.5q2.3-1.3 4.7-2.4c6-2.8 11.5-4.8 16-4.8q3.2 0 5.5 1.5l.3.1q1.2 1 2 2l.4.6.4.6c2.2 4.2.3 8.6-4 12.9a75 75 0 0 1-19.7 12.6 354 354 0 0 1-51 19c-7.7 2-18.7 4.6-31 6.6l-1.8.3h-.3l-8.5 1.1h-.2q-7.7.9-15.6 1.2h-.1l-5.7.1H411q-4.4 0-8.7-.4h-.2l-8.3-1-2.1-.3-1-.2-3-.6-1.8-.5h-.4l-.8-.3h-.1l-1-.3-1-.3-.9-.3-1-.3-.7-.2-.6-.2-1.7-.6-.5-.2-.4-.2-2.5-1-.5-.3-.7-.3-1-.6h-.2l-.5-.3q-1.5-.7-2.8-1.6l-.5-.3-.8-.5-.6-.4-.7-.5-.4-.3-1.4-1-.6-.5-1.5-1.2-1.4-1.3-.7-.7-.7-.7-1.2-1.4h-.1l-3-3.9-.3-.5-.7-1-.7-1.1-1.7-2.7-.6-1-.2-.5-.4-.6-.1-.2-.1-.2-.6-1-.3-.6-.2-.5-.3-.5-.5-1-.7-1.5-.2-.5-.6-1.4-.4-1-1-3-.4-.8a34 34 0 0 1-1.5-7.2l-.3-2.8v-1.4c-.2-12.4 6.1-24.4 19.6-37.9 24-24 38-59 38-59s.3-1.5 1-3.6l2-4.4v-.2l1.7-2.8.4-.7 2.5-3.1q2.1-2.3 4.8-3.3h.2l1-.3 1.2-.2h.7l1.5.1q3.3.6 6 3.6l.3.3a17 17 0 0 1 2.5 4l.4.7.1.4.4.8a29 29 0 0 1 2 12.6v1q-.4 5.1-2.3 10l-.4 1a36 36 0 0 1-3.7 6.7l-.3.5a40 40 0 0 1-9.2 9.3 40 40 0 0 0-5 4.3c-4.3 4.6-5.4 8.7-4.4 11.8l.4 1 1.4 2h.2l.5.5.2.2 1.3.8.4.2q1 .6 2 .8h.2l.3.1h.2l.3.1.2.1h.2l.5.1h.7l.3.1h2.9l.3-.1a15 15 0 0 0 8-3.8l.4-.4.2-.2a15 15 0 0 0 2.8-3.8 663 663 0 0 1 17.9-30.6l.9-1.4.8-1.4 1.3-2 .5-.7.8-1.4 3.6-5.4.9-1.3 5.3-7.7.9-1.2q2.8-4 6-7.7l.8-1 .4-.5.8-1 .4-.4.8-.9.4-.4 1.1-1.2.8-.8q2.2-2.2 4.8-4l.4-.3.5-.2.8-.5c6.8-4 12.5-4.2 15.8-1q3 3 3 10v2.2l-.1.7v.2l-.1.6v.2l-.3 1.6v.4l-.3 1.3-1.3 3-1 2-.7 1-.3.6-4 5.4-.4.6-4 4.7-1 1.2-.5.6-2.3 2.5-.6.6-1.1 1.3-1.2 1.2-1.2 1.3-1.2 1.3-1.2 1.2-2.5 2.6c-11.8 12.1-24.3 24.2-28.5 31.7l-.7 1.5a6 6 0 0 0-.7 3.5l.3.9 1.3 1.6q1.5.9 3 .9h.7l.3-.1h.4l.3-.1.4-.1.4-.1.3-.1 2.3-.9.4-.2.4-.2 2.7-1.6.4-.2.4-.3.4-.2.2-.2.5-.4 1.5-1v-.1l.9-.6 3-2.5.6-.6.3-.3 2-1.8.3-.2.5-.6.3-.3h.1v-.1l.6-.6.2-.1v-.1h.1l.1-.2.6-.5.4-.3.5-.4.4-.4.2-.2.4-.3.6-.6.4-.3 4.5-3.9.8-.6 1.2-1 1.2-1 5.1-4.3 1.2-1 15.4-11.5 1.1-.8 2.4-1.6.7-.5 4.2-2.8.7-.4.7-.4 2.1-1.3.7-.4 1.4-.8 1.4-.8.3-.2 1-.6 1.4-.7.7-.3.6-.4 4.5-2 .7-.3 2.4-.9 1-.3h.1l.6-.2 1.1-.3 1.7-.3.5-.1 2.5-.2h1.2l.4.1h.5l.4.1.4.2q1.7.4 3 1.6l.2.2.2.2a16 16 0 0 1 2.8 4.1l.2.3.5 1.8q.6 2.6-.3 5.2l-.9 2.1-.2.4q-1.4 2.4-3.2 4.3l-.3.2-2.4 2.4-.3.2-2 1.7-.3.3a78 78 0 0 1-9.9 7l-6.2 4-1.9 1.2-18.8 11.4-1.8 1-5.4 3.4-.9.5-1.6 1-3.3 2.2-.8.5-1.3.9-.4.2-1.2.9-.7.4-.8.6-.7.5-3.4 2.4-.4.3-1.3 1-.5.5-2.5 2-.3.4-.6.5-.4.4-.2.2-1.2 1.3-.2.2-1.2 1.5-.1.2-1 1.7-.1.2v.2l-.1.1v.2l-.2.2-.2 1.1v.4l-.1.2v1.5l.1.3v.3l.2.3q0 .6.3 1l.1.3.5 1 .2.3.2.4.2.3.1.1v.1h.1l.1.1.2.1.2.1h.2c1.7.5 5.1-1 9.7-3.4l.8-.4 1.4-.8.7-.3 1.5-.9 1-.5 20.7-12.4 2.1-1.2 1.5-.9a190 190 0 0 1 11.2-6.1l1.4-.7 8-3.7 1-.4h.1q7.9-3.3 13.7-3.4l2.4.2.8.2 1.8.7a7 7 0 0 1 3.6 3.8l.5 1.6q1 3.4-.1 6.8"/><path fill="#FFD21E" d="M517.6 288v-1.4a220.8 220.8 0 1 0-441.6 0v6.8l.1 1.3v.4l.1 1.4v1.7l.3 3.2v1.5l.2 1.3v.8l.7 6.3v.1l.1 1.5.2 1.7.8 5.1v.1a185 185 0 0 0 3.2 17l.1.5.3 1 .2-.1a33 33 0 0 1 25.9-11.9 47 47 0 0 1 25.1 8.1 83 83 0 0 1 18.3 17.9 36 36 0 0 1 29.2-15.6c21.6 0 34.7 18.8 39.6 35.7 2.4 5.7 14.2 31.7 31.9 49.3 26.9 26.9 33.6 54.6 20.3 84.3l4.4.5h1.4l1.1.2 3.2.2h1.5l.4.1h1.7l1.3.2h4l5.2.1h8.6l1.7-.2h2l.8-.1h.8l1.5-.2h1.6l1.4-.2h1l1.1-.2 5.5-.5 1.2-.2c-13-29.6-6.3-57.2 20.5-84a174 174 0 0 0 31.8-49.3c5-17 18-35.8 39.7-35.8a35 35 0 0 1 29.2 15.7c6.4-8 12.6-14.3 18.2-17.9a47 47 0 0 1 25.2-8.1c9 0 17.3 3.3 23.5 9.3l2.6-13.4v-.2l.3-1.3.2-1.4.2-1.7.2-1.2v-.3l.2-1.4.2-1.2.2-2.3.1-1v-.2l.2-1.6.1-1.2.6-8 .1-1.5V296l.1-1.5V293l.1-1zM242 508.6c17.4-25.6 16.2-44.9-7.8-68.9s-38-59-38-59-5.2-20.4-17-18.5c-12 1.8-20.7 32.3 4.2 50.9 25 18.6-5 31.3-14.5 13.8s-35.7-62.5-49.3-71-23-3.8-19.9 13.9c1.6 8.8 16.4 23.8 30.2 37.8 14 14.2 27 27.5 24.2 32.1-5.5 9.3-25-10.9-25-10.9s-60.8-55.3-74-41c-12.2 13.4 6.6 24.7 35.6 42l7.6 4.7c33.2 20 35.8 25.4 31 33-1.7 2.8-12.8-4-26.4-12.1-23.3-14-54-32.4-58.4-16-3.7 14.3 18.9 23.1 39.3 31 17.1 6.6 32.7 12.7 30.4 20.9-2.4 8.5-15.3 1.4-29.4-6.3-15.8-8.8-33.2-18.3-38.8-7.5-10.8 20.3 74 44.3 74.7 44.5 27.4 7 97 22.1 121.2-13.5zm112.6 0c-17.5-25.6-16.3-44.9 7.7-68.9s38-59 38-59 5.2-20.4 17-18.5c12 1.8 20.7 32.3-4.2 50.9s5 31.3 14.5 13.8 35.8-62.5 49.3-71 23.1-3.8 20 13.9c-1.7 8.8-16.4 23.8-30.2 37.8-14 14.3-27 27.5-24.3 32.1 5.6 9.3 25-10.9 25-10.9s60.8-55.3 74-41c12.3 13.4-6.6 24.7-35.6 42.1l-7.6 4.6c-33.2 20-35.8 25.4-31 33 1.7 2.8 12.8-3.9 26.5-12.1 23.3-14 54-32.4 58.3-16 3.8 14.4-18.8 23.1-39.3 31-17 6.7-32.7 12.7-30.4 21s15.3 1.3 29.4-6.4c15.8-8.7 33.2-18.3 38.8-7.5 10.8 20.4-74 44.3-74.7 44.5-27.4 7.1-97 22.2-121.2-13.5z"/><path fill="#32343D" d="M368.7 226.5c3.4 1.2 6 5 8.4 8.4 3.3 4.8 6.4 9.3 11 6.8a31.7 31.7 0 1 0-42.9-13.2c2.2 4.1 7 2.2 12.1.1 4-1.6 8.2-3.2 11.4-2.1m-149.7 0c-3.4 1.2-6 5-8.4 8.5-3.3 4.7-6.4 9.2-11 6.7a31.8 31.8 0 1 1 42.9-13.2c-2.2 4.1-7 2.2-12.1.1-4-1.6-8.2-3.2-11.4-2.1m126.5 136.2a91 91 0 0 0 32.5-68c0-14.9-10-10.2-26-2.3l-1 .5c-14.6 7.3-34.2 17-55.6 17-21.5 0-41-9.7-55.7-17-16.6-8.2-27-13.3-27 1.8 0 19.4 9.3 51.2 34.8 69.7a55 55 0 0 1 33.7-28.5c2.6-.7 5.2 3.6 7.9 8.1 2.5 4.3 5.2 8.7 7.9 8.7s5.6-4.3 8.4-8.6c2.9-4.4 5.7-8.7 8.4-7.9a55 55 0 0 1 31.7 26.5"/><path fill="#FF323D" d="M345.4 362.8a79 79 0 0 1-50.2 16.3 79 79 0 0 1-47.8-14.6A55 55 0 0 1 281 336c5-1.5 10.3 16.8 15.7 16.8 5.9 0 11.5-18.2 16.8-16.5a55 55 0 0 1 31.8 26.5"/><path fill="#FFAD03" d="M162.2 253a20.6 20.6 0 1 1-23-34.3 20.6 20.6 0 0 1 23 34.3m295.4 0a20.6 20.6 0 1 1-23-34.3 20.6 20.6 0 0 1 23 34.3"/></svg>
    `,
    vite: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-vite-3-a)"><path fill="url(#devicon-vite-4-b)" d="M597.6 88.8 316.1 592.2a15.3 15.3 0 0 1-26.6 0L2.5 89a15.3 15.3 0 0 1 16-22.7l281.7 50.4q2.7.5 5.4 0l276-50.3a15.3 15.3 0 0 1 16 22.5"/><path fill="url(#devicon-vite-5-c)" d="M434.4.1 226.1 41c-3.4.6-6 3.5-6.1 7l-13 216.4a7.8 7.8 0 0 0 9.4 8l58-13.4a7.6 7.6 0 0 1 9.2 9l-17.2 84.3a7.7 7.7 0 0 0 9.7 8.9l35.8-10.9a7.7 7.7 0 0 1 9.7 8.9l-27.3 132.5c-1.8 8.3 9.3 12.8 13.9 5.7l3-4.7L481 153.9a7.6 7.6 0 0 0-8.3-11L413 154.6a7.7 7.7 0 0 1-8.8-9.7l39-135a7.7 7.7 0 0 0-8.9-9.7"/></g><defs><linearGradient id="devicon-vite-4-b" x1="-495.9" x2="29863.5" y1="4152.3" y2="45382.6" gradientUnits="userSpaceOnUse"><stop stop-color="#41D1FF"/><stop offset="1" stop-color="#BD34FE"/></linearGradient><linearGradient id="devicon-vite-5-c" x1="12126" x2="18371.4" y1="1123" y2="43965.4" gradientUnits="userSpaceOnUse"><stop stop-color="#FFEA83"/><stop offset=".1" stop-color="#FFDD35"/><stop offset="1" stop-color="#FFA800"/></linearGradient><clipPath id="devicon-vite-3-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg>
    `,
    eslint: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#8080F2" d="m182.7 225.3 113.9-65.7a9 9 0 0 1 9.2 0l113.8 65.7a9 9 0 0 1 4.6 8v131.4a9 9 0 0 1-4.6 8l-113.8 65.7a9 9 0 0 1-9.2 0l-113.9-65.7a9 9 0 0 1-4.6-8V233.3c0-3.3 1.8-6.4 4.6-8"/><path fill="#4B32C3" d="M596.3 288.2 460 51.4c-5-8.6-14-15-24-15H163.9a29 29 0 0 0-24 15L3.9 287.7a28 28 0 0 0 0 28l136 234.9a27 27 0 0 0 24 13h272.4a27 27 0 0 0 24-12.9l136-235.3c5-8.6 5-18.6 0-27.2m-112.8 114a10 10 0 0 1-5 8.4L305 510.6a10 10 0 0 1-9.8 0l-173.6-100a10 10 0 0 1-5.1-8.5V202c0-3.5 2-6.7 5-8.4L295 93.5a10 10 0 0 1 9.8 0l173.6 100c3 1.8 5.1 5 5.1 8.5z"/></svg>
    `,
    express: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path class="logoFill" d="M126.67 98.44c-4.56 1.16-7.38.05-9.91-3.75-5.68-8.51-11.95-16.63-18-24.9-.78-1.07-1.59-2.12-2.6-3.45C89 76 81.85 85.2 75.14 94.77c-2.4 3.42-4.92 4.91-9.4 3.7l26.92-36.13L67.6 29.71c4.31-.84 7.29-.41 9.93 3.45 5.83 8.52 12.26 16.63 18.67 25.21 6.45-8.55 12.8-16.67 18.8-25.11 2.41-3.42 5-4.72 9.33-3.46-3.28 4.35-6.49 8.63-9.72 12.88-4.36 5.73-8.64 11.53-13.16 17.14-1.61 2-1.35 3.3.09 5.19C109.9 76 118.16 87.1 126.67 98.44zM1.33 61.74c.72-3.61 1.2-7.29 2.2-10.83 6-21.43 30.6-30.34 47.5-17.06C60.93 41.64 63.39 52.62 62.9 65H7.1c-.84 22.21 15.15 35.62 35.53 28.78 7.15-2.4 11.36-8 13.47-15 1.07-3.51 2.84-4.06 6.14-3.06-1.69 8.76-5.52 16.08-13.52 20.66-12 6.86-29.13 4.64-38.14-4.89C5.26 85.89 3 78.92 2 71.39c-.15-1.2-.46-2.38-.7-3.57q.03-3.04.03-6.08zm5.87-1.49h50.43c-.33-16.06-10.33-27.47-24-27.57-15-.12-25.78 11.02-26.43 27.57z"/></svg>
    `,
    tailwind: `
      ${deviconSvg("tailwindcss/tailwindcss-original.svg")}
    `,
    rrd: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path class="logoFill" d="M183 353.6a54.4 54.4 0 1 0 0-108.8 54.4 54.4 0 0 0 0 108.8M54.4 462.4a54.4 54.4 0 1 0 0-108.8 54.4 54.4 0 0 0 0 108.8m491.2 0a54.4 54.4 0 1 0 0-108.8 54.4 54.4 0 0 0 0 108.8"/><path fill="#D0021B" d="M367 301.5c-1.8-18.2-2.7-33.3-16.6-44-17.6-13.4-37.6-4.7-62.2-13.5a55 55 0 0 1-42.1-53 55 55 0 0 1 55.4-54.4 55 55 0 0 1 50.7 32.5c13.1 25 4.6 50.3 21 63.1 19.6 15.2 46 4 75.3 18.4a55 55 0 0 1 23 19.8 54 54 0 0 1 9 29.6c0 25.6-18 47-42.1 52.9-24.6 8.9-44.6.1-62.2 13.6-19.9 15.1-9.3 40.5-25.4 67.2a56 56 0 0 1-49.3 29.7 55 55 0 0 1-55.4-54.5c0-21.8 13-40.7 32-49.3 29.3-14.4 55.7-3.3 75.2-18.4 11.3-8.8 13.6-22.2 13.6-39.7"/></svg>
    `,
    springLogo: `
      ${deviconSvg("spring/spring-original.svg")}
    `,
    postgresLogo: `
      ${deviconSvg("postgresql/postgresql-original.svg")}
    `,
    dockerLogo: `
      ${deviconSvg("docker/docker-original.svg")}
    `,
    junitLogo: `
      ${deviconSvg("junit/junit-original.svg")}
    `,
    githubActions: `
      ${deviconSvg("githubactions/githubactions-original.svg")}
    `,
    cloudflare: `
      ${deviconSvg("cloudflare/cloudflare-original.svg")}
    `,
  };

  const techIconNames = {
    ".net": "dotNet",
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
    cloudflare: "cloudflare",
    checklists: "checklist",
    cookies: "database",
    css: "cssLogo",
    dapper: "dapperLogo",
    "data modelling": "database",
    deepseek: "deepseek",
    deployment: "cloud",
    docker: "dockerLogo",
    downtimer: "package",
    dsa: "branch",
    express: "express",
    "express.js": "express",
    eslint: "eslint",
    fastendpoints: "rocket",
    flyway: "database",
    flask: "flask",
    linting: "lint",
    frontend: "monitor",
    git: "gitLogo",
    "github actions": "githubActions",
    groq: "neural",
    jest: "jest",
    junit: "junitLogo",
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
    "node.js": "node",
    postgresql: "postgresLogo",
    psycopg2: "postgresLogo",
    openai: "neural",
    prettier: "lint",
    stylelint: "lint",
    pyhtml: "squareCode",
    python: "pythonLogo",
    react: "reactLogo",
    "react router dom": "rrd",
    "spring boot": "springLogo",
    "spring security": "shield",
    "responsive ui": "monitor",
    rest: "api",
    "radix ui": "palette",
    radixui: "palette",
    "shadcn/ui": "palette",
    shadcn: "palette",
    "slide editing": "monitor",
    sql: "database",
    sqlite: "sqLite",
    "systems design / architecture": "branch",
    "tailwind css": "tailwind",
    tailwindcss: "tailwind",
    "tanstack query": "package",
    testing: "test",
    testcontainers: "beaker",
    "time-based resets": "stopwatch",
    transactions: "transactions",
    typescript: "tsLogo",
    vercel: "vercel",
    vite: "vite",
    uuid: "package",
    "uuid-int": "package",
    validator: "package",
    xunit: "package",
    "hugging face": "huggingface",
  };

  const techIconColors = {
    ".net": "#512bd4",
    ai: "#10a37f",
    "ai feature": "#10a37f",
    "ai sdk": "#10a37f",
    apis: "#38bdf8",
    authentication: "#f59e0b",
    axios: "#5a29e4",
    bcrypt: "#8b5cf6",
    c: "#a8b9cc",
    "c#": "#9b4f96",
    "ci/cd pipelines": "#22c55e",
    cloudflare: "#f38020",
    checklists: "#22c55e",
    cookies: "#d97706",
    css: "#1572b6",
    dapper: "#a855f7",
    "data modelling": "#38bdf8",
    deepseek: "#4d6bfe",
    deployment: "#38bdf8",
    docker: "#2496ed",
    downtimer: "#f59e0b",
    dsa: "#fbbf24",
    express: "currentColor",
    "express.js": "currentColor",
    eslint: "#4b32c3",
    fastendpoints: "#8b5cf6",
    flyway: "#cc0000",
    flask: "currentColor",
    linting: "#4b32c3",
    frontend: "#38bdf8",
    git: "#f05032",
    "github actions": "#2088ff",
    groq: "#f55036",
    jest: "#c21325",
    junit: "#dc514a",
    java: "#f89820",
    javascript: "#f7df1e",
    "javascript/typescript": "#f7df1e",
    "jwt auth": "#d63aff",
    langchain: "#1c3c3c",
    crypto: "#f7931a",
    "highlight.js": "#f59e0b",
    llm: "#10a37f",
    llms: "#10a37f",
    "machine learning": "#10a37f",
    "node.js": "#5fa04e",
    postgresql: "#336791",
    psycopg2: "#336791",
    openai: "#10a37f",
    prettier: "#f7b93e",
    stylelint: "#263238",
    pyhtml: "#e34f26",
    python: "#3776ab",
    react: "#61dafb",
    "react router dom": "currentColor",
    "spring boot": "#6db33f",
    "spring security": "#6db33f",
    "responsive ui": "#38bdf8",
    rest: "#38bdf8",
    "radix ui": "currentColor",
    radixui: "currentColor",
    "shadcn/ui": "currentColor",
    shadcn: "currentColor",
    "slide editing": "#38bdf8",
    sql: "#4479a1",
    sqlite: "#003b57",
    "systems design / architecture": "#fbbf24",
    "tailwind css": "#38bdf8",
    tailwindcss: "#38bdf8",
    "tanstack query": "#ff4154",
    testing: "#22c55e",
    testcontainers: "#291a80",
    "time-based resets": "#f59e0b",
    transactions: "#22c55e",
    typescript: "#3178c6",
    vercel: "currentColor",
    vite: "#646cff",
    uuid: "#8b5cf6",
    "uuid-int": "#8b5cf6",
    validator: "#22c55e",
    xunit: "#512bd4",
  };

  const fallbackIconColors = {
    api: "#38bdf8",
    atom: "#61dafb",
    beaker: "#22c55e",
    braces: "#f59e0b",
    branch: "#fbbf24",
    checklist: "#22c55e",
    cloud: "#38bdf8",
    database: "#4479a1",
    cLogo: "#a8b9cc",
    csharpLogo: "#9b4f96",
    cssLogo: "#1572b6",
    flask: "currentColor",
    hexagon: "#5fa04e",
    javaLogo: "#f89820",
    jsLogo: "#f7df1e",
    lightning: "#646cff",
    lock: "#f59e0b",
    lint: "#4b32c3",
    monitor: "#38bdf8",
    neural: "#10a37f",
    palette: "#a855f7",
    pipeline: "#22c55e",
    package: "#8b5cf6",
    rocket: "#f97316",
    shield: "#d63aff",
    sparkle: "#fbbf24",
    squareCode: "#f59e0b",
    tsLogo: "#3178c6",
    stopwatch: "#f59e0b",
    test: "#22c55e",
    transactions: "#22c55e",
    wind: "#38bdf8",
  };

  function normaliseTag(tag) {
    return tag.trim().toLowerCase();
  }

  function getTechIconName(tag) {
    const key = normaliseTag(tag);
    return techIconNames[key] || "squareCode";
  }

  function getTechIconSvg(tag) {
    return iconSvgs[getTechIconName(tag)];
  }

  function getTechIconColor(tag) {
    const key = normaliseTag(tag);
    const iconName = getTechIconName(tag);
    return techIconColors[key] || fallbackIconColors[iconName] || "#f59e0b";
  }

  function enhanceTechPill(pill) {
    if (pill.dataset.enhanced === "true") return;

    const label = pill.dataset.tagLabel || pill.textContent.trim();
    pill.dataset.tagLabel = label;
    pill.textContent = "";

    const icon = document.createElement("span");
    icon.className = "t2TagIcon";
    icon.setAttribute("aria-hidden", "true");
    icon.style.color = getTechIconColor(label);
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
    const reduceMotion = prefersReducedMotion;

    class Particle {
      constructor(
        x,
        y,
        char,
        color,
        brightness,
        isHairParticle = false,
        isHairEdge = false,
      ) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.vx = 0;
        this.vy = 0;
        this.char = char;
        this.color = color;
        this.brightness = brightness;
        this.isHairParticle = isHairParticle;
        this.isHairEdge = isHairEdge;
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
            Math.sin(
              time * 0.0014 + this.originY * 0.055 + this.originX * 0.01,
            ) * 0.32;
          drawX += wave * 0.45;
          drawY += wave;

          if (this.isHairParticle) {
            const heightFalloff =
              1 - Math.min(1, this.originY / (height * 0.36));
            const gust =
              Math.sin(time * 0.0022 + this.originY * 0.08) * 0.85 +
              Math.sin(time * 0.0011 + this.originX * 0.11) * 0.45;

            drawX += gust * heightFalloff;
            drawY +=
              Math.sin(time * 0.0018 + this.originX * 0.09) *
              heightFalloff *
              0.22;
          }
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

        if (isDark && this.isHairEdge) {
          ctx.save();
          ctx.globalAlpha = 0.28 * this.opacity;
          ctx.fillStyle = "rgba(248, 241, 220, 0.86)";
          ctx.fillText(this.char, drawX, drawY);
          ctx.restore();
        }
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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

    function isHairEdgePixel(x, y, pixel, pixels, gap) {
      const brightness = getBrightness(pixel);

      if (!isHairPixel(y, brightness) || y > height * 0.18) return false;

      const spotPattern = Math.abs(
        Math.sin(x * 12.9898 + y * 78.233) * 43758.5453,
      );

      if (spotPattern % 1 > 0.38) return false;

      const edgeDistance = Math.max(2, gap);
      const neighbors = [getPixel(x, y - edgeDistance, pixels)];

      return neighbors.some((neighbor) => {
        if (neighbor.a < 115) return true;
        return getBrightness(neighbor) - brightness > 54;
      });
    }

    function isHairPixel(y, brightness) {
      return brightness <= 82 && y <= height * 0.42;
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
      const isCompactCanvas = width < 220;
      const gapDensity = isCompactCanvas ? 50 : 65;
      const gap = Math.max(3, Math.round(width / gapDensity));

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const pixel = getPixel(x, y, pixels);

          if (pixel.a < 115) continue;

          const brightness = getBrightness(pixel);
          if (brightness > 252) continue;
          const isHairParticle = isHairPixel(y, brightness);

          const particle = new Particle(
            x,
            y,
            chooseAsciiChar(x, y, pixel, pixels, gap),
            "",
            brightness,
            isHairParticle,
            isDark && isHairEdgePixel(x, y, pixel, pixels, gap),
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

      const now = performance.now();

      for (const particle of particles) {
        particle.color = particleColor;
        particle.update(now);
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

    const reduceMotion = prefersReducedMotion;
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prevX: window.innerWidth / 2,
      prevY: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      active: false,
      lastMove: 0,
    };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let frameId = null;

    function getStarCount() {
      const area = width * height;
      return isChromeMac
        ? Math.max(32, Math.min(60, Math.floor(area / 26000)))
        : Math.max(38, Math.min(82, Math.floor(area / 20000)));
    }

    /* Stars belong to the sky outside the central canvas, which is opaque and
       simply hides anything that drifts behind it. Placement steers clear of
       that band so the density stays where it can actually be seen. */
    let contentBands = [];

    function measureContentBands() {
      contentBands = [".shell"]
        .map((selector) => document.querySelector(selector))
        .filter(Boolean)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return [rect.left, rect.right];
        });
    }

    function isOverContent(x) {
      return contentBands.some(([left, right]) => x >= left && x <= right);
    }

    function randomStarX() {
      let x = Math.random() * width;

      for (let attempt = 0; attempt < 5 && isOverContent(x); attempt += 1) {
        x = Math.random() * width;
      }

      return x;
    }

    function createStar(x = randomStarX(), y = Math.random() * height) {
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.00055 + 0.00025,
        drift: Math.random() * 10 + 4,
        depth: Math.random() * 0.7 + 0.3,
        twinkle: Math.random() * 0.28 + 0.35,
        rotationVariation: Math.random() * 0.08 + 0.08,
      };
    }

    function createStars() {
      stars = Array.from({ length: getStarCount() }, () => createStar());
    }

    function reconcileStars(previousWidth, previousHeight) {
      if (stars.length === 0 || previousWidth <= 0 || previousHeight <= 0) {
        createStars();
        return;
      }

      const scaleX = width / previousWidth;
      const scaleY = height / previousHeight;

      stars.forEach((star) => {
        star.x = Math.max(-20, Math.min(width + 20, star.x * scaleX));
        star.y = Math.max(-20, Math.min(height + 20, star.y * scaleY));
      });

      const targetCount = getStarCount();

      if (stars.length > targetCount) {
        stars.length = targetCount;
      }

      while (stars.length < targetCount) {
        stars.push(createStar());
      }
    }

    function resizeStarfield({ preserveStars = true } = {}) {
      measureContentBands();
      const previousWidth = width;
      const previousHeight = height;

      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (preserveStars) {
        reconcileStars(previousWidth, previousHeight);
      } else {
        createStars();
      }
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

          star.vx += pointer.vx * force * 0.014 * star.depth;
          star.vy += pointer.vy * force * 0.014 * star.depth;
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
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => drawStar(star, time));

      const pointerFresh = performance.now() - pointer.lastMove < 220;

      if (!pointerFresh) {
        pointer.active = false;
      }

      if (!reduceMotion.matches) {
        frameId = requestAnimationFrame(renderStarfield);
        return;
      }

      frameId = null;
    }

    function requestStarfieldRender() {
      if (frameId === null) {
        frameId = requestAnimationFrame(renderStarfield);
      }
    }

    window.addEventListener("resize", () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
      resizeStarfield();
      requestStarfieldRender();
    });
    function handleStarPointerMove(event) {
      const hasMovement =
        typeof event.movementX === "number" ||
        typeof event.movementY === "number";
      const nextVx = hasMovement
        ? event.movementX
        : event.clientX - pointer.prevX;
      const nextVy = hasMovement
        ? event.movementY
        : event.clientY - pointer.prevY;

      pointer.vx = pointer.vx * 0.75 + nextVx * 0.25;
      pointer.vy = pointer.vy * 0.75 + nextVy * 0.25;
      pointer.prevX = event.clientX;
      pointer.prevY = event.clientY;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      pointer.lastMove = performance.now();

      requestStarfieldRender();
    }

    window.addEventListener("pointermove", handleStarPointerMove, {
      passive: true,
    });

    if (isChromeMac) {
      window.addEventListener("mousemove", handleStarPointerMove, {
        passive: true,
      });
    }
    window.addEventListener("pointerleave", () => {
      pointer.active = false;
      pointer.vx = 0;
      pointer.vy = 0;
    });
    reduceMotion.addEventListener("change", () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
      requestStarfieldRender();
    });
    desktopStarfield.addEventListener("change", () => {
      if (desktopStarfield.matches) return;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
      canvas.remove();
    });

    resizeStarfield({ preserveStars: false });
    requestStarfieldRender();
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
    if (prefersReducedMotion.matches) return;

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
    themeToggle.setAttribute("aria-checked", isLight ? "true" : "false");
  }

  function updateThemeChrome(isLight) {
    themeColorMeta?.setAttribute("content", isLight ? "#f6f7f9" : "#0b0e15");
  }

  // Theme: default dark; only set light if saved.
  const savedTheme = getSavedTheme();
  if (savedTheme === "light") root.classList.add("light");
  else root.classList.remove("light");
  const initiallyLight = root.classList.contains("light");
  renderThemeIcon(initiallyLight);
  updateThemeChrome(initiallyLight);

  themeToggle?.addEventListener("click", () => {
    playThemeCrossfade();
    root.classList.toggle("light");
    const nowLight = root.classList.contains("light");
    saveTheme(nowLight ? "light" : "dark");
    renderThemeIcon(nowLight);
    updateThemeChrome(nowLight);
    window.dispatchEvent(new CustomEvent("asciiAvatar:themechange"));
  });

  const aboutLead = document.querySelector("#about .lead");
  const aboutLeadText =
    aboutLead?.textContent.trim().replace(/\s+/g, " ") ?? "";
  const resumeBlocks = document.querySelectorAll(
    "#resume .resumeStack > .tile",
  );
  let aboutLeadFrameId = null;

  function animateAboutLead() {
    if (!aboutLead || !aboutLeadText) return;

    if (aboutLeadFrameId !== null) {
      cancelAnimationFrame(aboutLeadFrameId);
    }

    aboutLeadFrameId = requestAnimationFrame(() => {
      aboutLeadFrameId = null;
      aboutLead.classList.remove("is-line-animated");
      aboutLead.textContent = aboutLeadText;

      if (prefersReducedMotion.matches) return;

      const words = aboutLeadText.split(" ");
      const measureFragment = document.createDocumentFragment();

      words.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = index === words.length - 1 ? word : `${word} `;
        measureFragment.appendChild(wordSpan);
      });

      aboutLead.textContent = "";
      aboutLead.appendChild(measureFragment);

      const lineGroups = [];
      let currentTop = null;
      let currentWords = [];

      Array.from(aboutLead.children).forEach((wordSpan) => {
        const top = Math.round(wordSpan.getBoundingClientRect().top);

        if (currentTop === null || Math.abs(top - currentTop) <= 1) {
          currentTop = currentTop ?? top;
          currentWords.push(wordSpan.textContent);
          return;
        }

        lineGroups.push(currentWords.join("").trimEnd());
        currentTop = top;
        currentWords = [wordSpan.textContent];
      });

      if (currentWords.length > 0) {
        lineGroups.push(currentWords.join("").trimEnd());
      }

      aboutLead.textContent = "";

      lineGroups.forEach((line, index) => {
        const lineSpan = document.createElement("span");
        lineSpan.className = "leadLine";
        lineSpan.style.setProperty("--line-index", index);
        lineSpan.textContent =
          index === lineGroups.length - 1 ? line : `${line} `;
        aboutLead.appendChild(lineSpan);
      });

      // Restart the CSS animation after the measured line DOM is in place.
      void aboutLead.offsetWidth;
      aboutLead.classList.add("is-line-animated");
    });
  }

  let projectAnimationTimeout = null;
  let resumeAnimationTimeout = null;

  function animateResumeBlocks() {
    if (prefersReducedMotion.matches) return;

    if (resumeAnimationTimeout !== null) {
      window.clearTimeout(resumeAnimationTimeout);
    }

    resumeBlocks.forEach((block, index) => {
      block.classList.remove("is-resume-entering");
      block.style.setProperty("--resume-index", index);
    });

    if (resumeBlocks.length > 0) {
      void resumeBlocks[0].offsetWidth;
    }

    resumeBlocks.forEach((block) => {
      block.classList.add("is-resume-entering");
    });

    const totalDuration =
      260 + 520 + Math.max(0, resumeBlocks.length - 1) * 220;
    resumeAnimationTimeout = window.setTimeout(() => {
      resumeAnimationTimeout = null;
      resumeBlocks.forEach((block) => {
        block.classList.remove("is-resume-entering");
        block.style.removeProperty("--resume-index");
      });
    }, totalDuration + 80);
  }

  function animateProjectCards() {
    if (prefersReducedMotion.matches) return;

    if (projectAnimationTimeout !== null) {
      window.clearTimeout(projectAnimationTimeout);
    }

    const visibleProjects = Array.from(projects).filter(
      (project) => project.style.display !== "none",
    );

    visibleProjects.forEach((project, index) => {
      project.classList.remove("is-project-entering");
      project.style.setProperty("--project-index", index);
    });

    if (visibleProjects.length > 0) {
      void visibleProjects[0].offsetWidth;
    }

    visibleProjects.forEach((project) => {
      project.classList.add("is-project-entering");
    });

    const totalDuration =
      260 + 520 + Math.max(0, visibleProjects.length - 1) * 145;
    projectAnimationTimeout = window.setTimeout(() => {
      projectAnimationTimeout = null;
      visibleProjects.forEach((project) => {
        project.classList.remove("is-project-entering");
        project.style.removeProperty("--project-index");
      });
    }, totalDuration + 80);
  }

  /* Sections reveal themselves as they scroll into view: the header lands
     first, then whatever staggered cards the section holds. */
  const sectionRunners = {
    about: () => {
      window.dispatchEvent(new CustomEvent("asciiAvatar:reveal"));
      animateAboutLead();
    },
    projects: animateProjectCards,
    resume: animateResumeBlocks,
  };
  const revealedPanes = new WeakSet();

  function revealSection(pane) {
    if (revealedPanes.has(pane)) return;
    revealedPanes.add(pane);

    pane.classList.add("is-revealed");
    const run = sectionRunners[pane.id];
    if (run) requestAnimationFrame(run);
  }

  function setupSectionReveals() {
    if (!("IntersectionObserver" in window)) {
      panes.forEach(revealSection);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          revealSection(entry.target);
        });
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.12 },
    );

    panes.forEach((pane) => observer.observe(pane));
  }

  /* The nav underlines whichever section is currently under it. */
  function setupScrollSpy() {
    if (!navLinks.length || !panes.length) return;

    const pageNav = document.querySelector(".pageNav");
    const sections = Array.from(panes);
    let frameId = null;

    function sync() {
      frameId = null;

      pageNav?.classList.toggle("is-stuck", window.scrollY > 4);

      const line = window.scrollY + 110;
      let activeId = sections[0].id;

      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= line) activeId = section.id;
      });

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) activeId = sections[sections.length - 1].id;

      /* Safety net: nothing may stay hidden once it is well inside view. */
      const revealLine = window.innerHeight * 0.85;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < revealLine) {
          revealSection(section);
        }
      });

      navLinks.forEach((link) =>
        link.classList.toggle("is-active", link.dataset.nav === activeId),
      );
    }

    function schedule() {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(sync);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    sync();
  }

  function setupDynamicCodeLineNumbers() {
    const codeBlocks = document.querySelectorAll(".codeBlock");
    if (!codeBlocks.length) return;

    function visualLineCount(codeText) {
      const styles = getComputedStyle(codeText);
      const fontSize = parseFloat(styles.fontSize) || 14;
      const lineHeight =
        parseFloat(styles.lineHeight) || fontSize * 1.34;
      const height = codeText.getBoundingClientRect().height;

      return Math.max(1, Math.round(height / lineHeight));
    }

    function renderNumbers() {
      codeBlocks.forEach((block) => {
        let nextLineNumber = 1;
        const lines = block.querySelectorAll(".codeLine");

        lines.forEach((line) => {
          const gutter = line.querySelector(".lineNo");
          const codeText = line.querySelector(".codeText");
          if (!gutter || !codeText) return;

          const rows = visualLineCount(codeText);
          const fragment = document.createDocumentFragment();

          for (let i = 0; i < rows; i += 1) {
            const number = document.createElement("span");
            number.className = "lineNoRow";
            number.textContent = String(nextLineNumber);
            fragment.appendChild(number);
            nextLineNumber += 1;
          }

          gutter.replaceChildren(fragment);
        });
      });
    }

    let frameId = null;
    function scheduleRender() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        frameId = null;
        renderNumbers();
      });
    }

    scheduleRender();
    window.addEventListener("load", scheduleRender, { once: true });
    window.addEventListener("resize", scheduleRender);
    document.fonts?.ready.then(scheduleRender).catch(() => {});

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(scheduleRender);
      codeBlocks.forEach((block) => observer.observe(block));
    }
  }

  setupSectionReveals();
  setupScrollSpy();
  setupDynamicCodeLineNumbers();

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

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  async function createBlurredImage(src, requestId) {
    if (!modalImageBg) return;

    const cached = blurredImageCache.get(src);
    if (cached) {
      modalImageBg.src = cached;
      modalImageBg.classList.add("is-loaded");
      return;
    }

    try {
      const image = await preloadImage(src);
      if (requestId !== modalImageRequestId) return;

      const width = 96;
      const height = Math.max(
        1,
        Math.round(width * (image.naturalHeight / image.naturalWidth)),
      );
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      ctx.filter = "blur(8px) saturate(0.9) brightness(0.7)";
      ctx.drawImage(image, -8, -8, width + 16, height + 16);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.68);
      blurredImageCache.set(src, dataUrl);

      if (modalImageBg.dataset.source === src) {
        modalImageBg.src = dataUrl;
        modalImageBg.classList.add("is-loaded");
      }
    } catch {
      if (requestId !== modalImageRequestId) return;
      modalImageBg.src = src;
      modalImageBg.classList.add("is-loaded");
    }
  }

  /* html carries overflow-x: clip, so body's overflow never reaches the
     viewport - the page has to be pinned in place instead. */
  function lockPageScroll() {
    scrollLockOffset = window.scrollY;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty("--scrollLockY", `-${scrollLockOffset}px`);
    document.body.style.setProperty("--scrollLockGap", `${scrollbarGap}px`);
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
  }

  function unlockPageScroll() {
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("--scrollLockY");
    document.body.style.removeProperty("--scrollLockGap");
    /* jump back - smooth scrolling would animate the restore */
    window.scrollTo({ top: scrollLockOffset, behavior: "instant" });
  }

  function openProjectModal(project) {
    if (!projectModal || !modalCard) return;
    const requestId = ++modalImageRequestId;

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
      modalImage.alt = `${title} project preview`;
      modalImage.classList.remove("is-loaded");
      modalImage.removeAttribute("src");
    }
    if (modalImageBg) {
      modalImageBg.dataset.source = image;
      modalImageBg.classList.remove("is-loaded");
      modalImageBg.removeAttribute("src");
      createBlurredImage(image, requestId);
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
    lockPageScroll();
    modalCard.focus();

    preloadImage(image)
      .then(async (loadedImage) => {
        if (requestId !== modalImageRequestId || !modalImage) return;
        modalImage.src = loadedImage.src;
        if (modalImage.decode) {
          await modalImage.decode().catch(() => {});
        }
        if (requestId === modalImageRequestId) {
          modalImage.classList.add("is-loaded");
        }
      })
      .catch(() => {
        if (requestId !== modalImageRequestId || !modalImage) return;
        modalImage.src = image;
        modalImage.classList.add("is-loaded");
      });
  }

  function closeProjectModal() {
    if (!projectModal) return;
    modalImageRequestId += 1;

    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    projectModal.setAttribute("inert", "");
    pageShell?.removeAttribute("inert");
    unlockPageScroll();
    lastFocusedElement?.focus({ preventScroll: true });
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
