import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('smart_alarm.db');

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS TripSession (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          destination_lat REAL NOT NULL,           
          destination_lng REAL NOT NULL,           
          minutes_to_destination INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ProcessedSleepData (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp INTEGER NOT NULL,
          avg_heart_rate REAL,
          smoothed_movement REAL
      );

      CREATE TABLE IF NOT EXISTS SleepPhases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          start_time INTEGER NOT NULL,
          end_time INTEGER,
          phase_name TEXT NOT NULL
      );
    `);
    console.log("База даних успішно ініціалізована!");
  } catch (error) {
    console.error("Помилка при створенні бази даних:", error);
  }
};

export default db;
