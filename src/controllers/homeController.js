const CommonModel = require('../models/commonModel');
const db = require('../config/database');
const path = require('path'); 
const fs = require('fs');
const bcrypt = require('bcryptjs'); // Tambahkan untuk hashing password
const moment = require('moment');
const homeController = {};

const Users = new CommonModel('nasabah');
const Admin = new CommonModel('admin');
const Transactions = new CommonModel('transaksi');
const Category = new CommonModel('sampah');
const Detail = new CommonModel('dtl_transaksi');
const Article = new CommonModel('artikel');
const Saldo = new CommonModel('tarik_saldo');
const Video = new CommonModel('video');

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

homeController.index = async (req, res) => {
    try {
        // Ambil total sampah dari transaksi yang selesai
        const [totalSampahResult] = await db.promise().query(
            "SELECT COALESCE(SUM(total_kg), 0) AS totalSampah FROM transaksi WHERE status = 'complete'"
        );
        const totalSampah = totalSampahResult[0].totalSampah;

        // Hitung total transaksi yang selesai
        const [totalTransaksiResult] = await db.promise().query(
            "SELECT COUNT(*) AS totalTransaksi FROM transaksi WHERE status = 'complete'"
        );
        const totalTransaksi = totalTransaksiResult[0].totalTransaksi;

        // Hitung total pengguna aktif
        const [totalUsersResult] = await db.promise().query(
            "SELECT COUNT(*) AS totalUsers FROM nasabah"
        );
        const totalUsers = totalUsersResult[0].totalUsers;

        // **Debugging: Pastikan `stats` tidak undefined**
        console.log({ totalSampah, totalTransaksi, totalUsers });

        // Kirim data ke `home.ejs`
        res.render('user/home', {
            messages: req.flash(),
            user: req.session.user || null,
            stats: {
                totalSampah: totalSampah || 0,
                totalTransaksi: totalTransaksi || 0,
                totalUsers: totalUsers || 0,
                totalPenghargaan: 32 // Sesuaikan jika ada data dari database
            }
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).send("Terjadi kesalahan server.");
    }
};

homeController.login = (req, res) => {
    res.render('user/login', { messages: req.flash(), user: null });
};

homeController.loginSubmit = (req, res) => {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        req.flash('error', 'Username dan password harus diisi.');
        return res.redirect('/home/login');
    }

    // Cek username di database
    Users.getByCondition({ username }, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            req.flash('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
            return res.redirect('/home/login');
        }

        if (results.length === 0) {
            req.flash('error', 'Username tidak ditemukan.');
            return res.redirect('/home/login');
        }

        const user = results[0];

        // Bandingkan password yang diinput dengan yang ada di database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                req.flash('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
                return res.redirect('/home/login');
            }

            if (!isMatch) {
                req.flash('error', 'Password salah.');
                return res.redirect('/home/login');
            }

            // Simpan informasi user di sesi, termasuk alamat
            req.session.user = {
                id: user.id,
                name: user.nama_lengkap,
                alamat: user.alamat, 
                telpon: user.no_telepon,
            };

            req.flash('success', `Selamat datang, ${user.nama_lengkap}!`);
            return res.redirect('/home');
        });
    });
};

homeController.register = (req, res) => {
    res.render('user/register', { messages: req.flash(), user: null });
};

