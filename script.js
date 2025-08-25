// ===== Theme toggle with localStorage =====
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const saved = localStorage.getItem('theme');
if ((saved === 'light') || (!saved && prefersLight)) {
  document.body.classList.add('light');
}

function setupThemeToggle(btnId){
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
}

// Initialize both theme buttons
setupThemeToggle('themeToggleDesktop');
setupThemeToggle('themeToggleMobile');


/* ===== Mobile overlay menu (single source of truth) ===== */
const menuToggleBtn = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('.nav-link') : [];

function openMenu() {
  if (!mobileMenu) return;
  mobileMenu.hidden = false;
  mobileMenu.classList.add('open');
  if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  // allow transition to finish before hiding (so it doesn't "stick")
  setTimeout(() => { if (!mobileMenu.classList.contains('open')) mobileMenu.hidden = true; }, 180);
}

if (menuToggleBtn && mobileMenu) {
  menuToggleBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // 1) close when a nav link is tapped
  menuLinks.forEach(a => a.addEventListener('click', closeMenu));

  // 2) close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('open')) return;
    const clickedInside = mobileMenu.contains(e.target) || menuToggleBtn.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  // 3) close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  // 4) close on scroll (mobile UX nicety)
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!mobileMenu.classList.contains('open')) return;
    const dy = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;
    if (dy > 10) closeMenu();
  }, { passive: true });
}


/* ===== Active link highlighting (desktop + mobile) ===== */
const navLinks = [...document.querySelectorAll('a[href^="#"]')].filter(a => a.hash);
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if (sections.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => obs.observe(s));
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Multilingual "Hello" rotator
const helloRotator = document.getElementById('helloRotator');
if (helloRotator) {
  const hellos = [
    "Hello!", "नमस्ते!", "こんにちは!", "안녕하세요!", "Hola!",
    "Bonjour!", "Ciao!", "Guten Tag!", "Olá!", "Привет!",
    "مرحبا!", "你好!", "สวัสดี!", "Kia ora!", "Salut!"
  ];
  let i = 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showHello() {
    helloRotator.classList.remove('hello-fade-in');
    // small reflow to restart animation
    void helloRotator.offsetWidth;
    helloRotator.textContent = hellos[i % hellos.length];
    helloRotator.classList.add('hello-fade-in');
    i++;
  }
  showHello();
  setInterval(showHello, prefersReduced ? 4000 : 2200);
}

// Skill categories
const skillCategories = {
  "Analytical Tools": ["Power BI","R","SQL","Excel"],
  "Programming Languages": ["Python","R","SQL"],
  "Technologies & Frameworks": [
    "TensorFlow / Keras","PyTorch","Scikit-learn",
    "Matplotlib / Seaborn","MobileNetV2","t-SNE"
  ],
  "Environments & Platforms": ["Jupyter Notebook","VS Code","Google Colab"]
};

// Render skills by category
const tagWrap = document.getElementById('skillTags');
if (tagWrap) {
  for (const [category, skills] of Object.entries(skillCategories)) {
    const group = document.createElement('div');
    group.className = "skill-group card shadow";
    const title = document.createElement('h3');
    title.textContent = category;
    group.appendChild(title);

    const tags = document.createElement('div');
    tags.className = "skill-tags";
    skills.forEach(s => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = s;
      tags.appendChild(span);
    });

    group.appendChild(tags);
    tagWrap.appendChild(group);
  }
}

