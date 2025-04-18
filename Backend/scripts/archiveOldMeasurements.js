import fs from 'fs/promises';
import path from 'path';

const currentPath = path.resolve('Backend', 'data', 'mockdata', 'waterlevels.json');
const historicPath = path.resolve('Backend', 'data', 'mockdata', 'historicwaterlevels.json');

function parseDateTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}`);
}

async function archiveOldMeasurements() {
  try {
    const currentDataRaw = await fs.readFile(currentPath, 'utf-8');
    const historicDataRaw = await fs.readFile(historicPath, 'utf-8');

    const currentData = JSON.parse(currentDataRaw);
    const historicData = JSON.parse(historicDataRaw);

    const updatedCurrent = [];
    const updatedHistoric = [...historicData]; // clone

    for (const sensor of currentData) {
      if (!sensor.measurements || sensor.measurements.length <= 3) {
        updatedCurrent.push(sensor); // nothing to archive
        continue;
      }

      // Sort by date+time descending
      const sorted = [...sensor.measurements].sort((a, b) => {
        return parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time);
      });

      const recent = sorted.slice(0, 3);
      const toArchive = sorted.slice(3);

      // Add to historic (merge by sensorID)
      const existingHistoricSensor = updatedHistoric.find(s => s.sensorID === sensor.sensorID);
      if (existingHistoricSensor) {
        existingHistoricSensor.measurements.push(...toArchive);
      } else {
        updatedHistoric.push({
          sensorID: sensor.sensorID,
          measurements: toArchive
        });
      }

      updatedCurrent.push({
        sensorID: sensor.sensorID,
        measurements: recent
      });
    }

    // Save updated files
    await fs.writeFile(currentPath, JSON.stringify(updatedCurrent, null, 2));
    await fs.writeFile(historicPath, JSON.stringify(updatedHistoric, null, 2));

    console.log('✅ Archiving complete.');
  } catch (err) {
    console.error('❌ Error during archiving:', err.message);
  }
}

archiveOldMeasurements();
