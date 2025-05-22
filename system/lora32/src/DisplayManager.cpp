#include "../include/DisplayManager.h"

DisplayManager::DisplayManager(Mode mode) : _mode(mode) {
    if (_mode == MOCK) {
        // using an other oled display
        // mock_initialize();
    }
    else {
        // display(128, 64, &Wire, -1);
        initialize();
    }
}

void DisplayManager::initialize() {
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("SSD1306 allocation failed"));
        for (;;);
    }
    display.clearDisplay();
    display.display();
}

void DisplayManager::mock_initialize() {
    // check if there's connection to the display
    // clear
    // ready to display
}

void DisplayManager::print_message(const String& msg) {
    if (_mode == MOCK) {
        // how to print the msg param for the display
    }
    else {
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.println(msg);
        display.display();
    }
}
