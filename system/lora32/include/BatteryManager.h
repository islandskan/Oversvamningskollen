#ifndef BATTERYMANAGER_H
#define BATTERYMANAGER_H
#include <Arduino.h>
#include "../lib/config.h"
class BatteryManager
{
private:
    float voltage;
    float mock_voltage;
    float battery_percentage;
    uint8_t vbat_pin;
    unsigned long mock_time;
    unsigned long last_update_time;
    const float battery_voltage_ref = 4.2;
    const float minimal_voltage = 3.27;
    float read_voltage();
    float voltage_to_percentage(float voltage);

public:
    BatteryManager(unsigned long test_time = 3600000UL);
    float get_voltage();
    float get_battery();
};



#endif
