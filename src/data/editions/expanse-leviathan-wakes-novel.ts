import type { StoryEdition } from '../../domain/story'

export const leviathanWakesNovel: StoryEdition = {
  id: 'expanse-leviathan-wakes-novel',
  work: { id: 'the-expanse', title: 'The Expanse: Leviathan Wakes', creator: 'James S. A. Corey', genre: 'Science fiction' },
  format: 'novel', editionLabel: 'NOVEL · BOOK 1', subtitle: 'Canterbury to Eros',
  interpretationNote: 'Novel route interpretation. Interplanetary paths and distances are schematic; the book does not provide plotted coordinates.',
  tracks: [
    { id: 'holden-crew', name: 'Holden and crew', role: 'Rocinante crew', color: '#f27854', kind: 'physical' },
    { id: 'miller', name: 'Joe Miller', role: 'Ceres detective', color: '#77d8c5', kind: 'physical' },
    { id: 'julie', name: 'Julie Mao', role: 'Scopuli survivor', color: '#edc767', kind: 'physical' },
  ],
  places: [
    { id: 'cant', name: 'Canterbury', subtitle: 'Ice hauler · Saturn system' },
    { id: 'scopuli', name: 'Scopuli', subtitle: 'Distress signal in the Belt' },
    { id: 'ceres', name: 'Ceres Station', subtitle: 'Miller’s assignment' },
    { id: 'tycho', name: 'Tycho Station', subtitle: 'Rocinante refit' },
    { id: 'eros', name: 'Eros Station', subtitle: 'The investigation converges' },
    { id: 'roci', name: 'Rocinante', subtitle: 'Salvaged ship · schematic position' },
  ],
  beats: [
    { id: 'cant-destroyed', mapView: 'schematicNetwork', title: 'The Canterbury is destroyed', location: 'Canterbury → Scopuli distress signal', reference: 'Part I · Leviathan Wakes', detail: 'Holden’s ice-hauling crew answers a distress signal; the Canterbury is destroyed and the crew is left in a system-wide crisis.', trackId: 'holden-crew', travellers: [{ trackId: 'holden-crew', routeId: 'cant-to-signal', progress: 0.8 }] },
    { id: 'rocinante', mapView: 'schematicNetwork', title: 'A new ship and a new course', location: 'Salvage site → Tycho Station', reference: 'Part II · Leviathan Wakes', detail: 'The survivors take the salvaged Rocinante to Tycho, while Miller’s Ceres investigation points toward Julie Mao.', trackId: 'holden-crew', travellers: [{ trackId: 'holden-crew', routeId: 'salvage-to-tycho', progress: 0.92 }, { trackId: 'miller', routeId: 'ceres-to-eros', progress: 0.28 }] },
    { id: 'eros-search', mapView: 'schematicNetwork', title: 'The search reaches Eros', location: 'Ceres / Tycho → Eros', reference: 'Part III · Leviathan Wakes', detail: 'Holden’s crew and Miller converge on Eros, where the Scopuli mystery and Julie’s story meet.', trackId: 'miller', travellers: [{ trackId: 'holden-crew', routeId: 'tycho-to-eros', progress: 0.78 }, { trackId: 'miller', routeId: 'ceres-to-eros', progress: 0.88 }] },
    { id: 'eros-escape', mapView: 'schematicNetwork', title: 'Escape from Eros', location: 'Eros → Rocinante', reference: 'Part IV · Leviathan Wakes', detail: 'The crew races to leave Eros as the protomolecule crisis escalates. Their route becomes an escape rather than an investigation.', trackId: 'holden-crew', travellers: [{ trackId: 'holden-crew', routeId: 'eros-to-roci', progress: 0.7 }] },
  ],
  maps: { schematicNetwork: {
    id: 'expanse-book-one-network', scaleNote: 'SOLAR SYSTEM ROUTES · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'EARTH / BELT / OUTER SYSTEM', width: 1000, height: 560,
    nodes: [
      { placeId: 'cant', x: 135, y: 150, category: 'station' }, { placeId: 'scopuli', x: 390, y: 190, category: 'station' },
      { placeId: 'ceres', x: 180, y: 390, category: 'station' }, { placeId: 'tycho', x: 505, y: 390, category: 'station' },
      { placeId: 'eros', x: 810, y: 270, category: 'station' }, { placeId: 'roci', x: 590, y: 150, category: 'station' },
    ],
    routes: [
      { id: 'cant-to-signal', trackId: 'holden-crew', fromPlaceId: 'cant', toPlaceId: 'scopuli', controlPointOffsets: [[75, -35], [-65, -35]] },
      { id: 'salvage-to-tycho', trackId: 'holden-crew', fromPlaceId: 'scopuli', toPlaceId: 'tycho', controlPointOffsets: [[60, 100], [-75, -80]] },
      { id: 'ceres-to-eros', trackId: 'miller', fromPlaceId: 'ceres', toPlaceId: 'eros', controlPointOffsets: [[100, -20], [-100, 60]] },
      { id: 'tycho-to-eros', trackId: 'holden-crew', fromPlaceId: 'tycho', toPlaceId: 'eros', controlPointOffsets: [[90, -90], [-100, 80]] },
      { id: 'eros-to-roci', trackId: 'holden-crew', fromPlaceId: 'eros', toPlaceId: 'roci', controlPointOffsets: [[-70, -100], [80, 70]] },
    ],
  } },
}
