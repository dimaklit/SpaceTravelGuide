import type { StoryEdition } from '../../domain/story'

export const projectHailMaryNovel: StoryEdition = {
  id: 'project-hail-mary-novel',
  work: { id: 'project-hail-mary', title: 'Project Hail Mary', creator: 'Andy Weir', genre: 'Science fiction' },
  format: 'novel',
  editionLabel: 'NOVEL EDITION',
  subtitle: 'Sol to Tau Ceti and Erid',
  interpretationNote: 'Novel route interpretation. Interstellar links are schematic and not to scale; exact travel paths are not specified.',
  tracks: [
    { id: 'grace', name: 'Ryland Grace', role: 'Hail Mary crew', color: '#f27854', kind: 'physical' },
    { id: 'rocky', name: 'Rocky', role: 'Eridian engineer', color: '#77d8c5', kind: 'physical' },
    { id: 'beetle', name: 'Beetle probe', role: 'Sample return', color: '#edc767', kind: 'physical' },
  ],
  places: [
    { id: 'sol', name: 'Sol / Earth', subtitle: 'Humanity’s point of departure' },
    { id: 'tau-ceti', name: 'Tau Ceti', subtitle: 'Hail Mary rendezvous system' },
    { id: 'forty-eridani', name: '40 Eridani', subtitle: 'Erid home system' },
    { id: 'adrian', name: 'Adrian', subtitle: 'Tau Ceti system · Astrophage source world' },
    { id: 'erid', name: 'Erid', subtitle: 'Rocky’s home planet' },
  ],
  beats: [
    {
      id: 'grace-arrival', mapView: 'schematicNetwork', title: 'Grace approaches Tau Ceti', location: 'Sol → Tau Ceti', reference: 'Voyage · Hail Mary',
      detail: 'Ryland Grace wakes aboard the Hail Mary as it nears Tau Ceti, the system chosen for humanity’s search for a solution.', trackId: 'grace',
      travellers: [{ trackId: 'grace', routeId: 'sol-tau-ceti', progress: 0.94 }],
    },
    {
      id: 'rocky-meets-grace', mapView: 'schematicNetwork', title: 'The Blip-A rendezvous', location: '40 Eridani → Tau Ceti', reference: 'Tau Ceti mission · First contact',
      detail: 'Rocky arrives from the 40 Eridani system. The two survivors meet at Tau Ceti and begin working together.', trackId: 'grace',
      travellers: [
        { trackId: 'grace', routeId: 'sol-tau-ceti', progress: 0.98 },
        { trackId: 'rocky', routeId: 'eridani-tau-ceti', progress: 0.96 },
      ],
    },
    {
      id: 'adrian-investigation', mapView: 'schematicNetwork', title: 'Investigating Adrian', location: 'Tau Ceti → Adrian', reference: 'Tau Ceti mission · Astrophage study',
      detail: 'Grace and Rocky investigate Adrian and the organisms that may explain why Tau Ceti is spared from Astrophage.', trackId: 'grace',
      travellers: [
        { trackId: 'grace', routeId: 'tau-ceti-adrian', progress: 0.7 },
        { trackId: 'rocky', routeId: 'tau-ceti-adrian', progress: 0.7 },
      ],
    },
    {
      id: 'beetles-depart', mapView: 'schematicNetwork', title: 'The Beetles head home', location: 'Tau Ceti → Sol / Earth', reference: 'Return plan · Beetle probes',
      detail: 'The automated Beetle probes carry the sample and the mission’s findings toward Earth while Grace and Rocky remain in the Tau Ceti system.', trackId: 'beetle',
      travellers: [{ trackId: 'beetle', routeId: 'tau-ceti-sol', progress: 0.46 }],
    },
    {
      id: 'rocky-rescue', mapView: 'schematicNetwork', title: 'Grace turns toward Erid', location: 'Tau Ceti → 40 Eridani', reference: 'Return journey · Rocky’s emergency',
      detail: 'Grace changes course to help Rocky return home, accepting that he may not make it back to Earth.', trackId: 'grace',
      travellers: [
        { trackId: 'grace', routeId: 'tau-ceti-eridani', progress: 0.22 },
        { trackId: 'rocky', routeId: 'tau-ceti-eridani', progress: 0.22 },
      ],
    },
    {
      id: 'erid-arrival', mapView: 'schematicNetwork', title: 'A new home on Erid', location: '40 Eridani → Erid', reference: 'Epilogue · Erid',
      detail: 'Grace reaches Erid with Rocky and makes a life among the Eridians rather than returning to Earth.', trackId: 'grace',
      travellers: [
        { trackId: 'grace', routeId: 'eridani-erid', progress: 1 },
        { trackId: 'rocky', routeId: 'eridani-erid', progress: 1 },
      ],
    },
  ],
  maps: {
    schematicNetwork: {
      id: 'hail-mary-interstellar-network',
      scaleNote: 'INTERSTELLAR ROUTES · SCHEMATIC · NOT TO SCALE',
      coordinateLabel: 'SOL / TAU CETI / 40 ERIDANI',
      width: 1000,
      height: 560,
      nodes: [
        { placeId: 'sol', x: 125, y: 355, category: 'star' },
        { placeId: 'tau-ceti', x: 480, y: 235, category: 'star' },
        { placeId: 'adrian', x: 585, y: 365, category: 'world' },
        { placeId: 'forty-eridani', x: 840, y: 170, category: 'star' },
        { placeId: 'erid', x: 895, y: 325, category: 'world' },
      ],
      routes: [
        { id: 'sol-tau-ceti', trackId: 'grace', fromPlaceId: 'sol', toPlaceId: 'tau-ceti', controlPointOffsets: [[110, -70], [-105, -65]] },
        { id: 'eridani-tau-ceti', trackId: 'rocky', fromPlaceId: 'forty-eridani', toPlaceId: 'tau-ceti', controlPointOffsets: [[-120, 20], [100, -50]] },
        { id: 'tau-ceti-adrian', trackId: 'grace', fromPlaceId: 'tau-ceti', toPlaceId: 'adrian', controlPointOffsets: [[80, 35], [-55, -55]] },
        { id: 'tau-ceti-sol', trackId: 'beetle', fromPlaceId: 'tau-ceti', toPlaceId: 'sol', controlPointOffsets: [[-110, 65], [100, 70]] },
        { id: 'tau-ceti-eridani', trackId: 'grace', fromPlaceId: 'tau-ceti', toPlaceId: 'forty-eridani', controlPointOffsets: [[100, -55], [-120, 25]] },
        { id: 'eridani-erid', trackId: 'grace', fromPlaceId: 'forty-eridani', toPlaceId: 'erid', controlPointOffsets: [[55, 45], [-40, -50]] },
      ],
    },
  },
}
