const db = require('../config/database');

class CommonModel {
    constructor(tableName) {
      this.tableName = tableName;
    }
  
    //Create a new record
    create(data, callback) {
      const query = `INSERT INTO ${this.tableName} SET ?`;
      db.query(query, data, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        return callback(null, results);
      });
    }
  
    // Find records by condition
    find(condition, callback) {
      const query = `SELECT * FROM ${this.tableName} WHERE ?`;
      db.query(query, condition, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        return callback(null, results);
      });
    }

    getAll(callback) {
        const query = `SELECT * FROM ${this.tableName}`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching from ${this.tableName}:`, err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }
  
    // Update records by condition
    update(id, data, callback) {
      const query = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
      db.query(query, [data, id], (err, result) => {
          if (err) {
              console.error('Error executing update query:', err);
              return callback(err);
          }
          callback(null, result);
      });
    }
    updateProfile(id, data) {
        return new Promise((resolve, reject) => {
          const query = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
          db.query(query, [data, id], (err, result) => {
            if (err) {
              console.error('Error executing update query:', err);
              reject(err); // Reject the promise if there's an error
            } else {
              resolve(result); // Resolve the promise with the result if success
            }
          });
        });
      }
      
  
    // Delete records by condition
    delete(condition, callback) {
      const query = `DELETE FROM ${this.tableName} WHERE ?`;
      db.query(query, condition, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        return callback(null, results);
      });
    }

    getById(id, callback) {
      const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      console.log('Running query:', query, 'with ID:', id); // Log untuk debugging
      db.query(query, [id], (err, results) => {
          if (err) {
              callback(err, null);
              return;
          }
          callback(null, results);
      });
    }

    getByIdBlog(id, callback) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        console.log('Running query:', query, 'with ID:', id); // Debug log
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return callback(err, null);
            }
            callback(null, results); // Tidak perlu memeriksa results.length === 0 di sini, karena akan ditangani di controller
        });
    }

    getByUsername(username, callback) {
        const query = `SELECT * FROM ${this.tableName} WHERE username = ?`;
        db.query(query, [username], (err, results) => {
            if (err) {
                console.error('Error fetching user by username:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    getFiltered(callback) {
        const query = `SELECT * FROM sampah WHERE role IN ('admin', 'user')`;
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    getByIds(ids, callback) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id IN (?)`;  // Menggunakan query IN untuk beberapa ID
        db.query(sql, [ids], (err, result) => {
            if (err) {
                return callback(err, null);  // Mengembalikan error jika ada masalah
            }
            callback(null, result);  // Mengembalikan hasil query jika berhasil
        });
    }
    

  getByCondition(condition, callback) {
    const query = `SELECT * FROM ${this.tableName} WHERE ?`;
    db.query(query, condition, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

    getLastNoUrut(callback) {
      const query = `SELECT no_urut FROM ${this.tableName} ORDER BY no_urut DESC LIMIT 1`;
      db.query(query, (err, results) => {
          if (err) {
              return callback(err, null);
          }
          const lastNoUrut = results.length > 0 ? parseInt(results[0].no_urut) : 0;
          callback(null, lastNoUrut);
      });
    }

    getAllWithJoin(query, params) {
      return new Promise((resolve, reject) => {
          db.query(query, params, (err, results) => {
              if (err) {
                  return reject(err);
              }
              resolve(results);
          });
      });
    }

    // Bulk create records
    bulkCreate(data) {
      return new Promise((resolve, reject) => {
          const query = `
              INSERT INTO dtl_transaksi (transaksi_id, kategori_id, jumlah, total)
              VALUES ?
          `;
          const values = data.map(item => [
              item.transaksi_id,
              item.kategori_id,
              item.jumlah,
              item.total,
          ]);
          db.query(query, [values], (err, results) => {
              if (err) return reject(err);
              resolve(results);
          });
      });
    }

    findById(id) {
      return new Promise((resolve, reject) => {
          const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
          db.query(query, [id], (err, results) => {
              if (err) return reject(err);
              resolve(results[0] || null);
          });
      });
  }

  getByUserId(userId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM tarik_saldo WHERE user_id = ?`;
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching tarik saldo by user_id:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Fungsi untuk menambah permintaan tarik saldo
addWithdrawal(userId, points) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO ${this.tableName} (user_id, points, status) VALUES (?, ?, 'pending')`;
        db.query(query, [userId, points], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}
  
getTotalSaldo(userId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT COALESCE(saldo, 0) AS totalSaldo FROM nasabah WHERE id = ?`;
        db.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]?.totalSaldo || 0); // Gunakan optional chaining
        });
    });
}


  getTotalTransaksi(userId) {
      return new Promise((resolve, reject) => {
          const query = `SELECT COUNT(id) AS totalTransaksi FROM transaksi WHERE nasabah_id = ?`;
          db.query(query, [userId], (err, results) => {
              if (err) return reject(err);
              resolve(results[0].totalTransaksi || 0);
          });
      });
  }

  getTotalSampah(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COALESCE(SUM(dt.jumlah), 0) AS totalSampah 
            FROM dtl_transaksi dt
            JOIN transaksi t ON dt.transaksi_id = t.id
            WHERE t.nasabah_id = ? AND t.status = 'complete';
        `;
        db.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]?.totalSampah || 0);
        });
    });
}

//   getTotalSampah(userId) {
//       return new Promise((resolve, reject) => {
//           const query = `SELECT COALESCE(SUM(jumlah), 0) AS totalSampah FROM dtl_transaksi WHERE transaksi_id IN (SELECT id FROM transaksi WHERE nasabah_id = ?);`;
//           db.query(query, [userId], (err, results) => {
//               if (err) return reject(err);
//               resolve(results[0].totalSampah || 0);
//           });
//       });
//   }

  getRiwayatTransaksi(userId) {
      return new Promise((resolve, reject) => {
          const query = `
              SELECT 
                  t.id AS transaksi_id, 
                  t.tanggal, 
                  t.total_kg, 
                  t.total_uang, 
                  t.status,
                  GROUP_CONCAT(s.jenis_sampah SEPARATOR ', ') AS jenis_sampah
              FROM transaksi t
              LEFT JOIN dtl_transaksi dt ON t.id = dt.transaksi_id
              LEFT JOIN sampah s ON dt.kategori_id = s.id
              WHERE t.nasabah_id = ?
              GROUP BY t.id
              ORDER BY t.tanggal DESC;
          `;
          db.query(query, [userId], (err, results) => {
              if (err) return reject(err);
              resolve(results);
          });
      });
  }

  addPoints(userId, points, callback) {
    const query = 'UPDATE nasabah SET saldo = saldo + ? WHERE id = ?';
    console.log('Executing query:', query, [points, userId]); // Tambahkan log untuk debugging
    db.query(query, [points, userId], callback);
}

getWithdrawalsWithUsers(callback) {
  const query = `
      SELECT 
          w.id, 
          w.points AS withdraw_points, 
          w.status, 
          w.created_at, 
          u.nama_lengkap, 
          u.saldo AS total_points  -- Menggunakan saldo, bukan points, jika itu yang dimaksud
      FROM 
          tarik_saldo w
      JOIN 
          nasabah u 
      ON 
          w.user_id = u.id
  `;
  db.query(query, [], (err, results) => {
      if (err) {
          console.error('Error fetching withdrawals with users:', err);
          return callback(err, null);
      }
      callback(null, results);
  });
}

getByIdAsync(id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}

}

module.exports = CommonModel;