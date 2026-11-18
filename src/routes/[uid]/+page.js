import { redirect } from '@sveltejs/kit';

/** Old Svelte chat URLs → Expo host. */
export function load() {
  throw redirect(307, '/app');
}
