#include "../include/Manager.h"

volatile bool flag = false;
volatile uint32_t sleep_counter = 0;
uint32_t target = 0;

Manager::Manager() : water_sensor(), battery(), transmitter()
{
}

#ifdef MOCK_MODE
void timer_callback(timer_callback_args_t *args) {
    ++sleep_counter;
    if (sleep_counter >= target) {
        flag = true;
    }
}

void Manager::config_sleep_timer() {
    // float freq_hz = 1.0f / (duration_ms / 1000.0f);
    float freq_hz = 1.0f;
    uint8_t type;
    // generally, fsptimer can't really handle low frequenzies(not without configurations), so atm just clamp the value if it's to low
    int channel = FspTimer::get_available_timer(type);
    if (channel == -1) {
        Serial.println("no available timer");
        return;
    }
    FspTimer::force_use_of_pwm_reserved_timer();
    sleep_timer.begin(TIMER_MODE_ONE_SHOT, type, channel, freq_hz, 0.0f, timer_callback, nullptr);

    if (!sleep_timer.setup_overflow_irq()) {
        Serial.println("couldn't set up interrupts");
        return;
    }
    if (!sleep_timer.open()) {
        Serial.println("couldn't open the timer");
        return;
    }
    if (!sleep_timer.start()) {
        Serial.println("couldn't start the timer");
        return;
    }
}

void Manager::sleep_interval(uint32_t duration_ms) {
    sleep_counter = 0;
    flag = false;
    target = duration_ms / 1000;
    config_sleep_timer();

    unsigned long start = millis();
    while (!flag) {
        delay(10);
        if (millis() - start > duration_ms + 1000) {
            break;
        }
    }
    sleep_timer.stop();
    sleep_timer.close();
    Serial.println("Woke up from sleep");
}

#endif


void Manager::cycle() {
    static uint32_t last_wake_time = millis();
    uint32_t lap_time = millis() - last_wake_time;
    last_wake_time = millis();
    water_sensor.update(lap_time);
    float level = water_sensor.get_water_level();
    float rate_of_change = water_sensor.get_rate_of_change();
    float percent = battery.get_battery();
    transmitter.send(level, rate_of_change, percent);
    // Log to display
    sleep_interval(60000UL); // 1 minute
    // sleep_interval(120000UL); // 2 minutes
    // sleep_interval(300000UL); // 5 minutes
}
