// models/commonModel.js

const db = require('../database/config');

class CommonModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Get all records
  getAll(callback) {
    const query = `SELECT * FROM ${this.tableName}`;
    db.query(query, callback);
  }

  // Get single record by ID
  getById(id, callback) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    db.query(query, [id], callback);
  }

  // Create a new record
  create(data, callback) {
    const query = `INSERT INTO ${this.tableName} SET ?`;
    db.query(query, data, callback);
  }

  // Update a record by ID
  update(id, data, callback) {
    const query = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
    db.query(query, [data, id], callback);
  }

  // Delete a record by ID
  delete(id, callback) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    db.query(query, [id], callback);
  }

   // Get record by username
   getByUsername(username, callback) {
    const query = `SELECT * FROM ${this.tableName} WHERE username = ?`;
    db.query(query, [username], callback);
  }

  getLocationsWithDetails(callback) {
    const query = `
        SELECT l.*, c.name AS category_name, s.day, s.open_time, s.close_time
        FROM locations l
        LEFT JOIN category c ON l.category_id = c.id
        LEFT JOIN location_schedules s ON l.id = s.location_id
        ORDER BY l.id, s.day;
    `;
    db.query(query, callback);
  }
}

module.exports = CommonModel;
