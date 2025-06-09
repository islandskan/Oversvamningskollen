
<img src="/images/banner.png" alt="FloodCast" width="100%" />

# Innehållsförteckning – Översvämningskollen

## Översikt
1. [Projektbeskrivning](#projektbeskrivning)
2. [Syfte och mål](#syfte-och-mål)
3. [Målgrupper](#målgrupper)
4. [Systemarkitektur](#systemarkitektur)
5. [Val av tekniker](#val-av-tekniker)
6. [Roller och teamstruktur](#roller-och-teamstruktur)

---

## Frontend
7. [Användargränssnitt och designprinciper](#användargränssnitt-och-designprinciper)
8. [Tillgänglighet (Accessibility)](#tillgänglighet-accessibility)
9. [Kartfunktioner och visualisering](#kartfunktioner-och-visualisering)
10. [Notifikationer och rapportering](#notifikationer-och-rapportering)
11. [Användarmanual för mobilappen](#användarmanual-för-mobilappen)
12. [Projektstruktur (frontend)](#projektstruktur-frontend)

---

## Backend
13. [API-dokumentation](#api-dokumentation)
14. [Databasschema och datalagring](#databasschema-och-datalagring)
15. [Autentisering och säkerhet](#autentisering-och-säkerhet)
16. [Databehandling och pushnotiser](#databehandling-och-pushnotiser)
17. [Loggning och felsökning](#loggning-och-felsökning)

---

## Hårdvara / IoT
18. [Använda sensorer och komponenter](#använda-sensorer-och-komponenter)
19. [Kopplingsanvisningar och schema](#kopplingsanvisningar-och-schema)
20. [Firmware och programmering](#firmware-och-programmering)
21. [LoRaWAN och TTN-integration](#lorawan-och-ttn-integration)
22. [Felsökning av hårdvara](#felsökning-av-hårdvara)
23. [Strömoptimering och prototyp](#strömoptimering-och-prototyp)

---

## Sensorlogik och flaggdata
24. [Tolkning av sensorflaggor](#tolkning-av-sensorflaggor)
25. [Bitfält och statuskoder](#bitfält-och-statuskoder)

---

## Juridik och regelefterlevnad
26. [Frekvensanvändning och PTS-regler](#frekvensanvändning-och-pts-regler)
27. [Radioutrustningsdirektivet och CE-märkning](#radioutrustningsdirektivet-och-ce-märkning)
28. [Dataskydd och GDPR vid sensoranvändning](#dataskydd-och-gdpr-vid-sensoranvändning)
29. [Rekommenderad radiokommunikation och ansvar](#rekommenderad-radiokommunikation-och-ansvar)

---

## Projektledning & Testning
30. [Sprintplanering och milstolpar](#sprintplanering-och-milstolpar)
31. [Retrospektiv och förbättringar](#retrospektiv-och-förbättringar)
32. [Changelog och versionshantering](#changelog-och-versionshantering)
33. [Teststrategi och testresultat](#teststrategi-och-testresultat)

---

## Bilagor
34. [Systemdiagram](#systemdiagram)
35. [Riskanalys](#riskanalys)
36. [Licensinformation](#licensinformation)
37. [Länkar och referenser](#länkar-och-referenser)

# Lagar och Regler för Användning av LoRa och Radioutrustning i Sverige

För att använda LoRa-teknologi på ett lagligt och korrekt sätt i Sverige finns det vissa juridiska krav och tekniska riktlinjer att följa. Denna sektion sammanfattar de viktigaste lagarna, reglerna och god praxis som gäller för projekt som FloodCast och annan IoT-utveckling.

---

## Frekvensanvändning och Tillstånd

LoRa använder olicensierade frekvensband i det så kallade ISM-bandet (Industrial, Scientific and Medical), vilket i Sverige ligger på 868 MHz. Användningen regleras av:

### Post- och Telestyrelsen (PTS)

- Du behöver inget individuellt tillstånd för att sända på 868 MHz-bandet så länge du följer reglerna för effekt och bandbredd.
- Enligt PTS får sändningseffekten ej överskrida 25 mW ERP (14 dBm) och kanalbandbredden bör hållas inom 125–250 kHz.
- Duty cycle (sändtid) får inte överskrida:
  - 1% för 868.0–868.6 MHz
  - 0.1% för 868.7–869.2 MHz

Mer info: www.pts.se

---

## CE-märkning och Radioutrustningsdirektivet (RED)

All LoRa-utrustning som används i Sverige ska uppfylla:

### Radioutrustningsdirektivet (2014/53/EU)

- Produkten ska vara CE-märkt.
- Tillverkaren ska ha dokumentation som visar att utrustningen uppfyller EU-kraven.
- Detta är särskilt viktigt om du bygger egna enheter eller modifierar befintlig utrustning.

---

## Integritet och Dataskydd (GDPR)

Om LoRa-sensorer samlar in personuppgifter, exempelvis platsdata eller indirekta identifierare, gäller följande:

### GDPR (Dataskyddsförordningen)

- Informera användaren om datainsamling och syfte.
- Samla in minsta möjliga mängd data för att uppnå syftet.
- Kryptera och skydda dataöverföring och lagring.
- För loggning och lagring av platsinformation krävs rättslig grund, till exempel samtycke.

---

## Rekommenderade Tekniska Åtgärder

- Använd kryptering (t.ex. AES128) mellan sensor och backend.
- Kontrollera att nätverksservern (TTN) är korrekt konfigurerad för regionspecifika regler.
- Undvik kontinuerlig överföring – använd triggerbaserade mätningar.
- Dokumentera all utrustning, firmware och nätverksinställningar för spårbarhet och support.

---

## Ansvarsfull Användning

- LoRa är en delad resurs. Undvik att överanvända bandet, särskilt i tätbebyggda områden.
- Säkerställ att din utrustning inte stör annan radiokommunikation.
- Rapportera misstänkta störningar till PTS.


# Frontend – Floodcast (Översvämningskollen)

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

# Användarmanual – FloodCast

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

# FloodCast – Applikation (för utvecklare)

## - [Källkoden](https://github.com/islandskan/Oversvamningskollen/tree/main/floodcast-mobile-app/floodcast)

## 🔐 INLOGGNINGSUPPGIFTER FÖR TESTNING (ELLER REGISTRERA DIG GRATIS)
- E-post: `alice@example.com`
- Lösenord: `securepassword1`

## 📲 EXPO GO FÖRHANDSVISNING (KRÄVER EXPO GO-APPEN)

- [Öppna i Expo Go](https://expo.dev/preview/update?message=added%20search%20bar&updateRuntimeVersion=1.0.0&createdAt=2025-05-25T23%3A56%3A12.917Z&slug=exp&projectId=fd631fd1-eadf-4299-ae85-1d055bed0dd4&group=1f4657d8-309e-4a05-9872-8067c9d334fa)

**‼️VIKTIGT:** Välj *Expo Go* och **inte** *development build* på förhandsvisningssidan!

## ⚙️ STARTA EXPO LOKALT
Kör `npm run s` eller `npx expo start` och tryck sedan **`s`** i terminalen för att starta i **Expo Go-läge** – *inte dev build*.

---

## 🛠️ Teknikstack

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

## 📁 Projektstruktur

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

## 🚀 Kom igång

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

## Tolkning av sensorflaggor (bitfält)

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

# Komponentöversikt och Koppling – FloodCast IoT-system

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

