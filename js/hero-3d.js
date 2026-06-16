/**
 * Three.js Hero — Molecular Particle Field
 * Lightweight particle system with DNA-helix inspired motion.
 * Performance budget: <2ms per frame on mid-range hardware.
 */
(function () {
  'use strict';

  var container = document.getElementById('heroCanvas');
  if (!container || typeof THREE === 'undefined') return;

  // Detect low-power devices
  var isMobile = window.innerWidth < 768;
  var PARTICLE_COUNT = isMobile ? 600 : 1400;
  var HELIX_POINTS = isMobile ? 40 : 80;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 30;

  var renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // --- Floating particles ---
  var particlesGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var velocities = new Float32Array(PARTICLE_COUNT * 3);

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = (Math.random() - 0.5) * 40;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;
    velocities[i3] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  var particleMat = new THREE.PointsMaterial({
    color: 0x00c896,
    size: isMobile ? 0.08 : 0.06,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    depthWrite: false
  });

  var particles = new THREE.Points(particlesGeo, particleMat);
  scene.add(particles);

  // --- DNA helix ---
  var helixGeo = new THREE.BufferGeometry();
  var helixPos = new Float32Array(HELIX_POINTS * 2 * 3);
  var RADIUS = 4;
  var HEIGHT = 28;

  for (var j = 0; j < HELIX_POINTS; j++) {
    var t = j / HELIX_POINTS;
    var angle = t * Math.PI * 4;
    var y = (t - 0.5) * HEIGHT;

    // Strand 1
    var j6 = j * 6;
    helixPos[j6] = Math.cos(angle) * RADIUS;
    helixPos[j6 + 1] = y;
    helixPos[j6 + 2] = Math.sin(angle) * RADIUS;

    // Strand 2
    helixPos[j6 + 3] = Math.cos(angle + Math.PI) * RADIUS;
    helixPos[j6 + 4] = y;
    helixPos[j6 + 5] = Math.sin(angle + Math.PI) * RADIUS;
  }

  helixGeo.setAttribute('position', new THREE.BufferAttribute(helixPos, 3));

  var helixMat = new THREE.PointsMaterial({
    color: 0x00c896,
    size: isMobile ? 0.2 : 0.15,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false
  });

  var helix = new THREE.Points(helixGeo, helixMat);
  helix.position.x = 12;
  helix.position.z = -5;
  scene.add(helix);

  // --- Connection lines between helix strands ---
  var lineGeo = new THREE.BufferGeometry();
  var linePositions = [];
  for (var k = 0; k < HELIX_POINTS; k += 4) {
    var k6 = k * 6;
    linePositions.push(
      helixPos[k6], helixPos[k6 + 1], helixPos[k6 + 2],
      helixPos[k6 + 3], helixPos[k6 + 4], helixPos[k6 + 5]
    );
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  var lineMat = new THREE.LineBasicMaterial({
    color: 0x00c896,
    transparent: true,
    opacity: 0.12,
    depthWrite: false
  });
  var lines = new THREE.LineSegments(lineGeo, lineMat);
  lines.position.copy(helix.position);
  scene.add(lines);

  // --- Mouse interaction ---
  var mouse = { x: 0, y: 0, target: { x: 0, y: 0 } };

  document.addEventListener('mousemove', function (e) {
    mouse.target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // --- Animation loop ---
  var clock = new THREE.Clock();
  var isVisible = true;

  // Pause when offscreen
  var observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(container);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    var elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (mouse.target.x - mouse.x) * 0.05;
    mouse.y += (mouse.target.y - mouse.y) * 0.05;

    // Rotate helix
    helix.rotation.y = elapsed * 0.15 + mouse.x * 0.3;
    helix.rotation.x = Math.sin(elapsed * 0.1) * 0.1 + mouse.y * 0.15;
    lines.rotation.copy(helix.rotation);

    // Drift particles
    var posArr = particlesGeo.attributes.position.array;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var i3 = i * 3;
      posArr[i3] += velocities[i3];
      posArr[i3 + 1] += velocities[i3 + 1];
      posArr[i3 + 2] += velocities[i3 + 2];

      // Wrap around
      if (posArr[i3] > 30) posArr[i3] = -30;
      if (posArr[i3] < -30) posArr[i3] = 30;
      if (posArr[i3 + 1] > 20) posArr[i3 + 1] = -20;
      if (posArr[i3 + 1] < -20) posArr[i3 + 1] = 20;
    }
    particlesGeo.attributes.position.needsUpdate = true;

    // Camera subtle movement
    camera.position.x = mouse.x * 1.5;
    camera.position.y = mouse.y * 0.8;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // --- Resize ---
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }, 150);
  }, { passive: true });
})();
