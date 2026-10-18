const AUTH_ORIGIN = 'https://project-z-e00fd.firebaseapp.com';
const AUTH_HOST = 'project-z-e00fd.firebaseapp.com';

const HOP_BY_HOP = [
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  'content-encoding',
];

const OAUTH_STATE_SESSION = 'Jm={name:"oauthHelperState",P:"session"}';
const OAUTH_STATE_LOCAL = 'Jm={name:"oauthHelperState",P:"local"}';

export function isFirebaseAuthPath(pathname) {
  return pathname === '/__/auth' || pathname.startsWith('/__/auth/');
}

export function rewriteAuthHandlerScript(source) {
  if (!source.includes(OAUTH_STATE_SESSION)) return source;
  return source.replaceAll(OAUTH_STATE_SESSION, OAUTH_STATE_LOCAL);
}

export async function proxyFirebaseAuth(request) {
  const incoming = new URL(request.url);
  if (!isFirebaseAuthPath(incoming.pathname) || incoming.pathname.includes('..')) {
    return new Response('Not found', { status: 404 });
  }
  const target = new URL(`${incoming.pathname}${incoming.search}`, AUTH_ORIGIN);
  const headers = new Headers(request.headers);
  for (const name of HOP_BY_HOP) headers.delete(name);
  headers.delete('cookie');
  headers.set('accept-encoding', 'identity');

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }
  const upstream = await fetch(target, init);
  const responseHeaders = new Headers(upstream.headers);
  for (const name of HOP_BY_HOP) responseHeaders.delete(name);
  rewriteLocation(responseHeaders, incoming);
  rewriteSetCookie(responseHeaders);
  if (request.method === 'HEAD') {
    return new Response(null, { status: upstream.status, headers: responseHeaders });
  }
  const raw = await upstream.arrayBuffer();
  const body = incoming.pathname.endsWith('/handler.js')
    ? new TextEncoder().encode(rewriteAuthHandlerScript(new TextDecoder().decode(raw)))
    : raw;
  return new Response(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

function rewriteLocation(headers, incoming) {
  const location = headers.get('location');
  if (!location) return;
  const resolved = new URL(location, AUTH_ORIGIN);
  if (resolved.hostname !== AUTH_HOST) return;
  resolved.protocol = incoming.protocol;
  resolved.host = incoming.host;
  headers.set('location', resolved.toString());
}

function rewriteSetCookie(headers) {
  const cookies = headers.getSetCookie?.() ?? [];
  if (!cookies.length) return;
  headers.delete('set-cookie');
  for (const cookie of cookies) {
    headers.append('set-cookie', cookie.replace(/;\s*Domain=[^;]*/i, ''));
  }
}
