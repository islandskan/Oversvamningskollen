# API-Arkitektur: Översvämningskollen

##  Teknisk översikt

**Stack:**

* **Backend:** Node.js med Express
* **Databas:** PostgreSQL
* **API-dokumentation:** Swagger (OpenAPI 3.0, YAML), 
* **Datatyper:** REST + JSON
* **Autentisering:** (Planerad) JWT

##  Sammanfattning av resurser

### 1. Användare

* `GET /api/users` → lista användare
* `POST /api/users` → skapa ny användare
* `PATCH/DELETE /api/users/{id}` → uppdatera/radera användare

### 2. Sensorer

* `GET /api/sensors` → alla sensorer
* `GET /api/sensors/{sensorID}` → specifik sensor + kontakter
* `POST /api/sensors` → skapa sensor
* `PATCH/DELETE /api/sensors/{sensorID}`

### 3. Nödkontakter

* `GET /api/emergency-contacts` → alla kontakter
* `POST /api/emergency-contacts` → skapa ny
* `PATCH/DELETE /api/emergency-contacts/{contactID}`

### 4. Vattennivåer

* `GET /api/sensors/waterlevels` → senaste nivån
* `GET /api/sensors/historicwaterlevels` → historik

## Databasmodell

```sql
sensors(id, installation_date, battery_status, longitude, latitude, location_description, sensor_failure, lost_communication)
emergency_contacts(id, sensor_id [FK], name, phone_number)
users(id, role_id, name, email, password)
roles(id, name)
waterlevels(id, sensor_id [FK], waterlevel, rate_of_change, measured_at)
```

##  Designbeslut

* Nödkontakter är direkt kopplade till `sensor_id`
* `GET /api/sensors/:id` returnerar sensor + tillhörande `emergency_contacts`
* Swagger används aktivt för dokumentation i `swagger.yaml`
* Separat router per resurs: `sensor.js`, `user.js`, `emergencyContacts.js`

##  Risker & förbättringar

* [ ] Validering saknas för input → rekommenderar `zod`
* [ ] Ingen auth ännu → JWT + middleware
* [ ] Swagger är publik → skydd vid deployment

##  Kommande steg

* Införa autentisering (JWT)
* Lägga till rollstyrning (admin/vanlig)
* Integrera frontend med /sensors/\:id-details endpoint
* Swagger: lägga till `components:` för schemas
