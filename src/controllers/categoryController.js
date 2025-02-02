const CommonModel = require('../models/commonModel');
const categoryController = {};
const Category = new CommonModel('sampah');

// Menampilkan semua data kategori
categoryController.index = (req, res) => {
    Category.getAll((err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.render('admin/category/index', { data: [] });
            return;
        }
        res.render('admin/category/index', { data: rows });
    });
};

// Menampilkan form tambah kategori
categoryController.add = (req, res) => {
    res.render('admin/category/add');
};

// Menyimpan data kategori baru
categoryController.store = (req, res) => {
    const { jenis_sampah, harga_perkilo, periode_bulan } = req.body;

    console.log('Data received:', req.body);

    if (!jenis_sampah || !harga_perkilo || !periode_bulan) {
        req.flash('error', 'Semua kolom wajib diisi.');
        res.redirect('/admin/category/edit');
        return;
    }

    const category = { jenis_sampah, harga_perkilo, periode_bulan };
    Category.create(category, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            req.flash('error', `${err.message}`);
            res.redirect('/admin/category/edit');
            return;
        }
        req.flash('success', 'Data berhasil ditambahkan.');
        res.redirect('/admin/category');
    });
};

// Menampilkan form edit kategori
categoryController.edit = (req, res) => {
    const { id } = req.params;
    Category.getById(id, (err, rows) => {
        if (err || !rows.length) {
            req.flash('error', 'Kategori tidak ditemukan.');
            res.redirect('/admin/category');
            return;
        }
        res.render('admin/category/edit', { category: rows[0] });
    });
};

// Memperbarui data kategori
// categoryController.update = (req, res) => {
//     const { id } = req.params;
//     const { jenis_sampah, harga_perkilo, periode_bulan } = req.body;

//     // Get the current category to retain the existing date if not changed
//     Category.getById(id, (err, rows) => {
//         if (err || !rows.length) {
//             req.flash('error', 'Kategori tidak ditemukan.');
//             res.redirect('/admin/category');
//             return;
//         }

//         // If periode_bulan is not provided, use the existing one
//         const currentCategory = rows[0];
//         const updatedCategory = {
//             jenis_sampah: jenis_sampah || currentCategory.jenis_sampah,
//             harga_perkilo: harga_perkilo || currentCategory.harga_perkilo,
//             periode_bulan: periode_bulan || currentCategory.periode_bulan, // Ensure it's always updated
//         };

//         // Condition to specify the row to be updated
//         const condition = { id: id };

//         // Perform the update with the new category data
//         Category.update(updatedCategory, condition, (err, result) => {
//             if (err) {
//                 req.flash('error', `${err.message}`);
//                 res.redirect(`/admin/category/edit/${id}`);
//                 return;
//             }
//             req.flash('success', 'Data berhasil diperbarui.');
//             res.redirect('/admin/category');
//         });
//     });
// };

categoryController.update = (req, res) => {
    const { id } = req.params;
    let { jenis_sampah, harga_perkilo, periode_bulan } = req.body;

    // Ensure harga_perkilo is a number
    harga_perkilo = parseFloat(harga_perkilo);

    // Prepare data for updating
    let category = { jenis_sampah, harga_perkilo };

    // Only include 'periode_bulan' if it's provided (not empty)
    if (periode_bulan) {
        category.periode_bulan = periode_bulan;
    }

    Category.update(id, category, (err, rowsAffected) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect(`/admin/category/edit/${id}`);
            return;
        }
        req.flash('success', `Data berhasil diperbarui`);
        res.redirect('/admin/category');
    });
};


// Menghapus data kategori
categoryController.delete = (req, res) => {
    const { id } = req.params;
    Category.delete(id, (err) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/category');
            return;
        }
        req.flash('success', 'Data berhasil dihapus.');
        res.redirect('/admin/category');
    });
};

// Menampilkan laporan penjualan
categoryController.report = (req, res) => {
    const query = `
        SELECT jenis_sampah, 
               harga_perkilo, 
               SUM(harga_perkilo) AS total_penjualan 
        FROM sampah 
        GROUP BY jenis_sampah, harga_perkilo`;

    Category.customQuery(query, (err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.render('admin/category/report', { data: [] });
            return;
        }
        res.render('admin/category/report', { data: rows });
    });
};

module.exports = categoryController;
