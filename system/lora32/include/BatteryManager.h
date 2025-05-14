#ifndef BATTERYMANAGER_H
#define BATTERYMANAGER_H
#include <Arduino.h>
class BatteryManager
{
private:
    bool mock_mode;
    float voltage;
    uint8_t vbat_pin;
    float read_voltage();
    float voltage_to_percentage(float voltage); // this return an int instead

public:
    BatteryManager(bool mock = true);
    float get_voltage();
    float get_battery(); // I think we could return an int instead
};



#endif
