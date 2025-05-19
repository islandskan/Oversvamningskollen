#include <iostream>
#include <vector>
#include <string>
#include "fetcher/Fetcher.h"
#include "get_active_ids.h"
#include <chrono>
#include <thread>

void application_loop();

int main() {
    std::cout << "Starting application" << std::endl;

    std::cout << "Test-fetching active IDs" << std::endl;
    std::vector<std::string> active_ids = get_active_ids_array();
    for (const std::string& id : active_ids) {
        std::cout << id << std::endl;
    }

    std::cout << "Starting application loop" << std::endl;
    application_loop();

    return 0;
}

void application_loop() {
    Fetcher fetcher;

    int loop_interval = 3; // Seconds

    while (1) {
        std::cout << "Fetching active IDs" << std::endl;
        std::vector<TTN_Data> sensor_data = fetcher.fetch_ttn_storage();

        std::map<std::string, std::string> active_ids_map = get_active_ids_map(); // Lookup

        for (const TTN_Data& data : sensor_data) {
            std::cout << "Device ID: " << data.deviceId << std::endl;
            std::cout << "Payload: " << data.payload << std::endl;

            // Additionally check timestamp to invalidate old data

            // If we have stored the device id, remove it from the map so that we can track if any data is missing
            if (active_ids_map.count(data.deviceId) > 0) {
                active_ids_map.erase(data.deviceId);
            } else {
                std::cout << "Device ID not found in active IDs" << std::endl;
            }
        }

        // If there are any active IDs that were not processed, we need to warn that there is missing data
        if (!active_ids_map.empty()) {
            std::cout << "Active IDs not processed:" << std::endl;

            for (const auto& id : active_ids_map) {
                std::cout << id.first << std::endl;
            }
        }

        std::this_thread::sleep_for(std::chrono::seconds(loop_interval));
    }
}