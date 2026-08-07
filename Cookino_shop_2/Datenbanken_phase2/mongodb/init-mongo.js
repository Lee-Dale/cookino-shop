// Cookino Shop – MongoDB-Struktur
// Speichert flexible Inhalte und S3-Metadaten, niemals Bilddateien.

const datenbankName = process.env.MONGO_INITDB_DATABASE || "cookino_shop";
const cookinoDb = db.getSiblingDB(datenbankName);

function collectionSicherAnlegen(name, optionen) {
  if (!cookinoDb.getCollectionNames().includes(name)) {
    cookinoDb.createCollection(name, optionen);
  } else {
    cookinoDb.runCommand({
      collMod: name,
      validator: optionen.validator,
      validationLevel: optionen.validationLevel,
      validationAction: optionen.validationAction,
    });
  }
}

const uuidPattern = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$";

collectionSicherAnlegen("produkt_inhalte", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["produkt_id", "beschreibung", "charakter"],
      properties: {
        produkt_id: { bsonType: "string", pattern: uuidPattern },
        beschreibung: { bsonType: "string", minLength: 1 },
        kurzbeschreibung: { bsonType: "string" },
        charakter: { bsonType: "string", minLength: 1 },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        material: { bsonType: ["object", "string"] },
        pflegehinweise: {
          bsonType: "array",
          items: { bsonType: "string" },
        },
        details: { bsonType: "object" },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

collectionSicherAnlegen("kollektion_inhalte", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["kollektion_id", "slug", "beschreibung", "charakter"],
      properties: {
        kollektion_id: { bsonType: "string", pattern: uuidPattern },
        slug: { bsonType: "string", minLength: 1 },
        beschreibung: { bsonType: "string", minLength: 1 },
        geschichte: { bsonType: "string" },
        charakter: { bsonType: "string", minLength: 1 },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

collectionSicherAnlegen("medien", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["owner_typ", "owner_id", "s3_key", "alt_text", "position"],
      properties: {
        owner_typ: {
          enum: ["produkt", "kollektion", "site"],
        },
        owner_id: { bsonType: "string", minLength: 1 },
        produkt_id: { bsonType: "string", pattern: uuidPattern },
        s3_key: { bsonType: "string", minLength: 1 },
        alt_text: { bsonType: "string", minLength: 1 },
        position: { bsonType: "int", minimum: 0 },
        medien_typ: {
          enum: ["produktbild", "banner", "hintergrund", "charakter", "sonstiges"],
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// Wissen, das das allwissende Buch bei jeder Antwort als Cookino-Kontext erhält.
collectionSicherAnlegen("buch_wissen", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["slug", "titel", "kategorie", "inhalt", "schluesselwoerter", "aktiv"],
      properties: {
        slug: { bsonType: "string", minLength: 1 },
        titel: { bsonType: "string", minLength: 1 },
        kategorie: { bsonType: "string", minLength: 1 },
        inhalt: { bsonType: "string", minLength: 1 },
        schluesselwoerter: {
          bsonType: "array",
          items: { bsonType: "string" },
        },
        prioritaet: { bsonType: "int", minimum: 0 },
        aktiv: { bsonType: "bool" },
        aktualisiert_am: { bsonType: "date" },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// Optionaler, anonymer Gesprächsverlauf. Standardmäßig speichert FastAPI nichts.
collectionSicherAnlegen("buch_dialoge", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sitzungs_id", "frage", "antwort", "erstellt_am"],
      properties: {
        sitzungs_id: { bsonType: "string", minLength: 1 },
        frage: { bsonType: "string", minLength: 1 },
        antwort: { bsonType: "string", minLength: 1 },
        modell: { bsonType: "string" },
        erstellt_am: { bsonType: "date" },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

cookinoDb.produkt_inhalte.createIndex(
  { produkt_id: 1 },
  { unique: true, name: "uq_produkt_inhalte_produkt_id" }
);

cookinoDb.produkt_inhalte.createIndex(
  { tags: 1 },
  { name: "idx_produkt_inhalte_tags" }
);

cookinoDb.kollektion_inhalte.createIndex(
  { kollektion_id: 1 },
  { unique: true, name: "uq_kollektion_inhalte_id" }
);

cookinoDb.kollektion_inhalte.createIndex(
  { slug: 1 },
  { unique: true, name: "uq_kollektion_inhalte_slug" }
);

cookinoDb.medien.createIndex(
  { s3_key: 1 },
  { unique: true, name: "uq_medien_s3_key" }
);

cookinoDb.buch_wissen.createIndex(
  { slug: 1 },
  { unique: true, name: "uq_buch_wissen_slug" }
);

cookinoDb.buch_wissen.createIndex(
  { schluesselwoerter: 1, aktiv: 1 },
  { name: "idx_buch_wissen_suche" }
);

cookinoDb.buch_dialoge.createIndex(
  { erstellt_am: 1 },
  { expireAfterSeconds: 604800, name: "ttl_buch_dialoge_7_tage" }
);

cookinoDb.medien.createIndex(
  { owner_typ: 1, owner_id: 1, position: 1 },
  { name: "idx_medien_owner" }
);

print(`MongoDB '${datenbankName}' für den Cookino Shop vorbereitet.`);
