import { stage1Data } from './stages/stage1.js';
import { stage2Data } from './stages/stage2.js';
import { stage3Data } from './stages/stage3.js';
import { stage4Data } from './stages/stage4.js';
import { stage5Data } from './stages/stage5.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GRAVITY = 0.42;
const START_X = 120;
const START_Y = 340;

const stageBgm = new Audio('audio/stage.mp3');
stageBgm.loop = true;
stageBgm.volume = 0.35;

let powerUpsCollected = 0;
let goalTimer = 0;

function playJumpSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(700, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    1000,
    audioCtx.currentTime + 0.08
  );

  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.1
  );

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playCoinSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';

  osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    1600,
    audioCtx.currentTime + 0.05
  );

  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.08
  );

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function playStompSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'square';

  osc.frequency.setValueAtTime(250, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    80,
    audioCtx.currentTime + 0.12
  );

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.12
  );

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
}

function playDamageSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';

  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    120,
    audioCtx.currentTime + 0.3
  );

  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.3
  );

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

function startStageBgm() {
  stageBgm.play().catch(() => {});
}

function stopStageBgm() {
  stageBgm.pause();
  stageBgm.currentTime = 0;
}

function playPowerUpSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const notes = [523, 659, 784, 1046];

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const start = audioCtx.currentTime + i * 0.08;

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.09, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(start);
    osc.stop(start + 0.12);
  });
}

function playGoalSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523, 659, 784, 1046, 1318];

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const start = audioCtx.currentTime + i * 0.12;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.09, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(start);
    osc.stop(start + 0.18);
  });
}

const STAGES = [stage1Data, stage2Data, stage3Data, stage4Data, stage5Data];

const keys = {};
let cameraX = 0;
let gameState = 'start';
let frame = 0;
let score = 0;
let lives = 3;
let crystalsCollected = 0;

class Player {
  constructor() {
    this.gameRef = null;
    this.x = START_X;
    this.y = START_Y;
    this.w = 28;
    this.h = 44;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1;
    this.jumpTimer = 0;
    this.walkCycle = 0;
    this.invulnerable = 0;
    this.jumpBoost = 0;
    this.big = false;
    this.smallH = 44;
    this.bigH = 58;
    this.currentGround = null;
  }

  reset() {
    const stage = this.gameRef ? this.gameRef.currentStage : null;
    this.x = stage ? stage.startX : START_X;
    this.y = stage ? stage.startY : START_Y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1;
    this.walkCycle = 0;
    this.invulnerable = 0;
    this.jumpBoost = 0;
    this.big = false;
    this.h = this.smallH;
    this.currentGround = null;
  }

  update() {
    const left = keys['ArrowLeft'] || keys['a'] || keys['A'];
    const right = keys['ArrowRight'] || keys['d'] || keys['D'];
    const jumpPressed = keys[' '] || keys['w'] || keys['W'] || keys['ArrowUp'];

    if (left && !right) {
      this.vx -= 0.18;
      this.facing = -1;
    } else if (right && !left) {
      this.vx += 0.18;
      this.facing = 1;
    } else {
      // 滑り判定：足元のブロックに slippery フラグがあると摩擦が小さくなる
      const friction = (this.onGround && this.currentGround && this.currentGround.slippery) ? 0.96 : 0.82;
      this.vx *= friction;
    }

    if (this.vx > 2.2) this.vx = 2.2;
    if (this.vx < -2.2) this.vx = -2.2;

    if (Math.abs(this.vx) < 0.05) this.vx = 0;

    if (this.onGround && jumpPressed && this.jumpTimer === 0) {
      playJumpSound();
      this.vy = -10.8;
      this.onGround = false;
      this.jumpBoost = 0.2;
      this.jumpTimer = 10;
    }

    if (!jumpPressed) {
      this.jumpTimer = 0;
    }

    // 低重力エリア判定（ステージ定義 lowGravityAreas があれば適用）
    let appliedGravity = GRAVITY;
    try {
      const zones = this.gameRef && this.gameRef.currentStage && this.gameRef.currentStage.lowGravityAreas;
      if (zones && zones.length) {
        for (const z of zones) {
          const cx = this.x + this.w / 2;
          const cy = this.y + this.h / 2;
          if (cx >= z.x && cx <= z.x + z.w && cy >= z.y && cy <= z.y + z.h) {
            appliedGravity = GRAVITY * 0.45;
            break;
          }
        }
      }
    } catch (e) {
      appliedGravity = GRAVITY;
    }

    this.vy += appliedGravity;
    this.vy *= 0.999;

    this.x += this.vx;
    this.handleHorizontalCollision();
    this.y += this.vy;
    this.handleVerticalCollision();

    if (this.onGround) {
      this.walkCycle += Math.abs(this.vx) * 0.16;
    } else {
      this.walkCycle = 0;
    }

    if (this.invulnerable > 0) {
      this.invulnerable--;
    }

    if (this.y > HEIGHT + 200) {
      loseLife();
    }

    this.x = Math.max(0, Math.min(this.x, (this.gameRef ? this.gameRef.currentStage.worldWidth : 3200) - this.w));
  }

