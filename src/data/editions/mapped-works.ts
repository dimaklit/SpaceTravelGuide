import type { EditionFormat, StoryEdition } from '../../domain/story'
import { theMartianNovel } from './the-martian-novel'

type MappedJourney = {
  id: string
  workId: string
  title: string
  creator: string
  genre: string
  format: EditionFormat
  editionLabel: string
  subtitle: string
  origin: string
  originNote: string
  destination: string
  destinationNote: string
  actor: string
  actorRole: string
  beatTitle: string
  reference: string
  detail: string
  color: string
  coordinateLabel: string
  nodeKind?: 'world' | 'star' | 'region' | 'station'
}

function mappedJourney(config: MappedJourney): StoryEdition {
  const routeId = `${config.id}-route`
  const actorId = `${config.id}-actor`
  const originId = `${config.id}-origin`
  const destinationId = `${config.id}-destination`

  return {
    id: config.id,
    work: { id: config.workId, title: config.title, creator: config.creator, genre: config.genre },
    format: config.format,
    editionLabel: config.editionLabel,
    subtitle: config.subtitle,
    interpretationNote: `${config.format === 'film' ? 'Film' : 'Novel'} route guide. The shown location is mapped schematically; distances and route geometry are not to scale.`,
    tracks: [{ id: actorId, name: config.actor, role: config.actorRole, color: config.color, kind: 'physical' }],
    places: [
      { id: originId, name: config.origin, subtitle: config.originNote },
      { id: destinationId, name: config.destination, subtitle: config.destinationNote },
    ],
    beats: [{
      id: `${config.id}-arrival`,
      mapView: 'schematicNetwork',
      title: config.beatTitle,
      location: `${config.origin} → ${config.destination}`,
      reference: config.reference,
      detail: config.detail,
      trackId: actorId,
      travellers: [{ trackId: actorId, routeId, progress: 0.72 }],
    }],
    maps: {
      schematicNetwork: {
        id: `${config.id}-network`,
        scaleNote: 'STORY LOCATION · SCHEMATIC · NOT TO SCALE',
        coordinateLabel: config.coordinateLabel,
        width: 1000,
        height: 560,
        nodes: [
          { placeId: originId, x: 150, y: 340, category: 'star' },
          { placeId: destinationId, x: 830, y: 220, category: config.nodeKind ?? 'world' },
        ],
        routes: [{
          id: routeId,
          trackId: actorId,
          fromPlaceId: originId,
          toPlaceId: destinationId,
          controlPointOffsets: [[180, -120], [-170, 100]],
        }],
      },
    },
  }
}

