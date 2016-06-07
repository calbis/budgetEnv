DROP TABLE IF EXISTS `transaction`;
CREATE TABLE IF NOT EXISTS `transaction` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `EnvelopeId` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `PostedDate` date NOT NULL,
  `Amount` decimal(19,2) DEFAULT NULL,
  `Pending` decimal(19,2) DEFAULT NULL,
  `UseInStats` tinyint(1) NOT NULL DEFAULT '1',
  `IsRefund` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedOn` datetime NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `ModifiedOn` datetime NOT NULL,
  `ModifiedBy` int(11) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `FK_TransactionsEnvelopeId_ToEnvelopesId` (`EnvelopeId`),
  KEY `FK_TransactionsCreatedBy_ToUsersId` (`CreatedBy`),
  KEY `FK_TransactionsModifiedBy_ToUsersId` (`ModifiedBy`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8_bin AUTO_INCREMENT=1 ;