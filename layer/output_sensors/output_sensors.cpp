#include <iostream>
#include "output_sensors.h"
#include <nlohmann/json.hpp>
#include <ctime>
#include <fstream>

void OutputSensors::output_sensors(std::vector<TTN_Data>& data) {
    json output;

    for (const TTN_Data& data : data) {
        output[data.deviceId] = data.payload["value"];
        std::cout << "Outputting " << data.deviceId << " with value " << data.payload["value"] << std::endl;
    }

    std::string output_path = path_ + std::to_string(std::time(0)) + ".json";
    std::ofstream output_file(output_path);
    output_file << output.dump(-1);
    output_file.close();
}