export const mappedBookAndFilmEditions: StoryEdition[] = [
  mappedJourney({
    id: 'contact-novel', workId: 'contact', title: 'Contact', creator: 'Carl Sagan', genre: 'Science fiction', format: 'novel', editionLabel: 'NOVEL EDITION', subtitle: 'Earth to Vega',
    origin: 'Earth', originNote: 'Humanity’s point of departure', destination: 'Vega', destinationNote: 'Signal origin · star system', actor: 'Ellie Arroway', actorRole: 'SETI astronomer', beatTitle: 'Following the Vega signal', reference: 'Contact · Vega sequence',
    detail: 'The detected signal from Vega draws Ellie Arroway and the international response into humanity’s first contact story.', color: '#77d8c5', coordinateLabel: 'SOL / VEGA', nodeKind: 'star',
  }),
  mappedJourney({
    id: 'contact-film', workId: 'contact', title: 'Contact', creator: 'Robert Zemeckis', genre: 'Science fiction film', format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to Vega',
    origin: 'Earth', originNote: 'Film point of departure', destination: 'Vega', destinationNote: 'Signal origin · star system', actor: 'Ellie Arroway', actorRole: 'SETI scientist', beatTitle: 'The Vega transmission', reference: 'Contact · Film sequence',
    detail: 'The film follows Ellie Arroway from the Vega signal to the machine project and its journey beyond Earth.', color: '#77d8c5', coordinateLabel: 'SOL / VEGA', nodeKind: 'star',
  }),
  mappedJourney({
    id: 'dune-film', workId: 'dune', title: 'Dune', creator: 'Denis Villeneuve', genre: 'Science fiction film', format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Caladan to Arrakis',
    origin: 'Caladan', originNote: 'House Atreides homeworld', destination: 'Canopus', destinationNote: 'Arrakis system · star', actor: 'Paul Atreides', actorRole: 'House heir', beatTitle: 'The Atreides journey to Arrakis', reference: 'Dune · Film opening',
    detail: 'House Atreides travels from Caladan to Arrakis, shown here at its Canopus system anchor. Film events are kept separate from the novel route.', color: '#f27854', coordinateLabel: 'CALADAN / CANOPUS SYSTEM', nodeKind: 'star',
  }),
  {
    id: 'enders-game-novel',
    work: { id: 'enders-game', title: 'Ender’s Game', creator: 'Orson Scott Card', genre: 'Science fiction' },
    format: 'novel', editionLabel: 'NOVEL EDITION', subtitle: 'Earth to the Formic worlds',
    interpretationNote: 'Novel route interpretation. Battle School and Command School are associated with Eros; final interstellar destinations are schematic and not to scale.',
    tracks: [
      { id: 'ender', name: 'Ender Wiggin', role: 'Trainee commander', color: '#f27854', kind: 'physical' },
      { id: 'valentine', name: 'Valentine Wiggin', role: 'Earth storyline', color: '#77d8c5', kind: 'physical' },
      { id: 'fleet', name: 'International Fleet', role: 'Military movement', color: '#edc767', kind: 'physical' },
    ],
    places: [
      { id: 'earth-ender', name: 'Earth', subtitle: 'Wiggin family home' },
      { id: 'battle-school-ender', name: 'Battle School', subtitle: 'Orbiting training station' },
      { id: 'eros-ender', name: 'Eros', subtitle: 'Asteroid Belt · Command School' },
      { id: 'formic-world', name: 'Formic homeworld', subtitle: 'Remote target system · schematic' },
      { id: 'colony-world', name: 'Colony world', subtitle: 'Later settlement · schematic' },
    ],
    beats: [
      { id: 'ender-recruited', mapView: 'schematicNetwork', title: 'Ender is recruited', location: 'Earth → Battle School', reference: 'Part I · Third', detail: 'Ender leaves Earth for the International Fleet’s orbiting Battle School.', trackId: 'ender', travellers: [{ trackId: 'ender', routeId: 'earth-battle-school', progress: 0.92 }] },
      { id: 'battle-school', mapView: 'schematicNetwork', title: 'Training in orbit', location: 'Battle School · Earth orbit', reference: 'Part II · The Rabbit Game', detail: 'Ender trains in the Battle Room and rises through the school’s command structure.', trackId: 'ender', travellers: [{ trackId: 'ender', routeId: 'earth-battle-school', progress: 1 }] },
      { id: 'command-school', mapView: 'schematicNetwork', title: 'Transfer to Command School', location: 'Battle School → Eros', reference: 'Part III · Bonzo', detail: 'Ender is transferred to Command School on Eros and placed under Mazer Rackham’s instruction.', trackId: 'ender', travellers: [{ trackId: 'ender', routeId: 'battle-school-eros', progress: 0.94 }] },
      { id: 'final-simulation', mapView: 'schematicNetwork', title: 'The final test', location: 'Eros → Formic homeworld', reference: 'Part IV · Ender’s Game', detail: 'The apparent simulation is revealed as a real remote battle against the Formic homeworld.', trackId: 'fleet', travellers: [{ trackId: 'fleet', routeId: 'eros-formic-world', progress: 1 }] },
      { id: 'colony', mapView: 'schematicNetwork', title: 'A world for the Hive Queen', location: 'Formic world → colony world', reference: 'Part V · The Speaker for the Dead', detail: 'Ender and Valentine travel with colonists; Ender later carries the Hive Queen’s egg toward a new home.', trackId: 'ender', travellers: [{ trackId: 'ender', routeId: 'formic-colony', progress: 0.76 }, { trackId: 'valentine', routeId: 'formic-colony', progress: 0.76 }] },
    ],
    maps: { schematicNetwork: {
      id: 'enders-game-novel-network', scaleNote: 'EARTH ORBIT / INTERSTELLAR ROUTES · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'EARTH / EROS / FORMIC WORLDS', width: 1000, height: 560,
      nodes: [
        { placeId: 'earth-ender', x: 120, y: 385, category: 'world' },
        { placeId: 'battle-school-ender', x: 320, y: 270, category: 'station' },
        { placeId: 'eros-ender', x: 515, y: 310, category: 'station' },
        { placeId: 'formic-world', x: 800, y: 165, category: 'world' },
        { placeId: 'colony-world', x: 875, y: 420, category: 'world' },
      ],
      routes: [
        { id: 'earth-battle-school', trackId: 'ender', fromPlaceId: 'earth-ender', toPlaceId: 'battle-school-ender', controlPointOffsets: [[70, -75], [-65, 50]] },
        { id: 'battle-school-eros', trackId: 'ender', fromPlaceId: 'battle-school-ender', toPlaceId: 'eros-ender', controlPointOffsets: [[65, 25], [-55, -30]] },
        { id: 'eros-formic-world', trackId: 'fleet', fromPlaceId: 'eros-ender', toPlaceId: 'formic-world', controlPointOffsets: [[120, -110], [-110, 70]] },
        { id: 'formic-colony', trackId: 'ender', fromPlaceId: 'formic-world', toPlaceId: 'colony-world', controlPointOffsets: [[75, 120], [-70, -90]] },
      ],
    } },
  },
  {
    id: 'enders-game-film',
    work: { id: 'enders-game', title: 'Ender’s Game', creator: 'Gavin Hood', genre: 'Science fiction film' },
    format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to the Formic homeworld',
    interpretationNote: 'Film route interpretation. Battle School and Command School are shown at Eros; the Formic world and route geometry are schematic.',
    tracks: [
      { id: 'ender-film', name: 'Ender Wiggin', role: 'Cadet commander', color: '#f27854', kind: 'physical' },
      { id: 'fleet-film', name: 'International Fleet', role: 'Command fleet', color: '#edc767', kind: 'physical' },
    ],
    places: [
      { id: 'earth-ender-film', name: 'Earth', subtitle: 'Ender’s homeworld' },
      { id: 'battle-school-ender-film', name: 'Battle School', subtitle: 'Training station near Eros' },
      { id: 'eros-ender-film', name: 'Eros', subtitle: 'Asteroid Belt · Command School' },
      { id: 'formic-world-film', name: 'Formic homeworld', subtitle: 'Remote target · schematic' },
    ],
    beats: [
      { id: 'battle-school-film', mapView: 'schematicNetwork', title: 'Ender leaves Earth', location: 'Earth → Battle School', reference: 'Film · Battle School', detail: 'Ender is recruited and transported from Earth to the International Fleet’s training station.', trackId: 'ender-film', travellers: [{ trackId: 'ender-film', routeId: 'earth-battle-film', progress: 0.93 }] },
      { id: 'command-school-film', mapView: 'schematicNetwork', title: 'Command School on Eros', location: 'Battle School → Eros', reference: 'Film · Command School', detail: 'Ender is transferred to Eros to train under Mazer Rackham.', trackId: 'ender-film', travellers: [{ trackId: 'ender-film', routeId: 'battle-eros-film', progress: 0.92 }] },
      { id: 'formic-test-film', mapView: 'schematicNetwork', title: 'The final battle', location: 'Eros → Formic homeworld', reference: 'Film · Final simulation', detail: 'The apparent simulation is revealed as a real attack on the Formic homeworld.', trackId: 'fleet-film', travellers: [{ trackId: 'fleet-film', routeId: 'eros-formic-film', progress: 0.96 }] },
    ],
    maps: { schematicNetwork: {
      id: 'enders-game-film-network', scaleNote: 'EARTH ORBIT / INTERSTELLAR ROUTES · SCHEMATIC · NOT TO SCALE', coordinateLabel: 'EARTH / EROS / FORMIC WORLD', width: 1000, height: 560,
      nodes: [
        { placeId: 'earth-ender-film', x: 130, y: 380, category: 'world' },
        { placeId: 'battle-school-ender-film', x: 340, y: 270, category: 'station' },
        { placeId: 'eros-ender-film', x: 555, y: 320, category: 'station' },
        { placeId: 'formic-world-film', x: 840, y: 175, category: 'world' },
      ],
      routes: [
        { id: 'earth-battle-film', trackId: 'ender-film', fromPlaceId: 'earth-ender-film', toPlaceId: 'battle-school-ender-film', controlPointOffsets: [[75, -70], [-65, 45]] },
        { id: 'battle-eros-film', trackId: 'ender-film', fromPlaceId: 'battle-school-ender-film', toPlaceId: 'eros-ender-film', controlPointOffsets: [[65, 35], [-55, -25]] },
        { id: 'eros-formic-film', trackId: 'fleet-film', fromPlaceId: 'eros-ender-film', toPlaceId: 'formic-world-film', controlPointOffsets: [[110, -95], [-95, 60]] },
      ],
    } },
  },
  {
    id: 'three-body-problem-novel',
    work: { id: 'three-body-problem', title: 'The Three-Body Problem', creator: 'Cixin Liu', genre: 'Science fiction' },
    format: 'novel', editionLabel: 'NOVEL EDITION', subtitle: 'Red Coast to Trisolaris',
    interpretationNote: 'First-book route study. Earth locations and character trips are schematic. The Trisolaran connection is a radio signal, not an arriving fleet or travelled route.',
    tracks: [
      { id: 'ye-wenjie', name: 'Ye Wenjie', role: 'Red Coast astrophysicist', color: '#f27854', kind: 'physical' },
      { id: 'wang-miao', name: 'Wang Miao', role: 'Nanomaterials researcher', color: '#77d8c5', kind: 'physical' },
      { id: 'judgment-day', name: 'Judgment Day operation', role: 'ETO investigation', color: '#edc767', kind: 'physical' },
      { id: 'trisolaris-signal', name: 'Red Coast signal', role: 'Communication · not travel', color: '#a7a0dd', kind: 'communication' },
    ],
    places: [
      { id: 'beijing-tbp', name: 'Beijing', subtitle: 'Wang Miao’s investigation · schematic location' },
      { id: 'red-coast', name: 'Red Coast Base', subtitle: 'Inner Mongolia · approximate story location' },
      { id: 'panama-canal-tbp', name: 'Panama Canal', subtitle: 'Judgment Day interception site' },
      { id: 'trisolaris', name: 'Trisolaris system', subtitle: 'Alpha Centauri · schematic anchor, not a visited place in Book I' },
    ],
    beats: [
      {
        id: 'ye-sent-down', mapView: 'schematicNetwork', title: 'Ye Wenjie reaches Red Coast', location: 'Beijing → Red Coast Base', reference: 'Part I · Silent Spring',
        detail: 'After the Cultural Revolution, Ye Wenjie is sent from Beijing to the remote Red Coast Base, where the novel’s first contact story begins.', trackId: 'ye-wenjie',
        travellers: [{ trackId: 'ye-wenjie', routeId: 'beijing-red-coast', progress: 0.94 }],
      },
      {
        id: 'wang-investigation', mapView: 'schematicNetwork', title: 'Wang follows the Red Coast trail', location: 'Beijing → Red Coast Base', reference: 'Part II · Three Body',
        detail: 'Wang Miao’s present-day investigation connects the scientists’ deaths, the ETO, and Ye Wenjie’s earlier work at Red Coast.', trackId: 'wang-miao',
        travellers: [{ trackId: 'wang-miao', routeId: 'beijing-red-coast', progress: 0.78 }],
      },
      {
        id: 'red-coast-reply', mapView: 'schematicNetwork', title: 'A reply is sent into space', location: 'Red Coast Base → Trisolaris signal', reference: 'Part III · Sunset for Humanity',
        detail: 'Ye Wenjie answers the warning received from Trisolaris. This line is a radio communication connection, not a ship or fleet route.', trackId: 'trisolaris-signal',
        travellers: [{ trackId: 'trisolaris-signal', routeId: 'red-coast-signal', progress: 0.86 }],
      },
      {
        id: 'judgment-day', mapView: 'schematicNetwork', title: 'The Judgment Day operation', location: 'Beijing → Panama Canal', reference: 'Part IV · The Three-Body Problem',
        detail: 'Wang and the investigators travel to the Panama Canal to intercept the ETO ship Judgment Day and recover its data.', trackId: 'wang-miao',
        travellers: [
          { trackId: 'wang-miao', routeId: 'beijing-panama', progress: 0.82 },
          { trackId: 'judgment-day', routeId: 'judgment-day-transit', progress: 0.7 },
        ],
      },
      {
        id: 'trisolaris-revelation', mapView: 'schematicNetwork', title: 'The Trisolaran plan is revealed', location: 'Panama Canal / Earth ↔ Trisolaris', reference: 'Part IV · The Three-Body Problem',
        detail: 'The recovered ETO data clarifies Trisolaris’s history and intent. The interstellar line remains a communication/threat link; the fleet has not arrived in this book.', trackId: 'trisolaris-signal',
        travellers: [{ trackId: 'trisolaris-signal', routeId: 'red-coast-signal', progress: 1 }],
      },
    ],
    maps: { schematicNetwork: {
      id: 'three-body-earth-and-signal-network',
      scaleNote: 'EARTH LOCATIONS · SCHEMATIC · NOT TO SCALE; TRISOLARIS LINE IS COMMUNICATION, NOT TRAVEL',
      coordinateLabel: 'EARTH / RED COAST / TRISOLARIS SIGNAL',
      width: 1000,
      height: 560,
      nodes: [
        { placeId: 'beijing-tbp', x: 155, y: 180, category: 'region' },
        { placeId: 'red-coast', x: 390, y: 330, category: 'station' },
        { placeId: 'panama-canal-tbp', x: 675, y: 395, category: 'region' },
        { placeId: 'trisolaris', x: 855, y: 160, category: 'star' },
      ],
      routes: [
        { id: 'beijing-red-coast', trackId: 'ye-wenjie', fromPlaceId: 'beijing-tbp', toPlaceId: 'red-coast', controlPointOffsets: [[80, 65], [-70, -55]] },
        { id: 'red-coast-signal', trackId: 'trisolaris-signal', fromPlaceId: 'red-coast', toPlaceId: 'trisolaris', controlPointOffsets: [[120, -90], [-100, 70]] },
        { id: 'beijing-panama', trackId: 'wang-miao', fromPlaceId: 'beijing-tbp', toPlaceId: 'panama-canal-tbp', controlPointOffsets: [[160, 100], [-130, -70]] },
        { id: 'judgment-day-transit', trackId: 'judgment-day', fromPlaceId: 'red-coast', toPlaceId: 'panama-canal-tbp', controlPointOffsets: [[100, 60], [-95, -35]] },
      ],
    } },
  },
  mappedJourney({
    id: 'avatar-film', workId: 'avatar', title: 'Avatar', creator: 'James Cameron', genre: 'Science fiction film', format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to Pandora',
    origin: 'Earth', originNote: 'Humanity’s point of departure', destination: 'Alpha Centauri A', destinationNote: 'Pandora system anchor · fictional moon', actor: 'Jake Sully', actorRole: 'Avatar program', beatTitle: 'Arrival in the Alpha Centauri system', reference: 'Avatar · Arrival on Pandora',
    detail: 'The film follows Jake Sully from Earth to Pandora, a fictional moon in the Alpha Centauri A system.', color: '#77d8c5', coordinateLabel: 'SOL / ALPHA CENTAURI A', nodeKind: 'star',
  }),
  mappedJourney({
    id: 'alien-film', workId: 'alien', title: 'Alien', creator: 'Ridley Scott', genre: 'Science fiction film', format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Nostromo to Zeta² Reticuli',
    origin: 'Earth orbit', originNote: 'Nostromo departure context', destination: 'Zeta² Reticuli', destinationNote: 'LV-426 system · fictional survey site', actor: 'Nostromo crew', actorRole: 'Commercial towing crew', beatTitle: 'The signal from LV-426', reference: 'Alien · Derelict signal',
    detail: 'The Nostromo diverts to investigate a signal near LV-426 in the Zeta² Reticuli system.', color: '#edc767', coordinateLabel: 'SOL / ZETA² RETICULI', nodeKind: 'star',
  }),
  mappedJourney({
    id: 'dispossessed-novel', workId: 'dispossessed', title: 'The Dispossessed', creator: 'Ursula K. Le Guin', genre: 'Science fiction', format: 'novel', editionLabel: 'NOVEL EDITION', subtitle: 'Anarres to Urras',
    origin: 'Anarres', originNote: 'Anarresti homeworld', destination: 'Urras', destinationNote: 'Twin world in the Tau Ceti system', actor: 'Shevek', actorRole: 'Physicist and envoy', beatTitle: 'Shevek travels to Urras', reference: 'The Dispossessed · Journey to Urras',
    detail: 'Shevek leaves Anarres for Urras, making the journey itself a bridge between the worlds’ opposing societies.', color: '#a7a0dd', coordinateLabel: 'TAU CETI · ANARRES / URRAS', nodeKind: 'world',
  }),
  mappedJourney({
    id: 'europa-report-film', workId: 'europa-report', title: 'Europa Report', creator: 'Sebastián Cordero', genre: 'Science fiction film', format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to Europa',
    origin: 'Earth', originNote: 'Europa One mission departure', destination: 'Europa', destinationNote: 'Jupiter’s moon · real Solar System location', actor: 'Europa One crew', actorRole: 'Exploration mission', beatTitle: 'Europa One reaches Jupiter', reference: 'Europa Report · Arrival at Europa',
    detail: 'The Europa One crew travels from Earth to Europa to investigate evidence of life beneath the moon’s ice.', color: '#77d8c5', coordinateLabel: 'EARTH / JUPITER / EUROPA', nodeKind: 'world',
  }),
  mappedJourney({
    id: 'apollo-13-film', workId: 'apollo-13', title: 'Apollo 13', creator: 'Ron Howard', genre: 'Spaceflight drama film', format: 'film', editionLabel: 'FILM EDITION', subtitle: 'Earth to Fra Mauro',
    origin: 'Earth', originNote: 'Kennedy Space Center · launch', destination: 'Fra Mauro', destinationNote: 'Lunar landing region · planned destination', actor: 'Apollo 13 crew', actorRole: 'Lunar mission crew', beatTitle: 'Apollo 13 heads for the Moon', reference: 'Apollo 13 · Translunar injection',
    detail: 'Apollo 13 launches from Earth toward the Fra Mauro highlands. The oxygen tank failure turns the lunar route into a rescue trajectory.', color: '#edc767', coordinateLabel: 'EARTH / MOON · FRA MAURO', nodeKind: 'world',
  }),
]

