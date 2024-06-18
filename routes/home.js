const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer

const userController = require('../controllers/userController');

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
    limits: { fileSize: 1024 * 1024 * 10 }
});

// Dashboard user
router.get('/', userController.home);
router.get('/blog', userController.blog);
router.get('/detail-blog/:id', userController.detailBlog);
router.get('/team', userController.team);
router.get('/everyone', userController.everyone);
router.get('/bussiness', userController.bussiness);
router.get('/about', userController.about);
router.get('/login', userController.login);
// Gunakan middleware upload untuk route POST '/submit-form'
router.get('/form', userController.form);
router.post('/submit-form', upload.single('img_logo'), userController.submitForm);
router.get('/detail/:id', userController.detail);
router.get('/drop-detail/:id', userController.dropOffDetail);
router.get('/find-drop-off', userController.findDropOff);
router.get('/panduan', userController.panduan);
router.get('/tips/:id', userController.tips);
// router.get('/register', userController.register);

module.exports = router;
