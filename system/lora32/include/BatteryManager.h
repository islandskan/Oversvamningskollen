#ifndef BATTERYMANAGER_H
#define BATTERYMANAGER_H
class BatteryManager
{
private:
    bool mock_mode;
public:
    BatteryManager(bool mock = true);
    float read_voltage();
};



#endif
