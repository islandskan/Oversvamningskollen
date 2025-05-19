<section align="center">
<h1>PROJEKT PLAN</h1>
</section>

<!-- TABLE OF CONTENTS? -->
## Sammanfattning

Projektet syftar till att utveckla ett system för att övervaka och hantera översvämningsrisker i en kommun genom användning av IoT-sensorer och en digital plattform. Systemet ska ge realtidsinformation om vattennivåer, optimera resursallokering och möjliggöra snabb respons från kommunens insatspersonal och frivilliga.


## Bakgrund

Förändrade klimatförhållanden och ökad urbanisering leder till fler och allvarligare översvämningar i städer och kommuner. Dagens system för att hantera och förutspå dessa händelser saknar ofta realtidsdata, vilket resulterar i försenade åtgärder och ineffektiv resursallokering. Genom att implementera IoT-sensorer och en digital plattform kan kommunen få snabbare och mer tillförlitlig information om vattennivåer och riskbedömning.


### Problem som projektet ska lösa

-   **Brister i realtidsinformation:** Kommuner saknar ofta uppdaterad data om vattenflöden, vilket leder till sena åtgärder.
-   **Ineffektiv resursallokering:** Svårt att samordna insatser för att minimera skador.
-   **Bristande medborgarinvolvering:** Ingen direktkanal för att rapportera observationer eller få aktuella varningar.
-   **Svårigheter att analysera historiska data:** Saknas strukturerade insikter för att förutse framtida risker och förbättra beredskapen.


### Målgrupp

-   Kommuner och lokala räddningstjänster
-   Lokala frivilligorganisationer
-   SMHI och myndogheter som hanterar väder- och vattenflöden
-   Infrastrukturförvaltare, så som trafikverket och lokala VA-bolag
-   IoT-utvecklare och tekniska leverantörer


## Mål och genomförande

Projektet syftar till att utveckla ett system för att övervaka och hantera översvämningsrisker i
en kommun genom användning av IoT-sensorer och en digital plattform. Systemet ska ge
realtidsinformation om vattennivåer, optimera resursallokering och möjliggöra snabb respons
från kommunens insatspersonal och frivilliga.

**Identifierade behov som utgör en grund för projektets MVP**
- Ha realtidsdata på vattennivå
- Historisk data på vattennivå för att förbereda sig för framtida översvämningar
- Exakta koordinater på komponenten för att kunna hitta den
- Kunna få notifikationer och varningar
- Statusuppdateringar på hantering av översvämning och trafik


## Val av teknologi och arkitektur


| Backend | Frontend | IoT | Database |
| --------- | ------ | --- | -------- |
| Node.js | React Native | LoRaWAN | PostGreSQL |
| Express.js |  | ZigBee |  |
| SQL |  | WiFi |  |

### Översikt över systemarkitekturen

- Sensorer samlar in vattennivådata och skickar det till backend.
- Backendhanterar dataflödet, lagrar och analyserar information.
- En dashboard och mobilapplikation ger användare insikter och varningar.

### Hårdvara

En grundläggande analys av målgruppens behov resulterade i en preliminär indelning av hårdvara i __Need to have__ och __Nice to have__.

__Need to have__

- Sensor för mätning av vattennivå
- Effektiv strömförsörjning

__Nice to have__

- Högtalare(vattentät)
- Lampa (vattentät)
- GPS (om komponenten i sig behöver lokaliserar, annars sparas det ned vid installationstillfället)


## Teamstruktur och ansvarsområden

### Projektledare

**Ansvar:**

- Övergripande ansvar för projektets framsteg.
- Hålla regelbundna möten med teamleaders.
- Sköta kommunikation med utbildare och eventuella externa aktörer.
- Riskhantering och eskalationsplanering.
- Sammanställa retrospektiv och kalla till extramöten vid behov.


### Produktägare

**Ansvar:**

- Säkerställa att projektet följer MVP och håller sig användarcentrerat.
- Följa produktens utveckling och se till att teamet arbetar mot slutmålen.
- Extern kommunikation med intressenter och utbildare.


### Teamleader
Teamleader bestämt på teamnivå.

**Ansvar:**

- Organisera och leda standups inom sitt team.
- Sammanställa och rapportera status från sitt team till teamleader-möten.
- Ha regelbundna check-ins med andra teamleaders och projektledaren.


### Scrum Master

**Ansvar:**

- Rollen hanteras inom respektive team, ofta av teamleader.


### Frontendutvecklare

