#include "../include/TransmitterManager.h"
#include <Arduino.h>

TransmitterManager::TransmitterManager()
{
}

void TransmitterManager::begin()
{
#if MOCK_MODE
    // Serial or Wifi
// test and set up
#else
    // lora
// test and set up
#endif
}

void TransmitterManager::send(float level, float rate, float battery) {
#if MOCK_MODE
    String data = "[MOCK] Transmitting data: \nWater Level: " + String(level) + " | Rate: " + String(rate) + " | Battery percentage: " + String(battery);
    Serial.println(data);
#else
    // LoRa packet sending
#endif
}
