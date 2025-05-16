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
    
    // Now insert 4 geographically distant sensors in Malmö
    console.log('Inserting 4 sensors with Malmö coordinates...');
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
      -- Northwest: Västra Hamnen (Western Harbor)
      ('2024-12-01T10:00:00Z', 95, 12978456, 55611234, 'Västra Hamnen - Turning Torso', false, false),
      
      -- Northeast: Malmö Harbor
      ('2025-01-15T14:30:00Z', 80, 12994573, 55609235, 'Malmö Harbor - North Pier', false, false),
      
      -- Southwest: Limhamn
      ('2025-02-20T09:00:00Z', 70, 12935681, 55566789, 'Limhamn Coastal Area', false, false),
      
      -- Southeast: Bunkeflostrand
      ('2025-03-05T16:45:00Z', 60, 12956789, 55572345, 'Bunkeflostrand Coastal Path', false, false);
    `);

    // Reset the sequence for emergency_contacts
    console.log('Resetting emergency_contacts ID sequence...');
    await query('ALTER SEQUENCE emergency_contacts_id_seq RESTART WITH 1');
    
    // Insert emergency contacts for the 4 sensors
    console.log('Inserting emergency contacts...');
    await query(`
      INSERT INTO emergency_contacts (sensor_id, name, phone_number) VALUES
      (1, 'Erik Waterguard', '+46700000001'),
      (2, 'Nina Floodwatch', '+46700000002'),
      (3, 'Laura Risk', '+46700000003'),
      (4, 'Mike Alert', '+46700000004');
    `);

    // Reset the sequence for waterlevels
    console.log('Resetting waterlevels ID sequence...');
    await query('ALTER SEQUENCE waterlevels_id_seq RESTART WITH 1');
    
    // Insert waterlevel readings with different risk levels
    // Sensor 1: High risk (level > 3)
    // Sensor 2: Medium risk (level > 2)
    // Sensor 3: Medium risk (rate > 1)
    // Sensor 4: Low risk
    console.log('Inserting waterlevel readings with different risk levels...');
    await query(`
      INSERT INTO waterlevels (sensor_id, waterlevel, rate_of_change, measured_at) VALUES
      -- Sensor 1: High risk (level > 3)
      (1, 4, 1, '2025-05-12T10:30:00Z'),
      
      -- Sensor 2: Medium risk (level > 2)
      (2, 3, 1, '2025-05-12T10:30:00Z'),
      
      -- Sensor 3: Medium risk (rate > 1)
      (3, 2, 2, '2025-05-12T10:30:00Z'),
      
      -- Sensor 4: Low risk
      (4, 1, 0, '2025-05-12T10:30:00Z');
    `);

    console.log('✅ Sensor data updated successfully with 4 Malmö sensors and different risk levels.');
  } catch (err) {
    console.error('❌ Error updating sensor data:', err);
  }
}

updateSensors();
