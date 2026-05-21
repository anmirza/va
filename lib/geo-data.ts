/**
 * Geographic hierarchy data derived from the VA Regional Hub Excel file.
 * Structure: Regional Hub → Region → Country/Market
 */

export const GEO_HIERARCHY: Record<string, Record<string, string[]>> = {
  Global: {
    Global: ["All Countries"],
  },
  EMEA: {
    Europe: [
      "Albania","Andorra","Armenia","Austria","Azerbaijan","Belarus","Belgium",
      "Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czechia","Denmark",
      "Estonia","Finland","France","Georgia","Germany","Greece","Hungary",
      "Iceland","Ireland","Italy","Kazakhstan","Kosovo","Latvia","Liechtenstein",
      "Lithuania","Luxembourg","Malta","Moldova","Monaco","Montenegro",
      "Netherlands","North Macedonia","Norway","Poland","Portugal","Romania",
      "Russia","San Marino","Serbia","Slovakia","Slovenia","Spain","Sweden",
      "Switzerland","Turkey","Ukraine","United Kingdom","Vatican City",
    ],
    "Middle East": [
      "Bahrain","Iran","Iraq","Israel","Jordan","Kuwait","Lebanon","Oman",
      "Palestine","Qatar","Saudi Arabia","Syria","United Arab Emirates","Yemen",
    ],
    Africa: [
      "Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cabo Verde",
      "Cameroon","Central African Republic","Chad","Comoros","Congo",
      "Cote d'Ivoire","Democratic Republic of the Congo","Djibouti","Egypt",
      "Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Gabon","Gambia",
      "Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya",
      "Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco",
      "Mozambique","Namibia","Niger","Nigeria","Rwanda","Sao Tome and Principe",
      "Senegal","Seychelles","Sierra Leone","Somalia","South Africa",
      "South Sudan","Sudan","Tanzania","Togo","Tunisia","Uganda","Zambia",
      "Zimbabwe",
    ],
  },
  Americas: {
    "North America": ["Canada","United States"],
    "Central America": [
      "Mexico","Belize","Costa Rica","El Salvador","Guatemala","Honduras",
      "Nicaragua","Panama",
    ],
    "South America": [
      "Argentina","Bolivia","Brazil","Chile","Colombia","Ecuador","Guyana",
      "Paraguay","Peru","Suriname","Uruguay","Venezuela",
    ],
    Caribbean: [
      "Antigua and Barbuda","Bahamas","Barbados","Cuba","Dominica",
      "Dominican Republic","Grenada","Haiti","Jamaica","Saint Kitts and Nevis",
      "Saint Lucia","Saint Vincent and the Grenadines","Trinidad and Tobago",
    ],
  },
  APAC: {
    "Greater China": ["China","Hong Kong","Macau","Taiwan"],
    ASEAN: [
      "Brunei","Cambodia","Indonesia","Laos","Malaysia","Myanmar","Philippines",
      "Singapore","Thailand","Timor-Leste","Vietnam",
    ],
    ANZ: ["Australia","New Zealand"],
    "Japan & Korea": ["Japan","North Korea","South Korea"],
    "South Asia": [
      "Afghanistan","Bangladesh","Bhutan","India","Maldives","Nepal","Pakistan",
      "Sri Lanka",
    ],
    "Pacific Islands": [
      "Fiji","Kiribati","Marshall Islands","Micronesia","Nauru","Palau",
      "Papua New Guinea","Samoa","Solomon Islands","Tonga","Tuvalu","Vanuatu",
    ],
    "Central Asia": ["Kyrgyzstan","Tajikistan","Turkmenistan","Uzbekistan"],
    Mongolia: ["Mongolia"],
  },
  Other: {
    "Other / Unassigned": ["Other / Specify"],
  },
};

/** Top-level regional hubs */
export const ALL_HUBS = Object.keys(GEO_HIERARCHY);

/** All sub-regions flattened */
export const ALL_REGIONS: string[] = Object.values(GEO_HIERARCHY).flatMap(
  (regions) => Object.keys(regions),
);

/** All countries flattened */
export const ALL_COUNTRIES: string[] = [
  ...new Set(
    Object.values(GEO_HIERARCHY).flatMap((regions) =>
      Object.values(regions).flat(),
    ),
  ),
].sort();

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Returns sub-regions available under a given hub. */
export function getRegionsForHub(hub: string): string[] {
  return Object.keys(GEO_HIERARCHY[hub] ?? {});
}

/** Returns countries available under a given hub + region pair. */
export function getCountriesForRegion(hub: string, region: string): string[] {
  return GEO_HIERARCHY[hub]?.[region] ?? [];
}

/** Returns ALL countries under a hub (across all its regions). */
export function getAllCountriesForHub(hub: string): string[] {
  const hubData = GEO_HIERARCHY[hub];
  if (!hubData) return [];
  return [...new Set(Object.values(hubData).flat())].sort();
}

/** Returns ALL countries for a set of regions within a hub. */
export function getCountriesForRegions(hub: string, regions: string[]): string[] {
  if (!regions.length) return getAllCountriesForHub(hub);
  const hubData = GEO_HIERARCHY[hub];
  if (!hubData) return [];
  return [...new Set(regions.flatMap((r) => hubData[r] ?? []))].sort();
}

/** Reverse-lookup: given a country name, return its sub-region. */
export function getRegionForCountry(country: string): string | null {
  for (const hubData of Object.values(GEO_HIERARCHY)) {
    for (const [region, countries] of Object.entries(hubData)) {
      if (countries.includes(country)) return region;
    }
  }
  return null;
}

/** Reverse-lookup: given a country name, return its hub. */
export function getHubForCountry(country: string): string | null {
  for (const [hub, hubData] of Object.entries(GEO_HIERARCHY)) {
    for (const countries of Object.values(hubData)) {
      if (countries.includes(country)) return hub;
    }
  }
  return null;
}

/** Returns a sorted, deduplicated list of regions present in the given company list. */
export function getAvailableRegionsFromCompanies(
  countries: (string | undefined | null)[],
): string[] {
  const regions = new Set<string>();
  for (const c of countries) {
    if (!c) continue;
    const r = getRegionForCountry(c);
    if (r) regions.add(r);
  }
  return [...regions].sort();
}
