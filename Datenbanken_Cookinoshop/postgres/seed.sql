-- =========================================================
-- Cookino Shop – Startdaten
-- =========================================================

BEGIN;


-- Rollen
INSERT INTO rollen (name, beschreibung)
VALUES
    ('admin', 'Darf Nutzer, Produkte und Bestellungen verwalten'),
    ('leiter', 'Darf Lagerbestände und Bestellstatus bearbeiten'),
    ('kunde', 'Darf Produkte kaufen und Bestellungen einsehen'),
    ('gast', 'Darf den Shop ansehen, aber nicht bestellen')
ON CONFLICT (name) DO NOTHING;


-- Größen
INSERT INTO groessen (code, anzeigename, sortierung)
VALUES
    ('XS', 'XS', 1),
    ('S', 'S', 2),
    ('M', 'M', 3),
    ('L', 'L', 4),
    ('XL', 'XL', 5),
    ('XXL', 'XXL', 6),
    ('ONE_SIZE', 'Einheitsgröße', 7)
ON CONFLICT (code) DO NOTHING;


-- Kollektionen
INSERT INTO kollektionen (id, name, slug)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        'Wuschel Witznase',
        'wuschel-witznase'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'Cookino',
        'cookino'
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'Moniki Kicherkrähe',
        'moniki-kicherkraehe'
    )
ON CONFLICT (id) DO NOTHING;


-- Produkte
INSERT INTO produkte (id, kollektion_id, name, preis)
VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'Cookie Crusader',
        49.90
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000001',
        'Wuschel Cap',
        23.90
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000001',
        'Wuschel Tasse',
        19.50
    ),
    (
        '20000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000002',
        'Cookino Hoodie',
        49.90
    ),
    (
        '20000000-0000-0000-0000-000000000005',
        '10000000-0000-0000-0000-000000000002',
        'Cookino Cap',
        23.90
    ),
    (
        '20000000-0000-0000-0000-000000000006',
        '10000000-0000-0000-0000-000000000002',
        'Cookino Tasse',
        19.50
    ),
    (
        '20000000-0000-0000-0000-000000000007',
        '10000000-0000-0000-0000-000000000003',
        'Kicherkrähe Hoodie',
        49.90
    ),
    (
        '20000000-0000-0000-0000-000000000008',
        '10000000-0000-0000-0000-000000000003',
        'Krähen Cap',
        23.90
    ),
    (
        '20000000-0000-0000-0000-000000000009',
        '10000000-0000-0000-0000-000000000003',
        'Krähen-Tasse',
        19.50
    )
ON CONFLICT (id) DO NOTHING;


-- Hoodie-Varianten in S, M, L, XL und XXL
INSERT INTO produkt_varianten (
    produkt_id,
    groesse_id,
    farbe,
    artikelnummer,
    lagerbestand
)
SELECT
    hoodie.produkt_id,
    groessen.id,
    hoodie.farbe,
    hoodie.artikel_prefix || '-' || groessen.code,
    CASE groessen.code
        WHEN 'S' THEN 8
        WHEN 'M' THEN 12
        WHEN 'L' THEN 12
        WHEN 'XL' THEN 10
        WHEN 'XXL' THEN 8
    END
FROM (
    VALUES
        (
            '20000000-0000-0000-0000-000000000001'::UUID,
            'Dunkelblau',
            'WW-HOODIE'
        ),
        (
            '20000000-0000-0000-0000-000000000004'::UUID,
            'Beige',
            'CO-HOODIE'
        ),
        (
            '20000000-0000-0000-0000-000000000007'::UUID,
            'Moosgrün',
            'MK-HOODIE'
        )
) AS hoodie (produkt_id, farbe, artikel_prefix)
JOIN groessen
    ON groessen.code IN ('S', 'M', 'L', 'XL', 'XXL')
ON CONFLICT (artikelnummer) DO NOTHING;


-- Caps und Tassen mit Einheitsgröße
INSERT INTO produkt_varianten (
    produkt_id,
    groesse_id,
    farbe,
    artikelnummer,
    lagerbestand
)
SELECT
    artikel.produkt_id,
    groessen.id,
    artikel.farbe,
    artikel.artikelnummer,
    artikel.lagerbestand
FROM (
    VALUES
        (
            '20000000-0000-0000-0000-000000000002'::UUID,
            'Schwarz',
            'WW-CAP-ONE',
            100
        ),
        (
            '20000000-0000-0000-0000-000000000003'::UUID,
            'Weiß',
            'WW-TASSE-ONE',
            60
        ),
        (
            '20000000-0000-0000-0000-000000000005'::UUID,
            'Dunkelblau',
            'CO-CAP-ONE',
            40
        ),
        (
            '20000000-0000-0000-0000-000000000006'::UUID,
            'Weiß',
            'CO-TASSE-ONE',
            55
        ),
        (
            '20000000-0000-0000-0000-000000000008'::UUID,
            'Moosgrün',
            'MK-CAP-ONE',
            90
        ),
        (
            '20000000-0000-0000-0000-000000000009'::UUID,
            'Weiß',
            'MK-TASSE-ONE',
            50
        )
) AS artikel (
    produkt_id,
    farbe,
    artikelnummer,
    lagerbestand
)
JOIN groessen
    ON groessen.code = 'ONE_SIZE'
ON CONFLICT (artikelnummer) DO NOTHING;


COMMIT;