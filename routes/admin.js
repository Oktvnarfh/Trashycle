const express = require('express');
const router = express.Router();
const multer = require('multer');

const adminController = require('../controllers/adminController');
const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');

// Middleware requireAuth
const requireAuth = (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/');
  }
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Admin signup and login routes
router.get('/', adminController.login);
router.post('/login', adminController.loginPost);
// router.get('/signup', adminController.signup);
// router.post('/signup', adminController.signupPost);
router.get('/logout', adminController.logout);

// Dashboard admin
router.get('/dashboard', requireAuth, adminController.dashboard);

// Routes for CRUD articles
router.get('/article', requireAuth, articleController.index); // Protect routes
router.get('/article/add', requireAuth, articleController.add); // Protect routes
router.post('/article/store', requireAuth, upload.single('thumbnail'), articleController.store); // Protect routes
router.get('/article/edit/:id', requireAuth, articleController.edit); // Protect routes
router.put('/article/update/:id', requireAuth, upload.single('thumbnail'), articleController.update); // Protect routes
router.delete('/article/delete/:id', requireAuth, articleController.delete); // Protect routes

// Routes for CRUD categories
router.get('/category', requireAuth, categoryController.index); // Protect routes
router.get('/category/add', requireAuth, categoryController.add); // Protect routes
router.post('/category/store', requireAuth, upload.single('image'), categoryController.store); // Protect routes
router.get('/category/edit/:id', requireAuth, categoryController.edit); // Protect routes
router.put('/category/update/:id', requireAuth, upload.single('image'), categoryController.update); // Protect routes
router.delete('/category/delete/:id', requireAuth, categoryController.delete); // Protect routes


module.exports = router;