  handleHorizontalCollision() {
    for (const block of this.gameRef.blocks) {
      if (block.type === 'gap') continue;
      if (this.isCollidingWith(block)) {
        if (this.vx > 0) {
          this.x = block.x - this.w;
        } else if (this.vx < 0) {
          this.x = block.x + block.w;
        }
        this.vx = 0;
      }
    }
  }

  handleVerticalCollision() {
    this.onGround = false;
    this.currentGround = null;
    for (const block of this.gameRef.blocks) {
      if (block.type === 'gap') continue;
      if (this.isCollidingWith(block)) {
        if (this.vy >= 0 && this.y + this.h - this.vy <= block.y + 2) {
          this.y = block.y - this.h;
          this.vy = 0;
          this.onGround = true;
          this.currentGround = block;
        } else if (this.vy < 0 && this.y - this.vy >= block.y + block.h - 2) {
          this.y = block.y + block.h;
          this.vy = 0;
        }
      }
    }
  }

  isCollidingWith(block) {
    if (block.type === 'gap') return false;
    return this.x < block.x + block.w &&
      this.x + this.w > block.x &&
      this.y < block.y + block.h &&
      this.y + this.h > block.y;
  }

  draw() {
    const bob = this.onGround ? Math.sin(this.walkCycle) * 2 : 0;
    const squash = this.onGround ? 1 : 1 + Math.min(0.16, Math.max(-0.04, this.vy * 0.01));
    const drawX = this.x - cameraX;
    const drawY = this.y + bob;

    ctx.save();
    ctx.translate(drawX + this.w / 2, drawY + this.h / 2);
    ctx.scale(this.facing * squash, squash);
    ctx.translate(-(drawX + this.w / 2), -(drawY + this.h / 2));

    // 体のベース
    ctx.fillStyle = this.big ? '#ef4444' : '#5b8cff';
    ctx.fillRect(drawX, drawY, this.w, this.h);

    // 顔と帽子
    ctx.fillStyle = '#fff4c2';
    ctx.fillRect(drawX + 4, drawY + 6, 20, 16);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(drawX + 5, drawY + 2, 18, 6);

    // 目
    ctx.fillStyle = '#111827';
    ctx.fillRect(drawX + 8, drawY + 10, 4, 4);
    ctx.fillRect(drawX + 16, drawY + 10, 4, 4);

    // 口
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(drawX + 10, drawY + 18, 8, 3);

    // 腰のベルト
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(drawX + 7, drawY + this.h - 8, 14, 6);

    // 足
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(drawX + 6, drawY + this.h - 6, 6, 6);
    ctx.fillRect(drawX + 16, drawY + this.h - 6, 6, 6);

    ctx.restore();
  }

  powerUp() {
    if (!this.big) {
        this.big = true;
        this.y -= 14;
        this.h = this.bigH;
    }
    }

    powerDown() {
    if (this.big) {
        this.big = false;
        this.y += 14;
        this.h = this.smallH;
        this.invulnerable = 120;
        return true;
    }
    return false;
    }
}

