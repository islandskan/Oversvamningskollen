import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, "sensor_data");

const getSensorDataFile = async (fileName) => {
  const filePath = path.join(directory, fileName);
  const data = await readFile(filePath, "utf-8");
  return (data && JSON.parse(data)) || {};
};

export default getSensorDataFile;
