const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const scene = document.getElementById("scene");
const music = document.getElementById("music");

startBtn.onclick = () => {
  startScreen.style.display = "none";
  scene.style.opacity = 1;
  music.volume = 0;
  music.play();

  let v = 0;
  const fade = setInterval(() => {
    v += 0.01;
    music.volume = v;
    if (v >= 1) clearInterval(fade);
  }, 100);

  startSnow();
};

const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let snowflakes = [];

function startSnow() {
  for (let i = 0; i < 300; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      s: Math.random() * 1 + 0.5,
      a: Math.random() * Math.PI * 2
    });
  }
  animateSnow();
}

function animateSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snowflakes.forEach(f => {
    f.y += f.s;
    f.x += Math.sin(f.a) * 0.5;
    f.a += 0.01;
    if (f.y > canvas.height) f.y = 0;

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();
  });
  requestAnimationFrame(animateSnow);
}