class Enemy {
  constructor(x, y, speed, options = {}) {
    this.x = x;
    this.y = y;
    this.w = 24;
    this.h = 24;
    this.vx = speed;
    this.speed = speed;
    this.dead = false;
    this.hitTimer = 0;
    this.type = options.type || 'walker';
    this.baseX = x;
    this.baseY = y;
    this.range = options.range || 90;
    this.phase = Math.random() * Math.PI * 2;
  }

  update() {
    if (this.dead) return;

    if (this.type === 'flyer') {
      this.phase += 0.08;
      this.x += this.vx;
      this.y = this.baseY + Math.sin(this.phase) * 18;

      if (this.x <= this.baseX - this.range || this.x >= this.baseX + this.range) {
        this.vx *= -1;
      }
    } else {
      const nextX = this.x + this.vx;
      const footX = this.vx > 0
        ? nextX + this.w + 4
        : nextX - 4;

      const ground = findGroundAt(footX, this.y + this.h + 4);

      if (!ground) {
        this.vx *= -1;
      } else {
        this.x = nextX;
      }
    }

    if (this.hitTimer > 0) this.hitTimer--;
  }

  draw() {
    if (this.dead) return;
    const drawX = this.x - cameraX;
    const drawY = this.y;

    ctx.save();
    ctx.translate(drawX + this.w / 2, drawY + this.h / 2);
    ctx.scale(this.vx > 0 ? 1 : -1, 1);
    ctx.translate(-(drawX + this.w / 2), -(drawY + this.h / 2));

    if (this.type === 'flyer') {
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.ellipse(drawX + 12, drawY + 12, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(drawX + 5, drawY + 10, 14, 4);
      ctx.fillStyle = '#111827';
      ctx.fillRect(drawX + 7, drawY + 11, 3, 3);
      ctx.fillRect(drawX + 13, drawY + 11, 3, 3);
      ctx.fillRect(drawX + 7, drawY + 16, 10, 3);
    } else {
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(drawX + 12, drawY + 12, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(drawX + 5, drawY + 8, 14, 4);
      ctx.fillStyle = '#111827';
      ctx.fillRect(drawX + 7, drawY + 10, 3, 3);
      ctx.fillRect(drawX + 13, drawY + 10, 3, 3);
      ctx.fillRect(drawX + 8, drawY + 15, 8, 3);
    }

    ctx.restore();
  }
}

class Crystal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 16;
    this.h = 16;
    this.collected = false;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.pulse += 0.08;
  }

  draw() {
    if (this.collected) return;

    const bob = Math.sin(this.pulse) * 2;
    const drawX = this.x - cameraX;
    const drawY = this.y + bob;

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(drawX + 8, drawY + 8, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(drawX + 8, drawY + 8, 3, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 24;
    this.h = 24;
    this.collected = false;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.pulse += 0.06;
  }

  draw() {
    if (this.collected) return;

    const bob = Math.sin(this.pulse) * 2;
    const drawX = this.x - cameraX;
    const drawY = this.y + bob;

    // キノコのかさ
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(drawX + 2, drawY + 2, 20, 12);

    // 白い模様
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(drawX + 5, drawY + 5, 5, 5);
    ctx.fillRect(drawX + 15, drawY + 5, 5, 5);

    // 顔
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(drawX + 5, drawY + 12, 14, 10);

    ctx.fillStyle = '#111827';
    ctx.fillRect(drawX + 8, drawY + 15, 3, 3);
    ctx.fillRect(drawX + 14, drawY + 15, 3, 3);
  }
}

class FloatingText {
  constructor(x, y, text, color = '#fff7ed') {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 40;
  }

  update() {
    this.life--;
    this.y -= 0.7;
  }

  draw() {
    if (this.life <= 0) return;

    const alpha = Math.max(0, this.life / 40);
    const drawX = this.x - cameraX;
    const drawY = this.y;
    const padding = 8;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalCompositeOperation = 'source-over';

    const metrics = ctx.measureText(this.text);
    const boxW = metrics.width + padding * 2;
    const boxH = 24;

    ctx.fillStyle = 'rgba(17, 24, 39, 0.95)';
    ctx.fillRect(drawX - boxW / 2, drawY - boxH / 2, boxW, boxH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeRect(drawX - boxW / 2, drawY - boxH / 2, boxW, boxH);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, drawX, drawY);
    ctx.restore();
  }
}

class Particle {
  constructor(x, y, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = 20 + Math.random() * 20;
    this.size = 2 + Math.random() * 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.04;
    this.life--;
  }

  draw() {
    if (this.life <= 0) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - cameraX, this.y, this.size, this.size);
  }
}

class Game {
  constructor() {
    this.currentStageIndex = 0;
    this.currentStage = STAGES[0];
    this.player = new Player();
    this.player.gameRef = this;
    this.enemies = [];
    this.crystals = [];
    this.particles = [];
    this.floatingTexts = [];
    this.blocks = [];
    this.powerUps = [];
    this.goal = { x: 0, y: 0, w: 44, h: 96 };
    this.staticBlocks = [];
    this.movingPlatforms = [];
    this.lavaSurfaceY = HEIGHT;
    this.initStage();
  }

