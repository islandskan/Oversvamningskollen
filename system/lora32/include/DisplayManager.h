#ifndef DISPLAYMANAGER_H
#define DISPLAYMANAGER_H
#include "../lib/config.h"
#ifdef MOCK_MODE
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#else
#include <Wire.h>
#endif

class DisplayManager
{
private:
#ifdef MOCK_MODE
    Adafruit_SSD1306 display;
#endif
public:
    DisplayManager();
    void print_message(const String& msg);
};

#endif
