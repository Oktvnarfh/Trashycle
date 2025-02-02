const CommonModel = require('../models/commonModel');
const withdrawController = {};

const Users = new CommonModel('nasabah');
const TarikSaldo = new CommonModel('tarik_saldo');

withdrawController.viewWithdrawals = (req, res) => {
    TarikSaldo.getWithdrawalsWithUsers((err, rows) => {
        if (err) {
            console.error('Error fetching withdrawals with users:', err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            res.render('admin/withdrawals/index', { data: rows, user: req.user });
        }
    });
};

// Admin add user withdrawal
withdrawController.addWithdrawals = (req, res) => {
    Users.getAll((err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            req.flash('error', 'Failed to load users.');
            return res.redirect('/admin/withdrawals');
        }
        res.render('admin/withdrawals/add', { users });
    });
};

withdrawController.storeWithdrawals = (req, res) => {
    const { user_id, points, status } = req.body;
    if (!user_id || !points || !status) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/admin/withdrawals/add');
    }
    Users.getById(user_id, (err, userData) => {
        if (err || !userData.length) {
            console.error('User not found:', err || 'No data returned');
            req.flash('error', 'User not found.');
            return res.redirect('/admin/withdrawals/add');
        }
        const user = userData[0];
        if (user.saldo < points) {
            req.flash('error', 'Insufficient points.');
            return res.redirect('/admin/withdrawals/add');
        }
        const withdrawalData = {
            user_id,
            points,
            status,
            created_at: new Date(),
            updated_at: new Date(),
        };
        TarikSaldo.create(withdrawalData, (err) => {
            if (err) {
                console.error('Failed to add withdrawal:', err);
                req.flash('error', 'Failed to add withdrawal.');
                return res.redirect('/admin/withdrawals/add');
            }
            Users.addPoints(user_id, -points, (err) => {
                if (err) {
                    console.error('Failed to deduct user points:', err);
                    req.flash('error', 'Failed to update user points.');
                } else {
                    req.flash('success', 'Data berhasil ditambahkan!');
                }
                res.redirect('/admin/withdrawals');
            });
        });
    });
};


// withdrawController.requestWithdrawal = (req, res) => {
//     if (!req.session.user) {
//         req.flash('error', 'Anda harus login terlebih dahulu.');
//         return res.redirect('/home/login');
//     }

//     const userId = req.session.user.id;
//     const { points } = req.body;

//     // Pastikan ada jumlah saldo yang dimasukkan
//     if (!points || points <= 0) {
//         req.flash('error', 'Jumlah saldo tidak valid.');
//         return res.redirect('/home/dashboard');
//     }

//     // Simpan data tarik saldo ke dalam database
//     const withdrawalData = {
//         user_id: userId,
//         points,
//         status: 'pending'
//     };

//     TarikSaldo.create(withdrawalData)
//         .then(result => {
//             req.flash('success', 'Request tarik saldo berhasil.');
//             res.redirect('/home/dashboard');
//         })
//         .catch(err => {
//             console.error('Error saving withdrawal request:', err);
//             req.flash('error', 'Terjadi kesalahan. Silakan coba lagi.');
//             res.redirect('/home/dashboard');
//         });
// };

// withdrawController.js
// withdrawController.js
withdrawController.requestWithdrawal = (req, res) => {
    if (!req.session.user) {
      req.flash('error', 'Anda harus login terlebih dahulu.');
      return res.redirect('/home/login');
    }
  
    const userId = req.session.user.id;
    const { points } = req.body;
  
    // Pastikan ada jumlah saldo yang dimasukkan
    if (!points || points <= 0) {
      req.flash('error', 'Jumlah saldo tidak valid.');
      return res.redirect('/home/dashboard');
    }
  
    // Simpan data tarik saldo ke dalam database
    const withdrawalData = {
      user_id: userId,
      points,
      status: 'pending'
    };
  
    const tarikSaldo = new CommonModel('tarik_saldo');
    
    // Gunakan callback seperti pada create di commonModel
    tarikSaldo.create(withdrawalData, (err, result) => {
      if (err) {
        console.error('Error saving withdrawal request:', err);
        req.flash('error', 'Terjadi kesalahan. Silakan coba lagi.');
        return res.redirect('/home/dashboard');
      }
  
      req.flash('success', 'Request tarik saldo berhasil.');
      res.redirect('/home/dashboard');
    });
  };
  

withdrawController.editWithdrawals = (req, res) => {
    const { id } = req.params;
    console.log('ID dari URL:', id);
    TarikSaldo.getById(id, (err, rows) => {
        if (err || rows.length === 0) {
            console.error('Error fetching withdrawal for edit:', err || 'Withdrawal not found');
            req.flash('error', 'Withdrawal not found or internal error occurred.');
            return res.redirect('/admin/withdrawals');
        }

        res.render('admin/withdrawals/edit', { withdrawal: rows[0] });
    });
};

// Admin updates withdrawal status
withdrawController.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    TarikSaldo.getById(id, (err, withdrawalData) => {
        if (err || !withdrawalData.length) {
            req.flash('error', 'Penarikan tidak ditemukan.');
            return res.redirect('/admin/withdrawals');
        }

        const { user_id, points } = withdrawalData[0];

        if (status === 'completed') {
            Users.getById(user_id, (err, userData) => {
                if (err || !userData.length) {
                    req.flash('error', 'Pengguna tidak ditemukan.');
                    return res.redirect('/admin/withdrawals');
                }

                const userSaldo = userData[0].saldo;
                if (userSaldo < points) {
                    req.flash('error', 'Saldo tidak mencukupi untuk menyelesaikan penarikan.');
                    return res.redirect('/admin/withdrawals');
                }

                // Kurangi saldo nasabah
                Users.addPoints(user_id, -points, (err) => {
                    if (err) {
                        req.flash('error', 'Gagal mengurangi saldo pengguna.');
                        return res.redirect('/admin/withdrawals');
                    }

                    // Update status penarikan
                    TarikSaldo.update(id, { status, updated_at: new Date() }, (err) => {
                        if (err) {
                            req.flash('error', 'Gagal memperbarui status penarikan.');
                            return res.redirect('/admin/withdrawals');
                        }
                        req.flash('success', 'Status penarikan berhasil diperbarui.');
                        res.redirect('/admin/withdrawals');
                    });
                });
            });
        } else {
            // Jika status tidak "completed", cukup perbarui statusnya saja
            TarikSaldo.update(id, { status, updated_at: new Date() }, (err) => {
                if (err) {
                    req.flash('error', 'Gagal memperbarui status penarikan.');
                    return res.redirect('/admin/withdrawals');
                }
                req.flash('success', 'Status penarikan berhasil diperbarui.');
                res.redirect('/admin/withdrawals');
            });
        }
    });
};

module.exports = withdrawController;