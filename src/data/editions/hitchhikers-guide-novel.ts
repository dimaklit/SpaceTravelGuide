import type { StoryEdition } from '../../domain/story'

export const hitchhikersGuideNovel: StoryEdition = {
  id: 'hitchhikers-guide-novel',
  work: { id: 'hitchhikers-guide', title: 'The Hitchhiker’s Guide to the Galaxy', creator: 'Douglas Adams', genre: 'Science fiction comedy' },
  format: 'novel', editionLabel: 'NOVEL EDITION', subtitle: 'Earth to Magrathea',
  interpretationNote: 'Novel route interpretation. Galactic locations and travel paths are schematic; distances are not stated to scale.',
  tracks: [
    { id: 'arthur-ford', name: 'Arthur and Ford', role: 'Hitchhikers', color: '#f27854', kind: 'physical' },
    { id: 'zaphod-trillian', name: 'Zaphod and Trillian', role: 'Heart of Gold crew', color: '#77d8c5', kind: 'physical' },
  ],
  places: [
    { id: 'earth-hg', name: 'Earth', subtitle: 'Destroyed to make way for a hyperspace bypass' },
    { id: 'vogon-constructor', name: 'Vogon constructor fleet', subtitle: 'Deep-space stop' },
    { id: 'heart-of-gold', name: 'Heart of Gold', subtitle: 'Infinite Improbability Drive ship' },
    { id: 'magrathea', name: 'Magrathea', subtitle: 'Legendary planet-building world' },
    { id: 'deep-thought', name: 'Deep Thought', subtitle: 'Computer on Magrathea’s story path' },
  ],
  beats: [
    { id: 'earth-bypass', mapView: 'schematicNetwork', title: 'Earth is demolished', location: 'Earth → Vogon constructor fleet', reference: 'Part I · The Hitchhiker’s Guide to the Galaxy', detail: 'Arthur Dent escapes Earth with Ford Prefect moments before the planet is demolished for a hyperspace bypass.', trackId: 'arthur-ford', travellers: [{ trackId: 'arthur-ford', routeId: 'earth-vogon-novel', progress: 0.92 }] },
    { id: 'heart-gold', mapView: 'schematicNetwork', title: 'A ride on the Heart of Gold', location: 'Vogon fleet → Heart of Gold', reference: 'Parts I–II · Hitchhiking through space', detail: 'Arthur and Ford are rescued by Zaphod Beeblebrox and Trillian aboard the newly stolen Heart of Gold.', trackId: 'arthur-ford', travellers: [{ trackId: 'arthur-ford', routeId: 'vogon-heart-novel', progress: 1 }] },
    { id: 'magrathea-approach', mapView: 'schematicNetwork', title: 'The search for Magrathea', location: 'Heart of Gold → Magrathea', reference: 'Part III · The legendary planet', detail: 'The crew follows clues about Magrathea, where the story of Deep Thought and Earth’s ultimate question begins to connect.', trackId: 'zaphod-trillian', travellers: [{ trackId: 'zaphod-trillian', routeId: 'heart-magrathea-novel', progress: 0.92 }] },
    { id: 'magrathea-arrival', mapView: 'schematicNetwork', title: 'Arrival at Magrathea', location: 'Magrathea orbit → surface', reference: 'Part III · Magrathea', detail: 'The travellers reach the fabled world and encounter its planet-builders and their connection to Earth’s past.', trackId: 'arthur-ford', travellers: [{ trackId: 'arthur-ford', routeId: 'magrathea-surface-novel', progress: 0.96 }] },
  ],
  maps: { schematicNetwork: {
    id: 'hitchhikers-novel-network', scaleNote: 'GALACTIC JOURNEY · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'EARTH / DEEP SPACE / MAGRATHEA', width: 1000, height: 560,
    nodes: [
      { placeId: 'earth-hg', x: 115, y: 390, category: 'world' }, { placeId: 'vogon-constructor', x: 365, y: 250, category: 'station' },
      { placeId: 'heart-of-gold', x: 580, y: 360, category: 'station' }, { placeId: 'magrathea', x: 850, y: 205, category: 'world' },
      { placeId: 'deep-thought', x: 910, y: 405, category: 'station' },
    ],
    routes: [
      { id: 'earth-vogon-novel', trackId: 'arthur-ford', fromPlaceId: 'earth-hg', toPlaceId: 'vogon-constructor', controlPointOffsets: [[75, -90], [-70, 50]] },
      { id: 'vogon-heart-novel', trackId: 'arthur-ford', fromPlaceId: 'vogon-constructor', toPlaceId: 'heart-of-gold', controlPointOffsets: [[85, 50], [-65, -75]] },
      { id: 'heart-magrathea-novel', trackId: 'zaphod-trillian', fromPlaceId: 'heart-of-gold', toPlaceId: 'magrathea', controlPointOffsets: [[95, -90], [-100, 75]] },
      { id: 'magrathea-surface-novel', trackId: 'arthur-ford', fromPlaceId: 'magrathea', toPlaceId: 'deep-thought', controlPointOffsets: [[60, 80], [-55, -65]] },
    ],
  } },
}
