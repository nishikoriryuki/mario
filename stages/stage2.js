export const stage2Data = {
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
};
