#ifndef SENSORMANAGER_h
#define SENSORMANAGER_H
#include <Arduino.h>
#include <EEPROM.h>
#include "../lib/config.h"

struct __attribute__((packed)) HistoryState {
    uint8_t water_level_history[12];
    uint8_t head_index;
    uint8_t current_level;
    uint8_t count;
    uint8_t last_saved_level;
};

class SensorManager
{
private:
    static const uint8_t HISTORY_SIZE = 12;
    static const int EEPROM_BASE_ADDRESS = 0;
    HistoryState state;
    float rate_of_change;
    void save_history();
    void load_history();
    void persist();
public:
    SensorManager();
    float get_water_level() const;
    float get_rate_of_change() const;
    void update(uint32_t elapsed_ms);
    void clear_history();
};


#endif
