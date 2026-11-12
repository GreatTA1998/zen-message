import raw from '../../../static/app/index.html?raw';

/** Expo export uses root-absolute /_expo paths; static files live under /app/_expo. */
function appHtml() {
  return raw
    .replaceAll('src="/_expo/', 'src="/app/_expo/')
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
