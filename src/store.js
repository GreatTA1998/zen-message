import { writable, readable } from 'svelte/store';

export const user = writable(null)
export const hasFetchedUser = writable(false)
export const hasLogoExited = writable(false)