import { query } from '../../db.js';

async function insertMockData() {
  try {
    // Mockdata för 'roles'
    await query(`
      INSERT INTO "roles" ("name")
      VALUES
        ('Admin'),
        ('User'),
        ('Manager'),
        ('Guest'),
        ('Supervisor');
    `);

    // Mockdata för 'users'
    await query(`
      INSERT INTO "users" ("name", "email", "password", "role_id")
      VALUES
        ('Alice Johnson', 'alice@example.com', 'password123', 1),
        ('Bob Smith', 'bob@example.com', 'password123', 2),
        ('Charlie Davis', 'charlie@example.com', 'password123', 3),
        ('Diana Brown', 'diana@example.com', 'password123', 2),
        ('Eve White', 'eve@example.com', 'password123', 4);
    `);

    // Mockdata för 'locations'
    await query(`
      INSERT INTO "locations" ("longitude", "latitude", "address", "country")
      VALUES
        (12.9716, 77.5946, 'Bangalore', 'India'),
        (40.7128, -74.0060, 'New York', 'USA'),
        (51.5074, -0.1278, 'London', 'UK'),
        (34.0522, -118.2437, 'Los Angeles', 'USA'),
        (48.8566, 2.3522, 'Paris', 'France');
    `);

    // Mockdata för 'sensors'
    await query(`
      INSERT INTO "sensors" ("installation_date", "battery_status", "bitflag", "location_id")
      VALUES
        ('2023-01-01 12:00:00+00', 100, 0, 1),
        ('2023-02-01 12:00:00+00', 80, 1, 2),
        ('2023-03-01 12:00:00+00', 60, 0, 3),
        ('2023-04-01 12:00:00+00', 40, 1, 4),
        ('2023-05-01 12:00:00+00', 20, 0, 5);
    `);

    // Mockdata för 'waterlevels'
    await query(`
      INSERT INTO "waterlevels" ("waterlevel", "mesured_at", "sensor_id")
      VALUES
        (10, '2023-01-01 12:00:00+00', 1),
        (15, '2023-02-01 12:00:00+00', 2),
        (8, '2023-03-01 12:00:00+00', 3),
        (12, '2023-04-01 12:00:00+00', 4),
        (20, '2023-05-01 12:00:00+00', 5);
    `);

    // Mockdata för 'emergency_contacts'
    await query(`
      INSERT INTO "emergency_contacts" ("name", "phone_number", "location_id")
      VALUES
        ('John Doe', '1234567890', 1),
        ('Jane Smith', '2345678901', 2),
        ('Sam Green', '3456789012', 3),
        ('Olivia Blue', '4567890123', 4),
        ('Liam Brown', '5678901234', 5);
    `);

    console.log("Mockdata har lagts in.");
  } catch (err) {
    console.error('Fel vid inläggning av mockdata: ', err);
  }
}

insertMockData();
