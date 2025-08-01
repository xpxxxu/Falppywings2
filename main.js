// === Bird Size & Physics Improvements ===
bird.width = 32; // Smaller bird
bird.height = 24;
bird.gravity = 0.5; // Smoother fall
bird.jumpForce = -9; // Less powerful flap
bird.wingSpeed = 0.35; // Faster animation

// === Resize Canvas to Support 4K & High-DPI ===
function resizeCanvas() {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

// === Performance-Tuned Game Update ===
// === Performance-Tuned Game Update ===
function update(dt) {
  const timeScale = Math.min(dt / 16.67, 1.5); // تثبيت التسارع بقيمة منطقية

  // تغيير الخلفية حسب النقاط
  if (Math.floor(score / THEME_CHANGE_SCORE) !== themeIndex) {
    themeIndex = Math.floor(score / THEME_CHANGE_SCORE) % THEMES.length;
    initClouds();
    initHills();
  }

  if (gameState === 'ready') {
    bird.velY = 0;
    bird.rotation = 0;
    bird.wingFrame += bird.wingSpeed * timeScale;
    return;
  }

  if (gameState !== 'playing') return;

  frames++;
  groundOffset -= pipeSpeed * timeScale;
  bird.velY += bird.gravity * timeScale;
  bird.y += bird.velY * timeScale;
  bird.rotation = Math.min(Math.max(bird.velY * 0.08, -0.6), 1);
  bird.wingFrame += bird.wingSpeed * timeScale;

  // تحريك الأنابيب
  for (let i = pipes.length; i-- > 0;) {
    const p = pipes[i];
    p.x -= pipeSpeed * timeScale;

    if (!p.passed && p.x + pipeWidth < bird.x) {
      p.passed = true;
      p.highlight = true;
      score++;
      updateScore();
      playScoreSound();
      setTimeout(() => p.highlight = false, 150);
    }

    if (p.x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }

  // إضافة أنابيب جديدة
  pipeAddTimer += dt;
  if (pipeAddTimer >= PIPE_ADD_INTERVAL) {
    addPipe();
    pipeAddTimer = 0;
  }

  // تحريك السحب (تعديل السرعة هنا)
  for (let i = clouds.length; i-- > 0;) {
    const c = clouds[i];
    c.x -= c.speed * (0.4 + c.layer * 0.05) * timeScale; // تم تقليل السرعة

    if (c.x + c.radius < 0) {
      c.x = canvas.width + c.radius;
      c.y = randRange(40, 160);
      c.radius = randRange(30, 80);
      c.speed = randRange(0.18, 0.6);
      c.layer = Math.floor(randRange(0, 4));
      c.type = Math.floor(randRange(0, 3));
    }
  }

  checkCollisions();
}