  initStage() {
    this.currentStage = STAGES[this.currentStageIndex];
    this.staticBlocks = this.currentStage.blocks.map((block) => ({ ...block }));
    this.movingPlatforms = (this.currentStage.movingPlatforms || []).map((platform) => ({
      ...platform,
      baseX: platform.x,
      baseY: platform.y,
      phase: Math.random() * Math.PI * 2,
      moving: true,
      type: 'platform'
    }));
    this.blocks = [...this.staticBlocks, ...this.movingPlatforms.map((p) => ({ ...p }))];
    this.enemies = this.currentStage.enemies.map((enemy) => new Enemy(enemy.x, enemy.y, enemy.vx, enemy));
    this.crystals = this.currentStage.crystals.map((crystal) => new Crystal(crystal.x, crystal.y));
    this.goal = { ...this.currentStage.goal };
    this.particles = [];
    this.floatingTexts = [];
    this.player.reset();
    this.powerUps = this.currentStage.powerUps.map((item) => new PowerUp(item.x, item.y));
    this.lavaSurfaceY = HEIGHT;
  }

  start() {
    score = 0;
    lives = 3;
    crystalsCollected = 0;
    this.currentStageIndex = 0;
    this.initStage();
    cameraX = 0;
    gameState = 'start';
  }

  restart() {
    score = 0;
    lives = 3;
    crystalsCollected = 0;
    this.currentStageIndex = 0;
    this.initStage();
    cameraX = 0;
    gameState = 'playing';
  }

  goToNextStage() {
    if (this.currentStageIndex < STAGES.length - 1) {
      this.currentStageIndex++;
      this.initStage();
      cameraX = 0;
      gameState = 'playing';
    } else {
      this.currentStageIndex = 0;
      this.initStage();
      cameraX = 0;
      gameState = 'playing';
    }
  }

  update() {
    if (gameState === 'poleSlide') {
      goalTimer++;

      this.player.vx = 0;
      this.player.vy = 0;
      this.player.x = this.goal.x + 6;
      this.player.y += 2.2;
      this.player.facing = 1;
      this.updateCamera();

      if (this.player.y >= 420 - this.player.h) {
        this.player.y = 420 - this.player.h;
        goalTimer = 0;
        gameState = 'goalWalk';
      }

      return;
    }

    if (gameState === 'goalWalk') {
      goalTimer++;

      this.player.vx = 1.4;
      this.player.x += this.player.vx;
      this.player.facing = 1;
      this.updateCamera();

      if (goalTimer > 90) {
        gameState = 'clear';
      }

      return;
    }

    if (gameState !== 'playing') return;

    frame++;
    this.updateStageSpecials();
    this.player.update();
    this.updateCamera();

    this.handleCrystalCollection();
    this.handlePowerUpCollection();
    this.handleEnemyCollisions();
    this.handleGoal();

    for (const enemy of this.enemies) {
      enemy.update();
    }

    for (const crystal of this.crystals) {
      crystal.update();
    }

    for (const powerUp of this.powerUps) {
      powerUp.update();
    }

    for (const particle of this.particles) {
      particle.update();
    }

    for (const text of this.floatingTexts) {
      text.update();
    }

    this.particles = this.particles.filter((p) => p.life > 0);
    this.floatingTexts = this.floatingTexts.filter((t) => t.life > 0);

    if (this.player.y > HEIGHT + 200) {
      loseLife();
    }
  }

