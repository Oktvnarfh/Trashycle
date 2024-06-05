-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2024 at 04:07 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trashycle`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `id` int(11) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `title` varchar(225) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `thumbnail` varchar(100) DEFAULT NULL,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`id`, `author`, `title`, `body`, `thumbnail`, `createdAt`) VALUES
(34, 'Oktaviana', 'SAMPAH PLASTIK CEMARI SUNGAI DI INDONESIA', 'Indonesia adalah negara dengan penduduk terpadat ke empat didunia. Setiap penduduk dalam menjalankan kehidupannya akan mengeluarkan sampah sebagai zat sisa pembuangan. Sampah sangat mudah dilihat dan temukan disekitar kita. Setiap orang akan menghasilkan sampah. Sampah dibagi menjadin tiga bentuk yaitu sampah organik, anorganik, dan sampah hasil sisa zat kimia. Semenjak kecil kita telah diajarkan untuk hidup bersih dengan cara membuang sampah pada tempat sampah, namun banyak sekali orang yang lalai untuk menjalankan hal tersebut. Sampah hingga kini masih menjadi polemik permasalahn yang ada di Indonesia, permasalahan tersebut sulit ditangani hingga kini. Contoh permasalahn tersebut yaitu banyaknya limbah plastik disungai, hasil limbah pabrik, dan banyaknya kasus sampah plastik yang dibuang kelaut, kemudian membuat kehidupan perairan menjadi kotor.', '1717540814996-blog-1.jpg', '2024-06-05'),
(35, 'Alvin', 'Indonesia Darurat Sampah Plastik', 'Sampah plastik selalu menjadi masalah utama dalam pencemaran lingkungan baik pencemaran tanah maupun laut. Sifat sampah plastik tidak mudah terurai, proses pengolahannya menimbulkan toksit dan bersifat karsinogenik, butuh waktu sampai ratusan tahun bila terurai secara alami.\r\n\r\nUntuk pencemaran di laut, Indonesia merupakan penghasil sampah plastik laut terbesar kedua di dunia. Penelitian dari UC Davis dan Universitas Hasanuddin yang dilakukan di pasar Paotere Makassar menunjukkan 23% sampel ikan yang diambil memiliki kandungan plastik di perutnya.', '1717540859070-blog-2.jpg', '2024-06-05'),
(36, 'Fajrial', 'Bahaya Tumpukan Sampah di Lingkungan Rumah', 'Memiliki rumah yang indah, bersih dan nyaman merupakan dambaan semua orang. Pasalnya, rumah adalah tempat untuk beristirahat atau tempat untuk kembali setelah lelah beraktivitas. Sehingga, memiliki tempat tinggal yang baik menjadi hal yang cukup penting untuk diperhatikan.', '1717540904696-blog-3.jpg', '2024-06-05'),
(37, 'Via', 'Dampak Sampah Plastik bagi Lingkungan dan Kesehatan Manusia', 'Tak hanya lingkungan, dampak sampah plastik juga dapat memengaruhi kondisi kesehatan. Hal ini perlu diperhatikan karena kehidupan manusia tidak terlepas dari penggunaan plastik di dalamnya. Oleh karena itu, diperlukan cara tepat untuk mengurangi dampak buruk yang ditimbulkan sampah plastik.', '1717540937059-blog-4.jpg', '2024-06-05');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `image`, `createdAt`) VALUES
(3, 'Kertas', '1717540007660-icon1.png', '2024-06-05'),
(4, 'Plastik', '1717540029037-icon2.png', '2024-06-05'),
(5, 'Aluminium', '1717540045645-icon3.png', '2024-06-05'),
(6, 'Besi & Logam', '1717540219262-icon4.png', '2024-06-05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
