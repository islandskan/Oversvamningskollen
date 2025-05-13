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

const isFlagSet = (bitField, flag) => (bitField & flag) !== 0;

const extractSensorFlags = (bitField) => {
  const flags = {};

  // Threshold level: extract highest level set (50 > 40 > ...)
  const thresholdLevels = [
    { flag: SensorFlags.THRESHOLD_ABOVE_50, level: 4 },
    { flag: SensorFlags.THRESHOLD_ABOVE_40, level: 3 },
    { flag: SensorFlags.THRESHOLD_ABOVE_30, level: 2 },
    { flag: SensorFlags.THRESHOLD_ABOVE_20, level: 1 },
  ];
  flags.thresholdLevel = 0;
  for (const { flag, level } of thresholdLevels) {
    if (isFlagSet(bitField, flag)) {
      flags.thresholdLevel = level;
      break;
    }
  }

  // Rate of change: extract highest level
  const rateLevels = [
    { flag: SensorFlags.RATE_OF_CHANGE_LARGE, level: 3 },
    { flag: SensorFlags.RATE_OF_CHANGE_MEDIUM, level: 2 },
    { flag: SensorFlags.RATE_OF_CHANGE_SMALL, level: 1 },
  ];
  flags.rateOfChangeLevel = 0;
  for (const { flag, level } of rateLevels) {
    if (isFlagSet(bitField, flag)) {
      flags.rateOfChangeLevel = level;
      break;
    }
  }

  return flags;
};

export default extractSensorFlags;
