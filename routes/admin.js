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
router.get('/dashboard', adminController.dashboard);
// router.get('/locations', dropController.getLocations);

// Routes for CRUD articles
router.get('/article', articleController.index); 
router.get('/article/add',  articleController.add); 
router.post('/article/store', upload.single('thumbnail'), articleController.store); 
router.get('/article/edit/:id', articleController.edit); 
router.put('/article/update/:id', upload.single('thumbnail'), articleController.update);
router.delete('/article/delete/:id', articleController.delete); 

// Routes for CRUD categories
router.get('/category', categoryController.index); 
router.get('/category/add', categoryController.add); 
router.post('/category/store',  upload.single('image'), categoryController.store); 
router.get('/category/edit/:id',  categoryController.edit); 
router.put('/category/update/:id',  upload.single('image'), categoryController.update); 
router.delete('/category/delete/:id',  categoryController.delete); 


module.exports = router;

