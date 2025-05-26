#include "../include/TransmitterManager.h"
#include <ArduinoJson.h>

#define SERVER_URL ""
#define API_KEY ""

TransmitterManager::TransmitterManager(const char* id) : sensor_id(id)
{
    // #if MOCK_MODE

    //     // test and set up
    // #else
    //     // lora
    // // test and set up
    // #endif
}

void TransmitterManager::send_data(BatteryManager& battery, SensorManager& sensor) {
#if MOCK_MODE
    //
#else
    // LoRa packet sending
#endif
}

uint32_t TransmitterManager::convert_to_flags(float battery, float water_level, float rate) {
    uint32_t flags = 0;

    if (battery >= 80.0f) {
        flags |= BATTERY_FULL;
    }
    else if (battery >= 20.0f) {
        flags |= BATTERY_MEDIUM;
    }
    else {
        flags |= BATTERY_LOW;
    }

    if (water_level > 90.0f) {
        flags |= THRESHOLD_ABOVE_90;
    }
    else if (water_level > 80.0) {
        flags |= THRESHOLD_ABOVE_80;
    }
    else if (water_level > 70.0) {
        flags |= THRESHOLD_ABOVE_70;
    }
    else if (water_level > 60.0) {
        flags |= THRESHOLD_ABOVE_60;
    }
    else if (water_level > 50.0) {
        flags |= THRESHOLD_ABOVE_50;
    }
    else if (water_level > 40.0) {
        flags |= THRESHOLD_ABOVE_40;
    }
    else if (water_level > 30.0) {
        flags |= THRESHOLD_ABOVE_30;
    }
    else if (water_level > 20.0) {
        flags |= THRESHOLD_ABOVE_20;
    }
    else if (water_level > 10.0) {
        flags |= THRESHOLD_ABOVE_10;
    }

    if (rate > 10.0f) {
        flags |= RATE_OF_CHANGE_LARGE;
    }
    else if (rate > 5.0f) {
        flags |= RATE_OF_CHANGE_MEDIUM;
    }
    else if (rate > 1.0f) {
        flags |= RATE_OF_CHANGE_SMALL;
    }
    Serial.println(flags, BIN);
    // other values should also be LOST_COMMUNICATION, SENSOR_FAILURE, RATE_OF_CHANGE_SMALL, RATE_OF_CHANGE_MEDIUM, RATE_OF_CHANGE_LARGE
    return flags;
}