homeController.registerSubmit = (req, res) => {
    const { nama_lengkap, gender, username, password, alamat, no_telepon, rt_rw } = req.body;

    console.log('Data yang diterima:', req.body); // Debugging
  
    if (!nama_lengkap || !gender || !username || !password || !alamat || !no_telepon || !rt_rw) {
      req.flash('error', 'Semua field harus diisi.');
      return res.redirect('/home/register');
    }

    if (password !== confirm_password) {
        req.flash('error', 'Password dan Konfirmasi Password tidak cocok.');
        return res.redirect('/home/register');
    }

    // Cek username sudah digunakan atau belum
    Users.getByCondition({ username }, (err, results) => {
        if (err) {
            req.flash('error', 'Gagal memeriksa ketersediaan username.');
            return res.redirect('/home/register');
        }
        if (results.length > 0) {
            req.flash('error', 'Username sudah terdaftar.');
            return res.redirect('/home/register');
        }

        // Ambil nomor urut terakhir dari database
        Users.getLastNoUrut((err, lastNoUrut) => {
            if (err) {
                req.flash('error', `Gagal mendapatkan no_urut: ${err.message}`);
                return res.redirect('/home/register');
            }

            const noUrut = String(lastNoUrut + 1).padStart(3, '0');
            const now = new Date();
            const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
            const noRekening = `${noUrut}/${monthYear}/${rt_rw}`;

            // Hash password sebelum disimpan
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    req.flash('error', `Gagal mengenkripsi password: ${err.message}`);
                    return res.redirect('/home/register');
                }

                // Data yang akan disimpan
                const data = {
                    no_urut: noUrut,
                    nama_lengkap,
                    gender,
                    username,
                    password: hashedPassword,
                    alamat: address,
                    no_telepon: phone,
                    no_rekening: noRekening,
                    keterangan: 'Aktif', // Keterangan diatur otomatis ke 'Aktif'
                };

                // Simpan data ke database
                Users.create(data, (err) => {
                    if (err) {
                        req.flash('error', `Gagal mendaftarkan pengguna: ${err.message}`);
                        return res.redirect('/home/register');
                    }
                    req.flash('success', 'Pendaftaran berhasil. Silakan login.');
                    res.redirect('/home/login');
                });
            });
        });
    });
};

homeController.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            req.flash('error', 'Gagal logout.');
        }
        res.redirect('/home/login');
    });
};

homeController.dashboard = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'Anda harus login terlebih dahulu.');
        return res.redirect('/home/login');
    }

    const userId = req.session.user.id;
    if (!userId) {
        req.flash('error', 'User tidak ditemukan.');
        return res.redirect('/home/login');
    }

    try {
        const [nasabah, totalSaldo, totalTransaksi, totalSampah, riwayatTransaksi, riwayatTarikSaldo] = await Promise.all([
            Users.findById(userId),
            Users.getTotalSaldo(userId),
            Users.getTotalTransaksi(userId), // Sudah diperbaiki, hanya transaksi complete
            Users.getTotalSampah(userId), // Sudah diperbaiki, hanya transaksi complete
            Users.getRiwayatTransaksi(userId),
            Saldo.getByUserId(userId) // Menampilkan riwayat tarik saldo user
        ]);

        res.render('user/dashboard', {
            user: req.session.user,
            nasabah: nasabah || {}, // Pastikan tidak undefined
            totalSaldo: totalSaldo || 0,
            totalTransaksi: totalTransaksi || 0,
            totalSampah: totalSampah || 0,
            riwayatTransaksi: riwayatTransaksi || [],
            riwayatTarikSaldo: riwayatTarikSaldo || [] // Kirim ke tampilan
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        req.flash('error', 'Terjadi kesalahan saat memuat dashboard.');
        res.redirect('/home');
    }
};


homeController.guide = (req, res) => {
    res.render('user/guide', {messages: req.flash()});
};

homeController.guide = (req, res) => {
    getPanduanData((err, panduanData) => {
        if (err) {
            console.error('Error getting panduan data:', err);
            res.render('error', { message: 'Internal Server Error', error: err });
            return;
        }

        // Debug: Cek apakah kategori anorganik dan B3 ada
        console.log("Data Organik:", panduanData.organik);
        console.log("Data Anorganik:", panduanData.anorganik);
        console.log("Data B3:", panduanData.b3);

        if (!panduanData.anorganik || !panduanData.b3) {
            console.error("Kategori Anorganik atau B3 tidak ditemukan.");
            res.render('error', { message: 'Kategori Anorganik atau B3 tidak ditemukan.' });
            return;
        }

        const user = req.session.userId ? true : false;
        res.render('user/guide', { panduan: panduanData, user: user });
    });
};


homeController.tips = (req, res) => {
    const { id } = req.params;
    getPanduanData((err, panduanData) => {
        if (err) {
            console.error('Error getting panduan data:', err);
            res.render('error', { message: 'Internal Server Error', error: err });
            return;
        }

        // Gabungkan semua kategori dan cari ID yang cocok
        const allCategories = [...panduanData.organik, ...panduanData.anorganik, ...panduanData.b3];
        const tip = allCategories.find(category => category.id === id);

        if (!tip) {
            console.error('Tip not found:', id);
            res.render('error', { message: 'Tip not found', error: new Error('Tip not found') });
            return;
        }

        const user = req.session.userId ? true : false;
        res.render('user/guide-detail', { tip, user });
    });
};


homeController.blog = (req, res) => {
    Article.getAll((err, rows) => {
        if (err) {
            console.error(err);
            res.render('error', { message: 'Internal Server Error', error: err });
        } else {
            console.log(rows); // Menampilkan data artikel
            const user = req.session.userId ? true : false;
            res.render('user/blog', { data: rows, user: user });
        }
    });
};

homeController.detailBlog = (req, res) => {
    const { id } = req.params;
    console.log("Fetching blog details for ID:", id); // Debugging log

    // Validasi ID
    if (!id || isNaN(id)) {
        return res.render('error', { message: 'Invalid Blog ID', error: null });
    }

    Article.getByIdBlog(id, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.render('error', { message: 'Internal Server Error', error: err });
        }

        if (rows.length === 0) {
            console.warn("Blog not found for ID:", id);
            return res.render('error', { message: 'Blog Not Found', error: null });
        }

        res.render('user/detail-blog', { article: rows[0], user: req.session.userId });
    });
};


