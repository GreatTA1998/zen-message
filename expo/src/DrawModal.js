import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { applyCropDrag, clampCrop, hasDrawnInk, paintStrokes, STROKE_WIDTH } from './stickerExport.js';
import { ink, paper } from './chatTheme.js';
const pad = 20, hit = 44, pathProps = { stroke: ink, strokeWidth: STROKE_WIDTH, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
const dim = 'rgba(0,0,0,0.45)', rim = 22, grip = (mode) => (mode.length > 1 ? styles.cropKnobCorner : mode === 'n' || mode === 's' ? styles.cropKnobEdgeH : styles.cropKnobEdgeV);
const pointsToPath = (pts) => { if (!pts.length) return ''; let d = `M ${pts[0].x} ${pts[0].y}`; for (let i = 1; i < pts.length; i += 1) d += ` L ${pts[i].x} ${pts[i].y}`; return d; };
const fullCrop = ({ width: w, height: h }) => clampCrop({ x: 10, y: 10, width: w - 20, height: h - 20 }, w, h);
function DrawSurface({ width, height, strokes, onStrokeEnd }) {
  const [live, setLive] = useState(''), active = useRef(null), strokesRef = useRef(strokes);
  strokesRef.current = strokes;
  useEffect(() => { if (strokes.length) return; active.current = null; setLive(''); }, [strokes]);
  const finish = () => { if (active.current?.length > 1) onStrokeEnd([...strokesRef.current, active.current.slice()]); active.current = null; setLive(''); };
  const pan = (dx, dy) => (e) => {
    const { locationX: x, locationY: y } = e.nativeEvent;
    if (dx) { if (!active.current) return; active.current.push({ x, y }); setLive(pointsToPath(active.current)); return; }
    active.current = [{ x, y }]; setLive('');
  };
  return (
    <View style={{ width, height }} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderTerminationRequest={() => false} onResponderGrant={pan()} onResponderMove={pan(1)} onResponderRelease={finish} onResponderTerminate={finish}>
      <Svg width={width} height={height} pointerEvents="none">
        {strokes.map((s, i) => <Path key={`stroke-${i}`} d={pointsToPath(s)} {...pathProps} />)}
        {live ? <Path d={live} {...pathProps} /> : null}
      </Svg>
    </View>
  );
}
function useCropDrag(crop, canvas, onChange) {
  const drag = useRef(null);
  return (mode) => ({
    onStartShouldSetResponder: () => true, onMoveShouldSetResponder: () => true, onResponderTerminationRequest: () => false,
    onResponderGrant: (e) => { drag.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY, crop, mode }; },
    onResponderMove: (e) => { if (!drag.current) return; onChange(applyCropDrag(drag.current.crop, drag.current.mode, e.nativeEvent.pageX - drag.current.x, e.nativeEvent.pageY - drag.current.y, canvas.width, canvas.height)); },
    onResponderRelease: () => { drag.current = null; }, onResponderTerminate: () => { drag.current = null; },
  });
}
function CropOverlay({ crop, canvas, onChange }) {
  const bind = useCropDrag(crop, canvas, onChange);
  if (!crop) return null;
  const { x, y, width, height } = crop, midX = x + width / 2, midY = y + height / 2, move = bind('move'), abs = { position: 'absolute' };
  const dims = [{ ...abs, left: 0, top: 0, right: 0, height: y, backgroundColor: dim }, { ...abs, left: 0, top: y + height, right: 0, bottom: 0, backgroundColor: dim }, { ...abs, left: 0, top: y, width: x, height, backgroundColor: dim }, { ...abs, left: x + width, top: y, right: 0, height, backgroundColor: dim }];
  const rims = [{ left: x, top: y - rim / 2, width, height: rim }, { left: x, top: y + height - rim / 2, width, height: rim }, { left: x - rim / 2, top: y, width: rim, height }, { left: x + width - rim / 2, top: y, width: rim, height }];
  const handles = [['nw', x, y], ['n', midX, y], ['ne', x + width, y], ['e', x + width, midY], ['se', x + width, y + height], ['s', midX, y + height], ['sw', x, y + height], ['w', x, midY]];
  const grid = [{ left: width / 3, top: 0, bottom: 0, width: StyleSheet.hairlineWidth }, { left: (width * 2) / 3, top: 0, bottom: 0, width: StyleSheet.hairlineWidth }, { top: height / 3, left: 0, right: 0, height: StyleSheet.hairlineWidth }, { top: (height * 2) / 3, left: 0, right: 0, height: StyleSheet.hairlineWidth }];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {dims.map((style, i) => <View key={`dim-${i}`} pointerEvents="none" style={style} />)}
      <View pointerEvents="none" style={[styles.cropFrame, { left: x, top: y, width, height }]}>{grid.map((g, i) => <View key={`grid-${i}`} style={[styles.gridLine, g]} />)}</View>
      {rims.map((style, i) => <View key={`rim-${i}`} accessibilityLabel="Move crop" style={{ ...abs, zIndex: 5, ...style }} {...move} />)}
      {handles.map(([mode, hx, hy]) => <View key={mode} accessibilityLabel={`Resize crop ${mode}`} style={[styles.cropHit, { left: hx - hit / 2, top: hy - hit / 2 }]} {...bind(mode)}><View style={[styles.cropKnob, grip(mode)]} /></View>)}
    </View>
  );
}
async function exportDrawnSticker(strokes, captureView, size, crop) {
  if (!hasDrawnInk(strokes)) return null;
  const rect = crop?.width > 0 && crop?.height > 0 ? crop : { x: 0, y: 0, width: size.width, height: size.height };
  if (Platform.OS === 'web') {
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(rect.width)); canvas.height = Math.max(1, Math.round(rect.height));
    const ctx = canvas.getContext('2d'); return ctx ? (paintStrokes(ctx, strokes, canvas.width, canvas.height, rect), canvas.toDataURL('image/png')) : null;
  }
  if (!captureView) return null;
  const { captureRef } = await import('react-native-view-shot');
  const base64 = await captureRef(captureView, { format: 'png', quality: 0.92, result: 'base64' });
  return typeof base64 === 'string' && base64 ? `data:image/png;base64,${base64}` : null;
}
export function DrawModal({ visible, onCancel, onDone }) {
  const insets = useSafeAreaInsets(), [strokes, setStrokes] = useState([]), [size, setSize] = useState({ width: 0, height: 0 }), [crop, setCrop] = useState(null);
  const captureRefView = useRef(null), saving = useRef(false);
  const commitStrokes = useCallback((next) => { setStrokes(next); setCrop((prev) => prev ?? fullCrop(size)); }, [size]);
  useEffect(() => { if (!visible) { setStrokes([]); setCrop(null); saving.current = false; } }, [visible]);
  useEffect(() => { if (!visible || Platform.OS !== 'web') return undefined; const onKeyDown = (e) => { if (e.key === 'Escape') onCancel?.(); }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [visible, onCancel]);
  const finish = useCallback(async () => { if (saving.current) return; saving.current = true; try { const dataUri = await exportDrawnSticker(strokes, captureRefView, size, crop); if (dataUri) onDone?.(dataUri); } finally { saving.current = false; } }, [crop, onDone, size, strokes]);
  if (!visible) return null;
  const topPad = Math.max(insets.top, Platform.OS === 'web' ? 16 : 8);
  const surface = size.width > 0 && size.height > 0 ? (
    <View style={styles.canvasInner}>
      <DrawSurface width={size.width} height={size.height} strokes={strokes} onStrokeEnd={commitStrokes} />
      <CropOverlay crop={crop} canvas={size} onChange={setCrop} />
      {Platform.OS !== 'web' && crop ? (
        <View ref={captureRefView} collapsable={false} pointerEvents="none" style={[styles.exportCapture, { width: Math.round(crop.width), height: Math.round(crop.height) }]}>
          <Svg width={Math.round(crop.width)} height={Math.round(crop.height)}>
            {strokes.map((s, i) => <Path key={`export-${i}`} d={pointsToPath(s.map((p) => ({ x: p.x - crop.x, y: p.y - crop.y })))} {...pathProps} />)}
          </Svg>
        </View>
      ) : null}
    </View>
  ) : null;
  const body = (
    <View style={[styles.sheet, Platform.OS === 'web' && styles.webOverlay]} accessibilityViewIsModal={Platform.OS === 'web' ? true : undefined}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Cancel drawing" onPress={onCancel} style={styles.headerButton}><Text style={styles.headerAction}>Cancel</Text></Pressable>
        <Text style={styles.headerTitle}>Draw</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Clear drawing" onPress={() => { setStrokes([]); setCrop(null); }} style={styles.headerButton}><Text style={[styles.headerAction, styles.headerActionRight]}>Clear</Text></Pressable>
      </View>
      <View style={styles.canvasFrame} onLayout={(e) => { const { width, height } = e.nativeEvent.layout; if (width <= 0 || height <= 0) return; setSize({ width, height }); setCrop((prev) => (prev ? clampCrop(prev, width, height) : strokes.length ? fullCrop({ width, height }) : null)); }}>{surface}</View>
      <Pressable accessibilityRole="button" accessibilityLabel="Done" onPress={finish} style={[styles.done, { marginBottom: pad + Math.max(insets.bottom, 8) }]}><Text style={styles.doneText}>Done</Text></Pressable>
    </View>
  );
  return Platform.OS === 'web' ? body : <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={onCancel}>{body}</Modal>;
}
const styles = StyleSheet.create({
  webOverlay: { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 2000, backgroundColor: '#f4f4f4' },
  sheet: { flex: 1, backgroundColor: '#f4f4f4' }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10, backgroundColor: paper, borderBottomWidth: 1, borderBottomColor: '#e5e5e5', zIndex: 2 },
  headerButton: { minWidth: 64, paddingVertical: 8, zIndex: 3 }, headerAction: { color: ink, fontSize: 16, lineHeight: 22 }, headerActionRight: { textAlign: 'right' }, headerTitle: { color: ink, fontSize: 17, fontWeight: '600' },
  canvasFrame: { flex: 1, margin: pad, borderRadius: 18, overflow: 'hidden', backgroundColor: paper }, canvasInner: { flex: 1, backgroundColor: paper },
  cropFrame: { position: 'absolute', borderWidth: 2, borderColor: ink, zIndex: 4 }, gridLine: { position: 'absolute', backgroundColor: 'rgba(28,28,28,0.35)' },
  cropHit: { position: 'absolute', width: hit, height: hit, alignItems: 'center', justifyContent: 'center', zIndex: 6 }, cropKnob: { backgroundColor: paper, borderWidth: 2, borderColor: ink, borderRadius: 1 },
  cropKnobCorner: { width: 16, height: 16 }, cropKnobEdgeH: { width: 24, height: 5 }, cropKnobEdgeV: { width: 5, height: 24 },
  exportCapture: { position: 'absolute', left: -10000, top: 0, backgroundColor: paper, overflow: 'hidden' },
  done: { marginHorizontal: pad, borderRadius: 14, backgroundColor: ink, paddingVertical: 14, alignItems: 'center', zIndex: 2 }, doneText: { color: paper, fontSize: 17, fontWeight: '600' },
});