
export const EAST_AFRICAN_COUNTRIES = [
  { name: "Tanzania", code: "TZ", phoneCode: "+255" },
  { name: "Kenya", code: "KE", phoneCode: "+254" },
  { name: "Uganda", code: "UG", phoneCode: "+256" },
  { name: "Rwanda", code: "RW", phoneCode: "+250" },
  { name: "Burundi", code: "BI", phoneCode: "+257" },
  { name: "South Sudan", code: "SS", phoneCode: "+211" },
  { name: "Ethiopia", code: "ET", phoneCode: "+251" },
  { name: "Somalia", code: "SO", phoneCode: "+252" },
  { name: "Djibouti", code: "DJ", phoneCode: "+253" },
  { name: "Eritrea", code: "ER", phoneCode: "+291" }
];

export const COUNTRY_REGIONS: Record<string, string[]> = {
  "Tanzania": [
    "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", 
    "Katavi", "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", 
    "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pemba North", 
    "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", 
    "Singida", "Songwe", "Tabora", "Tanga", "Unguja North", "Unguja South"
  ],
  "Kenya": [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale"
  ],
  "Uganda": [
    "Kampala", "Gulu", "Lira", "Mbarara", "Jinja", "Busia", "Mbale", "Kasese"
  ],
  "Rwanda": [
    "Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi", "Cyangugu", "Kibungo"
  ],
  "Burundi": [
    "Bujumbura", "Gitega", "Muyinga", "Ruyigi", "Cankuzo", "Rutana", "Makamba"
  ],
  "South Sudan": [
    "Juba", "Wau", "Malakal", "Bentiu", "Bor", "Yei", "Torit", "Aweil"
  ],
  "Ethiopia": [
    "Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Dessie", "Jimma", "Jijiga", "Shashamane"
  ],
  "Somalia": [
    "Mogadishu", "Hargeisa", "Bosaso", "Kismayo", "Merca", "Galkaio", "Beledweyne", "Baidoa"
  ],
  "Djibouti": [
    "Djibouti City", "Ali Sabieh", "Dikhil", "Tadjoura", "Obock", "Arta"
  ],
  "Eritrea": [
    "Asmara", "Assab", "Keren", "Massawa", "Mendefera", "Barentu"
  ]
};

// Test ambassador accounts
export const TEST_AMBASSADORS = [
  {
    ambassadorId: "MAP-T1001DSM",
    password: "test123",
    name: "John Mwalimu",
    region: "Dar es Salaam",
    country: "Tanzania"
  },
  {
    ambassadorId: "MAP-K1001NAI", 
    password: "test123",
    name: "Grace Wanjiku",
    region: "Nairobi",
    country: "Kenya"
  },
  {
    ambassadorId: "MAP-U1001KAM",
    password: "test123", 
    name: "David Mukasa",
    region: "Kampala",
    country: "Uganda"
  }
];
