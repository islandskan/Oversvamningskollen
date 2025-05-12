/*
  RadioLib LoRaWAN Starter Example

  ! Please refer to the included notes to get started !

  This example joins a LoRaWAN network and will send
  uplink packets. Before you start, you will have to
  register your device at https://www.thethingsnetwork.org/
  After your device is registered, you can run this example.
  The device will join the network and start uploading data.

  Running this examples REQUIRES you to check "Resets DevNonces"
  on your LoRaWAN dashboard. Refer to the network's
  documentation on how to do this.

  For default module settings, see the wiki page
  https://github.com/jgromes/RadioLib/wiki/Default-configuration

  For full API reference, see the GitHub Pages
  https://jgromes.github.io/RadioLib/

  For LoRaWAN details, see the wiki page
  https://github.com/jgromes/RadioLib/wiki/LoRaWAN

*/

//#include "config.h"
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C // double check address from data sheet. 0x3C should be for the 128x32
// to do: write a I2C-test scanner
const uint8_t builtin_led{ 25 };
const unsigned long blink_delay{ 500 };
unsigned long timer{ 0 };
unsigned long timer2{ 0 };

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void blink_func();
void display_func(Adafruit_SSD1306&);
void log_func(Adafruit_SSD1306&);
/*void blink_func(void* pvParameters);
void display_func(void* pvParameters);
void log_func(void* pvParameters);
TaskHandle_t led_task;
TaskHandle_t display_task;
TaskHandle_t log_task;*/


void setup() {
    Serial.begin(115200);
    delay(2000);  // Give time to switch to the serial monitor
    Serial.println(F("\nSetup ... "));
    pinMode(builtin_led, OUTPUT);
    display_func(display);

    /*const BaseType_t debugger_led = xTaskCreate(blink_func, static_cast<const char*>("Blink debugger led"), 2048, (void*)&blink_delay, 1, &led_task);
    if(debugger_led != pdPASS) {
      Serial.println("Failed to blink debugger led");
    }
    const BaseType_t debugger_display = xTaskCreate(display_func, static_cast <const char*>("Run display"), 2048, nullptr, 1, &display_task);
    if(debugger_display != pdPASS) {
      Serial.println("Failed to run display");
    }

    const BaseType_t debugger_log = xTaskCreate(log_func, static_cast <const char*>("Run logger"), 1024, nullptr, 1, &log_task);
    if(debugger_log != pdPASS) {
      Serial.println("Failed to run logger");
    }*/


    /*if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
      Serial.println(F("SSD1306 allocation failed"));
      //for(;;); // Don't proceed, loop forever
    }

    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("OLED Display Test");
    display.println("TTGO T3 V1.6.1");
    display.println("Hello, world!");
    display.display();  // Push buffer to screen
    */


    /*int16_t state = radio.begin();
    debug(state != RADIOLIB_ERR_NONE, F("Initialise radio failed"), state, true);

    // Setup the OTAA session information
    state = node.beginOTAA(joinEUI, devEUI, nwkKey, appKey);
    debug(state != RADIOLIB_ERR_NONE, F("Initialise node failed"), state, true);

    Serial.println(F("Join ('login') the LoRaWAN Network"));
    state = node.activateOTAA();
    debug(state != RADIOLIB_LORAWAN_NEW_SESSION, F("Join failed"), state, true);

    Serial.println(F("Ready!\n"));*/
    Serial.println("Everything good!");
    /*vTaskStartScheduler();
    for(;;);*/
}

void loop() {
    blink_func();
    log_func(display);
    //vTaskDelay(configTICK_RATE_HZ);

    // This is the place to gather the sensor inputs
    // Instead of reading any real sensor, we just generate some random numbers as example
    /*uint8_t value1 = radio.random(100);
    uint16_t value2 = radio.random(2000);

    // Build payload byte array
    uint8_t uplinkPayload[3];
    uplinkPayload[0] = value1;
    uplinkPayload[1] = highByte(value2);   // See notes for high/lowByte functions
    uplinkPayload[2] = lowByte(value2);

    // Perform an uplink
    int16_t state = node.sendReceive(uplinkPayload, sizeof(uplinkPayload));
    debug(state < RADIOLIB_ERR_NONE, F("Error in sendReceive"), state, false);

    // Check if a downlink was received
    // (state 0 = no downlink, state 1/2 = downlink in window Rx1/Rx2)
    if(state > 0) {
      Serial.println(F("Received a downlink"));
    } else {
      Serial.println(F("No downlink received"));
    }

    Serial.print(F("Next uplink in "));
    Serial.print(uplinkIntervalSeconds);
    Serial.println(F(" seconds\n"));

    // Wait until next uplink - observing legal & TTN FUP constraints
    delay(uplinkIntervalSeconds * 1000UL);  // delay needs milli-seconds*/

}

void blink_func() {
    if ((millis() - timer) >= blink_delay) {
        digitalWrite(builtin_led, !digitalRead(builtin_led));
        timer = millis();
    }
}

void display_func(Adafruit_SSD1306& display) {
    if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
        Serial.println(F("SSD1306 allocation failed"));
        for (;;); // Don't proceed, loop forever
    }
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("OLED Display Test");
    display.println("TTGO T3 V1.6.1");
    display.println("Hello, world!");
    display.display();  // Push buffer to screen
}

void log_func(Adafruit_SSD1306& display) {
    if ((millis() - timer2) >= 10000) {
        display.clearDisplay();
        display.setCursor(0, 24);
        display.println(F("Sending uplink"));
        display.display();
        timer2 = millis();
    }
}

/*
void blink_func(void* pvParameters) {
  uint32_t delay = *((uint32_t*)pvParameters);
    pinMode(BUILTIN_LED, OUTPUT);
  for(;;) {
    digitalWrite(BUILTIN_LED, !digitalRead(BUILTIN_LED));
    vTaskDelay(delay);
  }
}*/

/*void display_func(void* pvParameters) {
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("OLED Display Test");
  display.println("TTGO T3 V1.6.1");
  display.println("Hello, world!");
  display.display();  // Push buffer to screen
}*/

/*void log_func(void* pvParameters) {
  Serial.println(F("Sending uplink"));
}*/
