#ifndef MANAGER_H
#define MANAGER_H
#include "../include/BatteryManager.h"
#include "../include/SensorManager.h"
#include "../include/TransmitterManager.h"
#include "../include/DisplayManager.h"
#include "../lib/config.h"
#include "../lib/transmit_config.h"
#ifdef MOCK_MODE
#include <FspTimer.h>
#endif

class Manager
{
private:
    SensorManager water_sensor;
    BatteryManager battery;
    TransmitterManager transmitter1;
    TransmitterManager transmitter2;
    TransmitterManager transmitter3;
    TransmitterManager transmitter4;
    DisplayManager display;
#ifdef MOCK_MODE
    FspTimer sleep_timer;
#endif
public:
    Manager();
    void cycle();
#ifdef MOCK_MODE
    void config_sleep_timer();
    void sleep_interval(uint32_t duration_ms);
#endif
};

#endif
