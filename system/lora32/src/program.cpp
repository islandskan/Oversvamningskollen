#include <Arduino.h>
#include "../include/DisplayManager.h"
#include "../include/SensorManager.h"
#include "../include/BatteryManager.h"

DisplayManager display;
SensorManager sensor(true);
BatteryManager battery(true);

void setup() {
  Serial.begin(115200);
  delay(500);
  display.initialize();
  display.print_message("Starting up...");
}

void loop() {
  int sensor_water_level_data = sensor.read_water_level();
  int sensor_change_data = sensor.get_rate_of_change();
  float voltage = battery.get_voltage();
  float percentage = battery.get_battery();

  String status = String(voltage) + "V | " + String(percentage, 0) + "%" + "\nWater: " + String(sensor_water_level_data) + "cm" + " | Change level: " + String(sensor_change_data);
  Serial.println(status);
  display.print_message(status);
  delay(3000);

  // validation of data?
  // convert data into bit flags

  // print bit flags to serial monitor and to the display

}
