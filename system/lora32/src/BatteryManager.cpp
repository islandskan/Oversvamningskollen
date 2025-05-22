#include "../include/BatteryManager.h"
#include <cmath>
#define TEST_10 360000UL
#define TEST_60 3600000UL

BatteryManager::BatteryManager(Mode mode, unsigned long test_time) : _mode(mode), vbat_pin(A0), voltage(0.0), mock_voltage(4.2), battery_percentage(100.0), last_update_time(0), mock_time(TEST_10) {
    analogReference(AR_DEFAULT);
    analogReadResolution(12);
}

float BatteryManager::read_voltage() {
    if (_mode == MOCK) {
        unsigned long now = millis();
        if (now - last_update_time >= mock_time && mock_voltage > minimal_voltage) {
            mock_voltage -= 0.01;
            last_update_time = now;
        }
        voltage = mock_voltage;
    }
    else {
        int adc_reading = analogRead(vbat_pin);
        voltage = ((adc_reading * battery_voltage_ref) / 4095.0);
    }
    return voltage;
}

float BatteryManager::voltage_to_percentage(float voltage) {
    battery_percentage = 100 * abs((voltage - minimal_voltage) / (battery_voltage_ref - minimal_voltage));
    if (battery_percentage > 100.0) return 100.0;
    if (battery_percentage < 0.0) return 0.0;

    return battery_percentage;
}

float BatteryManager::get_voltage() {
    voltage = read_voltage();
    return voltage;
}

float BatteryManager::get_battery() {
    return voltage_to_percentage(voltage);
}
