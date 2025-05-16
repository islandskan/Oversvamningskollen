import { query } from '../db.js';

async function updateSensors() {
  try {
    // First, delete existing sensor data and related records
    console.log('Deleting existing waterlevels data...');
    await query('DELETE FROM waterlevels');

    console.log('Deleting existing emergency_contacts data...');
    await query('DELETE FROM emergency_contacts');

    console.log('Deleting existing sensors data...');
    await query('DELETE FROM sensors');

    // Reset the sequence for sensors
    console.log('Resetting sensor ID sequence...');
    await query('ALTER SEQUENCE sensors_id_seq RESTART WITH 1');

    // Now insert the new sensor data with Malmö coordinates
    console.log('Inserting new sensors with Malmö coordinates...');
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
      ('2024-12-01T10:00:00Z', 95, 12994573, 55609235, 'Malmö Harbor - North Pier', false, false),
      ('2025-01-15T14:30:00Z', 80, 12975482, 55581364, 'Ribersborg Beach', false, true),
      ('2025-02-20T09:00:00Z', 70, 12986721, 55595823, 'Pildammsparken Lake', true, false),
      ('2025-03-05T16:45:00Z', 60, 12990876, 55607492, 'Malmö Canal - City Center', false, false),
      ('2025-04-01T08:20:00Z', 88, 12935681, 55566789, 'Limhamn Coastal Area', true, true),
      ('2025-04-10T09:15:00Z', 92, 12978456, 55611234, 'Västra Hamnen - Turning Torso', false, false),
      ('2025-04-15T11:30:00Z', 85, 12956789, 55572345, 'Bunkeflostrand Coastal Path', false, false),
      ('2025-04-20T14:45:00Z', 78, 12987654, 55603456, 'Slottsparken Canal', true, false),
      ('2025-04-25T10:00:00Z', 90, 12998765, 55608765, 'Malmö University Waterfront', false, false),
      ('2025-04-30T13:20:00Z', 82, 12967890, 55589012, 'Hyllie Stormwater Basin', false, true);
    `);

    // Reset the sequence for emergency_contacts
    console.log('Resetting emergency_contacts ID sequence...');
    await query('ALTER SEQUENCE emergency_contacts_id_seq RESTART WITH 1');

    // Insert emergency contacts
    console.log('Inserting emergency contacts...');
    await query(`
      INSERT INTO emergency_contacts (sensor_id, name, phone_number) VALUES
      (1, 'Nina Floodwatch', '+46700000001'),
      (2, 'Carl Safety', '+46700000002'),
      (3, 'Laura Risk', '+46700000003'),
      (4, 'Mike Alert', '+46700000004'),
      (5, 'Diana Rescue', '+46700000005'),
      (6, 'Erik Waterguard', '+46700000006'),
      (7, 'Sofia Monitor', '+46700000007'),
      (8, 'Anders Flood', '+46700000008'),
      (9, 'Maria Waterlevel', '+46700000009'),
      (10, 'Johan Emergency', '+46700000010');
    `);

    // Reset the sequence for waterlevels
    console.log('Resetting waterlevels ID sequence...');
    await query('ALTER SEQUENCE waterlevels_id_seq RESTART WITH 1');

    // Insert waterlevel readings
    console.log('Inserting waterlevel readings...');
    await query(`
      INSERT INTO waterlevels (sensor_id, waterlevel, rate_of_change, measured_at) VALUES
      -- Original 5 sensors
      (1, 2, 1, '2025-05-12T08:30:00Z'),
      (1, 3, 2, '2025-05-12T09:30:00Z'),
      (2, 1, 1, '2025-05-12T08:45:00Z'),
      (2, 2, 3, '2025-05-12T10:00:00Z'),
      (3, 4, 2, '2025-05-12T07:15:00Z'),
      (3, 3, 1, '2025-05-12T08:15:00Z'),
      (4, 1, 3, '2025-05-12T06:50:00Z'),
      (4, 2, 2, '2025-05-12T08:10:00Z'),
      (5, 3, 2, '2025-05-12T09:00:00Z'),
      (5, 4, 3, '2025-05-12T10:30:00Z'),
      -- New sensors (6-10)
      (6, 2, 1, '2025-05-12T07:30:00Z'),
      (6, 3, 2, '2025-05-12T09:45:00Z'),
      (7, 1, 0, '2025-05-12T08:00:00Z'),
      (7, 1, 1, '2025-05-12T10:15:00Z'),
      (8, 3, 2, '2025-05-12T07:45:00Z'),
      (8, 4, 3, '2025-05-12T09:15:00Z'),
      (9, 2, 1, '2025-05-12T08:20:00Z'),
      (9, 3, 2, '2025-05-12T10:20:00Z'),
      (10, 1, 1, '2025-05-12T07:00:00Z'),
      (10, 2, 2, '2025-05-12T09:10:00Z');
    `);

    console.log('✅ Sensor data updated successfully with Malmö coordinates.');
  } catch (err) {
    console.error('❌ Error updating sensor data:', err);
  }
}

updateSensors();
