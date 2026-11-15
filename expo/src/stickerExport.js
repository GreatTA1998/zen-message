const ink = '#1c1c1c';
export const STROKE_WIDTH = 4;

export function hasDrawnInk(strokes) {
  return strokes.some((stroke) => stroke.length > 1);
}

/** Tight bounds around ink, including stroke radius. */
export function inkBounds(strokes, strokeWidth = STROKE_WIDTH) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let found = false;
  for (const stroke of strokes) {
    if (!stroke || stroke.length < 2) continue;
    for (const { x, y } of stroke) {
      found = true;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!found) return null;
  const p = strokeWidth / 2 + 2;
  return { x: minX - p, y: minY - p, width: maxX - minX + p * 2, height: maxY - minY + p * 2 };
}

export function clampCrop(crop, canvasWidth, canvasHeight) {
  if (!crop || canvasWidth <= 0 || canvasHeight <= 0) return null;
  const width = Math.min(Math.max(1, crop.width), canvasWidth);
  const height = Math.min(Math.max(1, crop.height), canvasHeight);
  return {
    x: Math.min(Math.max(0, crop.x), canvasWidth - width),
    y: Math.min(Math.max(0, crop.y), canvasHeight - height),
    width,
    height,
  };
}

function strokePath(ctx, stroke) {
  if (!stroke || stroke.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(stroke[0].x, stroke[0].y);
  for (let i = 1; i < stroke.length; i += 1) ctx.lineTo(stroke[i].x, stroke[i].y);
  ctx.stroke();
}

export function paintStrokes(ctx, strokes, width, height, activeStroke = null, origin = null) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = ink;
  ctx.lineWidth = STROKE_WIDTH;
  if (origin) {
    ctx.save();
    ctx.translate(-origin.x, -origin.y);
  }
  for (const stroke of strokes) strokePath(ctx, stroke);
  if (activeStroke) strokePath(ctx, activeStroke);
  if (origin) ctx.restore();
}
