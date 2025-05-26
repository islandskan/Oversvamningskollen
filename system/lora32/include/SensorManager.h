#ifndef SENSORMANAGER_h
#define SENSORMANAGER_H
#include <Arduino.h>
#include <EEPROM.h>
#include "../lib/config.h"

class SensorManager
{
private:
    static const uint8_t HISTORY_SIZE = 12;
    static const int EEPROM_BASE_ADDRESS = 0;
    uint8_t water_level_history[HISTORY_SIZE];
    uint8_t current_level;
    float rate_of_change;
    uint8_t count;
    void save_history();
    void load_history();
public:
    SensorManager();
    float get_water_level() const;
    float get_rate_of_change() const;
    void update(uint32_t elapsed_ms);
    void clear_history();
};


#endif
