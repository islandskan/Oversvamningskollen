import fs from 'fs';
import path from 'path';

// 👇 File paths
const dataPath = path.resolve('Backend/data/mockdata/waterlevels.json');
const archivePath = path.resolve('Backend/data/mockdata/historicwaterlevels.json');

try {
  // Read current water level data
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const sensorData = JSON.parse(rawData);

  // Read or initialize archive
  let archivedData = [];
  if (fs.existsSync(archivePath)) {
    const rawArchive = fs.readFileSync(archivePath, 'utf-8');
    archivedData = JSON.parse(rawArchive);
  }

  const updatedSensorData = [];
  const newlyArchived = [];

  sensorData.forEach(sensor => {
    if (!sensor.measurements || sensor.measurements.length <= 3) {
      updatedSensorData.push(sensor); // No archiving needed
      return;
    }

    // Sort descending by date + time
    const sorted = sensor.measurements.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB - dateA;
    });

    const keep = sorted.slice(0, 3);
    const toArchive = sorted.slice(3);

    // Save back the recent measurements
    updatedSensorData.push({
      ...sensor,
      measurements: keep
    });

    // Append archived measurements
    if (toArchive.length > 0) {
      newlyArchived.push({
        sensorID: sensor.sensorID,
        measurements: toArchive
      });
    }
  });

  // Merge new archive data with existing
  newlyArchived.forEach(newEntry => {
    const existing = archivedData.find(item => item.sensorID === newEntry.sensorID);
    if (existing) {
      existing.measurements = existing.measurements.concat(newEntry.measurements);
    } else {
      archivedData.push(newEntry);
    }
  });

  // Write updates to disk
  fs.writeFileSync(dataPath, JSON.stringify(updatedSensorData, null, 2));
  fs.writeFileSync(archivePath, JSON.stringify(archivedData, null, 2));

  console.log('✅ Archiving complete!');
  console.log(`📦 Archived ${newlyArchived.length} sensor(s).`);

} catch (error) {
  console.error('❌ Error during archiving:', error.message);
}
