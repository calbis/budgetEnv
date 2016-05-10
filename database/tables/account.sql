DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Color` varchar(100) NOT NULL,
  `IsClosed` tinyint(1) NOT NULL,
  `CreatedOn` datetime NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `ModifiedOn` datetime NOT NULL,
  `ModifiedBy` int(11) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `ExternalTotal` decimal(19,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`Id`),
  KEY `FK_AccountsCreatedBy_ToUsersId` (`CreatedBy`),
  KEY `FK_AccountsModifiedBy_ToUsersId` (`ModifiedBy`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;