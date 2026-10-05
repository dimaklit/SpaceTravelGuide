import type { StoryEdition } from '../../domain/story'

export const hyperionNovel: StoryEdition = {
  id: 'hyperion-novel',
  work: { id: 'hyperion', title: 'Hyperion', creator: 'Dan Simmons', genre: 'Science fiction' },
  format: 'novel', editionLabel: 'NOVEL EDITION', subtitle: 'The pilgrimage to Hyperion',
  interpretationNote: 'Novel route interpretation. The pilgrimage route is schematic and not to scale; the pilgrims’ earlier life journeys are separate stories.',
  tracks: [
    { id: 'pilgrims', name: 'The seven pilgrims', role: 'Time Tombs expedition', color: '#f27854', kind: 'physical' },
    { id: 'consul', name: 'The Consul', role: 'Pilgrim and pilot', color: '#77d8c5', kind: 'physical' },
  ],
  places: [
    { id: 'tau-ceti-center', name: 'Tau Ceti Center', subtitle: 'WorldWeb · pilgrimage departure' },
    { id: 'hegemony', name: 'Hegemony worlds', subtitle: 'Pilgrims’ separate origins · schematic grouping' },
    { id: 'hyperion', name: 'Hyperion', subtitle: 'World of the Time Tombs' },
    { id: 'time-tombs', name: 'Time Tombs', subtitle: 'Pilgrimage destination' },
  ],
  beats: [
    { id: 'pilgrimage-departs', mapView: 'schematicNetwork', title: 'The pilgrimage departs', location: 'Tau Ceti Center → Hyperion', reference: 'The Priest’s Tale · The River Lethe’s Taste Is Bitter', detail: 'Seven pilgrims leave the WorldWeb for Hyperion. Their separate histories unfold along one shared outward journey.', trackId: 'pilgrims', travellers: [{ trackId: 'pilgrims', routeId: 'worldweb-hyperion', progress: 0.22 }] },
    { id: 'priest-tale', mapView: 'schematicNetwork', title: 'The Priest’s Tale', location: 'WorldWeb → Hyperion', reference: 'The Priest’s Tale', detail: 'The first account turns the pilgrimage into a story about a remote mission, faith, and the Shrike.', trackId: 'pilgrims', travellers: [{ trackId: 'pilgrims', routeId: 'worldweb-hyperion', progress: 0.36 }] },
    { id: 'soldier-tale', mapView: 'schematicNetwork', title: 'The Soldier’s Tale', location: 'WorldWeb → Hyperion', reference: 'The Soldier’s Tale', detail: 'Kassad’s story connects his military past and visions of Moneta to the pilgrimage’s destination.', trackId: 'pilgrims', travellers: [{ trackId: 'pilgrims', routeId: 'worldweb-hyperion', progress: 0.52 }] },
    { id: 'poet-tale', mapView: 'schematicNetwork', title: 'The Poet’s Tale', location: 'WorldWeb → Hyperion', reference: 'The Poet’s Tale', detail: 'Silenus recounts his long relationship with Hyperion and the poem that shaped his life.', trackId: 'pilgrims', travellers: [{ trackId: 'pilgrims', routeId: 'worldweb-hyperion', progress: 0.68 }] },
    { id: 'consul-tale', mapView: 'schematicNetwork', title: 'The Consul’s Tale', location: 'Hyperion system → Hyperion', reference: 'The Consul’s Tale', detail: 'The Consul’s history links political events in the Hegemony to the pilgrimage and its final approach.', trackId: 'consul', travellers: [{ trackId: 'consul', routeId: 'hyperion-approach', progress: 0.88 }] },
    { id: 'time-tombs-arrival', mapView: 'schematicNetwork', title: 'The Time Tombs', location: 'Hyperion → Time Tombs', reference: 'The Scholar’s Tale / The Shrike', detail: 'The pilgrims reach the Time Tombs, where their separate journeys converge at the object of the pilgrimage.', trackId: 'pilgrims', travellers: [{ trackId: 'pilgrims', routeId: 'hyperion-time-tombs', progress: 1 }] },
  ],
  maps: { schematicNetwork: {
    id: 'hyperion-pilgrimage-network', scaleNote: 'PILGRIMAGE ROUTE · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'WORLDWEB / HYPERION / TIME TOMBS', width: 1000, height: 560,
    nodes: [
      { placeId: 'hegemony', x: 150, y: 120, category: 'region' }, { placeId: 'tau-ceti-center', x: 205, y: 330, category: 'station' },
      { placeId: 'hyperion', x: 745, y: 280, category: 'world' }, { placeId: 'time-tombs', x: 875, y: 365, category: 'region' },
    ],
    routes: [
      { id: 'worldweb-hyperion', trackId: 'pilgrims', fromPlaceId: 'tau-ceti-center', toPlaceId: 'hyperion', controlPointOffsets: [[150, -55], [-155, 90]] },
      { id: 'hyperion-approach', trackId: 'consul', fromPlaceId: 'tau-ceti-center', toPlaceId: 'hyperion', controlPointOffsets: [[150, 80], [-145, -75]] },
      { id: 'hyperion-time-tombs', trackId: 'pilgrims', fromPlaceId: 'hyperion', toPlaceId: 'time-tombs', controlPointOffsets: [[75, -35], [-50, -65]] },
    ],
  } },
}
