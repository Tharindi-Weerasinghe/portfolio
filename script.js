const canvas = document.getElementById("cyber-canvas");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];
let animationFrame;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticles() {
  const density = window.innerWidth < 768 ? 28000 : 19000;
  const count = Math.floor((window.innerWidth * window.innerHeight) / density);

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    radius: Math.random() * 1.6 + 0.45,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 234, 255, 0.62)";
    ctx.fill();

    for (let j = index + 1; j < particles.length; j++) {
      const other = particles[j];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 125) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(47, 255, 173, ${0.75 - distance / 170})`;
        ctx.lineWidth = 0.32;
        ctx.stroke();
      }
    }
  });

  animationFrame = requestAnimationFrame(drawParticles);
}

function addCardGlow() {
  const cards = document.querySelectorAll(".liquid-card, .project-card, .ops-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

function addRevealAnimation() {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );

  items.forEach((item) => observer.observe(item));
}

function addActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  createParticles();
  drawParticles();
});

resizeCanvas();
createParticles();
drawParticles();
addCardGlow();
addRevealAnimation();
addActiveNavigation();