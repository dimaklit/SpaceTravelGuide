import { getActorInitials, type ActorGlyphKind } from './actor-glyph-data'

type ActorGlyphProps = {
  kind: ActorGlyphKind
  size?: number
  className?: string
  x?: number
  y?: number
  label?: string
}

export default function ActorGlyph({ kind, size = 20, className, x, y, label = '' }: ActorGlyphProps) {
  return (
    <svg className={className} x={x} y={y} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === 'person' && <>
        <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
        <text x="12" y="12.5" textAnchor="middle" dominantBaseline="central" className="actor-person-initials">{getActorInitials(label)}</text>
      </>}
      {kind === 'ship' && <>
        <path d="M12 2.8c3.1 3.1 5.8 6.7 5.8 11.1L12 21l-5.8-7.1C6.2 9.5 8.9 5.9 12 2.8Z" />
        <circle cx="12" cy="11" r="1.8" />
        <path d="m8 16-3.2 2.5M16 16l3.2 2.5M10 19l2 3 2-3" />
      </>}
      {kind === 'rover' && <>
        <path d="M4 10h16l1.2 7H2.8L4 10ZM7 10l1.2-4h7.6l1.2 4M12 6V3h4" />
        <circle cx="6" cy="19" r="1.4" /><circle cx="18" cy="19" r="1.4" />
        <circle cx="16" cy="3" r="1" />
      </>}
      {kind === 'signal' && <>
        <path d="M12 20V11M9 20h6M10 11l2-3 2 3M7.2 7.2a6.8 6.8 0 0 0 0 9.6M16.8 7.2a6.8 6.8 0 0 1 0 9.6M3.8 4a11.3 11.3 0 0 0 0 16M20.2 4a11.3 11.3 0 0 1 0 16" />
      </>}
      {kind === 'fleet' && <>
        <path d="M12 3.5c2.4 2.4 4.2 5.1 4.2 8.5L12 17l-4.2-5c0-3.4 1.8-6.1 4.2-8.5Z" />
        <path d="M5 8.5c1 1 1.7 2.2 1.9 3.7M19 8.5c-1 1-1.7 2.2-1.9 3.7M4.5 16.5 3 19l4.5-1.5M19.5 16.5 21 19l-4.5-1.5" />
        <circle cx="12" cy="9" r="1.3" />
      </>}
      {kind === 'political' && <>
        <path d="M6 21V3M7 4h11l-2.5 4L18 12H7" />
        <path d="M3.5 21h5" />
      </>}
    </svg>
  )
}