DROP TABLE IF EXISTS `envelope`;
CREATE TABLE IF NOT EXISTS `envelope` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `AccountId` int(11) NOT NULL,
  `BaseEnvelopeId` int(11) NOT NULL,
  `IsClosed` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedOn` datetime NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `ModifiedOn` datetime NOT NULL,
  `ModifiedBy` int(11) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `FK_EnvelopesAccountId_ToAccountId` (`AccountId`),
  KEY `FK_EnvelopesCreatedBy_ToUsersId` (`CreatedBy`),
  KEY `FK_EnvelopesModifiedBy_ToUsersId` (`ModifiedBy`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 DEFAULT COLLATE=utf8_bin AUTO_INCREMENT=1 ;