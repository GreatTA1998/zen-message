import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';

const ink = '#1c1c1c';
const paper = '#fff';
const pad = 20;
const strokeWidth = 4;

function pointsToPath(points) {
  if (!points.length) return '';
  const [first, ...rest] = points;
  let d = `M ${first.x} ${first.y}`;
  for (const point of rest) {
    d += ` L ${point.x} ${point.y}`;
  }
  return d;
}

function WebDrawSurface({ width, height, strokes, onStrokeEnd }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const active = useRef([]);
  const baseStrokes = useRef(strokes);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !width || !height) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ink;
    ctx.lineWidth = strokeWidth;
    for (const stroke of strokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i += 1) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, width, height]);

  const onPointerDown = (event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    drawing.current = true;
    // Later moves receive a strokes prop that already ends with this gesture.
    baseStrokes.current = strokes;
    active.current = [
      {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
    ];
  };

  const publishStroke = (isDraft) => {
    const live = [...active.current];
    if (live.length > 1) onStrokeEnd([...baseStrokes.current, live], isDraft);
    else if (!isDraft) onStrokeEnd(baseStrokes.current, false);
  };

  const onPointerMove = (event) => {
    if (!drawing.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    active.current.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    publishStroke(true);
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    publishStroke(false);
    active.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, touchAction: 'none', display: 'block' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
}

function NativeDrawSurface({ width, height, strokes, setStrokes }) {
  const active = useRef(null);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          active.current = [{ x: locationX, y: locationY }];
          setStrokes((current) => [...current, active.current]);
        },
        onPanResponderMove: (event) => {
          if (!active.current) return;
          const { locationX, locationY } = event.nativeEvent;
          active.current.push({ x: locationX, y: locationY });
          setStrokes((current) => {
            if (!current.length) return current;
            const next = current.slice(0, -1);
            next.push([...active.current]);
            return next;
          });
        },
        onPanResponderRelease: () => {
          active.current = null;
        },
        onPanResponderTerminate: () => {
          active.current = null;
        },
      }),
    [setStrokes],
  );

  return (
    <View style={{ width, height }} {...responder.panHandlers}>
      <Svg width={width} height={height}>
        {strokes.map((stroke, index) => (
          <Path
            key={`stroke-${index}`}
            d={pointsToPath(stroke)}
            stroke={ink}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
}

export async function exportDrawnSticker(strokes, captureView, size) {
  const hasInk = strokes.some((stroke) => stroke.length > 1);
  if (!hasInk) return null;

  if (Platform.OS === 'web') {
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ink;
    ctx.lineWidth = strokeWidth;
    for (const stroke of strokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i += 1) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
    return canvas.toDataURL('image/png');
  }

  if (!captureView) return null;
  const base64 = await captureRef(captureView, {
    format: 'png',
    quality: 0.92,
    result: 'base64',
  });
  if (typeof base64 !== 'string' || !base64) return null;
  return `data:image/png;base64,${base64}`;
}

export function StickerDrawModal({ visible, onCancel, onDone }) {
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'ios' ? insets.top : 0;
  const safeBottom = Platform.OS === 'ios' ? insets.bottom : 0;
  const [strokes, setStrokes] = useState([]);
  const [draftStrokes, setDraftStrokes] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const captureRefView = useRef(null);
  const saving = useRef(false);

  useEffect(() => {
    if (!visible) {
      setStrokes([]);
      setDraftStrokes(null);
      saving.current = false;
    }
  }, [visible]);

  const clear = useCallback(() => {
    setStrokes([]);
    setDraftStrokes(null);
  }, []);

  const finish = useCallback(async () => {
    if (saving.current) return;
    saving.current = true;
    try {
      const working = draftStrokes ?? strokes;
      const dataUri = await exportDrawnSticker(working, captureRefView, size);
      if (dataUri) onDone?.(dataUri);
    } finally {
      saving.current = false;
    }
  }, [draftStrokes, onDone, size, strokes]);

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) setSize({ width, height });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onCancel}>
      <View style={styles.sheet}>
        <View style={[styles.header, { paddingTop: 14 + safeTop }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Cancel drawing" onPress={onCancel} style={styles.headerButton}>
            <Text style={styles.headerAction}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Draw sticker</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Clear drawing" onPress={clear} style={styles.headerButton}>
            <Text style={styles.headerAction}>Clear</Text>
          </Pressable>
        </View>
        <View style={styles.canvasFrame} onLayout={onLayout}>
          {size.width > 0 && size.height > 0 ? (
            <View ref={captureRefView} collapsable={false} style={styles.canvasInner}>
              {Platform.OS === 'web' ? (
                <WebDrawSurface
                  width={size.width}
                  height={size.height}
                  strokes={draftStrokes ?? strokes}
                  onStrokeEnd={(next, isDraft) => {
                    if (isDraft) setDraftStrokes(next);
                    else {
                      setStrokes(next);
                      setDraftStrokes(null);
                    }
                  }}
                />
              ) : (
                <NativeDrawSurface width={size.width} height={size.height} strokes={strokes} setStrokes={setStrokes} />
              )}
            </View>
          ) : null}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Done" onPress={finish} style={[styles.done, { marginBottom: pad + 8 + safeBottom }]}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: paper,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerButton: { minWidth: 64 },
  headerAction: { color: ink, fontSize: 16, lineHeight: 22 },
  headerTitle: { color: ink, fontSize: 17, fontWeight: '600' },
  canvasFrame: { flex: 1, margin: pad, borderRadius: 18, overflow: 'hidden', backgroundColor: paper },
  canvasInner: { flex: 1, backgroundColor: paper },
  done: {
    marginHorizontal: pad,
    borderRadius: 14,
    backgroundColor: ink,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneText: { color: paper, fontSize: 17, fontWeight: '600' },
});
