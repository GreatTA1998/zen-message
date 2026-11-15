import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { clampCrop, hasDrawnInk, inkBounds, paintStrokes, STROKE_WIDTH } from './stickerExport.js';

const ink = '#1c1c1c';
const paper = '#fff';
const pad = 20;
const pathProps = {
  stroke: ink,
  strokeWidth: STROKE_WIDTH,
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

function cropFor(strokes, size, nudge) {
  const bounds = inkBounds(strokes);
  if (!bounds || !size.width) return null;
  return clampCrop({ ...bounds, x: bounds.x + nudge.x, y: bounds.y + nudge.y }, size.width, size.height);
}

function DrawSurface({ width, height, strokes, onStrokeEnd }) {
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

export async function exportDrawnSticker(strokes, captureView, size, crop) {
  if (!hasDrawnInk(strokes)) return null;
  const rect = crop?.width > 0 && crop?.height > 0 ? crop : { x: 0, y: 0, width: size.width, height: size.height };

  if (Platform.OS === 'web') {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    paintStrokes(ctx, strokes, canvas.width, canvas.height, null, rect);
    return canvas.toDataURL('image/png');
  }

  if (!captureView) return null;
  const { captureRef } = await import('react-native-view-shot');
  const base64 = await captureRef(captureView, { format: 'png', quality: 0.92, result: 'base64' });
  return typeof base64 === 'string' && base64 ? `data:image/png;base64,${base64}` : null;
}

export function StickerDrawModal({ visible, onCancel, onDone }) {
  const [strokes, setStrokes] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [nudge, setNudge] = useState({ x: 0, y: 0 });
  const captureRefView = useRef(null);
  const drag = useRef(null);
  const saving = useRef(false);
  const crop = cropFor(strokes, size, nudge);

  const commitStrokes = useCallback((next) => {
    setNudge({ x: 0, y: 0 });
    setStrokes(next);
  }, []);

  useEffect(() => {
    if (!visible) {
      setStrokes([]);
      setNudge({ x: 0, y: 0 });
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
      const dataUri = await exportDrawnSticker(strokes, captureRefView, size, crop);
      if (dataUri) onDone?.(dataUri);
    } finally {
      saving.current = false;
    }
  }, [crop, onDone, size, strokes]);

  if (!visible) return null;

  const surface =
    size.width > 0 && size.height > 0 ? (
      <View style={styles.canvasInner}>
        <DrawSurface width={size.width} height={size.height} strokes={strokes} onStrokeEnd={commitStrokes} />
        {crop ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View pointerEvents="none" style={[styles.cropFrame, crop]} />
            <View
              accessibilityRole="adjustable"
              accessibilityLabel="Adjust crop"
              style={[
                styles.cropHandle,
                { left: crop.x + crop.width / 2 - 18, top: Math.min(crop.y + crop.height - 6, size.height - 24) },
              ]}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderTerminationRequest={() => false}
              onResponderGrant={(event) => {
                drag.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY, nudge };
              }}
              onResponderMove={(event) => {
                if (!drag.current) return;
                setNudge({
                  x: drag.current.nudge.x + event.nativeEvent.pageX - drag.current.x,
                  y: drag.current.nudge.y + event.nativeEvent.pageY - drag.current.y,
                });
              }}
              onResponderRelease={() => {
                drag.current = null;
              }}
            />
          </View>
        ) : null}
        {Platform.OS !== 'web' && crop ? (
          <View
            ref={captureRefView}
            collapsable={false}
            pointerEvents="none"
            style={[styles.exportCapture, { width: Math.round(crop.width), height: Math.round(crop.height) }]}
          >
            <Svg width={Math.round(crop.width)} height={Math.round(crop.height)}>
              {strokes.map((stroke, index) => (
                <Path
                  key={`export-${index}`}
                  d={pointsToPath(stroke.map((point) => ({ x: point.x - crop.x, y: point.y - crop.y })))}
                  {...pathProps}
                />
              ))}
            </Svg>
          </View>
        ) : null}
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear drawing"
          onPress={() => {
            setStrokes([]);
            setNudge({ x: 0, y: 0 });
          }}
          style={styles.headerButton}
        >
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
  webOverlay: { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 2000, backgroundColor: '#f4f4f4' },
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
  cropFrame: { position: 'absolute', borderWidth: 2, borderColor: ink, zIndex: 3 },
  cropHandle: { position: 'absolute', width: 36, height: 24, borderRadius: 12, backgroundColor: ink, zIndex: 5 },
  exportCapture: { position: 'absolute', left: -10000, top: 0, backgroundColor: paper, overflow: 'hidden' },
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

