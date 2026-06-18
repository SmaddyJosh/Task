CREATE DATABASE IF NOT EXISTS movie_tracker_db;
USE movie_tracker_db;

DROP TABLE IF EXISTS `movies`;
CREATE TABLE `movies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` ENUM('admin', 'client', 'managerial') NOT NULL DEFAULT 'client',
  PRIMARY KEY (`id`)
);
