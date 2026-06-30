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

const STAGES = [
  {
    name: '星の砂丘',
    worldWidth: 3200,
    startX: 120,
    startY: 340,
    goal: { x: 3000, y: 260, w: 70, h: 120 },
    blocks: [
      { x: 0, y: 420, w: 1600, h: 140, type: 'ground' },
      { x: 1640, y: 420, w: 640, h: 140, type: 'ground' },
      { x: 2360, y: 420, w: 280, h: 140, type: 'ground' },
      { x: 2720, y: 420, w: 240, h: 140, type: 'ground' },
      { x: 280, y: 360, w: 140, h: 20, type: 'platform' },
      { x: 520, y: 320, w: 120, h: 20, type: 'platform' },
      { x: 760, y: 280, w: 120, h: 20, type: 'platform' },
      { x: 1040, y: 340, w: 140, h: 20, type: 'platform' },
      { x: 1320, y: 300, w: 120, h: 20, type: 'platform' },
      { x: 1580, y: 260, w: 120, h: 20, type: 'platform' },
      { x: 1860, y: 220, w: 120, h: 20, type: 'platform' },
      { x: 2200, y: 320, w: 180, h: 20, type: 'platform' },
      { x: 2500, y: 280, w: 120, h: 20, type: 'platform' },
      { x: 2800, y: 360, w: 120, h: 20, type: 'platform' },
      { x: 1800, y: 420, w: 160, h: 140, type: 'ground' },
      { x: 2080, y: 420, w: 180, h: 140, type: 'ground' },
      { x: 2460, y: 420, w: 140, h: 140, type: 'ground' },
      { x: 2960, y: 420, w: 240, h: 140, type: 'ground' }
    ],
    enemies: [
      { x: 380, y: 392, vx: 1.1 },
      { x: 600, y: 292, vx: -1.2 },
      { x: 1120, y: 316, vx: 1.0 },
      { x: 1600, y: 232, vx: -1.0 },
      { x: 2500, y: 392, vx: 1.1 }
    ],
    crystals: [
      { x: 340, y: 330 },
      { x: 560, y: 292 },
      { x: 800, y: 250 },
      { x: 1080, y: 300 },
      { x: 1360, y: 270 },
      { x: 1620, y: 230 },
      { x: 1900, y: 188 },
      { x: 2260, y: 292 },
      { x: 2540, y: 250 },
      { x: 2840, y: 330 }
    ],
    powerUps: [
      { x: 900, y: 250 },
      { x: 2100, y: 292 }
    ]
  },
  {
    name: '霧の峡谷',
    worldWidth: 3600,
    startX: 120,
    startY: 340,
    goal: { x: 3340, y: 260, w: 70, h: 120 },
    blocks: [
      { x: 0, y: 420, w: 1600, h: 140, type: 'ground' },
      { x: 1640, y: 420, w: 620, h: 140, type: 'ground' },
      { x: 2340, y: 420, w: 700, h: 140, type: 'ground' },
      { x: 3140, y: 420, w: 460, h: 140, type: 'ground' },
      { x: 300, y: 360, w: 120, h: 20, type: 'platform' },
      { x: 520, y: 310, w: 140, h: 20, type: 'platform' },
      { x: 740, y: 250, w: 120, h: 20, type: 'platform' },
      { x: 980, y: 330, w: 120, h: 20, type: 'platform' },
      { x: 1240, y: 290, w: 140, h: 20, type: 'platform' },
      { x: 1520, y: 250, w: 120, h: 20, type: 'platform' },
      { x: 1820, y: 220, w: 140, h: 20, type: 'platform' },
      { x: 2140, y: 320, w: 160, h: 20, type: 'platform' },
      { x: 2460, y: 280, w: 120, h: 20, type: 'platform' },
      { x: 2760, y: 340, w: 180, h: 20, type: 'platform' },
      { x: 3080, y: 290, w: 140, h: 20, type: 'platform' },
      { x: 1700, y: 420, w: 180, h: 140, type: 'ground' },
      { x: 2020, y: 420, w: 180, h: 140, type: 'ground' },
      { x: 2400, y: 420, w: 120, h: 140, type: 'ground' },
      { x: 2880, y: 420, w: 160, h: 140, type: 'ground' }
    ],
    enemies: [
      { x: 420, y: 392, vx: 1.2 },
      { x: 760, y: 232, vx: -1.0 },
      { x: 1260, y: 272, vx: 1.1 },
      { x: 1880, y: 202, vx: -1.1 },
      { x: 2480, y: 392, vx: 1.0 }
    ],
    crystals: [
      { x: 360, y: 330 },
      { x: 620, y: 270 },
      { x: 860, y: 220 },
      { x: 1100, y: 300 },
      { x: 1420, y: 260 },
      { x: 1760, y: 200 },
      { x: 2200, y: 292 },
      { x: 2520, y: 250 },
      { x: 2840, y: 300 },
      { x: 3180, y: 260 }
    ],
    powerUps: [
      { x: 1000, y: 300 },
      { x: 2600, y: 250 }
    ]
  }
];

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
      this.vx *= 0.82;
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

    this.vy += GRAVITY;
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
    for (const block of this.gameRef.blocks) {
      if (block.type === 'gap') continue;
      if (this.isCollidingWith(block)) {
        if (this.vy >= 0 && this.y + this.h - this.vy <= block.y + 2) {
          this.y = block.y - this.h;
          this.vy = 0;
          this.onGround = true;
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
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.w = 24;
    this.h = 24;
    this.vx = speed;
    this.speed = speed;
    this.dead = false;
    this.hitTimer = 0;
  }

  update() {
    if (this.dead) return;

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
    this.blocks = [];
    this.powerUps = [];
    this.goal = { x: 0, y: 0, w: 44, h: 96 };
    this.initStage();
  }

  initStage() {
    this.currentStage = STAGES[this.currentStageIndex];
    this.blocks = this.currentStage.blocks.map((block) => ({ ...block }));
    this.enemies = this.currentStage.enemies.map((enemy) => new Enemy(enemy.x, enemy.y, enemy.vx));
    this.crystals = this.currentStage.crystals.map((crystal) => new Crystal(crystal.x, crystal.y));
    this.goal = { ...this.currentStage.goal };
    this.particles = [];
    this.player.reset();
    this.powerUps = this.currentStage.powerUps.map((item) => new PowerUp(item.x, item.y));
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

    this.particles = this.particles.filter((p) => p.life > 0);

    if (this.player.y > HEIGHT + 200) {
      loseLife();
    }
  }

  updateCamera() {
    const target = this.player.x + this.player.w / 2 - WIDTH / 2;
    cameraX = Math.max(0, Math.min(target, this.currentStage.worldWidth - WIDTH));
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
  }
}

const game = new Game();

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
    game.player.reset();
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

function drawStage() {
  for (const block of game.blocks) {
    if (block.type === 'ground') {
      ctx.fillStyle = '#7a4a1d';
      ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
      ctx.fillStyle = '#a9702f';
      ctx.fillRect(block.x - cameraX, block.y, block.w, 8);
      ctx.fillStyle = '#4a2b11';
      ctx.fillRect(block.x - cameraX, block.y + block.h - 10, block.w, 10);
    } else if (block.type === 'platform') {
      ctx.fillStyle = '#5fae59';
      ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
      ctx.fillStyle = '#7ed957';
      ctx.fillRect(block.x - cameraX, block.y, block.w, 6);
      ctx.fillStyle = '#3b7840';
      ctx.fillRect(block.x - cameraX + 8, block.y + 6, block.w - 16, 4);
      ctx.fillStyle = '#2f4f2f';
      ctx.fillRect(block.x - cameraX + 12, block.y + 2, 6, 4);
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
