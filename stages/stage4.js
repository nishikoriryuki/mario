export const stage4Data = {
  name: '夕暮れの遊園地',
  worldWidth: 3400,
  startX: 120,
  startY: 340,
  goal: { x: 3200, y: 260, w: 70, h: 120 },
  // ギミック: 回転する観覧車エリアや揺れる吊り橋
  movingPlatforms: [
    { x: 800, y: 340, w: 120, h: 20, type: 'moving', axis: 'circle', r: 80 },
    { x: 1400, y: 320, w: 160, h: 20, type: 'moving', axis: 'horizontal', range: 140 },
    { x: 2920, y: 300, w: 140, h: 20, type: 'moving', axis: 'horizontal', range: 90 }
  ],
  blocks: [
    { x: 0, y: 420, w: 560, h: 140, type: 'ground' },
    { x: 650, y: 420, w: 180, h: 140, type: 'ground' },
    { x: 960, y: 420, w: 460, h: 140, type: 'ground' },
    { x: 1460, y: 420, w: 240, h: 140, type: 'ground' },
    { x: 1760, y: 420, w: 360, h: 140, type: 'ground' },
    { x: 2240, y: 420, w: 220, h: 140, type: 'ground' },
    { x: 2480, y: 420, w: 920, h: 140, type: 'ground' },
    { x: 720, y: 360, w: 100, h: 16, type: 'platform' },
    { x: 920, y: 340, w: 120, h: 16, type: 'platform' },
    { x: 1160, y: 320, w: 140, h: 16, type: 'platform' },
    { x: 1500, y: 300, w: 120, h: 16, type: 'platform' },
    { x: 1980, y: 340, w: 160, h: 16, type: 'platform' },
    { x: 2360, y: 320, w: 140, h: 16, type: 'platform' },
    { x: 2840, y: 340, w: 100, h: 16, type: 'platform' },
    { x: 2980, y: 300, w: 140, h: 16, type: 'platform' }
  ],
  enemies: [
    { x: 860, y: 312, vx: 1.0 },
    { x: 1240, y: 232, vx: -1.2 },
    { x: 1980, y: 292, vx: 1.1 },
    { x: 2120, y: 220, vx: 1.3, type: 'flyer', range: 220 },
    { x: 980, y: 180, vx: 1.1, type: 'flyer', range: 180 },
    { x: 1180, y: 160, vx: -1.0, type: 'flyer', range: 200 },
    { x: 1500, y: 180, vx: 1.2, type: 'flyer', range: 190 },
    { x: 1700, y: 220, vx: -1.1, type: 'flyer', range: 170 },
    { x: 1880, y: 160, vx: 1.0, type: 'flyer', range: 210 },
    { x: 2260, y: 200, vx: -1.2, type: 'flyer', range: 220 },
    { x: 2480, y: 180, vx: 1.4, type: 'flyer', range: 240 },
    { x: 2720, y: 220, vx: -1.3, type: 'flyer', range: 180 },
    { x: 2920, y: 160, vx: 1.1, type: 'flyer', range: 200 },
    { x: 3140, y: 200, vx: -1.4, type: 'flyer', range: 190 },
    { x: 840, y: 120, vx: 1.0, type: 'flyer', range: 140 },
    { x: 1080, y: 120, vx: -1.2, type: 'flyer', range: 150 },
    { x: 1380, y: 120, vx: 1.1, type: 'flyer', range: 160 },
    { x: 1620, y: 120, vx: -1.0, type: 'flyer', range: 170 },
    { x: 1840, y: 120, vx: 1.2, type: 'flyer', range: 150 },
    { x: 2100, y: 120, vx: -1.1, type: 'flyer', range: 180 },
    { x: 2360, y: 120, vx: 1.3, type: 'flyer', range: 190 },
    { x: 2600, y: 120, vx: -1.2, type: 'flyer', range: 170 },
    { x: 2860, y: 120, vx: 1.1, type: 'flyer', range: 160 },
    { x: 3120, y: 120, vx: -1.3, type: 'flyer', range: 180 },
    { x: 920, y: 240, vx: 1.0, type: 'flyer', range: 130 },
    { x: 1320, y: 260, vx: -1.2, type: 'flyer', range: 140 },
    { x: 1580, y: 240, vx: 1.1, type: 'flyer', range: 150 },
    { x: 2200, y: 240, vx: -1.1, type: 'flyer', range: 130 },
    { x: 2800, y: 240, vx: 1.2, type: 'flyer', range: 140 },
    { x: 3000, y: 240, vx: -1.3, type: 'flyer', range: 150 }
  ],
  crystals: [
    { x: 760, y: 300 },
    { x: 980, y: 260 },
    { x: 1320, y: 220 },
    { x: 1720, y: 260 },
    { x: 2120, y: 300 },
    { x: 2680, y: 320 }
  ],
  powerUps: [
    { x: 1600, y: 200 }
  ]
};
