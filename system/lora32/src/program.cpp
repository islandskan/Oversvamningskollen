/*#include <Arduino.h>
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
  // read water levels
  delay(1000);
  // get rate of change
  int sensor_change_data = sensor.get_rate_of_change();
  delay(1000);
  // get battery level
  float battery_level = battery.read_voltage();
  // print mock data to Serial monitor and display
  delay(1000);

  Serial.println(sensor_water_level_data);
  Serial.println(sensor_change_data);
  Serial.println(battery_level);
  // funkar, till display behöver jag "slå ihop" data till en String
  // just nu hinner utskriften av level och change att clearas på skärmen
  display.print_message(static_cast<String>(sensor_water_level_data));
  display.print_message(static_cast<String>(sensor_change_data));
  display.print_message(static_cast<String>(battery_level));

  // validation of data?
  // convert data into bit flags

  // print bit flags to serial monitor and to the display

}
*/
