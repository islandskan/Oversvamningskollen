#include "../include/SensorManager.h"

SensorManager::SensorManager() : rate_of_change(0.0), current_level(0), count(0) {
#if MOCK_MODE
    analogReadResolution(12);
    pinMode(A1, INPUT);
#else
    // scan I2C to check connection to the real water sensor
    // set the Grove Water Level Sensor
    EEPROM.begin();
#endif
    load_history();
}

void SensorManager::update(uint32_t elapsed_ms) {
#if MOCK_MODE
    int raw_sensor_reading = analogRead(A1);
    current_level = map(raw_sensor_reading, 0, 4095, 0, 100);
#else
    // Grove Water Level Sensor Logic
#endif

    for (uint8_t i = HISTORY_SIZE - 1; i > 0; --i) {
        water_level_history[i] = water_level_history[i - 1];
    }
    water_level_history[0] = current_level;

    if (count < HISTORY_SIZE) {
        ++count;
        Serial.print(count);
    }

    int address = EEPROM_BASE_ADDRESS;

    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        EEPROM.put(address, water_level_history[i]);
        address += sizeof(uint8_t);
    }

    EEPROM.put(address, count);

    if (elapsed_ms > 0 && count >= HISTORY_SIZE) {
        Serial.print("Delta");
        int16_t delta = static_cast<int16_t>(water_level_history[0]) - static_cast<int16_t>(water_level_history[HISTORY_SIZE - 1]);
        rate_of_change = static_cast<float>(delta) / (elapsed_ms / 1000.0f);
        Serial.print(delta);
    }
    else {
        rate_of_change = 0.0f;
    }

    save_history();

    // remove after debugging
    Serial.print("Current: "); Serial.println(current_level);
    Serial.print("Previous: "); Serial.println(water_level_history[HISTORY_SIZE - 1]);
    Serial.print("Rate of Change: "); Serial.println(rate_of_change, 2);

    Serial.println("Queue snapshot: ");

    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        Serial.print(water_level_history[i]);
        Serial.print(" ");
    }
    Serial.println();
}


float SensorManager::get_water_level() const {
    return static_cast<float>(current_level);
}

float SensorManager::get_rate_of_change() const {
    return rate_of_change;
}

void SensorManager::save_history() {
    int address = EEPROM_BASE_ADDRESS;
    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        EEPROM.put(address, water_level_history[i]);
        address += sizeof(uint8_t);
    }
}

void SensorManager::load_history() {
    int address = EEPROM_BASE_ADDRESS;
    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        EEPROM.get(address, water_level_history[i]);
        address += sizeof(uint8_t); // rewrite as a struct instead, going to brute force it at the moment
    }
    EEPROM.get(address, count);
}

void SensorManager::clear_history() {
    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        water_level_history[i] = 0;
    }

    int address = EEPROM_BASE_ADDRESS;
    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        EEPROM.put(address, static_cast<uint8_t>(0));
        address += sizeof(uint8_t);
    }
    EEPROM.put(address, static_cast<uint8_t>(0));
}
