ALTER TABLE accounts MODIFY COLUMN product_id INT UNSIGNED NULL;
ALTER TABLE accounts DROP FOREIGN KEY fk_accounts_product;
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL ON UPDATE CASCADE;
