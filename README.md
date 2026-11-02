# fixe-post.de

Statische Website von Fixe Post – reines HTML/CSS/JS, kein Build-Schritt nötig.
Zum Ansehen einfach `index.html` im Browser öffnen.

## Struktur

```
index.html              Startseite (Apps-Übersicht, Kontakt)
impressum.html          Impressum
datenschutz.html        Datenschutz der Website
404.html                Fehlerseite (zeigt Netlify automatisch)
assets/site.css         Design
assets/site.js          Navigation, Fußzeile, Sprachen + Produktliste (PRODUCTS)
assets/favicon.svg      Icon
yours-truly/            Ein Ordner pro Produkt
  index.html            Produktseite      → Marketing-URL
  support.html          Support           → Support-URL
  datenschutz.html      Datenschutz       → Datenschutz-URL
```

Texte stehen auf jeder Seite doppelt: `<… lang="de">` und `<… lang="en">`.

## Vor dem ersten Veröffentlichen

Gelb markierte Platzhalter in eckigen Klammern ersetzen (Suche nach `class="ph"`):
`impressum.html`, `datenschutz.html`, `yours-truly/datenschutz.html`.

## Neues Produkt hinzufügen

1. Ordner `yours-truly/` kopieren, z. B. nach `meine-app/`.
2. In den drei Seiten des neuen Ordners `data-product="yours-truly"` → `data-product="meine-app"` ändern und die Texte anpassen.
3. In `assets/site.js` unter `PRODUCTS` einen Eintrag ergänzen (`id` = Ordnername).
4. Optional: App-Icon (`icon-128.png`, `icon-180.png`) in den Produktordner legen und in `site.js` unter `icon` eintragen.
   Ohne Icon zeigt die Website eine Briefmarke mit dem `monogram`.

Navigation, Apps-Übersicht auf der Startseite und die Liste in `datenschutz.html`
aktualisieren sich automatisch. Ab 4 Produkten werden sie in der Navigation zu einem „Apps“-Menü.

Nach dem App-Store-Release `appStoreUrl` in `site.js` eintragen – dann erscheint
„Im App Store laden“ statt „Bald im App Store“.

## App Store Connect (Yours Truly)

- Marketing-URL: https://fixe-post.de/yours-truly/
- Support-URL: https://fixe-post.de/yours-truly/support.html
- Datenschutz-URL: https://fixe-post.de/yours-truly/datenschutz.html

## Veröffentlichen mit Netlify

Empfohlen: Repo auf GitHub, Netlify baut bei jedem Push automatisch neu.

1. Netlify → *Add new project* → *Import an existing project* → GitHub → Repo wählen.
2. Build command leer lassen, Publish directory: `.` (Repo-Wurzel).
3. *Domain management* → *Add a domain* → `fixe-post.de`.
   Netlify zeigt dir die DNS-Einträge, die du bei deinem Domain-Anbieter setzen musst
   (oder du stellst die Nameserver auf Netlify DNS um). HTTPS richtet Netlify automatisch ein.

Ohne GitHub: den Ordner auf https://app.netlify.com/drop ziehen.