  updateCamera() {
    const target = this.player.x + this.player.w / 2 - WIDTH / 2;
    cameraX = Math.max(0, Math.min(target, this.currentStage.worldWidth - WIDTH));
  }

  updateStageSpecials() {
    if (this.currentStage.movingPlatforms && this.currentStage.movingPlatforms.length) {
      for (const platform of this.movingPlatforms) {
        if (platform.axis === 'horizontal' && platform.range) {
          platform.x = platform.baseX + Math.sin(frame * 0.04 + platform.phase) * platform.range;
        } else if (platform.axis === 'circle' && platform.r) {
          const angle = frame * 0.03 + platform.phase;
          platform.x = platform.baseX + Math.cos(angle) * platform.r;
          platform.y = platform.baseY + Math.sin(angle) * platform.r * 0.35;
        }
      }
      this.blocks = [...this.staticBlocks, ...this.movingPlatforms.map((p) => ({ ...p }))];
    }

    if (this.currentStage.risingLava) {
      const lava = this.currentStage.risingLava;
      const lowerBound = HEIGHT;
      const upperBound = typeof lava.upperBound === 'number'
        ? lava.upperBound
        : 90;
      const amplitude = Math.max(120, lowerBound - upperBound);

      const introFrames = 260;
      const introProgress = Math.min(1, frame / introFrames);
      const easedRise = introProgress * introProgress * (3 - 2 * introProgress);
      const progress = frame < introFrames
        ? easedRise
        : 0.5 + 0.5 * Math.sin((frame - introFrames) * 0.012 * (lava.speed + 0.6) + Math.PI / 2);
      this.lavaSurfaceY = lowerBound - amplitude * progress;

      if (this.player.y + this.player.h >= this.lavaSurfaceY && this.player.invulnerable <= 0) {
        playDamageSound();
        this.player.invulnerable = 60;
        loseLife();
      }
    }

    for (const zone of this.currentStage.dangerZones || []) {
      if (rectsOverlap(this.player, zone) && this.player.invulnerable <= 0) {
        playDamageSound();
        this.player.invulnerable = 50;
        loseLife();
        break;
      }
    }
  }

  handleCrystalCollection() {
    for (const crystal of this.crystals) {
      if (crystal.collected) continue;
      if (rectsOverlap(this.player, crystal)) {
        crystal.collected = true;
        playCoinSound();
        crystalsCollected++;
        score += 100;
        spawnBurst(crystal.x, crystal.y, '#fde68a');
      }
    }
  }

  handleEnemyCollisions() {
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      if (rectsOverlap(this.player, enemy)) {
        if (this.player.vy > 0 && this.player.y + this.player.h - 8 <= enemy.y + 2) {
          enemy.dead = true;
          playStompSound();
          this.player.vy = -5.6;
          score += 200;
          spawnBurst(enemy.x, enemy.y, '#fef3c7');
        } else if (this.player.invulnerable <= 0) {
          const poweredDown = this.player.powerDown();

          if (!poweredDown) {
              this.player.invulnerable = 90;
              const taunts = ['ざまあwww', '人間以下www', '下手www', 'やめちまえwww'];
              const taunt = taunts[Math.floor(Math.random() * taunts.length)];
              this.floatingTexts.push(new FloatingText(enemy.x + enemy.w / 2, enemy.y - 8, taunt, '#fef2f2'));
              loseLife();
          }
        }
      }
    }
  }

  handlePowerUpCollection() {
    for (const powerUp of this.powerUps) {
      if (powerUp.collected) continue;

      if (rectsOverlap(this.player, powerUp)) {
        powerUp.collected = true;
        playPowerUpSound();
        this.player.powerUp();
        powerUpsCollected++;
        score += 500;
        spawnBurst(powerUp.x, powerUp.y, '#ef4444');
      }
    }
  }

