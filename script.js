// ===========================
// LOADER
// ===========================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    startAnimations();
  }, 1800);
});

function startAnimations() {
  initTyping();
  initSkillBars();
  revealOnScroll();
}

// ===========================
// CUSTOM CURSOR
// ===========================
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
    cursorDot.style.background = 'var(--purple)';
    cursorDot.style.boxShadow = '0 0 15px var(--purple)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorDot.style.background = 'var(--cyan)';
    cursorDot.style.boxShadow = '0 0 10px var(--cyan), 0 0 20px var(--cyan)';
  });
});

// ===========================
// PARTICLE CANVAS
// ===========================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    const colors = ['0, 245, 255', '191, 0, 255', '255, 45, 120'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.03 + 0.01;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.twinkle += this.twinkleSpeed;
    this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.twinkle));
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.currentOpacity;
    ctx.fillStyle = `rgb(${this.color})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${this.color}, 0.8)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = 0.03 * (1 - dist / 100);
        ctx.strokeStyle = `rgb(0, 245, 255)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===========================
// NAVBAR
// ===========================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 300);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// ===========================
// TYPING ANIMATION
// ===========================
function initTyping() {
  const roles = [
    'Python Developer',
    'Web Developer',
    'Creative Designer',
    'AI Enthusiast',
    'Problem Solver'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const el = document.getElementById('typingText');

  function type() {
    const currentRole = roles[roleIdx];
    if (!deleting) {
      el.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentRole.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

// ===========================
// SKILL BARS
// ===========================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => observer.observe(bar));
}

// ===========================
// SCROLL REVEAL
// ===========================
function revealOnScroll() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  // Stagger siblings
  const groups = {};
  revealEls.forEach(el => {
    const parent = el.parentElement;
    const key = parent ? parent.className : 'root';
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });
  Object.values(groups).forEach(group => {
    group.forEach((el, i) => { el.dataset.delay = i * 80; });
  });

  revealEls.forEach(el => observer.observe(el));
}

// ===========================
// GITHUB API
// ===========================
async function fetchGitHubData() {
  try {
    const res = await fetch('https://api.github.com/users/shreyamishra-maker');
    if (!res.ok) return;
    const data = await res.json();
    animateNumber('ghRepos', data.public_repos || 0);
    animateNumber('ghFollowers', data.followers || 0);
    animateNumber('ghFollowing', data.following || 0);
  } catch (e) {
    // silently fail — static fallback shown
  }
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 50);
}

fetchGitHubData();

// ===========================
// CONTACT FORM
// ===========================
function sendMessage() {
  const name = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const msg = document.getElementById('formMsg').value.trim();
  const feedback = document.getElementById('formFeedback');
  const btn = document.getElementById('sendBtn');

  feedback.className = 'form-feedback';
  feedback.textContent = '';

  if (!name || !email || !msg) {
    feedback.className = 'form-feedback error';
    feedback.textContent = '⚠ Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.className = 'form-feedback error';
    feedback.textContent = '⚠ Please enter a valid email.';
    return;
  }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    feedback.className = 'form-feedback success';
    feedback.textContent = '✓ Message sent! Shreya will get back to you soon.';
    document.getElementById('formName').value = '';
    document.getElementById('formEmail').value = '';
    document.getElementById('formMsg').value = '';
    setTimeout(() => { feedback.textContent = ''; }, 5000);
  }, 1500);
}

// ===========================
// BACK TO TOP
// ===========================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================
// PROJECT CARD MOUSE GLOW
// ===========================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,245,255,0.08) 0%, transparent 60%)`;
    }
  });
});

// ===========================
// SCAN LINES EFFECT
// ===========================
const scanStyle = document.createElement('style');
scanStyle.textContent = `
  body::after {
    content: '';
    position: fixed; inset: 0; z-index: 9000;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 245, 255, 0.008) 2px,
      rgba(0, 245, 255, 0.008) 4px
    );
    animation: scanMove 8s linear infinite;
  }
  @keyframes scanMove { from{background-position:0 0} to{background-position:0 100px} }
`;
document.head.appendChild(scanStyle);

// ===========================
// CODE WINDOW HOVER EFFECT
// ===========================
const codeWin = document.querySelector('.code-window');
if (codeWin) {
  codeWin.addEventListener('mousemove', (e) => {
    const rect = codeWin.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    codeWin.style.transform = `perspective(1000px) rotateY(${xPct * 6}deg) rotateX(${-yPct * 4}deg)`;
  });
  codeWin.addEventListener('mouseleave', () => {
    codeWin.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
  });
}

// Smooth code window float
let floatDir = 1, floatPos = 0;
function floatCode() {
  floatPos += 0.008 * floatDir;
  if (floatPos > 1 || floatPos < 0) floatDir *= -1;
  if (codeWin && !codeWin.matches(':hover')) {
    codeWin.style.transform = `translateY(${floatPos * 12 - 6}px)`;
  }
  requestAnimationFrame(floatCode);
}
floatCode();
