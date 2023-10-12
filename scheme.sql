CREATE DATABASE sellout_tracking;
USE sellout_tracking;

CREATE TABLE user_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'sales') NOT NULL,
    target INT NOT NULL,
    achievement INT NOT NULL,
    gap INT NOT NULL
);


INSERT INTO user_table (name, role, target, achivement, gap)
VALUES
('Rafi', 'sales' '100000000', '100000000', '0');

USE sellout_table;

CREATE TABLE sellout_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    amount INT NOT NULL
);


INSERT INTO sellout_table (user_id, sku, quantity, amount)
VALUES
(1, '32t4500', 1, 2000000),