import { redirect } from '@sveltejs/kit';

/** Legacy invite form retired — Expo handles friend adds. */
export function load() {
  throw redirect(307, '/app');
}
