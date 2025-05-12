import extractSensorFlags from "./extractSensorFlags.js";
import getSensorDataFile from "./getSensorDataFile.js";

const main = async () => {
  const fileName = "1747039372694.json"; // Testfil
  const content = await getSensorDataFile(fileName);

  for (const [sensor, bitField] of Object.entries(content)) {
    const sensorFlags = extractSensorFlags(bitField);
    console.log(`>>>>> Reading ${sensor}`);
    console.log(sensorFlags);
  }
};

main();
