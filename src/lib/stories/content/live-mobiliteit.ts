/**
 * Story maps — live mobiliteit (fleetsim "Nederland in beweging").
 * Lagen: live-ov-voertuigen, live-wegverkeer.
 *
 * Deze lagen hebben geen GeoJSON-features (de voertuigen worden live in een
 * worker berekend), dus de verhalen hebben geen grafieken; de actuele
 * aantallen staan in de legenda op de kaart.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "live-ov-voertuigen",
    title: "Het openbaar vervoer van {city}, live",
    subtitle: "Elke bus, trein, tram en veerboot die nu in en rond {city} rijdt",
    intro:
      "Deze laag laat het openbaar vervoer van {city} bewegen zoals het nú rijdt. Elke stip is een rit uit de landelijke dienstregeling (OVapi GTFS), die over zijn eigen route schuift — met optrekken, afremmen en stilstaan bij haltes. Waar vervoerders live gegevens leveren, wordt de positie bijgestuurd met de actuele vertraging en de laatste GPS-positie uit OVapi GTFS-Realtime. De legenda op de kaart toont hoeveel voertuigen er per modaliteit rijden.",
    charts: [],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "- **Dienstregeling als basis**: elke rit volgt zijn geplande route en haltetijden.\n- **Live bijgestuurd**: ritten met realtime-data schuiven op met hun vertraging; is er een recente GPS-positie, dan wordt het voertuig daar naartoe getrokken.\n- **Klik op een voertuig** voor lijn, richting, vervoerder, vertraging en de volgende halte; de route van de rit licht op.\n- Zet in de legenda **Kleur → Vertraging** om in één oogopslag te zien waar het OV op tijd rijdt en waar niet, of toon **alleen ritten met realtime-data**.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid in de praktijk**: de dienstregeling op papier zegt iets anders dan de bussen die om 17:30 in de file staan.\n- **Knelpunten**: structurele vertraging op dezelfde corridors wijst op plekken waar doorstromingsmaatregelen (busbanen, VRI-prioriteit) het meeste opleveren.\n- **Samenhang**: combineer met OV-haltes, verkeersintensiteiten of bouwprojecten om te zien hoe het netwerk en de stad op elkaar inwerken.",
      },
      {
        heading: "Over de bron",
        body: "De dienstregeling en de realtime-gegevens komen van OVapi (NDOV-open data), verwerkt door **fleetsim.nl** tot binaire rit- en route-bestanden. Voor {city} wordt alleen het gebied rond de gemeente opgehaald (een bounding box met 10 km marge), zodat de laag licht blijft. Niet elke vervoerder levert voor elke rit live data; ritten zonder realtime rijden volgens de dienstregeling.",
      },
    ],
    links: [
      { label: "fleetsim.nl — Nederland in beweging", url: "https://fleetsim.nl/nederland" },
      { label: "OVapi GTFS en GTFS-Realtime", url: "https://gtfs.ovapi.nl/nl/" },
      { label: "NDOV Loket (open OV-data)", url: "https://ndovloket.nl/" },
    ],
  },
  {
    layerId: "live-wegverkeer",
    title: "Verkeersstromen op de rijkswegen rond {city}",
    subtitle: "Gemodelleerd uit tellingen van Rijkswaterstaat, vertraagd met live NDW-snelheden",
    intro:
      "Deze laag laat personenauto's, bestelwagens en vrachtwagens over de rijkswegen rond {city} rijden. Het zijn **geen gevolgde voertuigen**: het aantal per uur komt uit de INWEVA-tellingen van Rijkswaterstaat, en de snelheid uit de live metingen van de NDW-meetlussen. Staat het vast op de weg, dan rijden de voertuigen langzamer en schuiven ze dichter op elkaar — net als in een echte file.",
    charts: [],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "- **Volumes**: per wegvak en per uur het gemiddelde aantal voertuigen op een werkdag of weekenddag (INWEVA 2025), verdeeld over licht, middelzwaar en zwaar verkeer.\n- **Snelheid**: elke paar minuten bijgewerkt uit de NDW-meetlussen; waar gemeten wordt, volgt het model de actuele snelheid.\n- **Aantallen in de legenda** zijn een schatting van het werkelijke aantal voertuigen dat nu op de getoonde wegvakken rijdt.",
      },
      {
        heading: "Beperkingen",
        body: "- Alleen **rijkswegen** (A- en N-wegen in beheer bij Rijkswaterstaat) hebben tellingen; gemeentelijke en provinciale wegen ontbreken in deze laag.\n- Voertuigposities zijn berekend, niet waargenomen: gebruik de laag voor het beeld van drukte en doorstroming, niet voor individuele voertuigen.\n- Voor actuele files en incidenten op de kaart: zie de NDW-lagen *Actueel Beeld* en *Incidenten & Situaties*.",
      },
      {
        heading: "Over de bron",
        body: "INWEVA (Intensiteiten op Wegvakken) is de jaarlijkse telling van Rijkswaterstaat (CC0). De live snelheden komen uit de NDW-feed *trafficspeed*. **fleetsim.nl** koppelt beide aan wegvakken en levert voor {city} alleen de wegvakken in en rond de gemeente.",
      },
    ],
    links: [
      { label: "fleetsim.nl — Nederland in beweging", url: "https://fleetsim.nl/nederland" },
      { label: "Rijkswaterstaat INWEVA", url: "https://www.rijkswaterstaat.nl/formulieren/aanvraagformulier-data-verkeersgegevens" },
      { label: "NDW open data", url: "https://opendata.ndw.nu/" },
    ],
  },
];
