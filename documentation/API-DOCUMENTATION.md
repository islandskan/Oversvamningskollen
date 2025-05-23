<h1>Översvämningskollen – Backend</h1>

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




<h2>API-dokumentation</h2>

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
