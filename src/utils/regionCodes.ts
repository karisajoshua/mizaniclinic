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

// This function is kept for backward compatibility but now uses the database function
export const generateAmbassadorId = (region: string): string => {
  // This will be handled by the database function during registration
  // Returning a placeholder that will be replaced by the actual database-generated ID
  return "MCA25-000000";
};

// For backward compatibility, keep the old function name but use new format
export const generateReferralId = (region: string): string => {
  return generateAmbassadorId(region);
};
