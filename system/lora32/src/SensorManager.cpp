#include "../include/SensorManager.h"
// #include <EEPROM.h>

SensorManager::SensorManager() : rate_of_change(0.0), current_level(0), delta(0.0), reference_index(0) {
#if MOCK_MODE
    analogReadResolution(12);
    pinMode(A1, INPUT);
#else
    // scan I2C to check connection to the real water sensor
    // set the Grove Water Level Sensor
#endif
// load_history();
}


float SensorManager::get_water_level() const {
    return static_cast<float>(current_level);
}

float SensorManager::get_rate_of_change() const {
    return rate_of_change;
}

void SensorManager::update(uint32_t elapsed_ms) {
#if MOCK_MODE
    int raw_sensor_reading = analogRead(A1);
    current_level = map(raw_sensor_reading, 0, 4095, 0, 100);
#else
    // Grove Water Level Sensor Logic
#endif

    water_level_history[reference_index] = current_level;
    uint8_t new_index = reference_index;
    uint8_t old_index = (reference_index + 1) % HISTORY_SIZE;
    if (water_level_history[old_index] < 0.01f) {
        rate_of_change = 0.0f;
    }
    else {
        // this will give us the % change every 5 minute
        delta = static_cast<int16_t>(water_level_history[new_index]) - static_cast<int16_t>(water_level_history[old_index]);
        rate_of_change = static_cast<float>(delta) / (elapsed_ms / 1000.0f);
    }

    Serial.print("Previous: "); Serial.println(water_level_history[old_index]);
    Serial.print("Current: "); Serial.println(current_level);
    Serial.print("Rate of Change: "); Serial.println(rate_of_change);

    reference_index = (reference_index + 1) % HISTORY_SIZE;
}

/*void SensorManager::save_history() {
    if (_mode == PROD) EEPROM.begin();
    for (int i = 0; i < HISTORY_SIZE; ++i) {
        int address = EEPROM_HISTORY_START + i * sizeof(int);
        EEPROM.put(address, water_level_history[i]);
    }
    EEPROM.put(EEPROM_HISTORY_START + HISTORY_BYTES, history_index);
}

void SensorManager::load_history() {
    if (_mode == PROD) EEPROM.begin();
    for (int i = 0; i < HISTORY_SIZE; ++i) {
        int address = EEPROM_HISTORY_START + i * sizeof(int);
        EEPROM.get(address, water_level_history[i]);

    EEPROM.get(EEPROM_HISTORY_START + HISTORY_BYTES, history_index);
    Serial.println("Water level history loaded from EEPROM: ");
    print_history();
}*/

void SensorManager::print_history() const {
    Serial.print("History: ");
    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        uint8_t index = (reference_index - 1 - i + HISTORY_SIZE) % HISTORY_SIZE;
        Serial.print(water_level_history[index]);
        Serial.print(" ");
    }
    Serial.println();
}
