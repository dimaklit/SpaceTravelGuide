import type { StoryEdition } from '../../domain/story'

export const odyssey2001Novel: StoryEdition = {
  id: '2001-a-space-odyssey-novel',
  work: { id: '2001-a-space-odyssey', title: '2001: A Space Odyssey', creator: 'Arthur C. Clarke', genre: 'Science fiction' },
  format: 'novel', editionLabel: 'NOVEL EDITION', subtitle: 'Earth to Saturn',
  interpretationNote: 'Novel route interpretation. Orbital positions and transfer paths are schematic, not a mission ephemeris.',
  tracks: [
    { id: 'bowman', name: 'David Bowman', role: 'Discovery One commander', color: '#f27854', kind: 'physical' },
    { id: 'poole', name: 'Frank Poole', role: 'Discovery One crew', color: '#77d8c5', kind: 'physical' },
    { id: 'discovery', name: 'Discovery One', role: 'Interplanetary vessel', color: '#edc767', kind: 'physical' },
  ],
  places: [
    { id: 'earth-2001n', name: 'Earth', subtitle: 'Humanity’s homeworld' }, { id: 'moon-2001n', name: 'Moon · Clavius', subtitle: 'TMA-1 excavation site' },
    { id: 'earth-orbit-2001n', name: 'Earth orbit', subtitle: 'Space station transfer' }, { id: 'jupiter-2001n', name: 'Jupiter system', subtitle: 'Outer-system waypoint' },
    { id: 'saturn-2001n', name: 'Saturn system', subtitle: 'Discovery destination in the novel' }, { id: 'iapetus-2001n', name: 'Iapetus', subtitle: 'Monolith encounter · Saturn moon' },
  ],
  beats: [
    { id: 'clavius', mapView: 'schematicNetwork', title: 'The Moon monolith', location: 'Earth → Moon · Clavius', reference: 'Part II · TMA-1', detail: 'A lunar excavation uncovers a buried monolith that sends a signal toward Saturn.', trackId: 'bowman', travellers: [{ trackId: 'bowman', routeId: 'earth-moon-2001n', progress: 0.94 }] },
    { id: 'discovery-launch', mapView: 'schematicNetwork', title: 'Discovery One departs', location: 'Earth orbit → Jupiter system', reference: 'Part III · Between Planets', detail: 'Bowman and Poole travel aboard Discovery One toward the signal’s destination in the outer Solar System.', trackId: 'discovery', travellers: [{ trackId: 'discovery', routeId: 'earth-jupiter-2001n', progress: 0.62 }, { trackId: 'poole', routeId: 'earth-jupiter-2001n', progress: 0.62 }] },
    { id: 'hal-crisis', mapView: 'schematicNetwork', title: 'The mission continues', location: 'Jupiter → Saturn system', reference: 'Part IV · Abyss', detail: 'After the crisis aboard Discovery, Bowman continues alone toward the Saturn system.', trackId: 'bowman', travellers: [{ trackId: 'bowman', routeId: 'jupiter-saturn-2001n', progress: 0.72 }] },
    { id: 'iapetus-gate', mapView: 'schematicNetwork', title: 'The gateway on Iapetus', location: 'Saturn system → Iapetus', reference: 'Part V · The Moons of Saturn', detail: 'Bowman investigates the monolith on Iapetus and passes through the gateway beyond it.', trackId: 'bowman', travellers: [{ trackId: 'bowman', routeId: 'saturn-iapetus-2001n', progress: 0.96 }] },
  ],
  maps: { schematicNetwork: {
    id: '2001-novel-network', scaleNote: 'SOLAR SYSTEM STORY ROUTE · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'EARTH / MOON / JUPITER / SATURN', width: 1000, height: 560,
    nodes: [
      { placeId: 'earth-2001n', x: 105, y: 365, category: 'world' }, { placeId: 'moon-2001n', x: 245, y: 235, category: 'world' },
      { placeId: 'earth-orbit-2001n', x: 320, y: 405, category: 'station' }, { placeId: 'jupiter-2001n', x: 610, y: 265, category: 'star' },
      { placeId: 'saturn-2001n', x: 835, y: 300, category: 'star' }, { placeId: 'iapetus-2001n', x: 905, y: 430, category: 'world' },
    ],
    routes: [
      { id: 'earth-moon-2001n', trackId: 'bowman', fromPlaceId: 'earth-2001n', toPlaceId: 'moon-2001n', controlPointOffsets: [[45, -75], [-55, 65]] },
      { id: 'earth-jupiter-2001n', trackId: 'discovery', fromPlaceId: 'earth-orbit-2001n', toPlaceId: 'jupiter-2001n', controlPointOffsets: [[95, -70], [-100, 45]] },
      { id: 'jupiter-saturn-2001n', trackId: 'bowman', fromPlaceId: 'jupiter-2001n', toPlaceId: 'saturn-2001n', controlPointOffsets: [[75, -50], [-75, 55]] },
      { id: 'saturn-iapetus-2001n', trackId: 'bowman', fromPlaceId: 'saturn-2001n', toPlaceId: 'iapetus-2001n', controlPointOffsets: [[25, 70], [-45, -40]] },
    ],
  } },
}
