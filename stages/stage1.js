export const stage1Data = {
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
};
