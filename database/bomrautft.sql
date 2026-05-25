/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80046 (8.0.46)
 Source Host           : localhost:3306
 Source Schema         : bomrautft

 Target Server Type    : MySQL
 Target Server Version : 80046 (8.0.46)
 File Encoding         : 65001

 Date: 25/05/2026 23:34:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` int UNSIGNED NOT NULL COMMENT 'S???n ph???m li??n k???t',
  `distributor_id` int UNSIGNED NULL DEFAULT NULL COMMENT 'NPP cung c???p (n???u c??)',
  `login_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'T??i kho???n ????ng nh???p game',
  `login_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'M???t kh???u ????ng nh???p game',
  `cost_price` decimal(15, 0) NOT NULL DEFAULT 0 COMMENT 'Gi?? v???n nh???p h??ng',
  `status` enum('available','sold','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Ghi ch?? th??m',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_accounts_product`(`product_id` ASC) USING BTREE,
  INDEX `idx_accounts_status`(`status` ASC) USING BTREE,
  INDEX `fk_accounts_distributor`(`distributor_id` ASC) USING BTREE,
  CONSTRAINT `fk_accounts_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_accounts_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of accounts
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `fake_remaining_count` int NOT NULL DEFAULT 0,
  `fake_sold_count` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `slug`(`slug` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, 'ACC Vip', 'vip', 'Acc giá > 2.999.000', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713361/bomrautft/category/vip.jpg', 1, 0, 4, 1, '2026-05-25 20:13:46', '2026-05-25 21:09:27');
INSERT INTO `categories` VALUES (2, 'Siêu Rẻ', 'cheaper', 'Acc giá < 2.999.000', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713362/bomrautft/category/cheaper.webp', 2, 0, 183, 1, '2026-05-25 20:13:46', '2026-05-25 21:10:28');
INSERT INTO `categories` VALUES (3, 'Pet Tím + Sàn Tím', 'pet', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713364/bomrautft/category/pet.jpg', 3, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 21:11:29');
INSERT INTO `categories` VALUES (4, 'Linh Thú Mới Ra Mắt', 'petnew', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713365/bomrautft/category/petnew.jpg', 4, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 21:32:09');
INSERT INTO `categories` VALUES (5, 'Irelia Thần Thoại', 'irelia-than-thoai', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713367/bomrautft/category/irelia-than-thoai.jpg', 5, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (6, 'Riven Ngạo Kiếm', 'riven-ngao-kiem', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713368/bomrautft/category/riven-ngao-kiem.jpg', 6, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (7, 'Lee Sin Tuyệt Vô Thần', 'lee-sin-tuyet-vo-than', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713369/bomrautft/category/lee-sin-tuyet-vo-than.jpg', 7, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (8, 'Sett Song Hồn Hoang Thú', 'sett-song-hon-hoang-thu', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713371/bomrautft/category/sett-song-hon-hoang-thu.jpg', 8, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (9, 'Gwen Tiệm Trà Ngọt Ngào', 'gwen-tiem-tra-ngot-ngao', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713372/bomrautft/category/gwen-tiem-tra-ngot-ngao.jpg', 9, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (10, 'Gwen Hồng Pha Lê', 'gwen-hong-pha-le', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713373/bomrautft/category/gwen-hong-pha-le.jpg', 10, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (11, 'Yasuo Long Kiếm', 'yasuo-long-kiem', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713375/bomrautft/category/yasuo-long-kiem.jpg', 11, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (12, 'Yasuo Ma Kiếm', 'yasuo-ma-kiem', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713376/bomrautft/category/yasuo-ma-kiem.jpg', 12, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (13, 'Yone T1', 'yone-t1', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713377/bomrautft/category/yone-t1.jpg', 13, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (14, 'Lee Sin Long Cước', 'lee-sin-long-cuoc', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713378/bomrautft/category/lee-sin-long-cuoc.jpg', 14, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (15, 'Yone Thần Kiếm', 'yone-than-kiem', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713380/bomrautft/category/yone-than-kiem.webp', 15, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');
INSERT INTO `categories` VALUES (16, 'Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 'ahri-chieu-hon-thien-ho-hang-hieu', NULL, 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779713382/bomrautft/category/ahri-chieu-hon-thien-ho-hang-hieu.jpg', 16, 0, 0, 1, '2026-05-25 20:13:46', '2026-05-25 20:13:46');

-- ----------------------------
-- Table structure for distributors
-- ----------------------------
DROP TABLE IF EXISTS `distributors`;
CREATE TABLE `distributors`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Li??n k???t t???i user c?? role=npp',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'T??n mi???n ri??ng c???a NPP',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `contact_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Th??ng tin li??n h??? b??? sung',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  UNIQUE INDEX `domain`(`domain` ASC) USING BTREE,
  INDEX `idx_distributors_domain`(`domain` ASC) USING BTREE,
  CONSTRAINT `fk_distributors_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of distributors
-- ----------------------------

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '???????ng d???n ???nh th??ng b??o',
  `type` enum('news','promotion','system') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'news',
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_notifications_type`(`type` ASC) USING BTREE,
  INDEX `idx_notifications_pinned`(`is_pinned` ASC, `created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Ng?????i mua',
  `product_id` int UNSIGNED NOT NULL COMMENT 'S???n ph???m ???? mua',
  `account_id` int UNSIGNED NULL DEFAULT NULL COMMENT 'T??i kho???n game t????ng ???ng',
  `distributor_id` int UNSIGNED NULL DEFAULT NULL,
  `amount` decimal(15, 0) NOT NULL COMMENT 'S??? ti???n thanh to??n (VND)',
  `status` enum('pending','completed','cancelled','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `domain_purchased` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_orders_user`(`user_id` ASC) USING BTREE,
  INDEX `idx_orders_product`(`product_id` ASC) USING BTREE,
  INDEX `idx_orders_status`(`status` ASC) USING BTREE,
  INDEX `fk_orders_account`(`account_id` ASC) USING BTREE,
  INDEX `fk_orders_distributor`(`distributor_id` ASC) USING BTREE,
  CONSTRAINT `fk_orders_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orders
-- ----------------------------

-- ----------------------------
-- Table structure for product_attribute_options
-- ----------------------------
DROP TABLE IF EXISTS `product_attribute_options`;
CREATE TABLE `product_attribute_options`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'pet_tim | san_tim | chuong',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_type`(`type` ASC) USING BTREE,
  INDEX `idx_sort`(`type` ASC, `sort_order` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 767 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_attribute_options
-- ----------------------------
INSERT INTO `product_attribute_options` VALUES (156, 'pet_tim', 'Yone Thần Kiếm', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (157, 'pet_tim', 'Yasuo Long Kiếm', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (158, 'pet_tim', 'Lee Tiểu Long', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (159, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (160, 'pet_tim', 'Pengu Luyện Rồng', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (161, 'pet_tim', 'Lillia Mộng Tưởng Tiên Nữ', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (162, 'pet_tim', 'Thresh Cao Bồi', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (163, 'pet_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (164, 'pet_tim', 'Gwen Tiệm Trà Ngọt Ngào', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (165, 'pet_tim', 'Ahri Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (166, 'pet_tim', 'Ezreal Học Viện Chiến Binh', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (167, 'pet_tim', 'Jhin Vũ Trụ Hắc Ám', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (168, 'pet_tim', 'Jinx Pháo Hoa', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (169, 'san_tim', 'Sân Đấu Lễ Hội', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (170, 'san_tim', 'U Mộng Hoa Cảnh', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (171, 'san_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (172, 'san_tim', 'Rìa Tòa Nhà Công Nghệ', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (173, 'san_tim', 'Hội Chợ Nhăm Dần', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (174, 'san_tim', 'Buổi Diễn Tối Thượng', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (175, 'san_tim', 'Thánh Địa Long Thần', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (176, 'san_tim', 'EveryThing Goes On', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (177, 'san_tim', 'Sân Đấu Sinh Nhật Pengu', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (178, 'chuong', 'Cung Ánh Sáng Học Viên Chiến Binh', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (179, 'chuong', 'Hoa Linh Đoạt Mệnh', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (180, 'chuong', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (181, 'chuong', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (182, 'chuong', 'Quả Cầu Ma Thuật Hoa Linh', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (183, 'chuong', 'T1 Đoạt Mệnh', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (184, 'chuong', 'Xoẹt Xoẹt Hồng Pha Lê', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (185, 'chuong', 'Bàn Tay Hỏa Tiễn', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (186, 'chuong', 'Sân Khấu Tử Thần', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (187, 'chuong', 'Pháo Hoa Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:10:17');
INSERT INTO `product_attribute_options` VALUES (188, 'pet_tim', 'Mordekaiser Hắc Tinh', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (189, 'pet_tim', 'Soraka Chuối Tí Nị', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (190, 'pet_tim', 'Ashe Nữ Hoàng Vũ Trụ', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (191, 'pet_tim', 'Briar Huyết Nguyệt Tí Nị', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (192, 'pet_tim', 'Lucian Cao Bồi Đột Phá', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (193, 'pet_tim', 'Irelia Thần Thoại', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (194, 'pet_tim', 'Lee Sin Tuyệt Vô Thần', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (195, 'pet_tim', 'Jinx Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (196, 'pet_tim', 'Heartsteel Sett', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (197, 'pet_tim', 'Blitz Mãi Bên Crank Bạn Nhé', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (198, 'san_tim', 'Mặc định', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (199, 'san_tim', 'Quán Rượu Viễn Tây', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (200, 'chuong', 'Mặc định', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (201, 'chuong', 'Thanh Trừng Cao Bồi', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (202, 'chuong', 'Khúc  Cao Trào Cổ Cầm', 0, 1, '2026-05-25 21:11:19');
INSERT INTO `product_attribute_options` VALUES (203, 'pet_tim', 'Sett Song Hồn Hoang Thú', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (204, 'pet_tim', 'Irelia Sứ Thanh Hoa', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (205, 'pet_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (206, 'pet_tim', 'Ashe Nữ Hoàng Vũ Trụ', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (207, 'pet_tim', 'Aatrox Huyết Nguyệt', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (208, 'pet_tim', 'Lee Sin Tuyệt Vô Thần', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (209, 'pet_tim', 'Katarina Học Viện Chiến Binh', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (210, 'pet_tim', 'Arcane Vi Tí Nị', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (211, 'pet_tim', 'Riven Thần Kiếm', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (212, 'pet_tim', 'Irelia Thần Thoại', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (213, 'pet_tim', 'Arcance Caitlyn', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (214, 'san_tim', 'Tinh Tú Hắc Ám', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (215, 'san_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (216, 'san_tim', 'Huyết Nguyệt Dạ Hành', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (217, 'san_tim', 'Khu Nhac Chill Của Choncc', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (218, 'chuong', 'Thần Linh Định Đoạt', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (219, 'chuong', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:12:17');
INSERT INTO `product_attribute_options` VALUES (220, 'pet_tim', 'Mordekaiser Hắc Tinh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (221, 'pet_tim', 'Soraka Chuối Tí Nị', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (222, 'pet_tim', 'Ashe Nữ Hoàng Vũ Trụ', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (223, 'pet_tim', 'Briar Huyết Nguyệt Tí Nị', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (224, 'pet_tim', 'Lucian Cao Bồi Đột Phá', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (225, 'pet_tim', 'Irelia Thần Thoại', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (226, 'pet_tim', 'Lee Sin Tuyệt Vô Thần', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (227, 'pet_tim', 'Jinx Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (228, 'pet_tim', 'Heartsteel Sett', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (229, 'pet_tim', 'Blitz Mãi Bên Crank Bạn Nhé', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (230, 'pet_tim', 'Katarina Anh Linh Chiến Lang', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (231, 'pet_tim', 'Riven Thần Kiếm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (232, 'pet_tim', 'Tristana Pháo Thủ Pengu', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (233, 'pet_tim', 'Darius Lang Vương', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (234, 'pet_tim', 'Zoe Thần Thoại', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (235, 'pet_tim', 'Gwen Hồng Pha Lê', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (236, 'pet_tim', 'Ahri K/DA', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (237, 'pet_tim', 'Aatrox Huyết Nguyệt', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (238, 'pet_tim', 'Janna Dự Báo Thời TIết', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (239, 'pet_tim', 'Seraphine Hồng Pha Lê', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (240, 'pet_tim', 'Syndra Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (241, 'pet_tim', 'Warwick Arcane', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (242, 'pet_tim', 'Choncc Thông Thái', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (243, 'pet_tim', 'Garen Pengu Đột Phá', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (244, 'pet_tim', 'Lux Vũ Trụ Huỷ Diệt', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (245, 'pet_tim', 'Zed Tử Thần Không Gian', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (246, 'pet_tim', 'Amumu tiệc bất ngờ', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (247, 'pet_tim', 'Pengu Cosplay Yasuo', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (248, 'pet_tim', 'Yone T1', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (249, 'pet_tim', 'Akali K/DA ALL OUT', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (250, 'pet_tim', 'Lillia Mộng Tưởng Tiên Nữ', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (251, 'pet_tim', 'Yasuo Ma Kiếm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (252, 'pet_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (253, 'pet_tim', 'Orianna Trán Hoa Linh Ngọc', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (254, 'pet_tim', 'Orianna T1', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (255, 'pet_tim', 'Irelia Sứ Thanh Hoa', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (256, 'pet_tim', 'Tristana luyện rồng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (257, 'pet_tim', 'Kayle Thiên Sứ Công Nghệ', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (258, 'pet_tim', 'Vayne Siêu Phẩm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (259, 'pet_tim', 'Miss Fortune Thỏ Chỉ Huy', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (260, 'pet_tim', 'Briar Cosplay Shork', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (261, 'pet_tim', 'Caitlyn Giả Lập Tí Nị', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (262, 'pet_tim', 'Ezreal Học Vi��n Chiến Binh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (263, 'pet_tim', 'Jhin Vũ Trụ Hắc Ám', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (264, 'pet_tim', 'Garen Sư Vương', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (265, 'pet_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (266, 'pet_tim', 'Ezreal Học Viện Chiến Binh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (267, 'pet_tim', 'Aatrox DRX', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (268, 'pet_tim', 'Sona Cổ Cầm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (269, 'pet_tim', 'Morgana Ác Nữ Khắc Tinh Tí Nị', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (270, 'pet_tim', 'Yone Tà Ánh Song Kiếm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (271, 'pet_tim', 'Ezreal Sứ Thanh Hoa', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (272, 'pet_tim', 'Arcane Annie Fan Cứng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (273, 'pet_tim', 'Morgana Tiên Hắc Ám', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (274, 'pet_tim', 'Yasuo Long Kiếm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (275, 'pet_tim', 'Everything Goes On', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (276, 'pet_tim', 'Gwen Tử Chỉ Dương Khí', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (277, 'pet_tim', 'Riven Ngạo Kiếm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (278, 'pet_tim', 'Gwen Tiệm Trà Ngọt Ngào', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (279, 'pet_tim', 'Jinx arcane', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (280, 'pet_tim', 'Kayle Tí Nị', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (281, 'pet_tim', 'Sett Tí Nị', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (282, 'pet_tim', 'Quán Lê Bunny Bonbon', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (283, 'pet_tim', 'Lee Sin Long Cước', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (284, 'pet_tim', 'Miss Fortune Huyết Nguyệt', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (285, 'pet_tim', 'Sett Song Hồn Hoang Thú', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (286, 'pet_tim', 'Akali Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (287, 'pet_tim', 'Malphite Máy Móc', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (288, 'pet_tim', 'Yone Thần Kiếm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (289, 'pet_tim', 'Yuumi Phù Thủy', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (290, 'pet_tim', 'Katarina Học Viện Chiến Binh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (291, 'pet_tim', 'Lulu Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (292, 'pet_tim', 'Pyke T1', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (293, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (294, 'pet_tim', 'Thresh Cao Bồi', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (295, 'san_tim', 'Mặc định', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (296, 'san_tim', 'Quán Rượu Viễn Tây', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (297, 'san_tim', 'Sân Đấu Thiên Thượng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (298, 'san_tim', 'Sàn Đấu Thiên Thượng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (299, 'san_tim', 'Thủ vệ bằng giá', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (300, 'san_tim', 'Nhà Bí Mật Của Prancie', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (301, 'san_tim', 'Phòng Trà Yên Bình', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (302, 'san_tim', 'Chân Trời Mộng Ước', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (303, 'san_tim', 'Vòng Đài Shurima', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (304, 'san_tim', 'Linh Xà Thần Vực', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (305, 'san_tim', 'Mã Đáo Thành Công', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (306, 'san_tim', 'Quán Giọt Cuối Cùng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (307, 'san_tim', 'Cao ốc Kim Long', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (308, 'san_tim', 'Ngôi Nhà Thỏ Vàng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (309, 'san_tim', 'Tiệm Cà Phê Paris', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (310, 'san_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (311, 'san_tim', 'Móng Vuốt Mùa Đông', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (312, 'san_tim', 'Sân Chơi Yuumi', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (313, 'san_tim', 'Buổi Diễn Tối Thượng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (314, 'san_tim', 'Đỉnh Cực Quang', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (315, 'san_tim', 'Ma Sứ vs Thần Sứ', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (316, 'san_tim', 'Tháp Cảnh Mộng Của Gwen', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (317, 'san_tim', 'Khu Nhac Chill Của Choncc', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (318, 'san_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (319, 'san_tim', 'EveryThing Goes On', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (320, 'san_tim', 'Khu Nhac Chill của Choncc', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (321, 'san_tim', 'Hội Chợ Nhâm Dần', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (322, 'san_tim', 'Hội Chợ Nhăm Dần', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (323, 'san_tim', 'Khu Nghỉ Dưỡng của Choncc', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (324, 'san_tim', 'Giấc Mơ Demacia', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (325, 'san_tim', 'Móng vuốt mùa đông', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (326, 'san_tim', 'Cầu Tiến Bộ', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (327, 'san_tim', 'Vườn Độc Dược', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (328, 'san_tim', 'K.O Đại Chiến', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (329, 'san_tim', 'Malphite Hộ Pháp Không Gian', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (330, 'san_tim', 'Bình Nguyên Volrachnum', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (331, 'san_tim', 'Hộp Đêm Tân Sửu', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (332, 'san_tim', 'Everything Goes On', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (333, 'san_tim', 'U Mộng Hoa Cảnh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (334, 'san_tim', 'Nhà bí mật của Prancie', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (335, 'san_tim', 'Đại chiến anh hùng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (336, 'san_tim', '3 sàn tím', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (337, 'san_tim', 'Mặc Định', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (338, 'san_tim', 'Kho hàng dui dẻ của Jinx', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (339, 'san_tim', 'Vườn độc dược', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (340, 'san_tim', 'Trường luyện rồng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (341, 'san_tim', 'Sân đấu siêu tân tinh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (342, 'san_tim', 'Tang thư ma pháp', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (343, 'san_tim', 'Khu hầm trú ánh lửa', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (344, 'san_tim', 'Quán Le Bunny BonBon', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (345, 'san_tim', 'Huyết Nguyệt Dạ Hành', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (346, 'san_tim', 'Chiến Binh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (347, 'san_tim', 'Thủ Vệ Băng Giá', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (348, 'san_tim', 'Đấu Trường Hextech', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (349, 'san_tim', 'Ban Công Giao Thừa', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (350, 'san_tim', 'Tháp cảnh mộng của Gwen', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (351, 'san_tim', 'Sân Đấu Siêu Tân Binh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (352, 'chuong', 'Mặc định', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (353, 'chuong', 'Thanh Trừng Cao Bồi', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (354, 'chuong', 'Khúc  Cao Trào Cổ Cầm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (355, 'chuong', 'Bông Sen Tử Thân Anh Linh Chiến Lang', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (356, 'chuong', 'Chuối Vẫn Tinh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (357, 'chuong', 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (358, 'chuong', 'Khúc Cao Trào Cổ Cầm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (359, 'chuong', 'Arcane Khóa Chết', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (360, 'chuong', 'Địa Chấn Tuyệt Vô Thần', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (361, 'chuong', 'Nện Cái Nè', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (362, 'chuong', 'Thanh Kiếm Tiên Phong Sứ Thanh Hoa', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (363, 'chuong', 'Cung Ánh Sáng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (364, 'chuong', 'T1 Đoạt Mệnh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (365, 'chuong', 'Cung Ánh Sáng Học Viên Chiến Binh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (366, 'chuong', 'Ma Xứ Trăng Trối', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (367, 'chuong', 'T1 Tử Thần Đấy Sâu', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (368, 'chuong', 'Hoa Linh Đoạt Mệnh', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (369, 'chuong', 'Lệnh T1 : Sóng Âm', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (370, 'chuong', 'Tên Lửa Đạn Đạo', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (371, 'chuong', 'Sân Khấu Tử Thần Của Jhin', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (372, 'chuong', 'Công Lý Demecia Sư V��ơng', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (373, 'chuong', 'Đại Bác Đẩy Lùi', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (374, 'chuong', 'Máy Chém Noxus Lang Vương', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (375, 'chuong', 'Mũi Tên Thơ Thẩn Phù Thủy', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (376, 'chuong', 'ULTRA RAPID FIRE', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (377, 'chuong', 'Ác Nữ Khắc Tinh Trói Hồn', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (378, 'chuong', 'Công Lý Demecia Sư Vương', 0, 1, '2026-05-25 21:19:53');
INSERT INTO `product_attribute_options` VALUES (379, 'chuong', 'Đại Băng Tiễn Bao Bồi', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (380, 'chuong', 'Đại Bác Đẩy Lùi Pháo Thủ', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (381, 'chuong', 'Xoẹt Xoẹt Hồng Pha Lê', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (382, 'chuong', 'Máy Chem Noxus Lang Vương', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (383, 'chuong', 'Mũi Tên Bạc', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (384, 'chuong', 'Bàn Tay Hỏa Tiễn', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (385, 'chuong', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (386, 'chuong', 'Mưa Đạn Thỏ Chỉ Huy', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (387, 'chuong', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (388, 'chuong', 'T1 Tử Thần Đáy Sâu', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (389, 'chuong', 'Ngọn Thương Ánh Sáng Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (390, 'chuong', 'Khắc Tên Vào Lịch Sử', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (391, 'chuong', 'Xe Chỉ Luồn Kim', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (392, 'chuong', 'Bách Phát Bách Trúng', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (393, 'chuong', 'chưởng cung ánh sáng hv', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (394, 'chuong', 'Siêu phẩm : mũi tên bạc', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (395, 'chuong', 't1 đoạt mệnh', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (396, 'chuong', 'đại bác đẩy lùi luyện rồng', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (397, 'chuong', 'mặc định', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (398, 'chuong', '3 chưởng lực tím', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (399, 'chuong', 'Mặc Định', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (400, 'chuong', 'Arcane Tên lửa đạn đạo siêu khủng khiếp', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (401, 'chuong', 'Ánh lửa lưỡng giới đồng quy', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (402, 'chuong', 'None', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (403, 'chuong', 'Tiệm Trà Ngọt Ngào Xoẹt Xoẹt', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (404, 'chuong', 'Tiểu Long Nộ', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (405, 'chuong', 'Sân Khấu Tử Thần', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (406, 'chuong', 'Cuồng Thú Quyền', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (407, 'chuong', 'Hoa Linh Lục Địa', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (408, 'chuong', 'Máy Chém Lang Vương', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (409, 'chuong', 'Mũi tên bạc', 0, 1, '2026-05-25 21:19:54');
INSERT INTO `product_attribute_options` VALUES (410, 'pet_tim', 'Yone Thần Kiếm', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (411, 'pet_tim', 'Yasuo Long Kiếm', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (412, 'pet_tim', 'Lee Tiểu Long', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (413, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (414, 'pet_tim', 'Pengu Luyện Rồng', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (415, 'pet_tim', 'Lillia Mộng Tưởng Tiên Nữ', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (416, 'pet_tim', 'Thresh Cao Bồi', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (417, 'pet_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (418, 'pet_tim', 'Gwen Tiệm Trà Ngọt Ngào', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (419, 'pet_tim', 'Ahri Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (420, 'pet_tim', 'Ezreal Học Viện Chiến Binh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (421, 'pet_tim', 'Jhin Vũ Trụ Hắc Ám', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (422, 'pet_tim', 'Jinx Pháo Hoa', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (423, 'pet_tim', 'Lee Sin Tuyệt Vô Thần', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (424, 'pet_tim', 'Teemo Tiểu Quỷ', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (425, 'pet_tim', 'Morgana Tiên Hắc Ám', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (426, 'pet_tim', 'Orianna Trán Hoa Linh Ngọc', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (427, 'pet_tim', 'Sett Song Hồn Hoang Thú', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (428, 'pet_tim', 'Yone T1', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (429, 'pet_tim', 'Akali K/DA ALL OUT', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (430, 'pet_tim', 'Gwen Hồng Pha Lê', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (431, 'pet_tim', 'Miss Fortune Huyết Nguyệt', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (432, 'pet_tim', 'Sena Cao Bồi', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (433, 'pet_tim', 'Yasuo Ma Kiếm', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (434, 'pet_tim', 'Yone Tà Ánh Song Kiếm', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (435, 'pet_tim', 'Morgana Khổng Tước Hoàng Hậu', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (436, 'pet_tim', 'Gwen Tử Chỉ Dương Khí', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (437, 'pet_tim', 'Irelia Thần Thoại', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (438, 'pet_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (439, 'pet_tim', 'Aatrox Huyết Nguyệt', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (440, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (441, 'pet_tim', 'Ashe Long Tiễn', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (442, 'pet_tim', 'Irelia Sứ Thanh Hoa', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (443, 'pet_tim', 'Lulu Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (444, 'pet_tim', 'Miss Fortune Thỏ Chỉ Huy', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (445, 'pet_tim', 'Orianna T1', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (446, 'pet_tim', 'Sona Cổ Cầm', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (447, 'san_tim', 'Sân Đấu Lễ Hội', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (448, 'san_tim', 'U Mộng Hoa Cảnh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (449, 'san_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (450, 'san_tim', 'Rìa Tòa Nhà Công Nghệ', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (451, 'san_tim', 'Hội Chợ Nhăm Dần', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (452, 'san_tim', 'Buổi Diễn Tối Thượng', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (453, 'san_tim', 'Thánh Địa Long Thần', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (454, 'san_tim', 'EveryThing Goes On', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (455, 'san_tim', 'Sân Đấu Sinh Nhật Pengu', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (456, 'san_tim', 'Phòng Trà Yên Bình', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (457, 'san_tim', 'Ma Sứ Vs Thiên Sứ', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (458, 'san_tim', 'Tháp Cảnh Mộng Của Gwen', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (459, 'san_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (460, 'san_tim', '4 sàn đấu tím', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (461, 'chuong', 'Cung Ánh Sáng Học Viên Chiến Binh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (462, 'chuong', 'Hoa Linh Đoạt Mệnh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (463, 'chuong', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (464, 'chuong', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (465, 'chuong', 'Quả Cầu Ma Thuật Hoa Linh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (466, 'chuong', 'T1 Đoạt Mệnh', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (467, 'chuong', 'Xoẹt Xoẹt Hồng Pha Lê', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (468, 'chuong', 'Bàn Tay Hỏa Tiễn', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (469, 'chuong', 'Sân Khấu Tử Thần', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (470, 'chuong', 'Pháo Hoa Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (471, 'chuong', 'Tiểu Long Nộ', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (472, 'chuong', 'Ma Xứ Trăng Trối', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (473, 'chuong', 'Khúc Cao Trào Cổ Cầm', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (474, 'chuong', 'Địa Chấn Tuyệt Vô Thần', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (475, 'chuong', 'Tiệm trà ngọt ngào xoẹt xoẹt', 0, 1, '2026-05-25 21:23:12');
INSERT INTO `product_attribute_options` VALUES (476, 'pet_tim', 'Yone Thần Kiếm', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (477, 'pet_tim', 'Yasuo Long Kiếm', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (478, 'pet_tim', 'Lee Tiểu Long', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (479, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (480, 'pet_tim', 'Pengu Luyện Rồng', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (481, 'pet_tim', 'Lillia Mộng Tưởng Tiên Nữ', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (482, 'pet_tim', 'Thresh Cao Bồi', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (483, 'pet_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (484, 'pet_tim', 'Gwen Tiệm Trà Ngọt Ngào', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (485, 'pet_tim', 'Ahri Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (486, 'pet_tim', 'Ezreal Học Viện Chiến Binh', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (487, 'pet_tim', 'Jhin Vũ Trụ Hắc Ám', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (488, 'pet_tim', 'Jinx Pháo Hoa', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (489, 'pet_tim', 'Lee Sin Tuyệt Vô Thần', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (490, 'pet_tim', 'Teemo Tiểu Quỷ', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (491, 'pet_tim', 'Morgana Tiên Hắc Ám', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (492, 'pet_tim', 'Orianna Trán Hoa Linh Ngọc', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (493, 'pet_tim', 'Sett Song Hồn Hoang Thú', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (494, 'pet_tim', 'Yone T1', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (495, 'pet_tim', 'Akali K/DA ALL OUT', 0, 1, '2026-05-25 21:27:57');
INSERT INTO `product_attribute_options` VALUES (496, 'pet_tim', 'Gwen Hồng Pha Lê', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (497, 'pet_tim', 'Miss Fortune Huyết Nguyệt', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (498, 'pet_tim', 'Sena Cao Bồi', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (499, 'pet_tim', 'Yasuo Ma Kiếm', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (500, 'pet_tim', 'Yone Tà Ánh Song Kiếm', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (501, 'pet_tim', 'Morgana Khổng Tước Hoàng Hậu', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (502, 'pet_tim', 'Gwen Tử Chỉ Dương Khí', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (503, 'pet_tim', 'Irelia Thần Thoại', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (504, 'pet_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (505, 'pet_tim', 'Aatrox Huyết Nguyệt', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (506, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (507, 'pet_tim', 'Ashe Long Tiễn', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (508, 'pet_tim', 'Irelia Sứ Thanh Hoa', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (509, 'pet_tim', 'Lulu Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (510, 'pet_tim', 'Miss Fortune Thỏ Chỉ Huy', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (511, 'pet_tim', 'Orianna T1', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (512, 'pet_tim', 'Sona Cổ Cầm', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (513, 'san_tim', 'Sân Đấu Lễ Hội', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (514, 'san_tim', 'U Mộng Hoa Cảnh', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (515, 'san_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (516, 'san_tim', 'Rìa Tòa Nhà Công Nghệ', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (517, 'san_tim', 'Hội Chợ Nhăm Dần', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (518, 'san_tim', 'Buổi Diễn Tối Thượng', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (519, 'san_tim', 'Thánh Địa Long Thần', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (520, 'san_tim', 'EveryThing Goes On', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (521, 'san_tim', 'Sân Đấu Sinh Nhật Pengu', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (522, 'san_tim', 'Phòng Trà Yên Bình', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (523, 'san_tim', 'Ma Sứ Vs Thiên Sứ', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (524, 'san_tim', 'Tháp Cảnh Mộng Của Gwen', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (525, 'san_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (526, 'san_tim', '4 sàn đấu tím', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (527, 'chuong', 'Cung Ánh Sáng Học Viên Chiến Binh', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (528, 'chuong', 'Hoa Linh Đoạt Mệnh', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (529, 'chuong', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (530, 'chuong', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (531, 'chuong', 'Quả Cầu Ma Thuật Hoa Linh', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (532, 'chuong', 'T1 Đoạt Mệnh', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (533, 'chuong', 'Xoẹt Xoẹt Hồng Pha Lê', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (534, 'chuong', 'Bàn Tay Hỏa Tiễn', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (535, 'chuong', 'Sân Khấu Tử Thần', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (536, 'chuong', 'Pháo Hoa Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (537, 'chuong', 'Tiểu Long Nộ', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (538, 'chuong', 'Ma Xứ Trăng Trối', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (539, 'chuong', 'Khúc Cao Trào Cổ Cầm', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (540, 'chuong', 'Địa Chấn Tuyệt Vô Thần', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (541, 'chuong', 'Tiệm trà ngọt ngào xoẹt xoẹt', 0, 1, '2026-05-25 21:27:58');
INSERT INTO `product_attribute_options` VALUES (542, 'pet_tim', 'Mordekaiser Hắc Tinh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (543, 'pet_tim', 'Soraka Chuối Tí Nị', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (544, 'pet_tim', 'Ashe Nữ Hoàng Vũ Trụ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (545, 'pet_tim', 'Briar Huyết Nguyệt Tí Nị', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (546, 'pet_tim', 'Lucian Cao Bồi Đột Phá', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (547, 'pet_tim', 'Irelia Thần Thoại', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (548, 'pet_tim', 'Lee Sin Tuyệt Vô Thần', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (549, 'pet_tim', 'Jinx Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (550, 'pet_tim', 'Heartsteel Sett', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (551, 'pet_tim', 'Blitz Mãi Bên Crank Bạn Nhé', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (552, 'pet_tim', 'Katarina Anh Linh Chiến Lang', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (553, 'pet_tim', 'Riven Thần Kiếm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (554, 'pet_tim', 'Tristana Pháo Thủ Pengu', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (555, 'pet_tim', 'Darius Lang Vương', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (556, 'pet_tim', 'Zoe Thần Thoại', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (557, 'pet_tim', 'Gwen Hồng Pha Lê', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (558, 'pet_tim', 'Ahri K/DA', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (559, 'pet_tim', 'Aatrox Huyết Nguyệt', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (560, 'pet_tim', 'Janna Dự Báo Thời TIết', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (561, 'pet_tim', 'Seraphine Hồng Pha Lê', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (562, 'pet_tim', 'Syndra Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (563, 'pet_tim', 'Warwick Arcane', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (564, 'pet_tim', 'Choncc Thông Thái', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (565, 'pet_tim', 'Garen Pengu Đột Phá', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (566, 'pet_tim', 'Lux Vũ Trụ Huỷ Diệt', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (567, 'pet_tim', 'Zed Tử Thần Không Gian', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (568, 'pet_tim', 'Amumu tiệc bất ngờ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (569, 'pet_tim', 'Pengu Cosplay Yasuo', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (570, 'pet_tim', 'Yone T1', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (571, 'pet_tim', 'Akali K/DA ALL OUT', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (572, 'pet_tim', 'Lillia Mộng Tưởng Tiên Nữ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (573, 'pet_tim', 'Yasuo Ma Kiếm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (574, 'pet_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (575, 'pet_tim', 'Orianna Trán Hoa Linh Ngọc', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (576, 'pet_tim', 'Orianna T1', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (577, 'pet_tim', 'Irelia Sứ Thanh Hoa', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (578, 'pet_tim', 'Tristana luyện rồng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (579, 'pet_tim', 'Kayle Thiên Sứ Công Nghệ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (580, 'pet_tim', 'Vayne Siêu Phẩm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (581, 'pet_tim', 'Miss Fortune Thỏ Chỉ Huy', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (582, 'pet_tim', 'Briar Cosplay Shork', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (583, 'pet_tim', 'Caitlyn Giả Lập Tí Nị', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (584, 'pet_tim', 'Ezreal Học Vi��n Chiến Binh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (585, 'pet_tim', 'Jhin Vũ Trụ Hắc Ám', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (586, 'pet_tim', 'Garen Sư Vương', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (587, 'pet_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (588, 'pet_tim', 'Ezreal Học Viện Chiến Binh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (589, 'pet_tim', 'Aatrox DRX', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (590, 'pet_tim', 'Sona Cổ Cầm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (591, 'pet_tim', 'Morgana Ác Nữ Khắc Tinh Tí Nị', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (592, 'pet_tim', 'Yone Tà Ánh Song Kiếm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (593, 'pet_tim', 'Ezreal Sứ Thanh Hoa', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (594, 'pet_tim', 'Arcane Annie Fan Cứng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (595, 'pet_tim', 'Morgana Tiên Hắc Ám', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (596, 'pet_tim', 'Yasuo Long Kiếm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (597, 'pet_tim', 'Everything Goes On', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (598, 'pet_tim', 'Gwen Tử Chỉ Dương Khí', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (599, 'pet_tim', 'Riven Ngạo Kiếm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (600, 'pet_tim', 'Gwen Tiệm Trà Ngọt Ngào', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (601, 'pet_tim', 'Jinx arcane', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (602, 'pet_tim', 'Kayle Tí Nị', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (603, 'pet_tim', 'Sett Tí Nị', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (604, 'pet_tim', 'Quán Lê Bunny Bonbon', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (605, 'pet_tim', 'Lee Sin Long Cước', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (606, 'pet_tim', 'Miss Fortune Huyết Nguyệt', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (607, 'pet_tim', 'Sett Song Hồn Hoang Thú', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (608, 'pet_tim', 'Akali Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (609, 'pet_tim', 'Malphite Máy Móc', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (610, 'pet_tim', 'Yone Thần Kiếm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (611, 'pet_tim', 'Yuumi Phù Thủy', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (612, 'pet_tim', 'Katarina Học Viện Chiến Binh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (613, 'pet_tim', 'Lulu Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (614, 'pet_tim', 'Pyke T1', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (615, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (616, 'pet_tim', 'Thresh Cao Bồi', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (617, 'san_tim', 'Mặc định', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (618, 'san_tim', 'Quán Rượu Viễn Tây', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (619, 'san_tim', 'Sân Đấu Thiên Thượng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (620, 'san_tim', 'Sàn Đấu Thiên Thượng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (621, 'san_tim', 'Thủ vệ bằng giá', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (622, 'san_tim', 'Nhà Bí Mật Của Prancie', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (623, 'san_tim', 'Phòng Trà Yên Bình', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (624, 'san_tim', 'Chân Trời Mộng Ước', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (625, 'san_tim', 'Vòng Đài Shurima', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (626, 'san_tim', 'Linh Xà Thần Vực', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (627, 'san_tim', 'Mã Đáo Thành Công', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (628, 'san_tim', 'Quán Giọt Cuối Cùng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (629, 'san_tim', 'Cao ốc Kim Long', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (630, 'san_tim', 'Ngôi Nhà Thỏ Vàng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (631, 'san_tim', 'Tiệm Cà Phê Paris', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (632, 'san_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (633, 'san_tim', 'Móng Vuốt Mùa Đông', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (634, 'san_tim', 'Sân Chơi Yuumi', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (635, 'san_tim', 'Buổi Diễn Tối Thượng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (636, 'san_tim', 'Đỉnh Cực Quang', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (637, 'san_tim', 'Ma Sứ vs Thần Sứ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (638, 'san_tim', 'Tháp Cảnh Mộng Của Gwen', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (639, 'san_tim', 'Khu Nhac Chill Của Choncc', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (640, 'san_tim', 'Bồng Lai Tiên Cảnh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (641, 'san_tim', 'EveryThing Goes On', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (642, 'san_tim', 'Khu Nhac Chill của Choncc', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (643, 'san_tim', 'Hội Chợ Nhâm Dần', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (644, 'san_tim', 'Hội Chợ Nhăm Dần', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (645, 'san_tim', 'Khu Nghỉ Dưỡng của Choncc', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (646, 'san_tim', 'Giấc Mơ Demacia', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (647, 'san_tim', 'Móng vuốt mùa đông', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (648, 'san_tim', 'Cầu Tiến Bộ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (649, 'san_tim', 'Vườn Độc Dược', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (650, 'san_tim', 'K.O Đại Chiến', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (651, 'san_tim', 'Malphite Hộ Pháp Không Gian', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (652, 'san_tim', 'Bình Nguyên Volrachnum', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (653, 'san_tim', 'Hộp Đêm Tân Sửu', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (654, 'san_tim', 'Everything Goes On', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (655, 'san_tim', 'U Mộng Hoa Cảnh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (656, 'san_tim', 'Nhà bí mật của Prancie', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (657, 'san_tim', 'Đại chiến anh hùng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (658, 'san_tim', '3 sàn tím', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (659, 'san_tim', 'Mặc Định', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (660, 'san_tim', 'Kho hàng dui dẻ của Jinx', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (661, 'san_tim', 'Vườn độc dược', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (662, 'san_tim', 'Trường luyện rồng', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (663, 'san_tim', 'Sân đấu siêu tân tinh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (664, 'san_tim', 'Tang thư ma pháp', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (665, 'san_tim', 'Khu hầm trú ánh lửa', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (666, 'san_tim', 'Quán Le Bunny BonBon', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (667, 'san_tim', 'Huyết Nguyệt Dạ Hành', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (668, 'san_tim', 'Chiến Binh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (669, 'san_tim', 'Thủ Vệ Băng Giá', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (670, 'san_tim', 'Đấu Trường Hextech', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (671, 'san_tim', 'Ban Công Giao Thừa', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (672, 'san_tim', 'Tháp cảnh mộng của Gwen', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (673, 'san_tim', 'Sân Đấu Siêu Tân Binh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (674, 'chuong', 'Mặc định', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (675, 'chuong', 'Thanh Trừng Cao Bồi', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (676, 'chuong', 'Khúc  Cao Trào Cổ Cầm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (677, 'chuong', 'Bông Sen Tử Thân Anh Linh Chiến Lang', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (678, 'chuong', 'Chuối Vẫn Tinh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (679, 'chuong', 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (680, 'chuong', 'Khúc Cao Trào Cổ Cầm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (681, 'chuong', 'Arcane Khóa Chết', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (682, 'chuong', 'Địa Chấn Tuyệt Vô Thần', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (683, 'chuong', 'Nện Cái Nè', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (684, 'chuong', 'Thanh Kiếm Tiên Phong Sứ Thanh Hoa', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (685, 'chuong', 'Cung Ánh Sáng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (686, 'chuong', 'T1 Đoạt Mệnh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (687, 'chuong', 'Cung Ánh Sáng Học Viên Chiến Binh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (688, 'chuong', 'Ma Xứ Trăng Trối', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (689, 'chuong', 'T1 Tử Thần Đấy Sâu', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (690, 'chuong', 'Hoa Linh Đoạt Mệnh', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (691, 'chuong', 'Lệnh T1 : Sóng Âm', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (692, 'chuong', 'Tên Lửa Đạn Đạo', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (693, 'chuong', 'Sân Khấu Tử Thần Của Jhin', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (694, 'chuong', 'Công Lý Demecia Sư Vương', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (695, 'chuong', 'Đại Bác Đẩy Lùi', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (696, 'chuong', 'Máy Chém Noxus Lang Vương', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (697, 'chuong', 'Mũi Tên Thơ Thẩn Phù Thủy', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (698, 'chuong', 'ULTRA RAPID FIRE', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (699, 'chuong', 'Ác Nữ Khắc Tinh Trói Hồn', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (700, 'chuong', 'Đại Băng Tiễn Bao Bồi', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (701, 'chuong', 'Đại Bác Đẩy Lùi Pháo Thủ', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (702, 'chuong', 'Xoẹt Xoẹt Hồng Pha Lê', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (703, 'chuong', 'Máy Chem Noxus Lang Vương', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (704, 'chuong', 'Mũi Tên Bạc', 0, 1, '2026-05-25 21:31:31');
INSERT INTO `product_attribute_options` VALUES (705, 'chuong', 'Bàn Tay Hỏa Tiễn', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (706, 'chuong', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (707, 'chuong', 'Mưa Đạn Thỏ Chỉ Huy', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (708, 'chuong', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (709, 'chuong', 'T1 Tử Thần Đáy Sâu', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (710, 'chuong', 'Ngọn Thương Ánh Sáng Vệ Binh Tinh Tú', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (711, 'chuong', 'Khắc Tên Vào Lịch Sử', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (712, 'chuong', 'Xe Chỉ Luồn Kim', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (713, 'chuong', 'Bách Phát Bách Trúng', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (714, 'chuong', 'chưởng cung ánh sáng hv', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (715, 'chuong', 'Siêu phẩm : mũi tên bạc', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (716, 'chuong', 't1 đoạt mệnh', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (717, 'chuong', 'đại bác đẩy lùi luyện rồng', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (718, 'chuong', 'mặc định', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (719, 'chuong', '3 chưởng lực tím', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (720, 'chuong', 'Mặc Định', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (721, 'chuong', 'Arcane Tên lửa đạn đạo siêu khủng khiếp', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (722, 'chuong', 'Ánh lửa lưỡng giới đồng quy', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (723, 'chuong', 'None', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (724, 'chuong', 'Tiệm Trà Ngọt Ngào Xoẹt Xoẹt', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (725, 'chuong', 'Tiểu Long Nộ', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (726, 'chuong', 'Sân Khấu Tử Thần', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (727, 'chuong', 'Cuồng Thú Quyền', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (728, 'chuong', 'Hoa Linh Lục Địa', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (729, 'chuong', 'Máy Chém Lang Vương', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (730, 'chuong', 'Mũi tên bạc', 0, 1, '2026-05-25 21:31:32');
INSERT INTO `product_attribute_options` VALUES (731, 'pet_tim', 'Sett Song Hồn Hoang Thú', 0, 1, '2026-05-25 21:32:04');
INSERT INTO `product_attribute_options` VALUES (732, 'pet_tim', 'Irelia Sứ Thanh Hoa', 0, 1, '2026-05-25 21:32:04');
INSERT INTO `product_attribute_options` VALUES (733, 'pet_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:32:04');
INSERT INTO `product_attribute_options` VALUES (734, 'pet_tim', 'Ashe Nữ Hoàng Vũ Trụ', 0, 1, '2026-05-25 21:32:04');
INSERT INTO `product_attribute_options` VALUES (735, 'pet_tim', 'Aatrox Huyết Nguyệt', 0, 1, '2026-05-25 21:32:04');
INSERT INTO `product_attribute_options` VALUES (736, 'pet_tim', 'Lee Sin Tuyệt Vô Thần', 0, 1, '2026-05-25 21:32:04');
INSERT INTO `product_attribute_options` VALUES (737, 'pet_tim', 'Katarina Học Viện Chiến Binh', 0, 1, '2026-05-25 21:32:04');
INSERT INTO `product_attribute_options` VALUES (738, 'pet_tim', 'Arcane Vi Tí Nị', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (739, 'pet_tim', 'Riven Thần Kiếm', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (740, 'pet_tim', 'Irelia Thần Thoại', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (741, 'pet_tim', 'Arcance Caitlyn', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (742, 'pet_tim', 'Gwen Tử Chỉ Dương Khí', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (743, 'pet_tim', 'Yone T1', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (744, 'pet_tim', 'Miss Fortune Thỏ Chỉ Huy', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (745, 'pet_tim', 'Quán Lê Bunny Bonbon', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (746, 'pet_tim', 'Janna Dự Báo Thời TIết', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (747, 'pet_tim', 'Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (748, 'pet_tim', 'Riven Ngạo Kiếm', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (749, 'san_tim', 'Tinh Tú Hắc Ám', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (750, 'san_tim', 'Cao Ốc Kim Long', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (751, 'san_tim', 'Huyết Nguyệt Dạ Hành', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (752, 'san_tim', 'Khu Nhac Chill Của Choncc', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (753, 'san_tim', 'Khu Nhac Chill của Choncc', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (754, 'san_tim', 'Quán Lê Bunny Bonbon', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (755, 'chuong', 'Thần Linh Định Đoạt', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (756, 'chuong', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (757, 'chuong', 'Địa Chấn Tuyệt Vô Thần', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (758, 'chuong', 'Hắc Ám Soi Rọi', 0, 1, '2026-05-25 21:32:05');
INSERT INTO `product_attribute_options` VALUES (759, 'pet_tim', 'Soraka Chuối Tí Nị', 0, 1, '2026-05-25 21:32:21');
INSERT INTO `product_attribute_options` VALUES (760, 'pet_tim', 'Ashe Nữ Hoàng Vũ Trụ', 0, 1, '2026-05-25 21:32:21');
INSERT INTO `product_attribute_options` VALUES (761, 'pet_tim', 'Briar Huyết Nguyệt Tí Nị', 0, 1, '2026-05-25 21:32:21');
INSERT INTO `product_attribute_options` VALUES (762, 'pet_tim', 'Lucian Cao Bồi Đột Phá', 0, 1, '2026-05-25 21:32:21');
INSERT INTO `product_attribute_options` VALUES (763, 'san_tim', 'Quán Rượu Viễn Tây', 0, 1, '2026-05-25 21:32:21');
INSERT INTO `product_attribute_options` VALUES (764, 'san_tim', 'Tinh Tú Hắc Ám', 0, 1, '2026-05-25 21:32:21');
INSERT INTO `product_attribute_options` VALUES (765, 'chuong', 'Thanh Trừng Cao Bồi', 0, 1, '2026-05-25 21:32:21');
INSERT INTO `product_attribute_options` VALUES (766, 'chuong', 'Chuối Vẫn Tinh', 0, 1, '2026-05-25 21:32:21');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` int UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `price` decimal(15, 0) NOT NULL COMMENT 'Gi?? b??n (VND)',
  `original_price` decimal(15, 0) NOT NULL COMMENT 'Gi?? g???c ch??a gi???m (VND)',
  `discount_percent` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Ph???n tr??m gi???m gi?? (0-100)',
  `fake_remaining_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT 'S??? l?????ng ???o c??n l???i',
  `fake_sold_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT 'S??? l?????ng ???o ???? b??n',
  `pet_tim` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `san_tim` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'S??? s??n t??m / th??ng tin s??n',
  `chuong` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'S??? ch?????ng / th??ng tin ch?????ng',
  `extra_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Th??ng tin b??? sung',
  `status` enum('available','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_products_category`(`category_id` ASC) USING BTREE,
  INDEX `idx_products_status`(`status` ASC) USING BTREE,
  INDEX `idx_products_price`(`price` ASC) USING BTREE,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1017 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (390, 1, 'YoneThanKiem', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718172/bomrautft/products/yonethankiem.webp', 2499000, 3570000, 30, 0, 0, 'Yone Thần Kiếm', NULL, NULL, NULL, 'available', '2026-05-25 21:27:32', '2026-05-25 21:27:32');
INSERT INTO `products` VALUES (391, 1, 'YasuoLongKiem', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718176/bomrautft/products/yasuolongkiem.webp', 2998000, 4282857, 30, 0, 0, 'Yasuo Long Kiếm', NULL, NULL, NULL, 'available', '2026-05-25 21:27:33', '2026-05-25 21:27:33');
INSERT INTO `products` VALUES (392, 1, 'LeeTieuLong', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718180/bomrautft/products/leetieulong.webp', 2998000, 4282857, 30, 0, 0, 'Lee Tiểu Long', NULL, NULL, NULL, 'available', '2026-05-25 21:27:34', '2026-05-25 21:27:34');
INSERT INTO `products` VALUES (393, 1, '400', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718184/bomrautft/products/400.webp', 2999000, 3748750, 20, 0, 0, 'Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', NULL, 'Cung Ánh Sáng Học Viên Chiến Binh,Hoa Linh Đoạt Mệnh', NULL, 'available', '2026-05-25 21:27:36', '2026-05-25 21:27:36');
INSERT INTO `products` VALUES (394, 1, '538', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718188/bomrautft/products/538.webp', 2999000, 3748750, 20, 0, 0, 'Lee Tiểu Long,Pengu Luyện Rồng', 'Sân Đấu Lễ Hội', 'Hoa Linh Đoạt Mệnh, Tên Lửa Đạn Đạo Siêu Khủng Khiếp', NULL, 'available', '2026-05-25 21:27:37', '2026-05-25 21:27:37');
INSERT INTO `products` VALUES (395, 1, '665', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718192/bomrautft/products/665.webp', 2999000, 3748750, 20, 0, 0, 'Yasuo Long Kiếm', NULL, 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:27:39', '2026-05-25 21:27:39');
INSERT INTO `products` VALUES (396, 1, '645', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718197/bomrautft/products/645.webp', 3339000, 4173750, 20, 0, 0, 'Lillia Mộng Tưởng Tiên Nữ,Thresh Cao Bồi,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 'U Mộng Hoa Cảnh', 'Quả Cầu Ma Thuật Hoa Linh', NULL, 'available', '2026-05-25 21:27:40', '2026-05-25 21:27:40');
INSERT INTO `products` VALUES (397, 1, '416', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718200/bomrautft/products/416.webp', 3499000, 4373750, 20, 0, 0, 'Yone Thần Kiếm,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:27:41', '2026-05-25 21:27:41');
INSERT INTO `products` VALUES (398, 1, '448', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718204/bomrautft/products/448.webp', 3499000, 4373750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Rìa Tòa Nhà Công Nghệ', 'Xoẹt Xoẹt Hồng Pha Lê, Bàn Tay Hỏa Tiễn,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:27:43', '2026-05-25 21:27:43');
INSERT INTO `products` VALUES (399, 1, '502', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718208/bomrautft/products/502.webp', 3499000, 4373750, 20, 0, 0, 'Lee Tiểu Long,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:27:44', '2026-05-25 21:27:44');
INSERT INTO `products` VALUES (400, 1, '#119', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718212/bomrautft/products/119.webp', 3999000, 4998750, 20, 0, 0, 'Ahri Vệ Binh Tinh Tú,Ezreal Học Viện Chiến Binh,Jhin Vũ Trụ Hắc Ám,Yasuo Long Kiếm,Jinx Pháo Hoa', 'Hội Chợ Nhăm Dần,Buổi Diễn Tối Thượng,Thánh Địa Long Thần,EveryThing Goes On', 'Sân Khấu Tử Thần,Pháo Hoa Siêu Khủng Khiếp', NULL, 'available', '2026-05-25 21:27:45', '2026-05-25 21:27:45');
INSERT INTO `products` VALUES (401, 1, '410', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718216/bomrautft/products/410.webp', 3999000, 4998750, 20, 0, 0, 'Yasuo Long Kiếm', 'Sân Đấu Sinh Nhật Pengu', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:27:47', '2026-05-25 21:27:47');
INSERT INTO `products` VALUES (402, 1, '463', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719268/bomrautft/products/463.webp', 4799000, 5998750, 20, 0, 0, 'Jhin Vũ Trụ Hắc Ám,Lee Tiểu Long,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Tiểu Long Nộ', NULL, 'available', '2026-05-25 21:27:48', '2026-05-25 21:27:48');
INSERT INTO `products` VALUES (403, 1, '615', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719270/bomrautft/products/615.webp', 4799000, 5998750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Yasuo Long Kiếm,Teemo Tiểu Quỷ,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Ma Xứ Trăng Trối,Khúc Cao Trào Cổ Cầm,Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:27:50', '2026-05-25 21:27:50');
INSERT INTO `products` VALUES (404, 1, '623', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719272/bomrautft/products/623.webp', 4899000, 6123750, 20, 0, 0, 'Lee Tiểu Long,Morgana Tiên Hắc Ám,Orianna Trán Hoa Linh Ngọc,Sett Song Hồn Hoang Thú,Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Tiểu Long Nộ', NULL, 'available', '2026-05-25 21:27:52', '2026-05-25 21:27:52');
INSERT INTO `products` VALUES (405, 1, '#291', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719273/bomrautft/products/291.webp', 7499000, 9373750, 20, 0, 0, 'Akali K/DA ALL OUT,Gwen Hồng Pha Lê,Miss Fortune Huyết Nguyệt,Sena Cao Bồi,Yasuo Ma Kiếm,Yone T1,Yone Tà Ánh Song Kiếm,Morgana Khổng Tước Hoàng Hậu', 'EveryThing Goes On,U Mộng Hoa Cảnh,Phòng Trà Yên Bình,Ma Sứ Vs Thiên Sứ,Tháp Cảnh Mộng Của Gwen', 'Xoẹt Xoẹt Hồng Pha Lê , T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:27:54', '2026-05-25 21:27:54');
INSERT INTO `products` VALUES (406, 1, '479', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719275/bomrautft/products/479.webp', 9999000, 12498750, 20, 0, 0, 'Ezreal Học Viện Chiến Binh,Gwen Tử Chỉ Dương Khí,Irelia Thần Thoại,Orianna Trán Hoa Linh Ngọc,Yone T1,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu,Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Quả Cầu Ma Thuật Hoa Linh', NULL, 'available', '2026-05-25 21:27:55', '2026-05-25 21:27:55');
INSERT INTO `products` VALUES (407, 1, '#043', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719277/bomrautft/products/043.webp', 14499000, 24165000, 40, 0, 0, 'Aatrox Huyết Nguyệt,Ahri Chiêu Hồn Thiên Hồ,Ashe Long Tiễn,Gwen Tiệm Trà Ngọt Ngào,Irelia Sứ Thanh Hoa,Lulu Vệ Binh Tinh Tú,Miss Fortune Thỏ Chỉ Huy,Orianna T1,Sona Cổ Cầm', '4 sàn đấu tím', 'Tiệm trà ngọt ngào xoẹt xoẹt', NULL, 'available', '2026-05-25 21:27:57', '2026-05-25 21:27:57');
INSERT INTO `products` VALUES (408, 2, '#MordekaiserHacTinhVip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718232/bomrautft/products/mordekaiserhactinhvip1.webp', 189000, 236250, 20, 0, 0, 'Mordekaiser Hắc Tinh', NULL, NULL, NULL, 'available', '2026-05-25 21:28:06', '2026-05-25 21:28:06');
INSERT INTO `products` VALUES (409, 2, 'sorakachuoi', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718236/bomrautft/products/sorakachuoi.webp', 189000, 236250, 20, 0, 0, 'Soraka Chuối Tí Nị', NULL, NULL, NULL, 'available', '2026-05-25 21:28:08', '2026-05-25 21:28:08');
INSERT INTO `products` VALUES (410, 2, 'ashenuhoangvutru', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718241/bomrautft/products/ashenuhoangvutru.webp', 189000, 236250, 20, 0, 0, 'Ashe Nữ Hoàng Vũ Trụ', NULL, NULL, NULL, 'available', '2026-05-25 21:28:09', '2026-05-25 21:28:09');
INSERT INTO `products` VALUES (411, 2, 'briarhuyetnguyet', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718245/bomrautft/products/briarhuyetnguyet.webp', 189000, 236250, 20, 0, 0, 'Briar Huyết Nguyệt Tí Nị', NULL, NULL, NULL, 'available', '2026-05-25 21:28:11', '2026-05-25 21:28:11');
INSERT INTO `products` VALUES (412, 2, 'Luciancaoboi', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718249/bomrautft/products/luciancaoboi.webp', 189000, 236250, 20, 0, 0, 'Lucian Cao Bồi Đột Phá', NULL, NULL, NULL, 'available', '2026-05-25 21:28:12', '2026-05-25 21:28:12');
INSERT INTO `products` VALUES (413, 2, '#irelia', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718254/bomrautft/products/irelia.jpg', 289000, 361250, 20, 0, 0, 'Irelia Thần Thoại', NULL, NULL, NULL, 'available', '2026-05-25 21:28:14', '2026-05-25 21:28:14');
INSERT INTO `products` VALUES (414, 2, '#LeeTuyetVoThan', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718258/bomrautft/products/leetuyetvothan.webp', 289000, 361250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', 'Mặc định', 'Mặc định', NULL, 'available', '2026-05-25 21:28:15', '2026-05-25 21:28:15');
INSERT INTO `products` VALUES (415, 2, '452', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718262/bomrautft/products/452.webp', 349000, 436250, 20, 0, 0, 'Jinx Vệ Binh Tinh Tú', NULL, NULL, NULL, 'available', '2026-05-25 21:28:16', '2026-05-25 21:28:16');
INSERT INTO `products` VALUES (416, 2, 'luciancaoboivip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718266/bomrautft/products/luciancaoboivip1.webp', 389000, 486250, 20, 0, 0, 'Lucian Cao Bồi Đột Phá', 'Quán Rượu Viễn Tây', 'Thanh Trừng Cao Bồi', NULL, 'available', '2026-05-25 21:28:17', '2026-05-25 21:28:17');
INSERT INTO `products` VALUES (417, 2, '606', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718270/bomrautft/products/606.webp', 449000, 561250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', NULL, NULL, NULL, 'available', '2026-05-25 21:28:19', '2026-05-25 21:28:19');
INSERT INTO `products` VALUES (418, 2, '607', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718274/bomrautft/products/607.webp', 449000, 561250, 20, 0, 0, 'Heartsteel Sett', NULL, 'Khúc  Cao Trào Cổ Cầm', NULL, 'available', '2026-05-25 21:28:20', '2026-05-25 21:28:20');
INSERT INTO `products` VALUES (419, 2, '644', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718278/bomrautft/products/644.webp', 449000, 561250, 20, 0, 0, 'Blitz Mãi Bên Crank Bạn Nhé', NULL, NULL, NULL, 'available', '2026-05-25 21:28:22', '2026-05-25 21:28:22');
INSERT INTO `products` VALUES (420, 2, '628', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718616/bomrautft/products/628.webp', 459000, 573750, 20, 0, 0, 'Katarina Anh Linh Chiến Lang', NULL, 'Bông Sen Tử Thân Anh Linh Chiến Lang', NULL, 'available', '2026-05-25 21:28:23', '2026-05-25 21:28:23');
INSERT INTO `products` VALUES (421, 2, '664', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718618/bomrautft/products/664.webp', 489000, 611250, 20, 0, 0, 'Riven Thần Kiếm,Tristana Pháo Thủ Pengu', NULL, NULL, NULL, 'available', '2026-05-25 21:28:24', '2026-05-25 21:28:24');
INSERT INTO `products` VALUES (422, 2, 'sorakachuoitinivip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718620/bomrautft/products/sorakachuoitinivip1.webp', 549000, 686250, 20, 0, 0, 'Soraka Chuối Tí Nị', NULL, 'Chuối Vẫn Tinh', NULL, 'available', '2026-05-25 21:28:26', '2026-05-25 21:28:26');
INSERT INTO `products` VALUES (423, 2, 'ashenuhoangvutruvip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718621/bomrautft/products/ashenuhoangvutruvip1.webp', 549000, 686250, 20, 0, 0, 'Ashe Nữ Hoàng Vũ Trụ', NULL, NULL, NULL, 'available', '2026-05-25 21:28:27', '2026-05-25 21:28:27');
INSERT INTO `products` VALUES (424, 2, '631', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718622/bomrautft/products/631.webp', 549000, 686250, 20, 0, 0, 'Darius Lang Vương,Zoe Thần Thoại', 'Quán Rượu Viễn Tây', NULL, NULL, 'available', '2026-05-25 21:28:29', '2026-05-25 21:28:29');
INSERT INTO `products` VALUES (425, 2, '632', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718626/bomrautft/products/632.webp', 549000, 686250, 20, 0, 0, 'Gwen Hồng Pha Lê', NULL, 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú', NULL, 'available', '2026-05-25 21:28:30', '2026-05-25 21:28:30');
INSERT INTO `products` VALUES (426, 2, '640', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718627/bomrautft/products/640.webp', 549000, 686250, 20, 0, 0, 'Ahri K/DA', NULL, 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú', NULL, 'available', '2026-05-25 21:28:31', '2026-05-25 21:28:31');
INSERT INTO `products` VALUES (427, 2, '578', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718629/bomrautft/products/578.webp', 589000, 736250, 20, 0, 0, 'Aatrox Huyết Nguyệt,Ahri K/DA', NULL, NULL, NULL, 'available', '2026-05-25 21:28:33', '2026-05-25 21:28:33');
INSERT INTO `products` VALUES (428, 2, '620', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718631/bomrautft/products/620.webp', 599000, 748750, 20, 0, 0, 'Janna Dự Báo Thời TIết,Seraphine Hồng Pha Lê', NULL, 'Khúc Cao Trào Cổ Cầm', NULL, 'available', '2026-05-25 21:28:34', '2026-05-25 21:28:34');
INSERT INTO `products` VALUES (429, 2, 'KataAnhLinhChienLang', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718632/bomrautft/products/kataanhlinhchienlang.webp', 649000, 811250, 20, 0, 0, 'Katarina Anh Linh Chiến Lang', 'Sân Đấu Thiên Thượng', 'Bông Sen Tử Thân Anh Linh Chiến Lang', NULL, 'available', '2026-05-25 21:28:35', '2026-05-25 21:28:35');
INSERT INTO `products` VALUES (430, 2, '#SyndraVeBinhTinhTu', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718634/bomrautft/products/syndravebinhtinhtu.webp', 649000, 811250, 20, 0, 0, 'Syndra Vệ Binh Tinh Tú', 'Sàn Đấu Thiên Thượng', 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú', NULL, 'available', '2026-05-25 21:28:36', '2026-05-25 21:28:36');
INSERT INTO `products` VALUES (431, 2, '660', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718636/bomrautft/products/660.webp', 649000, 811250, 20, 0, 0, 'Warwick Arcane,Choncc Thông Thái,Garen Pengu Đột Phá', NULL, 'Arcane Khóa Chết', NULL, 'available', '2026-05-25 21:28:38', '2026-05-25 21:28:38');
INSERT INTO `products` VALUES (432, 2, '#061', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718637/bomrautft/products/061.webp', 689000, 861250, 20, 0, 0, 'Lux Vũ Trụ Huỷ Diệt,Zed Tử Thần Không Gian', 'Thủ vệ bằng giá', 'Mặc định', NULL, 'available', '2026-05-25 21:28:40', '2026-05-25 21:28:40');
INSERT INTO `products` VALUES (433, 2, '#LeeTuyetVoThanVip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718639/bomrautft/products/leetuyetvothanvip1.webp', 689000, 861250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', 'Nhà Bí Mật Của Prancie', 'Địa Chấn Tuyệt Vô Thần,Nện Cái Nè', NULL, 'available', '2026-05-25 21:28:41', '2026-05-25 21:28:41');
INSERT INTO `products` VALUES (434, 2, '440', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718640/bomrautft/products/440.webp', 689000, 861250, 20, 0, 0, 'Amumu tiệc bất ngờ,Pengu Cosplay Yasuo', 'Quán Rượu Viễn Tây', 'Thanh Kiếm Tiên Phong Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:28:42', '2026-05-25 21:28:42');
INSERT INTO `products` VALUES (435, 2, '667', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718642/bomrautft/products/667.webp', 689000, 861250, 20, 0, 0, 'Heartsteel Sett', NULL, 'Cung Ánh Sáng Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:28:44', '2026-05-25 21:28:44');
INSERT INTO `products` VALUES (436, 2, '#130', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718644/bomrautft/products/130.webp', 799000, 998750, 20, 0, 0, 'Riven Thần Kiếm,Tristana Pháo Thủ Pengu', NULL, NULL, NULL, 'available', '2026-05-25 21:28:45', '2026-05-25 21:28:45');
INSERT INTO `products` VALUES (437, 2, '657', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719327/bomrautft/products/657.webp', 799000, 998750, 20, 0, 0, 'Tristana Pháo Thủ Pengu,Yone T1', NULL, 'T1 Đoạt Mệnh,,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:28:47', '2026-05-25 21:28:47');
INSERT INTO `products` VALUES (438, 2, '658', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719328/bomrautft/products/658.webp', 799000, 998750, 20, 0, 0, 'Aatrox Huyết Nguyệt', 'Phòng Trà Yên Bình', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:28:49', '2026-05-25 21:28:49');
INSERT INTO `products` VALUES (439, 2, '#251', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719330/bomrautft/products/251.webp', 899000, 1123750, 20, 0, 0, 'Akali K/DA ALL OUT,Lillia Mộng Tưởng Tiên Nữ', NULL, 'Ma Xứ Trăng Trối', NULL, 'available', '2026-05-25 21:28:50', '2026-05-25 21:28:50');
INSERT INTO `products` VALUES (440, 2, '612', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719332/bomrautft/products/612.webp', 899000, 1123750, 20, 0, 0, 'Ahri K/DA', 'Chân Trời Mộng Ước', 'Cung Ánh Sáng Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:28:52', '2026-05-25 21:28:52');
INSERT INTO `products` VALUES (441, 2, '622', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719333/bomrautft/products/622.webp', 899000, 1123750, 20, 0, 0, 'Yasuo Ma Kiếm,Syndra Vệ Binh Tinh Tú', 'Vòng Đài Shurima', 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú,T1 Tử Thần Đấy Sâu', NULL, 'available', '2026-05-25 21:28:53', '2026-05-25 21:28:53');
INSERT INTO `products` VALUES (442, 2, '636', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719335/bomrautft/products/636.webp', 899000, 1123750, 20, 0, 0, 'Janna Dự Báo Thời TIết', 'Linh Xà Thần Vực', 'Hoa Linh Đoạt Mệnh', NULL, 'available', '2026-05-25 21:28:55', '2026-05-25 21:28:55');
INSERT INTO `products` VALUES (443, 2, '649', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719337/bomrautft/products/649.webp', 899000, 1123750, 20, 0, 0, 'Yone T1', 'Mã Đáo Thành Công', NULL, NULL, 'available', '2026-05-25 21:28:57', '2026-05-25 21:28:57');
INSERT INTO `products` VALUES (444, 2, '348', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719339/bomrautft/products/348.webp', 949000, 1186250, 20, 0, 0, 'Jinx Vệ Binh Tinh Tú', 'Mã Đáo Thành Công', NULL, NULL, 'available', '2026-05-25 21:28:59', '2026-05-25 21:28:59');
INSERT INTO `products` VALUES (445, 2, '579', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719340/bomrautft/products/579.webp', 949000, 1186250, 20, 0, 0, 'Mordekaiser Hắc Tinh', 'Quán Giọt Cuối Cùng', NULL, NULL, 'available', '2026-05-25 21:29:01', '2026-05-25 21:29:01');
INSERT INTO `products` VALUES (446, 2, '#LeeTuyetVoThanVip2', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719342/bomrautft/products/leetuyetvothanvip2.webp', 999000, 1248750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:29:02', '2026-05-25 21:29:02');
INSERT INTO `products` VALUES (447, 2, '#247', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719344/bomrautft/products/247.webp', 999000, 1248750, 20, 0, 0, 'Orianna Trán Hoa Linh Ngọc', 'Phòng Trà Yên Bình', 'Khúc Cao Trào Cổ Cầm', NULL, 'available', '2026-05-25 21:29:04', '2026-05-25 21:29:04');
INSERT INTO `products` VALUES (448, 2, '#270', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719346/bomrautft/products/270.webp', 999000, 1248750, 20, 0, 0, 'Riven Thần Kiếm,Heartsteel Sett', NULL, NULL, NULL, 'available', '2026-05-25 21:29:06', '2026-05-25 21:29:06');
INSERT INTO `products` VALUES (449, 2, '#292', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719347/bomrautft/products/292.webp', 999000, 1248750, 20, 0, 0, 'Orianna T1', 'Ngôi Nhà Thỏ Vàng', 'Lệnh T1 : Sóng Âm', NULL, 'available', '2026-05-25 21:29:08', '2026-05-25 21:29:08');
INSERT INTO `products` VALUES (450, 2, '351', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719349/bomrautft/products/351.webp', 999000, 1248750, 20, 0, 0, 'Irelia Sứ Thanh Hoa', 'Tiệm Cà Phê Paris', NULL, NULL, 'available', '2026-05-25 21:29:09', '2026-05-25 21:29:09');
INSERT INTO `products` VALUES (451, 2, '359', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719350/bomrautft/products/359.webp', 999000, 1248750, 20, 0, 0, 'Tristana luyện rồng,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Tên Lửa Đạn Đạo', NULL, 'available', '2026-05-25 21:29:11', '2026-05-25 21:29:11');
INSERT INTO `products` VALUES (452, 2, '408', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719352/bomrautft/products/408.webp', 999000, 1248750, 20, 0, 0, 'Tristana Pháo Thủ Pengu', 'Móng Vuốt Mùa Đông', 'Sân Khấu Tử Thần Của Jhin', NULL, 'available', '2026-05-25 21:29:12', '2026-05-25 21:29:12');
INSERT INTO `products` VALUES (453, 2, '417', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719354/bomrautft/products/417.webp', 999000, 1248750, 20, 0, 0, 'Tristana luyện rồng', 'Ngôi Nhà Thỏ Vàng', 'Cung Ánh Sáng Học Viên Chiến Binh,Lệnh T1 : Sóng Âm', 'Cổng Sơn Hải Bình Minh', 'available', '2026-05-25 21:29:14', '2026-05-25 21:29:14');
INSERT INTO `products` VALUES (454, 2, '424', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719355/bomrautft/products/424.webp', 999000, 1248750, 20, 0, 0, 'Lillia Mộng Tưởng Tiên Nữ,Kayle Thiên Sứ Công Nghệ', NULL, NULL, NULL, 'available', '2026-05-25 21:29:16', '2026-05-25 21:29:16');
INSERT INTO `products` VALUES (455, 2, '162', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719357/bomrautft/products/162.webp', 999000, 1248750, 20, 0, 0, 'Janna Dự Báo Thời TIết,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Khúc Cao Trào Cổ Cầm,Công Lý Demecia Sư Vương', NULL, 'available', '2026-05-25 21:29:18', '2026-05-25 21:29:18');
INSERT INTO `products` VALUES (456, 2, '507', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719360/bomrautft/products/507.webp', 999000, 1248750, 20, 0, 0, 'Tristana Pháo Thủ Pengu,Yone T1', NULL, 'Đại Bác Đẩy Lùi,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:29:20', '2026-05-25 21:29:20');
INSERT INTO `products` VALUES (457, 2, '517', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719361/bomrautft/products/517.webp', 999000, 1248750, 20, 0, 0, 'Lillia Mộng Tưởng Tiên Nữ', 'Sân Chơi Yuumi', 'Địa Chấn Tuyệt Vô Thần,Máy Chém Noxus Lang Vương', NULL, 'available', '2026-05-25 21:29:22', '2026-05-25 21:29:22');
INSERT INTO `products` VALUES (458, 2, '522', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719363/bomrautft/products/522.webp', 999000, 1248750, 20, 0, 0, 'Orianna T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:29:23', '2026-05-25 21:29:23');
INSERT INTO `products` VALUES (459, 2, '528', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719365/bomrautft/products/528.webp', 999000, 1248750, 20, 0, 0, 'Vayne Siêu Phẩm', 'Buổi Diễn Tối Thượng', 'Mũi Tên Thơ Thẩn Phù Thủy,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:29:25', '2026-05-25 21:29:25');
INSERT INTO `products` VALUES (460, 2, '545', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719366/bomrautft/products/545.webp', 999000, 1248750, 20, 0, 0, 'Miss Fortune Thỏ Chỉ Huy,Seraphine Hồng Pha Lê', 'Đỉnh Cực Quang', 'Địa Chấn Tuyệt Vô Thần,ULTRA RAPID FIRE', NULL, 'available', '2026-05-25 21:29:27', '2026-05-25 21:29:27');
INSERT INTO `products` VALUES (461, 2, '551', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719368/bomrautft/products/551.webp', 999000, 1248750, 20, 0, 0, 'Briar Cosplay Shork,Cao Ốc Kim Long', 'Cao Ốc Kim Long,Quán Giọt Cuối Cùng', NULL, NULL, 'available', '2026-05-25 21:29:28', '2026-05-25 21:29:28');
INSERT INTO `products` VALUES (462, 2, '602', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719370/bomrautft/products/602.webp', 999000, 1248750, 20, 0, 0, 'Irelia Thần Thoại,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:29:30', '2026-05-25 21:29:30');
INSERT INTO `products` VALUES (463, 2, '609', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719371/bomrautft/products/609.webp', 999000, 1248750, 20, 0, 0, 'Cao Ốc Kim Long,Caitlyn Giả Lập Tí Nị', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:29:32', '2026-05-25 21:29:32');
INSERT INTO `products` VALUES (464, 2, '633', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719374/bomrautft/products/633.webp', 999000, 1248750, 20, 0, 0, 'Ezreal Học Vi��n Chiến Binh', 'Ma Sứ vs Thần Sứ', 'Ma Xứ Trăng Trối', NULL, 'available', '2026-05-25 21:29:34', '2026-05-25 21:29:34');
INSERT INTO `products` VALUES (465, 2, '637', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719375/bomrautft/products/637.webp', 999000, 1248750, 20, 0, 0, 'Syndra Vệ Binh Tinh Tú', 'Tháp Cảnh Mộng Của Gwen', 'Ác Nữ Khắc Tinh Trói Hồn', NULL, 'available', '2026-05-25 21:29:36', '2026-05-25 21:29:36');
INSERT INTO `products` VALUES (466, 2, '661', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719377/bomrautft/products/661.webp', 999000, 1248750, 20, 0, 0, 'Jhin Vũ Trụ Hắc Ám,Cao Ốc Kim Long', 'Cao Ốc Kim Long,Khu Nhac Chill Của Choncc', 'ULTRA RAPID FIRE', NULL, 'available', '2026-05-25 21:29:37', '2026-05-25 21:29:37');
INSERT INTO `products` VALUES (467, 2, '557', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719379/bomrautft/products/557.webp', 1099000, 1373750, 20, 0, 0, 'Garen Sư Vương,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Công Lý Demecia Sư Vương,Khúc Cao Trào Cổ Cầm', NULL, 'available', '2026-05-25 21:29:39', '2026-05-25 21:29:39');
INSERT INTO `products` VALUES (468, 2, '509', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719381/bomrautft/products/509.webp', 1199000, 1498750, 20, 0, 0, 'Yasuo Ma Kiếm', 'Tiệm Cà Phê Paris', 'Máy Chém Noxus Lang Vương', NULL, 'available', '2026-05-25 21:29:41', '2026-05-25 21:29:41');
INSERT INTO `products` VALUES (469, 2, '527', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719382/bomrautft/products/527.webp', 1199000, 1498750, 20, 0, 0, 'Akali K/DA ALL OUT,Bồng Lai Tiên Cảnh', 'Bồng Lai Tiên Cảnh', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:29:43', '2026-05-25 21:29:43');
INSERT INTO `products` VALUES (470, 2, '549', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719384/bomrautft/products/549.webp', 1199000, 1498750, 20, 0, 0, 'Ahri K/DA,Tristana Pháo Thủ Pengu,Heartsteel Sett', NULL, 'Máy Chém Noxus Lang Vương,Đại Băng Tiễn Bao Bồi,Công Lý Demecia Sư Vương,Đại Bác Đẩy Lùi Pháo Thủ', NULL, 'available', '2026-05-25 21:29:45', '2026-05-25 21:29:45');
INSERT INTO `products` VALUES (471, 2, '603', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719386/bomrautft/products/603.webp', 1199000, 1498750, 20, 0, 0, 'Ezreal Học Viện Chiến Binh,Bồng Lai Tiên Cảnh', 'Bồng Lai Tiên Cảnh', 'Xoẹt Xoẹt Hồng Pha Lê', NULL, 'available', '2026-05-25 21:29:47', '2026-05-25 21:29:47');
INSERT INTO `products` VALUES (472, 2, '621', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719388/bomrautft/products/621.webp', 1199000, 1498750, 20, 0, 0, 'Irelia Thần Thoại', 'Mã Đáo Thành Công', NULL, NULL, 'available', '2026-05-25 21:29:48', '2026-05-25 21:29:48');
INSERT INTO `products` VALUES (473, 2, '#067', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719390/bomrautft/products/067.webp', 1299000, 1623750, 20, 0, 0, 'Tristana Pháo Thủ Pengu', 'Bồng Lai Tiên Cảnh', 'Máy Chem Noxus Lang Vương', NULL, 'available', '2026-05-25 21:29:50', '2026-05-25 21:29:50');
INSERT INTO `products` VALUES (474, 2, '#182', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719391/bomrautft/products/182.webp', 1299000, 1623750, 20, 0, 0, 'Yone T1', 'EveryThing Goes On', 'Mũi Tên Bạc,Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:29:52', '2026-05-25 21:29:52');
INSERT INTO `products` VALUES (475, 2, '#309', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719393/bomrautft/products/309.webp', 1299000, 1623750, 20, 0, 0, 'Aatrox DRX', 'Khu Nhac Chill của Choncc', NULL, NULL, 'available', '2026-05-25 21:29:53', '2026-05-25 21:29:53');
INSERT INTO `products` VALUES (476, 2, '462', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719394/bomrautft/products/462.webp', 1299000, 1623750, 20, 0, 0, 'Tristana Pháo Thủ Pengu,Cao Ốc Kim Long,Caitlyn Giả Lập Tí Nị', 'Cao Ốc Kim Long', 'Đại Bác Đẩy Lùi', NULL, 'available', '2026-05-25 21:29:55', '2026-05-25 21:29:55');
INSERT INTO `products` VALUES (477, 2, '573', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719396/bomrautft/products/573.webp', 1299000, 1623750, 20, 0, 0, 'Irelia Sứ Thanh Hoa,Blitz Mãi Bên Crank Bạn Nhé', 'Hội Chợ Nhâm Dần', 'Cung Ánh Sáng Học Viên Chiến Binh,Bàn Tay Hỏa Tiễn,Cầu Vòng Tối Thượng Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:29:57', '2026-05-25 21:29:57');
INSERT INTO `products` VALUES (478, 2, '356', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719398/bomrautft/products/356.webp', 1399000, 1748750, 20, 0, 0, 'Ezreal Học Viện Chiến Binh,Yone T1', NULL, 'Cung Ánh Sáng Học Viên Chiến Binh,T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:29:58', '2026-05-25 21:29:58');
INSERT INTO `products` VALUES (479, 2, '508', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719400/bomrautft/products/508.webp', 1399000, 1748750, 20, 0, 0, 'Riven Thần Kiếm,Yasuo Ma Kiếm', 'Hội Chợ Nhăm Dần', 'Ma Xứ Trăng Trối', NULL, 'available', '2026-05-25 21:30:00', '2026-05-25 21:30:00');
INSERT INTO `products` VALUES (480, 2, '511', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719402/bomrautft/products/511.webp', 1399000, 1748750, 20, 0, 0, 'Akali K/DA ALL OUT,Sona Cổ Cầm', 'Tiệm Cà Phê Paris', 'Lệnh T1 : Sóng Âm,Khúc Cao Trào Cổ Cầm,Mưa Đạn Thỏ Chỉ Huy,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:30:02', '2026-05-25 21:30:02');
INSERT INTO `products` VALUES (481, 2, '556', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719403/bomrautft/products/556.webp', 1399000, 1748750, 20, 0, 0, 'Morgana Ác Nữ Khắc Tinh Tí Nị', NULL, NULL, NULL, 'available', '2026-05-25 21:30:04', '2026-05-25 21:30:04');
INSERT INTO `products` VALUES (482, 2, '594', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719405/bomrautft/products/594.webp', 1399000, 1748750, 20, 0, 0, 'Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:30:05', '2026-05-25 21:30:05');
INSERT INTO `products` VALUES (483, 2, '598', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719407/bomrautft/products/598.webp', 1399000, 1748750, 20, 0, 0, 'Zed Tử Thần Không Gian,Heartsteel Sett', 'Khu Nghỉ Dưỡng của Choncc', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp', NULL, 'available', '2026-05-25 21:30:07', '2026-05-25 21:30:07');
INSERT INTO `products` VALUES (484, 2, '634', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719409/bomrautft/products/634.webp', 1399000, 1748750, 20, 0, 0, 'Yone Tà Ánh Song Kiếm', 'Giấc Mơ Demacia', NULL, NULL, 'available', '2026-05-25 21:30:09', '2026-05-25 21:30:09');
INSERT INTO `products` VALUES (485, 2, '#004', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719410/bomrautft/products/004.webp', 1499000, 1873750, 20, 0, 0, 'Ezreal Sứ Thanh Hoa', 'Móng vuốt mùa đông', 'Mặc định', NULL, 'available', '2026-05-25 21:30:11', '2026-05-25 21:30:11');
INSERT INTO `products` VALUES (486, 2, '#88', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719412/bomrautft/products/88.webp', 1499000, 1873750, 20, 0, 0, 'Ezreal Sứ Thanh Hoa', NULL, NULL, NULL, 'available', '2026-05-25 21:30:12', '2026-05-25 21:30:12');
INSERT INTO `products` VALUES (487, 2, '#138', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719414/bomrautft/products/138.webp', 1499000, 1873750, 20, 0, 0, 'Arcane Annie Fan Cứng', 'Cầu Tiến Bộ, Vườn Độc Dược, K.O Đại Chiến, Malphite Hộ Pháp Không Gian', 'T1 Tử Thần Đáy Sâu, Ngọn Thương Ánh Sáng Vệ Binh Tinh Tú', NULL, 'available', '2026-05-25 21:30:14', '2026-05-25 21:30:14');
INSERT INTO `products` VALUES (488, 2, '#LeeTuyetVoThanVip3', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719415/bomrautft/products/leetuyetvothanvip3.webp', 1499000, 1873750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:30:15', '2026-05-25 21:30:15');
INSERT INTO `products` VALUES (489, 2, '#283', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719417/bomrautft/products/283.webp', 1499000, 1873750, 20, 0, 0, 'Morgana Tiên Hắc Ám,Warwick Arcane', 'Bình Nguyên Volrachnum', 'Ma Xứ Trăng Trối ,Khúc Cao Trào Cổ Cầm', NULL, 'available', '2026-05-25 21:30:17', '2026-05-25 21:30:17');
INSERT INTO `products` VALUES (490, 2, '419', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719418/bomrautft/products/419.webp', 1499000, 1873750, 20, 0, 0, 'Arcane Annie Fan Cứng', 'Hộp Đêm Tân Sửu', 'Cung Ánh Sáng Học Viên Chiến Binh,Lệnh T1 : Sóng Âm,Khắc Tên Vào Lịch Sử', NULL, 'available', '2026-05-25 21:30:19', '2026-05-25 21:30:19');
INSERT INTO `products` VALUES (491, 2, '601', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719420/bomrautft/products/601.webp', 1499000, 1873750, 20, 0, 0, 'Yasuo Long Kiếm,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Ma Xứ Trăng Trối', NULL, 'available', '2026-05-25 21:30:21', '2026-05-25 21:30:21');
INSERT INTO `products` VALUES (492, 2, '646', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719422/bomrautft/products/646.webp', 1499000, 1873750, 20, 0, 0, 'Yone T1,Everything Goes On', 'Tháp Cảnh Mộng Của Gwen,Everything Goes On', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:30:22', '2026-05-25 21:30:22');
INSERT INTO `products` VALUES (493, 2, '653', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719424/bomrautft/products/653.webp', 1499000, 1873750, 20, 0, 0, 'Gwen Hồng Pha Lê', 'Tháp Cảnh Mộng Của Gwen', 'Xoẹt Xoẹt Hồng Pha Lê', NULL, 'available', '2026-05-25 21:30:24', '2026-05-25 21:30:24');
INSERT INTO `products` VALUES (494, 2, '663', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719425/bomrautft/products/663.webp', 1499000, 1873750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', NULL, 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:30:26', '2026-05-25 21:30:26');
INSERT INTO `products` VALUES (495, 2, '457', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719427/bomrautft/products/457.webp', 1699000, 2123750, 20, 0, 0, 'Gwen Tử Chỉ Dương Khí,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Xe Chỉ Luồn Kim', NULL, 'available', '2026-05-25 21:30:27', '2026-05-25 21:30:27');
INSERT INTO `products` VALUES (496, 2, '512', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719429/bomrautft/products/512.webp', 1699000, 2123750, 20, 0, 0, 'Aatrox DRX,Vayne Siêu Phẩm,Yasuo Long Kiếm,Heartsteel Sett', NULL, 'Mũi Tên Bạc', NULL, 'available', '2026-05-25 21:30:29', '2026-05-25 21:30:29');
INSERT INTO `products` VALUES (497, 2, '567', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719431/bomrautft/products/567.webp', 1699000, 2123750, 20, 0, 0, 'Riven Ngạo Kiếm', 'Đỉnh Cực Quang', 'Bách Phát Bách Trúng', NULL, 'available', '2026-05-25 21:30:31', '2026-05-25 21:30:31');
INSERT INTO `products` VALUES (498, 2, '365', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719433/bomrautft/products/365.webp', 1799000, 2248750, 20, 0, 0, 'Yone T1,Zoe Thần Thoại,Kayle Thiên Sứ Công Nghệ', NULL, 'chưởng cung ánh sáng hv , Siêu phẩm : mũi tên bạc ,t1 đoạt mệnh , đại bác đẩy lùi luyện rồng', NULL, 'available', '2026-05-25 21:30:33', '2026-05-25 21:30:33');
INSERT INTO `products` VALUES (499, 2, '569', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719434/bomrautft/products/569.webp', 1799000, 2248750, 20, 0, 0, 'Riven Ngạo Kiếm', 'Sàn Đấu Thiên Thượng', 'Đại Bác Đẩy Lùi', NULL, 'available', '2026-05-25 21:30:34', '2026-05-25 21:30:34');
INSERT INTO `products` VALUES (500, 2, '647', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719436/bomrautft/products/647.webp', 1799000, 2248750, 20, 0, 0, 'Aatrox DRX,Miss Fortune Thỏ Chỉ Huy,Yone T1', 'U Mộng Hoa Cảnh', 'Mưa Đạn Thỏ Chỉ Huy', NULL, 'available', '2026-05-25 21:30:36', '2026-05-25 21:30:36');
INSERT INTO `products` VALUES (501, 2, '655', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719437/bomrautft/products/655.webp', 1799000, 2248750, 20, 0, 0, 'Irelia Sứ Thanh Hoa,Lee Sin Tuyệt Vô Thần', 'Phòng Trà Yên Bình', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:30:38', '2026-05-25 21:30:38');
INSERT INTO `products` VALUES (502, 2, '656', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719439/bomrautft/products/656.webp', 1799000, 2248750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Zed Tử Thần Không Gian', 'Khu Nhac Chill Của Choncc', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:30:39', '2026-05-25 21:30:39');
INSERT INTO `products` VALUES (503, 2, '#048', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719441/bomrautft/products/048.webp', 1899000, 2373750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Nhà bí mật của Prancie', 'mặc định', NULL, 'available', '2026-05-25 21:30:41', '2026-05-25 21:30:41');
INSERT INTO `products` VALUES (504, 2, '#033', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719442/bomrautft/products/033.webp', 1999000, 2498750, 20, 0, 0, 'Arcane Annie Fan Cứng', 'Đại chiến anh hùng', 'mặc định', NULL, 'available', '2026-05-25 21:30:43', '2026-05-25 21:30:43');
INSERT INTO `products` VALUES (505, 2, '#042', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719444/bomrautft/products/042.webp', 1999000, 2498750, 20, 0, 0, 'Akali K/DA ALL OUT,Miss Fortune Thỏ Chỉ Huy', '3 sàn tím', '3 chưởng lực tím', NULL, 'available', '2026-05-25 21:30:44', '2026-05-25 21:30:44');
INSERT INTO `products` VALUES (506, 2, '#133', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719446/bomrautft/products/133.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Mặc Định', 'Mặc Định', NULL, 'available', '2026-05-25 21:30:46', '2026-05-25 21:30:46');
INSERT INTO `products` VALUES (507, 2, '#137', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719447/bomrautft/products/137.webp', 1999000, 1999000, 0, 0, 0, 'Arcane Annie Fan Cứng,Jinx arcane,Jinx Vệ Binh Tinh Tú', 'Kho hàng dui dẻ của Jinx, Vườn độc dược, Trường luyện rồng, Sân đấu siêu tân tinh, Tang thư ma pháp', 'Arcane Tên lửa đạn đạo siêu khủng khiếp, Ánh lửa lưỡng giới đồng quy', NULL, 'available', '2026-05-25 21:30:48', '2026-05-25 21:30:48');
INSERT INTO `products` VALUES (508, 2, '#166', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719449/bomrautft/products/166.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Khu hầm trú ánh lửa', 'None', NULL, 'available', '2026-05-25 21:30:50', '2026-05-25 21:30:50');
INSERT INTO `products` VALUES (509, 2, '#212', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719451/bomrautft/products/212.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', NULL, NULL, NULL, 'available', '2026-05-25 21:30:52', '2026-05-25 21:30:52');
INSERT INTO `products` VALUES (510, 2, '#237', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719453/bomrautft/products/237.webp', 1999000, 2498750, 20, 0, 0, 'Kayle Tí Nị,Sett Tí Nị,Quán Lê Bunny Bonbon,Cao Ốc Kim Long', 'Cao Ốc Kim Long,Quán Le Bunny BonBon', 'Tiệm Trà Ngọt Ngào Xoẹt Xoẹt,Khúc Cao Trào Cổ Cầm,Đại Bác Đẩy Lùi', 'Cổng Gwen Duyên Dáng', 'available', '2026-05-25 21:30:53', '2026-05-25 21:30:53');
INSERT INTO `products` VALUES (511, 2, '#289', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719455/bomrautft/products/289.webp', 1999000, 2498750, 20, 0, 0, 'Lee Sin Long Cước,Yasuo Ma Kiếm', 'Huyết Nguyệt Dạ Hành', 'Tiểu Long Nộ', NULL, 'available', '2026-05-25 21:30:55', '2026-05-25 21:30:55');
INSERT INTO `products` VALUES (512, 2, '#313', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719457/bomrautft/products/313.webp', 1999000, 3075385, 35, 0, 0, 'Miss Fortune Huyết Nguyệt', NULL, 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:30:57', '2026-05-25 21:30:57');
INSERT INTO `products` VALUES (513, 2, '459', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719459/bomrautft/products/459.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', NULL, 'Sân Khấu Tử Thần', NULL, 'available', '2026-05-25 21:30:59', '2026-05-25 21:30:59');
INSERT INTO `products` VALUES (514, 2, '525', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719460/bomrautft/products/525.webp', 1999000, 2498750, 20, 0, 0, 'Janna Dự Báo Thời TIết,Sett Song Hồn Hoang Thú,Heartsteel Sett', 'Linh Xà Thần Vực', 'Công Lý Demecia Sư Vương', NULL, 'available', '2026-05-25 21:31:01', '2026-05-25 21:31:01');
INSERT INTO `products` VALUES (515, 2, '537', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719462/bomrautft/products/537.webp', 1999000, 2498750, 20, 0, 0, 'Janna Dự Báo Thời TIết,Lillia Mộng Tưởng Tiên Nữ,Caitlyn Giả Lập Tí Nị', 'Ngôi Nhà Thỏ Vàng', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:31:02', '2026-05-25 21:31:02');
INSERT INTO `products` VALUES (516, 2, '585', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719464/bomrautft/products/585.webp', 1999000, 2498750, 20, 0, 0, 'Aatrox Huyết Nguyệt,Morgana Ác Nữ Khắc Tinh Tí Nị', NULL, 'Cung Ánh Sáng Học Viên Chiến Binh,Máy Chém Noxus Lang Vương', NULL, 'available', '2026-05-25 21:31:04', '2026-05-25 21:31:04');
INSERT INTO `products` VALUES (517, 2, '650', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719465/bomrautft/products/650.webp', 1999000, 2498750, 20, 0, 0, 'Arcane Annie Fan Cứng,Cao Ốc Kim Long', 'Cao Ốc Kim Long,Sân Chơi Yuumi', NULL, NULL, 'available', '2026-05-25 21:31:06', '2026-05-25 21:31:06');
INSERT INTO `products` VALUES (518, 2, '666', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719467/bomrautft/products/666.webp', 1999000, 2498750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Yone T1,Jinx Vệ Binh Tinh Tú,Mordekaiser Hắc Tinh', 'Hội Chợ Nhăm Dần', 'Địa Chấn Tuyệt Vô Thần,T1 Đoạt Mệnh,ULTRA RAPID FIRE', NULL, 'available', '2026-05-25 21:31:08', '2026-05-25 21:31:08');
INSERT INTO `products` VALUES (519, 2, '#127', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719469/bomrautft/products/127.webp', 2399000, 2998750, 20, 0, 0, 'Akali Vệ Binh Tinh Tú,Darius Lang Vương,Riven Thần Kiếm,Yasuo Ma Kiếm', 'Chiến Binh', 'Máy Chém Noxus Lang Vương', NULL, 'available', '2026-05-25 21:31:09', '2026-05-25 21:31:09');
INSERT INTO `products` VALUES (520, 2, '#132', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719471/bomrautft/products/132.webp', 2399000, 2998750, 20, 0, 0, 'Jhin Vũ Trụ Hắc Ám,Riven Ngạo Kiếm', 'Vườn Độc Dược, Thủ Vệ Băng Giá', 'Cuồng Thú Quyền, Sân Khấu Tử Thần Của Jhin', NULL, 'available', '2026-05-25 21:31:11', '2026-05-25 21:31:11');
INSERT INTO `products` VALUES (521, 2, '432', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719472/bomrautft/products/432.webp', 2399000, 2998750, 20, 0, 0, 'Gwen Hồng Pha Lê,Jinx arcane,Yasuo Ma Kiếm,Malphite Máy Móc,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Tên Lửa Đạn Đạo ,Hoa Linh Lục Địa,Xoẹt Xoẹt Hồng Pha Lê', NULL, 'available', '2026-05-25 21:31:12', '2026-05-25 21:31:12');
INSERT INTO `products` VALUES (522, 2, '563', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719474/bomrautft/products/563.webp', 2399000, 2998750, 20, 0, 0, 'Yone Thần Kiếm', NULL, 'Cung Ánh Sáng Học Viên Chiến Binh,Hoa Linh Đoạt Mệnh, Mũi Tên Thơ Thẩn Phù Thủy,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:31:14', '2026-05-25 21:31:14');
INSERT INTO `products` VALUES (523, 2, '#91', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719476/bomrautft/products/91.webp', 2499000, 3123750, 20, 0, 0, 'Jinx arcane,Yuumi Phù Thủy,Pengu Cosplay Yasuo', 'Đấu Trường Hextech', 'Máy Chém Lang Vương', NULL, 'available', '2026-05-25 21:31:17', '2026-05-25 21:31:17');
INSERT INTO `products` VALUES (524, 2, '392', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719478/bomrautft/products/392.webp', 2499000, 3123750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Ban Công Giao Thừa', 'Xoẹt Xoẹt Hồng Pha Lê', 'Rất Nhiều Skin Lol', 'available', '2026-05-25 21:31:19', '2026-05-25 21:31:19');
INSERT INTO `products` VALUES (525, 2, '468', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719480/bomrautft/products/468.webp', 2499000, 3123750, 20, 0, 0, 'Ezreal Sứ Thanh Hoa', 'U Mộng Hoa Cảnh,Ma Sứ vs Thần Sứ', 'Sân Khấu Tử Thần', NULL, 'available', '2026-05-25 21:31:21', '2026-05-25 21:31:21');
INSERT INTO `products` VALUES (526, 2, '#078', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719482/bomrautft/products/078.webp', 2699000, 3373750, 20, 0, 0, 'Gwen Hồng Pha Lê,Katarina Học Viện Chiến Binh,Cao Ốc Kim Long', 'Tháp cảnh mộng của Gwen,Cao Ốc Kim Long', 'Xoẹt Xoẹt Hồng Pha Lê,Mũi tên bạc', NULL, 'available', '2026-05-25 21:31:23', '2026-05-25 21:31:23');
INSERT INTO `products` VALUES (527, 2, '648', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719484/bomrautft/products/648.webp', 2699000, 3373750, 20, 0, 0, 'Gwen Hồng Pha Lê,Lulu Vệ Binh Tinh Tú,Yone T1', 'Tháp Cảnh Mộng Của Gwen,Phòng Trà Yên Bình', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:31:25', '2026-05-25 21:31:25');
INSERT INTO `products` VALUES (528, 2, '401', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719486/bomrautft/products/401.webp', 2899000, 3623750, 20, 0, 0, 'Jinx arcane,Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao Ốc Kim Long,Ngôi Nhà Thỏ Vàng', 'Công Lý Demecia Sư Vương', '191 Skin Lol', 'available', '2026-05-25 21:31:26', '2026-05-25 21:31:26');
INSERT INTO `products` VALUES (529, 2, '431', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719488/bomrautft/products/431.webp', 2899000, 3623750, 20, 0, 0, 'Aatrox Huyết Nguyệt,Gwen Tiệm Trà Ngọt Ngào,Pyke T1', 'Sân Đấu Siêu Tân Binh', NULL, NULL, 'available', '2026-05-25 21:31:28', '2026-05-25 21:31:28');
INSERT INTO `products` VALUES (530, 2, '451', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719490/bomrautft/products/451.webp', 2899000, 3623750, 20, 0, 0, 'Ahri Chiêu Hồn Thiên Hồ,Sett Song Hồn Hoang Thú,Thresh Cao Bồi,Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T1 Đoạt Mệnh,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:31:30', '2026-05-25 21:31:30');
INSERT INTO `products` VALUES (531, 3, '641', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718293/bomrautft/products/641.webp', 799000, 998750, 20, 0, 0, 'Sett Song Hồn Hoang Thú', 'Tinh Tú Hắc Ám', NULL, NULL, 'available', '2026-05-25 21:31:39', '2026-05-25 21:31:39');
INSERT INTO `products` VALUES (532, 3, '652', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718298/bomrautft/products/652.webp', 799000, 998750, 20, 0, 0, 'Irelia Sứ Thanh Hoa,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:31:40', '2026-05-25 21:31:40');
INSERT INTO `products` VALUES (533, 3, '659', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718302/bomrautft/products/659.webp', 799000, 998750, 20, 0, 0, 'Ashe Nữ Hoàng Vũ Trụ', 'Tinh Tú Hắc Ám', NULL, NULL, 'available', '2026-05-25 21:31:41', '2026-05-25 21:31:41');
INSERT INTO `products` VALUES (534, 3, '662', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718306/bomrautft/products/662.webp', 799000, 998750, 20, 0, 0, 'Aatrox Huyết Nguyệt,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:31:43', '2026-05-25 21:31:43');
INSERT INTO `products` VALUES (535, 3, '668', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718310/bomrautft/products/668.webp', 799000, 998750, 20, 0, 0, 'Sett Song Hồn Hoang Thú', 'Huyết Nguyệt Dạ Hành', NULL, NULL, 'available', '2026-05-25 21:31:44', '2026-05-25 21:31:44');
INSERT INTO `products` VALUES (536, 3, '571', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718314/bomrautft/products/571.webp', 949000, 1186250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', 'Khu Nhac Chill Của Choncc', NULL, NULL, 'available', '2026-05-25 21:31:45', '2026-05-25 21:31:45');
INSERT INTO `products` VALUES (537, 3, '#100', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718318/bomrautft/products/100.webp', 999000, 1665000, 40, 0, 0, 'Katarina Học Viện Chiến Binh,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Thần Linh Định Đoạt', NULL, 'available', '2026-05-25 21:31:46', '2026-05-25 21:31:46');
INSERT INTO `products` VALUES (538, 3, '#252', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718322/bomrautft/products/252.webp', 999000, 1665000, 40, 0, 0, 'Arcane Vi Tí Nị,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:31:47', '2026-05-25 21:31:47');
INSERT INTO `products` VALUES (539, 3, '504', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718326/bomrautft/products/504.webp', 999000, 1248750, 20, 0, 0, 'Riven Thần Kiếm,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:31:48', '2026-05-25 21:31:48');
INSERT INTO `products` VALUES (540, 3, '626', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718330/bomrautft/products/626.webp', 999000, 1248750, 20, 0, 0, 'Irelia Thần Thoại', 'Tinh Tú Hắc Ám', NULL, NULL, 'available', '2026-05-25 21:31:50', '2026-05-25 21:31:50');
INSERT INTO `products` VALUES (541, 3, '#97', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718334/bomrautft/products/97.webp', 1099000, 1831667, 40, 0, 0, 'Arcance Caitlyn,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:31:51', '2026-05-25 21:31:51');
INSERT INTO `products` VALUES (542, 3, '#98', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719513/bomrautft/products/98.webp', 1199000, 1998333, 40, 0, 0, 'Riven Thần Kiếm,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:31:53', '2026-05-25 21:31:53');
INSERT INTO `products` VALUES (543, 3, '#306', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719515/bomrautft/products/306.webp', 1299000, 2165000, 40, 0, 0, 'Gwen Tử Chỉ Dương Khí', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:31:55', '2026-05-25 21:31:55');
INSERT INTO `products` VALUES (544, 3, '#311', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719517/bomrautft/products/311.webp', 1299000, 2165000, 40, 0, 0, 'Yone T1', 'Khu Nhac Chill của Choncc', NULL, NULL, 'available', '2026-05-25 21:31:57', '2026-05-25 21:31:57');
INSERT INTO `products` VALUES (545, 3, '458', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719518/bomrautft/products/458.webp', 1499000, 1873750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:31:59', '2026-05-25 21:31:59');
INSERT INTO `products` VALUES (546, 3, '#274', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719520/bomrautft/products/274.webp', 1599000, 2665000, 40, 0, 0, 'Miss Fortune Thỏ Chỉ Huy,Quán Lê Bunny Bonbon', 'Quán Lê Bunny Bonbon', NULL, NULL, 'available', '2026-05-25 21:32:00', '2026-05-25 21:32:00');
INSERT INTO `products` VALUES (547, 3, '449', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719522/bomrautft/products/449.webp', 2399000, 2998750, 20, 0, 0, 'Janna Dự Báo Thời TIết,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 'Khu Nhac Chill Của Choncc', 'Hắc Ám Soi Rọi', NULL, 'available', '2026-05-25 21:32:02', '2026-05-25 21:32:02');
INSERT INTO `products` VALUES (548, 3, '376', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719523/bomrautft/products/376.webp', 2599000, 3248750, 20, 0, 0, 'Riven Ngạo Kiếm', 'Khu Nhac Chill Của Choncc', NULL, NULL, 'available', '2026-05-25 21:32:04', '2026-05-25 21:32:04');
INSERT INTO `products` VALUES (549, 4, 'sorakachuoi', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718236/bomrautft/products/sorakachuoi.webp', 189000, 236250, 20, 0, 0, 'Soraka Chuối Tí Nị', NULL, NULL, NULL, 'available', '2026-05-25 21:32:12', '2026-05-25 21:32:12');
INSERT INTO `products` VALUES (550, 4, 'ashenuhoangvutru', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718241/bomrautft/products/ashenuhoangvutru.webp', 189000, 236250, 20, 0, 0, 'Ashe Nữ Hoàng Vũ Trụ', NULL, NULL, NULL, 'available', '2026-05-25 21:32:13', '2026-05-25 21:32:13');
INSERT INTO `products` VALUES (551, 4, 'briarhuyetnguyet', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718245/bomrautft/products/briarhuyetnguyet.webp', 189000, 236250, 20, 0, 0, 'Briar Huyết Nguyệt Tí Nị', NULL, NULL, NULL, 'available', '2026-05-25 21:32:14', '2026-05-25 21:32:14');
INSERT INTO `products` VALUES (552, 4, 'Luciancaoboi', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718249/bomrautft/products/luciancaoboi.webp', 189000, 236250, 20, 0, 0, 'Lucian Cao Bồi Đột Phá', NULL, NULL, NULL, 'available', '2026-05-25 21:32:15', '2026-05-25 21:32:15');
INSERT INTO `products` VALUES (553, 4, 'luciancaoboivip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718266/bomrautft/products/luciancaoboivip1.webp', 389000, 486250, 20, 0, 0, 'Lucian Cao Bồi Đột Phá', 'Quán Rượu Viễn Tây', 'Thanh Trừng Cao Bồi', NULL, 'available', '2026-05-25 21:32:16', '2026-05-25 21:32:16');
INSERT INTO `products` VALUES (554, 4, 'sorakachuoitinivip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718620/bomrautft/products/sorakachuoitinivip1.webp', 549000, 686250, 20, 0, 0, 'Soraka Chuối Tí Nị', NULL, 'Chuối Vẫn Tinh', NULL, 'available', '2026-05-25 21:32:18', '2026-05-25 21:32:18');
INSERT INTO `products` VALUES (555, 4, 'ashenuhoangvutruvip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718621/bomrautft/products/ashenuhoangvutruvip1.webp', 549000, 686250, 20, 0, 0, 'Ashe Nữ Hoàng Vũ Trụ', NULL, NULL, NULL, 'available', '2026-05-25 21:32:19', '2026-05-25 21:32:19');
INSERT INTO `products` VALUES (556, 4, '659', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718302/bomrautft/products/659.webp', 799000, 998750, 20, 0, 0, 'Ashe Nữ Hoàng Vũ Trụ', 'Tinh Tú Hắc Ám', NULL, NULL, 'available', '2026-05-25 21:32:20', '2026-05-25 21:32:20');
INSERT INTO `products` VALUES (557, 5, '#irelia', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718254/bomrautft/products/irelia.jpg', 289000, 361250, 20, 0, 0, 'Irelia Thần Thoại', NULL, NULL, NULL, 'available', '2026-05-25 21:39:01', '2026-05-25 21:39:01');
INSERT INTO `products` VALUES (569, 5, '479', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719275/bomrautft/products/479.webp', 9999000, 12498750, 20, 0, 0, 'Ezreal Học Viện Chiến Binh,Gwen Tử Chỉ Dương Khí,Irelia Thần Thoại,Orianna Trán Hoa Linh Ngọc,Yone T1,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu,Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Quả Cầu Ma Thuật Hoa Linh', NULL, 'available', '2026-05-25 21:39:18', '2026-05-25 21:39:18');
INSERT INTO `products` VALUES (578, 5, '602', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719370/bomrautft/products/602.webp', 999000, 1248750, 20, 0, 0, 'Irelia Thần Thoại,Cao Ốc Kim Long', 'Cao Ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:39:31', '2026-05-25 21:39:31');
INSERT INTO `products` VALUES (580, 5, '621', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719388/bomrautft/products/621.webp', 1199000, 1498750, 20, 0, 0, 'Irelia Thần Thoại', 'Mã Đáo Thành Công', NULL, NULL, 'available', '2026-05-25 21:39:34', '2026-05-25 21:39:34');
INSERT INTO `products` VALUES (581, 5, '626', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718330/bomrautft/products/626.webp', 999000, 1248750, 20, 0, 0, 'Irelia Thần Thoại', 'Tinh Tú Hắc Ám', NULL, NULL, 'available', '2026-05-25 21:39:35', '2026-05-25 21:39:35');
INSERT INTO `products` VALUES (584, 6, '#132', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719471/bomrautft/products/132.webp', 2399000, 2998750, 20, 0, 0, 'Jhin Vũ Trụ Hắc Ám,Riven Ngạo Kiếm', 'Vườn Độc Dược, Thủ Vệ Băng Giá', 'Cuồng Thú Quyền, Sân Khấu Tử Thần Của Jhin', NULL, 'available', '2026-05-25 21:39:39', '2026-05-25 21:39:39');
INSERT INTO `products` VALUES (589, 6, '376', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719523/bomrautft/products/376.webp', 2599000, 3248750, 20, 0, 0, 'Riven Ngạo Kiếm', 'Khu Nhac Chill Của Choncc', NULL, NULL, 'available', '2026-05-25 21:39:44', '2026-05-25 21:39:44');
INSERT INTO `products` VALUES (590, 6, '567', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719431/bomrautft/products/567.webp', 1699000, 2123750, 20, 0, 0, 'Riven Ngạo Kiếm', 'Đỉnh Cực Quang', 'Bách Phát Bách Trúng', NULL, 'available', '2026-05-25 21:39:45', '2026-05-25 21:39:45');
INSERT INTO `products` VALUES (591, 6, '569', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719434/bomrautft/products/569.webp', 1799000, 2248750, 20, 0, 0, 'Riven Ngạo Kiếm', 'Sàn Đấu Thiên Thượng', 'Đại Bác Đẩy Lùi', NULL, 'available', '2026-05-25 21:39:47', '2026-05-25 21:39:47');
INSERT INTO `products` VALUES (593, 7, '#LeeTuyetVoThan', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718258/bomrautft/products/leetuyetvothan.webp', 289000, 361250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', 'Mặc định', 'Mặc định', NULL, 'available', '2026-05-25 21:39:50', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (594, 7, '#LeeTuyetVoThanVip1', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718639/bomrautft/products/leetuyetvothanvip1.webp', 689000, 861250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', 'Nhà Bí Mật Của Prancie', 'Địa Chấn Tuyệt Vô Thần,Nện Cái Nè', NULL, 'available', '2026-05-25 21:39:51', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (595, 7, '#LeeTuyetVoThanVip3', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719415/bomrautft/products/leetuyetvothanvip3.webp', 1499000, 1873750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:39:53', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (597, 7, '#LeeTuyetVoThanVip2', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719342/bomrautft/products/leetuyetvothanvip2.webp', 999000, 1248750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao ốc Kim Long', NULL, NULL, 'available', '2026-05-25 21:39:54', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (619, 7, '401', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719486/bomrautft/products/401.webp', 2899000, 3623750, 20, 0, 0, 'Jinx arcane,Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao Ốc Kim Long,Ngôi Nhà Thỏ Vàng', 'Công Lý Demecia Sư Vương', '191 Skin Lol', 'available', '2026-05-25 21:40:13', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (625, 7, '458', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719518/bomrautft/products/458.webp', 1499000, 1873750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:40:21', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (638, 7, '571', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718314/bomrautft/products/571.webp', 949000, 1186250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', 'Khu Nhac Chill Của Choncc', NULL, NULL, 'available', '2026-05-25 21:40:38', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (644, 7, '606', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718270/bomrautft/products/606.webp', 449000, 561250, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', NULL, NULL, NULL, 'available', '2026-05-25 21:40:46', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (645, 7, '615', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719270/bomrautft/products/615.webp', 4799000, 5998750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Yasuo Long Kiếm,Teemo Tiểu Quỷ,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Ma Xứ Trăng Trối,Khúc Cao Trào Cổ Cầm,Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:40:47', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (650, 7, '655', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719437/bomrautft/products/655.webp', 1799000, 2248750, 20, 0, 0, 'Irelia Sứ Thanh Hoa,Lee Sin Tuyệt Vô Thần', 'Phòng Trà Yên Bình', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:40:55', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (651, 7, '663', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719425/bomrautft/products/663.webp', 1499000, 1873750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần', NULL, 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:40:56', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (652, 7, '666', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719467/bomrautft/products/666.webp', 1999000, 2498750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Yone T1,Jinx Vệ Binh Tinh Tú,Mordekaiser Hắc Tinh', 'Hội Chợ Nhăm Dần', 'Địa Chấn Tuyệt Vô Thần,T1 Đoạt Mệnh,ULTRA RAPID FIRE', NULL, 'available', '2026-05-25 21:40:57', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (653, 7, '656', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719439/bomrautft/products/656.webp', 1799000, 2248750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Zed Tử Thần Không Gian', 'Khu Nhac Chill Của Choncc', 'Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:40:58', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (675, 8, '451', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719490/bomrautft/products/451.webp', 2899000, 3623750, 20, 0, 0, 'Ahri Chiêu Hồn Thiên Hồ,Sett Song Hồn Hoang Thú,Thresh Cao Bồi,Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T1 Đoạt Mệnh,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:41:20', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (681, 8, '525', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719460/bomrautft/products/525.webp', 1999000, 2498750, 20, 0, 0, 'Janna Dự Báo Thời TIết,Sett Song Hồn Hoang Thú,Heartsteel Sett', 'Linh Xà Thần Vực', 'Công Lý Demecia Sư Vương', NULL, 'available', '2026-05-25 21:41:29', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (689, 8, '623', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719272/bomrautft/products/623.webp', 4899000, 6123750, 20, 0, 0, 'Lee Tiểu Long,Morgana Tiên Hắc Ám,Orianna Trán Hoa Linh Ngọc,Sett Song Hồn Hoang Thú,Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Tiểu Long Nộ', NULL, 'available', '2026-05-25 21:41:41', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (691, 8, '641', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718293/bomrautft/products/641.webp', 799000, 998750, 20, 0, 0, 'Sett Song Hồn Hoang Thú', 'Tinh Tú Hắc Ám', NULL, NULL, 'available', '2026-05-25 21:41:44', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (692, 8, '668', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718310/bomrautft/products/668.webp', 799000, 998750, 20, 0, 0, 'Sett Song Hồn Hoang Thú', 'Huyết Nguyệt Dạ Hành', NULL, NULL, 'available', '2026-05-25 21:41:46', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (693, 9, '#043', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719277/bomrautft/products/043.webp', 14499000, 24165000, 40, 0, 0, 'Aatrox Huyết Nguyệt,Ahri Chiêu Hồn Thiên Hồ,Ashe Long Tiễn,Gwen Tiệm Trà Ngọt Ngào,Irelia Sứ Thanh Hoa,Lulu Vệ Binh Tinh Tú,Miss Fortune Thỏ Chỉ Huy,Orianna T1,Sona Cổ Cầm', '4 sàn đấu tím', 'Tiệm trà ngọt ngào xoẹt xoẹt', NULL, 'available', '2026-05-25 21:41:47', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (694, 9, '#048', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719441/bomrautft/products/048.webp', 1899000, 2373750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Nhà bí mật của Prancie', 'mặc định', NULL, 'available', '2026-05-25 21:41:48', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (696, 9, '#133', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719446/bomrautft/products/133.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Mặc Định', 'Mặc Định', NULL, 'available', '2026-05-25 21:41:51', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (697, 9, '#166', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719449/bomrautft/products/166.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Khu hầm trú ánh lửa', 'None', NULL, 'available', '2026-05-25 21:41:52', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (698, 9, '#212', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719451/bomrautft/products/212.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', NULL, NULL, NULL, 'available', '2026-05-25 21:41:53', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (699, 9, '392', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719478/bomrautft/products/392.webp', 2499000, 3123750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Ban Công Giao Thừa', 'Xoẹt Xoẹt Hồng Pha Lê', 'Rất Nhiều Skin Lol', 'available', '2026-05-25 21:41:54', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (700, 9, '431', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719488/bomrautft/products/431.webp', 2899000, 3623750, 20, 0, 0, 'Aatrox Huyết Nguyệt,Gwen Tiệm Trà Ngọt Ngào,Pyke T1', 'Sân Đấu Siêu Tân Binh', NULL, NULL, 'available', '2026-05-25 21:41:56', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (701, 9, '448', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718204/bomrautft/products/448.webp', 3499000, 4373750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', 'Rìa Tòa Nhà Công Nghệ', 'Xoẹt Xoẹt Hồng Pha Lê, Bàn Tay Hỏa Tiễn,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:41:57', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (702, 9, '459', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719459/bomrautft/products/459.webp', 1999000, 2498750, 20, 0, 0, 'Gwen Tiệm Trà Ngọt Ngào', NULL, 'Sân Khấu Tử Thần', NULL, 'available', '2026-05-25 21:41:58', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (711, 10, '#078', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719482/bomrautft/products/078.webp', 2699000, 3373750, 20, 0, 0, 'Gwen Hồng Pha Lê,Katarina Học Viện Chiến Binh,Cao Ốc Kim Long', 'Tháp cảnh mộng của Gwen,Cao Ốc Kim Long', 'Xoẹt Xoẹt Hồng Pha Lê,Mũi tên bạc', NULL, 'available', '2026-05-25 21:42:05', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (734, 10, '#291', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719273/bomrautft/products/291.webp', 7499000, 9373750, 20, 0, 0, 'Akali K/DA ALL OUT,Gwen Hồng Pha Lê,Miss Fortune Huyết Nguyệt,Sena Cao Bồi,Yasuo Ma Kiếm,Yone T1,Yone Tà Ánh Song Kiếm,Morgana Khổng Tước Hoàng Hậu', 'EveryThing Goes On,U Mộng Hoa Cảnh,Phòng Trà Yên Bình,Ma Sứ Vs Thiên Sứ,Tháp Cảnh Mộng Của Gwen', 'Xoẹt Xoẹt Hồng Pha Lê , T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:42:20', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (748, 10, '432', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719472/bomrautft/products/432.webp', 2399000, 2998750, 20, 0, 0, 'Gwen Hồng Pha Lê,Jinx arcane,Yasuo Ma Kiếm,Malphite Máy Móc,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T��n Lửa Đạn Đạo ,Hoa Linh Lục Địa,Xoẹt Xoẹt Hồng Pha Lê', NULL, 'available', '2026-05-25 21:42:35', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (765, 10, '632', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718626/bomrautft/products/632.webp', 549000, 686250, 20, 0, 0, 'Gwen Hồng Pha Lê', NULL, 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú', NULL, 'available', '2026-05-25 21:42:58', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (766, 10, '648', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719484/bomrautft/products/648.webp', 2699000, 3373750, 20, 0, 0, 'Gwen Hồng Pha Lê,Lulu Vệ Binh Tinh Tú,Yone T1', 'Tháp Cảnh Mộng Của Gwen,Phòng Trà Yên Bình', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:42:59', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (767, 10, '653', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719424/bomrautft/products/653.webp', 1499000, 1873750, 20, 0, 0, 'Gwen Hồng Pha Lê', 'Tháp Cảnh Mộng Của Gwen', 'Xoẹt Xoẹt Hồng Pha Lê', NULL, 'available', '2026-05-25 21:43:00', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (799, 12, '#127', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719469/bomrautft/products/127.webp', 2399000, 2998750, 20, 0, 0, 'Akali Vệ Binh Tinh Tú,Darius Lang Vương,Riven Thần Kiếm,Yasuo Ma Kiếm', 'Chiến Binh', 'Máy Chém Noxus Lang Vương', NULL, 'available', '2026-05-25 21:43:36', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (823, 12, '#289', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719455/bomrautft/products/289.webp', 1999000, 2498750, 20, 0, 0, 'Lee Sin Long Cước,Yasuo Ma Kiếm', 'Huyết Nguyệt Dạ Hành', 'Tiểu Long Nộ', NULL, 'available', '2026-05-25 21:43:56', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (824, 12, '#291', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719273/bomrautft/products/291.webp', 7499000, 9373750, 20, 0, 0, 'Akali K/DA ALL OUT,Gwen Hồng Pha Lê,Miss Fortune Huyết Nguyệt,Sena Cao Bồi,Yasuo Ma Kiếm,Yone T1,Yone Tà Ánh Song Kiếm,Morgana Khổng Tước Hoàng Hậu', 'EveryThing Goes On,U Mộng Hoa Cảnh,Phòng Trà Yên Bình,Ma Sứ Vs Thiên Sứ,Tháp Cảnh Mộng Của Gwen', 'Xoẹt Xoẹt Hồng Pha Lê , T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:43:57', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (836, 12, '432', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719472/bomrautft/products/432.webp', 2399000, 2998750, 20, 0, 0, 'Gwen Hồng Pha Lê,Jinx arcane,Yasuo Ma Kiếm,Malphite Máy Móc,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T��n Lửa Đạn Đạo ,Hoa Linh Lục Địa,Xoẹt Xoẹt Hồng Pha Lê', NULL, 'available', '2026-05-25 21:44:09', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (842, 12, '508', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719400/bomrautft/products/508.webp', 1399000, 1748750, 20, 0, 0, 'Riven Thần Kiếm,Yasuo Ma Kiếm', 'Hội Chợ Nhăm Dần', 'Ma Xứ Trăng Trối', NULL, 'available', '2026-05-25 21:44:19', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (843, 12, '509', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719381/bomrautft/products/509.webp', 1199000, 1498750, 20, 0, 0, 'Yasuo Ma Kiếm', 'Tiệm Cà Phê Paris', 'Máy Chém Noxus Lang Vương', NULL, 'available', '2026-05-25 21:44:20', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (847, 12, '622', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719333/bomrautft/products/622.webp', 899000, 1123750, 20, 0, 0, 'Yasuo Ma Kiếm,Syndra Vệ Binh Tinh Tú', 'Vòng Đài Shurima', 'Bùng Nổ Sức Mạnh Vệ Binh Tinh Tú,T1 Tử Thần Đấy Sâu', NULL, 'available', '2026-05-25 21:44:26', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (867, 13, '#182', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719391/bomrautft/products/182.webp', 1299000, 1623750, 20, 0, 0, 'Yone T1', 'EveryThing Goes On', 'Mũi Tên Bạc,Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:44:39', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (876, 13, '#291', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719273/bomrautft/products/291.webp', 7499000, 9373750, 20, 0, 0, 'Akali K/DA ALL OUT,Gwen Hồng Pha Lê,Miss Fortune Huyết Nguyệt,Sena Cao Bồi,Yasuo Ma Kiếm,Yone T1,Yone Tà Ánh Song Kiếm,Morgana Khổng Tước Hoàng Hậu', 'EveryThing Goes On,U Mộng Hoa Cảnh,Phòng Trà Yên Bình,Ma Sứ Vs Thiên Sứ,Tháp Cảnh Mộng Của Gwen', 'Xoẹt Xoẹt Hồng Pha Lê , T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:44:45', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (879, 13, '#311', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719517/bomrautft/products/311.webp', 1299000, 2165000, 40, 0, 0, 'Yone T1', 'Khu Nhac Chill của Choncc', NULL, NULL, 'available', '2026-05-25 21:44:47', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (885, 13, '356', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719398/bomrautft/products/356.webp', 1399000, 1748750, 20, 0, 0, 'Ezreal Học Viện Chiến Binh,Yone T1', NULL, 'Cung Ánh Sáng Học Viên Chiến Binh,T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:44:52', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (886, 13, '365', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719433/bomrautft/products/365.webp', 1799000, 2248750, 20, 0, 0, 'Yone T1,Zoe Thần Thoại,Kayle Thiên Sứ Công Nghệ', NULL, 'chưởng cung ánh sáng hv , Siêu phẩm : mũi tên bạc ,t1 đoạt mệnh , đại bác đẩy lùi luyện rồng', NULL, 'available', '2026-05-25 21:44:53', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (896, 13, '451', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719490/bomrautft/products/451.webp', 2899000, 3623750, 20, 0, 0, 'Ahri Chiêu Hồn Thiên Hồ,Sett Song Hồn Hoang Thú,Thresh Cao Bồi,Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T1 Đoạt Mệnh,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:45:06', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (898, 13, '479', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719275/bomrautft/products/479.webp', 9999000, 12498750, 20, 0, 0, 'Ezreal Học Viện Chiến Binh,Gwen Tử Chỉ Dương Khí,Irelia Thần Thoại,Orianna Trán Hoa Linh Ngọc,Yone T1,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu,Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Quả Cầu Ma Thuật Hoa Linh', NULL, 'available', '2026-05-25 21:45:08', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (900, 13, '507', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719360/bomrautft/products/507.webp', 999000, 1248750, 20, 0, 0, 'Tristana Pháo Thủ Pengu,Yone T1', NULL, 'Đại Bác Đẩy Lùi,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:45:11', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (908, 13, '594', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719405/bomrautft/products/594.webp', 1399000, 1748750, 20, 0, 0, 'Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:45:22', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (911, 13, '623', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719272/bomrautft/products/623.webp', 4899000, 6123750, 20, 0, 0, 'Lee Tiểu Long,Morgana Tiên Hắc Ám,Orianna Trán Hoa Linh Ngọc,Sett Song Hồn Hoang Thú,Yone T1,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Tiểu Long Nộ', NULL, 'available', '2026-05-25 21:45:26', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (912, 13, '646', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719422/bomrautft/products/646.webp', 1499000, 1873750, 20, 0, 0, 'Yone T1,Everything Goes On', 'Tháp Cảnh Mộng Của Gwen,Everything Goes On', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:45:27', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (913, 13, '647', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719436/bomrautft/products/647.webp', 1799000, 2248750, 20, 0, 0, 'Aatrox DRX,Miss Fortune Thỏ Chỉ Huy,Yone T1', 'U Mộng Hoa Cảnh', 'Mưa Đạn Thỏ Chỉ Huy', NULL, 'available', '2026-05-25 21:45:28', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (914, 13, '648', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719484/bomrautft/products/648.webp', 2699000, 3373750, 20, 0, 0, 'Gwen Hồng Pha Lê,Lulu Vệ Binh Tinh Tú,Yone T1', 'Tháp Cảnh Mộng Của Gwen,Phòng Trà Yên Bình', 'T1 Đoạt Mệnh', NULL, 'available', '2026-05-25 21:45:29', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (915, 13, '649', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719337/bomrautft/products/649.webp', 899000, 1123750, 20, 0, 0, 'Yone T1', 'Mã Đáo Thành Công', NULL, NULL, 'available', '2026-05-25 21:45:30', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (917, 13, '657', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719327/bomrautft/products/657.webp', 799000, 998750, 20, 0, 0, 'Tristana Pháo Thủ Pengu,Yone T1', NULL, 'T1 Đoạt Mệnh,,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:45:33', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (918, 13, '666', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719467/bomrautft/products/666.webp', 1999000, 2498750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Yone T1,Jinx Vệ Binh Tinh Tú,Mordekaiser Hắc Tinh', 'Hội Chợ Nhăm Dần', 'Địa Chấn Tuyệt Vô Thần,T1 Đoạt Mệnh,ULTRA RAPID FIRE', NULL, 'available', '2026-05-25 21:45:34', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (948, 15, 'YoneThanKiem', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718172/bomrautft/products/yonethankiem.webp', 2499000, 3570000, 30, 0, 0, 'Yone Thần Kiếm', NULL, NULL, NULL, 'available', '2026-05-25 21:46:01', '2026-05-25 21:46:01');
INSERT INTO `products` VALUES (955, 15, '563', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719474/bomrautft/products/563.webp', 2399000, 2998750, 20, 0, 0, 'Yone Thần Kiếm', NULL, 'Cung Ánh Sáng Học Viên Chiến Binh,Hoa Linh Đoạt Mệnh, Mũi Tên Thơ Thẩn Phù Thủy,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:46:09', '2026-05-25 21:46:09');
INSERT INTO `products` VALUES (963, 11, '#119', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718212/bomrautft/products/119.webp', 3999000, 4998750, 20, 0, 0, 'Ahri Vệ Binh Tinh Tú,Ezreal Học Viện Chiến Binh,Jhin Vũ Trụ Hắc Ám,Yasuo Long Kiếm,Jinx Pháo Hoa', 'Hội Chợ Nhăm Dần,Buổi Diễn Tối Thượng,Thánh Địa Long Thần,EveryThing Goes On', 'Sân Khấu Tử Thần,Pháo Hoa Siêu Khủng Khiếp', NULL, 'available', '2026-05-25 21:46:54', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (970, 11, 'YasuoLongKiem', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718176/bomrautft/products/yasuolongkiem.webp', 2998000, 4282857, 30, 0, 0, 'Yasuo Long Kiếm', NULL, NULL, NULL, 'available', '2026-05-25 21:47:00', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (972, 11, '410', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718216/bomrautft/products/410.webp', 3999000, 4998750, 20, 0, 0, 'Yasuo Long Kiếm', 'Sân Đấu Sinh Nhật Pengu', 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp,Cung Ánh Sáng Học Viên Chiến Binh', NULL, 'available', '2026-05-25 21:47:02', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (975, 11, '512', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719429/bomrautft/products/512.webp', 1699000, 2123750, 20, 0, 0, 'Aatrox DRX,Vayne Siêu Phẩm,Yasuo Long Kiếm,Heartsteel Sett', NULL, 'Mũi Tên Bạc', NULL, 'available', '2026-05-25 21:47:06', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (977, 11, '601', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719420/bomrautft/products/601.webp', 1499000, 1873750, 20, 0, 0, 'Yasuo Long Kiếm,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Ma Xứ Trăng Trối', NULL, 'available', '2026-05-25 21:47:08', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (980, 11, '615', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719270/bomrautft/products/615.webp', 4799000, 5998750, 20, 0, 0, 'Lee Sin Tuyệt Vô Thần,Yasuo Long Kiếm,Teemo Tiểu Quỷ,Cao Ốc Kim Long', 'Cao Ốc Kim Long', 'Ma Xứ Trăng Trối,Khúc Cao Trào Cổ Cầm,Địa Chấn Tuyệt Vô Thần', NULL, 'available', '2026-05-25 21:47:12', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (982, 11, '665', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718192/bomrautft/products/665.webp', 2999000, 3748750, 20, 0, 0, 'Yasuo Long Kiếm', NULL, 'Cầu Vòng Tối Thượng Sứ Thanh Hoa', NULL, 'available', '2026-05-25 21:47:14', '2026-05-25 23:32:10');
INSERT INTO `products` VALUES (994, 14, '#289', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719455/bomrautft/products/289.webp', 1999000, 2498750, 20, 0, 0, 'Lee Sin Long Cước,Yasuo Ma Kiếm', 'Huyết Nguyệt Dạ Hành', 'Tiểu Long Nộ', NULL, 'available', '2026-05-25 21:47:24', '2026-05-25 21:47:24');
INSERT INTO `products` VALUES (1013, 16, '400', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718184/bomrautft/products/400.webp', 2999000, 3748750, 20, 0, 0, 'Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', NULL, 'Cung Ánh Sáng Học Viên Chiến Binh,Hoa Linh Đoạt Mệnh', NULL, 'available', '2026-05-25 21:47:44', '2026-05-25 21:47:44');
INSERT INTO `products` VALUES (1014, 16, '449', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719522/bomrautft/products/449.webp', 2399000, 2998750, 20, 0, 0, 'Janna Dự Báo Thời TIết,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 'Khu Nhac Chill Của Choncc', 'Hắc Ám Soi Rọi', NULL, 'available', '2026-05-25 21:47:45', '2026-05-25 21:47:45');
INSERT INTO `products` VALUES (1015, 16, '479', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779719275/bomrautft/products/479.webp', 9999000, 12498750, 20, 0, 0, 'Ezreal Học Viện Chiến Binh,Gwen Tử Chỉ Dương Khí,Irelia Thần Thoại,Orianna Trán Hoa Linh Ngọc,Yone T1,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu,Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Cao Ốc Kim Long,Bồng Lai Tiên Cảnh', 'Quả Cầu Ma Thuật Hoa Linh', NULL, 'available', '2026-05-25 21:47:46', '2026-05-25 21:47:46');
INSERT INTO `products` VALUES (1016, 16, '645', 'https://res.cloudinary.com/dvvg0axht/image/upload/v1779718197/bomrautft/products/645.webp', 3339000, 4173750, 20, 0, 0, 'Lillia Mộng Tưởng Tiên Nữ,Thresh Cao Bồi,Ahri Chiêu Hồn Thiên Hồ- Hàng Hiệu', 'U Mộng Hoa Cảnh', 'Quả Cầu Ma Thuật Hoa Linh', NULL, 'available', '2026-05-25 21:47:47', '2026-05-25 21:47:47');

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `type` enum('deposit','purchase','refund') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15, 0) NOT NULL COMMENT 'S??? ti???n (VND)',
  `method` enum('bank_transfer','momo','card') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Ph????ng th???c n???p ti???n',
  `status` enum('pending','completed','failed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `reference_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'M?? giao d???ch b??n ngo??i',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_transactions_user`(`user_id` ASC) USING BTREE,
  INDEX `idx_transactions_type`(`type` ASC) USING BTREE,
  INDEX `idx_transactions_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of transactions
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','npp','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `balance` decimal(15, 0) NOT NULL DEFAULT 0 COMMENT 'S??? d?? t??i kho???n (VND)',
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Google OAuth ID',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  INDEX `idx_users_role`(`role` ASC) USING BTREE,
  INDEX `idx_users_google_id`(`google_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (6, 'huynh08010', 'huynh080104@gmail.com', '$2b$10$3coPcQ.TwypB4MjtWZUmLerjc.iwnON60b7/5YGsAO/SgqwBIbQey', 'admin', 0, NULL, NULL, 1, '2026-05-25 15:53:42', '2026-05-25 15:54:10');

SET FOREIGN_KEY_CHECKS = 1;
