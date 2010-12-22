# Sequel Pro dump
# Version 2492
# http://code.google.com/p/sequel-pro
#
# Host: 10.179.54.29 (MySQL 5.1.41-3ubuntu12)
# Database: athenasites
# Generation Time: 2010-12-22 15:50:36 -0500
# ************************************************************

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table apollo_Users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `apollo_Users`;

CREATE TABLE `apollo_Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `nice_name` varchar(255) DEFAULT NULL,
  `password_hash` varchar(128) DEFAULT NULL,
  `account_created` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `user_level` tinyint(1) DEFAULT NULL,
  `payment_plan` enum('Monthly','Annually') DEFAULT 'Annually',
  `last_payment` date DEFAULT NULL,
  `next_payment_due` date DEFAULT NULL,
  `monthly_fee` float(3,2) DEFAULT '8.00',
  `address` text,
  `city` varchar(128) DEFAULT NULL,
  `state` varchar(128) DEFAULT NULL,
  `post_code` varchar(128) DEFAULT NULL,
  `iso_country_code` varchar(2) DEFAULT 'US',
  `service_client_gallery` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

LOCK TABLES `apollo_Users` WRITE;
/*!40000 ALTER TABLE `apollo_Users` DISABLE KEYS */;
INSERT INTO `apollo_Users` (`id`,`email`,`name`,`nice_name`,`password_hash`,`account_created`,`last_login`,`user_level`,`payment_plan`,`last_payment`,`next_payment_due`,`monthly_fee`,`address`,`city`,`state`,`post_code`,`iso_country_code`,`service_client_gallery`)
VALUES
	(1,'mike@apollosites.com','Mike Pritchard','Mike Pritchard','9a50ee4bfb927ea2b379c1dd7145985a62cb59baa2758bf28bd3','2010-10-11 21:36:54','2010-12-20 21:43:22',1,'Annually','2010-12-20','2011-12-20',8.00,'7108 Cynthia Ct.','Annandale','VA','22003','US',0),
	(2,'charlotte@charlottegeary.com','Charlotte Geary','Charlotte Geary','de0634589591ec2ddfda5c707b8d2ce1aafffba4d7332d0122d6','2010-10-11 21:36:54','2010-12-20 22:52:54',2,'Annually','2010-12-20','2011-12-20',8.00,'7108 Cynthia Ct.','Annandale','VA','22003','US',0),
	(3,'hollypacionephotography@gmail.com','Holly Pacione','Holly Pacione','5121d18713e2b018ed71e9f43a113a24422808a3ce61165a9d14','2010-03-16 00:00:00','2010-12-19 12:31:52',2,'Annually','2010-12-19','2011-12-19',8.00,'15485 Holbein Dr.','Colorado Springs','CO','80921','US',0),
	(4,'mike@adastrasystems.com','Mike Pritchard','Mike Pritchard','08544aebfd8d10124cc6e0b3de5c215d68f83aaea1bb129afc09','2010-10-11 21:36:54','2010-10-11 21:36:54',1,'Annually','2010-10-11','2011-10-11',8.00,'7108 Cynthia Ct.','Annandale','VA','22003','US',0),
	(5,'brauer.stephanie@gmail.com','Stephanie Brauer','Stephanie Brauer','4df2d60f46ebc93900f3a0bce40e85e481c19a4953bfd246cac6','2010-10-20 23:30:13','2010-12-21 23:46:12',2,'Annually','2010-12-21','2011-12-21',8.00,'417 E. Kiowa St., Unit 807','Colorado Springs','CO','80903','US',0);

/*!40000 ALTER TABLE `apollo_Users` ENABLE KEYS */;
UNLOCK TABLES;





/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
