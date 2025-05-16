# PostgreSQL Setup Guide for FloodCast

This guide will help you set up a PostgreSQL database for the FloodCast application.

## Prerequisites

- PostgreSQL installed on your machine
- Node.js and npm installed

## Option 1: Automated Setup (Recommended)

We've created a script that automates the entire setup process:

```bash
npm run setup-db
```

This script will:
1. Prompt you for your PostgreSQL username and password
2. Create the "floodcast" database if it doesn't exist
3. Update your .env file with the correct connection string
4. Create all the necessary tables
5. Seed the database with test data

## Option 2: Manual Setup

If you prefer to set up the database manually, follow these steps:

### Step 1: Create the Database

1. Open pgAdmin or your preferred PostgreSQL management tool
2. Connect to your PostgreSQL server
3. Right-click on "Databases" and select "Create" > "Database..."
4. Enter "floodcast" as the database name and click "Save"

Alternatively, you can create the database using the command line:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE floodcast;

# Exit psql
\q
```

### Step 2: Configure Environment Variables

1. Make sure your `.env` file in the project root contains the correct PostgreSQL connection string:

```
PG_URI=postgres://postgres:YourPassword@localhost:5432/floodcast
NODE_ENV=development
PORT=3000
```

Replace `YourPassword` with your actual PostgreSQL password.

### Step 3: Initialize Database Schema

Once the database is created and the connection string is configured, run the setup script to create the tables:

```bash
npm run create-tables
```

This script will create the following tables:
- roles
- users
- sensors
- emergency_contacts
- waterlevels

### Step 4: Seed the Database with Test Data

After creating the tables, you can populate them with test data:

```bash
npm run seed-db
```

## Step 5: Verify the Setup

To verify that everything is set up correctly, start the server:

```bash
npm run dev
```

Then, access the API at http://localhost:3000/api/sensors or http://localhost:3000/api/users to see if data is being returned.

## Troubleshooting

### Connection Issues

If you encounter connection issues, check:
1. PostgreSQL is running
2. Your password in the `.env` file is correct
3. The database "floodcast" exists
4. PostgreSQL is listening on port 5432

### Schema Creation Errors

If you encounter errors during schema creation:
1. Check if tables already exist (you might need to drop them first)
2. Ensure you have the necessary permissions to create tables

### Data Seeding Issues

If you encounter errors during data seeding:
1. Make sure the tables were created successfully
2. Check if there are any constraint violations in the seed data

## Database Schema

The database schema includes the following tables:

### roles
- id (PRIMARY KEY)
- name (VARCHAR)

### users
- id (PRIMARY KEY)
- role_id (FOREIGN KEY to roles.id)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)

### sensors
- id (PRIMARY KEY)
- installation_date (TIMESTAMP)
- battery_status (INTEGER)
- longitude (INTEGER) - GPS longitude coordinate multiplied by 1,000,000 (e.g., 12.994573 is stored as 12994573)
- latitude (INTEGER) - GPS latitude coordinate multiplied by 1,000,000 (e.g., 55.609235 is stored as 55609235)
- location_description (VARCHAR)
- sensor_failure (BOOLEAN)
- lost_communication (BOOLEAN)

Note: The coordinates are stored as integers with 6 decimal precision to avoid floating-point issues. To convert back to standard GPS format, divide by 1,000,000.

### emergency_contacts
- id (PRIMARY KEY)
- sensor_id (FOREIGN KEY to sensors.id)
- name (VARCHAR)
- phone_number (VARCHAR)

### waterlevels
- id (PRIMARY KEY)
- sensor_id (FOREIGN KEY to sensors.id)
- waterlevel (INTEGER)
- rate_of_change (INTEGER)
- measured_at (TIMESTAMPTZ)
