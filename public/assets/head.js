// Procedural particle bust: a front-facing human head, neck and shoulders.
// Original geometry, not derived from any image. Units: head height = 1,
// y grows downward from the crown, x is horizontal (0 = centre line).
//   1. A smooth anatomical outline (right half, mirrored) gives the silhouette.
//   2. A depth field (head ellipsoid with gentle facial relief, neck, chest)
//      gives volume; surface normals drive key and rim lighting.
//   3. Particles are sampled with density proportional to that lighting, so
//      the figure reads as a lit 3D form rather than a flat cut-out.
// Shared by the live canvas (app.js), the static fallback
// (scripts/head-fallback.mjs) and the tests.
var BUST = (function () {
 // Right-half outline, crown to crop line, following standard head-unit
 // proportions: head width ~0.76, neck ~0.47, shoulders ~2.1 head heights.
 var OUTLINE = [
  [0, 0], [.13, .015], [.24, .06], [.32, .14], [.365, .25], [.38, .37], [.38, .45],
  [.392, .5], [.398, .56], [.393, .63], [.375, .69],                 // ear, flush with skull
  [.355, .74], [.33, .80], [.295, .86], [.262, .91],                 // jaw to neck
  [.24, .96], [.232, 1.03], [.236, 1.11], [.256, 1.18],              // neck
  [.31, 1.24], [.43, 1.3], [.58, 1.35], [.72, 1.4], [.84, 1.46],     // trapezius
  [.93, 1.54], [.99, 1.65], [1.025, 1.79], [1.04, 1.95], [1.048, 2.15], [1.052, 2.45], [1.055, 2.8]
 ];
 // Skull and face width without ears (crown to chin), used for head volume.
 var HEAD = [[0, 0], [.13, .015], [.24, .06], [.32, .14], [.365, .25], [.378, .37], [.379, .47], [.372, .58], [.36, .67], [.343, .75], [.315, .82], [.275, .88], [.21, .94], [.11, .985], [0, 1.0]];
 var MAX_Y = 2.8;

 function catmull(pts, steps) {
  var out = [];
  for (var i = 0; i < pts.length - 1; i++) {
   var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
   for (var s = 0; s < steps; s++) {
    var t = s / steps, t2 = t * t, t3 = t2 * t;
    out.push([0, 1].map(function (k) {
     return .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
    }));
   }
  }
  out.push(pts[pts.length - 1]);
  return out;
 }
 // Tabulate half-width against y for fast lookups.
 function table(pts, y0, y1, n) {
  var curve = catmull(pts, 24), tab = new Float32Array(n + 1);
  for (var i = 0; i <= n; i++) {
   var y = y0 + (y1 - y0) * i / n, w = 0;
   for (var j = 0; j < curve.length - 1; j++) {
    var a = curve[j], b = curve[j + 1];
    if ((y >= a[1] && y <= b[1]) || (y <= a[1] && y >= b[1])) { var f = b[1] === a[1] ? 0 : (y - a[1]) / (b[1] - a[1]); w = Math.max(w, a[0] + (b[0] - a[0]) * f); }
   }
   tab[i] = w;
  }
  return function (y) { if (y < y0 || y > y1) return 0; var f = (y - y0) / (y1 - y0) * n, i = Math.floor(f), r = f - i; return i >= n ? tab[n] : tab[i] * (1 - r) + tab[i + 1] * r; };
 }
 var halfWidth = table(OUTLINE, 0, MAX_Y, 1400);
 var headWidth = table(HEAD, 0, 1.0, 600);
 var g = function (v, c, s) { var d = (v - c) / s; return Math.exp(-d * d); };
 var smax = function (a, b, k) { var m = Math.max(a, b); return m + k * Math.log(Math.exp((a - m) / k) + Math.exp((b - m) / k)); };
 var smooth = function (e0, e1, v) { var t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

 function inside(x, y) { return y >= 0 && y <= MAX_Y && Math.abs(x) <= halfWidth(y); }

 function headDepth(x, y) {
  var w = headWidth(y);
  if (!(w > 0) || Math.abs(x) > w) return -1;
  var ax = Math.abs(x);
  var z = .34 * Math.sqrt(Math.max(0, 1 - (x / w) * (x / w))) * Math.sqrt(Math.max(0, 1 - Math.pow((y - .5) / .58, 2)));
  // Gentle relief only: brow, eye sockets, nose, lips, chin, cheekbones.
  z += .035 * g(ax, .15, .11) * g(y, .42, .035);
  z -= .055 * g(ax, .15, .075) * g(y, .505, .045);
  z += .02 * g(ax, .15, .045) * g(y, .51, .022);
  z += .065 * g(x, 0, .042) * g(y, .62, .11);
  z += .05 * g(x, 0, .05) * g(y, .71, .04);
  z += .02 * g(ax, .055, .03) * g(y, .735, .025);
  z -= .018 * g(x, 0, .06) * g(y, .77, .015);
  z += .028 * g(x, 0, .09) * g(y, .805, .02);
  z -= .022 * g(x, 0, .085) * g(y, .83, .008);
  z += .028 * g(x, 0, .075) * g(y, .855, .02);
  z += .04 * g(x, 0, .1) * g(y, .95, .05);
  z += .028 * g(ax, .25, .07) * g(y, .6, .08);
  z -= .015 * g(ax, .34, .05) * g(y, .37, .08);
  return z;
 }
 function neckDepth(x, y) {
  if (y < .8 || y > 1.45) return -1;
  var w = halfWidth(Math.min(y, 1.18)) || .24;
  if (Math.abs(x) > w) return -1;
  return .2 * Math.sqrt(Math.max(0, 1 - (x / w) * (x / w))) - .05 + .012 * g(Math.abs(x), .12, .04) * g(y, 1.08, .12);
 }
 // y of the shoulder line above a given |x| (for rounding the top edge).
 var topTab = (function () { var t = new Float32Array(1101); for (var i = 0; i <= 1100; i++) { var x = i / 1000, y = 1.1; while (y < MAX_Y && halfWidth(y) < x) y += .0005; t[i] = y; } return t; })();
 function shoulderTop(ax) { var f = Math.min(1100, ax * 1000), i = Math.floor(f), r = f - i; return i >= 1100 ? topTab[1100] : topTab[i] * (1 - r) + topTab[i + 1] * r; }
 function torsoDepth(x, y) {
  if (y < 1.12) return -1;
  var w = halfWidth(y), ax = Math.abs(x);
  if (ax > w) return -1;
  var round = Math.sqrt(smooth(0, .18, y - shoulderTop(ax)));
  // Near the neck the chest rises to meet it instead of rounding off.
  round = round + (1 - round) * (1 - smooth(.2, .42, ax)) * smooth(1.12, 1.3, y);
  var z = .36 * Math.sqrt(Math.max(0, 1 - (x / w) * (x / w))) * (.25 + .75 * round) - .08;
  z += .012 * g(y - (1.32 + .09 * ax), 0, .022) * g(ax, .36, .3) * smooth(.04, .1, ax);
  z -= .015 * g(x, 0, .05) * g(y, 1.31, .045);
  z += .05 * g(ax, .36, .2) * g(y, 1.82, .24);
  z -= .014 * g(x, 0, .04) * g(y, 1.9, .3);
  z += .035 * g(ax, .9, .12) * g(y, 1.62, .2);
  z -= .035 * g(ax, .84, .025) * smooth(1.85, 2.1, y);
  return z;
 }
 function depth(x, y) {
  var h = headDepth(x, y), n = neckDepth(x, y), t = torsoDepth(x, y);
  var z = -1;
  if (h > -1) z = h;
  if (n > -1) z = z > -1 ? smax(z, n, .02) : n;
  if (t > -1) z = z > -1 ? smax(z, t, .035) : t;
  return z;
 }
 // Key light from upper left and front; rim light comes from steep normals.
 var L = (function () { var v = [-.38, -.48, .79], m = Math.hypot(v[0], v[1], v[2]); return [v[0] / m, v[1] / m, v[2] / m]; })();
 function shade(x, y) {
  var e = .004, z = depth(x, y);
  var dx = (depth(x + e, y) - depth(x - e, y)) / (2 * e), dy = (depth(x, y + e) - depth(x, y - e)) / (2 * e);
  if (!isFinite(dx) || Math.abs(dx) > 8) dx = Math.sign(x) * 8;
  if (!isFinite(dy) || Math.abs(dy) > 8) dy = 0;
  var m = Math.hypot(dx, dy, 1), nx = -dx / m, ny = -dy / m, nz = 1 / m;
  var lambert = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
  var rim = Math.pow(1 - nz, 1.4);
  return { z: z, light: Math.min(1, .14 + .7 * lambert + .7 * rim) };
 }

 function createBustPoints(small) {
  var seed = 1337;
  var random = function () { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  var target = small ? 4200 : 9000, points = [], guard = 0;
  while (points.length < target && guard++ < target * 60) {
   var x = (random() - .5) * 2.12, y = random() * MAX_Y;
   if (!inside(x, y)) continue;
   var s = shade(x, y);
   var region = y < 1.0 ? 1 : y < 1.25 ? .8 : .62;
   var fade = 1 - smooth(1.95, 2.75, y);
   if (random() > Math.pow(s.light, 1.25) * region * fade) continue;
   var j = random() < .18 ? .035 : .008; x += (random() - .5) * j; y += (random() - .5) * j;
   points.push({ x: x, y: y, z: s.z, bright: Math.min(1, .25 + s.light * .85), size: .6 + random() * (s.light > .7 ? 1.1 : .6), phase: random() * Math.PI * 2 });
  }
  // A crisp outline traced along the silhouette edge.
  var edge = small ? 420 : 900;
  for (var i = 0; i < edge; i++) {
   var yy = random() * 2.3, side = random() < .5 ? -1 : 1, xx = side * halfWidth(yy) * (.985 + random() * .015);
   if (random() > 1 - smooth(1.8, 2.3, yy)) continue;
   points.push({ x: xx, y: yy, z: 0, bright: .7 + random() * .3, size: .7 + random() * .6, phase: random() * Math.PI * 2, edge: true });
  }
  // Burst particles: lifted off the surface and sent drifting outward from the
  // chest, so the figure reads as a human dissolving into data. Renderers
  // animate them along (dx, dy) by burst * progress, fading as they travel.
  var body = points.filter(function (p) { return !p.edge && p.y < 2.1; });
  var bursts = small ? 1600 : 3600;
  for (var b = 0; b < bursts; b++) {
   var src = random() < .6 ? points[Math.floor(random() * points.length)] : body[Math.floor(random() * body.length)];
   if (!src || src.y > 2.1) { b--; continue; }
   var ox = src.x, oy = src.y - 1.25;
   var ang = Math.atan2(oy, ox) + (random() - .5) * 1.1, dist = .3 + Math.pow(random(), 1.3) * 1.25;
   points.push({ x: src.x, y: src.y, z: src.z, bright: .6 + random() * .4, size: .8 + random() * 1.2, phase: random(), burst: dist, dx: Math.cos(ang), dy: Math.sin(ang) - .3, speed: .045 + random() * .08 });
  }
  return points;
 }
 return { OUTLINE: OUTLINE, MAX_Y: MAX_Y, halfWidth: halfWidth, inside: inside, depth: depth, shade: shade, createBustPoints: createBustPoints };
})();
var createBustPoints = BUST.createBustPoints;
