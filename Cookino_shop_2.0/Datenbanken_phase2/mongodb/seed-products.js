// Cookino Shop – MongoDB-Seed-Daten
// 9 Produktinhalte, 3 Kollektion-Inhalte und 10 S3-Medienverweise.

const datenbankName = process.env.MONGO_INITDB_DATABASE || "cookino_shop";
const cookinoDb = db.getSiblingDB(datenbankName);

const produktInhalte = [
  {
    produkt_id: "20000000-0000-4000-8000-000000000001",
    beschreibung: "Der Cookie Crusader ist der dunkelblaue Wuschel-Hoodie für gemütliche Abenteuer im Pixelplüsch-Wald.",
    kurzbeschreibung: "Dunkelblauer Wuschel-Hoodie",
    charakter: "Wuschel Witznase",
    tags: ["hoodie", "wuschel", "kleidung"],
    material: { baumwolle_prozent: 80, polyester_prozent: 20 },
    pflegehinweise: ["Bei 30 Grad waschen", "Nicht heiß bügeln"],
    details: { produktart: "Hoodie", passform: "Unisex" },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000002",
    beschreibung: "Die schwarze Wuschel Cap bringt ein kleines Stück Pixelplüsch-Wald in jedes Outfit.",
    kurzbeschreibung: "Schwarze Wuschel Cap",
    charakter: "Wuschel Witznase",
    tags: ["cap", "wuschel", "accessoire"],
    material: "Baumwollmischung",
    pflegehinweise: ["Nur Handwäsche"],
    details: { produktart: "Cap", passform: "Verstellbar" },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000003",
    beschreibung: "Die Wuschel Tasse ist für Kaffee, Tee und spontane Cookie-Pausen gemacht.",
    kurzbeschreibung: "Keramiktasse mit Wuschel-Motiv",
    charakter: "Wuschel Witznase",
    tags: ["tasse", "wuschel", "accessoire"],
    material: "Keramik",
    pflegehinweise: ["Spülmaschinengeeignet"],
    details: { produktart: "Tasse", volumen_ml: 330 },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000004",
    beschreibung: "Der beige Cookino Hoodie verbindet weichen Tragekomfort mit dem klassischen Cookie-Crew-Look.",
    kurzbeschreibung: "Beiger Cookino Hoodie",
    charakter: "Cookino",
    tags: ["hoodie", "cookino", "kleidung"],
    material: { baumwolle_prozent: 80, polyester_prozent: 20 },
    pflegehinweise: ["Bei 30 Grad waschen", "Nicht in den Trockner geben"],
    details: { produktart: "Hoodie", passform: "Unisex" },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000005",
    beschreibung: "Die dunkelblaue Cookino Cap ist das passende Accessoire für echte Cookie-Crew-Mitglieder.",
    kurzbeschreibung: "Dunkelblaue Cookino Cap",
    charakter: "Cookino",
    tags: ["cap", "cookino", "accessoire"],
    material: "Baumwollmischung",
    pflegehinweise: ["Nur Handwäsche"],
    details: { produktart: "Cap", passform: "Verstellbar" },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000006",
    beschreibung: "Die Cookino Tasse begleitet dich durch Unterricht, Coding-Session und Cookie-Pause.",
    kurzbeschreibung: "Keramiktasse mit Cookino-Motiv",
    charakter: "Cookino",
    tags: ["tasse", "cookino", "accessoire"],
    material: "Keramik",
    pflegehinweise: ["Spülmaschinengeeignet"],
    details: { produktart: "Tasse", volumen_ml: 330 },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000007",
    beschreibung: "Der moosgrüne Kicherkrähe Hoodie trägt Monikis frechen Charakter nach außen.",
    kurzbeschreibung: "Moosgrüner Moniki-Hoodie",
    charakter: "Moniki Kicherkrähe",
    tags: ["hoodie", "moniki", "kleidung"],
    material: { baumwolle_prozent: 80, polyester_prozent: 20 },
    pflegehinweise: ["Bei 30 Grad waschen", "Nicht heiß bügeln"],
    details: { produktart: "Hoodie", passform: "Unisex" },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000008",
    beschreibung: "Die moosgrüne Krähen Cap gehört zu Monikis frecher Merch-Kollektion.",
    kurzbeschreibung: "Moosgrüne Moniki Cap",
    charakter: "Moniki Kicherkrähe",
    tags: ["cap", "moniki", "accessoire"],
    material: "Baumwollmischung",
    pflegehinweise: ["Nur Handwäsche"],
    details: { produktart: "Cap", passform: "Verstellbar" },
  },
  {
    produkt_id: "20000000-0000-4000-8000-000000000009",
    beschreibung: "Die Krähen-Tasse bringt Moniki Kicherkrähe direkt an deinen Schreibtisch.",
    kurzbeschreibung: "Keramiktasse mit Moniki-Motiv",
    charakter: "Moniki Kicherkrähe",
    tags: ["tasse", "moniki", "accessoire"],
    material: "Keramik",
    pflegehinweise: ["Spülmaschinengeeignet"],
    details: { produktart: "Tasse", volumen_ml: 330 },
  },
];

