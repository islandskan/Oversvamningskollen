#include "../include/SensorManager.h"

SensorManager::SensorManager() : rate_of_change(0.0) {
#if MOCK_MODE
    analogReadResolution(12);
    pinMode(A1, INPUT);
#else
    // scan I2C to check connection to the real water sensor
    // set the Grove Water Level Sensor

#endif
    load_history();
}

void SensorManager::update(uint32_t elapsed_ms) {
#if MOCK_MODE
    int raw_sensor_reading = analogRead(A1);
    state.current_level = map(raw_sensor_reading, 0, 4095, 0, 100);
#else
    // Grove Water Level Sensor Logic
#endif

    state.water_level_history[state.head_index] = state.current_level;
    state.head_index = (state.head_index + 1) % HISTORY_SIZE;
    if (state.count < HISTORY_SIZE) {
        ++state.count;
        Serial.println("Count: " + String(state.count));
    }

    if (elapsed_ms > 0 && state.count >= HISTORY_SIZE) {
        uint8_t oldest_index = (state.head_index) % HISTORY_SIZE;
        int16_t delta = static_cast<int16_t>(state.current_level) - static_cast<int16_t>(state.water_level_history[oldest_index]);
        rate_of_change = static_cast<float>(delta) / (elapsed_ms / 1000.0f);
    }
    else {
        rate_of_change = 0.0f;
    }

    if (state.last_saved_level != state.current_level) {
        persist();
    }

    // remove after debugging
    Serial.print("Current: "); Serial.println(state.current_level);
    Serial.print("Previous: "); Serial.println(state.water_level_history[(state.head_index) % HISTORY_SIZE]);
    Serial.print("Rate of Change: "); Serial.println(rate_of_change, 2);

    Serial.println("Queue snapshot: ");

    for (uint8_t i = 0; i < HISTORY_SIZE; ++i) {
        Serial.print(state.water_level_history[i]);
        Serial.print(" ");
    }
    Serial.println();
}


float SensorManager::get_water_level() const {
    return static_cast<float>(state.current_level);
}

float SensorManager::get_rate_of_change() const {
    return rate_of_change;
}

void SensorManager::save_history() {
    EEPROM.put(EEPROM_BASE_ADDRESS, state);
}

void SensorManager::persist() {
    state.last_saved_level = state.current_level;
    save_history();
}

void SensorManager::load_history() {
    EEPROM.get(EEPROM_BASE_ADDRESS, state);
    if (state.count > HISTORY_SIZE) {
        clear_history();
    }
}

void SensorManager::clear_history() {
    memset(&state, 0, sizeof(HistoryState));
    save_history();
}
