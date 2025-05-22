#include "../include/TransmitterManager.h"

TransmitterManager::TransmitterManager(Mode mode) : _mode(mode)
{
}

void TransmitterManager::begin()
{
    if (_mode == PROD) {
        // lora
    }
    else {
        // Serial or Wifi
    }
}

void TransmitterManager::transmit(/*params*/) {
    if (_mode == PROD) {
        // LoRa packet sending
    }
    else {
        // Serial or Wifi
    }
}
