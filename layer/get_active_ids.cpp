#include <vector>
#include <string>
#include <fstream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

json get_active_ids_json() {
    std::string path("active_ids.json"); // Static path, change if needed
    std::ifstream file(path);

    json active_ids_json;
    file >> active_ids_json;

    return active_ids_json;
}

std::vector<std::string> get_active_ids_array() {
    json active_ids_json = get_active_ids_json();

    if (!active_ids_json.is_array()) {
        throw std::runtime_error("JSON file must contain an array of IDs");
    }

    std::vector<std::string> active_ids;
    for (const auto& id : active_ids_json) {
        if (id.is_string()) {
            active_ids.push_back(id.get<std::string>());
        }
    }

    return active_ids;
}

std::map<std::string, std::string> get_active_ids_map() {
    json active_ids_json = get_active_ids_json();

    // Actual storage is array, so make sure it's valid
    if (!active_ids_json.is_array()) {
        throw std::runtime_error("JSON file must contain an array of IDs");
    }

    std::map<std::string, std::string> active_ids_map;
    for (const std::string& id : active_ids_json) {
        active_ids_map[id] = id;
    }

    return active_ids_map;
}