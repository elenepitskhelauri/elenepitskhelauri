// import { ADMIN_KEY } from './config.js';
/* =========================================
   IMAGE PREVIEW FUNCTION
========================================= */
function openImage(src) {
  window.open(src, "_blank");
}

/* =========================================
   VANTA BACKGROUND (THEME AWARE)
========================================= */
let vantaEffect = null;

function applyVanta() {
  if (typeof VANTA === "undefined") return;

  if (vantaEffect) {
    vantaEffect.destroy();
  }

  const isDark = document.body.classList.contains("dark-mode");

  vantaEffect = VANTA.FOG({
    el: "#bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    mouseEase: 0.1,
    mouseInfluence: 0.2,
    highlightColor: isDark ? 0xb0b0b0 : 0xf2efe7,
    midtoneColor: isDark ? 0x3eeb63 : 0xf2efe7,
    lowlightColor: isDark ? 0x13a618 : 0xe6dfcf,
    baseColor: isDark ? 0xe0e0e0 : 0xffe0b2,
    blurFactor: isDark ? 0.6 : 0.7,
    zoom: 1.0,
    speed: isDark ? 5.0 : 2.5,
    minHeight: 200,
    minWidth: 200
  });
}

/* =========================================
   MAIN SCRIPT
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  console.log("SCRIPT WORKING");

  /* =========================
     THEME TOGGLE
  ========================= */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  if (themeToggle && themeIcon && themeText) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.src = "img/sun.png";
      themeText.textContent = "Light Mode";
    } else {
      document.body.classList.remove("dark-mode");
      themeIcon.src = "img/moon.png";
      themeText.textContent = "Dark Mode";
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");

      themeIcon.src = isDark ? "img/sun.png" : "img/moon.png";
      themeText.textContent = isDark ? "Light Mode" : "Dark Mode";

      localStorage.setItem("theme", isDark ? "dark" : "light");
      applyVanta();
    });
  }

  applyVanta();

  /* =========================
     VISIT COUNTER (AUTO)
  ========================= */
