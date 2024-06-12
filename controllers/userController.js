const CommonModel = require('../models/commonModel');
const Category = new CommonModel('category');
const Article = new CommonModel('article');
const Location = new CommonModel('locations');
const db = require('../database/config');

const userController = {};

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Ganti dengan direktori penyimpanan file Anda
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 } // Batas ukuran file dalam byte (contoh: 10MB)
});


userController.home = (req, res) => {
    Category.getAll((err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            res.render('user/home', { data: rows });
        }
    });
};

userController.login = (req, res) => {
    res.render('user/login');
};

userController.blog = (req, res) => {
    Article.getAll((err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            res.render('user/blog', { data: rows });
        }
    });
};

userController.team = (req, res) => {
    res.render('user/team');
};

userController.everyone = (req, res) => {
    res.render('user/everyone');
};

userController.bussiness = (req, res) => {
    res.render('user/bussiness');
};

userController.about = (req, res) => {
    res.render('user/about');
};

userController.detail = (req, res) => {
    res.render('user/dropOffDetail');
};

userController.dropdetail = (req, res) => {
    res.render('user/dropOff');
};

userController.detailBlog = (req, res) => {
    // Mendapatkan id artikel dari parameter URL
    const { id } = req.params;

    // Mengambil data artikel dari database berdasarkan id
    Article.getById(id, (err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            // Mengirimkan data artikel ke halaman detail-blog.ejs
            res.render('user/detail-blog', { article: rows[0] });
        }
    });
};

userController.form = (req, res) => {
    Category.getAll((err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            res.render('user/form', { data: rows });
        }
    });
};

// Definisikan route untuk menerima permintaan formulir submit
userController.submitForm = (req, res) => {
    // Gunakan multer untuk menangani formulir multipart
    upload.single('img_logo')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
            return;
        }

        // Pastikan semua data yang dibutuhkan tersedia dalam permintaan
        const { name, address, province, city, postcode, email, phone, selectedCategories, schedule } = req.body;
        const image = req.file ? req.file.filename : null;

        const newLocation = {
            name,
            address,
            province,
            city,
            postcode,
            email,
            phone,
            image,
            createdAt: new Date()
        };

        // Simpan data lokasi baru ke dalam database
        Location.create(newLocation, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create location' });
                return;
            } else {
                // Jika data lokasi berhasil disimpan, ambil ID lokasi yang baru ditambahkan
                const locationId = result.insertId;

                // Ambil ID kategori yang dipilih dari data JSON yang dikirim dari klien
                const categoryIds = JSON.parse(selectedCategories);

                // Update kategori lokasi dalam database
                const locationCategoryQuery = 'UPDATE locations SET category_id = ? WHERE id = ?';
                db.query(locationCategoryQuery, [categoryIds[0], locationId], (error, results) => {
                    if (error) {
                        console.error(error);
                        res.status(500).json({ error: 'Failed to update location category' });
                        return;
                    } else {
                        // Jika kategori berhasil diperbarui, tambahkan jadwal operasional lokasi
                        const scheduleEntries = JSON.parse(schedule).map(day => [locationId, day.day, day.open_time, day.close_time]);
                        const scheduleQuery = 'INSERT INTO location_schedules (location_id, day, open_time, close_time) VALUES ?';
                        db.query(scheduleQuery, [scheduleEntries], (error, results) => {
                            if (error) {
                                console.error(error);
                                res.status(500).json({ error: 'Failed to add location schedules' });
                                return;
                            } else {
                                // Jika jadwal berhasil ditambahkan, kirim respons sukses dengan ID lokasi yang baru ditambahkan
                                res.status(200).json({ locationId });
                            }
                        });
                    }
                });
            }
        });
    });
};


userController.dropOffDetail = (req, res) => {
    Location.getLocationsWithDetails((err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            // Organize data by location
            const locations = [];
            const locationsMap = {};

            rows.forEach(row => {
                if (!locationsMap[row.id]) {
                    locationsMap[row.id] = {
                        id: row.id,
                        name: row.name,
                        address: row.address,
                        province: row.province,
                        city: row.city,
                        postcode: row.postcode,
                        email: row.email,
                        phone: row.phone,
                        createdAt: row.createdAt,
                        image: row.image,
                        category_name: row.category_name,
                        schedules: []
                    };
                    locations.push(locationsMap[row.id]);
                }

                if (row.day) {
                    locationsMap[row.id].schedules.push({
                        day: row.day,
                        open_time: row.open_time,
                        close_time: row.close_time
                    });
                }
            });

            res.render('user/dropOff', { locations: locations });
        }
    });
};



module.exports = userController;