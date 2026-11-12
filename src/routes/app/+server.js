import raw from '../../../static/app/index.html?raw';

/**
 * Export with EXPO_WEB_BASE=/app so chunks and assets are already prefixed.
 * This only repairs a shell that still has root-absolute Metro URLs.
 */
function appHtml() {
  return raw
    .replaceAll('"/_expo/', '"/app/_expo/')
    .replaceAll('"/assets/', '"/app/assets/')
    .replaceAll('href="/favicon.ico"', 'href="/app/favicon.ico"');
}

export function GET() {
  return new Response(appHtml(), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-cache',
    },
  });
}
