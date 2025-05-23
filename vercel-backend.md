# Vercel Backend API Documentation

This document provides information about the Vercel-deployed backend API for the FloodCast application.

## Base URL

```
https://oversvamningskollen.vercel.app
```

## Available Endpoints

### Sensors

#### Get All Sensors
- **URL**: `/api/sensors`
- **Method**: `GET`
- **Response**: 
  ```json
  {
    "message": "Hämtar alla sensorer",
    "sensors": [
      {
        "id": 1,
        "installation_date": "2024-12-01T09:00:00.000Z",
        "battery_status": 95,
        "longitude": 12978456,
        "latitude": 55611234,
        "location_description": "Västra Hamnen - Turning Torso",
        "sensor_failure": false,
        "lost_communication": false
      },
      // More sensors...
    ]
  }
  ```

#### Get Sensor by ID
- **URL**: `/api/sensors/:id`
- **Method**: `GET`
- **Response**: 
  ```json
  {
    "message": "Hämtar sensor",
    "sensor": {
      "id": 1,
      "installation_date": "2024-12-01T09:00:00.000Z",
      "battery_status": 95,
      "longitude": 12978456,
      "latitude": 55611234,
      "location_description": "Västra Hamnen - Turning Torso",
      "sensor_failure": false,
      "lost_communication": false
    }
  }
  ```

#### Get Water Levels
- **URL**: `/api/sensors/waterlevels`
- **Method**: `GET`
- **Response**: 
  ```json
  {
    "message": "Aktuell vattennivå",
    "latest": {
      "id": 14,
      "sensor_id": 4,
      "waterlevel": 1,
      "rate_of_change": 0,
      "measured_at": "2025-05-12T10:30:00.000Z"
    }
  }
  ```

### Users

#### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Response**: 
  ```json
  {
    "message": "Hämtar alla användare",
    "users": [
      {
        "id": 1,
        "role_id": null,
        "name": "Alice Admin",
        "email": "alice@example.com",
        "password": "$2b$10$ge6LpyEGyrd5ROGvnkcY2eHhHxOCkf.ks4CcaJ.hOaVfcggLS6zpS",
        "google_id": null
      },
      // More users...
    ]
  }
  ```

#### Get User by ID
- **URL**: `/api/users/:id`
- **Method**: `GET`

#### Create User
- **URL**: `/api/users`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userName": "John Doe",
    "mail": "john@example.com",
    "password": "password123",
    "role": 1
  }
  ```

## Authentication

**Note**: The authentication endpoints (`/api/login` and `/api/register`) appear to be unavailable in the current Vercel deployment. The application should fall back to mock data or handle authentication errors gracefully.

## Error Handling

All API requests should include proper error handling to gracefully handle cases where endpoints are unavailable or return unexpected data.

## Fallback Strategy

When API requests fail, the application should fall back to using mock data from `data/floodRiskData.ts` to ensure the app remains functional even when the backend is unavailable.
