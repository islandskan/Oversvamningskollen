
<img src="/images/banner.png" alt="FloodCast" width="100%" />

# Innehållsförteckning – Översvämningskollen

- [Lagar och regler](#lagar-och-regler)
- [Frekvensanvändning och Tillstånd](#frekvensanvändning-och-tillstånd)
- [CE-märkning och Radioutrustningsdirektivet (RED)](#ce-märkning-och-radioutrustningsdirektivet-red)
- [Integritet och Dataskydd (GDPR)](#integritet-och-dataskydd-gdpr)
- [Rekommenderade Tekniska Åtgärder](#rekommenderade-tekniska-åtgärder)
- [Ansvarsfull Användning](#ansvarsfull-användning)
- [Frontend – FloodCast](#frontend--floodcast)
- [Användarmanual – FloodCast](#användarmanual--floodcast)
- [FloodCast – Applikation (för utvecklare)](#floodcast--applikation-för-utvecklare)
- [Översvämningskollen – Backend](#översvämningskollen--backend)
- [API-dokumentation](#api-dokumentation)
- [Tolkning av sensorflaggor (bitfält)](#tolkning-av-sensorflaggor-bitfält)
- [Komponentöversikt och Koppling – FloodCast IoT-system](#komponentöversikt-och-koppling--floodcast-iot-system)

---

[Lagar och Regler för Användning av LoRa och Radioutrustning i Sverige](#lagar-och-regler-för-användning-av-lora-och-radioutrustning-i-sverige)

För att använda LoRa-teknologi på ett lagligt och korrekt sätt i Sverige finns det vissa juridiska krav och tekniska riktlinjer att följa. Denna sektion sammanfattar de viktigaste lagarna, reglerna och god praxis som gäller för projekt som FloodCast och annan IoT-utveckling.

---

## Frekvensanvändning och Tillstånd<a name="frekvensanvändning-och-tillstånd"></a>

LoRa använder olicensierade frekvensband i det så kallade ISM-bandet (Industrial, Scientific and Medical), vilket i Sverige ligger på 868 MHz. Användningen regleras av:

### Post- och Telestyrelsen (PTS)

- Du behöver inget individuellt tillstånd för att sända på 868 MHz-bandet så länge du följer reglerna för effekt och bandbredd.
- Enligt PTS får sändningseffekten ej överskrida 25 mW ERP (14 dBm) och kanalbandbredden bör hållas inom 125–250 kHz.
- Duty cycle (sändtid) får inte överskrida:
  - 1% för 868.0–868.6 MHz
  - 0.1% för 868.7–869.2 MHz

Mer info: www.pts.se

---

## CE-märkning och Radioutrustningsdirektivet (RED)<a name="ce-märkning-och-radioutrustningsdirektivet-red"></a>

All LoRa-utrustning som används i Sverige ska uppfylla:

### Radioutrustningsdirektivet (2014/53/EU)

- Produkten ska vara CE-märkt.
- Tillverkaren ska ha dokumentation som visar att utrustningen uppfyller EU-kraven.
- Detta är särskilt viktigt om du bygger egna enheter eller modifierar befintlig utrustning.

---

## Integritet och Dataskydd (GDPR)<a name="integritet-och-dataskydd-gdpr"></a>

Om LoRa-sensorer samlar in personuppgifter, exempelvis platsdata eller indirekta identifierare, gäller följande:

## Integritet och Dataskydd (GDPR)<a name="integritet-och-dataskydd-gdpr"></a>

- Informera användaren om datainsamling och syfte.
- Samla in minsta möjliga mängd data för att uppnå syftet.
- Kryptera och skydda dataöverföring och lagring.
- För loggning och lagring av platsinformation krävs rättslig grund, till exempel samtycke.

---

## Rekommenderade Tekniska Åtgärder<a name="rekommenderade-tekniska-åtgärder"></a>

- Använd kryptering (t.ex. AES128) mellan sensor och backend.
- Kontrollera att nätverksservern (TTN) är korrekt konfigurerad för regionspecifika regler.
- Undvik kontinuerlig överföring – använd triggerbaserade mätningar.
- Dokumentera all utrustning, firmware och nätverksinställningar för spårbarhet och support.

---

## Ansvarsfull Användning<a name="ansvarsfull-användning"></a>

- LoRa är en delad resurs. Undvik att överanvända bandet, särskilt i tätbebyggda områden.
- Säkerställ att din utrustning inte stör annan radiokommunikation.
- Rapportera misstänkta störningar till PTS.


## Frontend – FloodCast<a name="frontend--floodcast"></a>

## Funktioner

- **Interaktiv översvämningsriskkarta**  
  Visualiserar riskområden i realtid med färgkodning baserat på aktuell vattennivå och riskbedömning.

- **Detaljerad riskinformation**  
  Användaren kan se detaljerad information per område, inklusive aktuella mätvärden, historisk data, kontaktuppgifter till insatsansvariga samt statusmeddelanden.

- **Responsivt mörkt/ljust läge**  
  Gränssnittet anpassar sig automatiskt efter användarens systeminställningar för tema.

- **Säker autentisering**  
  JWT-baserat inloggningssystem med tokenhantering, sessionsvalidering och åtkomstkontroll.

- **Offline-stöd**  
  Applikationen återgår till mockdata vid nätverksproblem för att fortsatt ge en visuell presentation av risker även utan uppkoppling.

---

## Användarmanual – FloodCast<a name="användarmanual--floodcast"></a>

FloodCast är en mobilapplikation utvecklad för att ge medborgare, myndigheter och räddningstjänster möjlighet att i realtid övervaka översvämningsrisker. Denna manual beskriver hur appen används från installation till användning av de centrala funktionerna.

## Innehållsförteckning

1. Registrering
2. Inloggning
3. Platsåtkomst
4. Kartvy
5. Riskinformation
6. Inställningar
7. Offline-läge

---

## 1. Registrering

Vid första användningstillfället kan användaren skapa ett konto genom att ange namn, e-postadress och lösenord. Ett konto krävs för att kunna ta emot notifikationer och se platsbaserad information.

<img src="/images/register.png" alt="Registreringsskärm" width="40%" />

---

## 2. Inloggning

Användare loggar in med e-post och lösenord. JWT-baserad autentisering används för att säkerställa säker åtkomst och tokenbaserad kommunikation med backend.

<img src="/images/login.png" alt="Inloggningsskärm" width="40%" />

---

## 3. Platsåtkomst

Vid första uppstart frågar appen om tillåtelse att använda enhetens platsdata. Detta möjliggör exakt positionsbaserad översvämningsinformation.

<img src="/images/allow.png" alt="Platsåtkomst" width="40%" />

---

## 4. Kartvy

Efter inloggning visas en interaktiv karta med realtidsbaserade sensorer som övervakar vattennivåer. Färgkodade markörer visar olika risknivåer i området (exempelvis gul = låg risk).

<img src="/images/home.png" alt="Karta med riskzoner" width="40%" />

---

## 5. Riskinformation

När användaren trycker på en sensor på kartan öppnas en detaljerad vy med information om:

- Vattennivå över normalnivå
- Risknivå (låg till hög)
- Tidsram (t.ex. nästa 3–5 dagar)
- Påverkade områden
- Status och evakueringsbehov
- Akutkontakt (möjlighet att ringa 112 direkt)

<img src="/images/status.png" alt="Riskinformation" width="40%" />

---

## 6. Inställningar

I inställningsmenyn kan användaren:

- Växla mellan mörkt och ljust tema
- Slå på/av pushnotifikationer
- Aktivera/inaktivera platsåtkomst
- Se nuvarande appversion och uppdatera
- Logga ut

<img src="/images/settings.png" alt="Inställningssida" width="40%" />

---

## 7. Offline-läge

Om internetanslutning saknas visas mockdata (förprogrammerad testdata). Detta möjliggör fortsatt navigering i appen även utan nätverk, men viss funktionalitet kan vara begränsad.

---

## Kontakt

Vid frågor eller tekniska problem, vänligen kontakta projektgruppen via GitHub eller ansvarig utvecklare.

---

## FloodCast – Applikation (för utvecklare)<a name="floodcast--applikation-för-utvecklare"></a>

## - [Källkoden](https://github.com/islandskan/Oversvamningskollen)

## INLOGGNINGSUPPGIFTER FÖR TESTNING (ELLER REGISTRERA DIG GRATIS)
- E-post: `alice@example.com`
- Lösenord: `securepassword1`

## 📲 EXPO GO FÖRHANDSVISNING (KRÄVER EXPO GO-APPEN)

- [Öppna i Expo Go](https://expo.dev/preview/update?message=added%20search%20bar&updateRuntimeVersion=1.0.0&createdAt=2025-05-25T23%3A56%3A12.917Z&slug=exp&projectId=fd631fd1-eadf-4299-ae85-1d055bed0dd4&group=1f4657d8-309e-4a05-9872-8067c9d334fa)

** VIKTIGT:** Välj *Expo Go* och **inte** *development build* på förhandsvisningssidan!

## STARTA EXPO LOKALT
Kör `npm run s` eller `npx expo start` och tryck sedan **`s`** i terminalen för att starta i **Expo Go-läge** – *inte dev build*.

---

## Teknikstack

### Frontend
- **React Native** (v0.79.2) + **Expo** (v53.0.9)
- **TypeScript** (v5.3.3)
- **NativeWind** (v4.1.23) – Tailwind CSS för React Native
- **Expo Router** (v5.0.6) – Filbaserad navigering
- **React Native Maps** (v1.20.1) – För interaktiva kartor

### Testning & Utveckling
- **Jest** (v29.2.1) + **Jest Expo** – Enhetstester
- **React Testing Library** – Komponenttestning
- **EAS Build** – Molnbaserad bygg- och testmiljö  
  *(Tips: kortare köer på kvällar/helger)*

### Backend-integration
- **REST API** med JWT-autentisering
- **PostgreSQL-databas** på Vercel (optimerad för sensordata)
- **Databehandling** med fallback till mockdata

---

## Projektstruktur

```plaintext
floodcast/
├── app/                    # Huvudkod för appen (Expo Router)
│   ├── (tabs)/             # Navigeringsflikar
│   │   ├── index.tsx       # Startsida med karta
│   │   └── settings.tsx    # Inställningar
│   ├── _layout.tsx         # Rotlayout med auth-hantering
│   ├── index.tsx           # Inloggningskontroll & routing
│   ├── login.tsx           # Inloggningsskärm
│   └── signup.tsx          # Registreringsskärm
├── components/             # Återanvändbara komponenter
│   ├── flood-risk-modal/   # Modaler för riskinformation
│   └── ui/                 # Allmänna UI-komponenter
├── constants/              # Konstanter & teman
├── context/                # React Context (auth etc)
├── hooks/                  # Egna hooks
├── services/               # API-anrop
├── types/                  # TypeScript-typer
├── utils/                  # Hjälpfunktioner
└── assets/                 # Bilder, typsnitt m.m.
````

---

## Kom igång

### Förkrav

* **Node.js** (version 18 eller högre)
* **npm**
* **Expo CLI**:

  ```bash
  npm install -g @expo/cli
  ```
* **EAS CLI**:

  ```bash
  npm install -g eas-cli
  ```

#### (Valfritt men rekommenderat)

* Android Studio – för lokal Android-testning
* Xcode – för iOS-testning (kräver macOS)

---

### Installationssteg

1. **Klona projektet**

   ```bash
   git clone <repository-url>
   cd floodcast-mobile-app*
   cd floodcast
   ```

2. **Installera beroenden**

   ```bash
   npm install
   ```

3. **Skapa och konfigurera .env**

   ```bash
   cp .env.example .env
   ```

   Redigera `.env`:

   ```env
   MAPS_API_KEY=ditt_google_maps_api_key_här
   ```

4. **Starta utvecklingsservern**

   ```bash
   npm run s
   # eller
   npx expo start
   ```

5. **Om det står "using dev client" i terminalen – tryck `s` för att byta till Expo Go-läge**

---

## Översvämningskollen – Backend<a name="översvämningskollen--backend"></a>

<p>Detta är backend-delen av Översvämningskollen – ett API för att hantera användare, sensorer, nödkontakter och vattennivådata i realtid.</p>

<h2>Förutsättningar</h2>
<ul>
  <li>Node.js ≥ v14</li>
  <li>PostgreSQL ≥ v12</li>
  <li>npm</li>
</ul>

<h2>Kom igång</h2>
<ol>
  <li><strong>Klona projektet och byt branch:</strong>
    <pre><code>git clone https://github.com/islandskan/Oversvamningskollen.git
cd Oversvamningskollen
git checkout backend</code></pre>
  </li>

  <li><strong>Installera beroenden:</strong>
    <pre><code>npm install</code></pre>
  </li>

  <li><strong>Skapa och fyll i <code>.env</code>:</strong>
    <p>Kopiera nedan rad och lägg in i terminalen för att göra en kopia av .envexampel som heter .env</p>
    <pre><code>cp .envexample .env</code></pre>
    <p>Redigera sedan <code>.env</code>:</p>
    <p>Följ instruktionerna i .env för att komma åt vår databas, ta bort onödig kod</p>
    <pre><code>DB_PORT=3000
PG_URI='följ intruktionerna eller gå till nästa steg om du vill ha en egen databas'
    </code></pre>

  </li>

  <li>Starta server:</li>
  <pre><code>npm run dev</code></pre>
</ol>
  
<h3>Om du vill köra en egen server online med Neon</h3>
<ol>
  <li>
    <strong>Skapa ett konto och en databas på Neon:</strong><br>
    Gå till <a href="https://neon.tech">https://neon.tech</a> och skapa ett konto. Skapa ett nytt projekt/databas.
  </li>

  <li>
    <strong>Kopiera din anslutningssträng från Neon:</strong><br>
    I Neon, under din databas, klicka på "Connection details" och kopiera 
    <code>PostgreSQL connection string</code>. Den ser ut ungefär så här:<br>
    <code>postgres://USER:PASSWORD@HOST/neondb?sslmode=require</code>
  </li>

  <li>
    <strong>Uppdatera din <code>.env</code> med dessa detaljer:</strong><br>
    Ersätt de tidigare raderna med följande:
    <pre><code>PG_URI='postgres://USER:PASSWORD@HOST/neondb?sslmode=require'</code></pre>
    <p>Och se till att din kod eller ORM (t.ex. Sequelize eller Prisma) stödjer <code>DATABASE_URL</code>.</p>
  </li>

  <li>
    <strong>Kör databasens schema (dump.sql) mot din Neon-databas:</strong><br>
    När du har skapat din databas och uppdaterat <code>.env</code>, kör kommandot nedan för att skapa tabeller och struktur:<br>
    <pre><code>psql &lt;din_neon_url&gt; &lt; dump.sql</code></pre>
    <p>
      Efter detta är databasen redo att användas med API:t.
    </p>
  </li>
</ol>

## API-dokumentation<a name="api-dokumentation"></a>

<h3>/api/users</h3>
<ul>
  <li>GET – Hämta alla användare</li>
  <li>POST – Skapa en ny användare</li>
  <li>GET /{id} – Hämta specifik användare</li>
  <li>PATCH /{id} – Uppdatera användare</li>
  <li>DELETE /{id} – Radera användare</li>
</ul>

<h3>/api/sensors</h3>
<ul>
  <li>GET – Lista alla sensorer</li>
  <li>POST – Skapa ny sensor</li>
  <li>GET /{sensorID} – Hämta sensor + nödkontakter</li>
  <li>PATCH /{sensorID} – Uppdatera sensor</li>
  <li>DELETE /{sensorID} – Radera sensor</li>
  <li>GET /waterlevels – Senaste vattennivån</li>
  <li>GET /historicwaterlevels – Historiska nivåer</li>
</ul>

<h3>/api/emergency-contacts</h3>
<ul>
  <li>GET – Lista alla nödkontakter</li>
  <li>POST – Lägg till kontakt</li>
  <li>PATCH /{contactID} – Uppdatera kontakt</li>
  <li>DELETE /{contactID} – Ta bort kontakt</li>
</ul>

<h3>/login</h3>
<ul>
  <li>POST – Få token från JWT</li>
  <li>GET /me – Skyddad route</li>
</ul>

<h3>/register</h3>
<ul>
  <li>POST – Skapa ny user</li>
</ul>


<h3>Testa API</h3>
Swagger-spec: <a href="https://app.swaggerhub.com/apis/chasacademy-135/floodcast/1.0.0">Floodcast API</a></p>

<h2>Licens</h2>
<p>MIT-licens. Se <code>LICENSE</code>-filen i repo:t.</p>


## Tolkning av sensorflaggor (bitfält)<a name="tolkning-av-sensorflaggor-bitfält"></a>

Vårt system använder ett bitfält (heltal) för att skicka status från sensorn på ett kompakt sätt. Varje flagga representerar ett visst tillstånd i sensorn.

### Bitflag-uppsättning (TypeScript-enum)

```ts
export enum SensorFlags {
  BATTERY_FULL = 1 << 0,
  BATTERY_MEDIUM = 1 << 1,
  BATTERY_LOW = 1 << 2,
  SENSOR_FAILURE = 1 << 3,
  LOST_COMMUNICATION = 1 << 4,
  THRESHOLD_ABOVE_20 = 1 << 5,
  THRESHOLD_ABOVE_30 = 1 << 6,
  THRESHOLD_ABOVE_40 = 1 << 7,
  THRESHOLD_ABOVE_50 = 1 << 8,
  RATE_OF_CHANGE_SMALL = 1 << 9,
  RATE_OF_CHANGE_MEDIUM = 1 << 10,
  RATE_OF_CHANGE_LARGE = 1 << 11,
  INTERNAL_FLAG_01 = 1 << 12,
  INTERNAL_FLAG_02 = 1 << 13,
  INTERNAL_FLAG_03 = 1 << 14,
  INTERNAL_FLAG_04 = 1 << 15
}
```
---

## Komponentöversikt och Koppling – FloodCast IoT-system<a name="komponentöversikt-och-koppling--floodcast-iot-system"></a>

## Hårdvarukomponenter

| Komponent                                | Antal | Styckpris (kr) | 
|------------------------------------------|-------|----------------|
| LoRa32 V2.1_1.6 Paxcounter 868MH         | 2     | 178            |
| Delbar kopplingskabel hona (40 st)       | 1     | 89,90          |
| USB A till USB-micro (60 cm)             | 2     | 28             |
| Kontakthus GH 2-polig 1.25 mm            | 16    | 2,50           |
| Crimphylsa GH AWG30-26                   | 20    | 2,50           |
| Batteri LiPo 3.7V 3000mAh                | 1     | 199            |
| Grove Water Level Sensor (10 cm)         | 1     | 80,64 / 98,70  |
| LiPo laddare 2A USB-C                    | 1     | 129            |

---

## Kopplingsanvisningar

**Förbindelser mellan komponenter:**

- **LoRa32 ↔ Grove Water Level Sensor:**
  - Använd dupont-till-grove-adapter eller base shield
  - Anslut via I2C:
    - **SDA → GPIO 21**
    - **SCL → GPIO 22**
    - Kontrollera att pull-up-motstånd finns eller används i mjukvara

- **Strömförsörjning:**
  - **Batteri LiPo 3.7V → JST-ingång på LoRa32**
  - Laddas via USB-C laddare med LiPo charger-modul

- **Övriga kopplingar:**
  - Använd GH-kontakter och crimphylsor för robusta anslutningar
  - Löda fast pin headers på LoRa32 för enklare anslutning

---

## Rekommenderade program

| Program            | Användning                                                  |
|--------------------|-------------------------------------------------------------|
| **Arduino IDE**    | För att skriva och ladda upp firmware till LoRa32          |
| **PlatformIO**     | Alternativ till Arduino, med bättre struktur och bibliotek  |
| **Meshtastic Webflasher** | För att testa och återställa LoRa-enheten vid fel       |
| **Serial Monitor (Arduino IDE)** | För felsökning och sensoravläsning         |
| **The Things Network (TTN)** | För att ta emot och analysera LoRa-data i molnet |