produktInhalte.forEach((inhalt) => {
  cookinoDb.produkt_inhalte.updateOne(
    { produkt_id: inhalt.produkt_id },
    { $set: inhalt },
    { upsert: true }
  );
});

const kollektionInhalte = [
  {
    kollektion_id: "10000000-0000-4000-8000-000000000001",
    slug: "wuschel-witznase",
    beschreibung: "Flauschige Merch-Produkte rund um Wuschel Witznase.",
    geschichte: "Wuschel startet seine Abenteuer tief im Cookino-Pixelplüsch-Wald.",
    charakter: "Wuschel Witznase",
  },
  {
    kollektion_id: "10000000-0000-4000-8000-000000000002",
    slug: "cookino",
    beschreibung: "Die klassische Cookino-Kollektion der Cookie Crew.",
    geschichte: "Mit den Cookinos hat die Geschichte der Cookie Crew begonnen.",
    charakter: "Cookino",
  },
  {
    kollektion_id: "10000000-0000-4000-8000-000000000003",
    slug: "moniki-kicherkraehe",
    beschreibung: "Freche Merch-Produkte von Moniki Kicherkrähe.",
    geschichte: "Moniki bringt Humor und ein kleines bisschen Chaos in den Pixelplüsch-Wald.",
    charakter: "Moniki Kicherkrähe",
  },
];

kollektionInhalte.forEach((inhalt) => {
  cookinoDb.kollektion_inhalte.updateOne(
    { kollektion_id: inhalt.kollektion_id },
    { $set: inhalt },
    { upsert: true }
  );
});

const medien = [
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000001",
    produkt_id: "20000000-0000-4000-8000-000000000001",
    s3_key: "produkte/wuschel/cookie-crusader.webp",
    alt_text: "Dunkelblauer Cookie-Crusader-Hoodie",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000002",
    produkt_id: "20000000-0000-4000-8000-000000000002",
    s3_key: "produkte/wuschel/wuschel-cap.webp",
    alt_text: "Schwarze Wuschel Cap",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000003",
    produkt_id: "20000000-0000-4000-8000-000000000003",
    s3_key: "produkte/wuschel/wuschel-tasse.webp",
    alt_text: "Weiße Wuschel Tasse",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000004",
    produkt_id: "20000000-0000-4000-8000-000000000004",
    s3_key: "produkte/cookino/cookino-hoodie.webp",
    alt_text: "Beiger Cookino Hoodie",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000005",
    produkt_id: "20000000-0000-4000-8000-000000000005",
    s3_key: "produkte/cookino/cookino-cap.webp",
    alt_text: "Dunkelblaue Cookino Cap",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000006",
    produkt_id: "20000000-0000-4000-8000-000000000006",
    s3_key: "produkte/cookino/cookino-tasse.webp",
    alt_text: "Weiße Cookino Tasse",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000007",
    produkt_id: "20000000-0000-4000-8000-000000000007",
    s3_key: "produkte/moniki/kicherkraehe-hoodie.webp",
    alt_text: "Moosgrüner Kicherkrähe Hoodie",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000008",
    produkt_id: "20000000-0000-4000-8000-000000000008",
    s3_key: "produkte/moniki/kraehen-cap.webp",
    alt_text: "Moosgrüne Krähen Cap",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "produkt",
    owner_id: "20000000-0000-4000-8000-000000000009",
    produkt_id: "20000000-0000-4000-8000-000000000009",
    s3_key: "produkte/moniki/kraehen-tasse.webp",
    alt_text: "Weiße Krähen-Tasse",
    position: NumberInt(1),
    medien_typ: "produktbild",
  },
  {
    owner_typ: "site",
    owner_id: "startseite",
    s3_key: "website/monster-peek.webp",
    alt_text: "Kleines Cookino-Monster auf der Startseite",
    position: NumberInt(1),
    medien_typ: "sonstiges",
  },
];

medien.forEach((medium) => {
  cookinoDb.medien.updateOne(
    { s3_key: medium.s3_key },
    { $set: medium },
    { upsert: true }
  );
});

print("Cookino MongoDB-Seeds erfolgreich eingefügt.");

