import { Fragment, useEffect, useMemo } from 'react'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Polyline, ScaleControl, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import type { LatLngExpression, LatLngTuple } from 'leaflet'
import { getActorGlyphKind, getActorGlyphMarkup } from './actor-glyph-data'
import type { PlanetarySurfaceMapProfile, StoryBeat, StoryPlace, StoryTrack, StoryTraveller } from './domain/story'

type MarsStoryMapProps = {
  profile: PlanetarySurfaceMapProfile
  places: StoryPlace[]
  tracks: StoryTrack[]
  travellers: StoryTraveller[]
  beats: StoryBeat[]
  activeBeatId: string
  visibleRoutes: string[]
  showIllustrations: boolean
  baseLayerId: string
  onSelectBeat: (index: number) => void
}

function createPlanetaryCrs(radiusMeters: number, tileSize: number) {
  return L.extend({}, L.CRS.EPSG4326, {
    scale: (zoom: number) => tileSize * 2 ** zoom,
    zoom: (scale: number) => Math.log(scale / tileSize) / Math.LN2,
    distance: (first: L.LatLng, second: L.LatLng) => {
      const toRadians = Math.PI / 180
      const firstLatitude = first.lat * toRadians
      const secondLatitude = second.lat * toRadians
      const latitudeDelta = (second.lat - first.lat) * toRadians
      const longitudeDelta = (second.lng - first.lng) * toRadians
      const haversine = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2
      return radiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
    },
  })
}

function getPlace(places: StoryPlace[], id: string) {
  const place = places.find((item) => item.id === id)
  if (!place?.planetaryCoordinates) throw new Error(`Map place "${id}" needs planetary coordinates`)
  return place
}

function getPosition(place: StoryPlace): LatLngTuple {
  const coordinates = place.planetaryCoordinates
  if (!coordinates) throw new Error(`Map place "${place.id}" needs planetary coordinates`)
  return [coordinates.latitude, coordinates.longitude]
}

function StoryCamera({ focus, defaultZoom }: { focus: { position: LatLngTuple; zoom?: number }; defaultZoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(focus.position, focus.zoom ?? defaultZoom, { duration: 1.1 })
  }, [defaultZoom, focus, map])

  return null
}

