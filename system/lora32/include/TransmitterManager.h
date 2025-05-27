#ifndef TRANSMITTERMANAGER_H
#define TRANSMITTERMANAGER_H
#include "../lib/config.h"
// include utility function to encode the values into bit flags?
#ifdef MOCK_MODE
#include <Arduino.h>
#include <ArduinoHttpClient.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#else
    // includes for LoRaWAN
#include <RadioLib.h>
#endif

class TransmitterManager
{
private:
    const char* sensor_id;
    WiFiClient wifi_client;
    uint32_t convert_to_flags(float battery, float water_level, float rate);
    enum SensorFlags : uint32_t {
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
    };

public:
    TransmitterManager(const char* id);
    void send_data(float battery, float water_level, float rate);

};

#endif
