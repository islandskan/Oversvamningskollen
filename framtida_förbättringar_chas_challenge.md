
# Framtida förbättringar – Chas Challenge

Vi har under projektets gång lärt oss mycket, men också stött på olika problem och begränsningar. Därför har vi funderat på vad som skulle kunna förbättras eller läggas till om projektet skulle fortsätta utvecklas. Här är några förslag på framtida förbättringar:

## Tekniska förbättringar
- **Få igång LoRa32 och TTN med riktig data**  
  Vi har använt mockdata eftersom det var svårt att få hårdvaran att fungera. Ett naturligt nästa steg vore att få igång kommunikationen med riktiga sensordata.

- **Stabilare kommunikation mellan sensor och mikrokontroller**  
  Just nu får vi fel vid I2C-kommunikation. Det kan bero på felkoppling eller bristande stöd i bibliotek. Det här behöver undersökas vidare.

- **Bättre val av komponenter**  
  Vissa komponenter passade inte riktigt ihop, vilket krävde mycket anpassning. Till nästa gång kan det vara bra att välja delar som fungerar tillsammans direkt.

## För användaren
- **Larm via mobil eller mejl**  
  Om vattennivån blir för hög vore det bra om användaren kunde få ett tydligt meddelande, t.ex. via SMS eller notis.

- **Tydligare gränssnitt**  
  Frontenden fungerar, men skulle kunna göras ännu enklare att förstå, med tydliga färger och bättre grafik.

- **Visa datan i grafer**  
  Det vore användbart att kunna se hur vattennivån har ändrats över tid, till exempel i ett diagram.

## Samarbete och utveckling
- **Bättre struktur mellan grupperna**  
  Samarbetet har fungerat, men det kan bli ännu bättre om alla har tydliga roller och ansvarsområden från början.

- **Automatiska tester och uppdateringar**  
  Om projektet ska leva vidare är det bra att ha rutiner för att testa och uppdatera koden smidigt.

---

Dessa förbättringar skulle göra projektet mer användbart, lättare att underhålla och enklare att förstå både för användare och utvecklare.
