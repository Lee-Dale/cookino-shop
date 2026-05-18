<img width="547" height="321" alt="Bildschirmfoto 2026-05-06 um 10 38 07" src="https://github.com/user-attachments/assets/4cad9dcb-8fea-4d0e-b5bb-a23727bc32fd" />

# 🍪  Cookino Shop – Home of the Cookie Crew

**📝 Projektbeschreibung**  
Dieses Repository enthält das Prüfungsprojekt für den Cookino Shop.  
Unser Ziel ist es, einen modernen E-Commerce-Auftritt für exklusiven Cookino Merch zu gestalten.  
Unter dem Namen Cookie Crew verbinden wir verspieltes Pixel-Art-Design mot hochwertigen Produkten. 
Zum jetzigen zeitpunkt wird man im Shop 3 Kollektionen finden.  
Wuschel Witznase  
Cookino  
Moniki Kicherkrähe  

**🍪 Cookie Crew**  
Die Cookie-Crew sind Bendix, Chris, Lee und Ramona.  
Gefunden als Lerngruppe im Kurs Cloud-25-11.   
Die Charakter sind ab Modul 1 entstanden, wurden weiter ausgebaut und erweitert mit viel Herz ❤️  
Unsere drei Charaktere, Wuschel Witznase, Cookino und Moniki Kicherkrähe sind die Charaktere, mit denen alles begonnen hat. 


**📅 Wichtiger Termin:**  
Projektvorstellung: 22. Mai 2026 


### Dokumentation
#### *4.Mai*
* Grober Ablaufplan
* Features festlegen
* Diagramm erstellung, was ist mit was verbunden
* Besprechung wer macht was, ideen Sammlung

#### *5.Mai*
######  Bendix:
  - s3 Bucket neu verfasst.
  - erste Bilder in Website integriert
######  Chris:
  - feat: SQLite Datenbank für Cokinoshop erstellt
  - Erste Version der Shop-Datenbank mit 3 Kollektionen und je 5 fiktiven  Artikeln.

######  Lee:
  - Feat: Erste Python-Struktur erstellt: Run.py, app/__innit.py, app/model.py
  -  Fast api Verbindung gebaut

######  Ramona: 
  - Kollektionen erstellt. Wuschel, Cookino, Moniki 
  - Produkterstellung Kleidung, Accessoires, Tasse
  - Webcam Hintergrund erstellung 
  - Charakter bearbeitung
  - Dokumentation

#### *6.Mai*  
######  Bendix:  
  - 6 weitere Artikel dem frontend zugefügt.
  - Cookie-Mauszeiger integriert.
  - Flexblock-Ausrichtung und Symmetrie-Platzhalter für cleane Optik aller Artikel und Buttons hinzugefügt.
  - Funktion für fliegende Cookies im hintergrund hinzugefügt.
######  Chris:  
  - Konto_shop.py erstellt mit rollen verwaltung und warenkorb.py erstellt.
  - feat: Implementiere Nutzerkonten und Warenkorb-Logik
  - Registrierung, Login und Rollenverwaltung hinzugefügt
  - Warenkorb-Funktionen mit Prüfung des Lagerbestands aufgebaut
  - Warenkorb-Funktionen mit Prüfung des Lagerbestands aufgebaut
  - Bugfix: Fremdschlüssel-Konflikt bei der artikel_id über zwei getrennte Datenbanken hinweg behoben
######  Lee:   
  - folgende Endpunkte hinzugefügt  
      - GET/kollektionen  
      - GET/artikel/{kollektion_name}  
      - POST/order
  -  Begonnen auth.py Datei for Registration und Login authorisation
######  Ramona: 
  - README Projektbeschreibung & "Cookie Crew" hinzugefügt + Bild eingefügt
  - Charaktere erstellt
  - Charakter Legenden geschrieben
  - Dokumentation 


#### *7.Mai*   
######  Bendix:  
  - Recherche für die “Hochzeit” der Datenbanken, lee´s python codes und der index.html.  
  - Kleines Monster integriert, welches die Artikel beim kauf festhalten möchte.  
  - Impressum hinzugefügt.  
######  Chris: 
  - haupt_main erstellst verbindet alle Moodle zu einem interaktiven Shop system.  
  - Verbindet konto_shop.py, shop_main.py und warenkorb.py  
  - Menüführung fuer Gast, Kunde, Leiter und Admin  
  - Session-Verwaltung (Login/Logout)  
  - Verwaltungsbereich fuer Leiter & Admin    
  - (Bestellstatus, Lagerbestand, Artikel deaktivieren)  
  - Eingabe-Validierung gegen Abstürze  
  - Starten mit: python haupt_main.py  
  - README.md hinzugefügt  
  - Projektdokumentation mit Dateistruktur, Rollensystem, 
  - Rechtsübersicht und Datenbankstruktur für den Cookie Crew Shop.
######  Lee:  
  - Auth.py gebaut mit  
  - User registration  
  - user login   
  - habe /order geändert, so nur logged-in, was der User bestellen kann.   
