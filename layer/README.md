# Information

This layer fetches the latest from TTN storage, processes the data and saves it to a JSON file.

## Active IDs

Sensor IDs are manually stored in active_ids.json since there is no API to fetch from the backend database. It is fetched every time we process a batch of sensors. No need to restart the application to fetch new IDs.
