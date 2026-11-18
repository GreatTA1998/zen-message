import { redirect } from '@sveltejs/kit';

/** Legacy home/login UI retired — Expo web app is the product. */
export function load() {
  throw redirect(307, '/app');
}
