// categoryController.js

const CommonModel = require('../models/commonModel');

const categoryController = {};
const Category = new CommonModel('category');

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

categoryController.add = (req, res) => {
    res.render('admin/category/add');
};

categoryController.store = (req, res) => {
    const { name } = req.body;
    const image = req.file.filename; 
    const createdAt = new Date();
    
    const category = { name, image, createdAt };

    Category.create(category, (err, result) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/category/add');
            return;
        }
        req.flash('success', `Data berhasil ditambahkan`);
        res.redirect('/admin/category');
    });
};

categoryController.edit = (req, res) => {
    const { id } = req.params;
    Category.getById(id, (err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/category');
            return;
        }
        res.render('admin/category/edit', { category: rows[0] }); // Access first element of rows array
    });
};

categoryController.update = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const oldImage = req.body.old_image;
    let image = oldImage;

    if (req.file) {
        image = req.file.filename;
    }

    const category = { name, image };

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

categoryController.delete = (req, res) => {
    const { id } = req.params;
    Category.delete(id, (err, rowsAffected) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/category');
            return;
        }
        req.flash('success', `Data berhasil dihapus`);
        res.redirect('/admin/category');
    });
};

module.exports = categoryController;
