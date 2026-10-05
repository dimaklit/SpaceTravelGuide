import type { StoryEdition } from '../../domain/story'

export const hitchhikersGuideFilm: StoryEdition = {
  id: 'hitchhikers-guide-film',
  work: { id: 'hitchhikers-guide', title: 'The Hitchhiker’s Guide to the Galaxy', creator: 'Garth Jennings', genre: 'Science fiction comedy film' },
  format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to the Question',
  interpretationNote: 'Film route interpretation. Adaptation-specific locations and galactic routes are schematic, not to scale.',
  tracks: [
    { id: 'arthur-ford-film', name: 'Arthur and Ford', role: 'Hitchhikers', color: '#f27854', kind: 'physical' },
    { id: 'trillian-film', name: 'Trillian', role: 'Heart of Gold crew', color: '#77d8c5', kind: 'physical' },
    { id: 'zaphod-film', name: 'Zaphod Beeblebrox', role: 'Heart of Gold captain', color: '#edc767', kind: 'physical' },
  ],
  places: [
    { id: 'earth-hgf', name: 'Earth', subtitle: 'Destroyed for the hyperspace bypass' },
    { id: 'vogon-fleet-hgf', name: 'Vogon fleet', subtitle: 'Arthur and Ford’s first stop' },
    { id: 'vogsphere-hgf', name: 'Vogsphere', subtitle: 'Vogon homeworld · film stop' },
    { id: 'heart-of-gold-hgf', name: 'Heart of Gold', subtitle: 'Improbability Drive ship' },
    { id: 'magrathea-hgf', name: 'Magrathea', subtitle: 'Quest destination' },
    { id: 'earth-reborn-hgf', name: 'New Earth', subtitle: 'Film finale · recreated Earth' },
  ],
  beats: [
    { id: 'earth-bypass-film', mapView: 'schematicNetwork', title: 'Earth is destroyed', location: 'Earth → Vogon fleet', reference: 'Film · Earth’s demolition', detail: 'Arthur and Ford escape the destruction of Earth and begin their journey through the Vogon fleet.', trackId: 'arthur-ford-film', travellers: [{ trackId: 'arthur-ford-film', routeId: 'earth-vogon-film', progress: 0.92 }] },
    { id: 'vogsphere-film', mapView: 'schematicNetwork', title: 'A stop at Vogsphere', location: 'Vogon fleet → Vogsphere', reference: 'Film · Vogsphere', detail: 'The film adds a visit to the Vogon homeworld as Arthur and his companions pursue the Question.', trackId: 'arthur-ford-film', travellers: [{ trackId: 'arthur-ford-film', routeId: 'vogon-vogsphere-film', progress: 0.78 }] },
    { id: 'heart-of-gold-film', mapView: 'schematicNetwork', title: 'Aboard the Heart of Gold', location: 'Vogsphere → Heart of Gold', reference: 'Film · The Improbability Drive', detail: 'Arthur joins Zaphod, Trillian, and Marvin aboard the Heart of Gold and learns about the search for the Question.', trackId: 'trillian-film', travellers: [{ trackId: 'trillian-film', routeId: 'vogsphere-heart-film', progress: 1 }] },
    { id: 'magrathea-film', mapView: 'schematicNetwork', title: 'The Question leads to Magrathea', location: 'Heart of Gold → Magrathea', reference: 'Film · Magrathea', detail: 'The crew reaches Magrathea, where the film’s quest for the ultimate question reaches its destination.', trackId: 'zaphod-film', travellers: [{ trackId: 'zaphod-film', routeId: 'heart-magrathea-film', progress: 0.94 }] },
    { id: 'new-earth-film', mapView: 'schematicNetwork', title: 'A new beginning', location: 'Magrathea → New Earth', reference: 'Film · Finale', detail: 'Arthur and his companions set course for the newly recreated Earth.', trackId: 'arthur-ford-film', travellers: [{ trackId: 'arthur-ford-film', routeId: 'magrathea-new-earth-film', progress: 0.9 }] },
  ],
  maps: { schematicNetwork: {
    id: 'hitchhikers-film-network', scaleNote: 'FILM ROUTE · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'EARTH / VOGSPHERE / MAGRATHEA', width: 1000, height: 560,
    nodes: [
      { placeId: 'earth-hgf', x: 100, y: 390, category: 'world' }, { placeId: 'vogon-fleet-hgf', x: 300, y: 245, category: 'station' },
      { placeId: 'vogsphere-hgf', x: 485, y: 405, category: 'world' }, { placeId: 'heart-of-gold-hgf', x: 625, y: 205, category: 'station' },
      { placeId: 'magrathea-hgf', x: 820, y: 310, category: 'world' }, { placeId: 'earth-reborn-hgf', x: 920, y: 120, category: 'world' },
    ],
    routes: [
      { id: 'earth-vogon-film', trackId: 'arthur-ford-film', fromPlaceId: 'earth-hgf', toPlaceId: 'vogon-fleet-hgf', controlPointOffsets: [[65, -90], [-60, 60]] },
      { id: 'vogon-vogsphere-film', trackId: 'arthur-ford-film', fromPlaceId: 'vogon-fleet-hgf', toPlaceId: 'vogsphere-hgf', controlPointOffsets: [[80, 70], [-70, -60]] },
      { id: 'vogsphere-heart-film', trackId: 'trillian-film', fromPlaceId: 'vogsphere-hgf', toPlaceId: 'heart-of-gold-hgf', controlPointOffsets: [[70, -90], [-70, 75]] },
      { id: 'heart-magrathea-film', trackId: 'zaphod-film', fromPlaceId: 'heart-of-gold-hgf', toPlaceId: 'magrathea-hgf', controlPointOffsets: [[90, 50], [-75, -60]] },
      { id: 'magrathea-new-earth-film', trackId: 'arthur-ford-film', fromPlaceId: 'magrathea-hgf', toPlaceId: 'earth-reborn-hgf', controlPointOffsets: [[50, -95], [-80, 70]] },
    ],
  } },
}
