const CommonModel = require('../models/commonModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const profileController = {};
const Profile = new CommonModel('admin');

profileController.index = (req, res) => {
    Profile.getAll((err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            return res.render('admin/profile/index', { profile: null, messages: req.flash() });
        }
        res.render('admin/profile/index', { profile: rows[0], messages: req.flash() }); // Asumsi hanya ada satu profil
    });
};


profileController.edit = (req, res) => {
    const id = req.params.id;
    Profile.getById(id, (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Profil tidak ditemukan');
            return res.redirect('/admin/profile');
        }
        res.render('admin/profile/edit', { profile: results[0], messages: req.flash() });
    });
};


profileController.update = (req, res) => {
    const id = req.params.id;
    const { nama_bank_sampah, lokasi, nomor_telepon, email, username, password, update_at } = req.body;
    const updatedProfile = { nama_bank_sampah, lokasi, nomor_telepon, email, username, password, update_at };

    Profile.update(id, updatedProfile, (err) => {
        if (err) {
            req.flash('error', 'Gagal memperbarui profil');
            return res.redirect(`/admin/profile/edit/${id}`);
        }
        req.flash('success', 'Profil berhasil diperbarui');
        res.redirect('/admin/profile');
    });
};

module.exports = profileController;