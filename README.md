# ContactsAPI

Eine simple WebAPI zum Verwalten von Kontakten.

## Disclaimer

Dieses Repository enthält eine Anwendung die Teil der Vorlesung Web Anwendungen 2 an der Hochschule Albstadt-Sigmaringen ist.

Daher sind einige Ecken und Kannten zum Teil ganz bewusst enthalten. :)

## Das Repository

### src/lib/

In diesem Ordner finden sich zwei Klasen: `Contanct` und `Addressbook`. Diese beiden bilden den eigentlich Inhalt der Anwendung später ab, die sog. "business logic".

Bei der `Contact` Klasse handelt es sich um eine einfache Klasse die einen Kontakt in einem Adressbuch beschreibt, also z.B. `Vornamen`, `Nachname`, `Telefonnummer`, etc.

Bei der `Addressbook` Klasse handelt es sich um eine sehr einfache Implementierung eines Adressbuches. Dieses kann mehrere `Contact`-Klassen entsprechend verwalten.

### src/api/

In diesem Ordner befindet sich eine einfache Express App die eine API zum Zugriff auf das Adressbuch via HTTP ermöglicht.

Diese API hat im wesentlichen drei Endpoitns:

* `GET /api/v1/contacts`: Listet alle aktuellen Kontakte im Adressbuch auf
* `POST /api/v1/contacts`: Erzeugt einen neuen Kontakt im Adressbuch. Der neue `Contact` muss als JSON via HTTP Post Body übertragen werden:
   ```json
   { "firstname": "John", "lastname": "Doe", "birtdate": "1990-01-01" }
   ```
* `DELETE /api/v1/contacts`: Löscht einen Kontakt aus dem Adressbuch anhan der Angabe von `firstname` und `lastname` als JSON Post Body:
   ```json
   { "firstname": "John", "lastname": "Doe" }
   ```

* `GET /version`: Liefert die aktuelle Release-Version zurück. Nur sinnvoll im Docker-Setup.

### test/

Im Ordner `test/` befinden sich alle Unit- und IntegrationTests die in diesem Projekt enthalten sind.

Die Tests sind mit dem Test-Framework [mocha](https://mochajs.org) geschrieben. Die HTTP basierten Integrationstests benutzen zusätzlich noch [chai](https://www.chaijs.com) sowie das Modul [chai-http](https://www.npmjs.com/package/chai-http).

Alle Tests können bequem mit dem Befehl `npm test` ausgeführt werden.

### .github/workflows/

In diesem Ordner sind alle Workflows definiert, mit denen bei GitHub eine sogenannte Continious Integration Pipeline definiert wird.

Die Datei `main.yml` definiert die Kommandos die ausgeführt werden, bei jedem normalen push auf den `main` branch sowie beim anlegen eines PullRequests. Dadurch wird der aktuelle Code im Repository immer automatisch überprüft.

Die Datei `docker-image.yml` enhtält die Kommandos zum erzeugen und veröffentlichen eines fertigen Docker Images das die gesamte Anwendung kapselt.

## Starten der Anwendung

### Mit Node.js

Wie bei jeder Node.js Anwendung müssen zunächst die notwendigen Module mithilfe von `npm install` installiert werden.

Danach kann die Anwendung wie gewohnt mittels `npm start` ausgeführt werden. Nach erfolgreichem Start lauscht die ContactsAPI auf `http://localhost:3000/`.

### Als Docker Image

Da die GitHub Actions auch ein Image der Anwendung veröffentlichen, kann auch dieses Image direkt lokal mit hilfe von Docker gestartet werden:

```
$ docker run -it --rm -p 3000:3000 ghandmann/contacts-api
```

Danach läuft die Anwendung als Docker Container auf Ihrem System. Auf die ContactsAPI wird dann über `http://localhost:3000` zugegriffen.

Mithilfe von `docker pull ghandmann/contacts-api` kann ein aktualisiertes Images heruntergeladen werden.
## VSCode Setup

Folgende extensions werden für die Entwicklung in VSCode empfohlen:

* Install [mocha test explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)
* Install [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Nice to know
Das Testframework `mocha` hat auch einen speziellen watch mode. Damit beobachtet das mocha Framework alle Änderungen am Repository im Hintergrund und führt bei jeder Änderung automatisch die Tests im `test/` Ordner aus.

Damit lässt sich ein schneller feedback loop zwischen Änderung und Testergebnis erreichen.

* Start mocha watch mode: `mocha -w`