<h1>Översvämningskollen – Backend</h1>

<p>Detta är backend-delen av Översvämningskollen – ett API för att hantera användare, sensorer, nödkontakter och vattennivådata i realtid.</p>

<h2>🛠 Förutsättningar</h2>
<ul>
  <li>Node.js ≥ v14</li>
  <li>PostgreSQL ≥ v12</li>
  <li>npm</li>
</ul>

<h2>🚀 Kom igång</h2>
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
    <pre><code>cp .envexample .env</code></pre>
    <p>Redigera sedan <code>.env</code>:</p>
    <pre><code>DB_HOST=localhost
DB_PORT=5432
DB_USER=din_användare
DB_PASSWORD=ditt_lösenord
DB_NAME=oversvamningskollen</code></pre>
  </li>

  <li><strong>Skapa PostgreSQL-databasen:</strong>
    <pre><code>createdb -U din_användare oversvamningskollen</code></pre>
  </li>

  <li><strong>Starta backend-servern:</strong>
    <pre><code>npm start</code></pre>
    <p>Servern körs nu på <a href="http://localhost:3000">http://localhost:3000</a></p>
  </li>
</ol>

<h2>📡 API-dokumentation</h2>

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

<h3>🧪 Testa API</h3>
<p>Mockserver: <a href="https://virtserver.swaggerhub.com/chasacademy-135/floodcast/1.0.0">SwaggerHub Mock</a><br>
Swagger-spec: <a href="https://app.swaggerhub.com/apis/chasacademy-135/floodcast/1.0.0">Floodcast API</a></p>

<h2>📄 Licens</h2>
<p>MIT-licens. Se <code>LICENSE</code>-filen i repo:t.</p>
