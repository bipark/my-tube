```
# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: cfvdo.com (MySQL 5.7.23-0ubuntu0.16.04.1)
# Database: adgallery
# Generation Time: 2018-09-08 08:21:03 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table bookmarks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bookmarks`;

CREATE TABLE `bookmarks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `item_id` int(11) NOT NULL,
  `creator_id` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_id` (`item_id`,`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table cbookmarks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cbookmarks`;

CREATE TABLE `cbookmarks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `curation_id` int(11) NOT NULL,
  `creator_id` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `curation_id` (`curation_id`,`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table clikes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `clikes`;

CREATE TABLE `clikes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `curation_id` int(11) NOT NULL,
  `creator_id` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `curation_id` (`curation_id`,`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `item_id` int(11) NOT NULL,
  `creator_id` varchar(256) NOT NULL DEFAULT '',
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table company_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `company_info`;

CREATE TABLE `company_info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `kind` varchar(30) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table contact
# ------------------------------------------------------------

DROP TABLE IF EXISTS `contact`;

CREATE TABLE `contact` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `title` varchar(512) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `description` text,
  `processed` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table curation_detail
# ------------------------------------------------------------

DROP TABLE IF EXISTS `curation_detail`;

CREATE TABLE `curation_detail` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `master_id` int(11) unsigned NOT NULL,
  `createdDate` datetime NOT NULL,
  `item_id` int(11) unsigned NOT NULL,
  `show` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `master_id` (`master_id`,`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table curation_master
# ------------------------------------------------------------

DROP TABLE IF EXISTS `curation_master`;

CREATE TABLE `curation_master` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `creator_id` varchar(256) NOT NULL DEFAULT '',
  `updator_id` varchar(256) DEFAULT NULL,
  `title` varchar(512) NOT NULL DEFAULT '',
  `description` varchar(1024) DEFAULT '',
  `isshow` char(1) NOT NULL DEFAULT '1',
  `actions` int(11) DEFAULT '0',
  `category` varchar(256) DEFAULT NULL,
  `tag` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table curation_rates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `curation_rates`;

CREATE TABLE `curation_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `curation_id` int(11) NOT NULL,
  `create_user` varchar(256) DEFAULT '',
  `curation_rate` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table curation_views
# ------------------------------------------------------------

DROP TABLE IF EXISTS `curation_views`;

CREATE TABLE `curation_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `curation_id` int(11) NOT NULL,
  `create_user` varchar(256) DEFAULT '',
  `createdDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table features
# ------------------------------------------------------------

DROP TABLE IF EXISTS `features`;

CREATE TABLE `features` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `item_id` int(11) NOT NULL,
  `active` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table item_rates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `item_rates`;

CREATE TABLE `item_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `create_user` varchar(256) DEFAULT '',
  `item_rate` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table item_views
# ------------------------------------------------------------

DROP TABLE IF EXISTS `item_views`;

CREATE TABLE `item_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `ipaddress` varchar(256) DEFAULT NULL,
  `create_user` varchar(256) DEFAULT '',
  `createdDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item_views_user` (`create_user`),
  KEY `item_views_item` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `items`;

CREATE TABLE `items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL COMMENT '생성일자',
  `updatedDate` datetime DEFAULT NULL COMMENT '수정일자',
  `publishedDate` datetime DEFAULT NULL COMMENT '발행일자',
  `creator_id` varchar(256) NOT NULL DEFAULT '' COMMENT '생성자 ID',
  `updator_id` varchar(256) DEFAULT NULL COMMENT '수정자 ID',
  `title` varchar(512) NOT NULL DEFAULT '' COMMENT '제목',
  `note` text COMMENT '내용',
  `datas` text COMMENT 'JSON',
  `tags` varchar(512) DEFAULT NULL COMMENT '태그(,구분)',
  `video_id` varchar(100) NOT NULL DEFAULT '' COMMENT '동영상 ID',
  `thumb_default` varchar(256) DEFAULT NULL,
  `thumb_medium` varchar(256) DEFAULT NULL,
  `thumb_high` varchar(256) DEFAULT NULL,
  `thumb_standard` varchar(256) DEFAULT NULL,
  `thumb_maxres` varchar(256) DEFAULT NULL,
  `channelTitle` varchar(128) DEFAULT NULL,
  `duration` varchar(64) DEFAULT NULL,
  `definition` varchar(64) DEFAULT NULL,
  `isshow` tinyint(1) NOT NULL DEFAULT '1',
  `actions` int(11) DEFAULT '0',
  `views` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `likes`;

CREATE TABLE `likes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `item_id` int(11) NOT NULL,
  `creator_id` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_id` (`item_id`,`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table notice
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notice`;

CREATE TABLE `notice` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `title` varchar(512) DEFAULT NULL,
  `description` text,
  `active` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table report
# ------------------------------------------------------------

DROP TABLE IF EXISTS `report`;

CREATE TABLE `report` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `item_id` int(11) unsigned NOT NULL,
  `reason` varchar(512) NOT NULL DEFAULT '',
  `creator_id` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table search_histories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `search_histories`;

CREATE TABLE `search_histories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `keyword` varchar(512) NOT NULL DEFAULT '',
  `creator_id` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdDate` datetime NOT NULL,
  `strategy` varchar(256) DEFAULT NULL,
  `uid` varchar(256) NOT NULL DEFAULT '',
  `name` varchar(256) NOT NULL DEFAULT '',
  `scope` varchar(256) NOT NULL DEFAULT 'user',
  `picture` varchar(512) DEFAULT NULL,
  `autoplay` tinyint(4) DEFAULT '1',
  `recvnoti` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

```