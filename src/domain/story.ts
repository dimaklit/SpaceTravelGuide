export type EditionFormat = 'novel' | 'film' | 'series'

export type TrackKind = 'physical' | 'communication' | 'political'

export type StoryMapView = 'solarSystem' | 'planetarySurface' | 'schematicNetwork'

export type CoordinateAccuracy = 'measured' | 'approximate' | 'fictional-approximation' | 'illustrative'

export type PlanetaryCoordinates = {
  bodyId: string
  referenceSystem: string
  latitude: number
  longitude: number
  accuracy: CoordinateAccuracy
}

export type StoryPlace = {
  id: string
  name: string
  subtitle: string
  planetaryCoordinates?: PlanetaryCoordinates
}

export type StoryTrack = {
  id: string
  name: string
  role: string
  color: string
  kind: TrackKind
}

export type StoryBeat = {
  id: string
  mapView: StoryMapView
  title: string
  location: string
  reference: string
  detail: string
  trackId: string
  orbitalFocusBodyId?: string
  travellers?: StoryTraveller[]
}

export type StoryTraveller = {
  trackId: string
  routeId: string
  progress: number
}

export type SurfaceRouteSegment = {
  id: string
  trackId: string
  fromPlaceId: string
  toPlaceId: string
  revealedAtBeatId: string
  completedAtBeatId: string
}

export type OrbitalBodyElements = {
  id: string
  name: string
  semiMajorAxisAu: number
  eccentricity: number
  longitudeOfPerihelionDegrees: number
  meanLongitudeAtEpochDegrees: number
  markerColor: string
}

export type SolarSystemMapProfile = {
  id: string
  scaleNote: string
  coordinateFrame: string
  referenceEpoch: string
  auPixels: number
  center: { x: number; y: number }
  earthBodyId: string
  marsBodyId: string
  communicationTrackId: string
  orbitalTrackId: string
  surfaceTrackId: string
  bodies: OrbitalBodyElements[]
  orbitalRoutes: OrbitalRoute[]
}

export type OrbitalRoute = {
  id: string
  trackId: string
  fromBodyId: string
  toBodyId: string
  controlPointOffsets: [[number, number], [number, number]]
}

export type MapFocus =
  | { kind: 'place'; placeId: string; zoom?: number }
  | { kind: 'coordinate'; latitude: number; longitude: number; accuracy: CoordinateAccuracy; zoom?: number }

export type MarsBasemapLayer = {
  id: string
  name: string
  tileUrl: string
  attribution: string
}

export type PlanetarySurfaceMapProfile = {
  id: string
  scaleNote: string
  bodyId: string
  radiusMeters: number
  spatialReference: string
  coordinateLabel: string
  defaultCenter: [number, number]
  defaultZoom: number
  minZoom: number
  maxZoom: number
  tileSize: number
  basemapLayers: MarsBasemapLayer[]
  routeSegments: SurfaceRouteSegment[]
  focusByBeatId: Record<string, MapFocus>
  signalTrackId: string
  signalPlaceId: string
  signalBeatIds: string[]
  offSurfaceBeatIds: string[]
  impliedRoutePlaceId: string
  impliedRouteDescription: string
  roverMarker?: { beatIds: string[]; latitude: number; longitude: number }
}

export type SchematicNetworkNode = {
  placeId: string
  x: number
  y: number
  category: 'world' | 'star' | 'region' | 'station'
}

export type SchematicNetworkRoute = {
  id: string
  trackId: string
  fromPlaceId: string
  toPlaceId: string
  controlPointOffsets: [[number, number], [number, number]]
}

export type SchematicNetworkMapProfile = {
  id: string
  scaleNote: string
  coordinateLabel: string
  width: number
  height: number
  nodes: SchematicNetworkNode[]
  routes: SchematicNetworkRoute[]
}

export type StoryEdition = {
  id: string
  work: {
    id: string
    title: string
    creator: string
    genre: string
  }
  format: EditionFormat
  editionLabel: string
  subtitle: string
  interpretationNote: string
  tracks: StoryTrack[]
  places: StoryPlace[]
  beats: StoryBeat[]
  maps: {
    solarSystem?: SolarSystemMapProfile
    planetarySurface?: PlanetarySurfaceMapProfile
    schematicNetwork?: SchematicNetworkMapProfile
  }
}