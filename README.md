# Orbit Atlas

An interactive, plot-linked map for science-fiction books and screen adaptations.

## Current catalogue

| Title | Author / Director | Format | Mappable space location |
|---|---|---|---|
| Contact | Carl Sagan | Book | Vega system |
| Contact | Robert Zemeckis | Movie | Vega system |
| Dune | Frank Herbert | Book | Canopus system / Arrakis |
| Dune | Denis Villeneuve | Movie | Canopus system |
| The Martian | Andy Weir | Book | Mars · Acidalia Planitia |
| The Martian | Ridley Scott | Movie | Mars · Acidalia Planitia |
| 2001: A Space Odyssey | Arthur C. Clarke | Book | Saturn · Iapetus |
| 2001: A Space Odyssey | Stanley Kubrick | Movie | Jupiter |
| Ender's Game | Orson Scott Card | Book | Eros · asteroid belt |
| Ender's Game | Gavin Hood | Movie | Eros · asteroid belt |
| The Three-Body Problem | Cixin Liu | Book | Alpha Centauri system |
| Avatar | James Cameron | Movie | Alpha Centauri A system |
| Alien | Ridley Scott | Movie | Zeta² Reticuli system |
| Project Hail Mary | Andy Weir | Book | Tau Ceti system |
| The Dispossessed | Ursula K. Le Guin | Book | Tau Ceti system |
| Europa Report | Sebastián Cordero | Movie | Europa · Jupiter's moon |
| The Expanse: Leviathan Wakes | James S. A. Corey | Book | Ceres · asteroid belt |
| Apollo 13 | Ron Howard | Movie | Moon · Fra Mauro |
| The Expanse | Mark Fergus, Hawk Ostby, and team | Series · Season 1 | Ceres, Tycho, Eros, Ganymede |
| Interstellar | Christopher Nolan | Movie | Saturn / Gargantua system |
| Hyperion | Dan Simmons | Book | Hyperion system / Time Tombs |
| The Hitchhiker's Guide to the Galaxy | Douglas Adams | Book | Earth, Vogon fleet, Magrathea |
| The Hitchhiker's Guide to the Galaxy | Garth Jennings | Movie | Earth, Vogsphere, Magrathea |

## Platform structure

- `src/domain/story.ts` defines the shared work, edition, track, place, plot-beat, route-segment, and map-profile types.
- `src/data/editions/` contains one data record per adaptation or edition. A novel and its film should be separate records, even when they share a work ID.
- `src/data/catalog.ts` registers editions and validates IDs and cross-references at startup.
- `src/App.tsx` renders the selected catalog record; it no longer owns the plot timeline or track data.
- `src/MarsStoryMap.tsx` is the planetary-surface renderer. It consumes a surface-map profile instead of containing The Martian's coordinates and beat ordering.
- `src/SchematicStoryMap.tsx` renders fictional star systems, planetary regions, and galactic journeys as explicitly schematic networks.

To add another edition, create a record under `src/data/editions/`, fill in its tracks, places, beats, and required map profile, then register it in `src/data/catalog.ts`. A novel and its adaptation use separate edition IDs and route records. Keep place, track, beat, and route IDs unique within each edition and update all profile references together. The catalog validator catches unresolved references.

The catalog keeps adaptations separate: it includes *The Expanse* as the *Leviathan Wakes* novel and Season 1 series, *2001* as both novel and film, and *The Hitchhiker's Guide to the Galaxy* as both novel and film. Interstellar and fictional-world network positions are schematic and not to scale; chapter, part, and episode references are narrative anchors rather than edition-specific page numbers.

## Run locally

```sh
npm install
npm run dev
```

The development server is provided by Vite. `npm run build` creates a production build and `npm run lint` runs ESLint.

## Map views

- Each plot beat selects exactly one map context. Solar-system events use a heliocentric diagram; surface events use a planetary basemap; interstellar and fictional geography uses a schematic network. There is no separate map-view navigation, and changing chapters jumps the single map to that chapter's route.
- Only the active chapter's travel segments are drawn. Every travelling actor gets a separate progress marker; chapters with simultaneous travellers show multiple markers. A colored light trail shows distance already travelled, while moving pulses reinforce the route direction. The icon follows the actor's route progress.
- Schematic maps keep every place in the story's full scene visible as context and frame the complete active arrow between its origin and destination. They support pointer/touch pan, wheel and button zoom; during playback the camera gently follows the chapter's route while keeping the full arrow in frame.
- The solar-system diagram plots the Sun at the heliocentric origin and calculates Earth and Mars orbital paths from rounded J2000 mean orbital elements. The semimajor axes use a shared AU scale (Earth 1.000 AU, Mars 1.524 AU). Planet symbols are enlarged for legibility. This is a 2D ecliptic-plane view and omits orbital inclination. Travel arcs are story routes, not solved spacecraft trajectories or positions at the story's dates.
- Planetary surface maps use their configured real basemap and metric scale. Mars uses the NASA/JPL/USGS/Esri MDIM 2.1 mosaic, with a switch to NASA/JPL/ESA/DLR/USGS/Esri colorized elevation data derived from MOLA/HRSC.
- The solar-system diagram supports pan and zoom. Plot beats carry traveller records with a route ID and normalized progress (`0` to `1`); playback advances chapters and animates actor markers along the corresponding route.

## Sources and interpretation

The orbit parameters are rounded from NASA/JPL Solar System Dynamics' [Approximate Positions of the Planets](https://ssd.jpl.nasa.gov/planets/approx_pos.html), Table 1 (elements valid for 1800–2050). The plotted reference positions are for J2000.0.

The Mars image layer is the ArcGIS-hosted [Mars MDIM map service](https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer), described as a NASA Ames/Viking mosaic based on USGS MDIM 2.1. Its service metadata reports a native equatorial resolution of about 231 m/pixel and positional accuracy of roughly one pixel. The relief layer is the [Mars colorized DEM service](https://astro.arcgis.com/arcgis/rest/services/OnMars/MColorDEM/MapServer), derived from global MOLA/HRSC elevation data. Map attribution is also shown in the application.

The Pathfinder point uses the real landing-site coordinates (19.13° N, 33.22° W). Ares III and Ares IV are fictional locations; their plotted coordinates are approximate anchors for Acidalia Planitia and Schiaparelli crater, not canonical surveyed positions. Surface lines show an illustrative corridor between story locations, not Watney's exact rover track. The story itself does not specify all coordinates, path geometry, or travel timing.

The map currently focuses on the novel. Chapter/log references are narrative anchors and should be checked against the selected print or ebook edition before treating them as exact chapter numbers.