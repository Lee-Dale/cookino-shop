import sqlite3

try:
    conn = sqlite3.connect("cookinoshop.db")
    conn.row_factory = sqlite3.Row
    users = conn.execute("SELECT * FROM user").fetchall()
    
    print("\n--- INHALT DER SHOP DATENBANK ---")
    if not users:
        print("Die Tabelle ist leer.")
    else:
        for u in users:
            print(dict(u))
            
except Exception as e:
    print("Fehler beim Lesen:", e)