# Test checklist: Water sensor

---

### Sensor under test:

-   [ ] Elegoo water level sensor(test)
-   [ ] Grove water level sensor (final)

### Test Environmental

-   [ ] Dry
-   [ ] Partial full
-   [ ] Full
-   [ ] Splash
-   [ ] Droplet
-   [ ] Temperature variation

---

### 1. Basic functionality

| Test case ID | Description                                             | Done? |
| ------------ | ------------------------------------------------------- | ----- |
| TC1.1        | Dry sensor should read 0                                | [ ]   |
| TC1.2        | -20% water below treshold read low level                | [ ]   |
| TC1.3        | water level at treshold should read medium/normal level | [ ]   |
| TC1.4        | 20% above treshold should read high level               | [ ]   |
| TC1.5        | 40% above treshold should read very high level          | [ ]   |
| TC1.6        | 50% or more above treshold should read DANGER           | [ ]   |

---

### 2. Treshold

| Test case ID | Description                                                     | Done? |
| ------------ | --------------------------------------------------------------- | ----- |
| TC2.1        | Reading below, at or + 5% above treshold does not trigger alert | [ ]   |
| TC2.2        | Reading above treshold triggers alert                           | [ ]   |
| TC2.3        | Falling back below threshold disables alert                     | [ ]   |

---

### 3. Rate of Change

| Test case ID | Description                                                                     | Done? |
| ------------ | ------------------------------------------------------------------------------- | ----- |
| TC3.1        | Detect linear increase over time(increase 10% every 10 sec) (slow, steady rise) | [ ]   |
| TC3.2        | Detect rapid surge and rising rate (sudden 40% rise in 10 sec)                  | [ ]   |
| TC3.3        | Detect linear trend (constant 10% rise every 10 sec over a long time)           | [ ]   |

---

### 4. Splash/noise resilience

| Test case ID | Description                                                                     | Done? |
| ------------ | ------------------------------------------------------------------------------- | ----- |
| TC4.1        | Water droplet on dry sensor shouldn't trigger reading                           | [ ]   |
| TC4.2        | Splash below treshold shouldn't affect reading                                  | [ ]   |
| TC4.3        | Mist on top segment of sensor shouldn't affect reading                          | [ ]   |
| TC4.4        | ravity pulling droplets down the conductive tracks shouldn't affect the reading | [ ]   |

---

### 5. Environmental variations

| Test case ID | Description                                         | Done? |
| ------------ | --------------------------------------------------- | ----- |
| TC5.1        | Sensor remains accurate with changing temperature   | [ ]   |
| TC5.2        | Sensor retains accuracy across different containers | [ ]   |

---
