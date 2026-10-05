import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  Compass,
  Crosshair,
  Info,
  Layers3,
  LocateFixed,
  Map,
  Maximize2,
  Minus,
  Navigation,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Signal,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { defaultEditionId, storyCatalog } from './data/catalog'
import type { OrbitalBodyElements, SolarSystemMapProfile, StoryBeat } from './domain/story'
import ActorGlyph from './ActorGlyph'
import { getActorGlyphKind } from './actor-glyph-data'
import MarsStoryMap from './MarsStoryMap'
import SchematicStoryMap from './SchematicStoryMap'
import './App.css'

type MapMode = 'system' | 'surface' | 'network'

const fallbackEdition = storyCatalog.find((item) => item.id === defaultEditionId)!
const launchEditionId = storyCatalog.find((item) => item.id === 'hitchhikers-guide-novel')?.id ?? defaultEditionId
const featuredDepartureIds = ['hitchhikers-guide-novel', 'contact-novel', 'dune-novel', 'the-martian-novel']

function orbitPosition(body: OrbitalBodyElements, profile: SolarSystemMapProfile) {
  const meanAnomaly = (body.meanLongitudeAtEpochDegrees - body.longitudeOfPerihelionDegrees) * Math.PI / 180
  let eccentricAnomaly = meanAnomaly
  for (let iteration = 0; iteration < 6; iteration += 1) {
    eccentricAnomaly -= (eccentricAnomaly - body.eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly)
      / (1 - body.eccentricity * Math.cos(eccentricAnomaly))
  }
  const orbitalX = body.semiMajorAxisAu * (Math.cos(eccentricAnomaly) - body.eccentricity)
  const orbitalY = body.semiMajorAxisAu * Math.sqrt(1 - body.eccentricity ** 2) * Math.sin(eccentricAnomaly)
  const perihelion = body.longitudeOfPerihelionDegrees * Math.PI / 180
  const heliocentricX = orbitalX * Math.cos(perihelion) - orbitalY * Math.sin(perihelion)
  const heliocentricY = orbitalX * Math.sin(perihelion) + orbitalY * Math.cos(perihelion)
  return [profile.center.x + heliocentricX * profile.auPixels, profile.center.y - heliocentricY * profile.auPixels] as const
}

