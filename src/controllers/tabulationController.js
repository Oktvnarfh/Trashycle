const CommonModel = require('../models/commonModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const tabulationController = {};
const Category = new CommonModel('sampah');
const Detail = new CommonModel('dtl_transaksi');

tabulationController.index = async (req, res) => {
  try {
      // Query SQL untuk menghitung total per bulan dan per tahun
      const query = `
          SELECT 
              s.id AS sampah_id,
              s.jenis_sampah,
              COALESCE(SUM(dt.jumlah), 0) AS total_kg_per_bulan,
              (COALESCE(SUM(dt.jumlah), 0) * 12) AS total_kg_per_tahun
          FROM sampah s
          LEFT JOIN dtl_transaksi dt ON dt.kategori_id = s.id
          GROUP BY s.id, s.jenis_sampah
      `;

      // Eksekusi query menggunakan async/await untuk penanganan asinkron
      const results = await Category.getAllWithJoin(query);

      // Render halaman dengan data tabulasi
      res.render('admin/tabulation/index', {
          tabulationData: results,
      });
  } catch (error) {
      console.error('Error fetching tabulation data:', error);
      res.status(500).send('Terjadi kesalahan saat memuat data tabulasi.');
  }
};

module.exports = tabulationController;