**Medlemmar:** Alessandro, Shabbir

**Ansvar:**

- Utveckla och optimera UI.
- Implementera kartfunktioner och rapporteringsflöden.
- Skapa en mobilapplikation för medborgare och volontärer.


### Fullstackutvecklare

**Medlemmar:** Gustav, Benjamin, Rebecca, Thomas

**Ansvar:**

- Bygga och hantera API:er för sensordata och incidenter.
- Designa och implementera databasstruktur.
- Utveckla funktionalitet för pushnotifikationer och larm.


### Fullstackutvecklare

**Medlemmar:** Sigridur, Linus, Ayah, Mahmoud

**Ansvar:**

- Programmera och konfigurera IoT-sensorer.
- Säkerställa trådlös dataöverföring.
- Utveckla algoritmer för riskbedömning.


## Samarbete och kunskapsöverföring

### Kunskapsdelning genom genomgångar
- **Alternativ 1:** Kortare genomgångar i samband med standups.
- **Alternativ 2:** Förlängda standups med en förutbestämd agenda och frivillig medverkan.
- **Alternativ 3:** Separata workshops eller möten vid behov.
- Fokus på problemlösningar, tekniska utmaningar och lärdomar.
### Samarbete mellan team
- **Parprogrammering över discipliner:** Exempelvis en fullstackutvecklare och en systemutvecklare testar dataöverföring från en sensor.
- **Workshops för problemlösning:** Om ett team fastnar på ett problem kan andra grupper ge nya perspektiv.
- **Förklaring av problem för att främja nytänk:** Att förklara ett problem för någon utanför sitt område kan ge nya idéer och insikter.


## Arbetsplan och verktyg


### Sprintplanering

- Varje sprint inleds med att definiera mål och aktiviteter.
- Uppdatering av Gantt-schema.
- User stories och backlogg uppdateras och prioriteras.
- Arbetsuppgifter fördelas på teamnivå och läggs upp i Kanban-tavlan.


### Standups

- Veckovisa standups (tisdag morgon) med teamleaders.
- Teamleaders samlar in status från sina grupper:
  - Vad har gjorts?
  - Vilka hinder finns?
  - Vad är nästa steg?
- Standups hålls korta (max 15 minuter).


### Retrospektiv och reviews

- Genomförs i slutet av varje sprint.
- **Review:** Presentation av uppnått arbete, identifiering av klara/ej klara uppgifter.
- **Retrospektiv:** Analys av vad som fungerat bra och vad som behöver förbättras.
- Feedback implementeras i backlogg och arbetsmetoder.


### Code reviews och pull requests

- Varje utvecklare ansvarar för att hålla sin branch uppdaterad gentemot main.
- Pull requests granskas av minst en annan utvecklare innan sammanslagning.


### Testplan

- **Sprint 2-3:** Löpande tester inom teamen.
  - Enhetstester för isolerade funktioner.
  - Features markeras med “Ready for testing” innan godkännande.
- **Sprint 4:** Integrationstestning av hela systemet.
  - Testning av enheter och sammansatta system.
  - Optimering av kod och prestanda.


## Tidsplan och milstolpar

- **Sprint 1:** Planering och arkitektur.
- **Sprint 2:** Grundläggande utveckling av IoT och backend.
- **Sprint 3:** Utveckling av frontend och systemintegration.
- **Sprint 4:** Slutgiltig testning och optimering.


## Arbetspaket

Preliminärt, varje team ansvarar för att formulera tydligare aktiviteter för sitt arbete. Dvs vad som behöver göras för planerade leveranser.


### AP1 Projektledning

**Ansvarig:** Alla

**Beskrivning:** Övergripande ansvar för att säkerställa projektets framdrift och hantera risker.

**Aktiviteter:**
- 1.1 Regelbundna möten med teamleaders.
- 1.2 Uppföljning av sprintmål och leveranser.
- 1.3 Kommunikation med utbildare och eventuella intressenter.
- 1.4 Riskhantering och eskalationshantering vid problem.
- 1.5 Sammanställning av retrospektiv och statusrapporter.


### AP2 UX

**Ansvarig:** Alla

**Beskrivning:** Definiera och utveckla användarupplevelse och interaktionsflöden.

**Aktiviteter:**
- 2.1 Skapa user stories och definiera kravspecifikationer.
- 2.2 Utveckla wireframes och prototyper.
- 2.3 Genomföra användartester och iterera designen.
- 2.4 Dokumentera designbeslut och användarflöden.


