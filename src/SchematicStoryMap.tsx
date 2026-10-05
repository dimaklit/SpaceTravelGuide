import { useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import ActorGlyph from './ActorGlyph'
import { getActorGlyphKind } from './actor-glyph-data'
import type { SchematicNetworkMapProfile, StoryBeat, StoryPlace, StoryTrack, StoryTraveller } from './domain/story'

type SchematicStoryMapProps = {
  profile: SchematicNetworkMapProfile
  places: StoryPlace[]
  tracks: StoryTrack[]
  travellers: StoryTraveller[]
  visibleTracks: string[]
  isPlaying: boolean
  beats: StoryBeat[]
  activeBeatId: string
  onSelectBeat: (index: number) => void
}

type Point = { x: number; y: number }

function cubicPoint(start: Point, first: Point, second: Point, end: Point, progress: number): Point {
  const inverse = 1 - progress
  return {
    x: inverse ** 3 * start.x + 3 * inverse ** 2 * progress * first.x + 3 * inverse * progress ** 2 * second.x + progress ** 3 * end.x,
    y: inverse ** 3 * start.y + 3 * inverse ** 2 * progress * first.y + 3 * inverse * progress ** 2 * second.y + progress ** 3 * end.y,
  }
}

function travelledPath(start: Point, first: Point, second: Point, end: Point, progress: number) {
  if (progress <= 0) return ''
  const mix = (from: Point, to: Point): Point => ({
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  })
  const firstA = mix(start, first)
  const firstB = mix(first, second)
  const firstC = mix(second, end)
  const secondA = mix(firstA, firstB)
  const secondB = mix(firstB, firstC)
  const endpoint = mix(secondA, secondB)
  return `M ${start.x} ${start.y} C ${firstA.x} ${firstA.y}, ${secondA.x} ${secondA.y}, ${endpoint.x} ${endpoint.y}`
}

function routeGeometry(profile: SchematicNetworkMapProfile, routeId: string) {
  const route = profile.routes.find((item) => item.id === routeId)
  if (!route) return undefined
  const from = profile.nodes.find((node) => node.placeId === route.fromPlaceId)
  const to = profile.nodes.find((node) => node.placeId === route.toPlaceId)
  if (!from || !to) return undefined
  const first = { x: from.x + route.controlPointOffsets[0][0], y: from.y + route.controlPointOffsets[0][1] }
  const second = { x: to.x + route.controlPointOffsets[1][0], y: to.y + route.controlPointOffsets[1][1] }
  return { route, from, to, first, second }
}

export default function SchematicStoryMap({ profile, places, tracks, travellers, visibleTracks, isPlaying, beats, activeBeatId, onSelectBeat }: SchematicStoryMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [playProgress, setPlayProgress] = useState(0)
  const drag = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null)
  const playerStarted = useRef(0)

  useEffect(() => {
    if (!isPlaying) {
      setPlayProgress(0)
      playerStarted.current = 0
      setZoom(1)
      setPan({ x: 0, y: 0 })
      return
    }
    let frame = 0
    const tick = (time: number) => {
      if (!playerStarted.current) playerStarted.current = time
      const elapsed = (time - playerStarted.current) % 3500
      const progress = elapsed / 3500
      setPlayProgress(progress)
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [isPlaying])

  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places])
  const tracksById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks])
  const networkTracks = [...new Map(profile.routes.flatMap((route) => {
    const track = tracksById.get(route.trackId)
    return track ? [[track.id, track] as const] : []
  })).values()]
  const activeTravellers = travellers.filter((traveller) => visibleTracks.includes(traveller.trackId)).flatMap((traveller) => {
    const geometry = routeGeometry(profile, traveller.routeId)
    const track = tracksById.get(traveller.trackId)
    if (!geometry || !track) return []
    const targetProgress = Math.max(0, Math.min(1, traveller.progress))
    const progress = isPlaying ? targetProgress * playProgress : targetProgress
    const position = cubicPoint(geometry.from, geometry.first, geometry.second, geometry.to, progress)
    const previous = cubicPoint(geometry.from, geometry.first, geometry.second, geometry.to, Math.max(0, progress - 0.012))
    const next = cubicPoint(geometry.from, geometry.first, geometry.second, geometry.to, Math.min(1, progress + 0.012))
    const heading = Math.atan2(next.y - previous.y, next.x - previous.x) * 180 / Math.PI + 90
    return [{ traveller, geometry, track, progress, position, heading }]
  })
  const activeNodeIds = new Set(activeTravellers.flatMap(({ geometry }) => [geometry.route.fromPlaceId, geometry.route.toPlaceId]))
  const stopSlots = new Map<string, number>()
  const stopCounts = new Map<string, number>()
  const routeStops = beats.flatMap((beat, index) => {
    if (beat.mapView !== 'schematicNetwork') return []
    const routeTraveller = (beat.travellers ?? []).find((traveller) => {
      const track = tracksById.get(traveller.trackId)
      return track && routeGeometry(profile, traveller.routeId)
    })
    if (!routeTraveller) return []
    const geometry = routeGeometry(profile, routeTraveller.routeId)
    if (!geometry) return []
    const destinationId = geometry.route.toPlaceId
    const slot = stopSlots.get(destinationId) ?? 0
    stopSlots.set(destinationId, slot + 1)
    stopCounts.set(destinationId, (stopCounts.get(destinationId) ?? 0) + 1)
    return [{ beat, index, destinationId, point: geometry.to, slot }]
  }).map((stop) => {
    const count = stopCounts.get(stop.destinationId) ?? 1
    const angle = -Math.PI / 2 + stop.slot * Math.PI * 2 / count
    const offset = count > 1 ? 34 : 28
    return { ...stop, point: { x: stop.point.x + Math.cos(angle) * offset, y: stop.point.y + Math.sin(angle) * offset } }
  })
  const routeBounds = activeTravellers.reduce((bounds, { geometry }) => ({
    minX: Math.min(bounds.minX, geometry.from.x, geometry.to.x, geometry.first.x, geometry.second.x),
    maxX: Math.max(bounds.maxX, geometry.from.x, geometry.to.x, geometry.first.x, geometry.second.x),
    minY: Math.min(bounds.minY, geometry.from.y, geometry.to.y, geometry.first.y, geometry.second.y),
    maxY: Math.max(bounds.maxY, geometry.from.y, geometry.to.y, geometry.first.y, geometry.second.y),
  }), { minX: profile.width, maxX: 0, minY: profile.height, maxY: 0 })
  const routeSpanX = Math.max(1, routeBounds.maxX - routeBounds.minX)
  const routeSpanY = Math.max(1, routeBounds.maxY - routeBounds.minY)
  const routeFit = Math.min(profile.width * 0.76 / routeSpanX, profile.height * 0.7 / routeSpanY, 1.45)
  const autoZoom = isPlaying && activeTravellers.length ? Math.max(1, routeFit) : 1
  const effectiveZoom = isPlaying ? autoZoom : zoom
  const routeCenter = {
    x: activeTravellers.length ? (routeBounds.minX + routeBounds.maxX) / 2 : profile.width / 2,
    y: activeTravellers.length ? (routeBounds.minY + routeBounds.maxY) / 2 : profile.height / 2,
  }
  const autoPan = {
    x: (profile.width / 2 - routeCenter.x) * (autoZoom - 1),
    y: (profile.height / 2 - routeCenter.y) * (autoZoom - 1),
  }
  const effectivePan = isPlaying ? autoPan : pan

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isPlaying || (event.target instanceof Element && event.target.closest('button'))) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y }
  }

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    const rect = event.currentTarget.getBoundingClientRect()
    const scaleX = profile.width / rect.width
    const scaleY = profile.height / rect.height
    setPan({
      x: drag.current.panX + (event.clientX - drag.current.x) * scaleX,
      y: drag.current.panY + (event.clientY - drag.current.y) * scaleY,
    })
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const zoomAtPointer = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (isPlaying) return
    setZoom((value) => Math.max(1, Math.min(2.8, Number((value + (event.deltaY < 0 ? 0.12 : -0.12)).toFixed(2)))))
  }

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }
  return (
    <div className="schematic-map-frame">
    <div className={`schematic-map ${isPlaying ? 'is-playing' : ''}`} aria-label={`${profile.coordinateLabel} showing the active chapter's routes`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onWheel={zoomAtPointer}>
      <svg className="schematic-map-svg" viewBox={`0 0 ${profile.width} ${profile.height}`} role="img" aria-label={`${profile.scaleNote}. The complete active route from origin to destination is framed.`}>
        <defs>
          <radialGradient id={`network-nebula-${profile.id}`} cx="54%" cy="44%" r="76%">
            <stop offset="0" stopColor="#4b7b70" stopOpacity=".25" />
            <stop offset=".48" stopColor="#284b4b" stopOpacity=".14" />
            <stop offset="1" stopColor="#10181c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`network-starwash-${profile.id}`} cx="50%" cy="48%" r="66%">
            <stop offset="0" stopColor="#f0d595" stopOpacity=".12" />
            <stop offset="1" stopColor="#f0d595" stopOpacity="0" />
          </radialGradient>
          <filter id={`network-route-glow-${profile.id}`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id={`schematic-grid-${profile.id}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#c4d1c6" strokeOpacity=".055" strokeWidth="1" />
          </pattern>
          {networkTracks.map((track) => <marker key={track.id} id={`network-arrow-${profile.id}-${track.id}`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill={track.color} />
          </marker>)}
        </defs>
        <g className="network-camera" transform={`translate(${profile.width / 2 * (1 - effectiveZoom) + effectivePan.x} ${profile.height / 2 * (1 - effectiveZoom) + effectivePan.y}) scale(${effectiveZoom})`}>
        <rect width={profile.width} height={profile.height} fill="#111d20" />
        <rect width={profile.width} height={profile.height} fill={`url(#network-nebula-${profile.id})`} />
        <rect width={profile.width} height={profile.height} fill={`url(#network-starwash-${profile.id})`} />
        <rect width={profile.width} height={profile.height} fill={`url(#schematic-grid-${profile.id})`} />
        {Array.from({ length: 64 }, (_, index) => {
          const x = (index * 173 + 47) % profile.width
          const y = (index * 97 + 23) % profile.height
          const opacity = index % 4 === 0 ? '.62' : '.24'
          return <circle key={index} cx={x} cy={y} r={index % 7 === 0 ? 1.5 : 0.8} fill="#d4e0d4" opacity={opacity}>
            {index % 7 === 0 && <animate attributeName="opacity" values={`${opacity};.92;${opacity}`} dur={`${3 + index % 5}s`} repeatCount="indefinite" />}
          </circle>
        })}

        {profile.routes.filter((route) => visibleTracks.includes(route.trackId)).map((route) => {
          const geometry = routeGeometry(profile, route.id)
          const track = tracksById.get(route.trackId)
          if (!geometry || !track) return null
          const routePath = `M ${geometry.from.x} ${geometry.from.y} C ${geometry.first.x} ${geometry.first.y}, ${geometry.second.x} ${geometry.second.y}, ${geometry.to.x} ${geometry.to.y}`
          const arrowPosition = cubicPoint(geometry.from, geometry.first, geometry.second, geometry.to, 0.82)
          const arrowBefore = cubicPoint(geometry.from, geometry.first, geometry.second, geometry.to, 0.78)
          const arrowAngle = Math.atan2(arrowPosition.y - arrowBefore.y, arrowPosition.x - arrowBefore.x) * 180 / Math.PI
          return <g key={`network-route-context-${route.id}`}>
            <path className={`network-route-context ${track.kind}`} d={routePath} stroke={track.color} />
            <path className="network-route-direction" d="M -10 -8 L 5 0 L -10 8 Z" transform={`translate(${arrowPosition.x} ${arrowPosition.y}) rotate(${arrowAngle})`} fill={track.color} />
          </g>
        })}

        {activeTravellers.map(({ traveller, geometry, track, progress }) => {
          const routePath = `M ${geometry.from.x} ${geometry.from.y} C ${geometry.first.x} ${geometry.first.y}, ${geometry.second.x} ${geometry.second.y}, ${geometry.to.x} ${geometry.to.y}`
          const travelled = travelledPath(geometry.from, geometry.first, geometry.second, geometry.to, progress)
          return <g key={`${traveller.trackId}-${traveller.routeId}`}>
            <path className="network-route-underlay" d={routePath} stroke={track.color} />
            <path className="network-route-glow" d={routePath} stroke={track.color} filter={`url(#network-route-glow-${profile.id})`} />
            {travelled && <path className="network-route-progress" d={travelled} stroke={track.color} filter={`url(#network-route-glow-${profile.id})`} />}
            <path className={`network-route ${track.kind === 'political' ? 'political' : ''} ${track.kind === 'communication' ? 'communication' : ''}`} d={routePath} stroke={track.color} markerEnd={`url(#network-arrow-${profile.id}-${track.id})`} />
            <circle className="network-route-pulse" r="5" fill={track.color} stroke="#f6f2df" strokeWidth="1.5">
              <animateMotion path={routePath} dur={`${Math.max(3.2, 8 - progress * 3)}s`} begin="-.6s" repeatCount="indefinite" rotate="auto" />
            </circle>
            <circle className="network-route-pulse trail" r="2.2" fill="#fff1c7">
              <animateMotion path={routePath} dur={`${Math.max(3.2, 8 - progress * 3)}s`} begin="-2.8s" repeatCount="indefinite" rotate="auto" />
            </circle>
            <circle className="network-destination-beacon" cx={geometry.to.x} cy={geometry.to.y} r="10" />
          </g>
        })}

        {activeTravellers.map(({ traveller, track, position, heading }, index) => {
          const offset = (index - (activeTravellers.length - 1) / 2) * 34
          const sideX = Math.cos(heading * Math.PI / 180) * offset
          const sideY = Math.sin(heading * Math.PI / 180) * offset
          const actorKind = getActorGlyphKind(track)
          return <g key={`actor-${traveller.trackId}-${traveller.routeId}`} className={`network-actor network-actor-${actorKind}`} style={{ color: track.color }} transform={`translate(${position.x + sideX} ${position.y + sideY})`}>
            <circle r="25" className="network-actor-halo" />
            <circle r="33" className="network-actor-focus-ring" />
            <circle r="19" className="network-actor-disc" />
            <ActorGlyph kind={actorKind} size={22} x={-11} y={-11} className="network-actor-glyph" label={track.name} />
          </g>
        })}

        {profile.nodes.map((node) => {
          const place = placesById.get(node.placeId)
          if (!place) return null
          const active = activeNodeIds.has(node.placeId)
          return <g key={node.placeId} className={`network-place network-place-${node.category} ${active ? 'active' : 'context'}`} transform={`translate(${node.x} ${node.y})`}>
            <circle r={node.category === 'star' ? (active ? 42 : 23) : (active ? 25 : 15)} className="network-place-aura" />
            <circle r={node.category === 'star' ? 15 : 10} className="network-place-halo" />
            <circle r={node.category === 'star' ? 7 : 5} className="network-place-core" />
            <text x="0" y="30" textAnchor="middle" className="network-place-name">{place.name.toUpperCase()}</text>
          </g>
        })}
        {routeStops.map((stop) => {
          const selected = stop.beat.id === activeBeatId
          return <g key={`plot-stop-${stop.beat.id}`} className={`plot-stop ${selected ? 'selected' : ''}`} transform={`translate(${stop.point.x} ${stop.point.y})`} role="button" tabIndex={0} aria-label={`Plot beat ${stop.index + 1}: ${stop.beat.title}`} aria-current={selected ? 'step' : undefined} onClick={(event) => { event.stopPropagation(); onSelectBeat(stop.index) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); onSelectBeat(stop.index) } }}>
            <circle r="14" className="plot-stop-halo" />
            <circle r="11" className="plot-stop-disc" />
            <text y="0.5" className="plot-stop-number">{String(stop.index + 1).padStart(2, '0')}</text>
            <title>{stop.beat.title}</title>
          </g>
        })}
        {activeTravellers.map(({ traveller, position, track }) => <g className="network-route-cursor" key={`cursor-${traveller.trackId}-${traveller.routeId}`} transform={`translate(${position.x} ${position.y})`}>
          <circle r="15" fill="none" stroke={track.color} strokeWidth="1" opacity=".8"><animate attributeName="r" values="12;22;12" dur="2.2s" repeatCount="indefinite" /></circle>
        </g>)}
        </g>
      </svg>
      <div className="network-map-caption">
        <span>{profile.coordinateLabel}</span>
        <span>{isPlaying ? 'AUTO-FOLLOW · FULL ACTIVE ARROW STAYS IN FRAME' : `OVERVIEW · ${profile.scaleNote}`}</span>
      </div>
    </div>
      <div className="network-map-tools">
        <button className="icon-button" aria-label="Zoom in on route map" title="Zoom in" disabled={isPlaying || zoom >= 2.8} onClick={() => setZoom((value) => Math.min(2.8, Number((value + 0.2).toFixed(2))))}><Plus size={15} /></button>
        <span>{isPlaying ? `${Math.round(effectiveZoom * 100)}% · FOLLOW` : `${Math.round(effectiveZoom * 100)}% · FULL ROUTE`}</span>
        <button className="icon-button" aria-label="Zoom out on route map" title="Zoom out" disabled={isPlaying || zoom <= 1} onClick={() => setZoom((value) => Math.max(1, Number((value - 0.2).toFixed(2))))}><Minus size={15} /></button>
        <button className="icon-button" aria-label="Reset route map view" title="Show full route" disabled={isPlaying} onClick={resetView}><RotateCcw size={14} /></button>
      </div>
      <div className="network-map-actors" aria-live="polite">
        {activeTravellers.map(({ traveller, track, geometry, progress }) => {
          const from = placesById.get(geometry.route.fromPlaceId)
          const to = placesById.get(geometry.route.toPlaceId)
          const actorKind = getActorGlyphKind(track)
          return <div className="network-actor-row" key={`${traveller.trackId}-${traveller.routeId}`} style={{ '--actor-color': track.color } as React.CSSProperties}>
            <span className="network-actor-swatch"><ActorGlyph kind={actorKind} size={16} label={track.name} /></span>
            <span><small>IN TRANSIT</small><strong>{track.name}</strong><em>{from?.name} → {to?.name} · {Math.round(progress * 100)}%</em></span>
          </div>
        })}
      </div>
    </div>
  )
}
