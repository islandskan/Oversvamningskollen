#ifndef DISPLAYMANAGER_H
#define DISPLAYMANAGER_H
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>
#include "../lib/Mode.h"

class DisplayManager
{
private:
    Adafruit_SSD1306 display;
    Mode _mode;
    void initialize();
    void mock_initialize();
public:
    DisplayManager(Mode mode);
    void print_message(const String& msg);
};

#endif
