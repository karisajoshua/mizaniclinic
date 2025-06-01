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
  "Unguja South": "UNS"
};

// Counter for sequential numbering (in a real app, this would be stored in database)
let ambassadorCounter = 1;

export const generateAmbassadorId = (region: string): string => {
  const regionCode = REGION_CODES[region] || "DSM";
  const memberNumber = ambassadorCounter.toString().padStart(4, '0');
  ambassadorCounter++;
  
  // MCA25 = MIZANI CLINIC AMBASSADOR 2025
  // T = TANZANIA (will change to KE for Kenya after 1000 members)
  const countryCode = ambassadorCounter <= 1000 ? "T" : "KE";
  
  return `MCA25-${countryCode}${memberNumber}${regionCode}`;
};

// For backward compatibility, keep the old function name but use new format
export const generateReferralId = (region: string): string => {
  return generateAmbassadorId(region);
};
