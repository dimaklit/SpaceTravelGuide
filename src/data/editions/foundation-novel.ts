import type { StoryEdition } from '../../domain/story'

export const foundationNovel: StoryEdition = {
  id: 'foundation-novel',
  work: { id: 'foundation', title: 'Foundation', creator: 'Isaac Asimov', genre: 'Science fiction' },
  format: 'novel',
  editionLabel: 'NOVEL EDITION',
  subtitle: 'From Trantor to the Periphery',
  interpretationNote: 'Novel route interpretation. Galactic positions and political links are schematic, not to scale.',
  tracks: [
    { id: 'gaal', name: 'Gaal Dornick', role: 'Mathematician', color: '#77d8c5', kind: 'physical' },
    { id: 'seldon-exiles', name: 'Seldon’s expedition', role: 'Foundation settlers', color: '#f27854', kind: 'physical' },
    { id: 'hardin', name: 'Salvor Hardin', role: 'Mayor of Terminus', color: '#edc767', kind: 'physical' },
    { id: 'mallow', name: 'Hober Mallow', role: 'Trader', color: '#a7a0dd', kind: 'physical' },
    { id: 'foundation-diplomacy', name: 'Foundation diplomacy', role: 'Political connection', color: '#e58eb0', kind: 'political' },
  ],
  places: [
    { id: 'synnax', name: 'Synnax', subtitle: 'Gaal Dornick’s homeworld' },
    { id: 'trantor', name: 'Trantor', subtitle: 'Imperial capital' },
    { id: 'terminus', name: 'Terminus', subtitle: 'Foundation settlement' },
    { id: 'anacreon', name: 'Anacreon', subtitle: 'Periphery kingdom' },
    { id: 'askone', name: 'Askone', subtitle: 'Periphery world' },
    { id: 'korell', name: 'Korell', subtitle: 'Korellian Republic' },
    { id: 'smyrno', name: 'Smyrno', subtitle: 'Periphery world' },
  ],
  beats: [
    {
      id: 'gaal-arrives', mapView: 'schematicNetwork', title: 'Gaal reaches Trantor', location: 'Synnax → Trantor', reference: 'Part I · The Psychohistorians',
      detail: 'Gaal Dornick travels from his provincial homeworld to Trantor, where Hari Seldon’s psychohistory changes the course of his life.', trackId: 'gaal',
      travellers: [{ trackId: 'gaal', routeId: 'synnax-trantor', progress: 0.94 }],
    },
    {
      id: 'foundation-exile', mapView: 'schematicNetwork', title: 'The Foundation is exiled', location: 'Trantor → Terminus', reference: 'Part I · The Psychohistorians',
      detail: 'Seldon’s plan sends the Encyclopedists and their project to Terminus at the edge of the Empire.', trackId: 'seldon-exiles',
      travellers: [{ trackId: 'seldon-exiles', routeId: 'trantor-terminus', progress: 0.98 }],
    },
    {
      id: 'anacreon-crisis', mapView: 'schematicNetwork', title: 'The Anacreon crisis', location: 'Terminus ↔ Anacreon', reference: 'Part II · The Encyclopedists',
      detail: 'The Foundation faces pressure from neighbouring Anacreon. Salvor Hardin turns a political confrontation into the first major Seldon Crisis.', trackId: 'foundation-diplomacy',
      travellers: [{ trackId: 'hardin', routeId: 'terminus-anacreon', progress: 0.55 }],
    },
    {
      id: 'hardin-mission', mapView: 'schematicNetwork', title: 'Hardin’s mission to Anacreon', location: 'Terminus → Anacreon', reference: 'Part III · The Mayors',
      detail: 'Hardin travels to Anacreon as the balance of power shifts from the old Empire toward the Foundation.', trackId: 'hardin',
      travellers: [{ trackId: 'hardin', routeId: 'terminus-anacreon', progress: 0.88 }],
    },
    {
      id: 'mallow-trade', mapView: 'schematicNetwork', title: 'Mallow’s trade mission', location: 'Terminus → Korell', reference: 'Part V · The Merchant Princes',
      detail: 'Hober Mallow travels to Korell to investigate a political and commercial threat to the Foundation.', trackId: 'mallow',
      travellers: [{ trackId: 'mallow', routeId: 'terminus-korell', progress: 0.72 }],
    },
    {
      id: 'periphery-network', mapView: 'schematicNetwork', title: 'The Periphery comes into focus', location: 'Terminus ↔ Korell · Askone · Smyrno', reference: 'Parts IV–V · The Traders / The Merchant Princes',
      detail: 'Trade and political influence connect Terminus to a widening network of Periphery worlds. Connections are shown schematically, not as measured travel paths.', trackId: 'foundation-diplomacy',
      travellers: [
        { trackId: 'foundation-diplomacy', routeId: 'terminus-askone', progress: 0.7 },
        { trackId: 'foundation-diplomacy', routeId: 'terminus-smyrno', progress: 0.58 },
      ],
    },
  ],
  maps: {
    schematicNetwork: {
      id: 'foundation-periphery-network',
      scaleNote: 'SCHEMATIC GALACTIC NETWORK · NOT TO SCALE',
      coordinateLabel: 'FOUNDATION / PERIPHERY WORLDS',
      width: 1000,
      height: 560,
      nodes: [
        { placeId: 'synnax', x: 105, y: 430, category: 'world' },
        { placeId: 'trantor', x: 285, y: 235, category: 'world' },
        { placeId: 'terminus', x: 545, y: 310, category: 'world' },
        { placeId: 'anacreon', x: 775, y: 145, category: 'world' },
        { placeId: 'askone', x: 825, y: 340, category: 'world' },
        { placeId: 'korell', x: 745, y: 465, category: 'world' },
        { placeId: 'smyrno', x: 945, y: 240, category: 'world' },
      ],
      routes: [
        { id: 'synnax-trantor', trackId: 'gaal', fromPlaceId: 'synnax', toPlaceId: 'trantor', controlPointOffsets: [[80, -10], [-70, 55]] },
        { id: 'trantor-terminus', trackId: 'seldon-exiles', fromPlaceId: 'trantor', toPlaceId: 'terminus', controlPointOffsets: [[70, 20], [-80, -65]] },
        { id: 'terminus-anacreon', trackId: 'foundation-diplomacy', fromPlaceId: 'terminus', toPlaceId: 'anacreon', controlPointOffsets: [[70, -100], [-110, 70]] },
        { id: 'terminus-korell', trackId: 'mallow', fromPlaceId: 'terminus', toPlaceId: 'korell', controlPointOffsets: [[40, 105], [-75, -30]] },
        { id: 'terminus-askone', trackId: 'foundation-diplomacy', fromPlaceId: 'terminus', toPlaceId: 'askone', controlPointOffsets: [[105, -15], [-85, -55]] },
        { id: 'terminus-smyrno', trackId: 'foundation-diplomacy', fromPlaceId: 'terminus', toPlaceId: 'smyrno', controlPointOffsets: [[120, -80], [-110, 80]] },
      ],
    },
  },
}
