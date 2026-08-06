// Cookino Shop – Wissen für das allwissende Buch
// Neue Fakten werden als weitere Objekte ergänzt. Vorhandene slugs werden aktualisiert.

const datenbankName = process.env.MONGO_INITDB_DATABASE || "cookino_shop";
const cookinoDb = db.getSiblingDB(datenbankName);
const jetzt = new Date();

const wissen = [
  {
    slug: "cookino-shop",
    titel: "Der Cookino Shop und die Cookie Crew",
    kategorie: "projekt",
    inhalt: "Der Cookino Shop ist ein E-Commerce-Projekt der Cookie Crew aus Bendix, Chris, Lee und Ramona. Das Frontend nutzt React, die API FastAPI, strukturierte Shopdaten liegen in PostgreSQL, flexible Inhalte und Medienverweise in MongoDB und die Bilddateien in AWS S3. Das allwissende Buch wird über FastAPI mit Gemini verbunden; der Gemini-API-Key wird niemals in der Datenbank oder im Frontend gespeichert.",
    schluesselwoerter: ["cookino shop", "cookie crew", "team", "bendix", "chris", "lee", "ramona", "react", "fastapi", "postgresql", "mongodb", "s3", "gemini"],
    prioritaet: NumberInt(10),
    aktiv: true,
  },
  {
    slug: "chris-hueter-der-datenstroeme",
    titel: "Chris – Hüter der Datenströme",
    kategorie: "cookie-crew",
    inhalt: "Chris ist in der Cookie Crew für die Datenbanken zuständig. Als Hüter der Datenströme kümmert er sich um PostgreSQL und MongoDB, deren Zusammenspiel über gemeinsame UUIDs, persistente Docker-Volumes, Seed-Daten, Smoke-Tests und die Verweise auf die Produktbilder in S3. Auch das Cookino-Wissen für Codex Eternis wird auf seiner Datenbankseite in MongoDB bereitgestellt.",
    schluesselwoerter: ["chris", "hüter der datenströme", "datenbank", "postgresql", "mongodb", "docker", "smoketest", "s3"],
    prioritaet: NumberInt(10),
    aktiv: true,
  },
  {
    slug: "bendix-hueter-der-sichtbaren-welt",
    titel: "Bendix – Hüter der sichtbaren Welt",
    kategorie: "cookie-crew",
    inhalt: "Bendix kümmert sich in der Cookie Crew um die sichtbare Welt des Shops. Als Hüter der sichtbaren Welt arbeitet er am Frontend, an React und an den Assets, durch die der Pixel-Plüschwald, seine Figuren und der Merch für Besucher sichtbar und interaktiv werden.",
    schluesselwoerter: ["bendix", "hüter der sichtbaren welt", "frontend", "react", "assets", "design"],
    prioritaet: NumberInt(10),
    aktiv: true,
  },
  {
    slug: "lee-hueter-der-schnittstellen",
    titel: "Lee – Hüter der Schnittstellen",
    kategorie: "cookie-crew",
    inhalt: "Lee ist in der Cookie Crew für FastAPI und die Schnittstellen zuständig. Als Hüter der Schnittstellen verbindet er Frontend und Datenbanken über API-Routen und sorgt auch dafür, dass Fragen an Codex Eternis zusammen mit dem passenden Cookino-Kontext an Gemini weitergegeben werden.",
    schluesselwoerter: ["lee", "hüter der schnittstellen", "fastapi", "api", "routes", "backend", "gemini"],
    prioritaet: NumberInt(10),
    aktiv: true,
  },
  {
    slug: "ramona-hueterin-der-geschichten",
    titel: "Ramona – Hüterin der Geschichten",
    kategorie: "cookie-crew",
    inhalt: "Ramona prägt die Geschichten und Figuren der Cookino-Welt und arbeitet an Merch, Charakteren und Dokumentation. Als Hüterin der Geschichten gibt sie dem Pixel-Plüschwald seine Legenden und sorgt als Scrum Master und Product Owner mit dafür, dass die Ideen der Cookie Crew zu einem gemeinsamen Projekt werden.",
    schluesselwoerter: ["ramona", "hüterin der geschichten", "scrum master", "product owner", "geschichten", "charaktere", "merch", "dokumentation"],
    prioritaet: NumberInt(10),
    aktiv: true,
  },
  {
    slug: "cookino-welt",
    titel: "Die Cookino-Welt",
    kategorie: "geschichte",
    inhalt: "Die Cookino-Welt spielt im magischen Cookino-Pixel-Plüschwald. Die Cookinos sind ein emsiges, keksrundes Volk, das zusammenhält, Wissen teilt und niemanden mit einer schweren Aufgabe allein lässt. Zu den Bewohnern und Figuren der Welt gehören unter anderem Wuschel Witznase, Moniki Kicherkrähe, Mixelmoos der Alte, Annora Hexa Hex, Maribyte und Codex Eternis.",
    schluesselwoerter: ["cookino", "cookinos", "welt", "pixel-plüschwald", "pixelplüsch", "pixelpluesch", "wald", "geschichte"],
    prioritaet: NumberInt(9),
    aktiv: true,
  },
  {
    slug: "wuschel-witznase",
    titel: "Wuschel Witznase",
    kategorie: "charakter",
    inhalt: "Wuschel Witznase ist ein Kuschel-Krümel-Monster mit großer Keks-Liebe. Er lebt in einem magischen Fliegenpilzhaus im Pixel-Plüschwald. Obwohl er manchmal Angst hat, besonders vor der Tresenhexe Moniki, gewinnen seine Neugier, sein Mut und sein Hunger auf Abenteuer meistens.",
    schluesselwoerter: ["wuschel", "witznase", "kuschel-krümel-monster", "keks", "fliegenpilzhaus"],
    prioritaet: NumberInt(8),
    aktiv: true,
  },
  {
    slug: "moniki-kicherkraehe",
    titel: "Moniki Kicherkrähe",
    kategorie: "charakter",
    inhalt: "Moniki Kicherkrähe ist die Tresenhexe des Pixel-Plüschwalds. Am Pixelplätscher-See ist sie für Gastfreundschaft, ihr besonderes Gebräu und ihr unverwechselbares Lachen bekannt. Ihr Haus wurde durch einen gewaltigen Sturm schief, doch Moniki blieb dem Wald und seinen Bewohnern verbunden.",
    schluesselwoerter: ["moniki", "kicherkraehe", "kicherkrähe", "tresenhexe", "pixelplätscher-see", "lachen"],
    prioritaet: NumberInt(8),
    aktiv: true,
  },
  {
    slug: "mixelmoos-der-alte",
    titel: "Mixelmoos der Alte",
    kategorie: "charakter",
    inhalt: "Mixelmoos der Alte ist ein uralter Baumgeist im mystischen Pixel-Plüschwald. In seinem Inneren leuchtet das grüne Herz des Waldes und durch seine Äste fließen Datenfunken. Er gilt als geduldiger Lehrer für Wissbegierige und bewahrt das Gleichgewicht des Waldes.",
    schluesselwoerter: ["mixelmoos", "der alte", "baumgeist", "rootkeeper", "wissen", "datenfunken"],
    prioritaet: NumberInt(8),
    aktiv: true,
  },
  {
    slug: "annora-hexa-hex",
    titel: "Annora Hexa Hex",
    kategorie: "charakter",
    inhalt: "Annora Hexa Hex ist die Hüterin der Geheimnisse im magischen Wald. Ihre Brille aus gefrorenen Tautropfen lässt sie unsichtbare magische Muster erkennen. Als unermüdliche Forscherin sucht sie nach dem Warum und Wie der Welt und steht für Neugier und Erkenntnis.",
    schluesselwoerter: ["annora", "hexa hex", "hüterin", "geheimnisse", "brille", "wissen", "neugier"],
    prioritaet: NumberInt(8),
    aktiv: true,
  },
  {
    slug: "maribyte",
    titel: "Maribyte",
    kategorie: "charakter",
    inhalt: "Maribyte gehört zu den neuen Figuren des Cookino-Pixel-Plüschwalds und ist mit dem Titel The Pixel Keeper verbunden. Die Maribyte-Kollektion greift dieses Motiv mit Hoodie, Basecap und Tasse auf.",
    schluesselwoerter: ["maribyte", "pixel keeper", "the pixel keeper", "hoodie", "basecap", "tasse"],
    prioritaet: NumberInt(8),
    aktiv: true,
  },
  {
    slug: "codex-eternis",
    titel: "Codex Eternis",
    kategorie: "charakter",
    inhalt: "Codex Eternis ist das geheimnisvolle allwissende Buch des Pixel-Plüschwalds. Seine Seiten und Schriftzeichen scheinen sich neu zu ordnen, wenn jemand eine Frage stellt. Im Shop ist es die magische Tarnung für die KI-Funktion: Besucher sprechen mit dem Buch, während FastAPI im Hintergrund Cookino-Wissen und aktuelle Shopdaten an Gemini übergibt.",
    schluesselwoerter: ["codex", "eternis", "buch", "allwissendes buch", "ki", "gemini", "fragen"],
    prioritaet: NumberInt(10),
    aktiv: true,
  },
];

wissen.forEach((eintrag) => {
  cookinoDb.buch_wissen.updateOne(
    { slug: eintrag.slug },
    { $set: { ...eintrag, aktualisiert_am: jetzt } },
    { upsert: true }
  );
});

print(`${wissen.length} Wissenseinträge für das allwissende Buch gespeichert.`);
