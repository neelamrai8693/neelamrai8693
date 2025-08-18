// Theme toggle with localStorage
const themeBtn = document.getElementById('themeToggle');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const saved = localStorage.getItem('theme');
if ((saved === 'light') || (!saved && prefersLight)) document.body.classList.add('light');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// Active link highlighting
const links = [...document.querySelectorAll('.nav a')].filter(a => a.hash);
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
sections.forEach(s => obs.observe(s));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// === Projects: edit me ===
// Put your images in /assets and update the file names below
const projects = [
  {
    title: "Identification of Age Groups from HRV using CNN",
    description:
      "Built a CNN to classify HRV by converting interbeat interval (IBI) data into images. Improved detection of subtle cardiovascular patterns.",
    skills: ["CNN", "Python", "Data Preprocessing", "Visualization", "Data Augmentation"],
    img: "assets/hrv-cnn.jpg",         // <-- your screenshot  
    demo: "#"  // or "#"
  },
  {
    title: "Reinforcement Learning – Reacher Environment",
    description:
      "Trained RL agents (DQN, Actor-Critic, REINFORCE) to control a two-joint robotic arm to reach random targets while minimizing control cost.",
    skills: ["Reinforcement Learning", "Algorithm Implementation", "Hyperparameter Tuning", "Performance Analysis"],
    img: "assets/rl-reacher.jpg",
    demo: "#"
  },
  {
    title: "K-means Cluster Analysis – Amazon Reviews",
    description:
      "Uncovered patterns and segments in the Amazon Fine Food Reviews dataset to inform recommendations using K-means clustering.",
    skills: ["K-means", "Feature Selection", "Data Preprocessing", "Data Visualization"],
    img: "assets/amazon-kmeans.jpg",
    demo: "#"
  },
  {
    title: "BLEVE Pressure Prediction",
    description:
      "Neural-network model to predict target pressure; focused on preprocessing, model selection, and tuning for accuracy and interpretability.",
    skills: ["Neural Networks", "Model Evaluation", "Hyperparameter Tuning", "Data Preprocessing"],
    img: "assets/bleve-pressure.jpg",
    demo: "#"
  }
];

// === Render project cards ===
const projectGrid = document.getElementById("projectGrid");

projects.forEach(p => {
  const card = document.createElement("article");
  card.className = "card shadow";

  const skills = p.skills?.map(s => `<span class="tag">${s}</span>`).join("") || "";

  card.innerHTML = `
    ${p.img ? `<img class="project-img" src="${p.img}" alt="${p.title}">` : ""}
    <h3 style="margin:.8rem 0 .3rem">${p.title}</h3>
    <p class="muted" style="margin:.2rem 0 .6rem">${p.description}</p>
    <div class="skill-tags" style="margin-bottom:.8rem">${skills}</div>
    <div class="project-links" style="display:flex;gap:.6rem;flex-wrap:wrap">
      ${p.code && p.code !== "#" ? `<a class="btn small" href="${p.code}" target="_blank" rel="noopener">View Code</a>` : ""}
      ${p.demo && p.demo !== "#" ? `<a class="btn-outline small" href="${p.demo}" target="_blank" rel="noopener">Live Demo</a>` : ""}
    </div>
  `;
  projectGrid.appendChild(card);
});

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
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';
  setError('name'); setError('email'); setError('message');
  const data = Object.fromEntries(new FormData(form).entries());
  let hasError = false;
  if (!data.name || data.name.trim().length < 2) { setError('name', 'Please enter your name.'); hasError = true; }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) { setError('email', 'Enter a valid email address.'); hasError = true; }
  if (!data.message || data.message.trim().length < 10) { setError('message', 'Message should be at least 10 characters.'); hasError = true; }
  if (hasError) return;
  statusEl.textContent = 'Sending...';
  await new Promise(r => setTimeout(r, 800));
  statusEl.textContent = 'Message sent! I will reply soon.';
  form.reset();
});
