const CommonModel = require('../models/commonModel');
const Category = new CommonModel('category');
const Article = new CommonModel('article');
const LocationModel = new CommonModel('locations');
const LocationCategoryModel = new CommonModel('location_categories');
const LocationScheduleModel = new CommonModel('location_schedules');
const db = require('../database/config');
const multer = require('multer');
const path = require('path'); // Import the path module
const fs = require('fs');

const userController = {};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/user');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 } // 10MB limit
}).single('img_logo');

const panduanFilePath = path.join(__dirname, '../public/data/panduan.json');

// Function to read panduan data from file
function getPanduanData(callback) {
    fs.readFile(panduanFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading panduan.json:', err);
            callback(err, null);
            return;
        }
        const panduanData = JSON.parse(data);
        callback(null, panduanData);
    });
}


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
    Category.getAll((err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            res.render('user/everyone', { data: rows });
        }
    });
};

userController.bussiness = (req, res) => {
    res.render('user/bussiness');
};

userController.about = (req, res) => {
    res.render('user/about');
};

// userController.panduan = (req, res) => {
//     res.render('user/panduan');
// };

// userController.tips = (req, res) => {
//     res.render('user/tips');
// };

userController.panduan = (req, res) => {
    getPanduanData((err, panduanData) => {
        if (err) {
            console.error('Error getting panduan data:', err);
            res.render('error', { message: 'Internal Server Error', error: err });
            return;
        }
        res.render('user/panduan', { panduan: panduanData });
    });
};

userController.tips = (req, res) => {
    const { id } = req.params;
    getPanduanData((err, panduanData) => {
        if (err) {
            console.error('Error getting panduan data:', err);
            res.render('error', { message: 'Internal Server Error', error: err });
            return;
        }
        
        // Search for the category by id
        const tip = panduanData.organik.find(category => category.id === id);

        if (!tip) {
            console.error('Tip not found');
            res.render('error', { message: 'Tip not found', error: new Error('Tip not found') });
            return;
        }

        res.render('user/tips', { tip });
    });
};

userController.detail = (req, res) => {
    const { id } = req.params;
  
    LocationModel.getById(id, (err, rows) => {
      if (err) {
        console.error(err);
        res.render('error', { message: 'Internal Server Error', error: err });
      } else {
        if (rows.length === 0) {
          res.render('error', { message: 'Location not found', error: new Error('Location not found') });
          return;
        }
  
        const location = rows[0];
        res.render('user/dropOffDetail', { location });
      }
    });
  };

userController.dropdetail = (req, res) => {
    res.render('user/dropOff');
};

userController.findDropOff = (req, res) => {
    Category.getAll((err, categoryRows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            LocationModel.getAll((err, locationRows) => {
                if (err) {
                    console.error(err);
                    res.render('error', { message: 'Internal Server Error', error: err });
                } else {
                    res.render('user/findDropOff', { categories: categoryRows, locations: locationRows });
                }
            });
        }
    });
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

userController.submitForm = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const {
            name, address, province, city, postcode, email, phone, selectedCategories, schedule
        } = req.body;
        const imgLogo = req.file ? req.file.filename : null;

        // Log the JSON strings before parsing
        console.log('Selected Categories:', selectedCategories);
        console.log('Schedule:', schedule);

        // Safeguard JSON parsing with a try-catch and process each item in the array
        let categoryIds = [];
        let schedules;

        try {
            selectedCategories.forEach(cat => {
                if (cat) {
                    categoryIds = categoryIds.concat(JSON.parse(cat.trim()));
                }
            });
            schedules = JSON.parse(schedule.trim());
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(400).json({ error: 'Invalid JSON format' });
        }

        // Use the first category id for the location table
        const categoryId = categoryIds[0];

        const locationData = {
            name,
            address,
            province,
            city,
            postcode,
            email,
            phone,
            category_id: categoryId, // Add the first category id
            image: imgLogo,
            createdAt: new Date()
        };

        const locationId = await LocationModel.create(locationData);

        // Insert the remaining category associations into location_categories
        for (const id of categoryIds.slice(1)) {
            await LocationCategoryModel.create({ location_id: locationId, category_id: id });
        }

        for (const scheduleItem of schedules) {
            await LocationScheduleModel.create({
                location_id: locationId,
                day: scheduleItem.day,
                open_time: scheduleItem.open_time,
                close_time: scheduleItem.close_time
            });
        }

        res.json({ locationId });
        // res.redirect(`/home/drop-detail/${locationId}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

userController.dropOffDetail = (req, res) => {
    const { id } = req.params;
    LocationModel.getLocationWithDetails(id, (err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            if (rows.length === 0) {
                res.render('error', { message: 'Location not found', error: new Error('Location not found') });
                return;
            }

            const location = {
                id: rows[0].id,
                name: rows[0].name,
                address: rows[0].address,
                province: rows[0].province,
                city: rows[0].city,
                postcode: rows[0].postcode,
                email: rows[0].email,
                phone: rows[0].phone,
                createdAt: rows[0].createdAt,
                image: rows[0].image,
                category_name: rows[0].category_name,
                schedules: rows.map(row => ({
                    day: row.day,
                    open_time: row.open_time,
                    close_time: row.close_time
                }))
            };

            res.render('user/dropOff', { location });
        }
    });
};

module.exports = userController;