// Starfield
(function(){
  const c = document.getElementById('stars');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w, h, stars = [];

  function resize(){
    const dpr = window.devicePixelRatio || 1;
    w = c.width = Math.floor(window.innerWidth * dpr);
    h = c.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
    const count = Math.min(160, Math.floor((window.innerWidth*window.innerHeight)/12000));
    stars = Array.from({length: count}, () => ({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      r: Math.random()*1.2 + 0.2,
      a: Math.random()*0.8 + 0.2,
      tw: (Math.random()*0.8 + 0.2) * (Math.random() < .5 ? 1 : -1),
      hue: [270, 190, 320][Math.floor(Math.random()*3)]
    }));
  }

  function tick(){
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    for(const s of stars){
      s.a += s.tw * 0.01;
      if (s.a < 0.2 || s.a > 1) s.tw *= -1;
      ctx.globalAlpha = s.a;
      ctx.fillStyle = `hsl(${s.hue} 90% 70%)`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  tick();
})();

// Contact form validation (demo)
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
function setError(name, msg) {
  const el = document.querySelector(`.error[data-for="${name}"]`);
  if (el) el.textContent = msg || '';
}
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (statusEl) statusEl.textContent = '';
    setError('name'); setError('email'); setError('message');
    const data = Object.fromEntries(new FormData(form).entries());
    let hasError = false;
    if (!data.name || data.name.trim().length < 2) { setError('name', 'Please enter your name.'); hasError = true; }
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) { setError('email', 'Enter a valid email address.'); hasError = true; }
    if (!data.message || data.message.trim().length < 10) { setError('message', 'Message should be at least 10 characters.'); hasError = true; }
    if (hasError) return;
    if (statusEl) statusEl.textContent = 'Sending...';
    await new Promise(r => setTimeout(r, 800));
    if (statusEl) statusEl.textContent = 'Message sent! I will reply soon.';
    form.reset();
  });
}

// === Projects (single source of truth) ===
const projects = [
  {
    slug: "hrv-cnn",
    title: "Identification of Age Groups from HRV using CNN",
    description:
      "Built a CNN to classify HRV by converting interbeat interval (IBI) data into images. Improved detection of subtle cardiovascular patterns.",
    skills: ["CNN", "Python", "Data Preprocessing", "Visualization", "Data Augmentation"],
    img: "assets/hrv-cnn.jpg",
    code: "#",
    demo: "#"
  },
  {
    slug: "rl-reacher",
    title: "Reinforcement Learning – Reacher Environment",
    description:
      "Trained RL agents (DQN, Actor-Critic, REINFORCE) to control a two-joint robotic arm to reach random targets while minimizing control cost.",
    skills: ["Reinforcement Learning", "Algorithm Implementation", "Hyperparameter Tuning", "Performance Analysis"],
    img: "assets/rl-reacher.png",
    code: "#",
    demo: "#"
  },
  {
    slug: "amazon-kmeans",
    title: "K-means Cluster Analysis – Amazon Reviews",
    description:
      "Uncovered patterns and segments in the Amazon Fine Food Reviews dataset to inform recommendations using K-means clustering.",
    skills: ["K-means", "Feature Selection", "Data Preprocessing", "Data Visualization"],
    img: "assets/amazon-kmeans.jpg",
    code: "#",
    demo: "#"
  },
  {
    slug: "bleve-pressure",
    title: "BLEVE Pressure Prediction",
    description:
      "Neural-network model to predict target pressure; focused on preprocessing, model selection, and tuning for accuracy and interpretability.",
    skills: ["Neural Networks", "Model Evaluation", "Hyperparameter Tuning", "Data Preprocessing"],
    img: "assets/bleve-pressure.png",
    code: "#",
    demo: "#"
  }
];

// === Render project cards (ONE TIME) ===
const projectGrid = document.getElementById("projectGrid");
if (projectGrid) {
  projects.forEach(p => {
    const card = document.createElement("article");
    card.className = "project-card card shadow";

    const skills = (p.skills || []).map(s => `<span class="tag">${s}</span>`).join("");

    card.innerHTML = `
      ${p.img ? `<img class="project-img" src="${p.img}" alt="${p.title}">` : ""}
      <h3 style="margin:.8rem 0 .3rem">${p.title}</h3>
      <p class="muted" style="margin:.2rem 0 .6rem">${p.description}</p>
      <div class="skill-tags" style="margin-bottom:.8rem">${skills}</div>
      <div class="project-links" style="display:flex;gap:.6rem;flex-wrap:wrap">
        ${p.code && p.code !== "#" ? `<a class="btn small" href="${p.code}" target="_blank" rel="noopener">View Code</a>` : ""}
        ${p.demo && p.demo !== "#" ? `<a class="btn-outline small" href="${p.demo}" target="_blank" rel="noopener">Live Demo</a>` : ""}
        <a class="btn small" href="project.html?slug=${p.slug}">Learn More</a>
      </div>
    `;
    projectGrid.appendChild(card);
  });
}
