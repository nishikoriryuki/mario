export const stage3Data = {
  name: '氷の空中島',
  worldWidth: 3000,
  startX: 120,
  startY: 260,
  goal: { x: 2780, y: 300, w: 70, h: 120 },
  // lowGravityAreas: 画面下から上まで広く効くようにする
  lowGravityAreas: [
    { x: 0, y: 0, w: 3000, h: 460 }
  ],
  blocks: [
    { x: 0, y: 420, w: 900, h: 140, type: 'ground', slippery: true },
    { x: 980, y: 420, w: 640, h: 140, type: 'ground', slippery: true },
    { x: 1700, y: 420, w: 800, h: 140, type: 'ground', slippery: true },
    // 追加: ゴール付近の地面を拡張して届くようにする
    { x: 2520, y: 420, w: 480, h: 140, type: 'ground', slippery: true },
    // 浮遊する氷の島（滑りあり）
    { x: 420, y: 360, w: 160, h: 20, type: 'platform', slippery: true },
    { x: 760, y: 320, w: 180, h: 20, type: 'platform', slippery: true },
    { x: 1160, y: 300, w: 140, h: 20, type: 'platform', slippery: true },
    { x: 1420, y: 340, w: 160, h: 20, type: 'platform', slippery: true },
    { x: 1880, y: 300, w: 200, h: 20, type: 'platform', slippery: true },
    { x: 2240, y: 340, w: 160, h: 20, type: 'platform', slippery: true }
  ],
  enemies: [
    { x: 520, y: 292, vx: 0.9 },
    { x: 980, y: 392, vx: -1.0 },
    { x: 1600, y: 352, vx: 1.0 },
    { x: 700, y: 312, vx: -0.8 },
    { x: 2000, y: 332, vx: -1.2 },
    { x: 2480, y: 212, vx: 1.0 }
  ],
  crystals: [
    { x: 460, y: 280 },
    { x: 820, y: 220 },
    { x: 1220, y: 180 },
    { x: 1500, y: 240 },
    { x: 1900, y: 220 },
    { x: 2300, y: 280 },
    { x: 2600, y: 260 }
  ],
  powerUps: [
    { x: 1300, y: 160 },
    { x: 2100, y: 220 }
  ]
};

