#include "../include/DisplayManager.h"

DisplayManager::DisplayManager() : display(128, 64, &Wire, -1) {}

void DisplayManager::initialize() {
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("SSD1306 allocation failed"));
        for (;;);
    }
    display.clearDisplay();
    display.display();
}

void DisplayManager::print_message(const String& msg) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println(msg);
    display.display();
}
