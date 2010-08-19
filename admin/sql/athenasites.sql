# Sequel Pro dump
# Version 2492
# http://code.google.com/p/sequel-pro
#
# Host: localhost (MySQL 5.0.41-log)
# Database: athenasites
# Generation Time: 2010-08-19 14:44:50 -0600
# ************************************************************

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table apollo_RollupServer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `apollo_RollupServer`;

CREATE TABLE `apollo_RollupServer` (
  `server_no` tinyint(2) default NULL,
  `page_views` int(11) default NULL,
  `rollup_date` date default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table apollo_Sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `apollo_Sessions`;

CREATE TABLE `apollo_Sessions` (
  `id` varchar(32) NOT NULL,
  `access` int(10) unsigned default NULL,
  `data` text,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `apollo_Sessions` WRITE;
/*!40000 ALTER TABLE `apollo_Sessions` DISABLE KEYS */;
INSERT INTO `apollo_Sessions` (`id`,`access`,`data`)
VALUES
	('f174079f2bdaaccc40a02a3c19a93c46',1282250339,''),
	('e7aca3dd47e79019cb0e986e0a335688',1282250671,''),
	('2fd3d51bb71d05146b751f36bee0a80b',1282250209,'user_valid|b:1;user_id|s:1:\"1\";user_name|s:14:\"Mike Pritchard\";user_email|s:20:\"mike@apollosites.com\";user_level|s:1:\"2\";');

/*!40000 ALTER TABLE `apollo_Sessions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table apollo_Theme
# ------------------------------------------------------------

DROP TABLE IF EXISTS `apollo_Theme`;

CREATE TABLE `apollo_Theme` (
  `id` int(11) NOT NULL auto_increment,
  `theme_name` varchar(255) default NULL,
  `theme_title` varchar(255) default NULL,
  `price` int(11) default NULL,
  `thumb_url` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `is_private` tinyint(1) default '0',
  `max_page_depth` tinyint(1) default '2',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

LOCK TABLES `apollo_Theme` WRITE;
/*!40000 ALTER TABLE `apollo_Theme` DISABLE KEYS */;
INSERT INTO `apollo_Theme` (`id`,`theme_name`,`theme_title`,`price`,`thumb_url`,`description`,`is_private`,`max_page_depth`)
VALUES
	(2,'HollyPacione','Holly Pacione Photography',1000,'admin/themes/HollyPacione/screenshot.png','Holly Pacione Photography',1,2),
	(1,'ApolloSites','ApolloSites',5000,'admin/themes/ApolloSites/screenshot.png','ApolloSites',1,5),
	(3,'cgp4','Charlotte Geary Photography',5000,'admin/themes/cgp4/screenshot.png','Charlotte Geary Photography',1,4),
	(4,'Callisto','Callisto',200,NULL,NULL,0,2),
	(5,'Pandora','Pandora',200,NULL,NULL,0,2);

/*!40000 ALTER TABLE `apollo_Theme` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table apollo_ThemeParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `apollo_ThemeParas`;

CREATE TABLE `apollo_ThemeParas` (
  `id` int(11) NOT NULL auto_increment,
  `theme_id` int(11) default NULL,
  `para_type` enum('email','image','gallery','font-family','favicon','font-size','color','text','small-int','multi-gallery') default NULL,
  `page_template_name` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `admin_order` tinyint(3) default '1',
  `help_text` text,
  `default_value` varchar(255) default NULL,
  `is_public` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=417 DEFAULT CHARSET=latin1;

LOCK TABLES `apollo_ThemeParas` WRITE;
/*!40000 ALTER TABLE `apollo_ThemeParas` DISABLE KEYS */;
INSERT INTO `apollo_ThemeParas` (`id`,`theme_id`,`para_type`,`page_template_name`,`description`,`admin_order`,`help_text`,`default_value`,`is_public`)
VALUES
	(201,2,'gallery','gallerypage.php','Basic portfolio page',1,NULL,NULL,1),
	(202,2,'gallery','homepage.php','Home page with gallery',1,NULL,NULL,1),
	(203,2,'image','contentleftpage.php','background photo',1,'Choose a background picture that will appear as the background of this page',NULL,1),
	(204,2,'image','contentrightpage.php','background photo',1,'Choose a background picture that will appear as the background of this page',NULL,1),
	(205,2,'image','contactpage.php','background photo',2,'Choose a background picture that will appear as the background of this page',NULL,1),
	(206,2,'email','contactpage.php','email',1,NULL,NULL,1),
	(207,2,'image','all','Logo (450 x 164)',1,'Your site logo, you can use any image but its recommended to use an image that supports transparancy (such as png or gif) and make the backround transparent.',NULL,1),
	(208,2,'font-size','all','Font size',1,NULL,NULL,0),
	(209,2,'font-family','all','Font Family',1,NULL,NULL,0),
	(210,2,'favicon','all','Fav Icon',1,'This allows you to select a favicon for your site, this is the small logo that appears in the browsers navigation bar. Its best to uses a .ico image, but you can also use a png image. The image MUST be 16x16 pixels in size.',NULL,1),
	(211,2,'color','all','Background Color',1,'The background color for the site',NULL,1),
	(212,2,'color','all','Foreground Color',1,'This changes the color of the text throughout your site (with the exception of the text in your menu)',NULL,1),
	(215,2,'image','page.php','background photo',1,'Choose a background picture that will appear as the background of this page',NULL,1),
	(217,2,'color','all','Menu Text Color',1,'This allows you to change the color of the text in the menu',NULL,1),
	(218,2,'color','all','Border Color',1,'This allows you to change the color of the borders used throughout your site',NULL,1),
	(101,1,'image','home_page.php','Home page image',1,'This allows you to set the image used on the home page.',NULL,1),
	(400,4,'image','all','Logo',1,'Set your company logo',NULL,1),
	(401,4,'image','all','Favicon',2,'This allows you to select a favicon for your site, this is the small logo that appears in the browsers navigation bar. Its best to uses a .ico image, but you can also use a png image. The image MUST be 16x16 pixels in size.',NULL,1),
	(402,4,'color','all','Background color',3,'The background color for the site',NULL,1),
	(403,4,'color','all','Foreground color',4,'This changes the color of the text throughout your site (with the exception of the text in your menu)',NULL,1),
	(404,4,'color','all','Menu Text Color',5,'This allows you to change the color of the text in the menu\n',NULL,1),
	(405,4,'text','all','Footer Text',9,'Your footer text, typically a copyright notice',NULL,1),
	(406,4,'text','all','Google Tracking Code',10,'Your google tracking code, given to you by google',NULL,1),
	(408,4,'gallery','gallerypage.php','Gallery page',1,NULL,NULL,1),
	(409,4,'color','all','Menu selected color',6,NULL,NULL,1),
	(410,4,'color','all','Border color',7,'The sites border color.',NULL,1),
	(411,4,'small-int','all','Border width',8,'The sites border width, in pixels. Set to 0 if you don\'t want a border.',NULL,1),
	(412,4,'gallery','homepage.php','Home page gallery',1,NULL,NULL,1),
	(413,4,'image','textleftandimagepage.php','Image',1,NULL,NULL,1),
	(414,4,'gallery','textleftandslideshowpage.php','Gallery',1,NULL,NULL,1),
	(415,4,'gallery','textrightandslideshowpage.php','Gallery',1,NULL,NULL,1),
	(416,4,'image','textrightandimagepage.php','Image',1,NULL,NULL,1),
	(102,1,'multi-gallery','themes_page.php','Themes page multi-gallery',1,NULL,NULL,1),
	(219,2,'color','all','Blog post title color',1,'This is the color used for the title for each of your blog posts.',NULL,1),
	(220,2,'small-int','all','Blog image border width',1,'This is the width of the border used for images in your blog posts. Set to 0 to remove borders.',NULL,1),
	(221,2,'color','all','Blog image border color',1,'This is the color of the border used for images in your blog posts. ',NULL,1),
	(103,1,'color','home_page.php','Home page color',1,'This sets the color for something or other!',NULL,1),
	(301,3,'text','all','Google tracker code',1,'This is the tracker code given to you by google, it typically looks something like \"UA-234628-2\"',NULL,1),
	(302,3,'gallery','gallerypage.php','Gallery page',2,'This is a basic gallery page',NULL,1),
	(303,3,'gallery','homepage.php','Home page gallery',3,'This is a gallery displayed on the home page',NULL,1);

/*!40000 ALTER TABLE `apollo_ThemeParas` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_1_BlogFollowers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_BlogFollowers`;

CREATE TABLE `athena_1_BlogFollowers` (
  `id` int(11) NOT NULL auto_increment,
  `isFollowing` tinyint(1) default '0',
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_1_Comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_Comments`;

CREATE TABLE `athena_1_Comments` (
  `id` int(11) NOT NULL auto_increment,
  `content` text,
  `status` enum('Pending','Published','Trash','Spam','PossibleSpam') default 'Pending',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `blog_follower_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_1_Folders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_Folders`;

CREATE TABLE `athena_1_Folders` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) default 'Unamed Folder',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_1_Folders` WRITE;
/*!40000 ALTER TABLE `athena_1_Folders` DISABLE KEYS */;
INSERT INTO `athena_1_Folders` (`id`,`name`)
VALUES
	(2,'Reserved (Last 24 hours))'),
	(3,'Reserved (Last 7 days)'),
	(4,'Reserved (last 1 day)'),
	(5,'Reserved'),
	(6,'Reserved'),
	(7,'Reserved'),
	(8,'Reserved'),
	(9,'Reserved'),
	(68,'cgp images');

/*!40000 ALTER TABLE `athena_1_Folders` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_1_GalleryMeta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_GalleryMeta`;

CREATE TABLE `athena_1_GalleryMeta` (
  `id` int(11) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `gallery_number` tinyint(2) default '0',
  `title` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `image_id` bigint(20) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_1_GalleryTable
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_GalleryTable`;

CREATE TABLE `athena_1_GalleryTable` (
  `id` bigint(20) NOT NULL auto_increment,
  `image_id` bigint(20) default NULL,
  `page_id` bigint(20) default NULL,
  `slot_number` tinyint(3) default NULL,
  `gallery_number` tinyint(2) default '0',
  `theme_para_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_1_GlobalParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_GlobalParas`;

CREATE TABLE `athena_1_GlobalParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `para_value` varchar(255) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_1_Media
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_Media`;

CREATE TABLE `athena_1_Media` (
  `id` bigint(20) NOT NULL auto_increment,
  `folder_id` int(11) default '1',
  `filename` varchar(255) default NULL,
  `mime_type` varchar(20) default NULL,
  `file_size` int(11) default NULL,
  `created` timestamp NULL default NULL on update CURRENT_TIMESTAMP,
  `title` text,
  `description` text,
  `tags` text,
  `width` int(9) default NULL,
  `height` int(9) default NULL,
  `thumb_filename` varchar(255) default NULL,
  `thumb_width` int(9) default NULL,
  `thumb_height` int(9) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_1_Media` WRITE;
/*!40000 ALTER TABLE `athena_1_Media` DISABLE KEYS */;
INSERT INTO `athena_1_Media` (`id`,`folder_id`,`filename`,`mime_type`,`file_size`,`created`,`title`,`description`,`tags`,`width`,`height`,`thumb_filename`,`thumb_width`,`thumb_height`)
VALUES
	(1,1,'OzTrip001.JPG','image/jpeg',807827,'2010-08-09 22:22:51','OzTrip_001.JPG','','',1600,1200,'OzTrip001_thumb.JPG',50,50),
	(2,1,'OzTrip002.JPG','image/jpeg',872627,'2010-08-09 22:22:51','OzTrip_002.JPG','','',1600,1200,'OzTrip002_thumb.JPG',50,50),
	(3,1,'OzTrip003.JPG','image/jpeg',723476,'2010-08-09 22:22:51','OzTrip_003.JPG','','',1600,1200,'OzTrip003_thumb.JPG',50,50),
	(4,1,'OzTrip004.JPG','image/jpeg',615570,'2010-08-09 22:22:51','OzTrip_004.JPG','','',1600,1200,'OzTrip004_thumb.JPG',50,50),
	(5,1,'OzTrip005.JPG','image/jpeg',735837,'2010-08-09 22:22:52','OzTrip_005.JPG','','',1600,1200,'OzTrip005_thumb.JPG',50,50),
	(6,1,'OzTrip006.JPG','image/jpeg',414403,'2010-08-09 22:22:52','OzTrip_006.JPG','','',1600,1200,'OzTrip006_thumb.JPG',50,50),
	(7,1,'OzTrip007.JPG','image/jpeg',489871,'2010-08-09 22:22:52','OzTrip_007.JPG','','',1600,1200,'OzTrip007_thumb.JPG',50,50),
	(8,1,'OzTrip008.JPG','image/jpeg',357606,'2010-08-09 22:22:52','OzTrip_008.JPG','','',1024,768,'OzTrip008_thumb.JPG',50,50),
	(9,1,'OzTrip009.JPG','image/jpeg',343058,'2010-08-09 22:22:52','OzTrip_009.JPG','','',1024,768,'OzTrip009_thumb.JPG',50,50),
	(10,1,'OzTrip010.JPG','image/jpeg',351745,'2010-08-09 22:22:52','OzTrip_010.JPG','','',1024,768,'OzTrip010_thumb.JPG',50,50),
	(11,1,'intro01.jpg','image/jpeg',193833,'2010-08-11 20:01:25','intro_01.jpg','','',1260,800,'intro01_thumb.jpg',50,50),
	(12,1,'intro02.jpg','image/jpeg',174858,'2010-08-11 20:01:25','intro_02.jpg','','',1260,800,'intro02_thumb.jpg',50,50),
	(13,1,'intro03.jpg','image/jpeg',198904,'2010-08-11 20:01:25','intro_03.jpg','','',1260,800,'intro03_thumb.jpg',50,50),
	(14,1,'intro04.jpg','image/jpeg',167628,'2010-08-11 20:01:26','intro_04.jpg','','',1260,800,'intro04_thumb.jpg',50,50),
	(15,1,'intro05.jpg','image/jpeg',138222,'2010-08-11 20:01:26','intro_05.jpg','','',1260,800,'intro05_thumb.jpg',50,50),
	(16,68,'intro20.jpg','image/jpeg',239069,'2010-08-11 20:02:45','intro_20.jpg','','',1260,800,'intro20_thumb.jpg',50,50),
	(17,68,'intro21.jpg','image/jpeg',175167,'2010-08-11 20:02:46','intro_21.jpg','','',1260,800,'intro21_thumb.jpg',50,50),
	(18,68,'intro22.jpg','image/jpeg',174838,'2010-08-11 20:02:46','intro_22.jpg','','',1260,800,'intro22_thumb.jpg',50,50),
	(19,68,'intro23.jpg','image/jpeg',170592,'2010-08-11 20:02:46','intro_23.jpg','','',1260,800,'intro23_thumb.jpg',50,50),
	(20,68,'intro24.jpg','image/jpeg',153034,'2010-08-11 20:02:46','intro_24.jpg','','',1260,800,'intro24_thumb.jpg',50,50),
	(21,68,'intro25.jpg','image/jpeg',111709,'2010-08-11 20:02:47','intro_25.jpg','','',1280,800,'intro25_thumb.jpg',50,50),
	(22,1,'intro01_1.jpg','image/jpeg',193833,'2010-08-11 20:48:04','intro_01.jpg','','',1260,800,'intro01_1_thumb.jpg',50,50),
	(23,1,'intro02_1.jpg','image/jpeg',174858,'2010-08-11 20:48:04','intro_02.jpg','','',1260,800,'intro02_1_thumb.jpg',50,50),
	(24,1,'intro03_1.jpg','image/jpeg',198904,'2010-08-11 20:48:04','intro_03.jpg','','',1260,800,'intro03_1_thumb.jpg',50,50),
	(25,1,'intro04_1.jpg','image/jpeg',167628,'2010-08-11 20:48:05','intro_04.jpg','','',1260,800,'intro04_1_thumb.jpg',50,50),
	(26,1,'intro05_1.jpg','image/jpeg',138222,'2010-08-11 20:48:05','intro_05.jpg','','',1260,800,'intro05_1_thumb.jpg',50,50),
	(27,1,'intro06.jpg','image/jpeg',117995,'2010-08-11 20:48:05','intro_06.jpg','','',1260,800,'intro06_thumb.jpg',50,50),
	(28,1,'intro07.jpg','image/jpeg',159482,'2010-08-11 20:48:05','intro_07.jpg','','',1260,800,'intro07_thumb.jpg',50,50),
	(29,1,'intro08.jpg','image/jpeg',131547,'2010-08-11 20:48:05','intro_08.jpg','','',1260,840,'intro08_thumb.jpg',50,50),
	(30,1,'intro09.jpg','image/jpeg',170500,'2010-08-11 20:48:06','intro_09.jpg','','',1260,800,'intro09_thumb.jpg',50,50),
	(31,1,'intro10.jpg','image/jpeg',136606,'2010-08-11 20:48:06','intro_10.jpg','','',1260,800,'intro10_thumb.jpg',50,50),
	(32,1,'intro11.jpg','image/jpeg',181283,'2010-08-11 20:48:06','intro_11.jpg','','',1260,800,'intro11_thumb.jpg',50,50),
	(33,1,'intro12.jpg','image/jpeg',167444,'2010-08-11 20:48:06','intro_12.jpg','','',1260,800,'intro12_thumb.jpg',50,50),
	(34,1,'intro13.jpg','image/jpeg',151707,'2010-08-11 20:48:06','intro_13.jpg','','',1260,800,'intro13_thumb.jpg',50,50),
	(35,1,'intro14.jpg','image/jpeg',165953,'2010-08-11 20:48:06','intro_14.jpg','','',1260,800,'intro14_thumb.jpg',50,50),
	(36,1,'intro15.jpg','image/jpeg',94604,'2010-08-11 20:48:07','intro_15.jpg','','',1260,800,'intro15_thumb.jpg',50,50),
	(37,1,'intro16.jpg','image/jpeg',197056,'2010-08-11 20:48:07','intro_16.jpg','','',1260,800,'intro16_thumb.jpg',50,50),
	(38,1,'intro17.jpg','image/jpeg',158170,'2010-08-11 20:48:07','intro_17.jpg','','',1260,800,'intro17_thumb.jpg',50,50),
	(39,1,'intro18.jpg','image/jpeg',167154,'2010-08-11 20:48:07','intro_18.jpg','','',1260,800,'intro18_thumb.jpg',50,50),
	(40,1,'intro19.jpg','image/jpeg',191870,'2010-08-11 20:48:07','intro_19.jpg','','',1260,800,'intro19_thumb.jpg',50,50),
	(41,1,'intro20_1.jpg','image/jpeg',239069,'2010-08-11 20:48:08','intro_20.jpg','','',1260,800,'intro20_1_thumb.jpg',50,50),
	(42,1,'intro21_1.jpg','image/jpeg',175167,'2010-08-11 20:48:08','intro_21.jpg','','',1260,800,'intro21_1_thumb.jpg',50,50),
	(43,1,'intro22_1.jpg','image/jpeg',174838,'2010-08-11 20:48:08','intro_22.jpg','','',1260,800,'intro22_1_thumb.jpg',50,50),
	(44,1,'intro23_1.jpg','image/jpeg',170592,'2010-08-11 20:48:08','intro_23.jpg','','',1260,800,'intro23_1_thumb.jpg',50,50),
	(45,1,'intro24_1.jpg','image/jpeg',153034,'2010-08-11 20:48:08','intro_24.jpg','','',1260,800,'intro24_1_thumb.jpg',50,50),
	(46,1,'intro25_1.jpg','image/jpeg',111709,'2010-08-11 20:48:09','intro_25.jpg','','',1280,800,'intro25_1_thumb.jpg',50,50),
	(47,1,'intro26.jpg','image/jpeg',306763,'2010-08-11 20:48:09','intro_26.jpg','','',1280,800,'intro26_thumb.jpg',50,50),
	(48,1,'intro27.jpg','image/jpeg',195623,'2010-08-11 20:48:09','intro_27.jpg','','',1260,800,'intro27_thumb.jpg',50,50),
	(49,1,'intro28.jpg','image/jpeg',146378,'2010-08-11 20:48:09','intro_28.jpg','','',1260,800,'intro28_thumb.jpg',50,50),
	(50,1,'intro29.jpg','image/jpeg',125793,'2010-08-11 20:48:10','intro_29.jpg','','',1260,800,'intro29_thumb.jpg',50,50),
	(51,1,'intro30.jpg','image/jpeg',134266,'2010-08-11 20:48:10','intro_30.jpg','','',1260,800,'intro30_thumb.jpg',50,50);

/*!40000 ALTER TABLE `athena_1_Media` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_1_PageParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_PageParas`;

CREATE TABLE `athena_1_PageParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `theme_para_id` int(11) default NULL,
  `para_value` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_1_PageParas` WRITE;
/*!40000 ALTER TABLE `athena_1_PageParas` DISABLE KEYS */;
INSERT INTO `athena_1_PageParas` (`id`,`page_id`,`theme_para_id`,`para_value`)
VALUES
	(1,9,101,'7'),
	(2,20,101,'32'),
	(3,20,103,'2c473d'),
	(4,9,103,'c0cc42');

/*!40000 ALTER TABLE `athena_1_PageParas` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_1_Pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_Pages`;

CREATE TABLE `athena_1_Pages` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `parent_page_id` int(11) default '0',
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  `is_homepage` tinyint(1) default '0',
  `page_order` tinyint(3) default '0',
  `is_blogpage` tinyint(1) default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_1_Pages` WRITE;
/*!40000 ALTER TABLE `athena_1_Pages` DISABLE KEYS */;
INSERT INTO `athena_1_Pages` (`id`,`user_id`,`content`,`status`,`last_edit`,`parent_page_id`,`title`,`slug`,`path`,`created`,`template`,`is_homepage`,`page_order`,`is_blogpage`)
VALUES
	(27,1,'<p>\\sfg dsfgdf dsf gdsf gD&quot;F gdsf\\</p>','Draft','2010-08-18 22:59:01',26,'New page 6','Newpage6.html','/newpage5/','2010-08-18 20:25:02','',0,0,0),
	(26,1,'<p>\\\\</p>','Draft','2010-08-18 22:59:10',0,'New page 5','Newpage5.html','/','2010-08-18 20:24:54','',0,0,0),
	(21,1,'','Private','2010-08-12 20:05:44',0,'Themes','Themes.html','/','2010-08-12 05:30:28','themes_page.php',0,0,0);

/*!40000 ALTER TABLE `athena_1_Pages` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_1_PageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_PageViews`;

CREATE TABLE `athena_1_PageViews` (
  `page_id` bigint(20) default NULL,
  `view_date` datetime default NULL,
  `ip_long` bigint(20) default NULL,
  `is_bot` tinyint(1) default '0',
  `browser` varchar(25) default NULL,
  `browser_ver` varchar(8) default NULL,
  `os_name` varchar(25) default NULL,
  `os_ver` varchar(8) default NULL,
  `referer` varchar(255) default NULL,
  `user_agent` varchar(255) default NULL,
  `server_ip` bigint(20) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_1_PostCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_PostCategories`;

CREATE TABLE `athena_1_PostCategories` (
  `id` int(11) NOT NULL auto_increment,
  `category` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_1_Posts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_Posts`;

CREATE TABLE `athena_1_Posts` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `canComment` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_1_PostTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_PostTags`;

CREATE TABLE `athena_1_PostTags` (
  `id` int(11) NOT NULL auto_increment,
  `tag` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_1_PostToCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_PostToCategories`;

CREATE TABLE `athena_1_PostToCategories` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `category_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_1_PostToTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_PostToTags`;

CREATE TABLE `athena_1_PostToTags` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `tag_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_1_RollupBrowser
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_RollupBrowser`;

CREATE TABLE `athena_1_RollupBrowser` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `browser` varchar(30) default NULL,
  `browser_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_1_RollupCrawler
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_RollupCrawler`;

CREATE TABLE `athena_1_RollupCrawler` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `crawler` varchar(25) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_1_RollupOS
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_RollupOS`;

CREATE TABLE `athena_1_RollupOS` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `os_name` varchar(30) default NULL,
  `os_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_1_RollupPageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_1_RollupPageViews`;

CREATE TABLE `athena_1_RollupPageViews` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `page_views` int(11) default NULL,
  `unique_visitors` int(11) default NULL,
  `keywords` text,
  `page_title` varchar(125) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_2_BlogFollowers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_BlogFollowers`;

CREATE TABLE `athena_2_BlogFollowers` (
  `id` int(11) NOT NULL auto_increment,
  `isFollowing` tinyint(1) default '0',
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_2_Comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_Comments`;

CREATE TABLE `athena_2_Comments` (
  `id` int(11) NOT NULL auto_increment,
  `content` text,
  `status` enum('Pending','Published','Trash','Spam','PossibleSpam') default 'Pending',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `blog_follower_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_2_Folders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_Folders`;

CREATE TABLE `athena_2_Folders` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) default 'Unamed Folder',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_2_Folders` WRITE;
/*!40000 ALTER TABLE `athena_2_Folders` DISABLE KEYS */;
INSERT INTO `athena_2_Folders` (`id`,`name`)
VALUES
	(2,'Reserved (Last 24 hours))'),
	(3,'Reserved (Last 7 days)'),
	(4,'Reserved (last 1 day)'),
	(5,'Reserved'),
	(6,'Reserved'),
	(7,'Reserved'),
	(8,'Reserved'),
	(9,'Reserved');

/*!40000 ALTER TABLE `athena_2_Folders` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_2_GalleryMeta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_GalleryMeta`;

CREATE TABLE `athena_2_GalleryMeta` (
  `id` int(11) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `gallery_number` tinyint(2) default '0',
  `title` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `image_id` bigint(20) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_2_GalleryTable
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_GalleryTable`;

CREATE TABLE `athena_2_GalleryTable` (
  `id` bigint(20) NOT NULL auto_increment,
  `image_id` bigint(20) default NULL,
  `page_id` bigint(20) default NULL,
  `slot_number` tinyint(3) default NULL,
  `gallery_number` tinyint(2) default '0',
  `theme_para_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_2_GlobalParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_GlobalParas`;

CREATE TABLE `athena_2_GlobalParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `para_value` varchar(255) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_2_Media
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_Media`;

CREATE TABLE `athena_2_Media` (
  `id` bigint(20) NOT NULL auto_increment,
  `folder_id` int(11) default '1',
  `filename` varchar(255) default NULL,
  `mime_type` varchar(20) default NULL,
  `file_size` int(11) default NULL,
  `created` timestamp NULL default NULL on update CURRENT_TIMESTAMP,
  `title` text,
  `description` text,
  `tags` text,
  `width` int(9) default NULL,
  `height` int(9) default NULL,
  `thumb_filename` varchar(255) default NULL,
  `thumb_width` int(9) default NULL,
  `thumb_height` int(9) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_2_PageParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_PageParas`;

CREATE TABLE `athena_2_PageParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `theme_para_id` int(11) default NULL,
  `para_value` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_2_Pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_Pages`;

CREATE TABLE `athena_2_Pages` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `parent_page_id` int(11) default '0',
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  `is_homepage` tinyint(1) default '0',
  `page_order` tinyint(3) default '0',
  `is_blogpage` tinyint(1) default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;



# Dump of table athena_2_PageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_PageViews`;

CREATE TABLE `athena_2_PageViews` (
  `page_id` bigint(20) default NULL,
  `view_date` datetime default NULL,
  `ip_long` bigint(20) default NULL,
  `is_bot` tinyint(1) default '0',
  `browser` varchar(25) default NULL,
  `browser_ver` varchar(8) default NULL,
  `os_name` varchar(25) default NULL,
  `os_ver` varchar(8) default NULL,
  `referer` varchar(255) default NULL,
  `user_agent` varchar(255) default NULL,
  `server_ip` bigint(20) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_2_PostCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_PostCategories`;

CREATE TABLE `athena_2_PostCategories` (
  `id` int(11) NOT NULL auto_increment,
  `category` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_2_Posts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_Posts`;

CREATE TABLE `athena_2_Posts` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `canComment` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_2_PostTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_PostTags`;

CREATE TABLE `athena_2_PostTags` (
  `id` int(11) NOT NULL auto_increment,
  `tag` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_2_PostToCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_PostToCategories`;

CREATE TABLE `athena_2_PostToCategories` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `category_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_2_PostToTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_PostToTags`;

CREATE TABLE `athena_2_PostToTags` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `tag_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_2_RollupBrowser
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_RollupBrowser`;

CREATE TABLE `athena_2_RollupBrowser` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `browser` varchar(30) default NULL,
  `browser_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_2_RollupCrawler
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_RollupCrawler`;

CREATE TABLE `athena_2_RollupCrawler` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `crawler` varchar(25) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_2_RollupOS
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_RollupOS`;

CREATE TABLE `athena_2_RollupOS` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `os_name` varchar(30) default NULL,
  `os_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_2_RollupPageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_2_RollupPageViews`;

CREATE TABLE `athena_2_RollupPageViews` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `page_views` int(11) default NULL,
  `unique_visitors` int(11) default NULL,
  `keywords` text,
  `page_title` varchar(125) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_3_BlogFollowers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_BlogFollowers`;

CREATE TABLE `athena_3_BlogFollowers` (
  `id` int(11) NOT NULL auto_increment,
  `isFollowing` tinyint(1) default '0',
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_3_Comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_Comments`;

CREATE TABLE `athena_3_Comments` (
  `id` int(11) NOT NULL auto_increment,
  `content` text,
  `status` enum('Pending','Published','Trash','Spam','PossibleSpam') default 'Pending',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `blog_follower_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_3_Folders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_Folders`;

CREATE TABLE `athena_3_Folders` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) default 'Unamed Folder',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_3_Folders` WRITE;
/*!40000 ALTER TABLE `athena_3_Folders` DISABLE KEYS */;
INSERT INTO `athena_3_Folders` (`id`,`name`)
VALUES
	(2,'Reserved (Last 24 hours))'),
	(3,'Reserved (Last 7 days)'),
	(4,'Reserved (last 1 day)'),
	(5,'Reserved'),
	(6,'Reserved'),
	(7,'Reserved'),
	(8,'Reserved'),
	(9,'Reserved');

/*!40000 ALTER TABLE `athena_3_Folders` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_3_GalleryMeta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_GalleryMeta`;

CREATE TABLE `athena_3_GalleryMeta` (
  `id` int(11) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `gallery_number` tinyint(2) default '0',
  `title` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `image_id` bigint(20) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_3_GalleryTable
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_GalleryTable`;

CREATE TABLE `athena_3_GalleryTable` (
  `id` bigint(20) NOT NULL auto_increment,
  `image_id` bigint(20) default NULL,
  `page_id` bigint(20) default NULL,
  `slot_number` tinyint(3) default NULL,
  `gallery_number` tinyint(2) default '0',
  `theme_para_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_3_GlobalParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_GlobalParas`;

CREATE TABLE `athena_3_GlobalParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `para_value` varchar(255) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_3_Media
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_Media`;

CREATE TABLE `athena_3_Media` (
  `id` bigint(20) NOT NULL auto_increment,
  `folder_id` int(11) default '1',
  `filename` varchar(255) default NULL,
  `mime_type` varchar(20) default NULL,
  `file_size` int(11) default NULL,
  `created` timestamp NULL default NULL on update CURRENT_TIMESTAMP,
  `title` text,
  `description` text,
  `tags` text,
  `width` int(9) default NULL,
  `height` int(9) default NULL,
  `thumb_filename` varchar(255) default NULL,
  `thumb_width` int(9) default NULL,
  `thumb_height` int(9) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_3_PageParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_PageParas`;

CREATE TABLE `athena_3_PageParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `theme_para_id` int(11) default NULL,
  `para_value` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_3_Pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_Pages`;

CREATE TABLE `athena_3_Pages` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `parent_page_id` int(11) default '0',
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  `is_homepage` tinyint(1) default '0',
  `page_order` tinyint(3) default '0',
  `is_blogpage` tinyint(1) default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;



# Dump of table athena_3_PageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_PageViews`;

CREATE TABLE `athena_3_PageViews` (
  `page_id` bigint(20) default NULL,
  `view_date` datetime default NULL,
  `ip_long` bigint(20) default NULL,
  `is_bot` tinyint(1) default '0',
  `browser` varchar(25) default NULL,
  `browser_ver` varchar(8) default NULL,
  `os_name` varchar(25) default NULL,
  `os_ver` varchar(8) default NULL,
  `referer` varchar(255) default NULL,
  `user_agent` varchar(255) default NULL,
  `server_ip` bigint(20) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_3_PostCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_PostCategories`;

CREATE TABLE `athena_3_PostCategories` (
  `id` int(11) NOT NULL auto_increment,
  `category` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_3_Posts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_Posts`;

CREATE TABLE `athena_3_Posts` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `canComment` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_3_PostTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_PostTags`;

CREATE TABLE `athena_3_PostTags` (
  `id` int(11) NOT NULL auto_increment,
  `tag` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_3_PostToCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_PostToCategories`;

CREATE TABLE `athena_3_PostToCategories` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `category_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_3_PostToTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_PostToTags`;

CREATE TABLE `athena_3_PostToTags` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `tag_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_3_RollupBrowser
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_RollupBrowser`;

CREATE TABLE `athena_3_RollupBrowser` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `browser` varchar(30) default NULL,
  `browser_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_3_RollupCrawler
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_RollupCrawler`;

CREATE TABLE `athena_3_RollupCrawler` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `crawler` varchar(25) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_3_RollupOS
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_RollupOS`;

CREATE TABLE `athena_3_RollupOS` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `os_name` varchar(30) default NULL,
  `os_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_3_RollupPageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_3_RollupPageViews`;

CREATE TABLE `athena_3_RollupPageViews` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `page_views` int(11) default NULL,
  `unique_visitors` int(11) default NULL,
  `keywords` text,
  `page_title` varchar(125) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_4_BlogFollowers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_BlogFollowers`;

CREATE TABLE `athena_4_BlogFollowers` (
  `id` int(11) NOT NULL auto_increment,
  `isFollowing` tinyint(1) default '0',
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_4_Comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_Comments`;

CREATE TABLE `athena_4_Comments` (
  `id` int(11) NOT NULL auto_increment,
  `content` text,
  `status` enum('Pending','Published','Trash','Spam','PossibleSpam') default 'Pending',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `blog_follower_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_4_Folders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_Folders`;

CREATE TABLE `athena_4_Folders` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) default 'Unamed Folder',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_4_Folders` WRITE;
/*!40000 ALTER TABLE `athena_4_Folders` DISABLE KEYS */;
INSERT INTO `athena_4_Folders` (`id`,`name`)
VALUES
	(2,'Reserved (Last 24 hours))'),
	(3,'Reserved (Last 7 days)'),
	(4,'Reserved (last 1 day)'),
	(5,'Reserved'),
	(6,'Reserved'),
	(7,'Reserved'),
	(8,'Reserved'),
	(9,'Reserved'),
	(68,'home'),
	(69,'information'),
	(70,'portraitlocations'),
	(71,'products'),
	(72,'portraits');

/*!40000 ALTER TABLE `athena_4_Folders` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_GalleryMeta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_GalleryMeta`;

CREATE TABLE `athena_4_GalleryMeta` (
  `id` int(11) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `gallery_number` tinyint(2) default '0',
  `title` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `image_id` bigint(20) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_4_GalleryTable
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_GalleryTable`;

CREATE TABLE `athena_4_GalleryTable` (
  `id` bigint(20) NOT NULL auto_increment,
  `image_id` bigint(20) default NULL,
  `page_id` bigint(20) default NULL,
  `slot_number` tinyint(3) default NULL,
  `gallery_number` tinyint(2) default '0',
  `theme_para_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=116 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_4_GalleryTable` WRITE;
/*!40000 ALTER TABLE `athena_4_GalleryTable` DISABLE KEYS */;
INSERT INTO `athena_4_GalleryTable` (`id`,`image_id`,`page_id`,`slot_number`,`gallery_number`,`theme_para_id`)
VALUES
	(84,1,11,0,1,302),
	(79,26,9,44,1,303),
	(68,15,9,14,1,303),
	(61,8,9,7,1,303),
	(62,9,9,8,1,303),
	(70,17,9,18,1,303),
	(69,16,9,16,1,303),
	(91,18,9,17,1,303),
	(72,19,9,23,1,303),
	(74,21,9,35,1,303),
	(65,12,9,11,1,303),
	(67,14,9,13,1,303),
	(76,23,9,41,1,303),
	(24,1,9,0,1,303),
	(25,2,9,1,1,303),
	(26,3,9,2,1,303),
	(33,4,9,3,1,303),
	(34,5,9,4,1,303),
	(35,6,9,5,1,303),
	(37,7,9,6,1,303),
	(66,13,9,12,1,303),
	(73,20,9,31,1,303),
	(63,10,9,9,1,303),
	(80,27,9,46,1,303),
	(64,11,9,10,1,303),
	(77,24,9,42,1,303),
	(78,25,9,43,1,303),
	(81,28,9,52,1,303),
	(89,8,9,15,1,303),
	(75,22,9,40,1,303),
	(88,8,9,54,1,303),
	(85,2,11,1,1,302),
	(86,3,11,2,1,302),
	(90,9,9,19,1,303),
	(92,10,9,20,1,303),
	(93,11,9,21,1,303),
	(94,12,9,22,1,303),
	(95,14,9,24,1,303),
	(96,15,9,33,1,303),
	(97,17,9,27,1,303),
	(98,15,9,37,1,303),
	(99,15,9,39,1,303),
	(100,15,9,38,1,303),
	(101,15,9,36,1,303),
	(102,15,9,34,1,303),
	(103,15,9,32,1,303),
	(104,15,9,30,1,303),
	(105,15,9,26,1,303),
	(106,15,9,25,1,303),
	(107,13,9,28,1,303),
	(108,13,9,29,1,303),
	(109,13,9,53,1,303),
	(110,13,9,47,1,303),
	(111,13,9,48,1,303),
	(112,13,9,49,1,303),
	(113,13,9,50,1,303),
	(114,13,9,51,1,303),
	(115,13,9,45,1,303);

/*!40000 ALTER TABLE `athena_4_GalleryTable` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_GlobalParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_GlobalParas`;

CREATE TABLE `athena_4_GlobalParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `para_value` varchar(255) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_4_GlobalParas` WRITE;
/*!40000 ALTER TABLE `athena_4_GlobalParas` DISABLE KEYS */;
INSERT INTO `athena_4_GlobalParas` (`id`,`para_value`,`theme_para_id`)
VALUES
	(1,'UA-534928-3',301);

/*!40000 ALTER TABLE `athena_4_GlobalParas` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_Media
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_Media`;

CREATE TABLE `athena_4_Media` (
  `id` bigint(20) NOT NULL auto_increment,
  `folder_id` int(11) default '1',
  `filename` varchar(255) default NULL,
  `mime_type` varchar(20) default NULL,
  `file_size` int(11) default NULL,
  `created` timestamp NULL default NULL on update CURRENT_TIMESTAMP,
  `title` text,
  `description` text,
  `tags` text,
  `width` int(9) default NULL,
  `height` int(9) default NULL,
  `thumb_filename` varchar(255) default NULL,
  `thumb_width` int(9) default NULL,
  `thumb_height` int(9) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=303 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_4_Media` WRITE;
/*!40000 ALTER TABLE `athena_4_Media` DISABLE KEYS */;
INSERT INTO `athena_4_Media` (`id`,`folder_id`,`filename`,`mime_type`,`file_size`,`created`,`title`,`description`,`tags`,`width`,`height`,`thumb_filename`,`thumb_width`,`thumb_height`)
VALUES
	(1,68,'intro01.jpg','image/jpeg',193833,'2010-08-11 20:50:52','intro_01.jpg','','',1260,800,'intro01_thumb.jpg',50,50),
	(2,68,'intro02.jpg','image/jpeg',174858,'2010-08-11 20:50:53','intro_02.jpg','','',1260,800,'intro02_thumb.jpg',50,50),
	(3,68,'intro03.jpg','image/jpeg',198904,'2010-08-11 20:50:53','intro_03.jpg','','',1260,800,'intro03_thumb.jpg',50,50),
	(4,68,'intro04.jpg','image/jpeg',167628,'2010-08-11 20:50:53','intro_04.jpg','','',1260,800,'intro04_thumb.jpg',50,50),
	(5,68,'intro05.jpg','image/jpeg',138222,'2010-08-11 20:50:53','intro_05.jpg','','',1260,800,'intro05_thumb.jpg',50,50),
	(6,68,'intro06.jpg','image/jpeg',117995,'2010-08-11 20:51:01','intro_06.jpg','','',1260,800,'intro06_thumb.jpg',50,50),
	(7,68,'intro07.jpg','image/jpeg',159482,'2010-08-11 20:51:01','intro_07.jpg','','',1260,800,'intro07_thumb.jpg',50,50),
	(8,68,'intro08.jpg','image/jpeg',131547,'2010-08-11 20:51:02','intro_08.jpg','','',1260,840,'intro08_thumb.jpg',50,50),
	(9,68,'intro09.jpg','image/jpeg',170500,'2010-08-11 20:51:02','intro_09.jpg','','',1260,800,'intro09_thumb.jpg',50,50),
	(10,68,'intro10.jpg','image/jpeg',136606,'2010-08-11 20:51:02','intro_10.jpg','','',1260,800,'intro10_thumb.jpg',50,50),
	(11,68,'intro11.jpg','image/jpeg',181283,'2010-08-11 20:51:02','intro_11.jpg','','',1260,800,'intro11_thumb.jpg',50,50),
	(12,68,'intro12.jpg','image/jpeg',167444,'2010-08-11 20:51:02','intro_12.jpg','','',1260,800,'intro12_thumb.jpg',50,50),
	(13,68,'intro13.jpg','image/jpeg',151707,'2010-08-11 20:51:03','intro_13.jpg','','',1260,800,'intro13_thumb.jpg',50,50),
	(14,68,'intro14.jpg','image/jpeg',165953,'2010-08-11 20:51:03','intro_14.jpg','','',1260,800,'intro14_thumb.jpg',50,50),
	(15,68,'intro15.jpg','image/jpeg',94604,'2010-08-11 20:51:03','intro_15.jpg','','',1260,800,'intro15_thumb.jpg',50,50),
	(16,68,'intro16.jpg','image/jpeg',197056,'2010-08-11 20:51:03','intro_16.jpg','','',1260,800,'intro16_thumb.jpg',50,50),
	(17,68,'intro17.jpg','image/jpeg',158170,'2010-08-11 20:51:03','intro_17.jpg','','',1260,800,'intro17_thumb.jpg',50,50),
	(18,68,'intro18.jpg','image/jpeg',167154,'2010-08-11 20:51:04','intro_18.jpg','','',1260,800,'intro18_thumb.jpg',50,50),
	(19,68,'intro19.jpg','image/jpeg',191870,'2010-08-11 20:51:04','intro_19.jpg','','',1260,800,'intro19_thumb.jpg',50,50),
	(20,68,'intro20.jpg','image/jpeg',239069,'2010-08-11 20:51:04','intro_20.jpg','','',1260,800,'intro20_thumb.jpg',50,50),
	(21,68,'intro21.jpg','image/jpeg',175167,'2010-08-11 20:51:04','intro_21.jpg','','',1260,800,'intro21_thumb.jpg',50,50),
	(22,68,'intro22.jpg','image/jpeg',174838,'2010-08-11 20:51:04','intro_22.jpg','','',1260,800,'intro22_thumb.jpg',50,50),
	(23,68,'intro23.jpg','image/jpeg',170592,'2010-08-11 20:51:04','intro_23.jpg','','',1260,800,'intro23_thumb.jpg',50,50),
	(24,68,'intro24.jpg','image/jpeg',153034,'2010-08-11 20:51:05','intro_24.jpg','','',1260,800,'intro24_thumb.jpg',50,50),
	(25,68,'intro25.jpg','image/jpeg',111709,'2010-08-11 20:51:05','intro_25.jpg','','',1280,800,'intro25_thumb.jpg',50,50),
	(26,68,'intro26.jpg','image/jpeg',306763,'2010-08-11 20:51:05','intro_26.jpg','','',1280,800,'intro26_thumb.jpg',50,50),
	(27,68,'intro27.jpg','image/jpeg',195623,'2010-08-11 20:51:05','intro_27.jpg','','',1260,800,'intro27_thumb.jpg',50,50),
	(28,68,'intro28.jpg','image/jpeg',146378,'2010-08-11 20:51:05','intro_28.jpg','','',1260,800,'intro28_thumb.jpg',50,50),
	(29,68,'intro29.jpg','image/jpeg',125793,'2010-08-11 20:51:06','intro_29.jpg','','',1260,800,'intro29_thumb.jpg',50,50),
	(30,68,'intro30.jpg','image/jpeg',134266,'2010-08-11 20:51:06','intro_30.jpg','','',1260,800,'intro30_thumb.jpg',50,50),
	(31,69,'aboutus01.jpg','image/jpeg',49831,'2010-08-14 23:47:43','aboutus_01.jpg','','',500,500,'aboutus01_thumb.jpg',50,50),
	(32,69,'aboutus02.jpg','image/jpeg',35953,'2010-08-14 23:47:43','aboutus_02.jpg','','',500,500,'aboutus02_thumb.jpg',50,50),
	(33,69,'aboutus03.jpg','image/jpeg',63184,'2010-08-14 23:47:43','aboutus_03.jpg','','',500,500,'aboutus03_thumb.jpg',50,50),
	(34,69,'aboutus04.jpg','image/jpeg',54253,'2010-08-14 23:47:43','aboutus_04.jpg','','',500,500,'aboutus04_thumb.jpg',50,50),
	(35,69,'aboutus05.jpg','image/jpeg',39997,'2010-08-14 23:47:43','aboutus_05.jpg','','',500,500,'aboutus05_thumb.jpg',50,50),
	(36,69,'aboutus06.jpg','image/jpeg',54618,'2010-08-14 23:47:43','aboutus_06.jpg','','',500,500,'aboutus06_thumb.jpg',50,50),
	(37,69,'aboutus07.jpg','image/jpeg',54246,'2010-08-14 23:47:43','aboutus_07.jpg','','',500,500,'aboutus07_thumb.jpg',50,50),
	(38,69,'aboutus08.jpg','image/jpeg',54821,'2010-08-14 23:47:44','aboutus_08.jpg','','',500,500,'aboutus08_thumb.jpg',50,50),
	(39,69,'aboutus09.jpg','image/jpeg',81284,'2010-08-14 23:47:44','aboutus_09.jpg','','',500,500,'aboutus09_thumb.jpg',50,50),
	(40,69,'planning.jpg','image/jpeg',62620,'2010-08-14 23:47:49','planning.jpg','','',500,500,'planning_thumb.jpg',50,50),
	(41,69,'portraittips.jpg','image/jpeg',97901,'2010-08-14 23:47:49','portraittips.jpg','','',500,500,'portraittips_thumb.jpg',50,50),
	(42,69,'weddingtips.jpg','image/jpeg',62620,'2010-08-14 23:47:49','weddingtips.jpg','','',500,500,'weddingtips_thumb.jpg',50,50),
	(43,69,'pricing.jpg','image/jpeg',51460,'2010-08-14 23:47:54','pricing.jpg','','',500,500,'pricing_thumb.jpg',50,50),
	(44,71,'cardsandgifts01.jpg','image/jpeg',41576,'2010-08-14 23:48:12','cardsandgifts_01.jpg','','',750,500,'cardsandgifts01_thumb.jpg',50,50),
	(45,71,'cardsandgifts02.jpg','image/jpeg',60954,'2010-08-14 23:48:13','cardsandgifts_02.jpg','','',750,500,'cardsandgifts02_thumb.jpg',50,50),
	(46,71,'cardsandgifts03.jpg','image/jpeg',57318,'2010-08-14 23:48:13','cardsandgifts_03.jpg','','',750,500,'cardsandgifts03_thumb.jpg',50,50),
	(47,71,'coffeetablebook01.jpg','image/jpeg',62235,'2010-08-14 23:48:13','coffeetablebook_01.jpg','','',750,500,'coffeetablebook01_thumb.jpg',50,50),
	(48,71,'coffeetablebook02.jpg','image/jpeg',57720,'2010-08-14 23:48:13','coffeetablebook_02.jpg','','',750,500,'coffeetablebook02_thumb.jpg',50,50),
	(49,71,'coffeetablebook03.jpg','image/jpeg',33565,'2010-08-14 23:48:13','coffeetablebook_03.jpg','','',750,500,'coffeetablebook03_thumb.jpg',50,50),
	(50,71,'coffeetablebook04.jpg','image/jpeg',54357,'2010-08-14 23:48:13','coffeetablebook_04.jpg','','',750,500,'coffeetablebook04_thumb.jpg',50,50),
	(51,71,'coffeetablebook05.jpg','image/jpeg',65578,'2010-08-14 23:48:13','coffeetablebook_05.jpg','','',750,500,'coffeetablebook05_thumb.jpg',50,50),
	(52,71,'coffeetablebook06.jpg','image/jpeg',45047,'2010-08-14 23:48:13','coffeetablebook_06.jpg','','',750,500,'coffeetablebook06_thumb.jpg',50,50),
	(53,71,'coffeetablebook07.jpg','image/jpeg',78770,'2010-08-14 23:48:14','coffeetablebook_07.jpg','','',750,500,'coffeetablebook07_thumb.jpg',50,50),
	(54,71,'coffeetablebook08.jpg','image/jpeg',79175,'2010-08-14 23:48:14','coffeetablebook_08.jpg','','',750,500,'coffeetablebook08_thumb.jpg',50,50),
	(55,71,'coffeetablebook09.jpg','image/jpeg',77200,'2010-08-14 23:48:14','coffeetablebook_09.jpg','','',750,500,'coffeetablebook09_thumb.jpg',50,50),
	(56,71,'coffeetablebook10.jpg','image/jpeg',75233,'2010-08-14 23:48:14','coffeetablebook_10.jpg','','',750,500,'coffeetablebook10_thumb.jpg',50,50),
	(57,71,'coffeetablebook11.jpg','image/jpeg',88807,'2010-08-14 23:48:14','coffeetablebook_11.jpg','','',750,500,'coffeetablebook11_thumb.jpg',50,50),
	(58,71,'coffeetablebook12.jpg','image/jpeg',79572,'2010-08-14 23:48:14','coffeetablebook_12.jpg','','',750,500,'coffeetablebook12_thumb.jpg',50,50),
	(59,71,'coffeetablebook13.jpg','image/jpeg',77602,'2010-08-14 23:48:15','coffeetablebook_13.jpg','','',750,500,'coffeetablebook13_thumb.jpg',50,50),
	(60,71,'coffeetablebook14.jpg','image/jpeg',70150,'2010-08-14 23:48:15','coffeetablebook_14.jpg','','',750,500,'coffeetablebook14_thumb.jpg',50,50),
	(61,71,'fineartbook01.jpg','image/jpeg',50566,'2010-08-14 23:48:15','fineartbook_01.jpg','','',750,500,'fineartbook01_thumb.jpg',50,50),
	(62,71,'fineartbook02.jpg','image/jpeg',59854,'2010-08-14 23:48:15','fineartbook_02.jpg','','',750,500,'fineartbook02_thumb.jpg',50,50),
	(63,71,'fineartbook03.jpg','image/jpeg',52587,'2010-08-14 23:48:15','fineartbook_03.jpg','','',750,500,'fineartbook03_thumb.jpg',50,50),
	(64,71,'fineartbook04.jpg','image/jpeg',54809,'2010-08-14 23:48:15','fineartbook_04.jpg','','',750,500,'fineartbook04_thumb.jpg',50,50),
	(65,71,'fineartbook05.jpg','image/jpeg',66832,'2010-08-14 23:48:15','fineartbook_05.jpg','','',750,500,'fineartbook05_thumb.jpg',50,50),
	(66,71,'fineartbook06.jpg','image/jpeg',48777,'2010-08-14 23:48:15','fineartbook_06.jpg','','',750,497,'fineartbook06_thumb.jpg',50,50),
	(67,71,'fineartbook07.jpg','image/jpeg',67154,'2010-08-14 23:48:16','fineartbook_07.jpg','','',750,500,'fineartbook07_thumb.jpg',50,50),
	(68,71,'fineartbook08.jpg','image/jpeg',56345,'2010-08-14 23:48:16','fineartbook_08.jpg','','',750,500,'fineartbook08_thumb.jpg',50,50),
	(69,71,'fineartbook09.jpg','image/jpeg',43131,'2010-08-14 23:48:16','fineartbook_09.jpg','','',750,500,'fineartbook09_thumb.jpg',50,50),
	(70,71,'fineartbook10.jpg','image/jpeg',43689,'2010-08-14 23:48:16','fineartbook_10.jpg','','',750,500,'fineartbook10_thumb.jpg',50,50),
	(71,71,'fineartbook11.jpg','image/jpeg',46387,'2010-08-14 23:48:16','fineartbook_11.jpg','','',750,500,'fineartbook11_thumb.jpg',50,50),
	(72,71,'flushmountalbum01.jpg','image/jpeg',46813,'2010-08-14 23:48:16','flushmountalbum_01.jpg','','',750,500,'flushmountalbum01_thumb.jpg',50,50),
	(73,71,'flushmountalbum02.jpg','image/jpeg',41084,'2010-08-14 23:48:16','flushmountalbum_02.jpg','','',750,500,'flushmountalbum02_thumb.jpg',50,50),
	(74,71,'flushmountalbum03.jpg','image/jpeg',57328,'2010-08-14 23:48:16','flushmountalbum_03.jpg','','',750,500,'flushmountalbum03_thumb.jpg',50,50),
	(75,71,'flushmountalbum04.jpg','image/jpeg',75453,'2010-08-14 23:48:17','flushmountalbum_04.jpg','','',750,500,'flushmountalbum04_thumb.jpg',50,50),
	(76,71,'flushmountalbum05.jpg','image/jpeg',41980,'2010-08-14 23:48:17','flushmountalbum_05.jpg','','',750,500,'flushmountalbum05_thumb.jpg',50,50),
	(77,71,'flushmountalbum06.jpg','image/jpeg',51205,'2010-08-14 23:48:17','flushmountalbum_06.jpg','','',750,500,'flushmountalbum06_thumb.jpg',50,50),
	(78,71,'flushmountalbum07.jpg','image/jpeg',40409,'2010-08-14 23:48:17','flushmountalbum_07.jpg','','',750,500,'flushmountalbum07_thumb.jpg',50,50),
	(79,71,'flushmountalbum08.jpg','image/jpeg',44257,'2010-08-14 23:48:17','flushmountalbum_08.jpg','','',750,500,'flushmountalbum08_thumb.jpg',50,50),
	(80,71,'flushmountalbum09.jpg','image/jpeg',61078,'2010-08-14 23:48:17','flushmountalbum_09.jpg','','',750,500,'flushmountalbum09_thumb.jpg',50,50),
	(81,71,'flushmountalbum10.jpg','image/jpeg',58978,'2010-08-14 23:48:17','flushmountalbum_10.jpg','','',750,500,'flushmountalbum10_thumb.jpg',50,50),
	(82,71,'flushmountalbum11.jpg','image/jpeg',49627,'2010-08-14 23:48:17','flushmountalbum_11.jpg','','',750,500,'flushmountalbum11_thumb.jpg',50,50),
	(83,71,'flushmountalbumcase02.jpg','image/jpeg',45686,'2010-08-14 23:48:18','flushmountalbumcase_02.jpg','','',750,500,'flushmountalbumcase02_thumb.jpg',50,50),
	(84,71,'flushmountalbumcase04.jpg','image/jpeg',54431,'2010-08-14 23:48:18','flushmountalbumcase_04.jpg','','',750,500,'flushmountalbumcase04_thumb.jpg',50,50),
	(85,71,'flushmountalbumcase05.jpg','image/jpeg',48043,'2010-08-14 23:48:18','flushmountalbumcase_05.jpg','','',750,500,'flushmountalbumcase05_thumb.jpg',50,50),
	(86,71,'giftcertificate.jpg','image/jpeg',60551,'2010-08-14 23:48:18','giftcertificate.jpg','','',750,500,'giftcertificate_thumb.jpg',50,50),
	(87,71,'giftcertificate02.jpg','image/jpeg',60952,'2010-08-14 23:48:18','giftcertificate02.jpg','','',750,500,'giftcertificate02_thumb.jpg',50,50),
	(88,71,'guestbook01.jpg','image/jpeg',56773,'2010-08-14 23:48:18','guestbook_01.jpg','','',750,500,'guestbook01_thumb.jpg',50,50),
	(89,71,'guestbook02.jpg','image/jpeg',61044,'2010-08-14 23:48:18','guestbook_02.jpg','','',750,500,'guestbook02_thumb.jpg',50,50),
	(90,71,'guestbook03.jpg','image/jpeg',51384,'2010-08-14 23:48:19','guestbook_03.jpg','','',750,500,'guestbook03_thumb.jpg',50,50),
	(91,71,'guestbook04.jpg','image/jpeg',37621,'2010-08-14 23:48:19','guestbook_04.jpg','','',750,500,'guestbook04_thumb.jpg',50,50),
	(92,71,'guestbook05.jpg','image/jpeg',60195,'2010-08-14 23:48:19','guestbook_05.jpg','','',750,500,'guestbook05_thumb.jpg',50,50),
	(93,71,'guestbook06.jpg','image/jpeg',68355,'2010-08-14 23:48:19','guestbook_06.jpg','','',750,500,'guestbook06_thumb.jpg',50,50),
	(94,71,'proofbook01.jpg','image/jpeg',53963,'2010-08-14 23:48:19','proofbook_01.jpg','','',750,500,'proofbook01_thumb.jpg',50,50),
	(95,71,'proofbook02.jpg','image/jpeg',63974,'2010-08-14 23:48:19','proofbook_02.jpg','','',750,500,'proofbook02_thumb.jpg',50,50),
	(96,71,'proofbook03.jpg','image/jpeg',64034,'2010-08-14 23:48:20','proofbook_03.jpg','','',750,500,'proofbook03_thumb.jpg',50,50),
	(97,71,'proofbook04.jpg','image/jpeg',44861,'2010-08-14 23:48:20','proofbook_04.jpg','','',750,500,'proofbook04_thumb.jpg',50,50),
	(98,72,'portraitsfamilies01.jpg','image/jpeg',145437,'2010-08-14 23:48:52','portraits_families_01.jpg','','',1200,800,'portraitsfamilies01_thumb.jpg',50,50),
	(99,72,'portraitsfamilies02.jpg','image/jpeg',194202,'2010-08-14 23:48:52','portraits_families_02.jpg','','',1200,800,'portraitsfamilies02_thumb.jpg',50,50),
	(100,72,'portraitsfamilies03.jpg','image/jpeg',148807,'2010-08-14 23:48:52','portraits_families_03.jpg','','',1080,800,'portraitsfamilies03_thumb.jpg',50,50),
	(101,72,'portraitsfamilies04.jpg','image/jpeg',152029,'2010-08-14 23:48:53','portraits_families_04.jpg','','',1200,800,'portraitsfamilies04_thumb.jpg',50,50),
	(102,72,'portraitsfamilies05.jpg','image/jpeg',155973,'2010-08-14 23:48:53','portraits_families_05.jpg','','',1200,800,'portraitsfamilies05_thumb.jpg',50,50),
	(103,72,'portraitsfamilies06.jpg','image/jpeg',140326,'2010-08-14 23:48:53','portraits_families_06.jpg','','',1200,800,'portraitsfamilies06_thumb.jpg',50,50),
	(104,72,'portraitsfamilies07.jpg','image/jpeg',174082,'2010-08-14 23:48:53','portraits_families_07.jpg','','',1200,800,'portraitsfamilies07_thumb.jpg',50,50),
	(105,72,'portraitsfamilies08.jpg','image/jpeg',166412,'2010-08-14 23:48:53','portraits_families_08.jpg','','',1200,800,'portraitsfamilies08_thumb.jpg',50,50),
	(106,72,'portraitsfamilies09.jpg','image/jpeg',153458,'2010-08-14 23:48:54','portraits_families_09.jpg','','',1200,800,'portraitsfamilies09_thumb.jpg',50,50),
	(107,72,'portraitsfamilies10.jpg','image/jpeg',112022,'2010-08-14 23:48:54','portraits_families_10.jpg','','',1200,800,'portraitsfamilies10_thumb.jpg',50,50),
	(108,72,'portraitsfamilies11.jpg','image/jpeg',170866,'2010-08-14 23:48:54','portraits_families_11.jpg','','',1200,800,'portraitsfamilies11_thumb.jpg',50,50),
	(109,72,'portraitsfamilies12.jpg','image/jpeg',92148,'2010-08-14 23:48:54','portraits_families_12.jpg','','',533,800,'portraitsfamilies12_thumb.jpg',50,50),
	(110,72,'portraitsfamilies13.jpg','image/jpeg',122835,'2010-08-14 23:48:55','portraits_families_13.jpg','','',1200,800,'portraitsfamilies13_thumb.jpg',50,50),
	(111,72,'portraitsfamilies14.jpg','image/jpeg',147708,'2010-08-14 23:48:55','portraits_families_14.jpg','','',540,800,'portraitsfamilies14_thumb.jpg',50,50),
	(112,72,'portraitsfamilies15.jpg','image/jpeg',175745,'2010-08-14 23:48:55','portraits_families_15.jpg','','',1200,800,'portraitsfamilies15_thumb.jpg',50,50),
	(113,72,'portraitsfamilies16.jpg','image/jpeg',154092,'2010-08-14 23:48:55','portraits_families_16.jpg','','',1200,800,'portraitsfamilies16_thumb.jpg',50,50),
	(114,72,'portraitsfamilies17.jpg','image/jpeg',160636,'2010-08-14 23:48:55','portraits_families_17.jpg','','',1200,800,'portraitsfamilies17_thumb.jpg',50,50),
	(115,72,'portraitsfamilies18.jpg','image/jpeg',256586,'2010-08-14 23:48:55','portraits_families_18.jpg','','',1200,800,'portraitsfamilies18_thumb.jpg',50,50),
	(116,72,'portraitsfamilies19.jpg','image/jpeg',96851,'2010-08-14 23:48:56','portraits_families_19.jpg','','',1200,800,'portraitsfamilies19_thumb.jpg',50,50),
	(117,72,'portraitsfamilies21.jpg','image/jpeg',157306,'2010-08-14 23:48:56','portraits_families_21.jpg','','',1200,800,'portraitsfamilies21_thumb.jpg',50,50),
	(118,72,'portraitsfamilies22.jpg','image/jpeg',137485,'2010-08-14 23:48:56','portraits_families_22.jpg','','',1200,800,'portraitsfamilies22_thumb.jpg',50,50),
	(119,72,'portraitsfamilies23.jpg','image/jpeg',96920,'2010-08-14 23:48:56','portraits_families_23.jpg','','',533,800,'portraitsfamilies23_thumb.jpg',50,50),
	(120,72,'portraitsfamilies24.jpg','image/jpeg',147380,'2010-08-14 23:48:56','portraits_families_24.jpg','','',1200,800,'portraitsfamilies24_thumb.jpg',50,50),
	(121,72,'portraitsfamilies25.jpg','image/jpeg',215260,'2010-08-14 23:48:56','portraits_families_25.jpg','','',1200,800,'portraitsfamilies25_thumb.jpg',50,50),
	(122,72,'portraitsfamilies26.jpg','image/jpeg',150061,'2010-08-14 23:48:57','portraits_families_26.jpg','','',1200,800,'portraitsfamilies26_thumb.jpg',50,50),
	(123,72,'portraitsfamilies27.jpg','image/jpeg',127324,'2010-08-14 23:48:57','portraits_families_27.jpg','','',1200,800,'portraitsfamilies27_thumb.jpg',50,50),
	(124,72,'portraitsfamilies28.jpg','image/jpeg',139483,'2010-08-14 23:48:57','portraits_families_28.jpg','','',1200,800,'portraitsfamilies28_thumb.jpg',50,50),
	(125,72,'portraitsfamilies29.jpg','image/jpeg',149085,'2010-08-14 23:48:57','portraits_families_29.jpg','','',1200,800,'portraitsfamilies29_thumb.jpg',50,50),
	(126,72,'portraitsfamilies30.jpg','image/jpeg',147636,'2010-08-14 23:48:58','portraits_families_30.jpg','','',1200,800,'portraitsfamilies30_thumb.jpg',50,50),
	(127,72,'portraitsfamilies31.jpg','image/jpeg',168370,'2010-08-14 23:48:58','portraits_families_31.jpg','','',1200,800,'portraitsfamilies31_thumb.jpg',50,50),
	(128,72,'portraitsfamilies32.jpg','image/jpeg',178864,'2010-08-14 23:48:58','portraits_families_32.jpg','','',533,800,'portraitsfamilies32_thumb.jpg',50,50),
	(129,72,'portraitsfamilies33.jpg','image/jpeg',166182,'2010-08-14 23:48:58','portraits_families_33.jpg','','',1200,800,'portraitsfamilies33_thumb.jpg',50,50),
	(130,72,'portraitsfamilies34.jpg','image/jpeg',217909,'2010-08-14 23:48:59','portraits_families_34.jpg','','',1200,800,'portraitsfamilies34_thumb.jpg',50,50),
	(131,72,'portraitsfamilies35.jpg','image/jpeg',154503,'2010-08-14 23:48:59','portraits_families_35.jpg','','',1200,800,'portraitsfamilies35_thumb.jpg',50,50),
	(132,72,'portraitsfamilies36.jpg','image/jpeg',163923,'2010-08-14 23:48:59','portraits_families_36.jpg','','',1200,800,'portraitsfamilies36_thumb.jpg',50,50),
	(133,72,'portraitsfamilies37.jpg','image/jpeg',113860,'2010-08-14 23:48:59','portraits_families_37.jpg','','',533,800,'portraitsfamilies37_thumb.jpg',50,50),
	(134,72,'portraitsfamilies38.jpg','image/jpeg',133665,'2010-08-14 23:48:59','portraits_families_38.jpg','','',1200,800,'portraitsfamilies38_thumb.jpg',50,50),
	(135,72,'portraitsfamilies39.jpg','image/jpeg',107009,'2010-08-14 23:49:00','portraits_families_39.jpg','','',628,800,'portraitsfamilies39_thumb.jpg',50,50),
	(136,72,'portraitsfamilies40.jpg','image/jpeg',145975,'2010-08-14 23:49:00','portraits_families_40.jpg','','',1200,800,'portraitsfamilies40_thumb.jpg',50,50),
	(137,72,'portraitsfamilies41.jpg','image/jpeg',148042,'2010-08-14 23:49:00','portraits_families_41.jpg','','',662,800,'portraitsfamilies41_thumb.jpg',50,50),
	(138,72,'portraitsfamilies42.jpg','image/jpeg',121659,'2010-08-14 23:49:00','portraits_families_42.jpg','','',1200,800,'portraitsfamilies42_thumb.jpg',50,50),
	(139,72,'portraitsfamilies43.jpg','image/jpeg',175810,'2010-08-14 23:49:01','portraits_families_43.jpg','','',1200,800,'portraitsfamilies43_thumb.jpg',50,50),
	(140,72,'portraitsfamilies44.jpg','image/jpeg',186329,'2010-08-14 23:49:01','portraits_families_44.jpg','','',1200,800,'portraitsfamilies44_thumb.jpg',50,50),
	(141,72,'portraitsfamilies45.jpg','image/jpeg',191876,'2010-08-14 23:49:01','portraits_families_45.jpg','','',1080,800,'portraitsfamilies45_thumb.jpg',50,50),
	(142,72,'portraitsfamilies46.jpg','image/jpeg',180462,'2010-08-14 23:49:01','portraits_families_46.jpg','','',1200,800,'portraitsfamilies46_thumb.jpg',50,50),
	(143,72,'portraitsfamilies48.jpg','image/jpeg',137553,'2010-08-14 23:49:02','portraits_families_48.jpg','','',1200,800,'portraitsfamilies48_thumb.jpg',50,50),
	(144,72,'portraitsfamilies49.jpg','image/jpeg',232230,'2010-08-14 23:49:02','portraits_families_49.jpg','','',1200,800,'portraitsfamilies49_thumb.jpg',50,50),
	(145,72,'portraitsfamilies50.jpg','image/jpeg',261731,'2010-08-14 23:49:02','portraits_families_50.jpg','','',1200,800,'portraitsfamilies50_thumb.jpg',50,50),
	(146,72,'portraitsfamilies51.jpg','image/jpeg',178846,'2010-08-14 23:49:02','portraits_families_51.jpg','','',1200,800,'portraitsfamilies51_thumb.jpg',50,50),
	(147,72,'portraitsfamilies52.jpg','image/jpeg',268274,'2010-08-14 23:49:03','portraits_families_52.jpg','','',1200,800,'portraitsfamilies52_thumb.jpg',50,50),
	(148,72,'portraitsfamilies53.jpg','image/jpeg',217276,'2010-08-14 23:49:03','portraits_families_53.jpg','','',1200,800,'portraitsfamilies53_thumb.jpg',50,50),
	(149,72,'portraitsfamilies54.jpg','image/jpeg',125574,'2010-08-14 23:49:03','portraits_families_54.jpg','','',492,800,'portraitsfamilies54_thumb.jpg',50,50),
	(150,72,'portraitsfamilies55.jpg','image/jpeg',139002,'2010-08-14 23:49:03','portraits_families_55.jpg','','',1200,800,'portraitsfamilies55_thumb.jpg',50,50),
	(151,72,'portraitsindividuals01.jpg','image/jpeg',125423,'2010-08-14 23:49:03','portraits_individuals_01.jpg','','',1200,800,'portraitsindividuals01_thumb.jpg',50,50),
	(152,72,'portraitsindividuals02.jpg','image/jpeg',90469,'2010-08-14 23:49:04','portraits_individuals_02.jpg','','',578,800,'portraitsindividuals02_thumb.jpg',50,50),
	(153,72,'portraitsindividuals03.jpg','image/jpeg',114218,'2010-08-14 23:49:04','portraits_individuals_03.jpg','','',1200,800,'portraitsindividuals03_thumb.jpg',50,50),
	(154,72,'portraitsindividuals04.jpg','image/jpeg',111246,'2010-08-14 23:49:04','portraits_individuals_04.jpg','','',1200,800,'portraitsindividuals04_thumb.jpg',50,50),
	(155,72,'portraitsindividuals05.jpg','image/jpeg',124226,'2010-08-14 23:49:04','portraits_individuals_05.jpg','','',533,800,'portraitsindividuals05_thumb.jpg',50,50),
	(156,72,'portraitsindividuals06.jpg','image/jpeg',174953,'2010-08-14 23:49:05','portraits_individuals_06.jpg','','',1200,800,'portraitsindividuals06_thumb.jpg',50,50),
	(157,72,'portraitsindividuals07.jpg','image/jpeg',109397,'2010-08-14 23:49:05','portraits_individuals_07.jpg','','',1200,800,'portraitsindividuals07_thumb.jpg',50,50),
	(158,72,'portraitsindividuals08.jpg','image/jpeg',142925,'2010-08-14 23:49:05','portraits_individuals_08.jpg','','',1200,800,'portraitsindividuals08_thumb.jpg',50,50),
	(159,72,'portraitsindividuals09.jpg','image/jpeg',130664,'2010-08-14 23:49:05','portraits_individuals_09.jpg','','',1200,800,'portraitsindividuals09_thumb.jpg',50,50),
	(160,72,'portraitsindividuals10.jpg','image/jpeg',140422,'2010-08-14 23:49:05','portraits_individuals_10.jpg','','',533,800,'portraitsindividuals10_thumb.jpg',50,50),
	(161,72,'portraitsindividuals11.jpg','image/jpeg',104620,'2010-08-14 23:49:06','portraits_individuals_11.jpg','','',533,800,'portraitsindividuals11_thumb.jpg',50,50),
	(162,72,'portraitsindividuals12.jpg','image/jpeg',68165,'2010-08-14 23:49:06','portraits_individuals_12.jpg','','',533,800,'portraitsindividuals12_thumb.jpg',50,50),
	(163,72,'portraitsindividuals13.jpg','image/jpeg',168981,'2010-08-14 23:49:06','portraits_individuals_13.jpg','','',533,800,'portraitsindividuals13_thumb.jpg',50,50),
	(164,72,'portraitsindividuals14.jpg','image/jpeg',96669,'2010-08-14 23:49:06','portraits_individuals_14.jpg','','',533,800,'portraitsindividuals14_thumb.jpg',50,50),
	(165,72,'portraitsindividuals15.jpg','image/jpeg',82703,'2010-08-14 23:49:06','portraits_individuals_15.jpg','','',533,800,'portraitsindividuals15_thumb.jpg',50,50),
	(166,72,'portraitsindividuals16.jpg','image/jpeg',122874,'2010-08-14 23:49:07','portraits_individuals_16.jpg','','',1200,800,'portraitsindividuals16_thumb.jpg',50,50),
	(167,72,'portraitsindividuals17.jpg','image/jpeg',275299,'2010-08-14 23:49:07','portraits_individuals_17.jpg','','',1200,800,'portraitsindividuals17_thumb.jpg',50,50),
	(168,72,'portraitsindividuals18.jpg','image/jpeg',135501,'2010-08-14 23:49:07','portraits_individuals_18.jpg','','',1200,800,'portraitsindividuals18_thumb.jpg',50,50),
	(169,72,'portraitsindividuals19.jpg','image/jpeg',138300,'2010-08-14 23:49:07','portraits_individuals_19.jpg','','',1200,800,'portraitsindividuals19_thumb.jpg',50,50),
	(170,72,'portraitsindividuals20.jpg','image/jpeg',142130,'2010-08-14 23:49:08','portraits_individuals_20.jpg','','',1080,800,'portraitsindividuals20_thumb.jpg',50,50),
	(171,72,'portraitsindividuals21.jpg','image/jpeg',284996,'2010-08-14 23:49:08','portraits_individuals_21.jpg','','',1200,800,'portraitsindividuals21_thumb.jpg',50,50),
	(172,72,'portraitsindividuals22.jpg','image/jpeg',124118,'2010-08-14 23:49:08','portraits_individuals_22.jpg','','',1200,800,'portraitsindividuals22_thumb.jpg',50,50),
	(173,72,'portraitsindividuals23.jpg','image/jpeg',164605,'2010-08-14 23:49:08','portraits_individuals_23.jpg','','',1200,800,'portraitsindividuals23_thumb.jpg',50,50),
	(174,72,'portraitsindividuals24.jpg','image/jpeg',95063,'2010-08-14 23:49:09','portraits_individuals_24.jpg','','',533,800,'portraitsindividuals24_thumb.jpg',50,50),
	(175,72,'portraitsindividuals25.jpg','image/jpeg',145685,'2010-08-14 23:49:09','portraits_individuals_25.jpg','','',1200,800,'portraitsindividuals25_thumb.jpg',50,50),
	(176,72,'portraitsindividuals26.jpg','image/jpeg',140138,'2010-08-14 23:49:09','portraits_individuals_26.jpg','','',1200,800,'portraitsindividuals26_thumb.jpg',50,50),
	(177,72,'portraitsindividuals27.jpg','image/jpeg',132964,'2010-08-14 23:49:09','portraits_individuals_27.jpg','','',1200,800,'portraitsindividuals27_thumb.jpg',50,50),
	(178,72,'portraitsindividuals28.jpg','image/jpeg',202624,'2010-08-14 23:49:10','portraits_individuals_28.jpg','','',1200,595,'portraitsindividuals28_thumb.jpg',50,50),
	(179,72,'portraitsindividuals29.jpg','image/jpeg',98490,'2010-08-14 23:49:10','portraits_individuals_29.jpg','','',533,800,'portraitsindividuals29_thumb.jpg',50,50),
	(180,72,'portraitskids01.jpg','image/jpeg',219087,'2010-08-14 23:49:10','portraits_kids_01.jpg','','',1200,800,'portraitskids01_thumb.jpg',50,50),
	(181,72,'portraitskids02.jpg','image/jpeg',124070,'2010-08-14 23:49:10','portraits_kids_02.jpg','','',1200,800,'portraitskids02_thumb.jpg',50,50),
	(182,72,'portraitskids03.jpg','image/jpeg',142758,'2010-08-14 23:49:10','portraits_kids_03.jpg','','',1200,800,'portraitskids03_thumb.jpg',50,50),
	(183,72,'portraitskids04.jpg','image/jpeg',188775,'2010-08-14 23:49:11','portraits_kids_04.jpg','','',1200,800,'portraitskids04_thumb.jpg',50,50),
	(184,72,'portraitskids05.jpg','image/jpeg',97023,'2010-08-14 23:49:11','portraits_kids_05.jpg','','',533,800,'portraitskids05_thumb.jpg',50,50),
	(185,72,'portraitskids06.jpg','image/jpeg',113135,'2010-08-14 23:49:11','portraits_kids_06.jpg','','',533,800,'portraitskids06_thumb.jpg',50,50),
	(186,72,'portraitskids07.jpg','image/jpeg',90202,'2010-08-14 23:49:11','portraits_kids_07.jpg','','',533,800,'portraitskids07_thumb.jpg',50,50),
	(187,72,'portraitskids08.jpg','image/jpeg',180340,'2010-08-14 23:49:11','portraits_kids_08.jpg','','',1200,800,'portraitskids08_thumb.jpg',50,50),
	(188,72,'portraitskids09.jpg','image/jpeg',91391,'2010-08-14 23:49:12','portraits_kids_09.jpg','','',533,800,'portraitskids09_thumb.jpg',50,50),
	(189,72,'portraitskids10.jpg','image/jpeg',113430,'2010-08-14 23:49:12','portraits_kids_10.jpg','','',1200,800,'portraitskids10_thumb.jpg',50,50),
	(190,72,'portraitskids11.jpg','image/jpeg',164219,'2010-08-14 23:49:12','portraits_kids_11.jpg','','',1200,800,'portraitskids11_thumb.jpg',50,50),
	(191,72,'portraitskids12.jpg','image/jpeg',129636,'2010-08-14 23:49:12','portraits_kids_12.jpg','','',1200,800,'portraitskids12_thumb.jpg',50,50),
	(192,72,'portraitskids13.jpg','image/jpeg',143488,'2010-08-14 23:49:13','portraits_kids_13.jpg','','',1200,800,'portraitskids13_thumb.jpg',50,50),
	(193,72,'portraitskids14.jpg','image/jpeg',141275,'2010-08-14 23:49:13','portraits_kids_14.jpg','','',1200,800,'portraitskids14_thumb.jpg',50,50),
	(194,72,'portraitskids15.jpg','image/jpeg',169145,'2010-08-14 23:49:13','portraits_kids_15.jpg','','',1200,800,'portraitskids15_thumb.jpg',50,50),
	(195,72,'portraitskids16.jpg','image/jpeg',129644,'2010-08-14 23:49:13','portraits_kids_16.jpg','','',1200,800,'portraitskids16_thumb.jpg',50,50),
	(196,72,'portraitskids17.jpg','image/jpeg',156318,'2010-08-14 23:49:14','portraits_kids_17.jpg','','',1200,800,'portraitskids17_thumb.jpg',50,50),
	(197,72,'portraitskids18.jpg','image/jpeg',183575,'2010-08-14 23:49:14','portraits_kids_18.jpg','','',1200,800,'portraitskids18_thumb.jpg',50,50),
	(198,72,'portraitskids19.jpg','image/jpeg',170116,'2010-08-14 23:49:14','portraits_kids_19.jpg','','',1200,430,'portraitskids19_thumb.jpg',50,50),
	(199,72,'portraitskids20.jpg','image/jpeg',91888,'2010-08-14 23:49:14','portraits_kids_20.jpg','','',533,800,'portraitskids20_thumb.jpg',50,50),
	(200,72,'portraitskids21.jpg','image/jpeg',108664,'2010-08-14 23:49:14','portraits_kids_21.jpg','','',1200,800,'portraitskids21_thumb.jpg',50,50),
	(201,72,'portraitskids22.jpg','image/jpeg',134182,'2010-08-14 23:49:15','portraits_kids_22.jpg','','',1200,800,'portraitskids22_thumb.jpg',50,50),
	(202,72,'portraitskids23.jpg','image/jpeg',95874,'2010-08-14 23:49:15','portraits_kids_23.jpg','','',533,800,'portraitskids23_thumb.jpg',50,50),
	(203,72,'portraitskids24.jpg','image/jpeg',117573,'2010-08-14 23:49:15','portraits_kids_24.jpg','','',1080,800,'portraitskids24_thumb.jpg',50,50),
	(204,72,'portraitskids25.jpg','image/jpeg',176394,'2010-08-14 23:49:15','portraits_kids_25.jpg','','',1051,800,'portraitskids25_thumb.jpg',50,50),
	(205,72,'portraitskids26.jpg','image/jpeg',114051,'2010-08-14 23:49:15','portraits_kids_26.jpg','','',1200,800,'portraitskids26_thumb.jpg',50,50),
	(206,72,'portraitskids27.jpg','image/jpeg',109277,'2010-08-14 23:49:16','portraits_kids_27.jpg','','',1200,800,'portraitskids27_thumb.jpg',50,50),
	(207,72,'portraitskids28.jpg','image/jpeg',166564,'2010-08-14 23:49:16','portraits_kids_28.jpg','','',1200,800,'portraitskids28_thumb.jpg',50,50),
	(208,72,'portraitskids29.jpg','image/jpeg',113302,'2010-08-14 23:49:16','portraits_kids_29.jpg','','',1200,800,'portraitskids29_thumb.jpg',50,50),
	(209,72,'portraitskids30.jpg','image/jpeg',101979,'2010-08-14 23:49:16','portraits_kids_30.jpg','','',1200,800,'portraitskids30_thumb.jpg',50,50),
	(210,72,'portraitskids31.jpg','image/jpeg',117568,'2010-08-14 23:49:17','portraits_kids_31.jpg','','',533,800,'portraitskids31_thumb.jpg',50,50),
	(211,72,'portraitskids32.jpg','image/jpeg',159843,'2010-08-14 23:49:17','portraits_kids_32.jpg','','',1200,800,'portraitskids32_thumb.jpg',50,50),
	(212,72,'portraitskids33.jpg','image/jpeg',152564,'2010-08-14 23:49:17','portraits_kids_33.jpg','','',1200,800,'portraitskids33_thumb.jpg',50,50),
	(213,72,'portraitskids34.jpg','image/jpeg',120976,'2010-08-14 23:49:17','portraits_kids_34.jpg','','',533,800,'portraitskids34_thumb.jpg',50,50),
	(214,72,'portraitskids35.jpg','image/jpeg',116720,'2010-08-14 23:49:18','portraits_kids_35.jpg','','',1200,800,'portraitskids35_thumb.jpg',50,50),
	(215,72,'portraitskids36.jpg','image/jpeg',95874,'2010-08-14 23:49:18','portraits_kids_36.jpg','','',533,800,'portraitskids36_thumb.jpg',50,50),
	(216,72,'portraitskids37.jpg','image/jpeg',131657,'2010-08-14 23:49:18','portraits_kids_37.jpg','','',1200,800,'portraitskids37_thumb.jpg',50,50),
	(217,72,'portraitskids38.jpg','image/jpeg',164405,'2010-08-14 23:49:18','portraits_kids_38.jpg','','',1200,800,'portraitskids38_thumb.jpg',50,50),
	(218,72,'portraitskids39.jpg','image/jpeg',115244,'2010-08-14 23:49:18','portraits_kids_39.jpg','','',533,800,'portraitskids39_thumb.jpg',50,50),
	(219,72,'portraitskids40.jpg','image/jpeg',93955,'2010-08-14 23:49:19','portraits_kids_40.jpg','','',1200,800,'portraitskids40_thumb.jpg',50,50),
	(220,72,'portraitskids41.jpg','image/jpeg',170552,'2010-08-14 23:49:19','portraits_kids_41.jpg','','',1200,800,'portraitskids41_thumb.jpg',50,50),
	(221,72,'portraitskids42.jpg','image/jpeg',169180,'2010-08-14 23:49:19','portraits_kids_42.jpg','','',1200,800,'portraitskids42_thumb.jpg',50,50),
	(222,72,'portraitskids43.jpg','image/jpeg',133411,'2010-08-14 23:49:20','portraits_kids_43.jpg','','',1200,800,'portraitskids43_thumb.jpg',50,50),
	(223,72,'portraitskids45.jpg','image/jpeg',77913,'2010-08-14 23:49:20','portraits_kids_45.jpg','','',533,800,'portraitskids45_thumb.jpg',50,50),
	(224,72,'portraitskids46.jpg','image/jpeg',121029,'2010-08-14 23:49:20','portraits_kids_46.jpg','','',1200,800,'portraitskids46_thumb.jpg',50,50),
	(225,72,'portraitskids47.jpg','image/jpeg',295381,'2010-08-14 23:49:20','portraits_kids_47.jpg','','',1200,800,'portraitskids47_thumb.jpg',50,50),
	(226,72,'portraitskids48.jpg','image/jpeg',165659,'2010-08-14 23:49:20','portraits_kids_48.jpg','','',1200,800,'portraitskids48_thumb.jpg',50,50),
	(227,72,'portraitskids49.jpg','image/jpeg',109773,'2010-08-14 23:49:21','portraits_kids_49.jpg','','',1200,800,'portraitskids49_thumb.jpg',50,50),
	(228,72,'portraitskids50.jpg','image/jpeg',274009,'2010-08-14 23:49:21','portraits_kids_50.jpg','','',1200,800,'portraitskids50_thumb.jpg',50,50),
	(229,72,'portraitskids51.jpg','image/jpeg',123086,'2010-08-14 23:49:21','portraits_kids_51.jpg','','',1200,800,'portraitskids51_thumb.jpg',50,50),
	(230,72,'portraitskids52.jpg','image/jpeg',166770,'2010-08-14 23:49:21','portraits_kids_52.jpg','','',1200,800,'portraitskids52_thumb.jpg',50,50),
	(231,72,'portraitspets01.jpg','image/jpeg',181317,'2010-08-14 23:49:21','portraits_pets_01.jpg','','',1200,800,'portraitspets01_thumb.jpg',50,50),
	(232,72,'portraitspets02.jpg','image/jpeg',132400,'2010-08-14 23:49:22','portraits_pets_02.jpg','','',1080,800,'portraitspets02_thumb.jpg',50,50),
	(233,72,'portraitspets03.jpg','image/jpeg',174452,'2010-08-14 23:49:22','portraits_pets_03.jpg','','',1200,800,'portraitspets03_thumb.jpg',50,50),
	(234,72,'portraitspets04.jpg','image/jpeg',124021,'2010-08-14 23:49:22','portraits_pets_04.jpg','','',1200,800,'portraitspets04_thumb.jpg',50,50),
	(235,72,'portraitspets05.jpg','image/jpeg',108116,'2010-08-14 23:49:22','portraits_pets_05.jpg','','',533,800,'portraitspets05_thumb.jpg',50,50),
	(236,72,'portraitspets06.jpg','image/jpeg',139442,'2010-08-14 23:49:23','portraits_pets_06.jpg','','',1200,800,'portraitspets06_thumb.jpg',50,50),
	(237,72,'portraitspets07.jpg','image/jpeg',157189,'2010-08-14 23:49:23','portraits_pets_07.jpg','','',1200,800,'portraitspets07_thumb.jpg',50,50),
	(238,72,'portraitspets08.jpg','image/jpeg',135640,'2010-08-14 23:49:23','portraits_pets_08.jpg','','',1080,800,'portraitspets08_thumb.jpg',50,50),
	(239,72,'portraitspets09.jpg','image/jpeg',173187,'2010-08-14 23:49:23','portraits_pets_09.jpg','','',1200,800,'portraitspets09_thumb.jpg',50,50),
	(240,72,'portraitspets10.jpg','image/jpeg',119180,'2010-08-14 23:49:23','portraits_pets_10.jpg','','',1080,800,'portraitspets10_thumb.jpg',50,50),
	(241,72,'portraitspets11.jpg','image/jpeg',164009,'2010-08-14 23:49:24','portraits_pets_11.jpg','','',1200,800,'portraitspets11_thumb.jpg',50,50),
	(242,72,'portraitspets12.jpg','image/jpeg',85101,'2010-08-14 23:49:24','portraits_pets_12.jpg','','',533,800,'portraitspets12_thumb.jpg',50,50),
	(243,72,'portraitspets13.jpg','image/jpeg',170017,'2010-08-14 23:49:24','portraits_pets_13.jpg','','',1200,800,'portraitspets13_thumb.jpg',50,50),
	(244,72,'portraitspets14.jpg','image/jpeg',161087,'2010-08-14 23:49:24','portraits_pets_14.jpg','','',533,800,'portraitspets14_thumb.jpg',50,50),
	(245,72,'portraitspets15.jpg','image/jpeg',133174,'2010-08-14 23:49:25','portraits_pets_15.jpg','','',1080,800,'portraitspets15_thumb.jpg',50,50),
	(246,72,'portraitspets16.jpg','image/jpeg',175915,'2010-08-14 23:49:25','portraits_pets_16.jpg','','',1200,800,'portraitspets16_thumb.jpg',50,50),
	(247,72,'portraitspets17.jpg','image/jpeg',94219,'2010-08-14 23:49:25','portraits_pets_17.jpg','','',533,800,'portraitspets17_thumb.jpg',50,50),
	(248,72,'portraitspets18.jpg','image/jpeg',144226,'2010-08-14 23:49:25','portraits_pets_18.jpg','','',1080,800,'portraitspets18_thumb.jpg',50,50),
	(249,72,'portraitspets19.jpg','image/jpeg',114985,'2010-08-14 23:49:25','portraits_pets_19.jpg','','',536,800,'portraitspets19_thumb.jpg',50,50),
	(250,72,'portraitspets20.jpg','image/jpeg',165262,'2010-08-14 23:49:26','portraits_pets_20.jpg','','',1200,800,'portraitspets20_thumb.jpg',50,50),
	(251,72,'portraitspets21.jpg','image/jpeg',125047,'2010-08-14 23:49:26','portraits_pets_21.jpg','','',1200,800,'portraitspets21_thumb.jpg',50,50),
	(252,72,'portraitspets22.jpg','image/jpeg',142089,'2010-08-14 23:49:26','portraits_pets_22.jpg','','',1200,800,'portraitspets22_thumb.jpg',50,50),
	(253,72,'portraitspets23.jpg','image/jpeg',105184,'2010-08-14 23:49:26','portraits_pets_23.jpg','','',533,800,'portraitspets23_thumb.jpg',50,50),
	(254,72,'portraitspets24.jpg','image/jpeg',188976,'2010-08-14 23:49:27','portraits_pets_24.jpg','','',1200,800,'portraitspets24_thumb.jpg',50,50),
	(255,72,'portraitspets25.jpg','image/jpeg',109867,'2010-08-14 23:49:27','portraits_pets_25.jpg','','',1200,800,'portraitspets25_thumb.jpg',50,50),
	(256,72,'portraitspets26.jpg','image/jpeg',189577,'2010-08-14 23:49:27','portraits_pets_26.jpg','','',1200,800,'portraitspets26_thumb.jpg',50,50),
	(257,72,'portraitspets27.jpg','image/jpeg',124108,'2010-08-14 23:49:27','portraits_pets_27.jpg','','',1200,800,'portraitspets27_thumb.jpg',50,50),
	(258,72,'portraitspets28.jpg','image/jpeg',166968,'2010-08-14 23:49:27','portraits_pets_28.jpg','','',1200,800,'portraitspets28_thumb.jpg',50,50),
	(259,72,'portraitspets29.jpg','image/jpeg',349222,'2010-08-14 23:49:28','portraits_pets_29.jpg','','',1200,800,'portraitspets29_thumb.jpg',50,50),
	(260,72,'portraitsseniors001.jpg','image/jpeg',130664,'2010-08-14 23:49:28','portraits_seniors_001.jpg','','',1200,800,'portraitsseniors001_thumb.jpg',50,50),
	(261,72,'portraitsseniors002.jpg','image/jpeg',133664,'2010-08-14 23:49:28','portraits_seniors_002.jpg','','',1200,800,'portraitsseniors002_thumb.jpg',50,50),
	(262,72,'portraitsseniors003.jpg','image/jpeg',168981,'2010-08-14 23:49:28','portraits_seniors_003.jpg','','',533,800,'portraitsseniors003_thumb.jpg',50,50),
	(263,72,'portraitsseniors004.jpg','image/jpeg',161382,'2010-08-14 23:49:29','portraits_seniors_004.jpg','','',1200,800,'portraitsseniors004_thumb.jpg',50,50),
	(264,72,'portraitsseniors005.jpg','image/jpeg',142925,'2010-08-14 23:49:29','portraits_seniors_005.jpg','','',1200,800,'portraitsseniors005_thumb.jpg',50,50),
	(265,72,'portraitsseniors006.jpg','image/jpeg',185886,'2010-08-14 23:49:29','portraits_seniors_006.jpg','','',1200,800,'portraitsseniors006_thumb.jpg',50,50),
	(266,72,'portraitsseniors007.jpg','image/jpeg',197361,'2010-08-14 23:49:29','portraits_seniors_007.jpg','','',1200,800,'portraitsseniors007_thumb.jpg',50,50),
	(267,72,'portraitsseniors008.jpg','image/jpeg',132603,'2010-08-14 23:49:30','portraits_seniors_008.jpg','','',1200,800,'portraitsseniors008_thumb.jpg',50,50),
	(268,72,'portraitsseniors009.jpg','image/jpeg',146469,'2010-08-14 23:49:30','portraits_seniors_009.jpg','','',533,800,'portraitsseniors009_thumb.jpg',50,50),
	(269,72,'portraitsseniors010.jpg','image/jpeg',232721,'2010-08-14 23:49:30','portraits_seniors_010.jpg','','',1200,800,'portraitsseniors010_thumb.jpg',50,50),
	(270,72,'portraitsseniors011.jpg','image/jpeg',96669,'2010-08-14 23:49:30','portraits_seniors_011.jpg','','',533,800,'portraitsseniors011_thumb.jpg',50,50),
	(271,72,'portraitsseniors012.jpg','image/jpeg',99250,'2010-08-14 23:49:30','portraits_seniors_012.jpg','','',1200,800,'portraitsseniors012_thumb.jpg',50,50),
	(272,72,'portraitsseniors013.jpg','image/jpeg',82703,'2010-08-14 23:49:31','portraits_seniors_013.jpg','','',533,800,'portraitsseniors013_thumb.jpg',50,50),
	(273,72,'portraitsseniors014.jpg','image/jpeg',133346,'2010-08-14 23:49:31','portraits_seniors_014.jpg','','',533,800,'portraitsseniors014_thumb.jpg',50,50),
	(274,72,'portraitsseniors015.jpg','image/jpeg',135501,'2010-08-14 23:49:31','portraits_seniors_015.jpg','','',1200,800,'portraitsseniors015_thumb.jpg',50,50),
	(275,72,'portraitsseniors016.jpg','image/jpeg',114123,'2010-08-14 23:49:31','portraits_seniors_016.jpg','','',1200,800,'portraitsseniors016_thumb.jpg',50,50),
	(276,72,'portraitsseniors017.jpg','image/jpeg',144781,'2010-08-14 23:49:31','portraits_seniors_017.jpg','','',533,800,'portraitsseniors017_thumb.jpg',50,50),
	(277,72,'portraitsseniors018.jpg','image/jpeg',124226,'2010-08-14 23:49:32','portraits_seniors_018.jpg','','',533,800,'portraitsseniors018_thumb.jpg',50,50),
	(278,72,'portraitsseniors019.jpg','image/jpeg',140422,'2010-08-14 23:49:32','portraits_seniors_019.jpg','','',533,800,'portraitsseniors019_thumb.jpg',50,50),
	(279,72,'portraitsseniors020.jpg','image/jpeg',123349,'2010-08-14 23:49:32','portraits_seniors_020.jpg','','',533,800,'portraitsseniors020_thumb.jpg',50,50),
	(280,72,'portraitsseniors021.jpg','image/jpeg',186326,'2010-08-14 23:49:32','portraits_seniors_021.jpg','','',533,800,'portraitsseniors021_thumb.jpg',50,50),
	(281,72,'portraitsseniors022.jpg','image/jpeg',124190,'2010-08-14 23:49:32','portraits_seniors_022.jpg','','',1200,800,'portraitsseniors022_thumb.jpg',50,50),
	(282,72,'portraitsseniors023.jpg','image/jpeg',182982,'2010-08-14 23:49:33','portraits_seniors_023.jpg','','',1200,800,'portraitsseniors023_thumb.jpg',50,50),
	(283,72,'portraitsseniors024.jpg','image/jpeg',146426,'2010-08-14 23:49:33','portraits_seniors_024.jpg','','',1200,800,'portraitsseniors024_thumb.jpg',50,50),
	(284,72,'portraitsseniors025.jpg','image/jpeg',159335,'2010-08-14 23:49:33','portraits_seniors_025.jpg','','',1200,800,'portraitsseniors025_thumb.jpg',50,50),
	(285,72,'portraitsseniors026.jpg','image/jpeg',63232,'2010-08-14 23:49:33','portraits_seniors_026.jpg','','',533,800,'portraitsseniors026_thumb.jpg',50,50),
	(286,72,'portraitsseniors027.jpg','image/jpeg',173379,'2010-08-14 23:49:34','portraits_seniors_027.jpg','','',1200,800,'portraitsseniors027_thumb.jpg',50,50),
	(287,72,'portraitsseniors028.jpg','image/jpeg',152277,'2010-08-14 23:49:34','portraits_seniors_028.jpg','','',1200,800,'portraitsseniors028_thumb.jpg',50,50),
	(288,72,'portraitsseniors029.jpg','image/jpeg',175263,'2010-08-14 23:49:34','portraits_seniors_029.jpg','','',1200,800,'portraitsseniors029_thumb.jpg',50,50),
	(289,72,'portraitsseniors030.jpg','image/jpeg',82789,'2010-08-14 23:49:34','portraits_seniors_030.jpg','','',533,800,'portraitsseniors030_thumb.jpg',50,50),
	(290,72,'portraitsseniors031.jpg','image/jpeg',170857,'2010-08-14 23:49:34','portraits_seniors_031.jpg','','',1200,800,'portraitsseniors031_thumb.jpg',50,50),
	(291,72,'portraitsseniors032.jpg','image/jpeg',67554,'2010-08-14 23:49:34','portraits_seniors_032.jpg','','',533,800,'portraitsseniors032_thumb.jpg',50,50),
	(292,72,'portraitsseniors033.jpg','image/jpeg',149638,'2010-08-14 23:49:35','portraits_seniors_033.jpg','','',1200,800,'portraitsseniors033_thumb.jpg',50,50),
	(293,72,'portraitsseniors034.jpg','image/jpeg',148103,'2010-08-14 23:49:35','portraits_seniors_034.jpg','','',1200,800,'portraitsseniors034_thumb.jpg',50,50),
	(294,72,'portraitsseniors035.jpg','image/jpeg',126206,'2010-08-14 23:49:35','portraits_seniors_035.jpg','','',1200,800,'portraitsseniors035_thumb.jpg',50,50),
	(295,72,'portraitsseniors036.jpg','image/jpeg',151958,'2010-08-14 23:49:36','portraits_seniors_036.jpg','','',533,800,'portraitsseniors036_thumb.jpg',50,50),
	(296,72,'portraitsseniors037.jpg','image/jpeg',157298,'2010-08-14 23:49:36','portraits_seniors_037.jpg','','',1200,800,'portraitsseniors037_thumb.jpg',50,50),
	(297,72,'portraitsseniors038.jpg','image/jpeg',61222,'2010-08-14 23:49:36','portraits_seniors_038.jpg','','',533,800,'portraitsseniors038_thumb.jpg',50,50),
	(298,72,'portraitsseniors039.jpg','image/jpeg',75193,'2010-08-14 23:49:36','portraits_seniors_039.jpg','','',533,800,'portraitsseniors039_thumb.jpg',50,50),
	(299,72,'portraitsseniors040.jpg','image/jpeg',182776,'2010-08-14 23:49:36','portraits_seniors_040.jpg','','',1200,800,'portraitsseniors040_thumb.jpg',50,50),
	(300,72,'portraitsseniors041.jpg','image/jpeg',106199,'2010-08-14 23:49:37','portraits_seniors_041.jpg','','',533,800,'portraitsseniors041_thumb.jpg',50,50),
	(301,72,'portraitsseniors042.jpg','image/jpeg',164760,'2010-08-14 23:49:37','portraits_seniors_042.jpg','','',1200,800,'portraitsseniors042_thumb.jpg',50,50),
	(302,72,'portraitsseniors043.jpg','image/jpeg',161738,'2010-08-14 23:49:37','portraits_seniors_043.jpg','','',571,800,'portraitsseniors043_thumb.jpg',50,50);

/*!40000 ALTER TABLE `athena_4_Media` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_PageParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_PageParas`;

CREATE TABLE `athena_4_PageParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `theme_para_id` int(11) default NULL,
  `para_value` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_4_Pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_Pages`;

CREATE TABLE `athena_4_Pages` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `parent_page_id` int(11) default '0',
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  `is_homepage` tinyint(1) default '0',
  `page_order` tinyint(3) default '0',
  `is_blogpage` tinyint(1) default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_4_Pages` WRITE;
/*!40000 ALTER TABLE `athena_4_Pages` DISABLE KEYS */;
INSERT INTO `athena_4_Pages` (`id`,`user_id`,`content`,`status`,`last_edit`,`parent_page_id`,`title`,`slug`,`path`,`created`,`template`,`is_homepage`,`page_order`,`is_blogpage`)
VALUES
	(9,1,'','Draft','2010-08-15 00:36:06',0,'HOME','HOME.html','/','2010-08-09 21:34:34','homepage.php',1,0,0),
	(10,1,'','Draft','2010-08-15 00:34:07',0,'PORTRAITS','PORTRAITS.html','/','2010-08-09 21:34:40','gallerypage.php',0,0,0),
	(11,1,'<p>FIH d FIH d FIH g FIH g FIH g FIH</p>','Draft','2010-08-15 00:33:59',10,'Gallery 1','Gallery1.html','/portraits/','2010-08-09 21:35:18','gallerypage.php',0,0,0),
	(12,1,'<p>Tet gallery</p>','Draft','2010-08-15 00:34:03',10,'Gallery 2','Gallery2.html','/portraits/','2010-08-09 21:35:18','gallerypage.php',0,0,0),
	(13,1,'','Draft','2010-08-15 00:36:14',0,'WEDDINGS','WEDDINGS.html','/','2010-08-09 21:35:50','gallerypage.php',0,0,0),
	(14,1,'','Draft','2010-08-15 00:36:17',13,'Wedding gallery 1','Weddinggallery1.html','/weddings/','2010-08-09 21:36:29','gallerypage.php',0,0,0),
	(15,1,'','Draft','2010-08-15 00:36:20',13,'Wedding gallery 2','Weddinggallery2.html','/weddings/','2010-08-09 21:36:29','gallerypage.php',0,0,0),
	(16,1,'','Draft','2010-08-15 00:36:25',13,'Wedding gallery 3','Weddinggallery3.html','/weddings/','2010-08-09 21:36:29','gallerypage.php',0,0,0),
	(17,1,'','Draft','2010-08-09 21:36:29',0,'INFORMATION','INFORMATION.html','/','2010-08-09 21:36:29','0',0,0,0),
	(18,1,'','Published','2010-08-19 20:18:20',0,'BLOG','blog.html','/','2010-08-17 05:13:53','blogpage.php',0,5,1);

/*!40000 ALTER TABLE `athena_4_Pages` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_PageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_PageViews`;

CREATE TABLE `athena_4_PageViews` (
  `page_id` bigint(20) default NULL,
  `view_date` datetime default NULL,
  `ip_long` bigint(20) default NULL,
  `is_bot` tinyint(1) default '0',
  `browser` varchar(25) default NULL,
  `browser_ver` varchar(8) default NULL,
  `os_name` varchar(25) default NULL,
  `os_ver` varchar(8) default NULL,
  `referer` varchar(255) default NULL,
  `user_agent` varchar(255) default NULL,
  `server_ip` bigint(20) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_4_PostCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_PostCategories`;

CREATE TABLE `athena_4_PostCategories` (
  `id` int(11) NOT NULL auto_increment,
  `category` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_4_PostCategories` WRITE;
/*!40000 ALTER TABLE `athena_4_PostCategories` DISABLE KEYS */;
INSERT INTO `athena_4_PostCategories` (`id`,`category`)
VALUES
	(2,'cat1'),
	(3,'cat2'),
	(4,'cat');

/*!40000 ALTER TABLE `athena_4_PostCategories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_Posts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_Posts`;

CREATE TABLE `athena_4_Posts` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `canComment` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_4_Posts` WRITE;
/*!40000 ALTER TABLE `athena_4_Posts` DISABLE KEYS */;
INSERT INTO `athena_4_Posts` (`id`,`user_id`,`content`,`status`,`last_edit`,`created`,`title`,`slug`,`path`,`canComment`)
VALUES
	(2,1,'<p align=\\\"center\\\"><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354746_EbRMc-O.jpg\\\" /><br />Courtney<br />Colorado Springs<br />August 18, 2010</p><p>Yesterday evening I met with Courtney for her senior portrait session in Palmer Park. After a few pictures in the park, we headed to downtown Colorado Springs to continue her portraits as the sun set. It was the best of both sides of Colorado Springs &ndash; nature and city!</p><p>&nbsp;</p><p align=\\\"center\\\"><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354893_EmwiR-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354867_368xG-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354858_ZfqiL-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354852_EnaVa-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354833_V6GQu-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354823_eaBE9-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354817_zRCPi-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354808_KzSZX-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354792_FzxeG-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354789_5Bvia-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354776_aQT6K-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354761_uU9t6-O-1.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354733_8FZyP-O.jpg\\\" /></p><p><img border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/975354718_nPtso-O.jpg\\\" /></p>','Draft','2010-08-19 20:36:30','2010-08-19 19:20:25','Courtney: Senior portraits in Colorado Springs','courtney-senior-portraits-in-colorado-springs.html','/19/Aug/2010/',1),
	(3,1,'<p align=\\\"center\\\"><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442412_BfJBx-O.jpg\\\" /><br />Jeff and Danielle<br />Wild Basin Lodge<br />Allenspark, Colorado<br />August 14, 2010</p><p>Saturday was the perfect day for a mountain wedding, and the Wild Basin Lodge is a gem. Danielle and Jeff got married there alongside a stream, and then celebrated with a dinner for 40 of their closest friends. I loved how the wedding preparations were a group effort &mdash; the cake, flowers, music, and decor were all created by their friends and family.</p><p>The staff at Wild Basin Lodge were excellent to work with, and took great care of Jesse and me. They even offered to accommodate any of our dietary restrictions or allergies, which is a rare treat for wedding vendors. I was truly impressed by the level of their service. Highly recommended.</p><p>&nbsp;</p><p align=\\\"center\\\"><img alt=\\\"Wild Basin Lodge river\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442430_vWVdJ-O.jpg\\\" /><br />The venue sits alongside a mountain stream. (Photo by Jesse)</p><p><img alt=\\\"Hummingbird and bee\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442466_DjBRH-O.jpg\\\" /></p><p><img alt=\\\"Wild Basin Lodge\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442481_GvKqu-O.jpg\\\" /><br />Danielle and the ladies spent the first part of the day getting their makeup done on their balcony.</p><p><img alt=\\\"Wild Basin Lodge mountains\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442505_BW5Jf-O.jpg\\\" /><br />The view from the balcony</p><p><img alt=\\\"Bride getting ready\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442526_ioyvx-O.jpg\\\" /></p><p><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442547_pesTH-O-1.jpg\\\" /><br />Danielle had propped a photo of Jeff on her mirror to keep her company as she got ready.</p><p><img alt=\\\"Flower girl getting ready\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442561_whng5-O.jpg\\\" /><br />Flower girl Gracie on her tip toes.</p><p><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442576_jAB7A-O.jpg\\\" /></p><p><img alt=\\\"Bride at Wild Basin Lodge\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442609_px4op-O.jpg\\\" /></p><p><img alt=\\\"Necklace on bridal bouquet\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442633_dMrU3-O.jpg\\\" /><br />Danielle carried her grandmother&rsquo;s necklace around the base of her bouquet of lilies.</p><p><img alt=\\\"Groom getting ready\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442563_Jpw7V-O.jpg\\\" /><br />Meanwhile, Jeff and the guys got ready in a nearby cabin. (Photo by Jesse)</p><p><img alt=\\\"Groom\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442643_AtCzN-O.jpg\\\" /></p><p><img alt=\\\"Groom with dogs\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442649_frkJ4-O.jpg\\\" /><br />Yogi and Rudy got dressed up for the occasion.</p><p><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442677_2gcd4-O-2.jpg\\\" /><br />A photo of Danielle&rsquo;s recently deceased father stood in the chair that would have been his. Danielle&rsquo;s brother walked her down the aisle.</p><p><img alt=\\\"Wild Basin Lodge wedding\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442689_tK3nu-O.jpg\\\" /><br />The ceremony took place in an amphitheater along the river.</p><p><img alt=\\\"Flower girl in brown dress\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442718_52v6n-O.jpg\\\" /><br />The adorable flower girl wore a brown dress and a pale pink floral headband.</p><p><img alt=\\\"Wild Basin Lodge wedding\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442726_3FM5A-O.jpg\\\" /></p><p><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442742_7As9x-O.jpg\\\" /></p><p><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442758_o8vuB-O.jpg\\\" /></p><p><img alt=\\\"Bride and groom in aspen trees\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442789_6tgiy-O.jpg\\\" /></p><p><img alt=\\\"Red wedding reception\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442809_L5923-O.jpg\\\" /><br />The reception was arranged with two long tables that joined at a sweetheart table in the middle.</p><p><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442861_aFZdd-O.jpg\\\" /><br />The entire meal was vegetarian! I&rsquo;m not usually able to try a little bit of everything, but this time I did, and it was delicious!</p><p><img alt=\\\"First dance\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442845_dfPav-O.jpg\\\" /><br />First dance</p><p><img alt=\\\"\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442853_ty5Da-O.jpg\\\" /></p><p><img alt=\\\"Wild Basin Lodge\\\" border=\\\"1\\\" src=\\\"http://galleries.charlottegeary.com/photos/972442874_mtkYj-O.jpg\\\" /></p><p>Photographer: <a href=\\\"http://www.charlottegeary.com\\\">Charlotte Geary</a><br />Second photographer: <a href=\\\"http://www.jessestarrphotography.com/\\\">Jesse Starr</a><br />Venue: <a href=\\\"http://www.wildbasinlodge.com/\\\">Wild Basin Lodge</a></p>','Draft','2010-08-19 20:36:28','2010-08-19 19:20:26','Danielle and Jeff: Wild Basin Lodge wedding','danielle-and-jeff-wild-basin-lodge-wedding.html','/19/Aug/2010/',1);

/*!40000 ALTER TABLE `athena_4_Posts` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_PostTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_PostTags`;

CREATE TABLE `athena_4_PostTags` (
  `id` int(11) NOT NULL auto_increment,
  `tag` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_4_PostTags` WRITE;
/*!40000 ALTER TABLE `athena_4_PostTags` DISABLE KEYS */;
INSERT INTO `athena_4_PostTags` (`id`,`tag`)
VALUES
	(2,'tag1'),
	(3,'tag2'),
	(4,'tag3');

/*!40000 ALTER TABLE `athena_4_PostTags` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_PostToCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_PostToCategories`;

CREATE TABLE `athena_4_PostToCategories` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `category_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_4_PostToCategories` WRITE;
/*!40000 ALTER TABLE `athena_4_PostToCategories` DISABLE KEYS */;
INSERT INTO `athena_4_PostToCategories` (`id`,`post_id`,`category_id`)
VALUES
	(2,2,2),
	(3,2,3),
	(4,3,4);

/*!40000 ALTER TABLE `athena_4_PostToCategories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_PostToTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_PostToTags`;

CREATE TABLE `athena_4_PostToTags` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `tag_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_4_PostToTags` WRITE;
/*!40000 ALTER TABLE `athena_4_PostToTags` DISABLE KEYS */;
INSERT INTO `athena_4_PostToTags` (`id`,`post_id`,`tag_id`)
VALUES
	(2,2,2),
	(3,2,3),
	(4,2,4),
	(5,3,2),
	(6,3,4);

/*!40000 ALTER TABLE `athena_4_PostToTags` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_4_RollupBrowser
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_RollupBrowser`;

CREATE TABLE `athena_4_RollupBrowser` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `browser` varchar(30) default NULL,
  `browser_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_4_RollupCrawler
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_RollupCrawler`;

CREATE TABLE `athena_4_RollupCrawler` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `crawler` varchar(25) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_4_RollupOS
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_RollupOS`;

CREATE TABLE `athena_4_RollupOS` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `os_name` varchar(30) default NULL,
  `os_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_4_RollupPageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_RollupPageViews`;

CREATE TABLE `athena_4_RollupPageViews` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `page_views` int(11) default NULL,
  `unique_visitors` int(11) default NULL,
  `keywords` text,
  `page_title` varchar(125) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_5_BlogFollowers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_BlogFollowers`;

CREATE TABLE `athena_5_BlogFollowers` (
  `id` int(11) NOT NULL auto_increment,
  `isFollowing` tinyint(1) default '0',
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_5_Comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_Comments`;

CREATE TABLE `athena_5_Comments` (
  `id` int(11) NOT NULL auto_increment,
  `content` text,
  `status` enum('Pending','Published','Trash','Spam','PossibleSpam') default 'Pending',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `blog_follower_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_5_Folders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_Folders`;

CREATE TABLE `athena_5_Folders` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) default 'Unamed Folder',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_5_Folders` WRITE;
/*!40000 ALTER TABLE `athena_5_Folders` DISABLE KEYS */;
INSERT INTO `athena_5_Folders` (`id`,`name`)
VALUES
	(2,'Reserved (Last 24 hours))'),
	(3,'Reserved (Last 7 days)'),
	(4,'Reserved (last 1 day)'),
	(5,'Reserved'),
	(6,'Reserved'),
	(7,'Reserved'),
	(8,'Reserved'),
	(9,'Reserved'),
	(68,'gallery 1');

/*!40000 ALTER TABLE `athena_5_Folders` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_5_GalleryMeta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_GalleryMeta`;

CREATE TABLE `athena_5_GalleryMeta` (
  `id` int(11) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `gallery_number` tinyint(2) default '0',
  `title` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `image_id` bigint(20) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_5_GalleryTable
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_GalleryTable`;

CREATE TABLE `athena_5_GalleryTable` (
  `id` bigint(20) NOT NULL auto_increment,
  `image_id` bigint(20) default NULL,
  `page_id` bigint(20) default NULL,
  `slot_number` tinyint(3) default NULL,
  `gallery_number` tinyint(2) default '0',
  `theme_para_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_5_GalleryTable` WRITE;
/*!40000 ALTER TABLE `athena_5_GalleryTable` DISABLE KEYS */;
INSERT INTO `athena_5_GalleryTable` (`id`,`image_id`,`page_id`,`slot_number`,`gallery_number`,`theme_para_id`)
VALUES
	(1,1,9,0,1,202),
	(2,2,9,1,1,202),
	(3,3,9,2,1,202),
	(4,6,15,0,1,201),
	(5,7,15,1,1,201),
	(6,8,15,2,1,201),
	(7,9,15,3,1,201),
	(8,10,15,4,1,201);

/*!40000 ALTER TABLE `athena_5_GalleryTable` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_5_GlobalParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_GlobalParas`;

CREATE TABLE `athena_5_GlobalParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `para_value` varchar(255) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_5_Media
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_Media`;

CREATE TABLE `athena_5_Media` (
  `id` bigint(20) NOT NULL auto_increment,
  `folder_id` int(11) default '1',
  `filename` varchar(255) default NULL,
  `mime_type` varchar(20) default NULL,
  `file_size` int(11) default NULL,
  `created` timestamp NULL default NULL on update CURRENT_TIMESTAMP,
  `title` text,
  `description` text,
  `tags` text,
  `width` int(9) default NULL,
  `height` int(9) default NULL,
  `thumb_filename` varchar(255) default NULL,
  `thumb_width` int(9) default NULL,
  `thumb_height` int(9) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_5_Media` WRITE;
/*!40000 ALTER TABLE `athena_5_Media` DISABLE KEYS */;
INSERT INTO `athena_5_Media` (`id`,`folder_id`,`filename`,`mime_type`,`file_size`,`created`,`title`,`description`,`tags`,`width`,`height`,`thumb_filename`,`thumb_width`,`thumb_height`)
VALUES
	(1,68,'intro01.jpg','image/jpeg',193833,'2010-08-12 00:00:42','intro_01.jpg','','',1260,800,'intro01_thumb.jpg',50,50),
	(2,68,'intro02.jpg','image/jpeg',174858,'2010-08-12 00:00:44','intro_02.jpg','','',1260,800,'intro02_thumb.jpg',50,50),
	(3,68,'intro03.jpg','image/jpeg',198904,'2010-08-12 00:00:45','intro_03.jpg','','',1260,800,'intro03_thumb.jpg',50,50),
	(4,68,'intro04.jpg','image/jpeg',167628,'2010-08-12 00:00:47','intro_04.jpg','','',1260,800,'intro04_thumb.jpg',50,50),
	(5,68,'intro05.jpg','image/jpeg',138222,'2010-08-12 00:00:49','intro_05.jpg','','',1260,800,'intro05_thumb.jpg',50,50),
	(6,68,'intro06.jpg','image/jpeg',117995,'2010-08-12 00:00:51','intro_06.jpg','','',1260,800,'intro06_thumb.jpg',50,50),
	(7,68,'intro07.jpg','image/jpeg',159482,'2010-08-12 00:00:52','intro_07.jpg','','',1260,800,'intro07_thumb.jpg',50,50),
	(8,68,'intro08.jpg','image/jpeg',131547,'2010-08-12 00:00:53','intro_08.jpg','','',1260,840,'intro08_thumb.jpg',50,50),
	(9,68,'intro09.jpg','image/jpeg',170500,'2010-08-12 00:00:55','intro_09.jpg','','',1260,800,'intro09_thumb.jpg',50,50),
	(10,68,'intro10.jpg','image/jpeg',136606,'2010-08-12 00:00:57','intro_10.jpg','','',1260,800,'intro10_thumb.jpg',50,50);

/*!40000 ALTER TABLE `athena_5_Media` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_5_PageParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_PageParas`;

CREATE TABLE `athena_5_PageParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `theme_para_id` int(11) default NULL,
  `para_value` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_5_PageParas` WRITE;
/*!40000 ALTER TABLE `athena_5_PageParas` DISABLE KEYS */;
INSERT INTO `athena_5_PageParas` (`id`,`page_id`,`theme_para_id`,`para_value`)
VALUES
	(1,12,204,'9');

/*!40000 ALTER TABLE `athena_5_PageParas` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_5_Pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_Pages`;

CREATE TABLE `athena_5_Pages` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `parent_page_id` int(11) default '0',
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  `is_homepage` tinyint(1) default '0',
  `page_order` tinyint(3) default '0',
  `is_blogpage` tinyint(1) default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_5_Pages` WRITE;
/*!40000 ALTER TABLE `athena_5_Pages` DISABLE KEYS */;
INSERT INTO `athena_5_Pages` (`id`,`user_id`,`content`,`status`,`last_edit`,`parent_page_id`,`title`,`slug`,`path`,`created`,`template`,`is_homepage`,`page_order`,`is_blogpage`)
VALUES
	(9,1,'','Published','2010-08-13 00:41:07',0,'Home','Home.html','/','2010-08-12 06:01:28','homepage.php',1,0,0),
	(10,1,'','Published','2010-08-13 01:06:54',0,'Portfolio','Portfolio.html','/','2010-08-12 06:01:52','gallerypage.php',0,2,0),
	(11,1,'','Draft','2010-08-13 01:08:15',0,'Blog','Blog.html','/','2010-08-12 06:03:10','blog_page.php',0,3,0),
	(12,1,'<div align=\\\\\\\"left\\\\\\\" cla=\\\\\\\"rightCol\\\\\\\" tyle=\\\\\\\"width: 675px;\\\\\\\">	<div cla=\\\\\\\"contentText\\\\\\\">		<div cla=\\\\\\\"torycontent\\\\\\\">			<p>Holly Pacione Photography<br />			719-321-9419</p>			<p>hollypacionephotography@gmail.com</p>			<p tyle=\\\\\\\"text-align: jutify;\\\\\\\"><trong>Portrait Invetment</trong></p>			<p>The itting fee for portrait i $100 and include:</p>			<p tyle=\\\\\\\"text-align: jutify;\\\\\\\">-Time and talent</p>			<p tyle=\\\\\\\"text-align: jutify;\\\\\\\">-Photography at a location of your choice within the Colorado pring area and mot of Denver</p>			<p>-Print begin at $15</p>			<p>-Digital File are Available</p>			<p><trong>Wedding Invetment</trong></p>			<p>Package begin at $2300 for two photographer, digital negative, and 6 hour and more.</p>			<p>We offer an aortment of earth friendly product, album, print and more.</p>			<p>We would be happy to e-mail you a more detailed price heet upon requet!</p>		</div>	</div></div>','Published','2010-08-13 01:30:05',0,'Investment','Investment.html','/','2010-08-12 06:03:20','contentrightpage.php',0,4,0),
	(13,1,'','Published','2010-08-13 01:08:59',0,'Testimonials','Testimonials.html','/','2010-08-12 06:08:24','page.php',0,6,0),
	(14,1,'','Published','2010-08-13 01:08:48',0,'About Us','AboutUs.html','/','2010-08-12 06:08:56','contentleftpage.php',0,5,0),
	(15,1,'','Published','2010-08-13 01:07:01',10,'Wedding Gallery 1','WeddingGallery1.html','/portfolio/','2010-08-12 06:09:11','gallerypage.php',0,1,0),
	(16,1,'','Published','2010-08-13 01:07:06',10,'Wedding Gallery 2','WeddingGallery2.html','/portfolio/','2010-08-12 06:09:12','gallerypage.php',0,2,0),
	(17,1,'','Published','2010-08-13 01:09:10',0,'Contact Us','ContactUs.html','/','2010-08-12 06:10:13','contactpage.php',0,7,0);

/*!40000 ALTER TABLE `athena_5_Pages` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_5_PageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_PageViews`;

CREATE TABLE `athena_5_PageViews` (
  `page_id` bigint(20) default NULL,
  `view_date` datetime default NULL,
  `ip_long` bigint(20) default NULL,
  `is_bot` tinyint(1) default '0',
  `browser` varchar(25) default NULL,
  `browser_ver` varchar(8) default NULL,
  `os_name` varchar(25) default NULL,
  `os_ver` varchar(8) default NULL,
  `referer` varchar(255) default NULL,
  `user_agent` varchar(255) default NULL,
  `server_ip` bigint(20) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_5_PostCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_PostCategories`;

CREATE TABLE `athena_5_PostCategories` (
  `id` int(11) NOT NULL auto_increment,
  `category` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_5_Posts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_Posts`;

CREATE TABLE `athena_5_Posts` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) default NULL,
  `content` text,
  `status` enum('Published','Draft','Private','Revision') default 'Draft',
  `last_edit` datetime default NULL,
  `created` datetime default NULL,
  `title` varchar(255) default NULL,
  `slug` varchar(255) default NULL,
  `path` varchar(255) default NULL,
  `canComment` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_5_PostTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_PostTags`;

CREATE TABLE `athena_5_PostTags` (
  `id` int(11) NOT NULL auto_increment,
  `tag` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_5_PostToCategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_PostToCategories`;

CREATE TABLE `athena_5_PostToCategories` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `category_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_5_PostToTags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_PostToTags`;

CREATE TABLE `athena_5_PostToTags` (
  `id` int(11) NOT NULL auto_increment,
  `post_id` int(11) default NULL,
  `tag_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



# Dump of table athena_5_RollupBrowser
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_RollupBrowser`;

CREATE TABLE `athena_5_RollupBrowser` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `browser` varchar(30) default NULL,
  `browser_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_5_RollupCrawler
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_RollupCrawler`;

CREATE TABLE `athena_5_RollupCrawler` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `crawler` varchar(25) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_5_RollupOS
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_RollupOS`;

CREATE TABLE `athena_5_RollupOS` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `os_name` varchar(30) default NULL,
  `os_ver` varchar(10) default NULL,
  `hits` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_5_RollupPageViews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_RollupPageViews`;

CREATE TABLE `athena_5_RollupPageViews` (
  `id` int(11) NOT NULL auto_increment,
  `rollup_date` date default NULL,
  `page_views` int(11) default NULL,
  `unique_visitors` int(11) default NULL,
  `keywords` text,
  `page_title` varchar(125) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_Sites
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_Sites`;

CREATE TABLE `athena_Sites` (
  `id` int(11) NOT NULL auto_increment,
  `domain` varchar(200) default NULL,
  `path` varchar(100) default NULL,
  `theme_id` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_Sites` WRITE;
/*!40000 ALTER TABLE `athena_Sites` DISABLE KEYS */;
INSERT INTO `athena_Sites` (`id`,`domain`,`path`,`theme_id`)
VALUES
	(1,'athena.local','',1),
	(2,'callisto.athena.local','',4),
	(3,'pandora.athena.local','',5),
	(4,'cgp.athena.local','',3),
	(5,'holly.athena.local','',2);

/*!40000 ALTER TABLE `athena_Sites` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_UserLevels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_UserLevels`;

CREATE TABLE `athena_UserLevels` (
  `id` int(11) default NULL,
  `name` varchar(12) default NULL,
  `description` text,
  `create_post` tinyint(4) default '0',
  `edit_post` int(11) default NULL,
  `delete_post` int(11) default NULL,
  `create_page` int(11) default NULL,
  `edit_page` int(11) default NULL,
  `delete_page` int(11) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `athena_UserLevels` WRITE;
/*!40000 ALTER TABLE `athena_UserLevels` DISABLE KEYS */;
INSERT INTO `athena_UserLevels` (`id`,`name`,`description`,`create_post`,`edit_post`,`delete_post`,`create_page`,`edit_page`,`delete_page`)
VALUES
	(1,'Super Admin','Access to all sites',1,1,1,1,1,1),
	(2,'Admin','Allowed to administer a given website',1,1,1,1,1,1),
	(3,'Author','Allowed to write posts and modify content for a given website',1,1,0,0,0,0),
	(4,'Contributer','Allowed to write posts for a given site',1,0,0,0,0,0),
	(5,'Subscriber','No rights',0,0,0,0,0,0);

/*!40000 ALTER TABLE `athena_UserLevels` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_Users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_Users`;

CREATE TABLE `athena_Users` (
  `id` int(11) NOT NULL auto_increment,
  `email` varchar(255) default NULL,
  `name` varchar(255) default NULL,
  `password_hash` varchar(128) default NULL,
  `account_created` datetime default NULL,
  `last_login` datetime default NULL,
  `user_level` tinyint(1) default NULL,
  `service_client_gallery` tinyint(1) default '0',
  `payment_plan` enum('Monthly','Annually') default 'Annually',
  `last_payment` date default NULL,
  `next_payment_due` date default NULL,
  `monthly_fee` float(3,2) default '8.00',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_Users` WRITE;
/*!40000 ALTER TABLE `athena_Users` DISABLE KEYS */;
INSERT INTO `athena_Users` (`id`,`email`,`name`,`password_hash`,`account_created`,`last_login`,`user_level`,`service_client_gallery`,`payment_plan`,`last_payment`,`next_payment_due`,`monthly_fee`)
VALUES
	(1,'mike@apollosites.com','Mike Pritchard','22d500a499157bcb53edd6703f8b78fb132fb1698735af66fcca','2010-08-09 19:54:00','2010-08-19 17:54:11',2,1,'Annually','2010-08-09','2011-08-09',8.00);

/*!40000 ALTER TABLE `athena_Users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table athena_UserToSite
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_UserToSite`;

CREATE TABLE `athena_UserToSite` (
  `user_id` int(11) default NULL,
  `site_id` int(11) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `athena_UserToSite` WRITE;
/*!40000 ALTER TABLE `athena_UserToSite` DISABLE KEYS */;
INSERT INTO `athena_UserToSite` (`user_id`,`site_id`)
VALUES
	(1,1),
	(1,2),
	(1,3),
	(1,4),
	(1,5);

/*!40000 ALTER TABLE `athena_UserToSite` ENABLE KEYS */;
UNLOCK TABLES;





/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
