export const SensorFlags = {
  BATTERY_FULL: 1 << 0, // 1
  BATTERY_MEDIUM: 1 << 1, // 2
  BATTERY_LOW: 1 << 2, // 4
  SENSOR_FAILURE: 1 << 3, // 8
  LOST_COMMUNICATION: 1 << 4, // 16
  THRESHOLD_ABOVE_20: 1 << 5, // 32
  THRESHOLD_ABOVE_30: 1 << 6, // 64
  THRESHOLD_ABOVE_40: 1 << 7, // 128
  THRESHOLD_ABOVE_50: 1 << 8, // 256
  RATE_OF_CHANGE_SMALL: 1 << 9, // 512
  RATE_OF_CHANGE_MEDIUM: 1 << 10, // 1024
  RATE_OF_CHANGE_LARGE: 1 << 11, // 2048
  INTERNAL_FLAG_01: 1 << 12, // 4096
  INTERNAL_FLAG_02: 1 << 13, // 8192
  INTERNAL_FLAG_03: 1 << 14, // 16384
  INTERNAL_FLAG_04: 1 << 15, // 32768
};

const isFlagSet = (bitField, flag) => {
  return (bitField & flag) !== 0;
};

const getBaseSensorFlags = () => {
  return Object.fromEntries(
    Object.keys(SensorFlags).map((key) => [key, false])
  );
};

const extractSensorFlags = (bitField) => {
  const result = getBaseSensorFlags();

  for (const [flagName, flagValue] of Object.entries(SensorFlags)) {
    if (isFlagSet(bitField, flagValue)) {
      result[flagName] = true;
    }
  }

  return result;
};

export default extractSensorFlags;
