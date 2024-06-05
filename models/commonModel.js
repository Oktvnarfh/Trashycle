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
}

module.exports = CommonModel;