if (!sessionStorage.getItem("visited")) {
  fetch(`${API_BASE_URL}/api/visit`)
    .then((res) => {
      if (!res.ok) throw new Error("Visit API failed");
      return res.json();
    })
    .then((data) => {
      console.log("Visit counted:", data.visits);
      sessionStorage.setItem("visited", "true");
    })
    .catch((error) => {
      console.log("Visit counter unavailable", error);
    });
}

  /* =========================
     SKILLS TABS
  ========================= */
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".skills-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");

      const target = document.getElementById(button.dataset.target);
      if (target) {
        target.classList.add("active");
      }
    });
  });

  /* =========================
     DROPDOWNS
  ========================= */
  document.querySelectorAll(".dropdown").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("open");

      const submenu = item.querySelector(".sub-skill-list");
      if (submenu) {
        submenu.style.display =
          submenu.style.display === "block" ? "none" : "block";
      }
    });
  });

  /* =========================
     FLOATING BRANCHES
  ========================= */
  const branches = document.querySelectorAll(".floating-branch");
  let scrollOffset = 0;

  window.addEventListener("scroll", () => {
    scrollOffset = window.scrollY * 0.05;
  });

  function animateBranches() {
    const time = Date.now() * 0.001;

    branches.forEach((branch, i) => {
      if (!document.body.classList.contains("dark-mode")) {
        branch.style.transform = "translate(0, 0) rotate(0deg)";
        return;
      }

      const swayX = Math.sin(time * 1.2 + i) * 12;
      const swayY = Math.cos(time * 1.0 + i * 0.8) * 8;
      const rotate = Math.sin(time * 0.8 + i) * 3;

      branch.style.transform =
        `translate(${swayX}px, ${swayY + scrollOffset}px) rotate(${rotate}deg)`;
    });

    requestAnimationFrame(animateBranches);
  }

  animateBranches();

  /* =========================
     PRO SEARCH
  ========================= */
  const siteSearch = document.getElementById("siteSearch");
  const searchBtn = document.getElementById("searchBtn");
  const searchSuggestions = document.getElementById("searchSuggestions");

  let currentSuggestionIndex = -1;
  let filteredResults = [];
  let lastMarkedElements = [];

  const sectionAliases = [
    { label: "Home", keywords: ["home", "top", "main", "cv"], target: "home", type: "section" },
    { label: "About", keywords: ["about", "about me", "intro", "introduction"], target: "about", type: "section" },
    { label: "Skills", keywords: ["skills", "programming", "development", "python", "javascript", "html", "css", "c++", "robotics", "quantum", "ai", "ml", "full stack", "full-stack", "secops", "devops", "prompt engineering"], target: "skills", type: "section" },
    { label: "Projects", keywords: ["projects", "project", "github", "smartpitskhela", "about me script", "robot"], target: "projects", type: "section" },
    { label: "Education", keywords: ["education", "university", "linnaeus", "georgia", "school", "bachelor"], target: "education", type: "section" },
    { label: "Achievements", keywords: ["achievements", "achievement", "erasmus", "oxford", "cambridge", "scholarship", "stem camp", "slovenia", "norway", "borjomi"], target: "achievements", type: "section" },
    { label: "Certificates", keywords: ["certificates", "certificate", "aws", "google security", "sql", "coursera", "udemy", "openlearn"], target: "certificates", type: "section" },
    { label: "Experience", keywords: ["experience", "lab assistant", "work", "teaching", "leadership"], target: "experience", type: "section" },
    { label: "Languages", keywords: ["languages", "english", "georgian", "russian", "turkish", "czech"], target: "languages", type: "section" },
    { label: "Contact", keywords: ["contact", "email", "linkedin", "github link", "message"], target: "contact", type: "section" }
  ];

  function removeHighlights() {
    lastMarkedElements.forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    lastMarkedElements = [];
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightTextInElement(element, query) {
    if (!element || !query) return false;

    removeHighlights();

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parentTag = node.parentElement ? node.parentElement.tagName : "";
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "NOSCRIPT", "MARK"].includes(parentTag)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    let found = false;
    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
      regex.lastIndex = 0;
      if (!regex.test(node.nodeValue)) return;

      found = true;
      const span = document.createElement("span");
      span.innerHTML = node.nodeValue.replace(regex, '<mark class="search-mark">$1</mark>');
      const marks = span.querySelectorAll("mark.search-mark");
      lastMarkedElements.push(...marks);
      node.parentNode.replaceChild(span, node);
    });

    return found;
  }

  function activateSkillTabForQuery(query) {
    const q = query.toLowerCase();

    const tabMap = [
      {
        id: "programming",
        keywords: ["python", "javascript", "html", "css", "c++", "full stack", "full-stack", "assembly", "quantum", "robotics", "git", "github", "ai", "ml"]
      },
      {
        id: "corecs",
        keywords: ["algorithms", "data structures", "operating systems", "networks", "cybersecurity", "computer architecture", "office"]
      },
      {
        id: "web",
        keywords: ["web management", "engineering management", "electronics", "hardware", ".net", "mbots", "lego"]
      },
      {
        id: "academic",
        keywords: ["lecturer", "calculus", "physics", "linear algebra", "precalculus", "software engineering", "discrete mathematics"]
      },
      {
        id: "secops",
        keywords: ["soc", "secops", "threat detection", "incident response", "threat hunting", "log analysis", "yara", "detection engineering"]
      },
      {
        id: "devopssec",
        keywords: ["soar", "cloud security", "chronicle", "automation", "pipeline", "udm", "parser"]
      },
      {
        id: "prompteng",
        keywords: ["prompt engineering", "few-shot", "chain-of-thought", "responsible ai", "prompt design", "llm"]
      }
    ];

    const matchedTab = tabMap.find((tab) =>
      tab.keywords.some((keyword) => q.includes(keyword) || keyword.includes(q))
    );

    if (!matchedTab) return;

    tabButtons.forEach((button) => button.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    const targetContent = document.getElementById(matchedTab.id);
    const targetButton = document.querySelector(`.tab-button[data-target="${matchedTab.id}"]`);

    if (targetContent) targetContent.classList.add("active");
    if (targetButton) targetButton.classList.add("active");
  }

  function scrollToTarget(targetId, query = "") {
    const target = document.getElementById(targetId);
    if (!target) {
      alert("Section not found.");
      return;
    }

    if (targetId === "skills" && query) {
      activateSkillTabForQuery(query);
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    target.classList.add("search-highlight");
    setTimeout(() => {
      target.classList.remove("search-highlight");
    }, 1600);

    setTimeout(() => {
      if (query) {
        highlightTextInElement(target, query);
      }
    }, 350);
  }

  function getAllSearchableElements() {
    return [
      ...document.querySelectorAll(
        "section, header, .project, .certificate, .achievement, .achievement-card, .achievement-box, .language-card, .experience-entry"
      )
    ];
  }

  function findBestContentMatch(query) {
    const q = query.toLowerCase();
    const elements = getAllSearchableElements();

    for (const el of elements) {
      const text = (el.innerText || "").toLowerCase();
      if (text.includes(q)) {
        const parentSection = el.closest("section") || el;
        return {
          label: parentSection.id
            ? parentSection.id.charAt(0).toUpperCase() + parentSection.id.slice(1)
            : "Matched Content",
          target: parentSection.id || "home",
          type: "content"
        };
      }
    }

    return null;
  }

  function buildSuggestions(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const aliasMatches = sectionAliases.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.some((keyword) => keyword.includes(q) || q.includes(keyword))
    );

    const contentMatch = findBestContentMatch(q);
    const combined = [...aliasMatches];

    if (contentMatch && !combined.some((item) => item.target === contentMatch.target)) {
      combined.push(contentMatch);
    }

    return combined.slice(0, 8);
  }

  function hideSuggestions() {
    if (!searchSuggestions) return;
    searchSuggestions.innerHTML = "";
    searchSuggestions.style.display = "none";
    currentSuggestionIndex = -1;
  }

  function showSuggestions(results) {
    if (!searchSuggestions) return;

    searchSuggestions.innerHTML = "";

    if (!results.length) {
      hideSuggestions();
      return;
    }

    results.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `${item.label}<span class="search-result-type">${item.type}</span>`;

      if (index === currentSuggestionIndex) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => {
        siteSearch.value = item.label;
        hideSuggestions();
        scrollToTarget(item.target, siteSearch.value);
      });

      searchSuggestions.appendChild(li);
    });

    searchSuggestions.style.display = "block";
  }

  function updateSuggestions() {
    if (!siteSearch) return;

    const query = siteSearch.value.trim();
    if (!query) {
      hideSuggestions();
      removeHighlights();
      return;
    }

    filteredResults = buildSuggestions(query);
    currentSuggestionIndex = -1;
    showSuggestions(filteredResults);
  }

  function runSearch() {
    if (!siteSearch) return;

    const query = siteSearch.value.trim();
    if (!query) {
      alert("Please type something to search.");
      return;
    }

    removeHighlights();

    const exactAlias = sectionAliases.find(
      (item) =>
        item.label.toLowerCase() === query.toLowerCase() ||
        item.keywords.some((keyword) => keyword.toLowerCase() === query.toLowerCase())
    );

    if (exactAlias) {
      hideSuggestions();
      scrollToTarget(exactAlias.target, query);
      return;
    }

    const aliasSuggestion = buildSuggestions(query)[0];
    if (aliasSuggestion) {
      hideSuggestions();
      scrollToTarget(aliasSuggestion.target, query);
      return;
    }

    const contentMatch = findBestContentMatch(query);
    if (contentMatch) {
      hideSuggestions();
      scrollToTarget(contentMatch.target, query);
      return;
    }

    alert("No matching result found.");
    hideSuggestions();
  }

  if (siteSearch && searchBtn && searchSuggestions) {
    siteSearch.addEventListener("input", updateSuggestions);

    siteSearch.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && filteredResults.length) {
        e.preventDefault();
        currentSuggestionIndex = (currentSuggestionIndex + 1) % filteredResults.length;
        showSuggestions(filteredResults);
      }

      if (e.key === "ArrowUp" && filteredResults.length) {
        e.preventDefault();
        currentSuggestionIndex =
          (currentSuggestionIndex - 1 + filteredResults.length) % filteredResults.length;
        showSuggestions(filteredResults);
      }

      if (e.key === "Enter") {
        e.preventDefault();

        if (filteredResults.length && currentSuggestionIndex >= 0) {
          const selected = filteredResults[currentSuggestionIndex];
          siteSearch.value = selected.label;
          hideSuggestions();
          scrollToTarget(selected.target, siteSearch.value);
        } else {
          runSearch();
        }
      }

      if (e.key === "Escape") {
        hideSuggestions();
      }
    });

    searchBtn.addEventListener("click", runSearch);

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box")) {
        hideSuggestions();
      }
    });
  }

  /* =========================
     CONTACT FORM
  ========================= */
  // const formStatus = document.getElementById("formStatus");

  // if (contactForm && formStatus) {
  //   contactForm.addEventListener("submit", async (e) => {
  //     e.preventDefault();

  //     const name = document.getElementById("contactName")?.value.trim() || "";
  //     const email = document.getElementById("contactEmail")?.value.trim() || "";
  //     const message = document.getElementById("contactMessage")?.value.trim() || "";

  //     if (!name || !email || !message) {
  //       formStatus.textContent = "Please fill all fields";
  //       return;
  //     }

  //     try {
  //       const res = await fetch("http://localhost:3000/api/contact", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ name, email, message })
  //       });

  //       const data = await res.json();

  //       formStatus.textContent = res.ok
  //         ? "Message sent successfully"
  //         : data.error || "Error";

  //       if (res.ok) {
  //         contactForm.reset();
  //       }
  //     } catch {
  //       formStatus.textContent = "Server error";
  //     }
  //   });
  // }
