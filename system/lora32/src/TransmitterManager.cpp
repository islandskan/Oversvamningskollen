#include "../include/TransmitterManager.h"
#include "../lib/transmit_config.h"

TransmitterManager::TransmitterManager(const char* id) : sensor_id(id)
{
}

void TransmitterManager::send_data(float battery, float water_level, float rate) {
#ifdef MOCK_MODE
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Disconnected. Attempting to reconnect...");
        WiFi.begin(SSID, PASSWORD);
        uint32_t start_attempt = millis();
        while (WiFi.status() != WL_CONNECTED && millis() - start_attempt < 10000 /*can be whatever time we want*/) {
            delay(500);
            Serial.print(".");
        }
        if (WiFi.status() != WL_CONNECTED) {
            Serial.println("Failed to reconnect to WiFi. Skipping transmission.");
            return;
        }

        Serial.println("WiFi reconnected.");
    }
#endif
    uint32_t flags = convert_to_flags(battery, water_level, rate);

    JsonDocument doc;
    doc["id"] = sensor_id;
    doc["value"] = flags;

    String payload;
    if (serializeJson(doc, payload) == 0) {
        Serial.println("Failed to serialize JSON. Abort transmission.");
        return;
    }

    // String serial_transmission = "[MOCK TRANSMISSION]\nServer: " + String(SERVER_NAME) + "\nPort: " + String(PORT) + "\nPath: " + String(URL_PATH) + "\nAuthorization: Bearer " + String(API_KEY) + "\nPayload: " + String(payload) + "[END OF MOCK TRANSMISSION]";
    // Serial.println(serial_transmission);
#ifdef MOCK_MODE
    HttpClient http_client(wifi_client, SERVER_NAME, PORT);
    const int8_t max_attempts = 3; // we can pick any other number of retries
    bool success = false;
    for (int8_t attempt = 1; attempt <= max_attempts && !success; ++attempt) {
        http_client.beginRequest();
        http_client.post(URL_PATH);
        http_client.sendHeader("Content-Type", "application/json");
        http_client.sendHeader("Authorization", "Bearer " + String(API_KEY));
        http_client.sendHeader("Content-Length", payload.length());
        http_client.beginBody();
        http_client.print(payload);
        http_client.endRequest();

        int status_code = http_client.responseStatusCode();
        String response = http_client.responseBody();

        if (status_code >= 200 && status_code < 300) {
            Serial.println("Success. Status: " + String(status_code));
            Serial.println("Response: " + String(response));
            success = true;
        }
        else {
            Serial.println("HTTP Error. Status: " + String(status_code));
            Serial.println("Response: " + String(response));
            delay(1000);
        }
    }

    if (!success) {
        Serial.println("Failed to transmit data after " + String(max_attempts) + ".");
    }

#endif

}

uint32_t TransmitterManager::convert_to_flags(float battery, float water_level, float rate) {
    uint32_t flags = 0;

    if (battery >= 80.0f) {
        flags |= BATTERY_FULL;
    }
    else if (battery >= 20.0f) {
        flags |= BATTERY_MEDIUM;
    }
    else {
        flags |= BATTERY_LOW;
    }

    if (water_level > 90.0f) {
        flags |= THRESHOLD_ABOVE_90;
    }
    else if (water_level > 80.0) {
        flags |= THRESHOLD_ABOVE_80;
    }
    else if (water_level > 70.0) {
        flags |= THRESHOLD_ABOVE_70;
    }
    else if (water_level > 60.0) {
        flags |= THRESHOLD_ABOVE_60;
    }
    else if (water_level > 50.0) {
        flags |= THRESHOLD_ABOVE_50;
    }
    else if (water_level > 40.0) {
        flags |= THRESHOLD_ABOVE_40;
    }
    else if (water_level > 30.0) {
        flags |= THRESHOLD_ABOVE_30;
    }
    else if (water_level > 20.0) {
        flags |= THRESHOLD_ABOVE_20;
    }
    else if (water_level > 10.0) {
        flags |= THRESHOLD_ABOVE_10;
    }

    if (rate > 12.0f) {
        flags |= RATE_OF_CHANGE_LARGE;
    }
    else if (rate > 7.0f) {
        flags |= RATE_OF_CHANGE_MEDIUM;
    }
    else if (rate > 2.0f) {
        flags |= RATE_OF_CHANGE_SMALL;
    }
    Serial.println(flags, BIN);
    return flags;
}
