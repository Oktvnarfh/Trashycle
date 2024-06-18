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
  // create(data, callback) {
  //   const query = `INSERT INTO ${this.tableName} SET ?`;
  //   db.query(query, data, callback);
  // }
  create(data) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO ${this.tableName} SET ?`;
        db.query(query, data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId); // Return the inserted ID
            }
        });
    });
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

  getLocationWithDetails(id, callback) {
    const query = `
        SELECT l.*, c.name as category_name, s.day, s.open_time, s.close_time
        FROM locations l
        LEFT JOIN location_categories lc ON l.id = lc.location_id
        LEFT JOIN category c ON lc.category_id = c.id
        LEFT JOIN location_schedules s ON l.id = s.location_id
        WHERE l.id = ?`;

    db.query(query, [id], callback);
}
}

module.exports = CommonModel;
