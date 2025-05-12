#include "../include/SensorManager.h"
SensorManager::SensorManager(bool mock) : mock_mode(mock), /*variable member for the stored water levels?*/{}

int SensorManager::read_level() {
    /*
    latest_level = mock_mode ? random/generate values for the water level : analog reading from Analog pin
    return latest_level
    */

}
int SensorManager::get_rate_of_change() const {
    /*latest_level*/
}
