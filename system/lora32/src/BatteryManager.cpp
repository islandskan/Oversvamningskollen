#include "../include/BatteryManager.h"
#include <cmath>

BatteryManager::BatteryManager(bool mock) : mock_mode(mock), vbat_pin(35), voltage(0.0) {}

float BatteryManager::read_voltage() {
    if (mock_mode) {
        /** temporary comment: value is going to oscillate between 4.2V(100%) and 3.6V(~5%)
         * 3.75 = reference point, 0.45 = "offset" to "move" the reference point between 3.6 and 4.2
         * sin() = value between -1 and +1
         * 3.75 + (0.45 * -1) = 3.75 + (-0.45) = 3.6
         * 3.75 + (0.45 * 1) = 3.75 + 0.45 = 4.2
         * **/
        Serial.println("\nsin:" + String(sin(millis() / 5000.0)));
        Serial.println("0.45 * sin(millis() / 5000.0) = " + String(0.45 * sin(millis() / 5000.0)));
        voltage = 3.75 + 0.45 * sin(millis() / 5000.0);
    }
    else {
        /** Temporary commment: The ADC on ESP32 has a 12-bit resolution: a value between 0-4095
         * in the schematics, it's shown that there's a voltage divider(100kΩ/100KΩ) between the battery and the ADC. The voltage can be divided between 2 = 2.0
         * 3.3 = the reference voltage of the ESP32 is usually 3.3V**/
        int adc_reading = analogRead(vbat_pin);
        voltage = ((float)adc_reading / 4095.0) * 2.0 * 3.3;
    }
    return voltage;
}

float BatteryManager::voltage_to_percentage(float voltage) {
    if (voltage >= 4.2) {
        return 100.0;
    }
    else if (voltage >= 4.15) {
        return 95.0;
    }
    else if (voltage >= 4.11) {
        return 90.0;
    }
    else if (voltage >= 4.08) {
        return 85.0;
    }
    else if (voltage >= 4.02) {
        return 80.0;
    }
    else if (voltage >= 3.98) {
        return 75.0;
    }
    else if (voltage >= 3.95) {
        return 70.0;
    }
    else if (voltage >= 3.91) {
        return 65.0;
    }
    else if (voltage >= 3.87) {
        return 60.0;
    }
    else if (voltage >= 3.85) {
        return 55.0;
    }
    else if (voltage >= 3.84) {
        return 50.0;
    }
    else if (voltage >= 3.82) {
        return 45.0;
    }
    else if (voltage >= 3.8) {
        return 40.0;
    }
    else if (voltage >= 3.79) {
        return 35.0;
    }
    else if (voltage >= 3.77) {
        return 30.0;
    }
    else if (voltage >= 3.75) {
        return 25.0;
    }
    else if (voltage >= 3.73) {
        return 20.0;
    }
    else if (voltage >= 3.71) {
        return 15.0;
    }
    else if (voltage >= 3.69) {
        return 10.0;
    }
    else if (voltage >= 3.61) {
        return 5.0;
    }
    else if (voltage >= 3.58) {
        return 4.0;
    }
    else if (voltage >= 3.55) {
        return 3.0;
    }
    else if (voltage >= 3.5) {
        return 2.0;
    }
    else if (voltage >= 3.45) {
        return 1.0;
    }
    else {
        return 0.0;
    }
}

float BatteryManager::get_voltage() {
    voltage = read_voltage();
    return voltage;
}

float BatteryManager::get_battery() {
    return voltage_to_percentage(voltage);
}
