#ifndef SENSORMANAGER_h
#define SENSORMANAGER_H

class SensorManager
{
private:
    // treshold for water levels?
    // latest read water level to calculate changes
    // previous read water level to calculate changes
    // treshold for change of rate?
    bool mock_mode;
public:
    SensorManager(bool mock = true);
    // check the data type/range
    int read_water_level();
    // check the data type/range
    int get_rate_of_change() const;
};


#endif
