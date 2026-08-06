-- =========================================================
-- Cookino Shop – PostgreSQL-Schema
-- Führende Datenbank für Nutzer, Preise, Varianten, Lager,
-- Warenkörbe und Bestellungen.
-- =========================================================


-- Rollen ---------------------------------------------------

CREATE TABLE IF NOT EXISTS rollen (
    id            SMALLSERIAL PRIMARY KEY,
    name          VARCHAR(50) NOT NULL UNIQUE,
    beschreibung  TEXT
);


-- Nutzer ---------------------------------------------------

CREATE TABLE IF NOT EXISTS nutzer (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rollen_id      SMALLINT NOT NULL REFERENCES rollen(id) ON DELETE RESTRICT,
    vorname        VARCHAR(100) NOT NULL,
    nachname       VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    passwort_hash  TEXT NOT NULL,
    aktiv          BOOLEAN NOT NULL DEFAULT TRUE,
    erstellt_am    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_nutzer_email_lower
    ON nutzer (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_nutzer_rolle
    ON nutzer (rollen_id);


-- Kollektionen --------------------------------------------

CREATE TABLE IF NOT EXISTS kollektionen (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(150) NOT NULL UNIQUE,
    slug          VARCHAR(150) NOT NULL UNIQUE,
    aktiv         BOOLEAN NOT NULL DEFAULT TRUE,
    erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Produkte -------------------------------------------------

CREATE TABLE IF NOT EXISTS produkte (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kollektion_id   UUID NOT NULL
                      REFERENCES kollektionen(id) ON DELETE RESTRICT,
    name            VARCHAR(200) NOT NULL,
    preis           NUMERIC(10, 2) NOT NULL CHECK (preis >= 0),
    aktiv           BOOLEAN NOT NULL DEFAULT TRUE,
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (kollektion_id, name)
);

CREATE INDEX IF NOT EXISTS idx_produkte_kollektion
    ON produkte (kollektion_id);

CREATE INDEX IF NOT EXISTS idx_produkte_aktiv
    ON produkte (aktiv);


-- Größen ---------------------------------------------------

CREATE TABLE IF NOT EXISTS groessen (
    id            SMALLSERIAL PRIMARY KEY,
    code          VARCHAR(20) NOT NULL UNIQUE,
    anzeigename   VARCHAR(50) NOT NULL,
    sortierung    SMALLINT NOT NULL UNIQUE CHECK (sortierung > 0)
);


-- Produktvarianten ----------------------------------------

CREATE TABLE IF NOT EXISTS produkt_varianten (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produkt_id      UUID NOT NULL
                       REFERENCES produkte(id) ON DELETE RESTRICT,
    groesse_id      SMALLINT NOT NULL
                       REFERENCES groessen(id) ON DELETE RESTRICT,
    farbe           VARCHAR(80) NOT NULL,
    artikelnummer   VARCHAR(80) NOT NULL UNIQUE,
    lagerbestand    INTEGER NOT NULL DEFAULT 0 CHECK (lagerbestand >= 0),
    aktiv           BOOLEAN NOT NULL DEFAULT TRUE,
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (produkt_id, groesse_id, farbe)
);

CREATE INDEX IF NOT EXISTS idx_varianten_produkt
    ON produkt_varianten (produkt_id);

CREATE INDEX IF NOT EXISTS idx_varianten_lager
    ON produkt_varianten (lagerbestand)
    WHERE aktiv = TRUE;


-- Warenkörbe ----------------------------------------------

CREATE TABLE IF NOT EXISTS warenkoerbe (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nutzer_id     UUID NOT NULL REFERENCES nutzer(id) ON DELETE CASCADE,
    status        VARCHAR(20) NOT NULL DEFAULT 'aktiv'
                    CHECK (status IN ('aktiv', 'bestellt', 'abgebrochen')),
    erstellt_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_aktiver_warenkorb_pro_nutzer
    ON warenkoerbe (nutzer_id)
    WHERE status = 'aktiv';

CREATE INDEX IF NOT EXISTS idx_warenkoerbe_nutzer
    ON warenkoerbe (nutzer_id);


-- Warenkorbpositionen -------------------------------------

CREATE TABLE IF NOT EXISTS warenkorb_artikel (
    warenkorb_id          UUID NOT NULL
                            REFERENCES warenkoerbe(id) ON DELETE CASCADE,
    produkt_variante_id   UUID NOT NULL
                            REFERENCES produkt_varianten(id) ON DELETE RESTRICT,
    menge                  INTEGER NOT NULL CHECK (menge > 0),
    hinzugefuegt_am        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (warenkorb_id, produkt_variante_id)
);

CREATE INDEX IF NOT EXISTS idx_warenkorb_artikel_variante
    ON warenkorb_artikel (produkt_variante_id);


-- Bestellungen --------------------------------------------

CREATE TABLE IF NOT EXISTS bestellungen (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nutzer_id     UUID NOT NULL REFERENCES nutzer(id) ON DELETE RESTRICT,
    status        VARCHAR(30) NOT NULL DEFAULT 'offen'
                    CHECK (
                        status IN (
                            'offen',
                            'bezahlt',
                            'in_bearbeitung',
                            'versendet',
                            'abgeschlossen',
                            'storniert'
                        )
                    ),
    gesamtpreis   NUMERIC(10, 2) NOT NULL CHECK (gesamtpreis >= 0),
    bestellt_am   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geaendert_am  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bestellungen_nutzer
    ON bestellungen (nutzer_id);

CREATE INDEX IF NOT EXISTS idx_bestellungen_status
    ON bestellungen (status);


-- Bestellpositionen ---------------------------------------
-- Produktinformationen werden als Momentaufnahme gespeichert.

CREATE TABLE IF NOT EXISTS bestellung_artikel (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bestellung_id          UUID NOT NULL
                              REFERENCES bestellungen(id) ON DELETE CASCADE,
    produkt_variante_id    UUID
                              REFERENCES produkt_varianten(id) ON DELETE SET NULL,
    produktname            VARCHAR(200) NOT NULL,
    artikelnummer          VARCHAR(80) NOT NULL,
    groesse                VARCHAR(50) NOT NULL,
    farbe                  VARCHAR(80) NOT NULL,
    menge                  INTEGER NOT NULL CHECK (menge > 0),
    einzelpreis            NUMERIC(10, 2) NOT NULL CHECK (einzelpreis >= 0)
);

CREATE INDEX IF NOT EXISTS idx_bestellung_artikel_bestellung
    ON bestellung_artikel (bestellung_id);

CREATE INDEX IF NOT EXISTS idx_bestellung_artikel_variante
    ON bestellung_artikel (produkt_variante_id);


-- Automatische Aktualisierung von geaendert_am ------------

CREATE OR REPLACE FUNCTION setze_geaendert_am()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geaendert_am = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_nutzer_geaendert_am ON nutzer;
CREATE TRIGGER trg_nutzer_geaendert_am
BEFORE UPDATE ON nutzer
FOR EACH ROW EXECUTE FUNCTION setze_geaendert_am();

DROP TRIGGER IF EXISTS trg_kollektionen_geaendert_am ON kollektionen;
CREATE TRIGGER trg_kollektionen_geaendert_am
BEFORE UPDATE ON kollektionen
FOR EACH ROW EXECUTE FUNCTION setze_geaendert_am();

DROP TRIGGER IF EXISTS trg_produkte_geaendert_am ON produkte;
CREATE TRIGGER trg_produkte_geaendert_am
BEFORE UPDATE ON produkte
FOR EACH ROW EXECUTE FUNCTION setze_geaendert_am();

DROP TRIGGER IF EXISTS trg_varianten_geaendert_am ON produkt_varianten;
CREATE TRIGGER trg_varianten_geaendert_am
BEFORE UPDATE ON produkt_varianten
FOR EACH ROW EXECUTE FUNCTION setze_geaendert_am();

DROP TRIGGER IF EXISTS trg_warenkoerbe_geaendert_am ON warenkoerbe;
CREATE TRIGGER trg_warenkoerbe_geaendert_am
BEFORE UPDATE ON warenkoerbe
FOR EACH ROW EXECUTE FUNCTION setze_geaendert_am();

DROP TRIGGER IF EXISTS trg_bestellungen_geaendert_am ON bestellungen;
CREATE TRIGGER trg_bestellungen_geaendert_am
BEFORE UPDATE ON bestellungen
FOR EACH ROW EXECUTE FUNCTION setze_geaendert_am();

