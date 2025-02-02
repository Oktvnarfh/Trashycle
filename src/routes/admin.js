const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const transactionController = require('../controllers/transactionController');
const tabulationController = require('../controllers/tabulationController');
const videoController = require('../controllers/videoController');
const withdrawController = require('../controllers/withdrawController');
const recapController = require('../controllers/recapController');

// Middleware to protect dashboard
const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.adminId) {
        return res.redirect('/admin/');
    }
    next();
};

// Routes for Dashboard
router.get('/', adminController.login);
router.post('/login', adminController.loginPost);
router.get('/logout', adminController.logout);
router.get('/dashboard', isAuthenticated, adminController.dashboard);

// Routes for CRUD Profile
router.get('/profile', isAuthenticated, profileController.index);
router.get('/profile/edit/:id', isAuthenticated, profileController.edit);
router.put('/profile/update/:id', isAuthenticated, profileController.update);

// Routes for CRUD Articles
router.get('/article', isAuthenticated, articleController.index); 
router.get('/article/add', isAuthenticated, articleController.add); 
router.post('/article/store', isAuthenticated, articleController.upload, articleController.store); 
router.get('/article/edit/:id', isAuthenticated, articleController.edit); 
router.put('/article/update/:id', isAuthenticated, articleController.upload, articleController.update);
router.delete('/article/delete/:id', isAuthenticated, articleController.delete);

// Routes for CRUD Categories
router.get('/category', isAuthenticated, categoryController.index);
router.get('/category/add', isAuthenticated, categoryController.add);
router.post('/category/store', isAuthenticated, categoryController.store);
router.get('/category/edit/:id', isAuthenticated, categoryController.edit);
router.put('/category/update/:id', isAuthenticated, categoryController.update);
router.delete('/category/delete/:id', isAuthenticated, categoryController.delete);
router.get('/category/report', isAuthenticated, categoryController.report);

// Routes for CRUD Users
router.get('/users', isAuthenticated, userController.index); 
router.get('/users/add', isAuthenticated, userController.add); 
router.post('/users/store', isAuthenticated, userController.store); 
router.get('/users/edit/:id', isAuthenticated, userController.edit);
router.post('/users/update/:id', isAuthenticated, userController.update);
router.delete('/users/delete/:id',  isAuthenticated, userController.delete); 
router.get('/users/report', isAuthenticated, userController.report);

// Routes for CRUD Transactions
router.get('/transactions', isAuthenticated, transactionController.index); 
router.get('/transactions/add', isAuthenticated, transactionController.add);
router.post('/transactions/store', isAuthenticated, transactionController.store); 
router.get('/transactions/edit/:id', isAuthenticated, transactionController.edit);
router.post('/transactions/update/:id', isAuthenticated, transactionController.update);
router.delete('/transactions/delete/:id',  isAuthenticated, transactionController.delete); 
router.get('/transactions/report', isAuthenticated, transactionController.report);

// Routes for Tabulations
router.get('/tabulations', isAuthenticated, tabulationController.index); 

// Routes for Recap
router.get('/recap', isAuthenticated, recapController.index); // Menampilkan rekap kas


// Routes for CRUD Videos
router.get('/videos', isAuthenticated, videoController.index);
router.get('/videos/add', isAuthenticated, videoController.add);
router.post('/videos/store', isAuthenticated, videoController.store);
router.get('/videos/edit/:id', isAuthenticated, videoController.edit);
router.put('/videos/update/:id', isAuthenticated, videoController.update);
router.delete('/videos/delete/:id', isAuthenticated, videoController.delete);

// Routes for Withdrawals
router.get('/withdrawals', withdrawController.viewWithdrawals);
router.get('/withdrawals/add', withdrawController.addWithdrawals);
router.post('/withdrawals/store', withdrawController.storeWithdrawals);
router.get('/withdrawals/edit/:id', withdrawController.editWithdrawals);
router.put('/withdrawals/update/:id', withdrawController.updateStatus);


module.exports = router;
