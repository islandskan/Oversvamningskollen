#include "../include/DisplayManager.h"

// check how to init the conditionally compiled members
DisplayManager::DisplayManager() {
#if MOCK_MODE
    // using an other oled display
    // check if there's connection to the display
    // clear
    // ready to display
#else
    // display(128, 64, &Wire, -1);
    //    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    //Serial.println(F("SSD1306 allocation failed"));
    //for (;;);
//}
    //display.clearDisplay();
    //display.display();
#endif
}

void DisplayManager::print_message(const String& msg) {
#if MOCK_MODE
    // how to print the msg param for the display
#else
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println(msg);
    display.display();
#endif
}
