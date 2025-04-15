# Unit test check list

Last update: 2025/04/15

Author: islandskan(Sigridur)

## Test categories

### Water sensor

    1. Basic functionality
    2. Threshold detection
    3. Rate of change
    4. Noise/splash interference
    5. Environmental variation

### LoRa Sensor-to-Sensor Communication

    1. Transmission from Remote sensor to Head sensor
    2. Error handling
    3. Data validation

### Backend communication (Head sensor to backend server)

    1. _will add_

### Power

    1. Basic functionality
    2. Consistent behaviour under battery voltage variantions

### Logging(For testing and debugging)

    1. Remote sensor logs readings and hardware status
    2. Head sensor logs received transmissed data and acknowledgement from transmission
    3. Server logs messages and response status sent to backend
