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

USE sellout_tracking;

CREATE TABLE sellout_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    amount INT NOT NULL
);
