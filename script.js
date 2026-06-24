const canvas = document.getElementById("cyber-canvas");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticles() {
  const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    radius: Math.random() * 1.7 + 0.6,
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
    ctx.fillStyle = "rgba(0, 245, 255, 0.7)";
    ctx.fill();

    for (let j = index + 1; j < particles.length; j++) {
      const other = particles[j];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 130) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(39, 255, 154, ${1 - distance / 130})`;
        ctx.lineWidth = 0.35;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.background = `
      radial-gradient(circle at ${x}px ${y}px, rgba(0, 245, 255, 0.16), transparent 34%),
      linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.82))
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.background = `
      linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.78)),
      radial-gradient(circle at 20% 0%, rgba(0, 245, 255, 0.08), transparent 28%)
    `;
  });
});

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
drawParticles();