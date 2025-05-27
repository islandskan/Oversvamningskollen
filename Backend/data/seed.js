import { query } from '../db.js';

async function seed() {
  try {
    // Insert roles
    await query(`
      INSERT INTO roles (name) VALUES
      ('Admin'),
      ('Technician'),
      ('Viewer');
    `);

    // Insert users
    await query(`
      INSERT INTO users (role_id, name, email, password) VALUES
      (1, 'Alice Admin', 'alice@example.com', 'securepassword1'),
      (2, 'Bob Tech', 'bob@example.com', 'securepassword2'),
      (3, 'Charlie Viewer', 'charlie@example.com', 'securepassword3');
    `);

    // Insert sensors
    await query(`
      INSERT INTO sensors (
        installation_date,
        battery_status,
        longitude,
        latitude,
        location_description,
        sensor_failure,
        lost_communication
      ) VALUES
      ('2024-12-01T10:00:00Z', 95, 18012, 598745, 'Riverbank North', false, false),
      ('2025-01-15T14:30:00Z', 80, 18056, 598800, 'Riverbend East', false, true),
      ('2025-02-20T09:00:00Z', 70, 18090, 598710, 'Dam Outlet', true, false),
      ('2025-03-05T16:45:00Z', 60, 18100, 598600, 'Bridge Support', false, false),
      ('2025-04-01T08:20:00Z', 88, 18075, 598900, 'Floodplain Zone', true, true);
    `);

    // Insert emergency contacts
    await query(`
      INSERT INTO emergency_contacts (sensor_id, name, phone_number) VALUES
      (1, 'Nina Floodwatch', '+46700000001'),
      (2, 'Carl Safety', '+46700000002'),
      (3, 'Laura Risk', '+46700000003'),
      (4, 'Mike Alert', '+46700000004'),
      (5, 'Diana Rescue', '+46700000005');
    `);

    // Insert waterlevel readings
    await query(`
      INSERT INTO waterlevels (sensor_id, waterlevel, rate_of_change, measured_at) VALUES
      (1, 2, 1, '2025-05-12T08:30:00Z'),
      (1, 3, 2, '2025-05-12T09:30:00Z'),
      (2, 1, 1, '2025-05-12T08:45:00Z'),
      (2, 2, 3, '2025-05-12T10:00:00Z'),
      (3, 4, 2, '2025-05-12T07:15:00Z'),
      (3, 3, 1, '2025-05-12T08:15:00Z'),
      (4, 1, 3, '2025-05-12T06:50:00Z'),
      (4, 2, 2, '2025-05-12T08:10:00Z'),
      (5, 3, 2, '2025-05-12T09:00:00Z'),
      (5, 4, 3, '2025-05-12T10:30:00Z');
    `);

    console.log(' Mock data seeded successfully.');
  } catch (err) {
    console.error(' Error seeding mock data:', err);
  }
}

seed();
