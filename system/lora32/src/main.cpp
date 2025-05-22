#include <Arduino.h>
#include "../include/Manager.h"
#include "../lib/Mode.h"

Manager system(Mode::MOCK);


void setup() {
#ifdef ESP32
    Serial.begin(115200);
#else
    Serial.begin(9200);
#endif
    delay(1000);
    Serial.println("System starting...");
}

void loop() {
    system.cycle();
}
