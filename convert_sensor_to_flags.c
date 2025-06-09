// Proof-of-concept for converting our values into flags
// Will be re-implemented properly in the main code once we have a foundation to work with

#include <stdio.h>
#include <stdint.h>

typedef enum {
    BATTERY_FULL = 1u << 0, // 1
    BATTERY_MEDIUM = 1u << 1, // 2
    BATTERY_LOW = 1u << 2, // 4
    LOST_COMMUNICATION = 1u << 3, // 8
    SENSOR_FAILURE = 1u << 4, // 16
    THRESHOLD_ABOVE_10 = 1u << 5, // 32
    THRESHOLD_ABOVE_20 = 1u << 6, // 64
    THRESHOLD_ABOVE_30 = 1u << 7, // 128
    THRESHOLD_ABOVE_40 = 1u << 8, // 256
    THRESHOLD_ABOVE_50 = 1u << 9, // 512
    THRESHOLD_ABOVE_60 = 1u << 10, // 1024
    THRESHOLD_ABOVE_70 = 1u << 11, // 2048
    THRESHOLD_ABOVE_80 = 1u << 12, // 4096
    THRESHOLD_ABOVE_90 = 1u << 13, // 8192
    RATE_OF_CHANGE_SMALL = 1u << 14, // 16384
    RATE_OF_CHANGE_MEDIUM = 1u << 15, // 32768
    RATE_OF_CHANGE_LARGE = 1u << 16, // 65536
    INTERNAL_FLAG_01 = 1u << 28, // 268435456
    INTERNAL_FLAG_02 = 1u << 29, // 536870912
    INTERNAL_FLAG_03 = 1u << 30, // 1073741824
    INTERNAL_FLAG_04 = 1u << 31, // 2147483648
} SensorFlags;

// Dummy func
float get_battery() {
    return 30.0; // Max 100.0
}

// Dummy func
float get_water_level() {
    return 30.0; // Max 100.0
}

int main() {
    uint32_t flags = 0;
    
    float battery = get_battery();
    if (battery >= 80.0) {
        flags |= BATTERY_FULL;
    } else if (battery >= 20.0) {
        flags |= BATTERY_MEDIUM;
    } else {
        flags |= BATTERY_LOW;
    }

    float water_level = get_water_level();
    if (water_level > 20.0) {
        flags |= THRESHOLD_ABOVE_20;
    } else if (water_level > 30.0) {
        flags |= THRESHOLD_ABOVE_30;
    } else if (water_level > 40.0) {
        flags |= THRESHOLD_ABOVE_40;
    } else if (water_level > 50.0) {
        flags |= THRESHOLD_ABOVE_50;
    }

    printf("Flags: %d\n", flags);

    return 0;
}