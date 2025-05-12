#ifndef DISPLAYMANAGER_H
#define DISPLAYMANAGER_H
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


class DisplayManager
{
private:
    Adafruit_SSD1306 display;
public:
    DisplayManager();
    void initialize();
    void print_message(const String& msg);
};

#endif
