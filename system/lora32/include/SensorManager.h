#ifndef SENSORMANAGER_h
#define SENSORMANAGER_H
#include <Arduino.h>
#include "../lib/config.h"
// #define EEPROM_HISTORY_START 0
#define HISTORY_SIZE 2 // change to 12 when the sleep funktion is tested

class SensorManager
{
private:
    uint8_t current_level;
    uint8_t water_level_history[HISTORY_SIZE] = { 0 };
    uint8_t reference_index;
    int16_t delta;
    float rate_of_change;
    // void save_history();
    // void load_history();
public:
    SensorManager();
    float get_water_level() const;
    float get_rate_of_change() const;
    void update(uint32_t elapsed_ms);
    void print_history() const; // just for debugging
};


#endif
