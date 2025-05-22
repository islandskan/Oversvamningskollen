#include "../include/Manager.h"
#include <Arduino.h>
#ifdef  ESP32
#define MICROSECONDS_TO_SECONDS_FACTOR 1000ULL
#else
#include <ArduinoLowPower.h>
#endif

Manager::Manager(Mode mode) : _mode(mode), water_sensor(mode), battery(mode), transmitter(mode)
{
}

void Manager::sleep_intervall(unsigned long duration_ms) {
#ifdef ESP32
    esp_sleep_enable_timer_wakeup(duration_ms * MICROSECONDS_TO_SECONDS_FACTOR);
    Serial.flush();
    esp_deep_sleep_start();
#else
    delay(300);
    for (int i = 0; i < duration_ms / 1000; ++i) {
        LowPower.idle(1000);
    }
#endif
}
void Manager::cycle() {
    Serial.println("Cycle complete. Going to sleep...");
    water_sensor.update();
    float level = water_sensor.get_water_level();
    float change_of_rate = water_sensor.get_rate_of_change();
    float voltage = battery.get_voltage();
    float percent = battery.get_battery();
    String water_status = "Water level: " + String(level) + " cm | Change of rate: " + String(change_of_rate) + " %";
    String battery_status = "Battery voltage: " + String(voltage, 2) + "V | Battery: " + String(percent) + " %";
    Serial.println(water_status);
    Serial.println(battery_status);
    // Transmit data
    // Log to display
    sleep_intervall(300000UL);
}
