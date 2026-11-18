import raw from '../../../static/app/index.html?raw';

const appHtml = () =>
  raw
    .replaceAll('src="/_expo/', 'src="/app/_expo/')
    .replaceAll('href="/favicon.ico"', 'href="/app/favicon.ico"');

export const GET = () =>
  new Response(appHtml(), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' },
  });