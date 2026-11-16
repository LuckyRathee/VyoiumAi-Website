// Procedural particle bust (head, neck and shoulders), front-facing.
// Original geometry: a seeded point cloud sampled inside a stylised silhouette,
// brighter near the outline to give a glowing rim. Shared by the live canvas
// (app.js), the static SVG fallback (scripts/head-fallback.mjs) and tests.
function bustInside(x, y) {
 // Head: slightly egg-shaped ellipse, narrower at the jaw.
 const hy = (y - .49) / .35;
 const hx = x / (hy < 0 ? .25 + .035 * (1 + hy) : .285);
 if (hx * hx + hy * hy <= 1) return true;
 // Ears: small bumps at eye height.
 if (Math.abs(y - .47) < .07 && Math.abs(x) < .32 && Math.abs(x) > .22) return ((Math.abs(x) - .28) / .04) ** 2 + ((y - .47) / .07) ** 2 <= 1;
 // Neck.
 if (y <= .2 && y >= -.02 && Math.abs(x) <= .13) return true;
 // Shoulders: a sloping trapezius line from the neck, rounding over the shoulder.
 const ax = Math.abs(x);
 let top;
 if (ax < .13) top = .2;
 else if (ax < .5) top = .06 - (ax - .13) * .38;
 else if (ax < .7) top = -.08 - .22 * (1 - Math.sqrt(Math.max(0, 1 - ((ax - .5) / .2) ** 2)));
 else if (ax < .76 && y < -.42) top = -.42;
 else top = -2;
 if (y < top && y > -1) return true;
 return false;
}

function createBustPoints(small) {
 let seed = 91;
 const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
 const target = small ? 3400 : 7000;
 const points = [];
 const rays = [[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]];
 // Distance to the outline, coarsely estimated by probing outward rays.
 const edge = (x, y) => { for (const d of [.012, .025, .045, .075]) for (const [dx, dy] of rays) if (!bustInside(x + dx * d, y + dy * d)) return d; return .1; };
 let guard = 0;
 while (points.length < target && guard++ < target * 40) {
  const x = (random() - .5) * 1.9, y = -1 + random() * 1.82;
  if (!bustInside(x, y)) continue;
  const d = edge(x, y);
  const rim = d <= .012 ? 1 : d <= .025 ? .75 : d <= .045 ? .45 : d <= .075 ? .25 : .12;
  // Keep interiors sparser than outlines so the form reads as a glowing shell.
  if (random() > .5 + rim * .6) continue;
  // Fade the torso out towards the bottom of the frame.
  const fade = y < -.45 ? Math.max(0, 1 - (-.45 - y) / .55) : 1;
  if (random() > fade) continue;
  // The head carries the likeness, so give it more density than the torso.
  if (y < .14 && random() > .5) continue;
  // Soft facial cues: darker eye band, brighter brow, nose and mouth hints.
  let face = 0;
  if (Math.abs(x) < .22 && y > .2 && y < .75) {
   if (Math.abs(y - .5) < .035 && Math.abs(Math.abs(x) - .1) < .055) { if (random() < .6) continue; face = -.2; }
   if (Math.abs(x) < .025 && y > .36 && y < .5) face = .25;
   if (Math.abs(y - .33) < .012 && Math.abs(x) < .07) face = .2;
  }
  const z = Math.sqrt(Math.max(0, 1 - (x / .8) ** 2)) * (y > .14 ? .6 : .35);
  points.push({ x, y, z, bright: Math.min(1, .42 + rim * .6 + face + random() * .25), size: .5 + random() * (rim > .5 ? 1.1 : .7), phase: random() * Math.PI * 2 });
 }
 // A sparse halo of drifting dust just outside the outline.
 for (let i = 0; i < (small ? 160 : 360); i++) {
  const x = (random() - .5) * 1.9, y = -.6 + random() * 1.45;
  if (bustInside(x, y) || !rays.some(([dx, dy]) => bustInside(x + dx * .07, y + dy * .07))) continue;
  points.push({ x, y, z: 0, bright: .15 + random() * .35, size: .4 + random() * .5, phase: random() * Math.PI * 2, dust: true });
 }
 return points;
}

if (typeof globalThis !== 'undefined') { globalThis.createBustPoints = createBustPoints; globalThis.bustInside = bustInside; }
