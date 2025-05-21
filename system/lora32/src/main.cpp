#include <Arduino.h>
#include "../include/BatteryManager.h"

BatteryManager battery(true, 36000UL); // instead of 1 hour, 1 minutes


void setup() {
    Serial.begin(9200);



}

void loop() {
    float voltage = battery.get_voltage();
    float percent = battery.get_battery();
    String battery_status = "Battery voltage: " + String(voltage, 2) + "V | Battery: " + String(percent) + " %";
    Serial.println(battery_status);
    delay(2000);
}
