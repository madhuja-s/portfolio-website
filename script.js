document.addEventListener("DOMContentLoaded", () => {
  // --- Sidebar nav highlighting ---
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
  });

  // --- Mobile sidebar toggle ---
  const toggleBtn = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
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

  // --- Cursor-reactive tilt on cards ---
  const tiltEls = document.querySelectorAll(".skill-tile, .project-card, .project-feature");
  tiltEls.forEach(card => {
    const base = parseFloat(getComputedStyle(card).getPropertyValue("--base-rotate")) || 0;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(700px) rotate(${base}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `rotate(${base}deg)`;
    });
  });

  // --- Interactive dot-field background ---
  const canvas = document.getElementById("bg-canvas");
  if (canvas && window.matchMedia("(min-width: 850px)").matches) {
    const ctx = canvas.getContext("2d");
    let w, h, dots = [];
    const spacing = 34;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      dots = [];
      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
          dots.push({ x, y });
        }
      }
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 150);
        const radius = 1.3 + influence * 3.2;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = influence > 0.05
          ? `rgba(245, 179, 1, ${0.3 + influence * 0.6})`
          : "rgba(217, 225, 242, 0.9)";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    draw();
  }
});