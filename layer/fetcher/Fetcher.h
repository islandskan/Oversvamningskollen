#include <string>
#include <nlohmann/json.hpp>

#pragma once

using json = nlohmann::json;

struct TTN_Data {
    std::string deviceId;
    int receivedAt;

    json payload;
};

class Fetcher {
    public:
        Fetcher();
        std::vector<TTN_Data> fetch_ttn_storage();
    private:
        // Loosely defined, unsure which ones we actually need
        std::string url_;
        std::string appId_;
        std::string devId;
        std::string apiKey_;
};