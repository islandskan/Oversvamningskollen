# FloodCast - Översvämningsriskövervakningssystem

## 📱 Projektöversikt

FloodCast är en omfattande mobilapplikation designad för att övervaka och hantera översvämningsrisker i urbana områden. Systemet kombinerar IoT-sensordata med ett användarvänligt mobilgränssnitt för att tillhandahålla realtidsinformation om översvämningsrisker, vilket hjälper kommuner och medborgare att reagera effektivt på potentiella översvämningshändelser.

Byggd med React Native och Expo levererar FloodCast en plattformsoberoende lösning som fungerar sömlöst på både iOS- och Android-enheter, med interaktiva kartor, realtidsdatavisualisering och säker användarautentisering.

## 🌟 Huvudfunktioner

- **Interaktiv Översvämningsriskkarta**: Realtidsvisualisering av översvämningsriskområden med färgkodade risknivåer
- **Detaljerad Riskinformation**: Omfattande data om vattennivåer, drabbade områden och nödkontakter
- **Mörkt/Ljust Läge**: Fullt responsiv UI med automatisk temadetektering
- **Säker Autentisering**: JWT-baserat autentiseringssystem med säker tokenhantering
- **Offline-funktionalitet**: Återgång till mockdata när nätverksanslutningen är begränsad

## 🛠️ Teknikstack

### Frontend
- **React Native** (0.79.2) med **Expo** (53.0.9) ramverk för plattformsoberoende utveckling
- **TypeScript** (5.3.3) för typsäkerhet och förbättrad utvecklarupplevelse
- **NativeWind** (4.1.23) - Tailwind CSS för React Native styling
- **Expo Router** (5.0.6) för deklarativ, filbaserad navigering
- **React Native Maps** (1.20.1) för interaktiv kartfunktionalitet
- **Zustand** (5.0.4) för lättviktig tillståndshantering

### Utveckling & Testning
- **Jest** (29.2.1) med **Jest Expo** för enhetstestning
- **React Testing Library** för komponenttestning
- **EAS Build** för strömlinjeformad distribution och testning
- **TypeScript** för statisk typkontroll

### Backend-integration
- **RESTful API** integration med JWT-autentisering
- **PostgreSQL** databas med optimerat schema för sensordata
- **Realtidsdatabehandling** med återgång till mockdata

## 📂 Projektstruktur

```
floodcast/
├── app/                    # Huvudapplikationskod (Expo Router)
│   ├── (tabs)/             # Flikbaserade navigeringsskärmar
│   │   ├── index.tsx       # Hemskärm med karta
│   │   └── settings.tsx    # Inställningar och preferenser
│   ├── _layout.tsx         # Rotlayout med autentisering
│   ├── index.tsx           # Ingångspunkt och ruttvakt
│   ├── login.tsx           # Användarautentisering
│   └── signup.tsx          # Användarregistrering
├── components/             # Återanvändbara UI-komponenter
│   ├── flood-risk-modal/   # Modalkomponenter för riskdetaljer
│   └── ui/                 # Gemensamma UI-komponenter
├── constants/              # Appkonstanter och temakonfiguration
├── context/                # React context providers (Auth)
├── hooks/                  # Anpassade React hooks
├── services/               # API-servicelager
├── types/                  # TypeScript typdefinitioner
├── utils/                  # Verktygsfunktioner
└── assets/                 # Statiska tillgångar (bilder, typsnitt)
```

## 🚀 Komma igång

### Förutsättningar
- Node.js ≥ 18.x
- npm (yarn används inte i detta projekt)
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`
- Android Studio (för Android-utveckling)
- Xcode (för iOS-utveckling, endast macOS)

### Installation

1. **Klona repositoriet**
   ```bash
   git clone <repository-url>
   cd floodcast
   ```

2. **Installera beroenden**
   ```bash
   npm install
   ```

3. **Konfigurera miljövariabler**
   ```bash
   cp .env.example .env
   ```
   
   Konfigurera din `.env`-fil med:
   ```
   MAPS_API_KEY=din_google_maps_api_nyckel_här
   ```

4. **Starta utvecklingsservern**
   ```bash
   npm run s
   # eller
   npx expo start
   ```




