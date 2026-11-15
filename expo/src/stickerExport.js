const ink = '#1c1c1c';
export const STROKE_WIDTH = 4;
export const MIN_CROP = 48;

export function hasDrawnInk(strokes) {
  return strokes.some((stroke) => stroke.length > 1);
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

export function applyCropDrag(crop, mode, dx, dy, canvasWidth, canvasHeight, minSize = MIN_CROP) {
  if (!crop) return null;
  let { x, y, width, height } = crop;
  if (mode === 'move') {
    return clampCrop({ x: x + dx, y: y + dy, width, height }, canvasWidth, canvasHeight);
  }
  let right = x + width;
  let bottom = y + height;
  if (mode.includes('w')) x = Math.min(right - minSize, Math.max(0, x + dx));
  if (mode.includes('e')) right = Math.max(x + minSize, Math.min(canvasWidth, right + dx));
  if (mode.includes('n')) y = Math.min(bottom - minSize, Math.max(0, y + dy));
  if (mode.includes('s')) bottom = Math.max(y + minSize, Math.min(canvasHeight, bottom + dy));
  return { x, y, width: right - x, height: bottom - y };
}

function strokePath(ctx, stroke) {
  if (!stroke || stroke.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(stroke[0].x, stroke[0].y);
  for (let i = 1; i < stroke.length; i += 1) ctx.lineTo(stroke[i].x, stroke[i].y);
  ctx.stroke();
}

export function paintStrokes(ctx, strokes, width, height, origin = null) {
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
  if (origin) ctx.restore();
}
