-- ============================================
-- BomRauTFT - Database Schema (MySQL)
-- ============================================

CREATE DATABASE IF NOT EXISTS bomrautft
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bomrautft;

-- ============================================
-- 1. USERS (Người dùng)
-- ============================================
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'npp', 'user') NOT NULL DEFAULT 'user',
  balance DECIMAL(15, 0) NOT NULL DEFAULT 0 COMMENT 'Số dư tài khoản (VND)',
  avatar_url VARCHAR(500) DEFAULT NULL,
  google_id VARCHAR(255) DEFAULT NULL COMMENT 'Google OAuth ID',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_role (role),
  INDEX idx_users_google_id (google_id)
) ENGINE=InnoDB;

-- ============================================
-- 2. CATEGORIES (Danh mục sản phẩm)
-- ============================================
CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 3. PRODUCTS (Sản phẩm - Nick game)
-- ============================================
CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(15, 0) NOT NULL COMMENT 'Giá gốc (VND)',
  discount_percent TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Phần trăm giảm giá (0-100)',
  final_price DECIMAL(15, 0) NOT NULL DEFAULT 0 COMMENT 'Giá sau giảm (tính bởi app: price * (100 - discount_percent) / 100)',
  pet_tim INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số pet tím',
  san_tim INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số sàn tím',
  chuong INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số chưởng',
  status ENUM('available', 'sold', 'hidden') NOT NULL DEFAULT 'available',
  sold_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số lượng đã bán (cho danh mục)',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_products_category (category_id),
  INDEX idx_products_status (status),
  INDEX idx_products_price (final_price),

  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 4. PRODUCT_IMAGES (Ảnh sản phẩm - Cloudinary)
-- ============================================
CREATE TABLE product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  public_id VARCHAR(255) DEFAULT NULL COMMENT 'Cloudinary public_id để xóa ảnh',
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_product_images_product (product_id),

  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 5. DISTRIBUTORS (Nhà phân phối - NPP)
-- ============================================
CREATE TABLE distributors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE COMMENT 'Liên kết tới user có role=npp',
  name VARCHAR(100) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE COMMENT 'Tên miền riêng của NPP',
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  contact_info TEXT DEFAULT NULL COMMENT 'Thông tin liên hệ bổ sung',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_distributors_domain (domain),

  CONSTRAINT fk_distributors_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 6. ORDERS (Đơn hàng)
-- ============================================
CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT 'Người mua',
  product_id INT UNSIGNED NOT NULL COMMENT 'Sản phẩm (nick game) đã mua',
  distributor_id INT UNSIGNED DEFAULT NULL COMMENT 'NPP sở hữu tên miền mà user mua qua',
  amount DECIMAL(15, 0) NOT NULL COMMENT 'Số tiền thanh toán (VND)',
  status ENUM('pending', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  domain_purchased VARCHAR(255) DEFAULT NULL COMMENT 'Tên miền user truy cập khi mua',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_orders_user (user_id),
  INDEX idx_orders_distributor (distributor_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created (created_at),

  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_orders_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_orders_distributor
    FOREIGN KEY (distributor_id) REFERENCES distributors(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 7. TRANSACTIONS (Lịch sử giao dịch / Nạp tiền)
-- ============================================
CREATE TABLE transactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type ENUM('deposit', 'purchase', 'refund') NOT NULL,
  amount DECIMAL(15, 0) NOT NULL COMMENT 'Số tiền (VND)',
  method ENUM('bank_transfer', 'momo', 'card') DEFAULT NULL COMMENT 'Phương thức nạp tiền',
  status ENUM('pending', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
  description VARCHAR(500) DEFAULT NULL,
  reference_id VARCHAR(100) DEFAULT NULL COMMENT 'Mã giao dịch bên ngoài',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_transactions_user (user_id),
  INDEX idx_transactions_type (type),
  INDEX idx_transactions_status (status),

  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 8. NOTIFICATIONS (Thông báo / Tin tức)
-- ============================================
CREATE TABLE notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('news', 'promotion', 'system') NOT NULL DEFAULT 'news',
  is_pinned TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_notifications_type (type),
  INDEX idx_notifications_pinned (is_pinned, created_at)
) ENGINE=InnoDB;

-- ============================================
-- SEED DATA (Dữ liệu mẫu)
-- ============================================

-- Admin account (password: admin123 - cần hash bằng bcrypt trong app)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@bomrautft.com', '$2b$10$PLACEHOLDER_HASH_ADMIN', 'admin');

-- NPP account (password: npp123 - cần hash bằng bcrypt trong app)
INSERT INTO users (username, email, password_hash, role) VALUES
('npp', 'npp@bomrautft.com', '$2b$10$PLACEHOLDER_HASH_NPP', 'npp');

-- Distributor cho NPP
INSERT INTO distributors (user_id, name, domain, phone, email) VALUES
(2, 'Bờm Râu Store', 'bomrautft.com', '0338180818', 'npp@bomrautft.com');

-- Danh mục mẫu
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Nick TFT Rank Thách Đấu', 'nick-tft-thach-dau', 'Tài khoản TFT rank Thách Đấu', 1),
('Nick TFT Rank Cao Thủ', 'nick-tft-cao-thu', 'Tài khoản TFT rank Cao Thủ', 2),
('Nick TFT Rank Đại Cao Thủ', 'nick-tft-dai-cao-thu', 'Tài khoản TFT rank Đại Cao Thủ', 3),
('Nick TFT Nhiều Skin', 'nick-tft-nhieu-skin', 'Tài khoản TFT có nhiều skin đẹp', 4),
('Nick TFT Giá Rẻ', 'nick-tft-gia-re', 'Tài khoản TFT giá rẻ cho người mới', 5);

-- Thông báo mẫu
INSERT INTO notifications (title, content, type, is_pinned) VALUES
('Chào mừng đến BomRauTFT!', 'Website mua bán nick game TFT uy tín, giá rẻ. Liên hệ Zalo: 0338180818', 'news', 1),
('Khuyến mãi tháng 5', 'Giảm giá 20% tất cả nick TFT rank Thách Đấu. Nhanh tay mua ngay!', 'promotion', 0);
