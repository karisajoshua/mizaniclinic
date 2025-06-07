export const REGION_CODES: Record<string, string> = {
  "Arusha": "ARU",
  "Dar es Salaam": "DSM", 
  "Dodoma": "DOD",
  "Geita": "GEI",
  "Iringa": "IRI",
  "Kagera": "KAG",
  "Katavi": "KAT",
  "Kigoma": "KIG",
  "Kilimanjaro": "KIL",
  "Lindi": "LIN",
  "Manyara": "MAN",
  "Mara": "MAR",
  "Mbeya": "MBE",
  "Morogoro": "MOR",
  "Mtwara": "MTW",
  "Mwanza": "MWZ",
  "Njombe": "NJO",
  "Pemba North": "PEN",
  "Pemba South": "PES",
  "Pwani": "PWA",
  "Rukwa": "RUK",
  "Ruvuma": "RUV",
  "Shinyanga": "SHI",
  "Simiyu": "SIM",
  "Singida": "SIN",
  "Songwe": "SON",
  "Tabora": "TAB",
  "Tanga": "TAN",
  "Unguja North": "UNN",
  "Unguja South": "UNS",
  // Kenya regions
  "Nairobi": "NAI",
  "Mombasa": "MOM",
  "Kisumu": "KIS",
  "Nakuru": "NAK",
  "Eldoret": "ELD",
  // Uganda regions
  "Kampala": "KAM",
  "Gulu": "GUL",
  "Jinja": "JIN",
  "Mbarara": "MBA",
  // Rwanda regions
  "Kigali": "KIG",
  "Butare": "BUT",
  "Gisenyi": "GIS",
  // Other East African cities
  "Bujumbura": "BUJ",
  "Juba": "JUB",
  "Addis Ababa": "ADD",
  "Mogadishu": "MOG",
  "Djibouti City": "DJI",
  "Asmara": "ASM"
};

export const COUNTRY_CODES: Record<string, string> = {
  "Tanzania": "T",
  "Kenya": "K",
  "Uganda": "U",
  "Rwanda": "R",
  "Burundi": "B",
  "South Sudan": "S",
  "Ethiopia": "E",
  "Somalia": "O",
  "Djibouti": "D",
  "Eritrea": "A"
};

// This function now uses the database function for proper ID generation
export const generateAmbassadorId = (region: string, country: string = "Tanzania"): string => {
  // This will be handled by the database function during registration
  // Returning a placeholder that will be replaced by the actual database-generated ID
  const countryCode = COUNTRY_CODES[country] || "T";
  const regionCode = REGION_CODES[region] || "GEN";
  return `MCA25-${countryCode}0001${regionCode}`;
};

// For backward compatibility, keep the old function name but use new format
export const generateReferralId = (region: string, country: string = "Tanzania"): string => {
  return generateAmbassadorId(region, country);
};
