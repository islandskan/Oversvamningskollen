import extractSensorFlags from "./middleware/bitflagDecoder/extractSensorFlags.js";
import getSensorDataFile from "./middleware/bitflagDecoder/getSensorDataFile.js";
import { query } from './db.js';

const main = async () => {
  const fileName = "1747039372694.json";
  const content = await getSensorDataFile(fileName);

  for (const [sensorId, bitField] of Object.entries(content)) {
    const { thresholdLevel, rateOfChangeLevel } = extractSensorFlags(bitField);

    try {
      await query(
        `INSERT INTO waterlevels (sensor_id, waterlevel, rate_of_change, measured_at)
         VALUES ($1, $2, $3, NOW())`,
        [sensorId, thresholdLevel, rateOfChangeLevel]
      );
      console.log(`✅ Sparade sensor ${sensorId}: level=${thresholdLevel}, rate=${rateOfChangeLevel}`);
    } catch (err) {
      console.error(`❌ Fel för sensor ${sensorId}:`, err);
    }
  }
};

main();
