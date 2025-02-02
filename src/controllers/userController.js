const CommonModel = require('../models/commonModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const userController = {};
const Users = new CommonModel('nasabah');

userController.index = (req, res) => {
    Users.getAll((err, rows) => {
        if (err) {
            req.flash('error', `${err.message}`);
            res.render('admin/users/index', { data: [] });
            return;
        }
        res.render('admin/users/index', { data: rows });
    });
};

userController.add = (req, res) => {
    Users.getLastNoUrut((err, lastNoUrut) => {
        if (err) {
            req.flash('error', `Error fetching no_urut: ${err.message}`);
            return res.render('admin/users/add');
        }

        const noUrut = String(lastNoUrut + 1).padStart(3, '0');
        const now = new Date();
        const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
        const noRekening = `${noUrut}/${monthYear}/`;

        res.render('admin/users/add', { noUrut, monthYear, noRekening });
    });
};

userController.store = (req, res) => {
    const { nama_lengkap, gender, keterangan, rt_rw } = req.body;
    if (!nama_lengkap || !gender || !keterangan || !rt_rw) {
        req.flash('error', 'Semua field harus diisi.');
        return res.redirect('/admin/users/add');
    }
    Users.getLastNoUrut((err, lastNoUrut) => {
        if (err) {
            req.flash('error', `Gagal mendapatkan no_urut: ${err.message}`);
            return res.redirect('/admin/users/add');
        }
        const noUrut = String(lastNoUrut + 1).padStart(3, '0');
        const now = new Date();
        const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
        const noRekening = `${noUrut}/${monthYear}/${rt_rw}`;
        const data = {
            no_urut: noUrut,
            nama_lengkap,
            gender,
            no_rekening: noRekening,
            keterangan,
        };
        Users.create(data, (err) => {
            if (err) {
                req.flash('error', `Gagal menambahkan nasabah: ${err.message}`);
                return res.redirect('/admin/users/add');
            }
            req.flash('success', 'Nasabah berhasil ditambahkan');
            res.redirect('/admin/users');
        });
    });
};


userController.edit = (req, res) => {
    const { id } = req.params;

    Users.getById(id, (err, rows) => {
        if (err) {
            req.flash('error', `Gagal mengambil data nasabah: ${err.message}`);
            return res.redirect('/admin/users');
        }

        if (!rows || rows.length === 0) {
            req.flash('error', 'Nasabah tidak ditemukan');
            return res.redirect('/admin/users');
        }

        const user = rows[0];
        res.render('admin/users/edit', { user });
    });
};

userController.update = (req, res) => {
    const { id } = req.params;
    const { nama_lengkap, gender, keterangan, no_rekening } = req.body;

    console.log('Request Body:', req.body); // Debug data yang diterima

    if (!nama_lengkap || !gender || !keterangan || !no_rekening) {
        req.flash('error', 'Semua field harus diisi.');
        return res.redirect(`/admin/users/edit/${id}`);
    }

    const data = {
        nama_lengkap,
        gender,
        keterangan,
        no_rekening,
    };

    Users.update(id, data, (err, result) => {
        if (err) {
            req.flash('error', `Gagal memperbarui nasabah: ${err.message}`);
            return res.redirect(`/admin/users/edit/${id}`);
        }

        req.flash('success', 'Nasabah berhasil diperbarui.');
        res.redirect('/admin/users');
    });
};


userController.delete = (req, res) => {
    const { id } = req.params;

    Users.delete({ id }, (err, result) => {
        if (err) {
            req.flash('error', `${err.message}`);
            return res.redirect('/admin/users');
        }
        req.flash('success', 'Nasabah berhasil dihapus');
        res.redirect('/admin/users');
    });
};

userController.report = (req, res) => {
    Users.getAll((err, rows) => {
        if (err) {
            req.flash('error', 'Gagal mengambil data laporan');
            return res.redirect('/admin/users');
        }
        res.render('admin/users/report', { data: rows });
    });
};


module.exports = userController;