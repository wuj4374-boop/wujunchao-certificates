const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/35770/Desktop/证明';
const files = fs.readdirSync(dir).filter(f => /\.jpe?g$/i.test(f));

// Image labels
const labels = [
  { title: '2024-2025', desc: '”三好学生”证书' },
  { title: '2024-2025', desc: '”校二等优秀奖学金”证书' },
  { title: '2024年6月', desc: '普通话水平测试等级证书' },
  { title: '2025年9月岳麓山桔子洲', desc: '”优秀志愿者”证书' },
  { title: '2024年12月', desc: '”国家励志奖学金”证书' },
  { title: '2025年9月', desc: '”市级优秀志愿者”证书' },
  { title: '2026年4月', desc: '”2026年度实习优秀学生”称号' },
  { title: '其他材料', desc: '志愿时长补充证明材料' },
];

// Generate image cards
const imageCards = files.map((f, i) => {
  const label = labels[i] || { title: `材料 ${i+1}`, desc: '证明材料' };
  return `
    <div class="gallery-item">
      <div class="image-wrapper">
        <img src="${encodeURIComponent(f)}" alt="${label.title}" loading="lazy" onclick="openLightbox(${i})">
        <div class="image-overlay">
          <span class="overlay-icon">🔍</span>
        </div>
      </div>
      <div class="image-info">
        <h3>${label.title}</h3>
        <p>${label.desc}</p>
      </div>
    </div>`;
}).join('\n');

// Lightbox image sources
const lbImages = files.map(f => `"${encodeURIComponent(f)}"`).join(',\n');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>欢迎来到吴俊超的材料证明小屋</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --primary: #8B4513;
  --primary-light: #D2691E;
  --gold: #D4A853;
  --gold-light: #F5E6C8;
  --bg: #FFF8F0;
  --card-bg: #FFFFFF;
  --text: #3C2415;
  --text-light: #7A5A3E;
  --shadow: rgba(139, 69, 19, 0.15);
}

body {
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.5s ease;
}
body.loaded { opacity: 1; }

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--gold-light); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary-light); }

/* Header */
header {
  background: linear-gradient(135deg, #8B4513 0%, #D2691E 40%, #D4A853 100%);
  padding: 60px 20px 50px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

header h1 {
  font-size: 2.5em;
  color: #FFF;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
  margin-bottom: 12px;
  letter-spacing: 4px;
  position: relative;
}

header .subtitle {
  color: var(--gold-light);
  font-size: 1.1em;
  letter-spacing: 6px;
  position: relative;
}

header .header-decoration {
  width: 80px;
  height: 3px;
  background: var(--gold);
  margin: 20px auto;
  border-radius: 2px;
  position: relative;
}

/* Loading animation */
.loading-bar {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold), var(--primary-light), var(--gold));
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 10000;
  transition: width 0.3s ease;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Main content */
main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 20px;
}

.section-intro {
  text-align: center;
  margin-bottom: 50px;
}

.section-intro h2 {
  font-size: 1.6em;
  color: var(--primary);
  margin-bottom: 10px;
}

.section-intro p {
  color: var(--text-light);
  font-size: 1em;
}

/* Gallery Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.gallery-item {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  opacity: 0;
  transform: translateY(30px);
}

.gallery-item.visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(139, 69, 19, 0.25);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%;
  overflow: hidden;
  background: #f5f0eb;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .image-wrapper img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(60, 36, 21, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 2em;
  color: #fff;
  background: rgba(255,255,255,0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.image-info {
  padding: 18px 20px;
}

.image-info h3 {
  font-size: 1.1em;
  color: var(--primary);
  margin-bottom: 4px;
}

.image-info p {
  font-size: 0.85em;
  color: var(--text-light);
}

/* Lightbox */
.lightbox {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.92);
  z-index: 9999;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.lightbox.active {
  display: flex;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  animation: lightboxIn 0.3s ease;
}

@keyframes lightboxIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 40px;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  background: none;
  border: none;
  font-family: inherit;
  z-index: 10;
}

.lightbox-close:hover { opacity: 1; }

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 50px;
  color: #fff;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
  background: none;
  border: none;
  padding: 20px;
  font-family: inherit;
  z-index: 10;
}

.lightbox-nav:hover { opacity: 1; }
.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