### AP3 Gränssnitt och Mobilapplikation 

**Ansvarig:** Frontend-teamet

**Beskrivning:** Utveckla användargränssnitt och mobilapplikation.

**Aktiviteter:**
- 3.1 Design och implementation av UI/UX-komponenter.
- 3.2 Implementera kartfunktioner och interaktiva visualiseringar.
- 3.3 Utveckla notifikations- och rapporteringsflöden.
- 3.4 Integrera frontend med backend via API.
- 3.5 Optimera prestanda och säkerställa tillgänglighet.


### AP4 Backend 

**Ansvarig:** Fullstack-teamet

**Beskrivning:** Utveckling av API, databashantering och autentisering

**Aktiviteter**
- 4.1 Design och utveckling av API-endpoints.
- 4.2 Implementera och optimera databasstruktur.
- 4.3 Säkerställa datahantering och autentisering.
- 4.4 Dokumentera API och skapa testmiljöer.
- 4.5 Utveckla och implementera pushnotifikationer.


### AP5 Integration med hårdvara (systemutveckling)

**Ansvarig:** Systemutvecklingsteamet

**Beskrivning:** Integration och programmering av IoT-sensorer och hårdvara.

**Aktiviteter**
- 5.1 Utveckla, programmera och kalibrera IoT-sensorer.
- 5.2 Implementera kommunikation via Zigbee, LoRaWAN, eller WiFi.
- 5.3 Testa och kalibrera sensorer för tillförlitliga mätvärden.
- 5.4 Optimera systemets strömförbrukning och datasäkerhet.
- 5.5 Integrera sensorer med backend och API.
- 5.6 Test av prototyp i verklig miljö för att säkerställa funktionalitet och pålitlighet.


## Leveranser och dokumentation

### Övergripande leveranser
- Fungerande prototyp som demonstrerar systemets funktionalitet.
- API och backend-struktur för datainsamling och hantering.
- Mobilapp och dashboard för användarinteraktion.
- IoT-sensorer och algoritmer för riskbedömning.


### Specifika leveranser per team

**Frontend-teamet** 

- Mobilapplikation (React Native) med ett interaktivt UI/UX.
- Kommunikation med backend via API.
- Dashboard med datavisualisering.
- Användarmanual för appens funktioner.

**Backend-teamet**

- API (Node.js, Express, SQL) för hantering av dataflöden.
- Databas för lagring och analys av data.
- Säker autentisering och behörighetshantering.
- API-dokumentation.


***System-teamet**

- IoT-sensorer och datahanteringsalgoritmer.
- Kommunikation mellan hårdvara och backend.
- Användarmanual och teknisk dokumentation för hårdvarusystemet.


### Dokumentation 
_All dokumentation infogas i repot. Dokumentationen uppdateras löpande._

Där grupp anges ansvarar respektive grupp för att utse eventuell ansvarig person (antingen konstant eller roterande, t.ex. teamleader eller sektreterare).

#### PROJEKTPLAN.md
Denna projektplan

#### README.md
Ansvarig: Alla grupper ansvarar för sin del i dokumentationen, huvudsakliga ansvariga bestäms under projektets gång.

#### API-DOCUMENTATION.md
Ansvarig: Fullstack

#### ACCESSIBILITY.md
Information om tillgänglighetsanpassningar

Ansvarig: Frontend

#### CHANGELOG.md
Ansvarig: Varje grupp ansvarar för att skriva sina förändringar.

#### RETROSPECTIVE.md
**Projektnivå**

Ansvarig: Projektledare

**Team-nivå**

Ansvarig: Respektive team ansvarar för kontinuerlig dokumentation av interna retron

#### ARCHITECTURE.md
Ansvarig: Systemutvecklare

#### TESTING.md
Ansvarig: Alla grupper ansvarar för testningen av sina delar av projektet. Mot slutet av projektet kan en grupp med mer tid ta större ansvar för detta. 

## Riskanalys och Riskreduceringsplan

### Risker
- Teknisk komplexitet
- Kommunikationsbrister inom team
- Tidsbrist och förseningar


### Plan för problemhantering & riskreducering
- Regelbundna standups och retros
- Om någonting tar längre tid än väntat – planera in marginal i tidsplanen för varje sprint
- Eskalationsplan om en teammedlem inte levererar enligt plan:
  - Kontakta medlemmen direkt och försöker ta reda på vad som påverkar arbetet. Om detta inte hjälper får vi ta hjälp av en utbildare.

