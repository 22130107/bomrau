-- ============================================================
-- Reset dữ liệu bán hàng (giữ lại danh mục, sản phẩm, kho, user)
-- ============================================================

START TRANSACTION;

-- 1. Xóa toàn bộ đơn hàng
DELETE FROM orders;

-- 2. Xóa toàn bộ lịch sử giao dịch
DELETE FROM transactions;

-- 3. Xóa tài khoản đã bán (giữ lại available + hidden)
DELETE FROM accounts WHERE status = 'sold';

-- 4. Reset số lượng đã bán ảo về 0
UPDATE categories SET fake_sold_count = 0;
UPDATE products SET fake_sold_count = 0;

-- Kiểm tra số dòng còn lại sau khi xóa:
SELECT 'orders' AS tbl, COUNT(*) AS cnt FROM orders
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'accounts_sold', COUNT(*) FROM accounts WHERE status = 'sold';

-- Nếu dữ liệu đúng, chạy dòng dưới:
-- COMMIT;

-- Nếu sai, chạy dòng dưới:
-- ROLLBACK;