homeController.about = (req, res) => {
    res.render('user/about', { messages: req.flash(), user: null });
};

homeController.videos = (req, res) => {
    Video.getAll((err, videos) => {
        if (err) {
            console.error('Error fetching videos:', err);
            return res.status(500).send('Terjadi kesalahan saat mengambil data video.');
        }
        // Pastikan `videos` dikirim ke view
        res.render('user/videos', { messages: req.flash(), user: null, videos: videos || [] });
    });
};

homeController.form = (req, res) => {  
     console.log(req.session.user.id);  // Debugging untuk memastikan user login
 
     const userId = req.session.user.id || null;  
 
     if (!userId) {
         return res.redirect('/login');  // Redirect jika user belum login
     }
 
     // Ambil data user berdasarkan ID
     Users.getById(userId, (err, user) => {
         if (err) {
             return res.status(500).send('Error fetching user data');
         }
 
         // Ambil kategori dari database yang hanya relevan untuk admin dan user
         Category.getAll((err, categories) => {
             if (err) {
                 return res.status(500).send('Error fetching categories');
             }
 
             // Ambil data admin
             Admin.getById(1, (err, admin) => {
                 if (err) {
                     return res.status(500).send('Error fetching admin details');
                 }
 
                 // Kirim data ke template EJS
                 res.render('user/form', {
                     messages: req.flash(),
                     user: user[0],   // Data user
                     categories,      // Data kategori yang sudah difilter
                     admin: admin[0], // Data admin
                 });
             });
         });
     });
 };

