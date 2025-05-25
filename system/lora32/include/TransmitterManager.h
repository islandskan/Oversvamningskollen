#ifndef TRANSMITTERMANAGER_H
#define TRANSMITTERMANAGER_H
#include "../lib/config.h"
// include utility function to encode the values into bit flags?
#ifdef MOCK_MODE
// includes for Serial, Wifi, HTTP etc
#else
    // includes for LoRaWAN
#include <RadioLib.h>
#endif

class TransmitterManager
{
private:

public:
    TransmitterManager();
    void begin();
    void send(float level, float rate, float battery);

};

#endif