  handleGoal() {
    if (rectsOverlap(this.player, this.goal)) {
      stopStageBgm();
      playGoalSound();

      this.player.vx = 0;
      this.player.vy = 0;
      this.player.x = this.goal.x + 6;
      this.player.facing = 1;

      goalTimer = 0;
      gameState = 'poleSlide';
    }
  }

  draw() {
    drawBackground();
    drawStage();

    for (const crystal of this.crystals) {
      crystal.draw();
    }

    for (const powerUp of this.powerUps) {
      powerUp.draw();
    }

    for (const enemy of this.enemies) {
      enemy.draw();
    }

    for (const particle of this.particles) {
      particle.draw();
    }

    this.player.draw();
    drawGoal();
    drawHud();
    drawOverlay();

    for (const text of this.floatingTexts) {
      text.draw();
    }
  }
}

const game = new Game();

// --- Stage select UI wiring ---
const stageSelectBtn = document.getElementById('open-stage-select');
const stageOverlay = document.getElementById('stage-select');
const closeStageBtn = document.getElementById('close-stage-select');

if (stageSelectBtn && stageOverlay) {
  stageSelectBtn.addEventListener('click', () => {
    console.log('stageSelectBtn clicked, overlay hidden:', stageOverlay.hidden);
    stageOverlay.hidden = !stageOverlay.hidden;
  });

  // クリックでオーバーレイの背景をクリックしたら閉じる（フォールバック）
  stageOverlay.addEventListener('click', (e) => {
    console.log('stageOverlay click target:', e.target);
    if (e.target === stageOverlay) {
      console.log('overlay background clicked — closing');
      stageOverlay.hidden = true;
    }
  });

  // Escキーで閉じるフォールバック
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !stageOverlay.hidden) {
      stageOverlay.hidden = true;
    }
  });

  if (closeStageBtn) {
    closeStageBtn.addEventListener('click', (e) => {
      console.log('closeStageBtn clicked');
      e.stopPropagation();
      stageOverlay.hidden = true;
    });
  }
} else {
  console.warn('Stage select elements missing in DOM');
}

for (const btn of document.querySelectorAll('.stage-buttons button')) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const idx = Number(e.currentTarget.dataset.stage);
    if (!Number.isNaN(idx) && idx >= 0 && idx < STAGES.length) {
      game.currentStageIndex = idx;
      game.initStage();
      cameraX = 0;
      gameState = 'playing';
      if (stageOverlay) stageOverlay.hidden = true;
      startStageBgm();
    }
  });
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function findGroundAt(x, y = 420) {
  return game.blocks.find(block =>
    block.type === 'ground' &&
    x >= block.x &&
    x <= block.x + block.w &&
    y >= block.y &&
    y <= block.y + block.h + 8
  ) || null;
}

function loseLife() {
  playDamageSound();
  if (gameState !== 'playing') return;
  lives--;
  if (lives <= 0) {
    stopStageBgm();
    gameState = 'gameover';
  } else {
    game.initStage();
    cameraX = 0;
    frame = 0;
    game.player.invulnerable = 90;
    gameState = 'miss';
    setTimeout(() => {
      if (gameState === 'miss') {
        gameState = 'playing';
      }
    }, 700);
  }
}

function spawnBurst(x, y, color) {
  for (let i = 0; i < 14; i++) {
    game.particles.push(new Particle(x, y, color, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3));
  }
}

