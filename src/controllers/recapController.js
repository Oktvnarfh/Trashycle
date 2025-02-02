const CommonModel = require('../models/commonModel');
const moment = require('moment');

const recapController = {};
const Transactions = new CommonModel('transaksi');
const TarikSaldo = new CommonModel('tarik_saldo');

recapController.index = async (req, res) => {
    try {
        // Mengambil data penerimaan (transaksi selesai)
        const penerimaan = await Transactions.getAllWithJoin(`
            SELECT DATE(tanggal) AS tanggal, SUM(total_uang) AS total_penerimaan
            FROM transaksi
            WHERE status = 'complete'
            GROUP BY DATE(tanggal)
            ORDER BY tanggal ASC
        `, []);

        // Mengambil data pengeluaran (tarik saldo yang disetujui)
        const pengeluaran = await TarikSaldo.getAllWithJoin(`
            SELECT DATE(created_at) AS tanggal, SUM(points) AS total_pengeluaran
            FROM tarik_saldo
            WHERE status = 'completed'
            GROUP BY DATE(created_at)
            ORDER BY tanggal ASC
        `, []);

        // Menyiapkan saldo awal
        let saldo_awal = 0;
        let saldo = saldo_awal;
        let rekapList = [];

        // Gabungkan semua tanggal dari penerimaan & pengeluaran
        const tanggalSet = new Set([
            ...penerimaan.map(p => p.tanggal),
            ...pengeluaran.map(p => p.tanggal)
        ]);
        const sortedTanggal = [...tanggalSet].sort();

        sortedTanggal.forEach(tanggal => {
            // Temukan data yang sesuai berdasarkan tanggal
            const dataPenerimaan = penerimaan.find(p => p.tanggal === tanggal);
            const dataPengeluaran = pengeluaran.find(p => p.tanggal === tanggal);

            // Ambil nilai total (default 0 jika tidak ada)
            const total_penerimaan = dataPenerimaan ? Number(dataPenerimaan.total_penerimaan) : 0;
            const total_pengeluaran = dataPengeluaran ? Number(dataPengeluaran.total_pengeluaran) : 0;

            // Simpan saldo awal sebelum transaksi hari ini
            let saldo_sebelumnya = saldo;

            // Hitung saldo setelah transaksi
            saldo = saldo_sebelumnya + total_penerimaan - total_pengeluaran;

            // Simpan ke array rekap
            rekapList.push({
                tanggal: moment(tanggal).format("YYYY-MM-DD"), // Format tanggal agar lebih rapi
                saldo_awal: saldo_sebelumnya.toFixed(2), // Saldo sebelum transaksi hari ini
                total_penerimaan: total_penerimaan.toFixed(2),
                total_pengeluaran: total_pengeluaran.toFixed(2),
                saldo: saldo.toFixed(2) // Saldo setelah transaksi hari ini
            });
        });

        console.log("Rekap Data:", rekapList); // Debugging untuk melihat hasil akhir

        // Render ke EJS
        res.render('admin/recap/index', { 
            rekapList,
            messages: req.flash()
        });

    } catch (error) {
        console.error(error);
        req.flash('error', 'Terjadi kesalahan saat mengambil data.');
        res.redirect('/admin');
    }
};

module.exports = recapController;
