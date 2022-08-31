import { writable, readable } from 'svelte/store';

export const user = writable(null)
export const hasFetchedUser = writable(false)