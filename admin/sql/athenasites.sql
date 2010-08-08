# Sequel Pro dump
# Version 2210
# http://code.google.com/p/sequel-pro
#
# Host: localhost (MySQL 5.0.41-log)
# Database: athenasites
# Generation Time: 2010-08-08 13:43:18 -0600
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
	('dc4b2371ffa0621c2abcf70a3ea68f60',1281295528,'user_valid|b:1;user_id|s:1:\"1\";user_name|s:14:\"Mike Pritchard\";user_email|s:20:\"mike@apollosites.com\";user_level|s:1:\"1\";');

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
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

LOCK TABLES `apollo_Theme` WRITE;
/*!40000 ALTER TABLE `apollo_Theme` DISABLE KEYS */;
INSERT INTO `apollo_Theme` (`id`,`theme_name`,`theme_title`,`price`,`thumb_url`,`description`,`is_private`)
VALUES
	(2,'HollyPacione','Holly Pacione Photography',1000,'admin/themes/HollyPacione/screenshot.png','Holly Pacione Photography',1),
	(1,'ApolloSites','ApolloSites',5000,'admin/themes/ApolloSites/screenshot.png','ApolloSites',1),
	(3,'CGP4','Charlotte Geary Photography',5000,'admin/themes/cgp4/screenshot.png','Charlotte Geary Photography',1),
	(4,'Callisto','Callisto',200,NULL,NULL,0),
	(5,'Pandora','Pandora',200,NULL,NULL,0);

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
	(101,1,'image','home_page.php','Home page image',1,NULL,NULL,1),
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
	(221,2,'color','all','Blog image border color',1,'This is the color of the border used for images in your blog posts. ',NULL,1);

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
) ENGINE=MyISAM AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

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
	(68,'1'),
	(69,'1');

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
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

LOCK TABLES `athena_1_Media` WRITE;
/*!40000 ALTER TABLE `athena_1_Media` DISABLE KEYS */;
INSERT INTO `athena_1_Media` (`id`,`folder_id`,`filename`,`mime_type`,`file_size`,`created`,`title`,`description`,`tags`,`width`,`height`,`thumb_filename`,`thumb_width`,`thumb_height`)
VALUES
	(1,1,'OzTrip001.JPG','image/jpeg',807827,'2010-08-08 19:24:58','OzTrip_001.JPG','','',1600,1200,'OzTrip001_thumb.JPG',50,50),
	(2,1,'OzTrip002.JPG','image/jpeg',872627,'2010-08-08 19:24:59','OzTrip_002.JPG','','',1600,1200,'OzTrip002_thumb.JPG',50,50),
	(3,1,'OzTrip003.JPG','image/jpeg',723476,'2010-08-08 19:24:59','OzTrip_003.JPG','','',1600,1200,'OzTrip003_thumb.JPG',50,50),
	(4,1,'OzTrip004.JPG','image/jpeg',615570,'2010-08-08 19:24:59','OzTrip_004.JPG','','',1600,1200,'OzTrip004_thumb.JPG',50,50),
	(5,1,'OzTrip005.JPG','image/jpeg',735837,'2010-08-08 19:24:59','OzTrip_005.JPG','','',1600,1200,'OzTrip005_thumb.JPG',50,50),
	(6,1,'OzTrip006.JPG','image/jpeg',414403,'2010-08-08 19:24:59','OzTrip_006.JPG','','',1600,1200,'OzTrip006_thumb.JPG',50,50),
	(7,1,'OzTrip007.JPG','image/jpeg',489871,'2010-08-08 19:25:00','OzTrip_007.JPG','','',1600,1200,'OzTrip007_thumb.JPG',50,50),
	(8,1,'OzTrip008.JPG','image/jpeg',357606,'2010-08-08 19:25:00','OzTrip_008.JPG','','',1024,768,'OzTrip008_thumb.JPG',50,50),
	(9,1,'OzTrip009.JPG','image/jpeg',343058,'2010-08-08 19:25:00','OzTrip_009.JPG','','',1024,768,'OzTrip009_thumb.JPG',50,50),
	(10,1,'OzTrip010.JPG','image/jpeg',351745,'2010-08-08 19:25:00','OzTrip_010.JPG','','',1024,768,'OzTrip010_thumb.JPG',50,50);

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



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
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;



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
  `canComment` tinyint(1) default '1',
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
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
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
  `canComment` tinyint(1) default '1',
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
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
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
  `canComment` tinyint(1) default '1',
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
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

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
	(9,'Reserved');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table athena_4_GlobalParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_GlobalParas`;

CREATE TABLE `athena_4_GlobalParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `para_value` varchar(255) default NULL,
  `theme_para_id` bigint(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_4_PageParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_4_PageParas`;

CREATE TABLE `athena_4_PageParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `theme_para_id` int(11) default NULL,
  `para_value` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



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
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;



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
  `canComment` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;



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
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

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
	(9,'Reserved');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table athena_5_PageParas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `athena_5_PageParas`;

CREATE TABLE `athena_5_PageParas` (
  `id` bigint(20) NOT NULL auto_increment,
  `page_id` bigint(20) default NULL,
  `theme_para_id` int(11) default NULL,
  `para_value` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



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
  `created` datetime default NULL,
  `template` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;



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
  `canComment` tinyint(1) default '1',
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
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

LOCK TABLES `athena_Users` WRITE;
/*!40000 ALTER TABLE `athena_Users` DISABLE KEYS */;
INSERT INTO `athena_Users` (`id`,`email`,`name`,`password_hash`,`account_created`,`last_login`,`user_level`)
VALUES
	(1,'mike@apollosites.com','Mike Pritchard','f8f644199c602f9c8549970046976706cfb334a09c68676d2cc6','2010-08-08 19:17:24','2010-08-08 19:17:47',1);

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
