#include "../include/Manager.h"
#define LED_PIN 7

volatile bool flag = false;
volatile uint32_t sleep_counter = 0;
uint32_t target = 0;

Manager::Manager() : water_sensor(), battery(3600000UL), transmitter1(1), transmitter2(2), transmitter3(3), transmitter4(4)
{
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, HIGH);
}

#ifdef MOCK_MODE
void timer_callback(timer_callback_args_t *args) {
    ++sleep_counter;
    if (sleep_counter >= target) {
        flag = true;
    }
}

void Manager::config_sleep_timer() {
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

    uint32_t start = millis();
    uint32_t last_blink = start;
    bool led_state = false;
    while (!flag) {
        if (millis() - last_blink >= 1000) {
            led_state = !led_state;
            digitalWrite(LED_PIN, led_state ? HIGH : LOW);
            last_blink = millis();
        }
        delay(10);
        if (millis() - start > duration_ms + 1000) {
            break;
        }
    }
    sleep_timer.stop();
    sleep_timer.close();
    digitalWrite(LED_PIN, HIGH);
}

#endif



void Manager::cycle() {
    display.power_on();
    DisplayManager::show_loading_msg(display, "Waking up");
    static bool first_run = true;
    static uint32_t last_wake_time = millis();

    if (first_run) {
        Serial.println("Boot complete. Starting first measurement cycle");
        display.print_message("Boot complete");
        delay(1000);
        DisplayManager::show_loading_msg(display, "Start measuring", 1500);
        delay(1000);
    }
    uint32_t now = millis();
    uint32_t elapsed = now - last_wake_time;
    water_sensor.update(elapsed);
    last_wake_time = now;

    float level = water_sensor.get_water_level();
    float rate_of_change = water_sensor.get_rate_of_change();
    float percent = battery.get_battery();
    String display_msg = String(level) + "cm|Rate" + String(rate_of_change) + "%|Bat.:" + String(percent) + "%";
    Serial.println(display_msg);
    display.print_message(display_msg);
    delay(3000);
    SendResult sensor1 = transmitter1.send_data(percent, level, rate_of_change);
    //transmitter1.send_data(percent, level, rate_of_change);
    transmitter2.send_data(percent, level, rate_of_change);
    transmitter3.send_data(percent, level, rate_of_change);
    transmitter4.send_data(percent, level, rate_of_change);
    String tx_status;
    if (sensor1.success) {
        tx_status = "Success: " + String(sensor1.status_code);
    }
    else {
        tx_status = "Failed: " + String(sensor1.status_code);
    }
    Serial.println(tx_status);
    display.print_message(tx_status);
    delay(2000);
    if (first_run) {
        Serial.println("First run complete. Going to sleep...");
        DisplayManager::show_loading_msg(display, "Going to sleep");
        delay(1000);
        first_run = false;
    }
    else {
        Serial.println("Going to sleep...");
        display.print_message("Going to sleep...");
        delay(500);
        DisplayManager::show_loading_msg(display, "Going to sleep");
        delay(1000);
    }
#ifdef MOCK_MODE
    delay(50);
    display.power_off();
    // sleep_interval(300000UL); // 5 minutes
    sleep_interval(60000UL); //  1 minute
#endif
}
