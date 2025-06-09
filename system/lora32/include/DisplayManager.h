#ifndef DISPLAYMANAGER_H
#define DISPLAYMANAGER_H
#include "../lib/config.h"
#include <Arduino.h>

#ifdef MOCK_MODE
#include <LiquidCrystal.h>
#else
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#endif

class DisplayManager
{
private:
    String last_message;
    bool is_initialized = false;
#ifdef MOCK_MODE
    LiquidCrystal lcd_display;
#else
    Adafruit_SSD1306 oled_display;
#endif
public:
    DisplayManager();
    void print_message(const String& msg);
    void power_off();
    void power_on();
    static void show_loading_msg(DisplayManager& display, const String& base_msg, uint32_t duration_ms = 3500, uint32_t dots_delay = 500);
};

#endif
