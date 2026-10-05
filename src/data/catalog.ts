import type { StoryEdition } from '../domain/story'
import { theMartianNovel } from './editions/the-martian-novel'
import { duneNovel } from './editions/dune-novel'
import { foundationNovel } from './editions/foundation-novel'
import { projectHailMaryNovel } from './editions/project-hail-mary-novel'
import { leviathanWakesNovel } from './editions/expanse-leviathan-wakes-novel'
import { expanseSeasonOne } from './editions/expanse-season-one'
import { interstellarFilm } from './editions/interstellar-film'
import { odyssey2001Novel } from './editions/2001-novel'
import { odyssey2001Film } from './editions/2001-film'
import { hyperionNovel } from './editions/hyperion-novel'
import { hitchhikersGuideNovel } from './editions/hitchhikers-guide-novel'
import { hitchhikersGuideFilm } from './editions/hitchhikers-guide-film'
import { mappedBookAndFilmEditions, theMartianFilm } from './editions/mapped-works'

export const storyCatalog: StoryEdition[] = [
	theMartianNovel,
	duneNovel,
	foundationNovel,
	projectHailMaryNovel,
	leviathanWakesNovel,
	expanseSeasonOne,
	interstellarFilm,
	odyssey2001Novel,
	odyssey2001Film,
	hyperionNovel,
	hitchhikersGuideNovel,
	hitchhikersGuideFilm,
	theMartianFilm,
	...mappedBookAndFilmEditions,
]

export const defaultEditionId = theMartianNovel.id

function assertUniqueIds(kind: string, ids: string[]) {
	if (new Set(ids).size !== ids.length) throw new Error(`Duplicate ${kind} ID in story catalog`)
}

function assertReferencesExist(kind: string, references: string[], validIds: Set<string>) {
	const missing = references.find((id) => !validIds.has(id))
	if (missing) throw new Error(`Unknown ${kind} ID "${missing}" in story catalog`)
}

export function validateEdition(edition: StoryEdition) {
	const trackIds = new Set(edition.tracks.map((track) => track.id))
	const placeIds = new Set(edition.places.map((place) => place.id))
	const beatIds = new Set(edition.beats.map((beat) => beat.id))
	const routeIds: string[] = []

	assertUniqueIds('track', edition.tracks.map((track) => track.id))
	assertUniqueIds('place', edition.places.map((place) => place.id))
	assertUniqueIds('plot beat', edition.beats.map((beat) => beat.id))
	assertReferencesExist('track', edition.beats.map((beat) => beat.trackId), trackIds)

	const surface = edition.maps.planetarySurface
	const solar = edition.maps.solarSystem
	const network = edition.maps.schematicNetwork

	if (surface) {
		const surfaceRouteIds = surface.routeSegments.map((segment) => segment.id)
		routeIds.push(...surfaceRouteIds)
		assertReferencesExist('route track', surface.routeSegments.map((segment) => segment.trackId), trackIds)
		assertReferencesExist('route place', surface.routeSegments.flatMap((segment) => [segment.fromPlaceId, segment.toPlaceId]), placeIds)
		assertReferencesExist('route plot beat', surface.routeSegments.flatMap((segment) => [segment.revealedAtBeatId, segment.completedAtBeatId]), beatIds)
		assertReferencesExist('focus plot beat', Object.keys(surface.focusByBeatId), beatIds)
		assertReferencesExist('focus place', Object.values(surface.focusByBeatId).flatMap((focus) => focus.kind === 'place' ? [focus.placeId] : []), placeIds)
		assertReferencesExist('off-surface plot beat', surface.offSurfaceBeatIds, beatIds)
		assertReferencesExist('signal plot beat', surface.signalBeatIds, beatIds)
		assertReferencesExist('signal track', [surface.signalTrackId], trackIds)
		assertReferencesExist('signal place', [surface.signalPlaceId, surface.impliedRoutePlaceId], placeIds)
	}

	if (solar) {
		const orbitalRouteIds = solar.orbitalRoutes.map((route) => route.id)
		routeIds.push(...orbitalRouteIds)
		const orbitalBodyIds = new Set(solar.bodies.map((body) => body.id))
		assertReferencesExist('orbital route track', solar.orbitalRoutes.map((route) => route.trackId), trackIds)
		assertReferencesExist('orbital route body', solar.orbitalRoutes.flatMap((route) => [route.fromBodyId, route.toBodyId]), orbitalBodyIds)
		assertReferencesExist('orbital body', [solar.earthBodyId, solar.marsBodyId], orbitalBodyIds)
		assertReferencesExist('orbital track', [solar.orbitalTrackId, solar.communicationTrackId, solar.surfaceTrackId], trackIds)
		assertReferencesExist('planetary coordinate body', edition.places.flatMap((place) => place.planetaryCoordinates ? [place.planetaryCoordinates.bodyId] : []), orbitalBodyIds)
	}

	if (network) {
		const networkRouteIds = network.routes.map((route) => route.id)
		routeIds.push(...networkRouteIds)
		assertReferencesExist('network route track', network.routes.map((route) => route.trackId), trackIds)
		assertReferencesExist('network route place', network.routes.flatMap((route) => [route.fromPlaceId, route.toPlaceId]), placeIds)
		assertReferencesExist('network map node place', network.nodes.map((node) => node.placeId), placeIds)
	}

	assertUniqueIds('route', routeIds)
	for (const beat of edition.beats) {
		if (beat.mapView === 'solarSystem' && !solar) throw new Error(`Edition "${edition.id}" needs a solar-system map for beat "${beat.id}"`)
		if (beat.mapView === 'planetarySurface' && !surface) throw new Error(`Edition "${edition.id}" needs a planetary-surface map for beat "${beat.id}"`)
		if (beat.mapView === 'schematicNetwork' && !network) throw new Error(`Edition "${edition.id}" needs a schematic-network map for beat "${beat.id}"`)
	}
	const travellers = edition.beats.flatMap((beat) => beat.travellers ?? [])
	assertReferencesExist('traveller route', travellers.map((traveller) => traveller.routeId), new Set(routeIds))
	assertReferencesExist('traveller track', travellers.map((traveller) => traveller.trackId), trackIds)
	if (travellers.some((traveller) => !Number.isFinite(traveller.progress) || traveller.progress < 0 || traveller.progress > 1)) {
		throw new Error(`Traveller progress must be between 0 and 1 in edition "${edition.id}"`)
	}
}

assertUniqueIds('edition', storyCatalog.map((edition) => edition.id))
storyCatalog.forEach(validateEdition)

if (!storyCatalog.some((edition) => edition.id === defaultEditionId)) {
	throw new Error(`Default edition "${defaultEditionId}" is not registered in the story catalog`)
}