const API_BASE_URL = "https://elenepitskhelauri.onrender.com";
/* ========================= 
ADMIN PANEL 
========================= */
const adminBtn = document.getElementById("adminLoginBtn");
const adminBox = document.getElementById("adminCounter");

function showAdminPanel(adminKey) {
  if (!adminBox) return;

  adminBox.style.display = "block";
  adminBox.innerHTML = "Loading...";

  fetch(`${API_BASE_URL}/api/admin/visits?key=${encodeURIComponent(adminKey)}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Unauthorized or server error");
      }
      return res.json();
    })
    .then((data) => {
      adminBox.innerHTML = `
        👀 Visitors: <strong>${data.visits}</strong><br>
        <button id="logoutBtn">Logout</button>
      `;

      document.getElementById("logoutBtn")?.addEventListener("click", () => {
        sessionStorage.removeItem("adminKey");
        adminBox.style.display = "none";
        location.reload();
      });
    })
    .catch(() => {
      adminBox.innerHTML = "❌ Wrong key or cannot connect to server";
      sessionStorage.removeItem("adminKey");
    });
}

if (adminBtn && adminBox) {
  const savedAdminKey = sessionStorage.getItem("adminKey");

  if (savedAdminKey) {
    showAdminPanel(savedAdminKey);
  }

  adminBtn.addEventListener("click", () => {
    const input = prompt("Enter admin key:");

    if (!input) return;

    sessionStorage.setItem("adminKey", input);
    showAdminPanel(input);
  });
}
  /* =========================
     OWLS (LIGHT + DARK)
  ========================= */
  const owlLight = document.getElementById("owlLight");
  const owlDark = document.getElementById("owlDark");

  function handleOwls() {
    if (!owlLight || !owlDark) return;

    const isDark = document.body.classList.contains("dark-mode");

    owlLight.classList.remove("show");
    owlDark.classList.remove("show");

    if (isDark) {
      owlDark.classList.add("show");
    } else {
      owlLight.classList.add("show");
    }
  }

  handleOwls();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTimeout(handleOwls, 50);
    });
  }
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}
});