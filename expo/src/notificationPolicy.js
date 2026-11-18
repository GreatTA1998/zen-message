/** Focus (mode≠relaxed) × notifyAll × intent → visibility / push / digest / star. */
export function notificationPolicy({ intent, mode, notifyAll = false, pending = false }) {
  const focused = mode !== 'relaxed';
  const override = notifyAll === true;
  const urgent = intent === 'realtime' || intent === 'urgent';
  const starKind = pending ? null : override ? 'override' : focused ? null : 'open';
  if (urgent || override) return { visible: true, push: true, loud: override, digest: false, path: 'immediate', starKind };
  if (!focused) return { visible: true, push: false, loud: false, digest: false, path: 'silent', starKind };
  return { visible: false, push: false, loud: false, digest: true, path: 'digest', starKind };
}

export function starColor(starKind) {
  return starKind === 'override' ? '#b3261e' : starKind === 'open' ? '#c9a227' : null;
}
