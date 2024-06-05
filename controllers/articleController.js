// articleController.js

const CommonModel = require('../models/commonModel');

const articleController = {};
const Article = new CommonModel('article');

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
    const { title, body, author } = req.body;
    const thumbnail = req.file.filename; 
    const createdAt = new Date();
    
    const article = { title, body, author, thumbnail, createdAt };

    Article.create(article, (err, result) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/article/add');
            return;
        }
        req.flash('success', `Data berhasil ditambahkan`);
        res.redirect('/admin/article');
    });
};

articleController.edit = (req, res) => {
    const { id } = req.params;
    Article.getById(id, (err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/article');
            return;
        }
        // Log data artikel yang diambil dari database
        console.log('Data artikel yang diambil dari database:', rows);
        res.render('admin/article/edit', { article: rows[0] }); // Access first element of rows array
    });
};

articleController.update = (req, res) => {
    const { id } = req.params;
    const { title, body, author } = req.body;
    const oldThumbnail = req.body.old_thumbnail;
    let thumbnail = oldThumbnail;

    if (req.file) {
        thumbnail = req.file.filename;
    }

    const article = { title, body, author, thumbnail };

    Article.update(id, article, (err, rowsAffected) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect(`/admin/article/edit/${id}`);
            return;
        }
        req.flash('success', `Article with ID ${id} updated`);
        res.redirect('/admin/article');
    });
};

articleController.delete = (req, res) => {
    const { id } = req.params;
    Article.delete(id, (err, rowsAffected) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.redirect('/admin/article');
            return;
        }
        req.flash('success', `Article with ID ${id} deleted`);
        res.redirect('/admin/article');
    });
};

module.exports = articleController;
