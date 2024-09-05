-- MariaDB dump 10.19  Distrib 10.4.21-MariaDB, for osx10.10 (x86_64)
--
-- Host: 34.32.40.39    Database: iis_database
-- ------------------------------------------------------
-- Server version	8.0.31-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admission`
--

DROP TABLE IF EXISTS `Admission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `currency` enum('CZK','USD','EUR','PLN','GBP','JPY','AUD') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Admission_event_id_fkey` (`event_id`),
  CONSTRAINT `Admission_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admission`
--

LOCK TABLES `Admission` WRITE;
/*!40000 ALTER TABLE `Admission` DISABLE KEYS */;
INSERT INTO `Admission` VALUES (1,200,'CZK','Základní',2),(2,150,'CZK','Student/ZTP',2),(3,259,'CZK','Hlavní tribuna',3),(4,200,'USD','Základní',4),(5,500,'USD','VIP',4),(6,2000,'CZK','Základní',5),(7,3290,'CZK','Basic',6),(8,10990,'CZK','VIP',6),(11,2599,'CZK','Basic',8),(12,5599,'CZK','VIP',8),(13,10999,'CZK','Super VIP',8);
/*!40000 ALTER TABLE `Admission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CategoriesToEvents`
--

DROP TABLE IF EXISTS `CategoriesToEvents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CategoriesToEvents` (
  `category_id` int NOT NULL,
  `event_id` int NOT NULL,
  PRIMARY KEY (`event_id`,`category_id`),
  KEY `CategoriesToEvents_category_id_fkey` (`category_id`),
  CONSTRAINT `CategoriesToEvents_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CategoriesToEvents_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CategoriesToEvents`
--

LOCK TABLES `CategoriesToEvents` WRITE;
/*!40000 ALTER TABLE `CategoriesToEvents` DISABLE KEYS */;
INSERT INTO `CategoriesToEvents` VALUES (7,4),(8,1),(9,5),(9,6),(10,2),(11,3),(11,8),(12,8),(15,2),(17,3),(18,4),(23,5),(23,6),(25,5);
/*!40000 ALTER TABLE `CategoriesToEvents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_confirmed` tinyint(1) NOT NULL,
  `parent_category_id` int DEFAULT NULL,
  `created_by_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Category_parent_category_id_fkey` (`parent_category_id`),
  KEY `Category_created_by_id_fkey` (`created_by_id`),
  CONSTRAINT `Category_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `User` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Category_parent_category_id_fkey` FOREIGN KEY (`parent_category_id`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (7,'Zábava',1,NULL,15),(8,'Vzdělávání',1,NULL,15),(9,'Hudba',1,NULL,15),(10,'Filmy',1,NULL,15),(11,'Sport',1,NULL,15),(12,'Míčové sporty',1,11,15),(13,'Raketové sporty',1,11,15),(14,'Horor',1,10,3),(15,'Komedie',1,10,3),(16,'Drama',1,10,3),(17,'Zimní sporty',1,11,2),(18,'e-Sport',1,7,3),(19,'Motorsport',1,NULL,2),(20,'Rally',1,19,2),(21,'WRC',1,20,2),(22,'ERC',1,20,2),(23,'Festival',1,9,3),(25,'Rock',1,9,3);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Event` (
  `event_start` datetime(3) NOT NULL,
  `event_end` datetime(3) NOT NULL,
  `capacity` int NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_confirmed` tinyint(1) NOT NULL,
  `venue_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `Event_venue_id_fkey` (`venue_id`),
  KEY `Event_created_by_id_fkey` (`created_by_id`),
  CONSTRAINT `Event_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Event_venue_id_fkey` FOREIGN KEY (`venue_id`) REFERENCES `Venue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
INSERT INTO `Event` VALUES ('2023-10-31 23:00:00.000','2023-10-31 23:00:00.000',200,'https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701115638/images/johjcxcc2tlrk6ddtgla.jpg','Start @ FIT',1,6,3,1),('2023-12-19 23:00:00.000','2023-12-19 23:00:00.000',100,'https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701116235/images/sfwtqtax4zq1fbcekrzq.webp','Mullerovi na tripu',1,7,3,2),('2023-12-02 23:00:00.000','2023-12-02 23:00:00.000',10004,'https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701116379/images/ighbcmgqbz7890jzcn6i.jpg','Tipsport Extraliga, Vítkovice - Litvínov',1,8,2,3),('2023-11-28 23:00:00.000','2023-12-29 23:00:00.000',50000,'https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701116816/images/vq0q4uytqnlwmsnlszen.jpg','League of Legends Worlds',1,9,3,4),('2023-11-30 23:00:00.000','2023-12-06 23:00:00.000',10000,'https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701117229/images/tjese3m3qpj6ijdjjnrq.jpg','Rock For People',1,11,3,5),('2024-07-16 22:00:00.000','2024-07-19 22:00:00.000',50000,'https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701117251/images/e80rd95gbq102i0fw7di.jpg','Colours of Ostrava 2024',1,10,2,6),('2024-11-29 23:00:00.000','2024-12-30 23:00:00.000',2000,'https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701117509/images/bzpqfgmjdob4wurw3dnr.jpg','NBA Finals 2024',0,9,1,8);
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` datetime(3) NOT NULL,
  `role` enum('ADMIN','MODERATOR','AUTH_USER') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'user','04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb','user','user','user@user.cz','2023-11-20 23:00:00.000','AUTH_USER'),(2,'admin','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918','admin','admin','admin@admin.cz','2023-11-17 23:00:00.000','ADMIN'),(3,'moderator','cfde2ca5188afb7bdd0691c7bef887baba78b709aadde8e8c535329d5751e6fe','moderator','moderator','moderator@moderator.cz','2023-11-17 23:00:00.000','MODERATOR'),(15,'user2','6025d18fe48abd45168528f18a82e265dd98d421a7084aa09f61b341703901a3','user2','user2','user2@user2.cz','2023-11-15 23:00:00.000','AUTH_USER');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UsersToEvents`
--

DROP TABLE IF EXISTS `UsersToEvents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UsersToEvents` (
  `user_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `text_review` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admission_id` int DEFAULT NULL,
  `event_id` int NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`event_id`,`user_id`),
  KEY `UsersToEvents_user_id_fkey` (`user_id`),
  KEY `UsersToEvents_admission_id_fkey` (`admission_id`),
  CONSTRAINT `UsersToEvents_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `Admission` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UsersToEvents_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UsersToEvents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UsersToEvents`
--

LOCK TABLES `UsersToEvents` WRITE;
/*!40000 ALTER TABLE `UsersToEvents` DISABLE KEYS */;
INSERT INTO `UsersToEvents` VALUES (1,NULL,NULL,2,2,0),(1,NULL,NULL,3,3,0),(1,NULL,NULL,5,4,0);
/*!40000 ALTER TABLE `UsersToEvents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Venue`
--

DROP TABLE IF EXISTS `Venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Venue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_confirmed` tinyint(1) NOT NULL,
  `created_by_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Venue_created_by_id_fkey` (`created_by_id`),
  CONSTRAINT `Venue_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Venue`
--

LOCK TABLES `Venue` WRITE;
/*!40000 ALTER TABLE `Venue` DISABLE KEYS */;
INSERT INTO `Venue` VALUES (6,'VUT FIT','Brno','Božetěchova 1','61200','Česká republika','https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701115540/images/t9zfa8jjcpfmotiptw9u.jpg','Fakulta informačních technologií Vysokého učení technického v Brně.',1,3),(7,'CineStar Ostrava','Ostrava','Novinářská 6c','70200','Česká republika','https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701116007/images/rrt79ia39qxwmztuutak.png','Multikino CineStar v Ostravě',1,3),(8,'OSTRAVAR ARÉNA','Ostrava','Ruská 3077/135','70030','Česká Republika','https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701116008/images/qyanpnxtu0jvptt4qk1i.jpg','Multifunkční hala',1,2),(9,'Chase Center','San Francisco','1 Warriors Way','1010101','USA','https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701116647/images/brfb6tgxuptzfko3acgm.jpg','',1,3),(10,'Dolní Oblast Vítkovice','Ostrava','Ruská 2993','70300','Česká Republika','https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701116900/images/puxdut2ucm237z2g8z12.jpg','Dolní Vítkovice jsou národní kulturní památka nacházející se poblíž centra Ostravy ve Vítkovicích.',1,2),(11,'Letiště Hradec Králové','Hradec Králové','Letiště 98','503 41','Česká republika','https://res.cloudinary.com/dsrdg2lv3/image/upload/v1701117148/images/i3189xgnyjxav7a588la.jpg','Letiště v Hradci Králové',1,3);
/*!40000 ALTER TABLE `Venue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('147812c1-2514-4a7f-8468-71af2d2df848','49c5c3e64393fd05487a5f4166ce4c536c3a9f0d4f34520bc947d5ba5181ddc8','2023-11-19 21:13:02.874','20231112194518_venue_description_varchar_500',NULL,NULL,'2023-11-19 21:13:02.741',1),('33f73de2-98fb-43a6-bedf-8a7e9e7ac532','1470dd843fb6cbef08a156d06aed8e68be3ff81d1672dafff57c17ee4b7cb070','2023-11-19 21:13:02.702','20231112150950_venue_image_not_required',NULL,NULL,'2023-11-19 21:13:02.544',1),('74922110-481d-4982-9c9b-192b86a916eb','5a449d5929ac68cd2f456bedd53c1c9a01038992cac5ccee4ca90ef9d1fa7f6c','2023-11-19 21:13:01.795','20231106160431_',NULL,NULL,'2023-11-19 21:13:01.619',1),('c78666e1-0298-4ee0-90ef-eb2ed671ea18','b2be0fff8d0381dfa27879f5d586773a6dc69bc80b6a88379e3ea4e583526841','2023-11-19 21:13:01.539','20231106144844_',NULL,NULL,'2023-11-19 21:13:00.788',1),('d8b73120-a25f-4434-bcdf-662d9e6ea281','db567925e67b9ad3df225494929349ca15af18c0ca0edcd4b9cf4df54895f1b5','2023-11-19 21:13:02.009','20231111195550_event_image_not_required',NULL,NULL,'2023-11-19 21:13:01.838',1),('e0403486-58e2-4d93-9752-2167717da798','d7d695c407ea201694cafcc3626cec6eed098ba68ac77aeacd76498b6e40f4c5','2023-11-19 21:13:02.502','20231111201434_event_code_to_event_id',NULL,NULL,'2023-11-19 21:13:02.054',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-27 22:03:01
