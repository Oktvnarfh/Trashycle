const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const withdrawController = require('../controllers/withdrawController');

// Middleware to protect dashboard
const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Silakan login terlebih dahulu untuk melanjutkan.');
        return res.redirect('/home/login');
    }
    next();
};
// Define the route for /home
router.get('/', homeController.index);
router.get('/login', homeController.login);
router.post('/login', homeController.loginSubmit);
router.get('/register', homeController.register);
router.post('/register', homeController.registerSubmit);
router.get('/logout', homeController.logout);

router.get('/dashboard', isAuthenticated, homeController.dashboard);
router.get('/recycling-guide', homeController.guide);
router.get('/tips/:id', homeController.tips);
router.get('/blog', homeController.blog);
router.get('/detail-blog/:id', homeController.detailBlog);
router.get('/about-us', homeController.about);
router.get('/education-video', homeController.videos);
router.get('/form', isAuthenticated, homeController.form);
router.post('/submit-form', isAuthenticated, homeController.formSubmit);
router.get('/cancel/:id', isAuthenticated, homeController.cancelTransaction);
// Ensure you are using PUT for this route
router.put('/dashboard/edit/:id', isAuthenticated, homeController.editUser);


// Withdraw Routes
router.post('/request-withdrawal', isAuthenticated, withdrawController.requestWithdrawal);

module.exports = router;
