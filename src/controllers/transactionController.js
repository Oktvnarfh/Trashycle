const CommonModel = require('../models/commonModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const transactionController = {};
const Users = new CommonModel('nasabah');
const Transactions = new CommonModel('transaksi');
const Category = new CommonModel('sampah');
const Detail = new CommonModel('dtl_transaksi');

transactionController.index = async (req, res) => {
    const query = `
        SELECT 
            t.id, 
            n.no_urut, 
            n.nama_lengkap, 
            GROUP_CONCAT(s.jenis_sampah SEPARATOR ', ') AS jenis_sampah, 
            SUM(d.jumlah) AS total_kg, 
            t.total_uang, 
            t.status, 
            t.tanggal
        FROM transaksi t
        JOIN nasabah n ON t.nasabah_id = n.id
        JOIN dtl_transaksi d ON t.id = d.transaksi_id
        JOIN sampah s ON d.kategori_id = s.id
        GROUP BY t.id
    `;

    try {
        const results = await Transactions.getAllWithJoin(query, []);
        res.render('admin/transactions/index', { data: results });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        req.flash('error', 'Gagal memuat daftar transaksi.');
        res.redirect('/admin/transactions');
    }
};

transactionController.add = async (req, res) => {
    try {
        // Ambil data nasabah
        const users = await new Promise((resolve, reject) => {
            Users.getAll((err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        // Ambil data kategori sampah
        const categories = await new Promise((resolve, reject) => {
            Category.getAll((err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        // Render halaman dengan data nasabah dan kategori
        res.render('admin/transactions/add', { users, categories });
    } catch (err) {
        console.error('Error fetching data for add transaction:', err);
        req.flash('error', `Gagal memuat data: ${err.message}`);
        res.render('admin/transactions/add', { users: [], categories: [] });
    }
};

transactionController.store = async (req, res) => {
    const { user_id, kategori_id, total_kg, status } = req.body;

    if (!user_id || !kategori_id || !total_kg || !status) {
        req.flash('error', 'Semua field wajib diisi!');
        return res.redirect('/admin/transactions/add');
    }

    try {
        const tanggal = new Date();
        const transaksiData = { nasabah_id: user_id, status, tanggal };

        // Simpan data transaksi ke tabel transaksi
        const transactionResult = await new Promise((resolve, reject) => {
            Transactions.create(transaksiData, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        const transaksiId = transactionResult.insertId;
        let totalKg = 0;
        let totalUang = 0;

        // Pastikan kategori_id dan total_kg berupa array
        if (!Array.isArray(kategori_id) || !Array.isArray(total_kg)) {
            throw new Error('Kategori dan total kg harus berupa array.');
        }

        // Proses setiap kategori dan jumlah kg
        for (let i = 0; i < kategori_id.length; i++) {
            const kategori = await new Promise((resolve, reject) => {
                Category.getById(kategori_id[i], (err, result) => {
                    if (err) return reject(err);
                    if (!result.length) return reject(new Error('Kategori tidak ditemukan.'));
                    resolve(result[0]);
                });
            });

            const jumlah = parseFloat(total_kg[i]);
            if (isNaN(jumlah) || jumlah <= 0) {
                throw new Error(`Jumlah untuk kategori ${kategori.jenis_sampah} tidak valid.`);
            }

            const total = jumlah * kategori.harga_perkilo;

            totalKg += jumlah;
            totalUang += total;

            // Simpan data ke tabel detail transaksi
            await new Promise((resolve, reject) => {
                Detail.create(
                    { transaksi_id: transaksiId, kategori_id: kategori_id[i], jumlah, total },
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        }

        // Update total berat dan total uang di tabel transaksi
        await new Promise((resolve, reject) => {
            Transactions.update(transaksiId, { total_kg: totalKg, total_uang: totalUang }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // If the transaction status is "complete", update the user's balance
        if (status === 'complete') {
            // Update the user's balance
            await new Promise((resolve, reject) => {
                Users.getById(user_id, (err, result) => {
                    if (err) return reject(err);
                    if (!result.length) return reject(new Error('Nasabah tidak ditemukan.'));

                    const nasabah = result[0];
                    const updatedBalance = parseFloat(nasabah.saldo) + totalUang;

                    Users.update(user_id, { saldo: updatedBalance }, (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        }

        req.flash('success', 'Transaksi berhasil ditambahkan.');
        res.redirect('/admin/transactions');
    } catch (error) {
        console.error(error);
        req.flash('error', `Gagal menambahkan transaksi: ${error.message}`);
        res.redirect('/admin/transactions/add');
    }
};



// Menampilkan form edit transaksi
transactionController.edit = async (req, res) => {
    const { id } = req.params;

    try {
        // Ambil data transaksi berdasarkan id
        const transaction = await new Promise((resolve, reject) => {
            Transactions.getById(id, (err, result) => {
                if (err) return reject(err);
                if (!result.length) return reject(new Error('Transaksi tidak ditemukan.'));
                resolve(result[0]);
            });
        });

        // Ambil detail transaksi untuk kategori dan total kg
        const transactionDetails = await new Promise((resolve, reject) => {
            const query = `
                SELECT d.kategori_id, s.jenis_sampah, d.jumlah
                FROM dtl_transaksi d
                JOIN sampah s ON d.kategori_id = s.id
                WHERE d.transaksi_id = ?
            `;
            db.query(query, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Ambil data nasabah dan kategori sampah
        const users = await new Promise((resolve, reject) => {
            Users.getAll((err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        const categories = await new Promise((resolve, reject) => {
            Category.getAll((err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        // Render halaman edit dengan data transaksi
        res.render('admin/transactions/edit', { 
            transaction,
            transactionDetails,
            users,
            categories 
        });
    } catch (err) {
        console.error('Error fetching data for edit transaction:', err);
        req.flash('error', `Gagal memuat data transaksi: ${err.message}`);
        res.redirect('/admin/transactions');
    }
};

// Memperbarui transaksi
// transactionController.update = async (req, res) => {
//     const { id } = req.params;
//     const { user_id, kategori_id, total_kg, status } = req.body;

//     if (!user_id || !kategori_id || !total_kg || !status) {
//         req.flash('error', 'Semua field wajib diisi!');
//         return res.redirect(`/admin/transactions/edit/${id}`);
//     }

//     try {
//         const tanggal = new Date();
//         const transaksiData = { nasabah_id: user_id, status, tanggal };

//         // Update data transaksi di tabel transaksi
//         await new Promise((resolve, reject) => {
//             Transactions.update(id, transaksiData, (err) => {
//                 if (err) return reject(err);
//                 resolve();
//             });
//         });

//         let totalKg = 0;
//         let totalUang = 0;

//         // Pastikan kategori_id dan total_kg berupa array
//         if (!Array.isArray(kategori_id) || !Array.isArray(total_kg)) {
//             throw new Error('Kategori dan total kg harus berupa array.');
//         }

//         // Hapus detail transaksi lama sebelum menambah yang baru
//         await new Promise((resolve, reject) => {
//             const query = `DELETE FROM dtl_transaksi WHERE transaksi_id = ?`;
//             db.query(query, [id], (err) => {
//                 if (err) return reject(err);
//                 resolve();
//             });
//         });

//         // Proses setiap kategori dan jumlah kg untuk memperbarui detail transaksi
//         for (let i = 0; i < kategori_id.length; i++) {
//             const kategori = await new Promise((resolve, reject) => {
//                 Category.getById(kategori_id[i], (err, result) => {
//                     if (err) return reject(err);
//                     if (!result.length) return reject(new Error('Kategori tidak ditemukan.'));
//                     resolve(result[0]);
//                 });
//             });

//             const jumlah = parseFloat(total_kg[i]);
//             if (isNaN(jumlah) || jumlah <= 0) {
//                 throw new Error(`Jumlah untuk kategori ${kategori.jenis_sampah} tidak valid.`);
//             }

//             const total = jumlah * kategori.harga_perkilo;

//             totalKg += jumlah;
//             totalUang += total;

//             // Simpan data detail transaksi baru
//             await new Promise((resolve, reject) => {
//                 Detail.create(
//                     { transaksi_id: id, kategori_id: kategori_id[i], jumlah, total },
//                     (err) => {
//                         if (err) return reject(err);
//                         resolve();
//                     }
//                 );
//             });
//         }

//         // Update total berat dan total uang di tabel transaksi
//         await new Promise((resolve, reject) => {
//             Transactions.update(id, { total_kg: totalKg, total_uang: totalUang }, (err) => {
//                 if (err) return reject(err);
//                 resolve();
//             });
//         });

//         req.flash('success', 'Transaksi berhasil diperbarui.');
//         res.redirect('/admin/transactions');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', `Gagal memperbarui transaksi: ${error.message}`);
//         res.redirect(`/admin/transactions/edit/${id}`);
//     }
// };

transactionController.update = async (req, res) => {
    const { id } = req.params;
    const { user_id, kategori_id, total_kg, status } = req.body;

    if (!user_id || !kategori_id || !total_kg || !status) {
        req.flash('error', 'Semua field wajib diisi!');
        return res.redirect(`/admin/transactions/edit/${id}`);
    }

    try {
        const tanggal = new Date();
        const transaksiData = { nasabah_id: user_id, status, tanggal };

        // Update data transaksi di tabel transaksi
        await new Promise((resolve, reject) => {
            Transactions.update(id, transaksiData, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        let totalKg = 0;
        let totalUang = 0;

        // Pastikan kategori_id dan total_kg berupa array
        if (!Array.isArray(kategori_id) || !Array.isArray(total_kg)) {
            throw new Error('Kategori dan total kg harus berupa array.');
        }

        // Hapus detail transaksi lama sebelum menambah yang baru
        await new Promise((resolve, reject) => {
            const query = `DELETE FROM dtl_transaksi WHERE transaksi_id = ?`;
            db.query(query, [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Proses setiap kategori dan jumlah kg untuk memperbarui detail transaksi
        for (let i = 0; i < kategori_id.length; i++) {
            const kategori = await new Promise((resolve, reject) => {
                Category.getById(kategori_id[i], (err, result) => {
                    if (err) return reject(err);
                    if (!result.length) return reject(new Error('Kategori tidak ditemukan.'));
                    resolve(result[0]);
                });
            });

            const jumlah = parseFloat(total_kg[i]);
            if (isNaN(jumlah) || jumlah <= 0) {
                throw new Error(`Jumlah untuk kategori ${kategori.jenis_sampah} tidak valid.`);
            }

            const total = jumlah * kategori.harga_perkilo;

            totalKg += jumlah;
            totalUang += total;

            // Simpan data detail transaksi baru
            await new Promise((resolve, reject) => {
                Detail.create(
                    { transaksi_id: id, kategori_id: kategori_id[i], jumlah, total },
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        }

        // Update total berat dan total uang di tabel transaksi
        await new Promise((resolve, reject) => {
            Transactions.update(id, { total_kg: totalKg, total_uang: totalUang }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Jika status adalah 'complete', update saldo nasabah
        if (status === 'complete') {
            const totalPoints = totalUang; // Atau sesuaikan dengan logika poin yang diinginkan
            await Users.addPoints(user_id, totalPoints, (err) => {
                if (err) {
                    throw new Error('Gagal memperbarui saldo nasabah.');
                }
            });
        }

        req.flash('success', 'Transaksi berhasil diperbarui.');
        res.redirect('/admin/transactions');
    } catch (error) {
        console.error(error);
        req.flash('error', `Gagal memperbarui transaksi: ${error.message}`);
        res.redirect(`/admin/transactions/edit/${id}`);
    }
};


// transactionController.js
transactionController.delete = (req, res) => {
    const { id } = req.params;

    // First, delete related records in dtl_transaksi
    Detail.delete({ transaksi_id: id }, (err) => {
        if (err) {
            console.error('Error deleting detail transactions:', err); // Log error for debugging
            req.flash('error', 'Gagal menghapus detail transaksi.');
            return res.redirect('/admin/transactions');
        }

        // Now delete the main transaction record
        Transactions.delete({ id }, (err, result) => {
            if (err) {
                console.error('Error deleting transaction:', err); // Log error for debugging
                req.flash('error', 'Gagal menghapus transaksi.');
                return res.redirect('/admin/transactions');
            }

            req.flash('success', 'Transaksi berhasil dihapus.');
            res.redirect('/admin/transactions');
        });
    });
};

// Menampilkan laporan transaksi
transactionController.report = async (req, res) => {
    try {
        // Ambil halaman saat ini dari query string, default ke halaman 1
        const page = req.query.page || 1;
        const limit = 10; // Tentukan jumlah record per halaman
        const offset = (page - 1) * limit; // Hitung offset untuk query

        // Query SQL dengan pagination
        const query = `
            SELECT 
                t.id, 
                n.nama_lengkap, 
                GROUP_CONCAT(s.jenis_sampah SEPARATOR ', ') AS jenis_sampah, 
                SUM(d.jumlah) AS total_kg, 
                t.total_uang, 
                t.status, 
                t.tanggal
            FROM transaksi t
            JOIN nasabah n ON t.nasabah_id = n.id
            JOIN dtl_transaksi d ON t.id = d.transaksi_id
            JOIN sampah s ON d.kategori_id = s.id
            GROUP BY t.id
            LIMIT ? OFFSET ?;
        `;

        // Query untuk mendapatkan total jumlah transaksi untuk pagination
        const countQuery = `
            SELECT COUNT(DISTINCT t.id) AS total_transactions
            FROM transaksi t
            JOIN nasabah n ON t.nasabah_id = n.id
            JOIN dtl_transaksi d ON t.id = d.transaksi_id
            JOIN sampah s ON d.kategori_id = s.id;
        `;

        // Eksekusi query untuk mendapatkan data transaksi
        const transactions = await Transactions.getAllWithJoin(query, [limit, offset]);

        // Eksekusi query untuk mendapatkan total jumlah transaksi
        const countResult = await Transactions.getAllWithJoin(countQuery, []);
        const totalTransactions = countResult[0].total_transactions;
        const totalPages = Math.ceil(totalTransactions / limit); // Hitung total halaman

        // Render halaman dengan data transaksi dan pagination
        res.render('admin/transactions/report', {
            data: transactions,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching transactions for report:', error);
        req.flash('error', 'Gagal menampilkan laporan.');
        res.redirect('/admin/transactions');
    }
};



module.exports = transactionController;