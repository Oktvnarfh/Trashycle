const CommonModel = require('../models/CommonModel'); // Pastikan mengimpor CommonModel
const adminModel = new CommonModel('admin');

module.exports = {
    dashboard: (req, res) => {
        if (!req.session.adminId) {
          return res.redirect('/admin/');
        }
        res.render('admin/dashboard');
    },

    // login: (req, res) => {
    //     res.render('admin/login');
    // },

    // signup: (req, res) => {
    //     res.render('admin/register');
    // },

    // signupPost: (req, res) => {
    //     const { username, password } = req.body;
    //     adminModel.create({ username, password }, (err, result) => {
    //       if (err) {
    //         return res.status(500).json({ error: 'Server error' });
    //       }
    //       res.redirect('/admin/login');
    //     });
    //   },
    
    login: (req, res) => {
        res.render('admin/login');
      },
    
      loginPost: (req, res) => {
        const { username, password } = req.body;
        adminModel.getByUsername(username, (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'Server error' });
          }
          if (results.length === 0 || results[0].password !== password) {
            req.flash('error', 'Invalid username or password'); // Pesan untuk login gagal
            return res.redirect('/admin/login');
          }
    
          // Set a session or cookie (simple example)
          req.session.adminId = results[0].id;
          req.flash('success', 'Login successful'); // Pesan untuk login berhasil
          res.redirect('/admin/dashboard'); // Redirect to dashboard page after successful login
        });
      },
    
      logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Server error' });
            }
            // req.flash('success', 'Logout successful'); // Pesan untuk logout berhasil
            res.redirect('/admin/'); // Redirect ke halaman login setelah logout berhasil
        });
    }
};