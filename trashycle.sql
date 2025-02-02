-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 02, 2025 at 10:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecoanggrek_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `nama_bank_sampah` varchar(255) NOT NULL,
  `lokasi` text DEFAULT NULL,
  `nomor_telepon` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `nama_bank_sampah`, `lokasi`, `nomor_telepon`, `email`, `username`, `password`, `update_at`) VALUES
(1, 'Bank Sampah Anggrek ', 'Jl. Trowulan No.51, Bendogerit, Kec. Sananwetan, Kota Blitar, Jawa Timur 66133', '081556726113', 'ecoanggrek@gmail.com', 'admin', '$2y$10$DiN/vwbL5zT0XMwM9gf3cO35b4iyx12G4LEoqvii4s8sqn9LtYsbO', '2025-02-02 00:11:37');

-- --------------------------------------------------------

--
-- Table structure for table `artikel`
--

CREATE TABLE `artikel` (
  `id` int(11) NOT NULL,
  `penulis` varchar(255) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi` text NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `tanggal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artikel`
--

INSERT INTO `artikel` (`id`, `penulis`, `judul`, `isi`, `foto`, `tanggal`) VALUES
(1, 'Oktaviana ', 'SAMPAH PLASTIK CEMARI SUNGAI DI INDONESIA', 'Indonesia adalah negara dengan penduduk terpadat ke empat didunia. Setiap penduduk dalam menjalankan kehidupannya akan mengeluarkan sampah sebagai zat sisa pembuangan. Sampah sangat mudah dilihat dan temukan disekitar kita. Setiap orang akan menghasilkan sampah. Sampah dibagi menjadin tiga bentuk yaitu sampah organik, anorganik, dan sampah hasil sisa zat kimia. Semenjak kecil kita telah diajarkan untuk hidup bersih dengan cara membuang sampah pada tempat sampah, namun banyak sekali orang yang lalai untuk menjalankan hal tersebut. Sampah hingga kini masih menjadi polemik permasalahn yang ada di Indonesia, permasalahan tersebut sulit ditangani hingga kini. Contoh permasalahn tersebut yaitu banyaknya limbah plastik disungai, hasil limbah pabrik, dan banyaknya kasus sampah plastik yang dibuang kelaut, kemudian membuat kehidupan perairan menjadi kotor.', '1737477906719-1717540814996-blog-1.jpg', '2025-01-21'),
(3, 'Alvin R', 'Indonesia Darurat Sampah Plastik', 'Sampah plastik selalu menjadi masalah utama dalam pencemaran lingkungan baik pencemaran tanah maupun laut. Sifat sampah plastik tidak mudah terurai, proses pengolahannya menimbulkan toksit dan bersifat karsinogenik, butuh waktu sampai ratusan tahun bila terurai secara alami.\r\n\r\nUntuk pencemaran di laut, Indonesia merupakan penghasil sampah plastik laut terbesar kedua di dunia. Penelitian dari UC Davis dan Universitas Hasanuddin yang dilakukan di pasar Paotere Makassar menunjukkan 23% sampel ikan yang diambil memiliki kandungan plastik di perutnya.', '1738455238623-1717540859070-blog-2.jpg', '2025-02-02'),
(4, 'Fajrial', 'Bahaya Tumpukan Sampah di Lingkungan Rumah', 'Memiliki rumah yang indah, bersih dan nyaman merupakan dambaan semua orang. Pasalnya, rumah adalah tempat untuk beristirahat atau tempat untuk kembali setelah lelah beraktivitas. Sehingga, memiliki tempat tinggal yang baik menjadi hal yang cukup penting untuk diperhatikan.', '1738455278328-1717540937059-blog-4.jpg', '2025-02-02');

-- --------------------------------------------------------

--
-- Table structure for table `dtl_transaksi`
--

CREATE TABLE `dtl_transaksi` (
  `id` int(11) NOT NULL,
  `transaksi_id` int(11) NOT NULL,
  `kategori_id` int(11) NOT NULL,
  `jumlah` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dtl_transaksi`
--

INSERT INTO `dtl_transaksi` (`id`, `transaksi_id`, `kategori_id`, `jumlah`, `total`) VALUES
(87, 78, 1, 2.00, 3000.00),
(88, 78, 2, 1.00, 2000.00),
(89, 79, 3, 2.00, 6000.00),
(90, 79, 4, 2.00, 4000.00),
(91, 80, 5, 4.00, 20000.00),
(92, 80, 6, 2.00, 4000.00),
(93, 81, 6, 2.00, 4000.00),
(94, 81, 8, 4.00, 6000.00),
(97, 82, 9, 2.00, 4000.00),
(98, 82, 10, 1.00, 5000.00),
(99, 83, 11, 2.00, 2000.00),
(100, 83, 12, 3.00, 4500.00),
(101, 85, 15, 2.00, 3000.00),
(102, 85, 16, 5.00, 7500.00),
(103, 85, 18, 2.00, 8000.00),
(104, 84, 13, 2.00, 3000.00),
(105, 84, 14, 2.00, 3000.00),
(106, 86, 17, 2.00, 6000.00),
(107, 86, 19, 3.00, 9000.00),
(108, 87, 20, 2.00, 4000.00),
(109, 87, 21, 1.00, 6000.00),
(110, 88, 22, 1.00, 1000.00),
(111, 88, 23, 2.00, 10000.00),
(112, 89, 23, 2.00, 10000.00),
(113, 89, 26, 2.00, 2000.00),
(114, 90, 27, 1.00, 1000.00),
(115, 90, 28, 3.00, 16500.00),
(116, 91, 1, 2.00, 3000.00),
(117, 91, 11, 1.00, 1000.00),
(118, 91, 13, 1.00, 1500.00),
(119, 92, 17, 1.00, 3000.00),
(120, 92, 17, 2.00, 6000.00),
(121, 92, 7, 1.00, 10000.00),
(122, 93, 18, 2.00, 8000.00),
(123, 93, 25, 4.00, 20000.00),
(124, 94, 24, 3.00, 4500.00),
(125, 94, 22, 2.00, 2000.00),
(127, 95, 7, 10.00, 100000.00),
(128, 96, 1, 10.00, 15000.00),
(134, 97, 3, 2.00, 6000.00),
(135, 97, 24, 2.00, 3000.00),
(136, 98, 8, 2.00, 3000.00),
(137, 98, 18, 2.00, 8000.00),
(138, 98, 13, 2.00, 3000.00);

-- --------------------------------------------------------

--
-- Table structure for table `kas_bank_sampah`
--

CREATE TABLE `kas_bank_sampah` (
  `id` int(11) NOT NULL,
  `tgl` date NOT NULL,
  `uraian` text DEFAULT NULL,
  `pengeluaran` decimal(10,2) DEFAULT 0.00,
  `penerimaan` decimal(10,2) DEFAULT 0.00,
  `saldo` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nasabah`
--

CREATE TABLE `nasabah` (
  `id` int(11) NOT NULL,
  `no_urut` varchar(10) NOT NULL,
  `no_rekening` varchar(50) DEFAULT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `gender` enum('L','P') NOT NULL,
  `keterangan` enum('Aktif','Tidak Aktif') DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `alamat` text DEFAULT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `saldo` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nasabah`
--

INSERT INTO `nasabah` (`id`, `no_urut`, `no_rekening`, `nama_lengkap`, `gender`, `keterangan`, `username`, `password`, `alamat`, `no_telepon`, `saldo`) VALUES
(26, '001', '001/1.2025/03.13', 'Sugeng Santoso', 'L', 'Aktif', 'sugengsantoso', '$2y$10$M2lynxF0g8qfxrBuKaO0K.23Mkk8btMByufJpQMfglHoooZC2IHVW', 'Jl. Bendogerit No. 10, Blitar, Jawa Timur', '081234567890', 5000.00),
(27, '002', '002/1.2025/03.13', 'Sukardi Widodo', 'L', 'Aktif', 'sukardiwidodo', '$2y$10$d/oODoFv1c/t/aPxQlvyxeCi3G4iQIoymueuHItdDH.UI5rItESii', 'Jl. Bendogerit No. 12, Blitar, Jawa Timur', '081234567891', 10000.00),
(28, '003', '003/1.2025/03.13', 'Tugiyono Hartono', 'L', 'Aktif', 'tugiyonohartono', '$2y$10$oS1eAWIykrP3V5l3YgfoZOhySt0CcSfgKpeFmFT.52mfEaN7TfOWy', 'Jl. Bendogerit No. 15, Blitar, Jawa Timur', '081234567892', 24000.00),
(29, '004', '004/1.2025/03.13', 'Suwarno Hadi', 'L', 'Aktif', 'suwarnohadi', '$2y$10$nBYz20zaVh5aHwS7Ft/M6eX2.W0lHY9/EjNbCOOtMarWWWGgmGQGS', 'Jl. Bendogerit No. 18, Blitar, Jawa Timur', '081234567893', 10000.00),
(30, '005', '005/1.2025/03.13', 'Parman Setiawan', 'L', 'Aktif', 'parmansetiawan', '$2y$10$MxozKfh7HxnF4unmCeYOxedi/CkEgaQatrEvzkBSJZ01CA1HKhirm', 'Jl. Bendogerit No. 20, Blitar, Jawa Timur', '081234567894', 18000.00),
(31, '006', '006/1.2025/03.13', 'Sri Hartini', 'P', 'Aktif', 'srihartini', '$2y$10$5bKHmQfscQVzJc674Om1M.P1BMP3pP3Bt9jaQapzZRvoKyo47KZJK', 'Jl. Bendogerit No. 22, Blitar, Jawa Timur', '081234567895', 6500.00),
(32, '007', '007/1.2025/03.13', 'Siti Aminah', 'P', 'Aktif', 'sitiaminah', '$2y$10$ilG3EP0BdbcLO2Bk/qYDAeKxlvAn2xVXuWh5sPQQ9XuNgmH3fm6B2', 'Jl. Bendogerit No. 25, Blitar, Jawa Timur', '081234567896', 56000.00),
(33, '008', '008/1.2025/03.13', 'Tuminah Sulastri', 'P', 'Aktif', 'tuminahsulastri', '$2y$10$TkVgX2MhpwYVArmENlGdI.0KwakudsuUVKbOlyZqhn2rXRu1adT9e', 'Jl. Bendogerit No. 28, Blitar, Jawa Timur', '081234567897', 18500.00),
(34, '009', '009/1.2025/03.13', 'Sumiyati Handayani', 'P', 'Aktif', 'sumiyatihandayani', '$2y$10$7bdwBzoUQfELB5Xq3r5.Vu10ohlXgCO7CMHm17YW17SZPZn2fA53i', 'Jl. Bendogerit No. 30, Blitar, Jawa Timur', '081234567898', 15000.00),
(35, '010', '010/1.2025/03.13', 'Bambang Priyono', 'L', 'Aktif', 'bambangpriyono', '$2y$10$oumtaVXV17aoLjfo4AYqjuwOgc5Bbdp6umKTq6q4H85JkCNx4t7ra', 'Jl. Bendogerit No. 35, Blitar, Jawa Timur', '081234567899', 10000.00),
(36, '011', '011/1.2025/03.13', 'Suharto Wijaya', 'L', 'Aktif', 'suhartowijaya', '$2y$10$evJXHeI256gAj5v7crHIf.PLXZ8KT3wVQhkO24DLISOV4aPckfpD.', 'Jl. Cendana No. 1, Blitar, Jawa Timur', '081234567901', 11000.00),
(37, '012', '012/1.2025/03.13', 'Mulyadi Santoso', 'L', 'Aktif', 'mulyadisantoso', '$2y$10$fgEH1RoRvJb3iar6ahRuwunfZ9IXUj.57hBh4efC77/.wUV2B0kOu', 'Jl. Cendana No. 5, Blitar, Jawa Timur', '081234567902', 12000.00),
(38, '013', '013/1.2025/03.13', 'Marwoto Subagio', 'L', 'Aktif', 'marwotosubagio', '$2y$10$LGtDt4NoNaaV3kK95rrfg.p7d1jon.D0Sy.gfaTX0bbZyaIGfnH3a', 'Jl. Mawar No. 10, Blitar, Jawa Timur', '081234567903', 17500.00),
(39, '014', '014/1.2025/03.13', 'Wahyudi Sumarno', 'L', 'Aktif', 'wahyudisumarno', '$2y$10$TyNvfq9mRcnAA05posrL/ee6FT4NG2Z4gAau4bHIs5m1YlEoImgCe', 'Jl. Mawar No. 15, Blitar, Jawa Timur', '081234567904', 5500.00),
(40, '015', '015/1.2025/03.13', 'Suparti Handayani', 'P', 'Aktif', 'supartihandayani', '$2y$10$y5MiEJqpK6l6f1CtUVFg6u9FK.DkLQLq6rKTmg9byTZ.lW0/DdlLO', 'Jl. Anggrek No. 2, Blitar, Jawa Timur', '081234567905', 19000.00),
(41, '016', '016/1.2025/03.13', 'Endang Wulandari', 'P', 'Aktif', 'endangwulandari', '$2y$10$iuUhtxOKS9fek/V.gGG2QuRfaLvVgHnrGR560OTo7NWvekczaeCVm', 'Jl. Anggrek No. 7, Blitar, Jawa Timur', '081234567906', 28000.00),
(42, '017', '017/1.2025/03.13', 'Sudarmo Prihadi', 'L', 'Aktif', 'sudarmoprihadi', '$2y$10$53pr4KwwSnmeLzqFuErWGuN1VlVkNBFJ1QQ38BjiA8zYCiY.orH82', 'Jl. Kenanga No. 10, Blitar, Jawa Timur', '081234567907', 0.00),
(43, '018', '018/1.2025/03.13', 'Hartono Wibowo', 'L', 'Aktif', 'hartonowibowo', '$2y$10$FeSYgNGF/T7lWTGrz.4l3.INfEDwW1XtRBl4MTa.D88TqzCoe0386', 'Jl. Kenanga No. 20, Blitar, Jawa Timur', '081234567908', 0.00),
(44, '019', '019/1.2025/03.13', 'Yulianti Kusuma', 'P', 'Aktif', 'yuliantikusuma', '$2y$10$5R7gZ0MkGtSYRS6C486XHeUUF8iuKuAV3oQ/Sjf3uBeJagXloyA12', 'Jl. Melati No. 5, Blitar, Jawa Timur', '081234567909', 0.00),
(45, '020', '020/1.2025/03.13', 'Siti Rohmah', 'P', 'Aktif', 'sitirohmah', '$2y$10$Jq01vevyGBBqNGoxTdguYeJ0z2h99tlv3OvqdQhyKpccJJrUrXKxi', 'Jl. Melati No. 10, Blitar, Jawa Timur', '081234567910', 23000.00);

-- --------------------------------------------------------

--
-- Table structure for table `sampah`
--

CREATE TABLE `sampah` (
  `id` int(11) NOT NULL,
  `jenis_sampah` varchar(255) NOT NULL,
  `harga_perkilo` decimal(10,2) NOT NULL,
  `periode_bulan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sampah`
--

INSERT INTO `sampah` (`id`, `jenis_sampah`, `harga_perkilo`, `periode_bulan`) VALUES
(1, 'Kardus', 1500.00, '2025-01-01'),
(2, 'Duplex', 2000.00, '2025-01-01'),
(3, 'Pet ', 3000.00, '2025-01-01'),
(4, 'Bak', 2000.00, '2025-01-01'),
(5, 'Kaleng', 5000.00, '2025-01-01'),
(6, 'Paralon', 2000.00, '2025-01-01'),
(7, 'Aluminium', 10000.00, '2025-01-01'),
(8, 'Gelas Putih', 1500.00, '2025-01-01'),
(9, 'Gelas Warna', 2000.00, '2025-01-01'),
(10, 'Besi', 5000.00, '2025-01-01'),
(11, 'Krepyak', 1000.00, '2025-01-01'),
(12, 'HVS', 1500.00, '2025-01-01'),
(13, 'Buram', 1500.00, '2025-01-01'),
(14, 'Buku Cetak / Campur', 1500.00, '2025-01-01'),
(15, 'Majalah / Tabloid', 1500.00, '2025-01-01'),
(16, 'Koran', 1500.00, '2025-01-01'),
(17, 'Botol Kaca', 3000.00, '2025-01-01'),
(18, 'Botol Orson', 4000.00, '2025-01-01'),
(19, 'Botol Kecap', 3000.00, '2025-01-01'),
(20, 'Botol AM', 2000.00, '2025-01-01'),
(21, 'Galon', 6000.00, '2025-01-01'),
(22, 'Kased CD', 1000.00, '2025-01-01'),
(23, 'Kabel', 5000.00, '2025-01-01'),
(24, 'Tutup Botol', 1500.00, '2025-01-01'),
(25, 'Barang Elektronik', 5000.00, '2025-01-01'),
(26, 'Gembos', 1000.00, '2025-01-01'),
(27, 'Sak Semen', 1000.00, '2025-01-01'),
(28, 'Paku', 5500.00, '2025-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `tabungan_nasabah`
--

CREATE TABLE `tabungan_nasabah` (
  `id` int(11) NOT NULL,
  `nasabah_id` int(11) NOT NULL,
  `tgl` date NOT NULL,
  `uraian` text DEFAULT NULL,
  `pengeluaran` decimal(10,2) DEFAULT 0.00,
  `penerimaan` decimal(10,2) DEFAULT 0.00,
  `saldo` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tarik_saldo`
--

CREATE TABLE `tarik_saldo` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `status` enum('pending','completed','rejected','approved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tarik_saldo`
--

INSERT INTO `tarik_saldo` (`id`, `user_id`, `points`, `status`, `created_at`, `updated_at`) VALUES
(9, 32, 50000, 'completed', '2025-02-02 20:25:14', '2025-02-02 20:26:07');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `nasabah_id` int(11) NOT NULL,
  `total_kg` decimal(10,2) NOT NULL,
  `total_uang` decimal(10,2) NOT NULL,
  `status` enum('pending','complete','canceled') DEFAULT 'pending',
  `tanggal` date NOT NULL,
  `dtl_alamat` text DEFAULT NULL,
  `ekspedisi` enum('Bawa Sendiri','Jasa Penjemputan') DEFAULT 'Bawa Sendiri'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `nasabah_id`, `total_kg`, `total_uang`, `status`, `tanggal`, `dtl_alamat`, `ekspedisi`) VALUES
(78, 26, 3.00, 5000.00, 'complete', '2025-02-03', 'Gang 5', 'Jasa Penjemputan'),
(79, 27, 4.00, 10000.00, 'complete', '2025-02-03', 'Rumah hijau', 'Jasa Penjemputan'),
(80, 28, 6.00, 24000.00, 'complete', '2025-02-03', 'Cet Biru', 'Jasa Penjemputan'),
(81, 29, 6.00, 10000.00, 'complete', '2025-02-03', 'cet merah', 'Bawa Sendiri'),
(82, 30, 3.00, 9000.00, 'complete', '2025-02-03', 'cet hijau', 'Bawa Sendiri'),
(83, 31, 5.00, 6500.00, 'complete', '2025-02-03', 'cet kuning', 'Bawa Sendiri'),
(84, 32, 4.00, 6000.00, 'complete', '2025-02-03', 'cet abu', 'Bawa Sendiri'),
(85, 33, 9.00, 18500.00, 'complete', '2025-02-03', 'cet orange', 'Jasa Penjemputan'),
(86, 34, 5.00, 15000.00, 'complete', '2025-02-03', 'cet', 'Jasa Penjemputan'),
(87, 35, 3.00, 10000.00, 'complete', '2025-02-03', 'cet merah', 'Bawa Sendiri'),
(88, 36, 3.00, 11000.00, 'complete', '2025-02-03', 'cet abu', 'Bawa Sendiri'),
(89, 37, 4.00, 12000.00, 'complete', '2025-02-03', 'biru', 'Bawa Sendiri'),
(90, 38, 4.00, 17500.00, 'complete', '2025-02-03', 'gang asri', 'Jasa Penjemputan'),
(91, 39, 4.00, 5500.00, 'complete', '2025-02-03', 'gang buntu', 'Jasa Penjemputan'),
(92, 40, 4.00, 19000.00, 'complete', '2025-02-03', 'cet ungu', 'Jasa Penjemputan'),
(93, 41, 6.00, 28000.00, 'complete', '2025-02-03', 'gang 9', 'Jasa Penjemputan'),
(94, 42, 5.00, 6500.00, 'canceled', '2025-02-03', 'pager hijau', 'Jasa Penjemputan'),
(95, 32, 10.00, 100000.00, 'complete', '2025-02-03', 'gang 5', 'Jasa Penjemputan'),
(96, 32, 10.00, 15000.00, 'canceled', '2025-02-03', 'biru', 'Bawa Sendiri'),
(97, 45, 4.00, 9000.00, 'complete', '2025-02-03', 'gang 3', 'Jasa Penjemputan'),
(98, 45, 6.00, 14000.00, 'complete', '2025-02-03', 'gang 9', 'Jasa Penjemputan');

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `id` int(11) NOT NULL,
  `v_link` varchar(255) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `channel` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `duration` varchar(10) DEFAULT NULL,
  `difficulty` enum('Beginner','Intermediate','Advanced') DEFAULT 'Beginner'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`id`, `v_link`, `judul`, `channel`, `created_at`, `updated_at`, `duration`, `difficulty`) VALUES
(2, '_j9vYm68PNM', 'Daur ulang botol plastik bekas jadi wadah serba guna / tempat pensil', ' Lista Tsurayya', '2025-01-21 18:48:50', '2025-01-29 17:25:26', '8:42', 'Beginner'),
(3, 'kk7g2tZot_E', 'Ide Kreatif dari Gelas Plastik Bekas yang Tak terpikirkan || Ide Barang Bekas Gelas Plastik', ' Idetrik', '2025-01-29 17:34:21', '2025-01-29 17:37:06', '12:39', 'Intermediate'),
(4, 'yMfUWUVtGfQ', 'ide kreatif kerajinan tangan dari barang bekas cara membuat bunga lily dari gelas plastik bekas', 'ono karya', '2025-01-30 15:24:42', '2025-01-30 15:24:42', '05:52', 'Beginner');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dtl_transaksi`
--
ALTER TABLE `dtl_transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaksi_id` (`transaksi_id`),
  ADD KEY `kategori_id` (`kategori_id`);

--
-- Indexes for table `kas_bank_sampah`
--
ALTER TABLE `kas_bank_sampah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nasabah`
--
ALTER TABLE `nasabah`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_urut` (`no_urut`);

--
-- Indexes for table `sampah`
--
ALTER TABLE `sampah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tabungan_nasabah`
--
ALTER TABLE `tabungan_nasabah`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nasabah_id` (`nasabah_id`);

--
-- Indexes for table `tarik_saldo`
--
ALTER TABLE `tarik_saldo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nasabah_id` (`nasabah_id`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dtl_transaksi`
--
ALTER TABLE `dtl_transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT for table `kas_bank_sampah`
--
ALTER TABLE `kas_bank_sampah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nasabah`
--
ALTER TABLE `nasabah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `sampah`
--
ALTER TABLE `sampah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `tabungan_nasabah`
--
ALTER TABLE `tabungan_nasabah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tarik_saldo`
--
ALTER TABLE `tarik_saldo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dtl_transaksi`
--
ALTER TABLE `dtl_transaksi`
  ADD CONSTRAINT `dtl_transaksi_ibfk_1` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`),
  ADD CONSTRAINT `dtl_transaksi_ibfk_2` FOREIGN KEY (`kategori_id`) REFERENCES `sampah` (`id`);

--
-- Constraints for table `tabungan_nasabah`
--
ALTER TABLE `tabungan_nasabah`
  ADD CONSTRAINT `tabungan_nasabah_ibfk_1` FOREIGN KEY (`nasabah_id`) REFERENCES `nasabah` (`id`);

--
-- Constraints for table `tarik_saldo`
--
ALTER TABLE `tarik_saldo`
  ADD CONSTRAINT `tarik_saldo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `nasabah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`nasabah_id`) REFERENCES `nasabah` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
