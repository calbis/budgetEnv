DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Status` varchar(10) NOT NULL DEFAULT 'unverified',
  `CreatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifiedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `StatsLength` int(11) NOT NULL DEFAULT '3',
  `StatsDisplay` varchar(1) NOT NULL DEFAULT 'm',
  `GoalLength` int(11) NOT NULL DEFAULT '2',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;