function drawBackground() {
  const stageTwo = game.currentStageIndex === 1;
  const stageThree = game.currentStageIndex === 2;
  const stageFour = game.currentStageIndex === 3;
  const stageFive = game.currentStageIndex === 4;

  if (stageFive) {
    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grd.addColorStop(0, '#140b0a');
    grd.addColorStop(0.5, '#3b120f');
    grd.addColorStop(1, '#6a1b0b');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = 'rgba(255,140,60,0.25)';
    for (let i = 0; i < 18; i++) {
      const x = (i * 170 + frame * 0.5) % (WIDTH + 120) - 60;
      const y = 140 + (i % 5) * 40;
      ctx.fillRect(x, y, 120, 16);
    }

    ctx.fillStyle = '#8d2712';
    ctx.fillRect(0, 380, WIDTH, 140);
  } else if (stageFour) {
    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grd.addColorStop(0, '#2d1347');
    grd.addColorStop(0.6, '#7c2d12');
    grd.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(760, 90, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 8; i++) {
      const x = (i * 150 + frame * 0.3) % (WIDTH + 100) - 80;
      ctx.fillRect(x, 40 + (i % 3) * 40, 80, 10);
    }

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 380, WIDTH, 140);
  } else if (stageThree) {
    // 氷世界の背景（薄いグラデーション）
    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grd.addColorStop(0, '#e6f0ff');
    grd.addColorStop(0.6, '#cfe9ff');
    grd.addColorStop(1, '#dff6ff');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 軽い雪の演出
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i = 0; i < 60; i++) {
      const sx = (i * 97 + frame * 0.6) % (WIDTH + 200) - 100;
      const sy = ((i * 61 + frame * 0.8) % (HEIGHT + 300)) - 100;
      const r = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 低めの氷の山並み
    ctx.fillStyle = '#bfe6ff';
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(120, 240);
    ctx.lineTo(260, 300);
    ctx.lineTo(420, 200);
    ctx.lineTo(590, 300);
    ctx.lineTo(760, 260);
    ctx.lineTo(960, 280);
    ctx.lineTo(WIDTH, 220);
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.lineTo(0, HEIGHT);
    ctx.closePath();
    ctx.fill();

    // 地面色
    ctx.fillStyle = '#eafcff';
    ctx.fillRect(0, 380, WIDTH, 140);
  } else {
    ctx.fillStyle = stageTwo ? '#6c7cff' : '#8edbff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 空の雲
    const cloudX = (frame * 0.04) % 1200;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 240 - cloudX) % 1400 - 200;
      ctx.beginPath();
      ctx.arc(x + 70, 100, 24, 0, Math.PI * 2);
      ctx.arc(x + 100, 85, 30, 0, Math.PI * 2);
      ctx.arc(x + 130, 100, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    // 山並み
    ctx.fillStyle = stageTwo ? '#5a6fd1' : '#73b8e8';
    ctx.beginPath();
    ctx.moveTo(0, 270);
    ctx.lineTo(160, 220);
    ctx.lineTo(260, 270);
    ctx.lineTo(420, 180);
    ctx.lineTo(590, 270);
    ctx.lineTo(760, 220);
    ctx.lineTo(960, 250);
    ctx.lineTo(WIDTH, 200);
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.lineTo(0, HEIGHT);
    ctx.closePath();
    ctx.fill();

    // 地面の色
    ctx.fillStyle = stageTwo ? '#c4d7b8' : '#d3f2bd';
    ctx.fillRect(0, 380, WIDTH, 140);
  }
}

