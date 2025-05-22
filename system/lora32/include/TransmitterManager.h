#ifndef TRANSMITTERMANAGER_H
#define TRANSMITTERMANAGER_H
#include "../lib/Mode.h"

class TransmitterManager
{
private:
    Mode _mode;
public:
    TransmitterManager(Mode mode);
    void begin();
    void transmit();
};

#endif
