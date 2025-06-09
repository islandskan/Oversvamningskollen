#include "Fetcher.h"
#include <iostream>
#include "../get_active_ids.h"
#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

// Fetch the latest from the TTN Storage API
Fetcher::Fetcher() {};

// Dummy process for now until we use the real API
std::vector<TTN_Data> Fetcher::fetch_ttn_storage() {

    std::vector<std::string> ids = get_active_ids_array();
    std::vector<TTN_Data> sensor_data;

    for (const std::string& id : ids) {
        TTN_Data data;
        data.deviceId = id;
        data.receivedAt = 1747644949;
        data.payload = json::parse(R"({"value": 7})"); // The flags we receive, actual data may be different

        sensor_data.push_back(data);
    }

    return sensor_data;
}