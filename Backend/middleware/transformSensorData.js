 export default function transformSensorData(inputJson) {
  const timestamp = new Date().toISOString(); // eller new Date() om du föredrar Date-objekt

  return Object.entries(inputJson).map(([sensor_id, value]) => ({
    sensor_id,
    value,
    timestamp
  }));
}

const input = {
  "SENSOR-1": 3,
  "SENSOR-2": 127,
  "RANDOM_ID": 2052,
  "H7AD-DJWFI-DSOQ": 1024
};

const transformed = transformSensorData(input);

console.log(transformed);


 