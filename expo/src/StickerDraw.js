import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hasDrawnInk, paintStrokes } from './stickerExport.js';

const ink = '#1c1c1c';
const paper = '#fff';
const pad = 20;
const strokeWidth = 4;
const pathProps = {
  stroke: ink,
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
};

function pointsToPath(points) {
  if (!points.length) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) d += ` L ${points[i].x} ${points[i].y}`;
  return d;
}

function WebDrawSurface({ width, height, strokes, onStrokeEnd }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const active = useRef([]);
  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;

  const repaint = useCallback(
    (activeStroke = null) => {
      const canvas = canvasRef.current;
      if (!canvas || !width || !height) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      paintStrokes(ctx, strokesRef.current, width, height, activeStroke);
    },
    [width, height],
  );

  useEffect(() => {
    repaint();
  }, [strokes, width, height, repaint]);

  const localPoint = (event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event) => {
    const point = localPoint(event);
    if (!point) return;
    drawing.current = true;
    active.current = [point];
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* unsupported target */
    }
    event.preventDefault();
  };

  const onPointerMove = (event) => {
    if (!drawing.current) return;
    const point = localPoint(event);
    if (!point) return;
    active.current.push(point);
    repaint([...active.current]);
    event.preventDefault();
  };

  const endStroke = (event) => {
    if (!drawing.current) return;
    drawing.current = false;
    try {
      event?.currentTarget?.releasePointerCapture?.(event.pointerId);
    } catch {
      /* ignore */
    }
    if (active.current.length > 1) {
      const committed = [...strokesRef.current, [...active.current]];
      strokesRef.current = committed;
      onStrokeEnd(committed);
    }
    active.current = [];
    repaint();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, touchAction: 'none', display: 'block', cursor: 'crosshair' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endStroke}
      onPointerCancel={endStroke}
      onPointerLeave={endStroke}
    />
  );
}

function NativeDrawSurface({ width, height, strokes, onStrokeEnd }) {
  const [live, setLive] = useState('');
  const active = useRef(null);
  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;

  useEffect(() => {
    if (strokes.length) return;
    active.current = null;
    setLive('');
  }, [strokes]);

  const finish = () => {
    if (active.current?.length > 1) onStrokeEnd([...strokesRef.current, active.current.slice()]);
    active.current = null;
    setLive('');
  };

  return (
    <View
      style={{ width, height }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(event) => {
        const { locationX: x, locationY: y } = event.nativeEvent;
        active.current = [{ x, y }];
        setLive('');
      }}
      onResponderMove={(event) => {
        if (!active.current) return;
        const { locationX: x, locationY: y } = event.nativeEvent;
        active.current.push({ x, y });
        setLive(pointsToPath(active.current));
      }}
      onResponderRelease={finish}
      onResponderTerminate={finish}
    >
      <Svg width={width} height={height} pointerEvents="none">
        {strokes.map((stroke, index) => (
          <Path key={`stroke-${index}`} d={pointsToPath(stroke)} {...pathProps} />
        ))}
        {live ? <Path d={live} {...pathProps} /> : null}
      </Svg>
    </View>
  );
}

export async function exportDrawnSticker(strokes, captureView, size) {
  if (!hasDrawnInk(strokes)) return null;

  if (Platform.OS === 'web') {
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    paintStrokes(ctx, strokes, size.width, size.height);
    return canvas.toDataURL('image/png');
  }

  if (!captureView) return null;
  const { captureRef } = await import('react-native-view-shot');
  const base64 = await captureRef(captureView, {
    format: 'png',
    quality: 0.92,
    result: 'base64',
  });
  if (typeof base64 !== 'string' || !base64) return null;
  return `data:image/png;base64,${base64}`;
}

export function StickerDrawModal({ visible, onCancel, onDone }) {
  const [strokes, setStrokes] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const captureRefView = useRef(null);
  const saving = useRef(false);

  useEffect(() => {
    if (!visible) {
      setStrokes([]);
      saving.current = false;
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, onCancel]);

  const finish = useCallback(async () => {
    if (saving.current) return;
    saving.current = true;
    try {
      const dataUri = await exportDrawnSticker(strokes, captureRefView, size);
      if (dataUri) onDone?.(dataUri);
    } finally {
      saving.current = false;
    }
  }, [onDone, size, strokes]);

  if (!visible) return null;

  const surface =
    size.width > 0 && size.height > 0 ? (
      <View ref={captureRefView} collapsable={false} style={styles.canvasInner}>
        {Platform.OS === 'web' ? (
          <WebDrawSurface width={size.width} height={size.height} strokes={strokes} onStrokeEnd={setStrokes} />
        ) : (
          <NativeDrawSurface width={size.width} height={size.height} strokes={strokes} onStrokeEnd={setStrokes} />
        )}
      </View>
    ) : null;

  const body = (
    <View
      style={[styles.sheet, Platform.OS === 'web' && styles.webOverlay]}
      accessibilityViewIsModal={Platform.OS === 'web' ? true : undefined}
    >
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Cancel drawing" onPress={onCancel} style={styles.headerButton}>
          <Text style={styles.headerAction}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Draw sticker</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Clear drawing" onPress={() => setStrokes([])} style={styles.headerButton}>
          <Text style={[styles.headerAction, styles.headerActionRight]}>Clear</Text>
        </Pressable>
      </View>
      <View
        style={styles.canvasFrame}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          if (width > 0 && height > 0) setSize({ width, height });
        }}
      >
        {surface}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Done" onPress={finish} style={styles.done}>
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
    </View>
  );

  if (Platform.OS === 'web') return body;
  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={onCancel}>
      {body}
    </Modal>
  );
}

const styles = StyleSheet.create({
  webOverlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2000,
    backgroundColor: '#f4f4f4',
  },
  sheet: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'web' ? 16 : 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: paper,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    zIndex: 2,
  },
  headerButton: { minWidth: 64, paddingVertical: 8, zIndex: 3 },
  headerAction: { color: ink, fontSize: 16, lineHeight: 22 },
  headerActionRight: { textAlign: 'right' },
  headerTitle: { color: ink, fontSize: 17, fontWeight: '600' },
  canvasFrame: { flex: 1, margin: pad, borderRadius: 18, overflow: 'hidden', backgroundColor: paper },
  canvasInner: { flex: 1, backgroundColor: paper },
  done: {
    marginHorizontal: pad,
    marginBottom: pad + 8,
    borderRadius: 14,
    backgroundColor: ink,
    paddingVertical: 14,
    alignItems: 'center',
    zIndex: 2,
  },
  doneText: { color: paper, fontSize: 17, fontWeight: '600' },
});
