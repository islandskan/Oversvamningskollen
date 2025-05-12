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
  // read water levels
  // get rate of change
  // get battery level
  // print mock data to Serial monitor and display

  // validation of data?
  // convert data into bit flags

  // print bit flags to serial monitor and to the display

}
