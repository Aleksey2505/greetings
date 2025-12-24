const btn = document.getElementById("go");
const start = document.getElementById("start");
const music = document.getElementById("music");

btn.onclick = () => {
  start.remove();
  music.volume = 0;
  music.play();
  let v = 0;
  const fade = setInterval(() => {
    v += 0.01;
    music.volume = v;
    if (v >= 1) clearInterval(fade);
  }, 80);
  init();
};

let scene, camera, renderer;
let girl, note, snow = [];
let phase = 0;

function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 5, 20);

  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(2, 5, 3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x555555));

  createGirl();
  createNote();
  createSnow();

  animate();
}

function createGirl() {
  girl = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 1.4, 12),
    new THREE.MeshStandardMaterial({ color: 0x993366 })
  );
  body.position.y = 0.7;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffddcc })
  );
  head.position.y = 1.6;

  girl.add(body, head);
  scene.add(girl);
}

function createNote() {
  const tex = new THREE.TextureLoader().load("assets/note.png");
  note = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.6),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true })
  );
  note.position.set(0, 1.2, 0.6);
  note.scale.set(0.01, 0.01, 0.01);
  scene.add(note);
}

function createSnow() {
  for (let i = 0; i < 500; i++) {
    const flake = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    flake.position.set(
      (Math.random() - 0.5) * 10,
      Math.random() * 5,
      (Math.random() - 0.5) * 10
    );
    scene.add(flake);
    snow.push(flake);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // ФАЗЫ СЦЕНЫ
  if (phase === 0) {
    note.scale.lerp(new THREE.Vector3(1, 1, 1), 0.02);
    if (note.scale.x > 0.9) phase = 1;
  }

  if (phase === 1) {
    snow.forEach(f => {
      f.position.y -= 0.02;
      f.position.x += Math.sin(Date.now() * 0.001 + f.position.y) * 0.01;
      if (f.position.y < -1) f.position.y = 5;
    });
    camera.position.z -= 0.003;
    if (camera.position.z < 3) phase = 2;
  }

  if (phase === 2) {
    // снежная буря
    snow.forEach(f => {
      f.position.x += (Math.random() - 0.5) * 0.1;
      f.position.y += (Math.random() - 0.5) * 0.1;
    });
    camera.rotation.z += 0.001;
  }

  renderer.render(scene, camera);
}