function orbitPath(body: OrbitalBodyElements, profile: SolarSystemMapProfile) {
  return Array.from({ length: 361 }, (_, index) => {
    const angle = index * Math.PI / 180
    const radius = body.semiMajorAxisAu * (1 - body.eccentricity ** 2) / (1 + body.eccentricity * Math.cos(angle - body.longitudeOfPerihelionDegrees * Math.PI / 180))
    const x = profile.center.x + radius * profile.auPixels * Math.cos(angle)
    const y = profile.center.y - radius * profile.auPixels * Math.sin(angle)
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ') + ' Z'
}

type MapPoint = readonly [number, number]

function cubicPoint(start: MapPoint, firstControl: MapPoint, secondControl: MapPoint, end: MapPoint, progress: number): MapPoint {
  const inverse = 1 - progress
  const x = inverse ** 3 * start[0] + 3 * inverse ** 2 * progress * firstControl[0] + 3 * inverse * progress ** 2 * secondControl[0] + progress ** 3 * end[0]
  const y = inverse ** 3 * start[1] + 3 * inverse ** 2 * progress * firstControl[1] + 3 * inverse * progress ** 2 * secondControl[1] + progress ** 3 * end[1]
  return [x, y]
}

function cubicTravelledPath(start: MapPoint, first: MapPoint, second: MapPoint, end: MapPoint, progress: number) {
  if (progress <= 0) return ''
  const mix = (from: MapPoint, to: MapPoint): MapPoint => [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress,
  ]
  const firstA = mix(start, first)
  const firstB = mix(first, second)
  const firstC = mix(second, end)
  const secondA = mix(firstA, firstB)
  const secondB = mix(firstB, firstC)
  const endpoint = mix(secondA, secondB)
  return `M ${start[0]} ${start[1]} C ${firstA[0]} ${firstA[1]}, ${secondA[0]} ${secondA[1]}, ${endpoint[0]} ${endpoint[1]}`
}

function getOrbitalRoutePoints(route: SolarSystemMapProfile['orbitalRoutes'][number], bodies: Map<string, MapPoint>) {
  const start = bodies.get(route.fromBodyId)
  const end = bodies.get(route.toBodyId)
  if (!start || !end) return undefined
  const firstControl: MapPoint = [start[0] + route.controlPointOffsets[0][0], start[1] + route.controlPointOffsets[0][1]]
  const secondControl: MapPoint = [end[0] + route.controlPointOffsets[1][0], end[1] + route.controlPointOffsets[1][1]]
  return { start, end, firstControl, secondControl }
}

function getOrbitalRoutePath(route: SolarSystemMapProfile['orbitalRoutes'][number], bodies: Map<string, MapPoint>) {
  const points = getOrbitalRoutePoints(route, bodies)
  if (!points) return ''
  return `M ${points.start[0]} ${points.start[1]} C ${points.firstControl[0]} ${points.firstControl[1]}, ${points.secondControl[0]} ${points.secondControl[1]}, ${points.end[0]} ${points.end[1]}`
}

function App() {
  const [editionId, setEditionId] = useState(launchEditionId)
  const [hasEnteredAtlas, setHasEnteredAtlas] = useState(false)
  const edition = storyCatalog.find((item) => item.id === editionId) ?? storyCatalog[0]
  const beats = edition.beats
  const routes = edition.tracks
  const solarProfile = edition.maps.solarSystem ?? fallbackEdition.maps.solarSystem!
  const surfaceProfile = edition.maps.planetarySurface ?? fallbackEdition.maps.planetarySurface!
  const networkProfile = edition.maps.schematicNetwork
  const earthBody = solarProfile.bodies.find((body) => body.id === solarProfile.earthBodyId)!
  const marsBody = solarProfile.bodies.find((body) => body.id === solarProfile.marsBodyId)!
  const earthPosition = orbitPosition(earthBody, solarProfile)
  const marsPosition = orbitPosition(marsBody, solarProfile)
  const bodyPositions = new globalThis.Map<string, MapPoint>([[earthBody.id, earthPosition], [marsBody.id, marsPosition]])
  const earthOrbit = orbitPath(earthBody, solarProfile)
  const marsOrbit = orbitPath(marsBody, solarProfile)
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>(() => (storyCatalog.find((item) => item.id === launchEditionId) ?? storyCatalog[0]).tracks.map((track) => track.id))
  const [activeBeat, setActiveBeat] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [flightRun, setFlightRun] = useState(0)
  const [flightProgress, setFlightProgress] = useState<number | null>(0)
  const [systemZoom, setSystemZoom] = useState(1)
  const [systemPan, setSystemPan] = useState({ x: 0, y: 0 })
  const panGesture = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null)
  const draggedMap = useRef(false)
  const [showIllustrations, setShowIllustrations] = useState(true)
  const [baseLayer, setBaseLayer] = useState(fallbackEdition.maps.planetarySurface!.basemapLayers[0].id)
  const mapLayers = surfaceProfile.basemapLayers
  const selectedLayerIndex = mapLayers.findIndex((layer) => layer.id === baseLayer)
  const nextLayer = mapLayers[(selectedLayerIndex + 1 + mapLayers.length) % mapLayers.length]
  const active = beats[activeBeat]
  const mode: MapMode = active.mapView === 'solarSystem' ? 'system' : active.mapView === 'planetarySurface' ? 'surface' : 'network'
  const activeTrack = routes.find((route) => route.id === active.trackId)!
  const openingBeat = beats[0]
  const openingDestination = (() => {
    for (const traveller of openingBeat.travellers ?? []) {
      const track = routes.find((item) => item.id === traveller.trackId)
      if (track?.kind !== 'physical') continue
      const networkRoute = edition.maps.schematicNetwork?.routes.find((item) => item.id === traveller.routeId)
      const networkDestination = networkRoute && edition.places.find((place) => place.id === networkRoute.toPlaceId)
      if (networkDestination) return networkDestination.name
      const orbitalRoute = solarProfile.orbitalRoutes.find((item) => item.id === traveller.routeId)
      const orbitalDestination = orbitalRoute && solarProfile.bodies.find((body) => body.id === orbitalRoute.toBodyId)
      if (orbitalDestination) return orbitalDestination.name
      const surfaceRoute = surfaceProfile.routeSegments.find((item) => item.id === traveller.routeId)
      const surfaceDestination = surfaceRoute && edition.places.find((place) => place.id === surfaceRoute.toPlaceId)
      if (surfaceDestination) return surfaceDestination.name
    }
    const locationParts = openingBeat.location.split(' → ')
    return locationParts[locationParts.length - 1] || openingBeat.location
  })()
  const activeSolarMarker = active.orbitalFocusBodyId === solarProfile.earthBodyId ? earthPosition : marsPosition
  const activeOrbitalTravellers = (active.travellers ?? []).filter((traveller) => visibleRoutes.includes(traveller.trackId)).flatMap((traveller) => {
    const route = solarProfile.orbitalRoutes.find((item) => item.id === traveller.routeId)
    const points = route && getOrbitalRoutePoints(route, bodyPositions)
    const track = routes.find((item) => item.id === traveller.trackId)
    return route && points && track
      ? [{ ...points, routeId: route.id, progress: traveller.progress, track }]
      : []
  })
  const hasPlanetaryTravellers = (active.travellers ?? []).some((traveller) => visibleRoutes.includes(traveller.trackId) && !solarProfile.orbitalRoutes.some((route) => route.id === traveller.routeId))
  const activeTravellerSummaries = (active.travellers ?? []).filter((traveller) => visibleRoutes.includes(traveller.trackId)).flatMap((traveller) => {
    const track = routes.find((item) => item.id === traveller.trackId)
    return track ? [{ id: `${traveller.trackId}-${traveller.routeId}`, name: track.name, actorKind: getActorGlyphKind(track), progress: Math.round(traveller.progress * 100), route: traveller.routeId.split('-').join(' ') }] : []
  })
  const orbitalStopSlots = new globalThis.Map<string, number>()
  const orbitalStopCounts = new globalThis.Map<string, number>()
  const orbitalPlotStops = beats.flatMap((beat, index) => {
    if (beat.mapView !== 'solarSystem') return []
    const routeTraveller = (beat.travellers ?? []).find((traveller) => solarProfile.orbitalRoutes.some((route) => route.id === traveller.routeId))
    const route = routeTraveller && solarProfile.orbitalRoutes.find((item) => item.id === routeTraveller.routeId)
    const position = route && bodyPositions.get(route.toBodyId)
    if (!route || !position) return []
    const slot = orbitalStopSlots.get(route.toBodyId) ?? 0
    orbitalStopSlots.set(route.toBodyId, slot + 1)
    orbitalStopCounts.set(route.toBodyId, (orbitalStopCounts.get(route.toBodyId) ?? 0) + 1)
    return [{ beat, index, bodyId: route.toBodyId, position, slot }]
  }).map((stop) => {
    const count = orbitalStopCounts.get(stop.bodyId) ?? 1
    const angle = -Math.PI / 2 + stop.slot * Math.PI * 2 / count
    const offset = count > 1 ? 48 : 42
    return { ...stop, position: [stop.position[0] + Math.cos(angle) * offset, stop.position[1] + Math.sin(angle) * offset] as MapPoint }
  })
  const [earthX, earthY] = earthPosition
  const [marsX, marsY] = marsPosition

  useEffect(() => {
    if (!hasEnteredAtlas) {
      setFlightProgress(null)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFlightProgress(null)
      return
    }
    const startedAt = performance.now()
    let frame = 0
    let timeout = 0
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / 5200, 1)
      setFlightProgress(progress)
      if (progress < 1) frame = window.requestAnimationFrame(animate)
      else timeout = window.setTimeout(() => setFlightProgress(null), 900)
    }
    setFlightProgress(0)
    frame = window.requestAnimationFrame(animate)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [edition.id, flightRun, hasEnteredAtlas])

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setInterval(() => setActiveBeat((index) => (index + 1) % beats.length), 3500)
    return () => window.clearInterval(timer)
  }, [isPlaying, beats.length])

  const toggleRoute = (routeId: string) => {
    setVisibleRoutes((current) => current.includes(routeId)
      ? current.filter((item) => item !== routeId)
      : [...current, routeId])
  }

  const selectBeat = (index: number) => {
    setActiveBeat(index)
    setIsPlaying(false)
  }

  const selectEdition = (nextEditionId: string) => {
    const nextEdition = storyCatalog.find((item) => item.id === nextEditionId)
    if (!nextEdition) return
    setEditionId(nextEdition.id)
    setActiveBeat(0)
    setVisibleRoutes(nextEdition.tracks.map((track) => track.id))
    setBaseLayer((nextEdition.maps.planetarySurface ?? fallbackEdition.maps.planetarySurface!).basemapLayers[0].id)
    setIsPlaying(false)
    setSystemZoom(1)
    setSystemPan({ x: 0, y: 0 })
  }

  const selectFirstBeatForMap = (mapView: StoryBeat['mapView']) => {
    const index = beats.findIndex((beat) => beat.mapView === mapView)
    if (index >= 0) selectBeat(index)
  }

  const changeSystemZoom = (direction: -1 | 1) => {
    setSystemZoom((zoom) => Math.min(2.5, Math.max(1, Number((zoom + direction * 0.25).toFixed(2)))))
  }

  const startSystemPan = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest('[role="button"]'))) return
    event.currentTarget.setPointerCapture(event.pointerId)
    panGesture.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: systemPan.x, originY: systemPan.y, moved: false }
  }

  const moveSystemPan = (event: React.PointerEvent<SVGSVGElement>) => {
    const gesture = panGesture.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    const deltaX = event.clientX - gesture.startX
    const deltaY = event.clientY - gesture.startY
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) gesture.moved = true
    if (gesture.moved) {
      const bounds = event.currentTarget.getBoundingClientRect()
      const panLimitX = Math.max(bounds.width * 0.38, bounds.width * (systemZoom - 1) * 0.5 + bounds.width * 0.12)
      const panLimitY = Math.max(bounds.height * 0.38, bounds.height * (systemZoom - 1) * 0.5 + bounds.height * 0.12)
      setSystemPan({
        x: Math.max(-panLimitX, Math.min(panLimitX, gesture.originX + deltaX)),
        y: Math.max(-panLimitY, Math.min(panLimitY, gesture.originY + deltaY)),
      })
    }
  }

  const finishSystemPan = (event: React.PointerEvent<SVGSVGElement>) => {
    const gesture = panGesture.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    draggedMap.current = gesture.moved
    panGesture.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const zoomSystemWithWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    setSystemZoom((zoom) => Math.min(2.5, Math.max(1, Number((zoom + (event.deltaY < 0 ? 0.1 : -0.1)).toFixed(2)))))
  }

  if (!hasEnteredAtlas) {
    return (
      <main className="launch-gate">
        <div className="gate-image" aria-hidden="true" />
        <div className="gate-graticule" aria-hidden="true" />
        <header className="gate-header">
          <div className="gate-brand"><span className="brand-mark"><Compass size={20} strokeWidth={1.6} /></span><span className="brand-name">ORBIT<span>ATLAS</span></span></div>
          <div className="gate-header-note"><span className="gate-live-dot" /> FICTIONAL ROUTES · REAL CURIOSITY</div>
          <span className="gate-archive-count">FIELD ARCHIVE / {String(storyCatalog.length).padStart(2, '0')} EDITIONS</span>
        </header>

        <section className="gate-main">
          <div className="gate-intro">
            <p className="gate-eyebrow"><span /> AN ATLAS FOR THE IMPOSSIBLY FAR AWAY</p>
            <h1>A field guide<br />to <em>elsewhere.</em></h1>
            <p className="gate-description">Pick a story. Trace its people, ships, and strange detours across the dark. The universe is vast; the first stop is yours to choose.</p>
            <div className="gate-selected-route">
              <span>YOUR DEPARTURE FILE</span>
              <strong>{edition.work.title}</strong>
              <small>{edition.editionLabel} <i /> EARTH → {openingDestination.toUpperCase()}</small>
            </div>
            <button className="gate-enter-button" onClick={() => setHasEnteredAtlas(true)}>
              <span>ENTER THE ATLAS</span><ArrowRight size={17} /><small>OPEN {edition.format.toUpperCase()} ROUTE</small>
            </button>
            <p className="gate-disclaimer">Story routes are interpretations. The wonder is quite real.</p>
          </div>

          <aside className="gate-departures" aria-label="Choose a story to explore">
            <div className="gate-panel-heading"><span>01 / SELECT A DEPARTURE</span><span>{String(storyCatalog.length).padStart(2, '0')} FILES</span></div>
            <h2>Where to?</h2>
            <div className="departure-list">
              {featuredDepartureIds.map((id, index) => {
                const departure = storyCatalog.find((item) => item.id === id)
                if (!departure) return null
                return <button className={`departure-choice ${edition.id === departure.id ? 'selected' : ''}`} key={departure.id} onClick={() => selectEdition(departure.id)} aria-pressed={edition.id === departure.id}>
                  <span className="departure-index">0{index + 1}</span>
                  <span className="departure-copy"><strong>{departure.work.title}</strong><small>{departure.editionLabel} · {departure.subtitle}</small></span>
                  <ArrowUpRight size={15} />
                </button>
              })}
            </div>
            <label className="gate-catalog-label" htmlFor="gate-catalog">OR OPEN ANOTHER FILE</label>
            <div className="gate-catalog-select">
              <select id="gate-catalog" value={edition.id} onChange={(event) => selectEdition(event.target.value)} aria-label="Choose any book or adaptation">
                {storyCatalog.map((item) => <option key={item.id} value={item.id}>{item.work.title} · {item.editionLabel}</option>)}
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </div>
            <div className="gate-panel-footer"><span>BOOKS, FILMS & SERIES</span><span>KEEP LOOKING UP <span className="gate-footer-star">✳</span></span></div>
          </aside>
        </section>

        <footer className="gate-footer"><span>ORBIT ATLAS <i /> STORIES IN MOTION</span><span>NO TWO JOURNEYS TAKE THE SAME WAY HOME</span></footer>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand atlas-home-button" onClick={() => setHasEnteredAtlas(false)} aria-label="Return to Orbit Atlas starting page" title="Return to starting page">
          <span className="brand-mark"><Compass size={20} strokeWidth={1.6} /></span>
          <span className="brand-name">ORBIT<span>ATLAS</span></span>
        </button>
        <div className="topbar-center">
          <span className="topbar-kicker">FIELD ARCHIVE</span>
          <span className="topbar-separator">/</span>
          <span className="topbar-title">{edition.work.title.toUpperCase()}</span>
        </div>
        <div className="topbar-actions">
          <button className="icon-button help-button" aria-label="About this map" title="About this map"><CircleHelp size={17} /></button>
          <div className="edition-select-wrap">
            <select className="edition-button" aria-label="Choose book or adaptation" value={edition.id} onChange={(event) => selectEdition(event.target.value)}>
              {storyCatalog.map((item) => <option key={item.id} value={item.id}>{item.work.title} · {item.editionLabel}</option>)}
            </select>
            <ChevronDown size={13} aria-hidden="true" />
          </div>
          <span className="edition-dot" aria-hidden="true" />
        </div>
      </header>

      <section className="work-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> JOURNEY 001 <span className="eyebrow-sep">/</span> {edition.work.genre.toUpperCase()}</p>
          <h1>{edition.work.title} <span>— {edition.subtitle}</span></h1>
        </div>
        <div className="heading-meta">
          <span className="meta-live"><span /> FULL PLOT</span>
          <span className="meta-divider" />
          <span>{beats.length} PLOT BEATS</span>
          <span className="meta-divider" />
          <span>{routes.length} TRACKS</span>
        </div>
      </section>

      <div className="workspace" id="map">
        <aside className="left-panel">
          <div className="panel-title-row">
            <div><p className="panel-kicker">ROUTE LAYERS</p><h2>Choose a track</h2></div>
            <button className="icon-button subtle-button" aria-label="Layer settings" title="Layer settings"><SlidersHorizontal size={16} /></button>
          </div>

          <div className="route-list">
            {routes.map((route, index) => {
              const selected = visibleRoutes.includes(route.id)
              return (
                <button className={`route-option ${selected ? 'is-selected' : ''}`} key={route.id} onClick={() => toggleRoute(route.id)} aria-pressed={selected}>
                  <span className="route-number">0{index + 1}</span>
                  <span className="route-swatch" style={{ '--route-color': route.color } as React.CSSProperties}>
                    {route.kind === 'communication' ? <Radio size={14} /> : <span className="swatch-dot" />}
                  </span>
                  <span className="route-label"><strong>{route.name}</strong><small>{route.role}</small></span>
                  <span className={`route-check ${selected ? 'checked' : ''}`} />
                </button>
              )
            })}
          </div>

          <div className="panel-rule" />
          <p className="panel-kicker options-kicker">MAP OPTIONS</p>
          <label className="setting-row">
            <span className="setting-icon"><Sparkles size={15} /></span>
            <span className="setting-text">Illustrations<small>Original map artwork</small></span>
            <input type="checkbox" checked={showIllustrations} onChange={(event) => setShowIllustrations(event.target.checked)} />
          </label>

          <div className="scale-card">
            <div className="scale-card-top"><span><Crosshair size={14} /> SCALE NOTE</span><Info size={14} /></div>
            <p>{mode === 'system' ? solarProfile.scaleNote : mode === 'surface' ? surfaceProfile.scaleNote : networkProfile?.scaleNote}</p>
            <span className="map-context-note">MAP CONTEXT FOLLOWS THE ACTIVE CHAPTER</span>
          </div>
        </aside>

        <section className="map-column" aria-label="Interactive route map">
          <div className="map-toolbar">
            <div className="map-context-title"><span>{mode === 'system' ? <Map size={15} /> : mode === 'surface' ? <LocateFixed size={15} /> : <Compass size={15} />}</span>{mode === 'system' ? 'SOLAR SYSTEM' : mode === 'surface' ? 'MARS SURFACE' : 'STORY NETWORK'}<small>· {active.title.toUpperCase()}</small></div>
            <div className="toolbar-right"><span className="scale-label">{mode === 'system' ? 'ORBIT RADII TO SCALE · ALL ROUTES / ACTIVE LEG' : mode === 'surface' ? `${surfaceProfile.bodyId.toUpperCase()} · ALL VISIBLE ROUTES` : networkProfile?.coordinateLabel}</span><span className="toolbar-divider" /><button className="icon-button" aria-label="Replay virtual flight from Earth" title={`Replay virtual flight from Earth to ${openingDestination}`} onClick={() => setFlightRun((run) => run + 1)}><Navigation size={15} /></button><button className="icon-button" aria-label="Reset chapter map" title="Reset chapter map" onClick={() => { setActiveBeat(0); setSystemZoom(1); setSystemPan({ x: 0, y: 0 }) }}><RotateCcw size={15} /></button><button className="icon-button" aria-label="Expand map" title="Expand map"><Maximize2 size={15} /></button></div>
          </div>

          <div className={`map-viewport ${mode === 'surface' ? 'surface-mode' : ''} ${flightProgress !== null ? 'is-observer-flying' : ''}`}>
            <div className="map-coordinates"><span>{mode === 'system' ? `${solarProfile.coordinateFrame.toUpperCase()} · ${solarProfile.referenceEpoch}` : mode === 'surface' ? `${surfaceProfile.bodyId.toUpperCase()} / STORY LOCATIONS` : networkProfile?.coordinateLabel}</span><span>{mode === 'system' ? 'ORBITAL POSITIONS' : mode === 'surface' ? surfaceProfile.coordinateLabel : 'ACTIVE CHAPTER ROUTES'}</span></div>
            {flightProgress !== null && <div className="observer-flight" role="status" aria-live="polite" style={{ '--flight-progress': flightProgress } as React.CSSProperties}>
              <div className="observer-flight-heading"><span><Navigation size={12} /> VIRTUAL OBSERVER</span><span>APPROACH · {Math.round(flightProgress * 100)}%</span></div>
              <div className="observer-flight-route"><strong>EARTH</strong><span className="observer-flight-track"><i className="observer-flight-fill" /><i className="observer-flight-craft"><Navigation size={13} /></i></span><strong title={openingDestination}>{openingDestination}</strong></div>
              <small>RELATIVE POSITION FROM EARTH · SCHEMATIC APPROACH, NOT TO SCALE</small>
            </div>}
            {mode === 'system' ? (
              <>
              <svg className="route-map system-map" style={{ transform: `translate(${systemPan.x}px, ${systemPan.y}px) scale(${systemZoom})`, transformOrigin: '50% 50%' }} onPointerDown={startSystemPan} onPointerMove={moveSystemPan} onPointerUp={finishSystemPan} onPointerCancel={finishSystemPan} onWheel={zoomSystemWithWheel} onClick={() => { if (draggedMap.current) draggedMap.current = false }} viewBox="0 0 1160 620" role="img" aria-label={`Draggable and zoomable heliocentric ${solarProfile.referenceEpoch} orbital diagram with a travelling actor marker`}>
                <defs>
                  <radialGradient id="earthGlow"><stop stopColor="#5e9eab" stopOpacity=".34" /><stop offset="1" stopColor="#5e9eab" stopOpacity="0" /></radialGradient>
                  <radialGradient id="marsGlow"><stop stopColor="#e97855" stopOpacity=".3" /><stop offset="1" stopColor="#e97855" stopOpacity="0" /></radialGradient>
                  <radialGradient id="sunFill"><stop stopColor="#fff3be" /><stop offset=".62" stopColor="#f1bd5b" /><stop offset="1" stopColor="#d77f45" /></radialGradient>
                  <linearGradient id="earthFill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#89d0d1" /><stop offset=".56" stopColor="#397c84" /><stop offset="1" stopColor="#18383e" /></linearGradient>
                  <linearGradient id="marsFill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffb57f" /><stop offset=".48" stopColor="#ce6847" /><stop offset="1" stopColor="#69392f" /></linearGradient>
                  <pattern id="planetGrid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 8H16M8 0V16" stroke="#f6e5cf" strokeOpacity=".1" strokeWidth=".5" /></pattern>
                  <filter id="softGlow"><feGaussianBlur stdDeviation="8" /></filter>
                  <filter id="orbitRouteGlow" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  <marker id="arrowMint" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="#77d8c5" /></marker>
                  <marker id="arrowCoral" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="#f27854" /></marker>
                </defs>
                <rect width="1160" height="620" fill="#101c20" />
                {[...Array(12)].map((_, index) => <line key={`grid-y-${index}`} x1="0" x2="1160" y1={index * 56} y2={index * 56} stroke="#bdd0c0" strokeOpacity=".035" />)}
                {[...Array(21)].map((_, index) => <line key={`grid-x-${index}`} y1="0" y2="620" x1={index * 58} x2={index * 58} stroke="#bdd0c0" strokeOpacity=".035" />)}
                <path d={`M ${solarProfile.center.x} 0V620M 0 ${solarProfile.center.y}H1160`} stroke="#bdd0c0" strokeOpacity=".12" strokeDasharray="3 7" />
                <path className="orbit-ring earth-orbit" d={earthOrbit} />
                <path className="orbit-ring mars-orbit" d={marsOrbit} />
                <text className="orbit-distance earth-distance" x={solarProfile.center.x + earthBody.semiMajorAxisAu * solarProfile.auPixels + 14} y={solarProfile.center.y + 6}>{earthBody.semiMajorAxisAu.toFixed(2)} AU</text>
                <text className="orbit-distance mars-distance" x={solarProfile.center.x + marsBody.semiMajorAxisAu * solarProfile.auPixels + 14} y={solarProfile.center.y + 7}>{marsBody.semiMajorAxisAu.toFixed(2)} AU</text>
                <g className="sun-marker" aria-label="Sun at heliocentric origin">
                  <circle cx={solarProfile.center.x} cy={solarProfile.center.y} r="40" fill="#efbd5a" opacity=".12" />
                  <circle cx={solarProfile.center.x} cy={solarProfile.center.y} r="13" fill="url(#sunFill)" />
                  <text className="map-label sun-name" x={solarProfile.center.x} y={solarProfile.center.y + 34} textAnchor="middle">SUN</text>
                </g>
                <g className="au-scale"><path d="M 77 553v8m0-4h275m0-4v8" /><text x="214" y="574" textAnchor="middle">1 AU · 149.6 MILLION KM</text></g>

                {solarProfile.orbitalRoutes.filter((route) => visibleRoutes.includes(route.trackId)).map((route) => {
                  const track = routes.find((item) => item.id === route.trackId)
                  const points = getOrbitalRoutePoints(route, bodyPositions)
                  if (!track || track.kind === 'communication' || !points) return null
                  const arrowPosition = cubicPoint(points.start, points.firstControl, points.secondControl, points.end, 0.82)
                  const arrowBefore = cubicPoint(points.start, points.firstControl, points.secondControl, points.end, 0.78)
                  const arrowAngle = Math.atan2(arrowPosition[1] - arrowBefore[1], arrowPosition[0] - arrowBefore[0]) * 180 / Math.PI
                  return <g key={`orbital-route-context-${route.id}`}>
                    <path className={`orbital-context-line ${track.kind}`} d={getOrbitalRoutePath(route, bodyPositions)} stroke={track.color} />
                    <path className="orbital-route-direction" d="M -10 -8 L 5 0 L -10 8 Z" transform={`translate(${arrowPosition[0]} ${arrowPosition[1]}) rotate(${arrowAngle})`} fill={track.color} />
                  </g>
                })}

                {activeOrbitalTravellers.map((traveller) => {
                  const route = solarProfile.orbitalRoutes.find((item) => item.id === traveller.routeId)!
                  const routePath = getOrbitalRoutePath(route, bodyPositions)
                  const progressPath = cubicTravelledPath(traveller.start, traveller.firstControl, traveller.secondControl, traveller.end, traveller.progress)
                  return <g key={traveller.routeId} className="route-layer active-orbit-route" style={{ color: traveller.track.color }}>
                    <path className="active-orbit-glow" d={routePath} stroke={traveller.track.color} />
                    {progressPath && <path className="active-orbit-progress" d={progressPath} stroke={traveller.track.color} />}
                    <path className="route-line active-orbit-line" d={routePath} markerEnd="url(#arrowMint)" />
                    <circle className="route-node mint-node" cx={traveller.start[0]} cy={traveller.start[1]} r="6" />
                    <circle className="route-node coral-node" cx={traveller.end[0]} cy={traveller.end[1]} r="6" />
                    <circle className="orbit-route-beacon" r="5" fill={traveller.track.color} stroke="#fff2d0" strokeWidth="1.5">
                      <animateMotion path={routePath} dur="9s" repeatCount="indefinite" rotate="auto" />
                    </circle>
                    <text className="map-label active-route-label" x={(traveller.start[0] + traveller.end[0]) / 2} y={(traveller.start[1] + traveller.end[1]) / 2 - 18} textAnchor="middle">{traveller.track.name.toUpperCase()} · {Math.round(traveller.progress * 100)}%</text>
                  </g>
                })}

                {orbitalPlotStops.map((stop) => {
                  const selected = stop.beat.id === active.id
                  return <g key={`solar-stop-${stop.beat.id}`} className={`plot-stop ${selected ? 'selected' : ''}`} transform={`translate(${stop.position[0]} ${stop.position[1]})`} role="button" tabIndex={0} aria-label={`Plot beat ${stop.index + 1}: ${stop.beat.title}`} aria-current={selected ? 'step' : undefined} onClick={(event) => { event.stopPropagation(); selectBeat(stop.index) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); selectBeat(stop.index) } }}>
                    <circle r="14" className="plot-stop-halo" />
                    <circle r="11" className="plot-stop-disc" />
                    <text y="0.5" className="plot-stop-number">{String(stop.index + 1).padStart(2, '0')}</text>
                    <title>{stop.beat.title}</title>
                  </g>
                })}

                {active.trackId === solarProfile.communicationTrackId && <g className="route-layer nasa-layer">
                  <path className="route-line comm-line" d={`M ${earthX + 5} ${earthY + 13} Q ${solarProfile.center.x + 90} ${solarProfile.center.y + 148} ${marsX - 4} ${marsY + 15}`} />
                  <circle className="comm-pulse" cx={(earthX + marsX) / 2} cy={(earthY + marsY) / 2 + 69} r="5" />
                  <text className="map-label small-label comm-label" x={solarProfile.center.x + 35} y={solarProfile.center.y + 144}>{routes.find((route) => route.id === solarProfile.communicationTrackId)?.name} · COMMUNICATION LINK</text>
                </g>}

                <g className="planet earth-planet" transform={`translate(${earthX} ${earthY})`}>
                  <circle r="64" fill="url(#earthGlow)" />
                  <circle r="15" fill="url(#earthFill)" />
                  <circle r="15" fill="url(#planetGrid)" />
                  <path d="M-9-7l4-4 5 2 2 4-3 3-1 4-4 1-3-4-4-1 1-3zm12 9l4-2 3 3-1 4-4 2-3-3z" fill="#a9c7a0" opacity=".82" />
                  <ellipse rx="15" ry="4" fill="none" stroke="#d0ece1" strokeOpacity=".55" />
                  <ellipse rx="7" ry="15" fill="none" stroke="#d0ece1" strokeOpacity=".45" />
                  <text className="planet-name" y="36" textAnchor="middle">{earthBody.name.toUpperCase()}</text>
                  <text className="planet-note" y="51" textAnchor="middle">{earthBody.semiMajorAxisAu.toFixed(2)} AU</text>
                </g>

                <g className="planet mars-planet" transform={`translate(${marsX} ${marsY})`} onClick={(event) => { if (draggedMap.current) { event.stopPropagation(); draggedMap.current = false; return } selectFirstBeatForMap('planetarySurface') }} role="button" tabIndex={0} aria-label="Select a Mars surface chapter">
                  <circle r="67" fill="url(#marsGlow)" />
                  <circle r="11" fill="url(#marsFill)" />
                  <circle r="11" fill="url(#planetGrid)" />
                  <path d="M-6-5l4-3 4 2 2 3-2 2-1 4-3 1-3-3-3-1 1-3zm5 7l4-2 3 2-1 4-4 3-2-2z" fill="#8c4939" opacity=".8" />
                  <ellipse rx="11" ry="3" fill="none" stroke="#ffe0bf" strokeOpacity=".52" />
                  <ellipse rx="5" ry="11" fill="none" stroke="#ffe0bf" strokeOpacity=".42" />
                  <text className="planet-name" y="32" textAnchor="middle">{marsBody.name.toUpperCase()}</text>
                  <text className="planet-note" y="47" textAnchor="middle">{marsBody.semiMajorAxisAu.toFixed(2)} AU</text>
                </g>

                {activeOrbitalTravellers.map((traveller) => {
                  const position = cubicPoint(traveller.start, traveller.firstControl, traveller.secondControl, traveller.end, traveller.progress)
                  const before = cubicPoint(traveller.start, traveller.firstControl, traveller.secondControl, traveller.end, Math.max(0, traveller.progress - 0.01))
                  const after = cubicPoint(traveller.start, traveller.firstControl, traveller.secondControl, traveller.end, Math.min(1, traveller.progress + 0.01))
                  const tangentX = after[0] - before[0]
                  const tangentY = after[1] - before[1]
                  const tangentLength = Math.hypot(tangentX, tangentY) || 1
                  const side = position[0] > solarProfile.center.x ? -1 : 1
                  const markerX = position[0] + (tangentY / tangentLength) * 58 * side
                  const markerY = position[1] - (tangentX / tangentLength) * 58 * side
                  const heading = Math.atan2(tangentY, tangentX) * 180 / Math.PI + 90
                  return <g key={`${traveller.track.id}-${traveller.routeId}`} className="traveller-pointer" style={{ color: traveller.track.color }}>
                    <path className="traveller-leader" d={`M ${position[0]} ${position[1]} L ${markerX} ${markerY}`} />
                    <g transform={`translate(${markerX} ${markerY}) rotate(${heading})`}>
                      <circle className="traveller-halo" r="36" />
                      <circle className="traveller-disc" r="28" />
                      <ActorGlyph kind={getActorGlyphKind(traveller.track)} size={24} x={-12} y={-12} className="actor-map-glyph" label={traveller.track.name} />
                    </g>
                  </g>
                })}
                {hasPlanetaryTravellers && <g className="traveller-pointer surface-traveller-pointer" style={{ color: routes.find((route) => route.id === solarProfile.surfaceTrackId)?.color ?? '#f27854' }} transform={`translate(${marsX + 24} ${marsY + 24})`}>
                  <circle className="traveller-halo" r="24" />
                  <circle className="traveller-disc" r="18" />
                  <ActorGlyph kind="rover" size={18} x={-9} y={-9} className="actor-map-glyph" />
                </g>}
                {!activeOrbitalTravellers.length && !hasPlanetaryTravellers && <g className={`active-marker ${active.trackId === solarProfile.communicationTrackId ? 'marker-nasa' : ''}`} transform={`translate(${activeSolarMarker[0]} ${activeSolarMarker[1]})`}>
                  <circle r="15" className="marker-halo" /><circle r="4" className="marker-core" />
                </g>}
                <g className="distance-tag"><rect x="462" y="541" width="236" height="31" rx="2" /><text x="580" y="561" textAnchor="middle">ORBIT RADII · {earthBody.name.toUpperCase()} {earthBody.semiMajorAxisAu.toFixed(2)} AU · {marsBody.name.toUpperCase()} {marsBody.semiMajorAxisAu.toFixed(2)} AU</text></g>
              </svg>
              {mode === 'system' && (activeOrbitalTravellers.length > 0 || hasPlanetaryTravellers) && <div className="traveller-status" aria-live="polite">
                <span className="traveller-status-icon" style={{ color: routes.find((route) => route.name === activeTravellerSummaries[0]?.name)?.color ?? '#f2d178' }}><ActorGlyph kind={activeTravellerSummaries[0]?.actorKind ?? (hasPlanetaryTravellers ? 'rover' : 'ship')} size={18} label={activeTravellerSummaries[0]?.name} /></span>
                <span className="traveller-status-text"><small>THIS CHAPTER · {activeTravellerSummaries.length} TRAVELLER{activeTravellerSummaries.length === 1 ? '' : 'S'}</small>{activeTravellerSummaries.map((traveller) => <span className="traveller-status-person" key={traveller.id}><strong>{traveller.name}</strong><span>{traveller.progress}% · {traveller.route}</span></span>)}</span>
              </div>}
              {mode === 'system' && <span className="map-pan-hint">DRAG TO PAN · SCROLL TO ZOOM</span>}
              </>
            ) : mode === 'surface' ? (
              <>
                <MarsStoryMap profile={surfaceProfile} places={edition.places} tracks={routes} travellers={active.travellers ?? []} beats={beats} activeBeatId={active.id} visibleRoutes={visibleRoutes} showIllustrations={showIllustrations} baseLayerId={baseLayer} onSelectBeat={selectBeat} />
                <button className="map-layer-switch" onClick={() => setBaseLayer(nextLayer.id)} title={`Switch to ${nextLayer.name}`} aria-label={`Switch map layer to ${nextLayer.name}`}>
                  <Layers3 size={15} /><span>{nextLayer.name}</span>
                </button>
              </>
            ) : networkProfile ? <SchematicStoryMap profile={networkProfile} places={edition.places} tracks={routes} travellers={active.travellers ?? []} visibleTracks={visibleRoutes} isPlaying={isPlaying} beats={beats} activeBeatId={active.id} onSelectBeat={selectBeat} /> : null}

            {mode === 'system' && <div className="map-zoom-controls"><button className="icon-button" aria-label="Zoom in" title="Zoom in" onClick={() => changeSystemZoom(1)} disabled={systemZoom >= 2.5}><Plus size={15} /></button><span className="zoom-level">{Math.round(systemZoom * 100)}%</span><button className="icon-button" aria-label="Zoom out" title="Zoom out" onClick={() => changeSystemZoom(-1)} disabled={systemZoom <= 1}><Minus size={15} /></button></div>}
            {edition.work.id === 'the-martian' && <div className="map-stamp"><span>ARCHIVE PLATE</span><strong>01—ARES</strong></div>}
          </div>

          <div className="playback-bar">
            <div className="playback-controls"><button className="icon-button" aria-label="Previous plot beat" title="Previous plot beat" onClick={() => selectBeat((activeBeat + beats.length - 1) % beats.length)}><SkipBack size={15} /></button><button className="play-button" aria-label={isPlaying ? 'Pause route playback' : 'Play route playback'} onClick={() => setIsPlaying((playing) => !playing)}>{isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button><button className="icon-button" aria-label="Next plot beat" title="Next plot beat" onClick={() => selectBeat((activeBeat + 1) % beats.length)}><SkipForward size={15} /></button></div>
            <div className="playback-track"><span className="playback-current">{String(activeBeat + 1).padStart(2, '0')}</span><div className="progress-track"><span style={{ width: `${((activeBeat + 1) / beats.length) * 100}%` }} /></div><span className="playback-total">{String(beats.length).padStart(2, '0')}</span></div>
            <div className="playback-right"><Volume2 size={15} /><span>JOURNEY PLAYBACK</span><span className="live-indicator" /></div>
          </div>

          <div className="timeline-heading"><div><p className="panel-kicker">CHAPTER / PLOT INDEX</p><h2>A journey in {beats.length} beats</h2></div><button className="text-button" onClick={() => { setActiveBeat(0); setIsPlaying(false) }}>RESET <RotateCcw size={13} /></button></div>
          <div className="beat-timeline" role="list" aria-label="Plot beats">
            {beats.map((beat, index) => <button key={beat.id} className={`beat-item ${index === activeBeat ? 'active' : ''}`} onClick={() => selectBeat(index)} role="listitem" aria-current={index === activeBeat ? 'step' : undefined}>
              <span className="beat-marker" style={{ '--route-color': routes.find((route) => route.id === beat.trackId)?.color } as React.CSSProperties}>{String(index + 1).padStart(2, '0')}</span>
              <span className="beat-ref">{beat.reference}</span><strong>{beat.title}</strong><small>{beat.location}</small>
            </button>)}
          </div>
        </section>

        <aside className="right-panel">
          <div className="detail-header"><span className="panel-kicker">NOW IN FOCUS</span><span className="event-index">{String(activeBeat + 1).padStart(2, '0')} / {String(beats.length).padStart(2, '0')}</span></div>
          <div className="detail-art">
            <div className={`art-scene art-${active.trackId}`}>
              <div className="art-sun" /><div className="art-horizon horizon-back" /><div className="art-horizon horizon-front" />
              {showIllustrations && <div className="art-rover"><span /><i /><b /></div>}
              <span className="art-coordinate">{active.trackId === solarProfile.communicationTrackId ? 'MISSION CONTROL' : mode === 'network' ? networkProfile?.coordinateLabel : mode === 'surface' ? `${surfaceProfile.bodyId.toUpperCase()} · STORY LOCATION` : 'INTERPLANETARY ROUTE'}</span>
              <span className="art-caption-mark">FIELD SKETCH / 01</span>
            </div>
            <span className="art-credit">ORIGINAL ROUTE ILLUSTRATION</span>
          </div>
          <div className="detail-story">
            <span className="story-route-tag" style={{ '--route-color': activeTrack.color } as React.CSSProperties}><span />{activeTrack.name.toUpperCase()}</span>
            <h2>{active.title}</h2>
            <div className="from-to"><div><small>FROM</small><strong>{active.location.split(' → ')[0]}</strong></div><ArrowLeftRight size={15} /><div><small>TO</small><strong>{active.location.split(' → ')[1] ?? 'Mars surface'}</strong></div></div>
            <p className="story-copy">{active.detail}</p>
            <div className="chapter-reference"><span className="reference-icon"><Map size={14} /></span><div><small>CHAPTER / LOG REFERENCE</small><strong>{active.reference}</strong></div><ChevronDown size={15} /></div>
            <div className="event-type"><Signal size={14} /><span>{activeTrack.kind === 'communication' ? 'Communication link' : 'Physical route'}</span><span className="event-type-dot" /></div>
          </div>
          <div className="source-note"><Info size={14} /><p>{edition.interpretationNote}</p></div>
          <button className="next-beat" onClick={() => selectBeat((activeBeat + 1) % beats.length)}>NEXT PLOT BEAT <SkipForward size={14} /></button>
        </aside>
      </div>

      <footer className="app-footer"><span>ORBIT ATLAS <span className="footer-dot">·</span> FICTIONAL JOURNEYS, MAPPED</span><span>{edition.work.title.toUpperCase()} <span className="footer-dot">/</span> {edition.work.creator.toUpperCase()} <span className="footer-dot">/</span> {edition.format.toUpperCase()} ROUTE STUDY</span></footer>
    </main>
  )
}

export default App