homeController.formSubmit = async (req, res) => {
    const userId = req.session.user.id;
    console.log("✅ [DEBUG] User ID:", userId);
    const { kategori_id, total_kg, dtl_alamat, ekspedisi } = req.body;
    if (!kategori_id || !total_kg || !dtl_alamat || !ekspedisi) {
        req.flash('error', 'Semua field wajib diisi!');
        return res.redirect('/home/form/');
    }

     // Debugging nilai ekspedisi
     console.log("✅ [DEBUG] Ekspedisi:", ekspedisi);

    try {
        const tanggal = new Date();

        // Pastikan ekspedisi hanya memiliki nilai yang diizinkan
        const ekspedisiOptions = ['Bawa Sendiri', 'Jasa Penjemputan'];
        if (!ekspedisiOptions.includes(ekspedisi)) {
            throw new Error('Metode ekspedisi tidak valid.');
        }
        const transaksiData = { nasabah_id: userId, dtl_alamat, ekspedisi, tanggal };
        
        // Simpan data transaksi ke tabel transaksi
        const transactionResult = await new Promise((resolve, reject) => {
            Transactions.create(transaksiData, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        const transaksiId = transactionResult.insertId;
        let totalKg = 0;
        let totalUang = 0;

        // Pastikan kategori_id dan total_kg berupa array
        if (!Array.isArray(kategori_id) || !Array.isArray(total_kg)) {
            throw new Error('Kategori dan total kg harus berupa array.');
        }

        // Proses setiap kategori dan jumlah kg
        for (let i = 0; i < kategori_id.length; i++) {
            const kategori = await new Promise((resolve, reject) => {
                Category.getById(kategori_id[i], (err, result) => {
                    if (err) return reject(err);
                    if (!result.length) return reject(new Error('Kategori tidak ditemukan.'));
                    resolve(result[0]);
                });
            });

            const jumlah = parseFloat(total_kg[i]);
            if (isNaN(jumlah) || jumlah <= 0) {
                throw new Error(`Jumlah untuk kategori ${kategori.jenis_sampah} tidak valid.`);
            }

            const total = jumlah * kategori.harga_perkilo;

            totalKg += jumlah;
            totalUang += total;

            // Simpan data ke tabel detail transaksi
            await new Promise((resolve, reject) => {
                Detail.create(
                    { transaksi_id: transaksiId, kategori_id: kategori_id[i], jumlah, total },
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        }

        // Update total berat dan total uang di tabel transaksi
        await new Promise((resolve, reject) => {
            Transactions.update(transaksiId, { total_kg: totalKg, total_uang: totalUang }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        req.flash('success', 'Transaksi berhasil ditambahkan.');
        res.redirect('/home/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', `Gagal menambahkan transaksi: ${error.message}`);
        res.redirect('/home/form');
    }
};

// Route to handle cancellation by the user
homeController.cancelTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the transaction by ID
        const transaction = await new Promise((resolve, reject) => {
            Transactions.getById(id, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });

        // Check if the transaction exists and belongs to the logged-in user
        if (!transaction) {
            req.flash('error', 'Transaksi tidak ditemukan.');
            return res.redirect('/home/dashboard');
        }

        // Check if the transaction is already completed or canceled
        if (transaction.status === 'complete' || transaction.status === 'canceled') {
            req.flash('error', 'Transaksi sudah selesai atau dibatalkan.');
            return res.redirect('/home/dashboard');
        }

        // Update the status to 'canceled'
        await new Promise((resolve, reject) => {
            Transactions.update(id, { status: 'canceled' }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        req.flash('success', 'Transaksi berhasil dibatalkan.');
        res.redirect('/home/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', `Gagal membatalkan transaksi: ${error.message}`);
        res.redirect('/home/dashboard');
    }
};

homeController.editUser = async (req, res) => {
    try {
      console.log('Request body:', req.body);  // Log the submitted data
      console.log('User ID from URL:', req.params.id);  // Log the user ID from the URL
  
      // Fetch the existing user data for this user ID (to prevent accidental overwrites)
      const nasabahId = req.params.id;
      const { nama_lengkap, alamat, no_telepon, username, password } = req.body;
      
      // Check if password is provided, hash it if necessary
      let updatedData = {
        nama_lengkap,
        alamat,
        no_telepon,
        username,
      };
  
      if (password && password !== '') {
        updatedData.password = await bcrypt.hash(password, 10);  // Hash new password
      }
  
      // Update the user data in the database
      const result = await Users.updateProfile(nasabahId, updatedData);  // Now awaiting the promise
  
      // Redirect or respond with a success message
      req.flash('success', 'Profile updated successfully');
      res.redirect('/home/dashboard');  // Redirect back to the dashboard or relevant page
    } catch (err) {
      console.error('Error updating user:', err);
      req.flash('error', 'Error updating profile');
      res.redirect('/home/dashboard');  // Redirect with error
    }
  };
  
module.exports = homeController;
