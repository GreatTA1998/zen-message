import { writable, readable } from 'svelte/store';

export const firstTimeUserFullName = writable('')
export const invitedByUID = writable('') // automatically add each other as friends

export const user = writable(null)
export const hasFetchedUser = writable(false)
export const hasLogoExited = writable(false)

export const viewportHeight = writable(null)