function drawStage() {
  if (game.currentStage && game.currentStage.lowGravityAreas) {
    for (const area of game.currentStage.lowGravityAreas) {
      ctx.fillStyle = 'rgba(180,220,255,0.12)';
      ctx.fillRect(area.x - cameraX, area.y, area.w, area.h);
      ctx.strokeStyle = 'rgba(150,200,255,0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(area.x - cameraX, area.y, area.w, area.h);
    }
  }
  if (game.currentStage && game.currentStage.risingLava) {
    ctx.fillStyle = '#ff7a1a';
    ctx.fillRect(0, game.lavaSurfaceY, WIDTH, HEIGHT - game.lavaSurfaceY);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, game.lavaSurfaceY + 8, WIDTH, 18);
  }

  for (const zone of game.currentStage.dangerZones || []) {
    ctx.fillStyle = 'rgba(255,120,40,0.16)';
    ctx.fillRect(zone.x - cameraX, zone.y, zone.w, zone.h);
    ctx.strokeStyle = 'rgba(255,180,60,0.6)';
    ctx.strokeRect(zone.x - cameraX, zone.y, zone.w, zone.h);
  }

  for (const block of game.blocks) {
    if (block.type === 'ground') {
      ctx.fillStyle = '#7a4a1d';
      ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
      ctx.fillStyle = '#a9702f';
      ctx.fillRect(block.x - cameraX, block.y, block.w, 8);
      ctx.fillStyle = '#4a2b11';
      ctx.fillRect(block.x - cameraX, block.y + block.h - 10, block.w, 10);
    } else if (block.type === 'platform') {
      if (block.moving) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(block.x - cameraX, block.y, block.w, 5);
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(block.x - cameraX + 8, block.y + 6, block.w - 16, 4);
      } else if (block.slippery) {
        // 氷のプラットフォーム
        ctx.fillStyle = '#dff8ff';
        ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
        ctx.fillStyle = '#bfeeff';
        ctx.fillRect(block.x - cameraX, block.y, block.w, 6);
        ctx.fillStyle = '#9fdfff';
        ctx.fillRect(block.x - cameraX + 8, block.y + 6, block.w - 16, 4);
      } else {
        ctx.fillStyle = '#5fae59';
        ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
        ctx.fillStyle = '#7ed957';
        ctx.fillRect(block.x - cameraX, block.y, block.w, 6);
        ctx.fillStyle = '#3b7840';
        ctx.fillRect(block.x - cameraX + 8, block.y + 6, block.w - 16, 4);
        ctx.fillStyle = '#2f4f2f';
        ctx.fillRect(block.x - cameraX + 12, block.y + 2, 6, 4);
      }
    } else if (block.type === 'gap') {
      ctx.fillStyle = '#2d4f5d';
      ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
    }
  }
}

function drawGoal() {
  const x = game.goal.x - cameraX;
  const groundY = 420;

  // ポール
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x + 18, groundY - 160, 8, 160);

  // 影
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x + 24, groundY - 160, 2, 160);

  // 玉
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(x + 22, groundY - 166, 10, 0, Math.PI * 2);
  ctx.fill();

  // 旗
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 26, groundY - 150, 42, 28);

  // 土台
  ctx.fillStyle = '#7a4a1d';
  ctx.fillRect(x + 6, groundY - 16, 40, 16);
}

function drawHud() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, WIDTH, 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px monospace';

  ctx.fillText(`MARIO`, 30, 25);
  ctx.fillText(`${score}`, 30, 50);

  ctx.fillText(`COIN x ${crystalsCollected}`, 220, 38);

  ctx.fillText(`WORLD ${game.currentStageIndex + 1}-1`, 500, 38);

  ctx.fillText(`LIFE ${lives}`, 760, 38);
}

function drawOverlay() {
  if (gameState === 'start') {
    drawCenteredText('PRESS ENTER TO START');
  } else if (gameState === 'miss') {
    drawCenteredText('MISS');
  } else if (gameState === 'gameover') {
    drawCenteredText('GAME OVER - PRESS ENTER');
  } else if (gameState === 'clear') {
    drawCenteredText('STAGE CLEAR! - PRESS ENTER');
  }
}

function drawCenteredText(message) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#fff7ed';
  ctx.font = '42px Trebuchet MS';
  ctx.textAlign = 'center';
  ctx.fillText(message, WIDTH / 2, HEIGHT / 2 - 10);
  ctx.font = '20px Trebuchet MS';
  ctx.fillText('← → / A D で移動、Space / W / ↑ でジャンプ', WIDTH / 2, HEIGHT / 2 + 30);
  ctx.textAlign = 'left';
}

function handleKeyDown(event) {
  const actionKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'w', 'a', 'd', 'W', 'A', 'D'];
  if (actionKeys.includes(event.key)) {
    event.preventDefault();
  }

  keys[event.key] = true;
  if (event.key === 'Enter' && (gameState === 'start' || gameState === 'miss' || gameState === 'gameover' || gameState === 'clear')) {
    if (gameState === 'clear') {
      game.goToNextStage();
      startStageBgm();
    } else {
      game.restart();
      startStageBgm();
    }
  }
}

function handleKeyUp(event) {
  keys[event.key] = false;
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

function gameLoop() {
  game.update();
  game.draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