.lightbox-counter {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.9em;
  opacity: 0.8;
  background: rgba(0,0,0,0.5);
  padding: 6px 16px;
  border-radius: 20px;
  z-index: 10;
}

/* Footer */
footer {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-light);
  font-size: 0.85em;
  border-top: 1px solid var(--gold-light);
  margin-top: 20px;
}

.footer-decoration {
  width: 40px;
  height: 2px;
  background: var(--gold);
  margin: 0 auto 15px;
  border-radius: 1px;
}

/* Particle decorations */
.particle {
  position: fixed;
  pointer-events: none;
  opacity: 0.08;
  font-size: 20px;
  animation: float 20s infinite linear;
  z-index: 0;
}

@keyframes float {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.08; }
  90% { opacity: 0.08; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}

/* Responsive */
@media (max-width: 768px) {
  header h1 { font-size: 1.6em; letter-spacing: 2px; }
  header .subtitle { font-size: 0.9em; letter-spacing: 3px; }
  header { padding: 40px 15px 35px; }
  .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
  main { padding: 30px 15px; }
  .lightbox-nav { font-size: 30px; }
  .lightbox-prev { left: 10px; }
  .lightbox-next { right: 10px; }
}

@media (max-width: 480px) {
  header h1 { font-size: 1.3em; }
  .gallery-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<div class="loading-bar" id="loadingBar" style="width:0%"></div>

<!-- Floating particles -->
<div class="particle" style="left:5%;animation-delay:0s;">✦</div>
<div class="particle" style="left:15%;animation-delay:3s;">✧</div>
<div class="particle" style="left:25%;animation-delay:6s;">✦</div>
<div class="particle" style="left:40%;animation-delay:2s;">✧</div>
<div class="particle" style="left:55%;animation-delay:8s;">✦</div>
<div class="particle" style="left:70%;animation-delay:4s;">✧</div>
<div class="particle" style="left:85%;animation-delay:7s;">✦</div>
<div class="particle" style="left:95%;animation-delay:1s;">✧</div>

<header>
  <h1>🏠 欢迎来到吴俊超的材料证明小屋</h1>
  <div class="header-decoration"></div>
  <p class="subtitle">— 诚信 · 真实 · 可靠 —</p>
</header>

<main>
  <div class="section-intro">
    <h2>📋 个人证明材料总览</h2>
    <p>共 ${files.length} 份材料 &nbsp;·&nbsp; 点击图片查看高清大图</p>
  </div>
  <div class="gallery-grid">
    ${imageCards}
  </div>
</main>

<footer>
  <div class="footer-decoration"></div>
  <p>© ${new Date().getFullYear()} 吴俊超 &mdash; 材料证明小屋 | 所有材料真实有效</p>
</footer>

<!-- Lightbox -->
<div class="lightbox" id="lightbox" onclick="closeLightbox(event)">
  <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
  <button class="lightbox-nav lightbox-prev" onclick="changeImage(-1)">&#8249;</button>
  <img class="lightbox-content" id="lightbox-img" alt="">
  <button class="lightbox-nav lightbox-next" onclick="changeImage(1)">&#8250;</button>
  <div class="lightbox-counter" id="lightbox-counter"></div>
</div>

<script>
const images = [
  ${lbImages}
];

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = images[currentIndex];
  document.getElementById('lightbox-counter').textContent = (currentIndex + 1) + ' / ' + images.length;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function changeImage(dir) {
  currentIndex = (currentIndex + dir + images.length) % images.length;
  const img = document.getElementById('lightbox-img');
  img.src = images[currentIndex];
  document.getElementById('lightbox-counter').textContent = (currentIndex + 1) + ' / ' + images.length;
}

document.addEventListener('keydown', function(e) {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeImage(-1);
  if (e.key === 'ArrowRight') changeImage(1);
});

// Loading bar and scroll animations
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  const bar = document.getElementById('loadingBar');
  bar.style.width = '100%';
  setTimeout(() => { bar.style.opacity = '0'; }, 500);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
</script>

</body>
</html>`;

const outPath = path.join(dir, 'index.html');
fs.writeFileSync(outPath, html, 'utf-8');
const stats = fs.statSync(outPath);
console.log(`Generated: ${outPath}`);
console.log(`Size: ${(stats.size / 1024).toFixed(1)}KB`);
