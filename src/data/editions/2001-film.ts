import type { StoryEdition } from '../../domain/story'

export const odyssey2001Film: StoryEdition = {
  id: '2001-a-space-odyssey-film',
  work: { id: '2001-a-space-odyssey', title: '2001: A Space Odyssey', creator: 'Stanley Kubrick', genre: 'Science fiction film' },
  format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to Jupiter',
  interpretationNote: 'Film route interpretation. The film sends Discovery One toward Jupiter; route geometry is schematic and not to scale.',
  tracks: [
    { id: 'bowman-film', name: 'David Bowman', role: 'Discovery One commander', color: '#f27854', kind: 'physical' },
    { id: 'poole-film', name: 'Frank Poole', role: 'Discovery One crew', color: '#77d8c5', kind: 'physical' },
    { id: 'discovery-film', name: 'Discovery One', role: 'Interplanetary vessel', color: '#edc767', kind: 'physical' },
  ],
  places: [
    { id: 'earth-2001f', name: 'Earth', subtitle: 'Humanity’s homeworld' }, { id: 'moon-2001f', name: 'Moon · Clavius', subtitle: 'TMA-1 excavation site' },
    { id: 'earth-orbit-2001f', name: 'Earth orbit', subtitle: 'Discovery One departure' }, { id: 'jupiter-2001f', name: 'Jupiter', subtitle: 'Discovery mission destination' },
    { id: 'jupiter-monolith-2001f', name: 'Jupiter monolith', subtitle: 'Gateway encounter' }, { id: 'beyond-2001f', name: 'Beyond the gateway', subtitle: 'Stargate sequence · schematic' },
  ],
  beats: [
    { id: 'moon-monolith-film', mapView: 'schematicNetwork', title: 'The Moon monolith', location: 'Earth → Moon · Clavius', reference: 'Film · TMA-1', detail: 'A buried lunar monolith emits a signal toward Jupiter, setting the Discovery mission in motion.', trackId: 'bowman-film', travellers: [{ trackId: 'bowman-film', routeId: 'earth-moon-2001f', progress: 0.95 }] },
    { id: 'discovery-film-launch', mapView: 'schematicNetwork', title: 'Discovery One to Jupiter', location: 'Earth orbit → Jupiter', reference: 'Film · Jupiter mission', detail: 'Bowman and Poole travel aboard Discovery One toward Jupiter while HAL supervises the mission.', trackId: 'discovery-film', travellers: [{ trackId: 'discovery-film', routeId: 'earth-jupiter-2001f', progress: 0.68 }, { trackId: 'bowman-film', routeId: 'earth-jupiter-2001f', progress: 0.68 }, { trackId: 'poole-film', routeId: 'earth-jupiter-2001f', progress: 0.68 }] },
    { id: 'hal-breakdown-film', mapView: 'schematicNetwork', title: 'Bowman continues alone', location: 'Discovery One → Jupiter', reference: 'Film · HAL sequence', detail: 'After the HAL crisis, Bowman continues alone toward the monolith orbiting Jupiter.', trackId: 'bowman-film', travellers: [{ trackId: 'bowman-film', routeId: 'earth-jupiter-2001f', progress: 0.96 }] },
    { id: 'stargate-film', mapView: 'schematicNetwork', title: 'Through the Stargate', location: 'Jupiter → beyond', reference: 'Film · Jupiter and beyond the infinite', detail: 'Bowman approaches the monolith and passes through the Stargate into an unknown destination.', trackId: 'bowman-film', travellers: [{ trackId: 'bowman-film', routeId: 'jupiter-beyond-2001f', progress: 0.92 }] },
  ],
  maps: { schematicNetwork: {
    id: '2001-film-network', scaleNote: 'FILM ROUTE · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'EARTH / MOON / JUPITER / STARGATE', width: 1000, height: 560,
    nodes: [
      { placeId: 'earth-2001f', x: 110, y: 380, category: 'world' }, { placeId: 'moon-2001f', x: 255, y: 235, category: 'world' },
      { placeId: 'earth-orbit-2001f', x: 315, y: 420, category: 'station' }, { placeId: 'jupiter-2001f', x: 645, y: 285, category: 'star' },
      { placeId: 'jupiter-monolith-2001f', x: 805, y: 185, category: 'station' }, { placeId: 'beyond-2001f', x: 920, y: 385, category: 'region' },
    ],
    routes: [
      { id: 'earth-moon-2001f', trackId: 'bowman-film', fromPlaceId: 'earth-2001f', toPlaceId: 'moon-2001f', controlPointOffsets: [[50, -80], [-50, 70]] },
      { id: 'earth-jupiter-2001f', trackId: 'discovery-film', fromPlaceId: 'earth-orbit-2001f', toPlaceId: 'jupiter-2001f', controlPointOffsets: [[120, -90], [-100, 55]] },
      { id: 'jupiter-beyond-2001f', trackId: 'bowman-film', fromPlaceId: 'jupiter-monolith-2001f', toPlaceId: 'beyond-2001f', controlPointOffsets: [[75, 75], [-65, -70]] },
    ],
  } },
}
