DROP TABLE IF EXISTS `baseEnvelope`;
CREATE TABLE IF NOT EXISTS `baseEnvelope` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Color` varchar(100) NOT NULL DEFAULT 'Black',
  `CreatedOn` datetime NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `ModifiedOn` datetime NOT NULL,
  `ModifiedBy` int(11) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `FK_EnvelopesCreatedBy_ToUsersId` (`CreatedBy`),
  KEY `FK_EnvelopesModifiedBy_ToUsersId` (`ModifiedBy`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;