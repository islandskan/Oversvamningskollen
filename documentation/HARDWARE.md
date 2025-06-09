<section align="center">
<h1>ARCHITECTURE</h1>
</section>

## Overview

### Description

### Modes
The embedded system is divided into two modes, Mock mode and Production mode. The modes are modelled so the main system logic and data flow are similar. The main key differences are listed below()

```MOCK_MODE```
Used if production hardware(see below at Hardware components) and/or LoRaWAN communication/tech stack aren't available. Can also be used when the objective is to test calculations and data transfer with mock data. 

```PRODUCTION_MODE```
Used with the real hardware and the LoRaWAN communication/tech stack. Used to test all of the real components and technologies together, as well as test the system in other environments(with water container or outside).

### Features

**Overall features(regardless of mode)**
- Water level readings (mocked or sensor)
- Power supply (mocked or LiPo battery)
- Calculating rate of change of water levels
- Calculating battery life in percentage 
- Converting and "packing" data into compact format
- Wireless communication of data
- Display readings and status
- Low power sleep mode between readings

**Mock Mode**
- Mock "water level readings" from potentiometer
- Mock battery calculations of remaining battery level (based on a approximation of 3.7V LiPo battery life)
- HTTP POST request to VPS over WiFi communication
- Simulating ESP32 built-in sleep mode with timers

**Production Mode**
- Real water level readings from water level sensor
- Real battery calculations of remaining battery level, based on voltage readings from 3.7V LiPo battery
- Sends data over 868MHz radio signal as uplink to LoRaWAN gateway
- Built-in sleep mode between readings

## Hardware components

**Mock mode**

**Mock mode**
- Arduino Uno R4 WiFi
- LCD 1602A 16x2 display
- 10KΩ potentiometer
- Red LED
- 1KΩ resistor
- 10KΩ resistor
- 110Ω resistor
- (Option 1)Breadboard power supply module
- (Option 1)9V battery connector with barrel plug
- (Option 1)9V battery
- (Option 2) USB micro - USB-C cable(Power supply and Serial communication)

**Production mode**

- TTGO T3 V1.6.1 LoRa32 board
- (Built-in) OLED SSD1306, 128x64 display
- (Built-in) SX1276 (868MHz) LoRa radio chip
- LoRa antenna, 2.0 dbi gain, SMA holder base
- 3.7V 3000mAh LiPo battery, JST PH 2pin connector
- JST PH 2pin - JST GH 2pin 1.25mm adapter cable
- Seeedstudio Water Level Sensor 10cm, I2C communication, Grove connector

## Software design

### Architecture
The software is structured into modular class components, in order to simplify unit tests and switching between the system's two modes. For instance, when the system is running in mock mode, the software will use the libraries, APIs, and logic for that mode. Key responsibilities are split between the following modules:

- **Sensor Interface**: Handles raw data (mocked or real sensor) and calculates data into cm and the rate of change between reading cycles
- **Battery Interface**: Handles (mocked or real) voltage readings and calculates the voltage into remaining percentage.
- **Communication Interface**: Manages communication protocol(WiFi or LoRa), convert sensor and battery data into 32-bit integer, establish connection(VPS or TTN), and transmits data(HTTP POST request or as a uplink message over 868 MHz radio signal)
- **Display Interface**: Displays data and status of system between sleep-wake-send-cycle
- **System Management**: Handles sleep-wake-read-send-cycle, manages the other objects (sensor, battery, display, and communication)

### Software structure
|----- include
	|--- BatteryManager.h
	|--- DisplayManager.h
	|--- Manager.h
	|--- SensorManager.h
	|--- TransmitterManager.h
|----- lib
	|--- config.h
	|--- transmit_config.example.h (remove ".example.")
|----- src
	|--- BatteryManager.cpp
	|--- DisplayManager.cpp
	|--- main.cpp
	|--- Manager.cpp
	|--- SensorManager.cpp
	|--- TransmitterManager.cpp
|----- test
	|--- battery_manager
		|--- test.cpp
	|--- sensor_manager
		|--- test.cpp
	|--- transmitter
		|--- test.cpp

### Key classes

```BatteryManager```
- Production mode: converts ADC readings (internal analog) when LiPo battery is connected into voltage
- Mock mode: Uses ```mock_voltage``` to simulate fully charged battery.  
- maps voltage (mock or real) to battery level as a percentage.
- Mock mode: simulates battery drain in over time.

```SensorManager```
- Mock mode: reads and maps raw analog input from potentiometer to a percentage based water level (to match the 10cm Water Level Sensor)
- Production mode: reads and maps input from Grove Water level sensor to a percentage based water level.
- stores water levels in a queue-like buffer
- when the buffer has 12 readings (5 min x 12 = 60 min), it starts to calculate the rate of change between the latest reading and the oldest reading (60 minutes apart).

```TransmitterManager```
- Mock mode: connects/reconnects to WiFi if disconnected
- Production mode: initilizes instance of LoRa object and tries to connects/reconnects over LoRa radio signal to closest LoRaWAN gateway.
- Encodes ```water_level```, ```rate_of_change```, and ```battery``` data into bit flags and packs them into a 32-bit integer for compact transmission.
- Mock mode: Serializes sensor id and the 32-bit integer into a JSON payload and sends payload to VPS using HTTP POST.

```DisplayManager```
- handles initialization, power control, message display.
- Mock mode: uses the LCD 1602A display, which uses digital pins.
- Production mode: uses the OLED SSD1306 and reads uses I2C(internal).
- ```show_loading_msg``` displays data readings, transmission status, and sleep/wake up message
- when system goes to sleep, display powers of to conserve power.

```Manager```
- intitializes and coordinates the other classes, ```SensorManager```, ```BatteryManager```, ```DisplayManager```, and four ```TransmitterManager```instances (just to test to the backend)
- Mock mode: controls sleep-wake up-read data intervals
- provides user feedback through the display and serial logging (if connected) during boot, data readings, transmissions, and before sleep.


### Other files

```main.cpp```
- initializes ```Manager``` as ```app```object
- run ```app.cycle``` inside main loop

```config.h```
- define directives of the system modes(```MOCK_MODE``` or ```PRODUCTION_MODE```)
- based on which directive is defined in the rest of program, different parts are compiled

```transmit_config.exemple.h```
- at the moment primarly used for WiFi connection and HTTP communication in mock mode
- create a separate ```transmit_config.h``` file in the same ```lib``` directory and copy the content from the ".example." file. Fill in your own credentials for server, SSID, and WiFi password.


### Simplified execution flow

System boot(first wake up)/Wake up 
	-> Sensor and battery read 
	-> convert data into bit flags and packed into 32-bit integer(based on defined bit flag map) 
	-> establish wireless connection 
	-> send sensor id and 32-bit integers over wireless connection 
	-> Display data and transmission status 
	-> Sleep for 5 minutes 