export default function MarsStoryMap({ profile, places, tracks, travellers, beats, activeBeatId, visibleRoutes, showIllustrations, baseLayerId, onSelectBeat }: MarsStoryMapProps) {
  const crs = useMemo(() => createPlanetaryCrs(profile.radiusMeters, profile.tileSize), [profile.radiusMeters, profile.tileSize])
  const layer = profile.basemapLayers.find((item) => item.id === baseLayerId) ?? profile.basemapLayers[0]
  const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks])
  const focusDefinition = profile.focusByBeatId[activeBeatId]
  const focus = useMemo(() => {
    if (!focusDefinition) return { position: profile.defaultCenter, zoom: profile.defaultZoom }
    if (focusDefinition.kind === 'place') {
      return { position: getPosition(getPlace(places, focusDefinition.placeId)), zoom: focusDefinition.zoom }
    }
    return { position: [focusDefinition.latitude, focusDefinition.longitude] as LatLngTuple, zoom: focusDefinition.zoom }
  }, [focusDefinition, places, profile.defaultCenter, profile.defaultZoom])
  const activePlaceId = focusDefinition?.kind === 'place' ? focusDefinition.placeId : undefined
  const activeSegmentIds = travellers.map((traveller) => traveller.routeId)
  const activeSegments = profile.routeSegments.filter((segment) => activeSegmentIds.includes(segment.id) && visibleRoutes.includes(segment.trackId))
  const activePlaceIds = new Set(activeSegments.flatMap((segment) => [segment.fromPlaceId, segment.toPlaceId]))
  if (activePlaceId) activePlaceIds.add(activePlaceId)
  const planetaryPlaces = places.filter((place) => place.planetaryCoordinates?.bodyId === profile.bodyId && (activePlaceIds.size === 0 || activePlaceIds.has(place.id)))
  const signalPlace = getPlace(places, profile.signalPlaceId)
  const surfacePlotStops = beats.flatMap((beat, index) => {
    if (beat.mapView !== 'planetarySurface') return []
    const traveller = (beat.travellers ?? []).find((item) => profile.routeSegments.some((segment) => segment.id === item.routeId))
    const segment = traveller && profile.routeSegments.find((item) => item.id === traveller.routeId)
    const destination = segment && places.find((place) => place.id === segment.toPlaceId)
    return destination?.planetaryCoordinates?.bodyId === profile.bodyId ? [{ beat, index, destination }] : []
  })
  return (
    <div className="mars-leaflet" aria-label={`${profile.bodyId} map with story locations and routes`}>
      <MapContainer
        center={profile.defaultCenter}
        zoom={profile.defaultZoom}
        minZoom={profile.minZoom}
        maxZoom={profile.maxZoom}
        crs={crs}
        zoomControl={false}
        scrollWheelZoom
        worldCopyJump={false}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={0.8}
      >
        <TileLayer
          key={layer.id}
          url={layer.tileUrl}
          tileSize={profile.tileSize}
          minZoom={profile.minZoom}
          maxZoom={profile.maxZoom}
          attribution={layer.attribution}
          noWrap
        />
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <StoryCamera focus={focus} defaultZoom={profile.defaultZoom} />

        {profile.routeSegments.filter((segment) => visibleRoutes.includes(segment.trackId)).map((segment) => {
          const track = trackById.get(segment.trackId)
          if (!track) return null
          const from = getPosition(getPlace(places, segment.fromPlaceId))
          const to = getPosition(getPlace(places, segment.toPlaceId))
          const arrowPosition: LatLngTuple = [from[0] + (to[0] - from[0]) * 0.82, from[1] + (to[1] - from[1]) * 0.82]
          const angle = Math.atan2(-(to[0] - from[0]), to[1] - from[1]) * 180 / Math.PI
          const arrowIcon = L.divIcon({
            className: 'mars-route-arrow-wrap',
            html: `<span class="mars-route-arrow" style="--route-color:${track.color};transform:rotate(${angle}deg)"></span>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          })
          return <Fragment key={`mars-route-context-${segment.id}`}>
            <Polyline positions={[from, to]} pathOptions={{ color: track.color, weight: 2, opacity: 0.62, dashArray: '6 7', interactive: false }} />
            <Marker position={arrowPosition} icon={arrowIcon} interactive={false} />
          </Fragment>
        })}

        {travellers.filter((traveller) => visibleRoutes.includes(traveller.trackId)).map((traveller) => {
          const segment = activeSegments.find((route) => route.id === traveller.routeId)
          const track = trackById.get(traveller.trackId)
          if (!segment || !track) return null
          const fromPlace = getPlace(places, segment.fromPlaceId)
          const toPlace = getPlace(places, segment.toPlaceId)
          const from = getPosition(fromPlace)
          const to = getPosition(toPlace)
          const progress = Math.min(1, Math.max(0, traveller.progress))
          const position: LatLngTuple = [from[0] + (to[0] - from[0]) * progress, from[1] + (to[1] - from[1]) * progress]
          const heading = Math.atan2(-(to[0] - from[0]), to[1] - from[1]) * 180 / Math.PI
          const actorKind = getActorGlyphKind(track)
          const travellerIcon = L.divIcon({
            className: 'story-traveller-icon-wrap',
            html: `<span class="story-traveller-icon actor-${actorKind}" style="transform:rotate(${heading}deg);color:${track.color}">${getActorGlyphMarkup(actorKind, track.name)}</span>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          })
          return <Fragment key={`${traveller.trackId}-${traveller.routeId}`}>
            <Polyline positions={[from, to]} pathOptions={{ color: track.color, weight: 4, opacity: 0.92, dashArray: progress < 1 ? '8 6' : undefined }}>
              <Tooltip sticky>{track.name}: {fromPlace.name} → {toPlace.name}</Tooltip>
            </Polyline>
            <CircleMarker center={from} radius={5} pathOptions={{ color: track.color, fillColor: '#132124', fillOpacity: 1, weight: 2 }} />
            <CircleMarker center={to} radius={5} pathOptions={{ color: track.color, fillColor: track.color, fillOpacity: 1, weight: 2 }} />
            <Marker position={position} icon={travellerIcon} zIndexOffset={1000}>
              <Tooltip direction="top" offset={[0, -13]} permanent className="story-traveller-label">
                <strong>{track.name}</strong> · {Math.round(progress * 100)}%
              </Tooltip>
            </Marker>
          </Fragment>
        })}

        {surfacePlotStops.map((stop) => {
          const position = getPosition(stop.destination)
          const icon = L.divIcon({
            className: `mars-plot-stop-wrap ${stop.beat.id === activeBeatId ? 'selected' : ''}`,
            html: `<span class="mars-plot-stop">${String(stop.index + 1).padStart(2, '0')}</span>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })
          return <Marker key={`mars-plot-stop-${stop.beat.id}`} position={position} icon={icon} eventHandlers={{ click: () => onSelectBeat(stop.index) }}>
            <Tooltip direction="top" offset={[0, -15]}>{String(stop.index + 1).padStart(2, '0')} · {stop.beat.title}</Tooltip>
          </Marker>
        })}

        {profile.signalBeatIds.includes(activeBeatId) && visibleRoutes.includes(profile.signalTrackId) && <>
          <CircleMarker center={getPosition(signalPlace)} radius={15} pathOptions={{ color: '#edc767', weight: 2, fillOpacity: 0.08, dashArray: '3 4' }}>
            <Tooltip sticky>{trackById.get(profile.signalTrackId)?.name} ↔ {signalPlace.name} · communication link, not a surface route</Tooltip>
          </CircleMarker>
          <CircleMarker center={getPosition(signalPlace)} radius={22} pathOptions={{ color: '#edc767', weight: 2, fillOpacity: 0.04, className: 'mars-signal-pulse' }} />
        </>}

        {planetaryPlaces.map((place) => {
          const coordinates = place.planetaryCoordinates!
          const markerType = coordinates.accuracy === 'measured' ? 'pathfinder' : 'fictional'
          return (
            <CircleMarker
              key={place.id}
              center={getPosition(place) as LatLngExpression}
              radius={activePlaceId === place.id ? 8 : 6}
              pathOptions={{ color: markerType === 'pathfinder' ? '#edc767' : '#f27854', fillColor: markerType === 'pathfinder' ? '#edc767' : '#f27854', fillOpacity: 0.92, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -8]} permanent className={`mars-map-label ${markerType}`}>
                <strong>{place.name}</strong><br />{place.subtitle}
              </Tooltip>
            </CircleMarker>
          )
        })}

        {showIllustrations && profile.roverMarker?.beatIds.includes(activeBeatId) && <CircleMarker center={[profile.roverMarker.latitude, profile.roverMarker.longitude]} radius={4} pathOptions={{ color: '#f4d49c', fillColor: '#f4d49c', fillOpacity: 0.9, weight: 1 }}>
          <Tooltip>Illustrative vehicle position · not a surveyed location</Tooltip>
        </CircleMarker>}
      </MapContainer>
      <div className="mars-map-status"><span>{layer.name}</span><span>{profile.coordinateLabel}</span></div>
    </div>
  )
}