const multer = require('multer');
const fs = require('fs'); 
const path = require('path');
const CommonModel = require('../models/commonModel');

const articleController = {};
const Article = new CommonModel('artikel');

// Konfigurasi multer untuk upload file dengan nama unik
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Menyimpan file di folder 'public/uploads/article/'
        cb(null, path.join(__dirname, '../public/uploads/article/'));
    },
    filename: function (req, file, cb) {
        // Menggunakan timestamp dan nama file asli sebagai nama file yang unik
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });
articleController.upload = upload.single('foto');

articleController.index = (req, res) => {
    Article.getAll((err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.render('admin/article/index', { data: [] });
            return;
        }
        res.render('admin/article/index', { data: rows });
    });
};

articleController.add = (req, res) => {
    res.render('admin/article/add');
};

articleController.store = (req, res) => {
    const { judul, isi, penulis } = req.body;
    const foto = req.file ? req.file.filename : null;  // Ensure photo exists
    const tanggal = new Date();

    const article = { judul, isi, penulis, foto, tanggal };

    Article.create(article, (err, result) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/article/add');
            return;
        }
        req.flash('success', `Article successfully added.`);
        res.redirect('/admin/article');
    });
};

// Edit article
articleController.edit = (req, res) => {
    const { id } = req.params;
    Article.getById(id, (err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/article');
            return;
        }
        res.render('admin/article/edit', { article: rows[0] });
    });
};

// Update article
articleController.update = (req, res) => {
    const { id } = req.params;
    const { judul, isi, penulis, old_thumbnail } = req.body;
    let foto = old_thumbnail;  // Use old thumbnail by default

    if (req.file) {
        foto = req.file.filename;  // If new file uploaded, update foto
        // Delete the old file from the server if it exists
        const oldFilePath = path.join(__dirname, '../public/uploads/article/', old_thumbnail);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);  // Delete old file
        }
    }

    const article = { judul, isi, penulis, foto };

    Article.update(id, article, (err, rowsAffected) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect(`/admin/article/edit/${id}`);
            return;
        }
        req.flash('success', `Article with ID ${id} updated.`);
        res.redirect('/admin/article');
    });
};

// Delete article
articleController.delete = (req, res) => {
    const { id } = req.params;

    // Pertama, dapatkan data artikel berdasarkan id untuk mendapatkan nama file
    Article.getById(id, (err, rows) => {
        if (err || rows.length === 0) {
            req.flash('error', `Article with ID ${id} not found.`);
            res.redirect('/admin/article');
            return;
        }

        const article = rows[0];
        const filePath = path.join(__dirname, '../public/uploads/article/', article.foto);

        // Hapus file gambar jika ada
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Failed to delete file:', unlinkErr);
                }
            });
        }

        // Hapus artikel dari database
        Article.delete({ id: id }, (deleteErr, rowsAffected) => {
            if (deleteErr) {
                req.flash('error', `Failed to delete article: ${deleteErr.message}`);
                res.redirect('/admin/article');
                return;
            }

            req.flash('success', `Article with ID ${id} deleted successfully.`);
            res.redirect('/admin/article');
        });
    });
};

module.exports = articleController;
