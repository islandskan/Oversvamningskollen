#include "../include/DisplayManager.h"
#define RS 12
#define EN 11
#define D4 5
#define D5 4
#define D6 3
#define D7 2
#define BACKLIGHT_PIN 8

#if MOCK_MODE
DisplayManager::DisplayManager() : lcd_display(RS, EN, D4, D5, D6, D7), last_message(""), is_initialized(false) {
    lcd_display.begin(16, 2);
    pinMode(BACKLIGHT_PIN, OUTPUT);
    digitalWrite(BACKLIGHT_PIN, HIGH);
    is_initialized = true;
    lcd_display.noCursor();
    lcd_display.noBlink();
    lcd_display.clear();
}
#else
DisplayManager::DisplayManager() : oled_display(128, 64, &Wire, -1) {
    // to-do: check if there's connection to the display through I2C
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println("SSD1306 allocation failed");
    }
    oled_display.clearDisplay();
    oled_display.display();
    is_initialized = true;
}
#endif

void DisplayManager::power_off() {
    digitalWrite(BACKLIGHT_PIN, LOW);
    lcd_display.noDisplay();
}

void DisplayManager::power_on() {
    digitalWrite(BACKLIGHT_PIN, HIGH);
    if (!is_initialized) {
        lcd_display.begin(16, 2);
        lcd_display.display();
        lcd_display.noCursor();
        lcd_display.noBlink();
        is_initialized = true;
        lcd_display.clear();
        lcd_display.setCursor(0, 0);
        lcd_display.print(last_message.substring(0, 16));
        if (last_message.length() > 16) {
            lcd_display.setCursor(0, 1);
            lcd_display.print(last_message.substring(16, 32));
        }
    }
    lcd_display.display();
}

void DisplayManager::show_loading_msg(DisplayManager & display, const String & base_msg, uint32_t duration_ms, uint32_t dots_delay) {
    String dots = "";
    uint32_t wake_up = millis();
    while (millis() - wake_up < duration_ms) {
        dots += ".";
        if (dots.length() > 3) {
            dots = "";
        }
        display.print_message(base_msg + dots);
        delay(dots_delay);
    }
}

void DisplayManager::print_message(const String & msg) {
#if MOCK_MODE
    power_on();
    if (msg == last_message) {
        return;
    }
    last_message = msg;
    lcd_display.clear();
    lcd_display.setCursor(0, 0);
    if (msg.length() > 16) {
        lcd_display.print(msg.substring(0, 16));
        lcd_display.setCursor(0, 1);
        lcd_display.print(msg.substring(16, 32));
    }
    else {
        lcd_display.print(msg);
    }
#else
    if (msg == last_message) {
        return;
    }
    last_message = msg;
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println(msg);
    display.display();
#endif
}
