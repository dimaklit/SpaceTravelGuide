import type { StoryEdition } from '../../domain/story'

export const interstellarFilm: StoryEdition = {
  id: 'interstellar-film',
  work: { id: 'interstellar', title: 'Interstellar', creator: 'Christopher Nolan', genre: 'Science fiction film' },
  format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to the unknown',
  interpretationNote: 'Film route interpretation. Planet locations and wormhole geometry are schematic; scale and travel times are not represented.',
  tracks: [
    { id: 'cooper', name: 'Cooper', role: 'Endurance pilot', color: '#f27854', kind: 'physical' },
    { id: 'endurance-crew', name: 'Endurance crew', role: 'Mission team', color: '#77d8c5', kind: 'physical' },
    { id: 'earth-team', name: 'Earth team', role: 'Parallel storyline', color: '#edc767', kind: 'physical' },
  ],
  places: [
    { id: 'earth-is', name: 'Earth', subtitle: 'Lazarus mission departure' }, { id: 'saturn', name: 'Saturn / wormhole', subtitle: 'Gateway to the distant system' },
    { id: 'gargantua', name: 'Gargantua system', subtitle: 'Black-hole system · schematic' }, { id: 'millers-world', name: 'Miller’s world', subtitle: 'First candidate planet' },
    { id: 'mann-world', name: 'Mann’s world', subtitle: 'Second candidate planet' }, { id: 'edmunds-world', name: 'Edmunds’ world', subtitle: 'Final candidate destination' },
    { id: 'cooper-station', name: 'Cooper Station', subtitle: 'Humanity’s orbital habitat' },
  ],
  beats: [
    { id: 'departure', mapView: 'schematicNetwork', title: 'The Endurance departs', location: 'Earth → Saturn', reference: 'Film · Launch', detail: 'Cooper leaves Earth with the Endurance crew to follow the Lazarus mission through the wormhole near Saturn.', trackId: 'endurance-crew', travellers: [{ trackId: 'endurance-crew', routeId: 'earth-saturn', progress: 0.94 }] },
    { id: 'millers-world', mapView: 'schematicNetwork', title: 'First planet: Miller’s world', location: 'Saturn → Gargantua system → Miller’s world', reference: 'Film · First planet', detail: 'The crew descends to Miller’s planet, where extreme time dilation makes minutes on the surface costly for those in orbit.', trackId: 'endurance-crew', travellers: [{ trackId: 'endurance-crew', routeId: 'wormhole-miller', progress: 0.92 }] },
    { id: 'mann-world', mapView: 'schematicNetwork', title: 'The signal from Mann', location: 'Miller’s world → Mann’s world', reference: 'Film · Second planet', detail: 'The Endurance travels to Dr. Mann’s world after the first mission’s devastating delay.', trackId: 'cooper', travellers: [{ trackId: 'cooper', routeId: 'miller-mann', progress: 0.84 }] },
    { id: 'edmunds-world', mapView: 'schematicNetwork', title: 'The final world', location: 'Mann’s world → Edmunds’ world', reference: 'Film · The final mission', detail: 'Amelia Brand continues toward Edmunds’ planet while Cooper enters Gargantua to make the plan possible.', trackId: 'endurance-crew', travellers: [{ trackId: 'endurance-crew', routeId: 'mann-edmunds', progress: 0.62 }, { trackId: 'cooper', routeId: 'cooper-gargantua', progress: 0.9 }] },
    { id: 'cooper-station-arrival', mapView: 'schematicNetwork', title: 'Cooper wakes near Saturn', location: 'Gargantua → Cooper Station', reference: 'Film · Epilogue', detail: 'Cooper is recovered near Saturn and wakes on the orbital habitat named for his daughter.', trackId: 'cooper', travellers: [{ trackId: 'cooper', routeId: 'gargantua-saturn-station', progress: 1 }] },
  ],
  maps: { schematicNetwork: {
    id: 'interstellar-film-network', scaleNote: 'INTERSTELLAR FILM ROUTES · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'SOL / SATURN / GARGANTUA SYSTEM', width: 1000, height: 560,
    nodes: [
      { placeId: 'earth-is', x: 110, y: 390, category: 'world' }, { placeId: 'saturn', x: 345, y: 290, category: 'star' },
      { placeId: 'gargantua', x: 585, y: 280, category: 'star' }, { placeId: 'millers-world', x: 745, y: 135, category: 'world' },
      { placeId: 'mann-world', x: 805, y: 310, category: 'world' }, { placeId: 'edmunds-world', x: 880, y: 470, category: 'world' },
      { placeId: 'cooper-station', x: 265, y: 130, category: 'station' },
    ],
    routes: [
      { id: 'earth-saturn', trackId: 'endurance-crew', fromPlaceId: 'earth-is', toPlaceId: 'saturn', controlPointOffsets: [[80, -55], [-65, 45]] },
      { id: 'wormhole-miller', trackId: 'endurance-crew', fromPlaceId: 'saturn', toPlaceId: 'millers-world', controlPointOffsets: [[115, -70], [-80, 60]] },
      { id: 'miller-mann', trackId: 'cooper', fromPlaceId: 'millers-world', toPlaceId: 'mann-world', controlPointOffsets: [[20, 80], [-30, -70]] },
      { id: 'mann-edmunds', trackId: 'endurance-crew', fromPlaceId: 'mann-world', toPlaceId: 'edmunds-world', controlPointOffsets: [[50, 80], [-60, -65]] },
      { id: 'cooper-gargantua', trackId: 'cooper', fromPlaceId: 'mann-world', toPlaceId: 'gargantua', controlPointOffsets: [[-55, -25], [45, 40]] },
      { id: 'gargantua-saturn-station', trackId: 'cooper', fromPlaceId: 'gargantua', toPlaceId: 'cooper-station', controlPointOffsets: [[-130, 80], [80, -40]] },
    ],
  } },
}
