import type { StoryEdition } from '../../domain/story'

export const duneNovel: StoryEdition = {
  id: 'dune-novel',
  work: { id: 'dune', title: 'Dune', creator: 'Frank Herbert', genre: 'Science fiction' },
  format: 'novel',
  editionLabel: 'NOVEL EDITION',
  subtitle: 'Caladan to Arrakis',
  interpretationNote: 'Novel route interpretation. Arrakis locations and travel corridors are schematic, not to scale.',
  tracks: [
    { id: 'paul', name: 'Paul Atreides', role: 'House heir', color: '#f27854', kind: 'physical' },
    { id: 'jessica', name: 'Lady Jessica', role: 'Bene Gesserit', color: '#77d8c5', kind: 'physical' },
    { id: 'fremen', name: 'Fremen', role: 'Desert movement', color: '#edc767', kind: 'physical' },
    { id: 'atreides-house', name: 'House Atreides', role: 'Political transfer', color: '#89a8d1', kind: 'political' },
  ],
  places: [
    { id: 'caladan', name: 'Caladan', subtitle: 'House Atreides homeworld' },
    { id: 'arrakis', name: 'Arrakis', subtitle: 'Desert planet · Canopus system · schematic position' },
    { id: 'canopus', name: 'Canopus', subtitle: 'Arrakis star system · schematic anchor' },
    { id: 'arrakeen', name: 'Arrakeen', subtitle: 'Atreides seat on Arrakis' },
    { id: 'deep-desert', name: 'Deep desert', subtitle: 'Open erg · route schematic' },
    { id: 'sietch-tabr', name: 'Sietch Tabr', subtitle: 'Fremen settlement' },
    { id: 'south-desert', name: 'Southern desert', subtitle: 'Fremen territory · schematic' },
  ],
  beats: [
    {
      id: 'atreides-transfer', mapView: 'schematicNetwork', title: 'The Atreides transfer', location: 'Caladan → Arrakis', reference: 'Book I · Dune',
      detail: 'House Atreides leaves Caladan to take stewardship of Arrakis. Paul and Jessica arrive in a world whose value is inseparable from its dangers.', trackId: 'atreides-house',
      travellers: [
        { trackId: 'atreides-house', routeId: 'caladan-arrakis', progress: 1 },
        { trackId: 'paul', routeId: 'caladan-arrakis', progress: 1 },
        { trackId: 'jessica', routeId: 'caladan-arrakis', progress: 1 },
      ],
    },
    {
      id: 'escape-into-desert', mapView: 'schematicNetwork', title: 'Escape into the desert', location: 'Arrakeen → deep desert', reference: 'Book I · Dune',
      detail: 'After the fall of House Atreides, Paul and Jessica flee the city and cross into the open desert.', trackId: 'paul',
      travellers: [
        { trackId: 'paul', routeId: 'arrakeen-deep-desert', progress: 0.86 },
        { trackId: 'jessica', routeId: 'arrakeen-deep-desert', progress: 0.86 },
      ],
    },
    {
      id: 'sietch', mapView: 'schematicNetwork', title: 'Finding the Fremen', location: 'Deep desert → Sietch Tabr', reference: 'Book I · Dune',
      detail: 'Paul and Jessica reach Sietch Tabr and enter Fremen society, changing the political balance on Arrakis.', trackId: 'paul',
      travellers: [
        { trackId: 'paul', routeId: 'deep-desert-sietch', progress: 1 },
        { trackId: 'jessica', routeId: 'deep-desert-sietch', progress: 1 },
      ],
    },
    {
      id: 'fremen-movement', mapView: 'schematicNetwork', title: 'Across Fremen territory', location: 'Sietch Tabr → southern desert', reference: 'Book II · Muad’Dib',
      detail: 'Paul and Jessica move with the Fremen through the desert as Paul’s role among them grows.', trackId: 'fremen',
      travellers: [
        { trackId: 'paul', routeId: 'sietch-south', progress: 0.72 },
        { trackId: 'jessica', routeId: 'sietch-south', progress: 0.72 },
        { trackId: 'fremen', routeId: 'sietch-south', progress: 0.72 },
      ],
    },
    {
      id: 'arrakeen-campaign', mapView: 'schematicNetwork', title: 'The return to Arrakeen', location: 'Southern desert → Arrakeen', reference: 'Book III · The Prophet',
      detail: 'The Fremen advance from the southern desert toward Arrakeen for the final confrontation over Arrakis.', trackId: 'fremen',
      travellers: [{ trackId: 'fremen', routeId: 'south-arrakeen', progress: 0.9 }],
    },
  ],
  maps: {
    schematicNetwork: {
      id: 'dune-arrakis-network',
      scaleNote: 'SCHEMATIC ROUTES · NOT TO SCALE',
      coordinateLabel: 'CALADAN / ARRAKIS · STORY LOCATIONS',
      width: 1000,
      height: 560,
      nodes: [
        { placeId: 'caladan', x: 140, y: 205, category: 'world' },
        { placeId: 'canopus', x: 790, y: 105, category: 'star' },
        { placeId: 'arrakis', x: 850, y: 190, category: 'world' },
        { placeId: 'arrakeen', x: 785, y: 245, category: 'region' },
        { placeId: 'deep-desert', x: 590, y: 330, category: 'region' },
        { placeId: 'sietch-tabr', x: 440, y: 255, category: 'region' },
        { placeId: 'south-desert', x: 680, y: 445, category: 'region' },
      ],
      routes: [
        { id: 'caladan-arrakis', trackId: 'atreides-house', fromPlaceId: 'caladan', toPlaceId: 'arrakis', controlPointOffsets: [[140, -80], [-150, -65]] },
        { id: 'arrakeen-deep-desert', trackId: 'paul', fromPlaceId: 'arrakeen', toPlaceId: 'deep-desert', controlPointOffsets: [[-80, 20], [100, -50]] },
        { id: 'deep-desert-sietch', trackId: 'paul', fromPlaceId: 'deep-desert', toPlaceId: 'sietch-tabr', controlPointOffsets: [[-20, -60], [60, 70]] },
        { id: 'sietch-south', trackId: 'fremen', fromPlaceId: 'sietch-tabr', toPlaceId: 'south-desert', controlPointOffsets: [[120, 25], [-100, -80]] },
        { id: 'south-arrakeen', trackId: 'fremen', fromPlaceId: 'south-desert', toPlaceId: 'arrakeen', controlPointOffsets: [[70, -120], [-30, 100]] },
      ],
    },
  },
}
