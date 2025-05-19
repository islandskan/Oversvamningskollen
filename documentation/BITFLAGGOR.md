# Bitflaggor: Tabell

Sensordata som skickas till backend:

-   Data packet på 32-bitar(datatyp: unint32_t)
-   Backend läser datan som en integer
-   Integern är summan av bitflaggornas nummerrepresentation av deras positionsvärde

    <!-- Lägg in exempel på vad ett mottaget integervärde ger för data -->

## Reserverade, interna flaggor

Sätts inte av sensorn, används för att felmarkera om senordatan har blivit fel

<!-- Fyra reserverade bits -->

| Binärt värde | Decimalt värde | Namn på bitflagga | Status             |
| ------------ | -------------- | ----------------- | ------------------ |
| 10^28        | 268435456      | INTERNAL_FLAG_01  | reserverad flag 01 |
| 10^29        | 536870912      | INTERNAL_FLAG_02  | reserverad flag 02 |
| 10^30        | 1073741824     | INTERNAL_FLAG_03  | reserverad flag 03 |
| 10^31        | 2147483648     | INTERNAL_FLAG_04  | reserverad flag 04 |

<!-- Utrymme för att lägga till fler flaggor mellan 10^12 - 10^27 längre fram -->

## Varning

| Binärt värde | Decimalt värde | Namn på bitflagga     | Status                                          |
| ------------ | -------------- | --------------------- | ----------------------------------------------- |
| 10^3         | 8              | LOST_COMMUNICATION    | {sensor_id saknas = sensor data saknas}         |
| 10^4         | 16             | SENSOR_FAILURE        | {sensor_value} == {invalid_sensor_value}        |
| 10^5         | 32             | THRESHOLD_ABOVE_10    | THRESHOLD_ABOVE >= 10.0                         |
| 10^6         | 64             | THRESHOLD_ABOVE_20    | THRESHOLD_ABOVE >= 20.0                         |
| 10^7         | 128            | THRESHOLD_ABOVE_30    | THRESHOLD_ABOVE >= 30.0                         |
| 10^8         | 256            | THRESHOLD_ABOVE_40    | THRESHOLD_ABOVE >= 40.0                         |
| 10^9         | 512            | THRESHOLD_ABOVE_50    | THRESHOLD_ABOVE >= 50.0                         |
| 10^10        | 1024           | THRESHOLD_ABOVE_60    | THRESHOLD_ABOVE >= 60.0                         |
| 10^11        | 2048           | THRESHOLD_ABOVE_70    | THRESHOLD_ABOVE >= 70.0                         |
| 10^12        | 4096           | THRESHOLD_ABOVE_80    | THRESHOLD_ABOVE >= 80.0                         |
| 10^13        | 8192           | THRESHOLD_ABOVE_90    | THRESHOLD_ABOVE >= 90.0                         |
| 10^14        | 16384          | RATE_OF_CHANGE_SMALL  | RATE_OF_CHANGE_SMALL >= {small_time_interval}   |
| 10^15        | 32768          | RATE_OF_CHANGE_MEDIUM | RATE_OF_CHANGE_MEDIUM >= {medium_time_interval} |
| 10^16        | 65536          | RATE_OF_CHANGE_LARGE  | RATE_OF_CHANGE_LARGE >= {large_time_interval}   |

## Batteri

| Binärt värde | Decimalt värde | Namn på bitflagga | Status                 |
| ------------ | -------------- | ----------------- | ---------------------- |
| 10^0         | 1              | BATTERY_FULL      | {battery_level} > 80.0 |
| 10^1         | 2              | BATTERY_MEDIUM    | {battery_level} > 20.0 |
| 10^2         | 4              | BATTERY_LOW       | {battery_level} < 20.0 |
