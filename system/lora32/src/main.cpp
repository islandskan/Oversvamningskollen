#include <Arduino.h>
#include "../include/Manager.h"
#include "../lib/config.h"

Manager app;


void setup() {
    Serial.begin(115200);
    delay(1000);
    while (!Serial);
}

void loop() {
    app.cycle();
}
