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

  // --- Circular page transition ---
  const circle = document.querySelector(".transition-circle");
  if (circle) {
    const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const maxScale = (diagonal * 2.2) / 40;

    const storedX = sessionStorage.getItem("txX");
    const storedY = sessionStorage.getItem("txY");
    const originX = storedX !== null ? parseFloat(storedX) : window.innerWidth / 2;
    const originY = storedY !== null ? parseFloat(storedY) : window.innerHeight / 2;

    circle.style.left = originX + "px";
    circle.style.top = originY + "px";
    circle.style.transition = "none";
    circle.style.transform = `translate(-50%, -50%) scale(${maxScale})`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        circle.style.transition = "transform 0.6s cubic-bezier(.65,0,.35,1)";
        circle.style.transform = "translate(-50%, -50%) scale(0)";
      });
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || link.classList.contains("active")) return;
        e.preventDefault();

        const rect = link.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        sessionStorage.setItem("txX", x);
        sessionStorage.setItem("txY", y);

        circle.style.left = x + "px";
        circle.style.top = y + "px";
        circle.style.transition = "none";
        circle.style.transform = "translate(-50%, -50%) scale(0)";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            circle.style.transition = "transform 0.6s cubic-bezier(.65,0,.35,1)";
            circle.style.transform = `translate(-50%, -50%) scale(${maxScale})`;
          });
        });

        setTimeout(() => { window.location.href = href; }, 600);
      });
    });
  }
});