import type { StoryTrack } from './domain/story'

export type ActorGlyphKind = 'ship' | 'person' | 'rover' | 'signal' | 'fleet' | 'political'

export function getActorInitials(name: string) {
  return name.split(/[\s/]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export function getActorGlyphMarkup(kind: ActorGlyphKind, label = '') {
  if (kind === 'person') return `<svg class="actor-map-glyph actor-person-glyph" width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12" y="12.5" text-anchor="middle" dominant-baseline="central">${getActorInitials(label)}</text></svg>`
  const icons: Record<ActorGlyphKind, string> = {
    ship: '<path d="M12 2.8c3.1 3.1 5.8 6.7 5.8 11.1L12 21l-5.8-7.1C6.2 9.5 8.9 5.9 12 2.8Z"/><circle cx="12" cy="11" r="1.8"/><path d="m8 16-3.2 2.5M16 16l3.2 2.5M10 19l2 3 2-3"/>',
    person: '<circle cx="12" cy="7" r="3.2"/><path d="M5.5 21v-2.1a6.5 6.5 0 0 1 13 0V21M8 14.2l4 2.5 4-2.5"/>',
    rover: '<path d="M4 10h16l1.2 7H2.8L4 10ZM7 10l1.2-4h7.6l1.2 4M12 6V3h4"/><circle cx="6" cy="19" r="1.4"/><circle cx="18" cy="19" r="1.4"/><circle cx="16" cy="3" r="1"/>',
    signal: '<path d="M12 20V11M9 20h6M10 11l2-3 2 3M7.2 7.2a6.8 6.8 0 0 0 0 9.6M16.8 7.2a6.8 6.8 0 0 1 0 9.6M3.8 4a11.3 11.3 0 0 0 0 16M20.2 4a11.3 11.3 0 0 1 0 16"/>',
    fleet: '<path d="M12 3.5c2.4 2.4 4.2 5.1 4.2 8.5L12 17l-4.2-5c0-3.4 1.8-6.1 4.2-8.5Z"/><path d="M5 8.5c1 1 1.7 2.2 1.9 3.7M19 8.5c-1 1-1.7 2.2-1.9 3.7M4.5 16.5 3 19l4.5-1.5M19.5 16.5 21 19l-4.5-1.5"/><circle cx="12" cy="9" r="1.3"/>',
    political: '<path d="M6 21V3M7 4h11l-2.5 4L18 12H7M3.5 21h5"/>',
  }
  return `<svg class="actor-map-glyph" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[kind]}</svg>`
}

export function getActorGlyphKind(track: StoryTrack): ActorGlyphKind {
  if (track.kind === 'communication') return 'signal'
  if (track.kind === 'political') return 'political'

  const role = `${track.name} ${track.role}`.toLowerCase()
  if (/rover|surface traverse|surface route/.test(role)) return 'rover'
  if (/fleet|military movement|command fleet/.test(role)) return 'fleet'
  if (/ship|crew|flight|spacecraft|mission/.test(role)) return 'ship'
  return 'person'
}