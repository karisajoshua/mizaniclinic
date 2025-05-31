
export const REGION_CODES: Record<string, string> = {
  "Arusha": "ARU",
  "Dar es Salaam": "DAR", 
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

export const generateReferralId = (region: string): string => {
  const regionCode = REGION_CODES[region] || "MC";
  const randomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `MC-${regionCode}-${randomCode}`;
};
