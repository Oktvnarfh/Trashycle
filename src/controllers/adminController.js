const bcrypt = require('bcryptjs');
const CommonModel = require('../models/commonModel');
const Admin = new CommonModel('admin');

// Helper function to check if admin is logged in
function isAuthenticated(req) {
    return req.session && req.session.adminId;
}

module.exports = {
    dashboard: async (req, res) => {
        try {
            const adminId = req.session.adminId;
    
            // Menghitung total penerimaan dari transaksi yang selesai
            const penerimaan = await Admin.getAllWithJoin(
                `SELECT SUM(total_uang) AS total FROM transaksi WHERE status = 'complete'`,
                []
            );
    
            // Menghitung total pengeluaran dari tarik saldo yang disetujui
            const pengeluaran = await Admin.getAllWithJoin(
                `SELECT SUM(points) AS total FROM tarik_saldo WHERE status = 'completed'`,
                []
            );
    
            // Hitung total pendapatan (saldo akhir)
            const totalPendapatan = (penerimaan[0]?.total || 0) - (pengeluaran[0]?.total || 0);
    
            const totalSampah = await Admin.getAllWithJoin(
                'SELECT SUM(jumlah) AS total FROM dtl_transaksi',
                []
            );
    
            const totalTransaksi = await Admin.getAllWithJoin(
                'SELECT COUNT(id) AS total FROM transaksi',
                []
            );
    
            const nasabahAktif = await Admin.getAllWithJoin(
                'SELECT COUNT(id) AS total FROM nasabah WHERE keterangan = "aktif"',
                []
            );
    
            // Kirim data ke template
            res.render('admin/dashboard', {
                adminId,
                totalPendapatan: totalPendapatan.toFixed(2),
                totalSampah: totalSampah[0]?.total || 0,
                totalTransaksi: totalTransaksi[0]?.total || 0,
                nasabahAktif: nasabahAktif[0]?.total || 0,
            });
        } catch (err) {
            console.error(err);
            res.render('admin/dashboard', {
                adminId: req.session.adminId,
                totalPendapatan: 0,
                totalSampah: 0,
                totalTransaksi: 0,
                nasabahAktif: 0,
                error: 'Failed to load data.',
            });
        }
    },

    // Login page
    login: (req, res) => {
        res.render('admin/login', { messages: {} });
    },

    // Handle login POST request
    loginPost: (req, res) => {
        const { username, password } = req.body;
    
        // Check if username and password are provided
        if (!username || !password) {
            req.flash('error', 'Username and password are required.');
            return res.redirect('/admin');
        }
    
        // Find the admin with the given username
        Admin.find({ username: username }, async (err, results) => {
            if (err) {
                req.flash('error', 'Error during login.');
                console.error('Database error:', err); // Debugging line
                return res.redirect('/admin');
            }
    
            if (results.length === 0) {
                req.flash('error', 'Username not found.');
                console.log('Username not found:', username); // Debugging line
                return res.redirect('/admin');
            }
    
            const admin = results[0];
    
            // Debugging: Check the stored hashed password in the database
            console.log('Stored hashed password:', admin.password); // Debugging line
    
            // Compare password with the hashed password in the database
            try {
                const isPasswordValid = await bcrypt.compare(password, admin.password);
    
                if (isPasswordValid) {
                    // Store admin ID in session
                    req.session.adminId = admin.id;
                    req.flash('success', 'Login successful');
                    console.log('Login successful for user:', admin.username); // Debugging line
                    return res.redirect('/admin/dashboard');
                } else {
                    req.flash('error', 'Incorrect password.');
                    console.log('Incorrect password attempt for:', username); // Debugging line
                    return res.redirect('/admin');
                }
            } catch (error) {
                req.flash('error', 'Error during password comparison.');
                console.error('Error during bcrypt comparison:', error); // Debugging line
                return res.redirect('/admin');
            }
        });
    },

    // Logout function
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send("Failed to destroy session");
            }
            res.redirect('/admin');
        });
    },
};
