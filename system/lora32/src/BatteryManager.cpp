#include "../include/BatteryManager.h"

BatteryManager::BatteryManager(bool mock) : mock_mode(mock) {}

float BatteryManager::read_voltage() {
    if (mock_mode) {
        // return random value within range
        return 80.0;
    }
    else {
        // read actual value from the analog pins
        // return actual value
    }
    return 0.0;
}
