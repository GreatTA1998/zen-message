const ink = '#1c1c1c';
const strokeWidth = 4;

export function hasDrawnInk(strokes) {
  return strokes.some((stroke) => stroke.length > 1);
}

export function paintStrokes(ctx, strokes, width, height, activeStroke = null) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = ink;
  ctx.lineWidth = strokeWidth;
  const draw = (stroke) => {
    if (!stroke || stroke.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i += 1) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    ctx.stroke();
  };
  for (const stroke of strokes) draw(stroke);
  if (activeStroke) draw(activeStroke);
}
