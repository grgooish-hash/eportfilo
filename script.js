(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 1. Active nav — mark the correct link based on current filename     */
  /* ------------------------------------------------------------------ */
  function initActiveNav() {
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".top-nav-links a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentFile) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Scroll-reveal for intro-block children                           */
  /* ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".intro-block h2, .intro-block p, .intro-block pre, " +
      ".demo-frame, .demo-grid .card, .spec-list li, .btn"
    );

    if (!targets.length || !("IntersectionObserver" in window)) return;

    // Inject minimal reveal styles (no extra stylesheet needed)
    const style = document.createElement("style");
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(18px);
                transition: opacity 0.45s ease, transform 0.45s ease; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) {
        .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      }
    `;
    document.head.appendChild(style);

    targets.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* 3. Copy-to-clipboard button on every <pre> block                    */
  /* ------------------------------------------------------------------ */
  function initCopyButtons() {
    const style = document.createElement("style");
    style.textContent = `
      .pre-wrapper { position: relative; }
      .copy-btn {
        position: absolute; top: 0.6rem; right: 0.6rem;
        font-family: var(--font-mono); font-size: 0.7rem;
        color: var(--ink-xsoft); background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15); border-radius: 4px;
        padding: 0.2em 0.6em; cursor: pointer; line-height: 1.6;
        transition: background 150ms ease, color 150ms ease;
      }
      .copy-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }
      .copy-btn.copied { color: #7ec8a0; border-color: #7ec8a0; }
    `;
    document.head.appendChild(style);

    document.querySelectorAll("pre").forEach((pre) => {
      const wrapper = document.createElement("div");
      wrapper.className = "pre-wrapper";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      wrapper.appendChild(btn);

      btn.addEventListener("click", () => {
        const text = pre.querySelector("code")
          ? pre.querySelector("code").innerText
          : pre.innerText;

        navigator.clipboard
          .writeText(text)
          .then(() => {
            btn.textContent = "copied!";
            btn.classList.add("copied");
            setTimeout(() => {
              btn.textContent = "copy";
              btn.classList.remove("copied");
            }, 2000);
          })
          .catch(() => {
            btn.textContent = "error";
            setTimeout(() => (btn.textContent = "copy"), 2000);
          });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Reading progress bar                                             */
  /* ------------------------------------------------------------------ */
  function initProgressBar() {
    const bar = document.createElement("div");
    const style = document.createElement("style");
    style.textContent = `
      #read-progress {
        position: fixed; top: 0; left: 0; height: 3px; width: 0%;
        background: var(--accent); z-index: 9999;
        transition: width 100ms linear;
        pointer-events: none;
      }
      @media (prefers-reduced-motion: reduce) {
        #read-progress { transition: none; }
      }
    `;
    document.head.appendChild(style);
    bar.id = "read-progress";
    document.body.prepend(bar);

    function updateBar() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(pct, 100) + "%";
    }

    window.addEventListener("scroll", updateBar, { passive: true });
    updateBar();
  }

  /* ------------------------------------------------------------------ */
  /* Bootstrap                                                           */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initActiveNav();
    initScrollReveal();
    initCopyButtons();
    initProgressBar();
  });
})();