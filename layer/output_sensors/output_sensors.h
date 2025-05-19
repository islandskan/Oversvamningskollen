#pragma once

#include <string>
#include <vector>
#include <filesystem>
#include "../fetcher/Fetcher.h"

class OutputSensors {
    public:
        OutputSensors() {
            // Ensures a directory exists at the given path
            std::filesystem::create_directories(path_);
        }
        void output_sensors(std::vector<TTN_Data>& data);
    private:
        std::string path_ = "./output_dump/";
};