######  Ramona:  
  - Charakter Legenden gekürzt   
  - Charakter bilder erstellt    
  - Dokumentation

#### *8.Mai*  
######  Bendix:  
  - Slides für die Hauptpage integriert  
  - Überschrift angepasst  
  - cookino als fliegenden hintergrund eingebaut  
  - Sprechblasen zu jedem Artikel hinzugefügt  
  - kleines “Cookie”-Fenster eingefügt zum einmaligen akzeptieren. Nur lokal.
######  Chris: 
  - debugging code- Haupt main py   
  - fest artikel shop eingefügt   
  - fehlerbehebung shop.main.py    
  - ergänzung shop.main.py ( username hinzugefügt)   
  - vorplanung woche 2 begonnen
######  Lee:  
  - Debugging code - models.py und auth.py  
  - Gemacht eine Testbestellung (und funktioniert!)  
  - vorbereitung für nächte Woche  
  - Hat ändern, löschen und logout endpoints und classes gebaut
######  Ramona:  
  - Legende Moniki Kicherkrähe   
  - Bildere Moniki Kicherkrähe
  - Dokumentation
  - Woche 2 geplant
  - Recap woche 1
  - Was muss noch gemacht werden - Dokumentation
      
#### *11.Mai* 

######  Bendix: 
  - Ich durfte heute der Bräutigam sein und hab den ganzen Tag sehnlichst auf   
     meinen Kuss gewartet. Mit Erfolg! Danke Chris <3
  - kleinere anpassungen des frontends
  - Die Domain cookino-shop.de wurde über AWS Route 53 registriert.  
  - Erstellung einer Hosted Zone zur Verwaltung der DNS-Einträge.  
  - Beantragung eines kostenlosen SSL-Zertifikats in der Region us-east-1 (Voraussetzung für CloudFront)  
  - Erfolgreiche Validierung der Inhaberschaft via DNS-Eintrag in Route 53.  
  - Erstellung einer CloudFront-Distribution zur weltweiten Auslieferung und HTTPS-Erzwingung.  
  - Einrichtung eines sicheren Zugriffs, bei dem der S3-Bucket privat bleibt und nur CloudFront darauf zugreifen darf.  
  - Konfiguration des Unterordners als Pfad und Festlegung der Neu.html als Standard-Startseite.  
  - Implementierung einer restriktiven JSON-Policy, die ausschließlich Anfragen der CloudFront-Distribution erlaubt.  
  - Deaktivierung des öffentlichen S3-Zugriffs (Security Best Practice).  
  - In Route 53 wurde ein Alias-Eintrag erstellt, der die Domain cookino-shop.de direkt mit der CloudFront-URL verknüpft.  
######  Chris: 
  Fix: Supabase Intregration vollständig repariert   
  - Korrekter API-Key  
  - Warenkorb lädt jetzt Name und Preis per Datenbankabfrage   
  - Fehler beim doppelten Hinzufügen behoben  
  - Datenbankrechte und -Sicherheitsregeln korrigiert  
  - Email-Login aktiviert  
  - Slider-Anzahl dynamisch   
  - Enter-Taste im Login, automatische Entsperrung nach Fehlversuchen   
######  Lee:  
  Die Warenkorb-Endpunkte wurden vollständig implementiert und mit JWT-Authentifizierung geschützt.
  Der SECRET_KEY wurde aus dem Code in eine .env-Datei ausgelagert, um die Sicherheit zu erhöhen.
######  Ramona:  
  - Legende Moniki, Cookinos  
  - Bild erstellung Cookinos → Legenden Titelbild   
  - Bild erstellung Moniki → Legenden Titelbild  
  - 403 Statuscode grafik erstellt  
  - 201 Statuscode grafik erstellt  
#### *12.Mai*
###### Bendix:   
  - neue “Über uns” html gebaut und die verlinkung zwischen main und side page hergestellt
##### Chris:  
  - Login-Versuchszähler in konto_shop.py hinzugefügt  
    - Max. 3 Fehlversuche dann wird das Konto gesperrt  
    - Versuche werden bei erfolgreichem Login zurückgesetzt  
    - Fehlermeldung zeigt verbleibende Versuche an
##### Lee:  
  - Admin panel routes gebaut

##### Ramona:  
  - “Über uns” texte für jedes Cookie - Crew mitglied geschrieben   
  - Dokumentation
  - Brainstorming
  - Woche 2 / 3 Planung

#### *13.Mai*  
##### Bendix:   
  - "Über uns" ausgebaut und alle Charaktere hinzugefügt
##### Ramona:
  - Charakter bilder überarbeitet / Größenanpassung "Über uns"

##### Alle:  
   - Präsentationsablauf  
   - Präsentations aufteilung
   - Präsentation Design besprechen
   - Präsentation wording grob geplant → Jeder für sich
   - Eigene Hausaufgabe besprochen 💙

#### *18.Mai*   
##### Alle:  
  - Präsentations Folien erarbeitet.
  - Folien inhalt besprochen/abgesprochen 




    


