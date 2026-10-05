import type { StoryEdition } from '../../domain/story'

export const expanseSeasonOne: StoryEdition = {
  id: 'expanse-season-one-series',
  work: { id: 'the-expanse', title: 'The Expanse', creator: 'Mark Fergus, Hawk Ostby, and team', genre: 'Science fiction television' },
  format: 'series', editionLabel: 'SERIES · SEASON 1', subtitle: 'The Canterbury incident to Eros',
  interpretationNote: 'Season-one route interpretation. Locations and travel legs are schematic; episode order is distinct from the novels.',
  tracks: [
    { id: 'holden-tv', name: 'Holden’s crew', role: 'Rocinante crew', color: '#f27854', kind: 'physical' },
    { id: 'miller-tv', name: 'Miller', role: 'Ceres detective', color: '#77d8c5', kind: 'physical' },
    { id: 'draper-tv', name: 'Bobbie Draper', role: 'Martian Marine', color: '#edc767', kind: 'physical' },
  ],
  places: [
    { id: 'cant-tv', name: 'Canterbury', subtitle: 'Ice hauler · opening incident' }, { id: 'ceres-tv', name: 'Ceres', subtitle: 'Miller’s investigation' },
    { id: 'tycho-tv', name: 'Tycho Station', subtitle: 'Outer Belt station' }, { id: 'eros-tv', name: 'Eros Station', subtitle: 'Julie Mao investigation' },
    { id: 'ganymede-tv', name: 'Ganymede', subtitle: 'Mars Marine deployment' }, { id: 'roci-tv', name: 'Rocinante', subtitle: 'Crew vessel' },
  ],
  beats: [
    { id: 'cantterbury-tv', mapView: 'schematicNetwork', title: 'The Canterbury is lost', location: 'Canterbury → distress signal', reference: 'Season 1 · Episodes 1–2', detail: 'The ice hauler answers a distress signal; the surviving crew begin a journey through a rapidly escalating political crisis.', trackId: 'holden-tv', travellers: [{ trackId: 'holden-tv', routeId: 'cant-to-distress-tv', progress: 0.82 }] },
    { id: 'tycho-tv', mapView: 'schematicNetwork', title: 'The crew reaches Tycho', location: 'Salvage site → Tycho Station', reference: 'Season 1 · Episodes 3–5', detail: 'The survivors take the Rocinante toward Tycho while Miller continues the Julie Mao investigation on Ceres.', trackId: 'holden-tv', travellers: [{ trackId: 'holden-tv', routeId: 'salvage-to-tycho-tv', progress: 0.9 }, { trackId: 'miller-tv', routeId: 'ceres-to-eros-tv', progress: 0.25 }] },
    { id: 'mars-intercut-tv', mapView: 'schematicNetwork', title: 'The Martian front', location: 'Mars → Ganymede', reference: 'Season 1 · Episodes 4–6', detail: 'Bobbie Draper’s deployment introduces a parallel Martian storyline while events around the Belt intensify.', trackId: 'draper-tv', travellers: [{ trackId: 'draper-tv', routeId: 'mars-to-ganymede-tv', progress: 0.74 }] },
    { id: 'eros-tv', mapView: 'schematicNetwork', title: 'The investigation converges', location: 'Ceres / Tycho → Eros', reference: 'Season 1 · Episodes 7–10', detail: 'Holden’s crew and Miller converge on Eros as the Julie Mao mystery reveals a larger threat.', trackId: 'holden-tv', travellers: [{ trackId: 'holden-tv', routeId: 'tycho-to-eros-tv', progress: 0.86 }, { trackId: 'miller-tv', routeId: 'ceres-to-eros-tv', progress: 1 }] },
  ],
  maps: { schematicNetwork: {
    id: 'expanse-season-one-network', scaleNote: 'SOLAR SYSTEM STORY MAP · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'INNER SYSTEM / BELT / OUTER SYSTEM', width: 1000, height: 560,
    nodes: [
      { placeId: 'cant-tv', x: 120, y: 155, category: 'station' }, { placeId: 'ceres-tv', x: 210, y: 380, category: 'station' },
      { placeId: 'tycho-tv', x: 490, y: 345, category: 'station' }, { placeId: 'eros-tv', x: 805, y: 260, category: 'station' },
      { placeId: 'ganymede-tv', x: 620, y: 130, category: 'station' }, { placeId: 'roci-tv', x: 520, y: 180, category: 'station' },
    ],
    routes: [
      { id: 'cant-to-distress-tv', trackId: 'holden-tv', fromPlaceId: 'cant-tv', toPlaceId: 'roci-tv', controlPointOffsets: [[100, -30], [-80, -70]] },
      { id: 'salvage-to-tycho-tv', trackId: 'holden-tv', fromPlaceId: 'roci-tv', toPlaceId: 'tycho-tv', controlPointOffsets: [[40, 55], [-70, -45]] },
      { id: 'ceres-to-eros-tv', trackId: 'miller-tv', fromPlaceId: 'ceres-tv', toPlaceId: 'eros-tv', controlPointOffsets: [[130, -15], [-95, 85]] },
      { id: 'tycho-to-eros-tv', trackId: 'holden-tv', fromPlaceId: 'tycho-tv', toPlaceId: 'eros-tv', controlPointOffsets: [[110, -80], [-110, 80]] },
      { id: 'mars-to-ganymede-tv', trackId: 'draper-tv', fromPlaceId: 'roci-tv', toPlaceId: 'ganymede-tv', controlPointOffsets: [[40, -85], [-45, 65]] },
    ],
  } },
}
