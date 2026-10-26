const INK = [0x1c, 0x1c, 0x1c];
const PAPER = [0xff, 0xff, 0xff];
const TAIL = 12;
const STROKE = 1.25;

const cache = new Map();

export function bubbleDataUri(width, height, incoming, scale = 2) {
  const w = Math.round(width);
  const h = Math.round(height);
  const key = `${w}x${h}x${incoming ? 1 : 0}x${scale}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const uri = `data:image/png;base64,${base64(encodePng(rasterBubble(w, h, incoming, scale)))}`;
  if (cache.size > 80) cache.clear();
  cache.set(key, uri);
  return uri;
}

export function rasterBubble(width, height, incoming, scale = 1) {
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const rgba = new Uint8Array(w * h * 4);
  const poly = outlinePath(width, height, incoming).map((point) => ({
    x: point.x * scale,
    y: point.y * scale,
  }));
  const stroke = STROKE * scale;
  const half = stroke / 2;
  const segments = poly.map((point, index) => {
    const next = poly[(index + 1) % poly.length];
    return [point.x, point.y, next.x, next.y];
  });
  const samples = [
    [0.25, 0.25],
    [0.75, 0.25],
    [0.25, 0.75],
    [0.75, 0.75],
  ];
  const bounds = bodyBounds(width, height, scale, incoming);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (insideBody(x + 0.5, y + 0.5, bounds, half)) {
        const offset = (y * w + x) * 4;
        rgba[offset] = PAPER[0];
        rgba[offset + 1] = PAPER[1];
        rgba[offset + 2] = PAPER[2];
        rgba[offset + 3] = 255;
        continue;
      }
      let paper = 0;
      let ink = 0;
      for (let s = 0; s < samples.length; s += 1) {
        const px = x + samples[s][0];
        const py = y + samples[s][1];
        const dist = Math.min(distanceToSegments(px, py, segments), 64);
        const sd = pointInside(px, py, poly) ? -dist : dist;
        const outer = Math.abs(sd) - half;
        const inkCover = clamp01(0.5 - outer);
        const paperCover = clamp01(0.5 - (sd + half));
        ink += inkCover;
        paper += paperCover * (1 - inkCover);
      }
      ink /= samples.length;
      paper /= samples.length;
      const alpha = ink + paper;
      if (alpha <= 0) continue;
      const offset = (y * w + x) * 4;
      rgba[offset] = Math.round((INK[0] * ink + PAPER[0] * paper) / alpha);
      rgba[offset + 1] = Math.round((INK[1] * ink + PAPER[1] * paper) / alpha);
      rgba[offset + 2] = Math.round((INK[2] * ink + PAPER[2] * paper) / alpha);
      rgba[offset + 3] = Math.round(alpha * 255);
    }
  }

  return { width: w, height: h, rgba };
}

export function outlinePath(width, height, incoming) {
  const path = ownPath(width, height);
  if (!incoming) return path;
  return path.map((point) => ({ x: width - point.x, y: height - point.y }));
}

function ownPath(width, height) {
  const margin = STROKE;
  const tail = Math.min(TAIL, Math.max(8, height * 0.28));
  const left = margin;
  const top = margin;
  const right = width - margin;
  const bottom = height - tail;
  const radius = Math.max(8, Math.min(16, (right - left) / 2 - 4, (bottom - top) / 2 - 2));
  const points = [];
  arc(points, left + radius, top + radius, radius, Math.PI, Math.PI * 1.5);
  arc(points, right - radius, top + radius, radius, Math.PI * 1.5, Math.PI * 2);
  const wall = { x: right, y: Math.max(top + radius, bottom - 3) };
  add(points, wall.x, wall.y);
  const tip = { x: right - Math.min(4, radius * 0.3), y: height - margin };
  const back = { x: Math.max(left + radius + 6, right - Math.min(26, radius + 10)), y: bottom };
  cubic(
    points,
    wall,
    { x: right, y: bottom + tail * 0.35 },
    { x: tip.x + 2, y: tip.y },
    tip,
  );
  cubic(
    points,
    tip,
    { x: tip.x - 8, y: bottom + tail * 0.2 },
    { x: back.x + 6, y: bottom },
    back,
  );
  arc(points, left + radius, bottom - radius, radius, Math.PI / 2, Math.PI);
  return points;
}

function bodyBounds(width, height, scale, incoming) {
  const margin = STROKE;
  const tail = Math.min(TAIL, Math.max(8, height * 0.28));
  const radius = Math.max(8, Math.min(16, (width - margin * 2) / 2 - 4, (height - tail - margin * 2) / 2 - 2));
  const top = incoming ? tail + 2 : margin + 2;
  const bottom = incoming ? height - margin - 2 : height - tail - 2;
  return {
    left: (margin + radius) * scale,
    right: (width - margin - radius) * scale,
    top: top * scale,
    bottom: bottom * scale,
  };
}

function insideBody(x, y, bounds, half) {
  return x > bounds.left && x < bounds.right && y > bounds.top + half && y < bounds.bottom - half;
}

function arc(points, cx, cy, radius, start, end) {
  const steps = 6;
  for (let step = 0; step <= steps; step += 1) {
    const angle = start + ((end - start) * step) / steps;
    add(points, cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }
}

function cubic(points, p0, p1, p2, p3) {
  const steps = 8;
  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    const u = 1 - t;
    add(
      points,
      u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    );
  }
}

function add(points, x, y) {
  const last = points[points.length - 1];
  if (last && Math.abs(last.x - x) < 0.05 && Math.abs(last.y - y) < 0.05) return;
  points.push({ x, y });
}

function distanceToSegments(x, y, segments) {
  let best = Infinity;
  for (let index = 0; index < segments.length; index += 1) {
    const [ax, ay, bx, by] = segments[index];
    const abx = bx - ax;
    const aby = by - ay;
    const length = abx * abx + aby * aby;
    const t = length === 0 ? 0 : clamp01(((x - ax) * abx + (y - ay) * aby) / length);
    const dx = ax + abx * t - x;
    const dy = ay + aby * t - y;
    const dist = Math.hypot(dx, dy);
    if (dist < best) best = dist;
  }
  return best;
}

function pointInside(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const yi = poly[i].y;
    const yj = poly[j].y;
    if ((yi > y) !== (yj > y) && x < ((poly[j].x - poly[i].x) * (y - yi)) / (yj - yi) + poly[i].x) {
      inside = !inside;
    }
  }
  return inside;
}

function clamp01(value) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function encodePng({ width, height, rgba }) {
  const stride = width * 4;
  const raw = new Uint8Array((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (stride + 1);
    raw[row] = y === 0 ? 0 : 2;
    for (let x = 0; x < stride; x += 1) {
      const value = rgba[y * stride + x];
      raw[row + 1 + x] = y === 0 ? value : (value - rgba[(y - 1) * stride + x]) & 255;
    }
  }
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return concat([signature, chunk('IHDR', ihdr), chunk('IDAT', zlib(raw)), chunk('IEND', new Uint8Array())]);
}

function chunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  const header = new DataView(out.buffer);
  header.setUint32(0, data.length);
  out[4] = type.charCodeAt(0);
  out[5] = type.charCodeAt(1);
  out[6] = type.charCodeAt(2);
  out[7] = type.charCodeAt(3);
  out.set(data, 8);
  header.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const LEN_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
const LEN_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

const LIT_CODES = (() => {
  const lengths = new Array(288).fill(0);
  for (let i = 0; i <= 143; i += 1) lengths[i] = 8;
  for (let i = 144; i <= 255; i += 1) lengths[i] = 9;
  for (let i = 256; i <= 279; i += 1) lengths[i] = 7;
  for (let i = 280; i <= 287; i += 1) lengths[i] = 8;
  const count = new Array(16).fill(0);
  lengths.forEach((len) => {
    if (len) count[len] += 1;
  });
  const next = new Array(16).fill(0);
  let code = 0;
  for (let bits = 1; bits < 16; bits += 1) {
    code = (code + count[bits - 1]) << 1;
    next[bits] = code;
  }
  return lengths.map((len) => {
    if (!len) return null;
    const value = next[len];
    next[len] += 1;
    return { code: value, len };
  });
})();

function zlib(data) {
  const bits = [];
  const push = (bit) => bits.push(bit & 1);
  push(1);
  push(1);
  push(0);
  const symbol = (value) => {
    const item = LIT_CODES[value];
    for (let i = item.len - 1; i >= 0; i -= 1) push((item.code >> i) & 1);
  };
  const extra = (value, count) => {
    for (let i = 0; i < count; i += 1) push((value >> i) & 1);
  };
  for (let i = 0; i < data.length; ) {
    if (i > 0 && data[i] === data[i - 1]) {
      let len = 1;
      while (i + len < data.length && len < 258 && data[i + len] === data[i - 1]) len += 1;
      if (len >= 3) {
        let index = LEN_BASE.length - 1;
        while (len < LEN_BASE[index]) index -= 1;
        symbol(257 + index);
        extra(len - LEN_BASE[index], LEN_EXTRA[index]);
        for (let bit = 4; bit >= 0; bit -= 1) push(0);
        i += len;
        continue;
      }
    }
    symbol(data[i]);
    i += 1;
  }
  symbol(256);
  const bytes = new Uint8Array(Math.ceil(bits.length / 8));
  for (let i = 0; i < bits.length; i += 1) bytes[i >> 3] |= bits[i] << (i & 7);
  const sum = adler32(data);
  const out = new Uint8Array(2 + bytes.length + 4);
  out[0] = 0x78;
  out[1] = 0x01;
  out.set(bytes, 2);
  out[out.length - 4] = (sum >>> 24) & 255;
  out[out.length - 3] = (sum >>> 16) & 255;
  out[out.length - 2] = (sum >>> 8) & 255;
  out[out.length - 1] = sum & 255;
  return out;
}

function adler32(data) {
  let a = 1;
  let b = 0;
  for (let i = 0; i < data.length; i += 1) {
    a += data[i];
    b += a;
    if ((i & 4095) === 0) {
      a %= 65521;
      b %= 65521;
    }
  }
  a %= 65521;
  b %= 65521;
  return ((b << 16) | a) >>> 0;
}

function concat(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  parts.forEach((part) => {
    out.set(part, offset);
    offset += part.length;
  });
  return out;
}

function base64(bytes) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triple = (a << 16) | (b << 8) | c;
    out += alphabet[(triple >> 18) & 63];
    out += alphabet[(triple >> 12) & 63];
    out += i + 1 < bytes.length ? alphabet[(triple >> 6) & 63] : '=';
    out += i + 2 < bytes.length ? alphabet[triple & 63] : '=';
  }
  return out;
}
