#include "../include/SensorManager.h"
#include <Arduino.h>
#include <EEPROM.h>
// #define EEPROM_HISTORY_START 0
// #define HISTORY_SIZE 3
// #define HISTORY_BYTES (HISTORY_SIZE * sizeof(int))

SensorManager::SensorManager(Mode mode) : _mode(mode), rate_of_change(0.0), current_level(0), delta(0.0) {
    if (_mode == MOCK) {
        analogReadResolution(12);
        pinMode(A1, INPUT);
    }
    else {
        // scan I2C to check connection to the real water sensor
        // set the Grove Water Level Sensor
        // read from Grove Water Level Sensor
    }
}


float SensorManager::get_water_level() {
    return current_level;
}

float SensorManager::get_rate_of_change() {
    return rate_of_change;
}

void SensorManager::update() {
    int raw_sensor_reading = analogRead(A1);
    current_level = map(raw_sensor_reading, 0, 4095, 0, 100);
    if (current_level > threshold) {
        water_level_history[history_index] = current_level;
        history_index = (history_index + 1) % HISTORY_SIZE;
        save_history();
        int new_index = (history_index - 1 + HISTORY_SIZE) % HISTORY_SIZE;
        int previous_index = (history_index - 2 + HISTORY_SIZE) % HISTORY_SIZE;
        if (water_level_history[previous_index] != 0) {
            delta = water_level_history[new_index] - water_level_history[previous_index];
            rate_of_change = (delta / (float)water_level_history[previous_index]) * 100.0;
        }
        else {
            rate_of_change = 0.0;
        }
    }
    else {
        rate_of_change = 0.0;
    }

}

void SensorManager::save_history() {
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
    }
    EEPROM.get(EEPROM_HISTORY_START + HISTORY_BYTES, history_index);
    Serial.println("Water level history loaded from EEPROM: ");
    print_history();
}

void SensorManager::print_history() {
    Serial.print("History: ");
    for (byte i = 0; i < HISTORY_SIZE; ++i) {
        int index = (history_index - 1 - i + HISTORY_SIZE) % HISTORY_SIZE;
        Serial.print(water_level_history[index]);
        Serial.print(" ");
    }
    Serial.println();
}
