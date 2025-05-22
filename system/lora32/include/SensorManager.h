#ifndef SENSORMANAGER_h
#define SENSORMANAGER_H
#include "../lib/Mode.h"
#define EEPROM_HISTORY_START 0
#define HISTORY_SIZE 3
#define HISTORY_BYTES (HISTORY_SIZE * sizeof(int))

class SensorManager
{
private:
    const int threshold = 50; // just for now
    float rate_of_change;
    int current_level;
    Mode _mode;
    int water_level_history[HISTORY_SIZE];
    int history_index = 0;
    float delta;
    void save_history();
    void load_history();
public:
    SensorManager(Mode mode);
    float get_water_level();
    float get_rate_of_change();
    void update();
    void print_history(); // just for debugging
};


#endif
