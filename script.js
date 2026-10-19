const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile menu
const btn = document.querySelector(".menu-btn");
const list = document.querySelector(".nav ul");
if (btn && list) {
  btn.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
}

// Live Ulaanbaatar clock
const clock = document.getElementById("clock");
if (clock) {
  const fmt = new Intl.DateTimeFormat("mn-MN", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Ulaanbaatar"
  });
  const tick = () => { clock.textContent = "Улаанбаатар " + fmt.format(new Date()); };
  tick();
  setInterval(tick, 10000);
}

// Duplicate marquee content for a seamless loop
const track = document.querySelector(".marquee div");
if (track) track.innerHTML += track.innerHTML;

// Terminal typing for the hero line
const role = document.querySelector(".hero-role");
if (role && !reduceMotion) {
  const full = role.textContent.trim();
  role.textContent = "";
  role.classList.add("typing");
  let i = 0;
  setTimeout(function type() {
    role.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(type, 38);
    else role.classList.remove("typing");
  }, 700);
}

// Terminal-style page transition
document.querySelectorAll("a[href$='.html']").forEach((a) => {
  a.addEventListener("click", (e) => {
    if (reduceMotion || e.metaKey || e.ctrlKey || a.target === "_blank") return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => { location.href = a.href; }, 200);
  });
});
window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

// Matrix digital rain
const canvas = document.createElement("canvas");
canvas.id = "rain";
canvas.setAttribute("aria-hidden", "true");
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");
const chars = "ｦｱｳｴｵｶｷｹｺｻｼｽｾﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ЗОНИ<>/{}=".split("");
const size = 16;
let drops = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * -50);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
resize();
window.addEventListener("resize", resize);

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = size + "px 'JetBrains Mono', monospace";
  for (let i = 0; i < drops.length; i++) {
    const ch = chars[Math.floor(Math.random() * chars.length)];
    const y = drops[i] * size;
    ctx.fillStyle = Math.random() > 0.97 ? "#d6ffe0" : "#00ff41";
    ctx.fillText(ch, i * size, y);
    if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i] += 0.5;
  }
}

if (reduceMotion) {
  for (let n = 0; n < 60; n++) draw();
} else {
  let last = 0;
  const loop = (t) => {
    if (!document.hidden && t - last > 45) { draw(); last = t; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
