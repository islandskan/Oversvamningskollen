#include <Arduino.h>
#include <RadioLib.h>
#include "../include/DisplayManager.h"
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

DisplayManager display;
SX1276 radio = new Module(18, 26, 14, 33);

void setup() {
    Serial.begin(115200);
    while (!Serial);
    delay(500);
    display.initialize();

    Serial.println(F("[TEST] SX1276 LoRa test start..."));
    display.print_message(F("[TEST] SX1276 LoRa test start..."));
    int16_t state = radio.begin();
    if (state == RADIOLIB_ERR_NONE) {
        Serial.println(F("[PASS] Radio ok"));
        display.print_message(F("[PASS] Radio ok"));
    }
    else {
        Serial.print(F("[FAIL] Radio failed, code: "));
        Serial.println(state);
        display.print_message("[FAIL] Radio failed, code: " + String(state));
        while (true);
    }
    state = radio.setFrequency(868.0);
    if (state != RADIOLIB_ERR_NONE) {
        Serial.println(F("[FAIL] Frequency set failed"));
        display.print_message(F("[FAIL] Frequency set failed"));
    }
    else {
        Serial.println(F("[PASS] Frequency set to 868 MHz"));
        display.print_message(F("[PASS] Frequency set to 868 MHz"));
    }

    radio.setOutputPower(17);
    radio.setSpreadingFactor(8);
    radio.setBandwidth(125.0);
    delay(1000);
}

void loop() {
    Serial.println(F("[SEND] Sending test packet..."));
    display.print_message(F("[SEND] Sending test packet..."));
    delay(2000);
    int16_t state = radio.transmit("SX1276 test message...");
    if (state == RADIOLIB_ERR_NONE) {
        Serial.println(F("[PASS] Packet sent successfully!"));
        display.print_message(F("[PASS] Packet sent successfully!"));
    }
    else {
        Serial.print(F("[FAIL] Packet send failed, code: "));
        Serial.println(state);
        display.print_message("[FAIL] Packet send failed, code: " + String(state));
    }
    delay(2000);
    Serial.print(F("[INFO] RSSI: "));
    Serial.println(radio.getRSSI());
    display.print_message("[INFO] RSSI: " + String(radio.getRSSI()));
    delay(2000);
    Serial.println(F("[INFO] Waiting 10 s..."));
    display.print_message(F("[INFO] Waiting 10 s..."));
    delay(10000);
}
