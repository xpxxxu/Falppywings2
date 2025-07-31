<script>
// === Apply Physics & Bird Size Fix ===
bird.width = 32; // smaller bird
bird.height = 24;
bird.gravity = 0.5; // lighter gravity for smoother play
bird.jumpForce = -9; // reduced flap strength to match smaller size
bird.wingSpeed = 0.35; // faster wing speed for smaller bird

// === Performance Improvements ===
function update(dt){
  const timeScale = dt / 16.67;
  if (Math.floor(score / THEME_CHANGE_SCORE) !== themeIndex) {
    themeIndex = Math.floor(score / THEME_CHANGE_SCORE) % THEMES.length;
    initClouds(); initHills();
  }
  if (gameState === 'ready') {
    bird.velY = 0; bird.rotation = 0; bird.wingFrame += bird.wingSpeed * timeScale;
    return;
  }
  if (gameState !== 'playing') return;
  frames++;
  groundOffset -= pipeSpeed * timeScale;
  bird.velY += bird.gravity * timeScale;
  bird.y += bird.velY * timeScale;
  bird.rotation = Math.min(Math.max(bird.velY * 0.08, -0.6), 1);
  bird.wingFrame += bird.wingSpeed * timeScale;

  // Use `for` in reverse with splice optimization
  for (let i = pipes.length; i-- > 0;) {
    const p = pipes[i];
    p.x -= pipeSpeed * timeScale;
    if (!p.passed && p.x + pipeWidth < bird.x) {
      p.passed = true; p.highlight = true;
      score++; updateScore(); playScoreSound();
      setTimeout(() => p.highlight = false, 150);
    }
    if (p.x + pipeWidth < 0) pipes.splice(i, 1);
  }

  pipeAddTimer += dt;
  if (pipeAddTimer >= PIPE_ADD_INTERVAL) {
    addPipe(); pipeAddTimer = 0;
  }

  for (let i = clouds.length; i-- > 0;) {
    const c = clouds[i];
    c.x -= c.speed * (0.7 + c.layer * 0.15) * timeScale;
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
</script>
