DROP TABLE IF EXISTS `log`;
CREATE TABLE IF NOT EXISTS `log` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Item` varchar(100) DEFAULT NULL,
  `Action` varchar(100) DEFAULT NULL,
  `ItemId` int(11) DEFAULT '-1',
  `Description` longtext,
  `UserId` int(11) DEFAULT NULL,
  `CreatedOn` datetime NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_LogsUserId_ToUsersId` (`UserId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 DEFAULT COLLATE=utf8_bin AUTO_INCREMENT=1 ;