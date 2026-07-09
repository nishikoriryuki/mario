export const stage5Data = {
  name: '地底の溶岩巨洞',
  worldWidth: 3600,
  startX: 120,
  startY: 340,
  goal: { x: 3400, y: 260, w: 70, h: 120 },
  // ギミック: 上昇する溶岩、熱ダメージゾーン
  risingLava: {
    baseY: 520,
    speed: 0.22,
    upperBound: 400
  },
  dangerZones: [
    { x: 1400, y: 360, w: 240, h: 80, damagePerSec: 1.5 },
    { x: 2280, y: 360, w: 220, h: 80, damagePerSec: 1.5 },
    { x: 3040, y: 360, w: 220, h: 80, damagePerSec: 1.6 }
  ],
  blocks: [
    { x: 0, y: 420, w: 1080, h: 70, type: 'ground' },
    { x: 1120, y: 420, w: 120, h: 140, type: 'gap' },
    { x: 1240, y: 420, w: 680, h: 70, type: 'ground' },
    { x: 1940, y: 420, w: 120, h: 140, type: 'gap' },
    { x: 2060, y: 420, w: 680, h: 70, type: 'ground' },
    { x: 2800, y: 420, w: 120, h: 140, type: 'gap' },
    { x: 2880, y: 420, w: 720, h: 70, type: 'ground' },
    { x: 420, y: 340, w: 120, h: 16, type: 'platform' },
    { x: 900, y: 290, w: 120, h: 16, type: 'platform' },
    { x: 1260, y: 250, w: 120, h: 16, type: 'platform' },
    { x: 1580, y: 320, w: 140, h: 16, type: 'platform' },
    { x: 1880, y: 280, w: 140, h: 16, type: 'platform' },
    { x: 2200, y: 240, w: 140, h: 16, type: 'platform' },
    { x: 2520, y: 300, w: 140, h: 16, type: 'platform' },
    { x: 2860, y: 260, w: 140, h: 16, type: 'platform' },
    { x: 3200, y: 220, w: 120, h: 16, type: 'platform' },
    { x: 760, y: 310, w: 110, h: 16, type: 'platform' },
    { x: 1080, y: 220, w: 80, h: 16, type: 'platform' },
    { x: 1420, y: 210, w: 90, h: 16, type: 'platform' },
    { x: 1760, y: 230, w: 90, h: 16, type: 'platform' },
    { x: 2080, y: 210, w: 90, h: 16, type: 'platform' },
    { x: 2680, y: 250, w: 120, h: 16, type: 'platform' },
    { x: 3000, y: 320, w: 100, h: 16, type: 'platform' }
  ],
  enemies: [
    { x: 900, y: 392, vx: 1.0 },
    { x: 1700, y: 392, vx: -1.0 },
    { x: 2600, y: 392, vx: 1.2 },
    { x: 760, y: 292, vx: -1.1, type: 'flyer', range: 140 },
    { x: 1440, y: 250, vx: 1.0, type: 'flyer', range: 180 },
    { x: 2240, y: 270, vx: -1.2, type: 'flyer', range: 200 },
    { x: 3040, y: 250, vx: 1.3, type: 'flyer', range: 150 },
    { x: 1120, y: 392, vx: 1.1 },
    { x: 1880, y: 392, vx: -1.2 },
    { x: 3200, y: 392, vx: 1.0 }
  ],
  crystals: [
    { x: 720, y: 280 },
    { x: 1180, y: 240 },
    { x: 1640, y: 200 },
    { x: 2200, y: 280 },
    { x: 3000, y: 320 },
    { x: 520, y: 280 },
    { x: 1520, y: 180 },
    { x: 2380, y: 220 },
    { x: 3260, y: 260 }
  ],
  powerUps: [
    { x: 2400, y: 260 },
    { x: 3120, y: 240 }
  ]
};
