document.addEventListener("DOMContentLoaded", () => {
  // --- Nav active state ---
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
  });

  // --- Mobile nav toggle ---
  const toggleBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  // --- Animated stat counters ---
  document.querySelectorAll(".stat-num").forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    let current = 0;
    const step = Math.max(1, Math.round(target / 30));
    const tick = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = current;
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });

  // --- Page transition (fade curtain) ---
  const overlay = document.querySelector(".page-transition-overlay");
  const main = document.querySelector(".main");
  const nav = document.querySelector(".topnav");

  if (overlay) {
    // Reveal current page smoothly on load
    requestAnimationFrame(() => {
      overlay.classList.add("hidden");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || link.classList.contains("active")) return;
        e.preventDefault();

        if (main) main.classList.add("pt-fade");
        if (nav) nav.classList.add("pt-fade");
        overlay.classList.remove("hidden");

        setTimeout(() => { window.location.href = href; }, 380);
      });
    });
  }
});