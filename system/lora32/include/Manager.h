#ifndef MANAGER_H
#define MANAGER_H

#include "../include/BatteryManager.h"
#include "../include/SensorManager.h"
#include "../include/TransmitterManager.h"
// #include "../include/DisplayManager.h"
#include "../lib/Mode.h"

class Manager
{
private:
    Mode _mode;
    SensorManager water_sensor;
    BatteryManager battery;
    TransmitterManager transmitter;
    // DisplayManager display;
    void sleep_intervall(unsigned long duration_ms);
public:
    Manager(Mode mode);
    void cycle();
};



#endif