export const theMartianFilm: StoryEdition = {
  id: 'the-martian-film',
  work: { id: 'the-martian', title: 'The Martian', creator: 'Ridley Scott', genre: 'Science fiction film' },
  format: 'film',
  editionLabel: 'FILM EDITION',
  subtitle: 'Ares III · Acidalia Planitia',
  interpretationNote: 'Film route interpretation. Mars imagery is real; Ares III and Ares IV are fictional locations with approximate coordinates.',
  tracks: [
    { id: 'watney-film', name: 'Mark Watney', role: 'Ares III astronaut', color: '#f27854', kind: 'physical' },
    { id: 'hermes-film', name: 'Hermes crew', role: 'Interplanetary flight', color: '#77d8c5', kind: 'physical' },
    { id: 'nasa-film', name: 'NASA / JPL', role: 'Earth–Mars communication', color: '#edc767', kind: 'communication' },
  ],
  places: theMartianNovel.places,
  beats: [
    {
      id: 'film-evacuation', mapView: 'solarSystem', title: 'The Ares III evacuation', location: 'Mars · Acidalia Planitia',
      reference: 'Film · Ares III storm', detail: 'The crew evacuates during the storm; Watney is struck by debris and presumed dead as Hermes leaves Mars.',
      trackId: 'hermes-film', orbitalFocusBodyId: 'mars', travellers: [{ trackId: 'hermes-film', routeId: 'hermes-outbound-film', progress: 0.94 }],
    },
    {
      id: 'film-pathfinder', mapView: 'planetarySurface', title: 'Watney finds Pathfinder', location: 'Ares III → Pathfinder site',
      reference: 'Film · Pathfinder expedition', detail: 'Watney drives across Acidalia Planitia to recover the Pathfinder probe and re-establish contact with Earth.',
      trackId: 'watney-film', orbitalFocusBodyId: 'mars', travellers: [{ trackId: 'watney-film', routeId: 'watney-pathfinder-out-film', progress: 0.82 }],
    },
    {
      id: 'film-earth-contact', mapView: 'planetarySurface', title: 'Contact with NASA', location: 'Pathfinder site ↔ NASA / JPL',
      reference: 'Film · First communication', detail: 'The recovered probe lets Watney exchange simple messages with mission control and continue the rescue planning.',
      trackId: 'nasa-film', orbitalFocusBodyId: 'earth', travellers: [{ trackId: 'watney-film', routeId: 'watney-pathfinder-return-film', progress: 0 }],
    },
    {
      id: 'film-rich-purnell', mapView: 'solarSystem', title: 'Hermes turns back', location: 'Earth trajectory → Mars',
      reference: 'Film · Rich Purnell maneuver', detail: 'NASA chooses a gravity-assist return plan that sends the Hermes crew back toward Mars.',
      trackId: 'hermes-film', orbitalFocusBodyId: 'earth', travellers: [{ trackId: 'watney-film', routeId: 'watney-pathfinder-return-film', progress: 1 }, { trackId: 'hermes-film', routeId: 'hermes-return-film', progress: 0.16 }],
    },
    {
      id: 'film-rover-crossing', mapView: 'planetarySurface', title: 'The long drive to Ares IV', location: 'Ares III → Schiaparelli crater',
      reference: 'Film · Rover crossing', detail: 'Watney modifies the rover and crosses Mars toward the Ares IV ascent vehicle.',
      trackId: 'watney-film', orbitalFocusBodyId: 'mars', travellers: [{ trackId: 'watney-film', routeId: 'watney-rover-film', progress: 0.54 }],
    },
    {
      id: 'film-launch', mapView: 'solarSystem', title: 'Watney launches from Mars', location: 'Schiaparelli crater → Mars orbit',
      reference: 'Film · Ares IV MAV launch', detail: 'Watney strips down the MAV and launches from the surface to rendezvous with Hermes.',
      trackId: 'watney-film', orbitalFocusBodyId: 'mars', travellers: [{ trackId: 'watney-film', routeId: 'watney-rover-film', progress: 1 }, { trackId: 'hermes-film', routeId: 'hermes-return-film', progress: 0.08 }],
    },
    {
      id: 'film-rendezvous', mapView: 'solarSystem', title: 'The rescue rendezvous', location: 'Mars orbit → Hermes',
      reference: 'Film · Hermes rescue', detail: 'The crew catches Watney above Mars and brings him aboard before beginning the journey home.',
      trackId: 'hermes-film', orbitalFocusBodyId: 'mars', travellers: [{ trackId: 'hermes-film', routeId: 'hermes-return-film', progress: 0.12 }],
    },
  ],
  maps: {
    solarSystem: {
      ...theMartianNovel.maps.solarSystem!,
      id: 'heliocentric-film-overview',
      communicationTrackId: 'nasa-film',
      orbitalTrackId: 'hermes-film',
      surfaceTrackId: 'watney-film',
      orbitalRoutes: [
        { ...theMartianNovel.maps.solarSystem!.orbitalRoutes[0], id: 'hermes-outbound-film', trackId: 'hermes-film' },
        { ...theMartianNovel.maps.solarSystem!.orbitalRoutes[1], id: 'hermes-return-film', trackId: 'hermes-film' },
      ],
    },
    planetarySurface: {
      ...theMartianNovel.maps.planetarySurface!,
      id: 'mars-surface-film',
      routeSegments: [
        { id: 'watney-pathfinder-out-film', trackId: 'watney-film', fromPlaceId: 'ares3', toPlaceId: 'pathfinder', revealedAtBeatId: 'film-pathfinder', completedAtBeatId: 'film-earth-contact' },
        { id: 'watney-pathfinder-return-film', trackId: 'watney-film', fromPlaceId: 'pathfinder', toPlaceId: 'ares3', revealedAtBeatId: 'film-earth-contact', completedAtBeatId: 'film-rich-purnell' },
        { id: 'watney-rover-film', trackId: 'watney-film', fromPlaceId: 'ares3', toPlaceId: 'schiaparelli', revealedAtBeatId: 'film-rover-crossing', completedAtBeatId: 'film-launch' },
      ],
      focusByBeatId: {
        'film-evacuation': { kind: 'place', placeId: 'ares3' },
        'film-pathfinder': { kind: 'place', placeId: 'pathfinder', zoom: 4 },
        'film-earth-contact': { kind: 'place', placeId: 'pathfinder', zoom: 4 },
        'film-rich-purnell': { kind: 'place', placeId: 'ares3', zoom: 3 },
        'film-rover-crossing': { kind: 'coordinate', latitude: 14, longitude: -6, accuracy: 'illustrative', zoom: 3 },
        'film-launch': { kind: 'place', placeId: 'schiaparelli', zoom: 4 },
        'film-rendezvous': { kind: 'place', placeId: 'schiaparelli', zoom: 4 },
      },
      signalTrackId: 'nasa-film',
      signalPlaceId: 'pathfinder',
      signalBeatIds: ['film-earth-contact'],
      offSurfaceBeatIds: ['film-rich-purnell', 'film-rendezvous'],
      impliedRoutePlaceId: 'schiaparelli',
      roverMarker: { beatIds: ['film-rover-crossing', 'film-launch'], latitude: -2.8, longitude: 15.8 },
    },
  },
}
