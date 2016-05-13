
INSERT INTO `accounts`.`user` (`Id`, `Username`, `Status`, `CreatedOn`, `ModifiedOn`) VALUES (1, 'Jack', 'Active', now(), now());

INSERT INTO `accounts`.`account` (`Id`, `Name`, `Color`, `IsClosed`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`, `ExternalTotal`) VALUES (1, 'Checking', 'DarkBlue', 0, now(), 1, now(), 1, 155.10);
INSERT INTO `accounts`.`account` (`Id`, `Name`, `Color`, `IsClosed`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`, `ExternalTotal`) VALUES (2, 'Savings', 'Green', 0, now(), 1, now(), 1, 225.14);

INSERT INTO `accounts`.`baseEnvelope` (`Id`, `Name`, `Color`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`) VALUES (1, 'Gold Pot', 'Blue', now(), 1, now(), 1);
INSERT INTO `accounts`.`baseEnvelope` (`Id`, `Name`, `Color`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`) VALUES (2, 'Food', 'FireBrick', now(), 1, now(), 1);
INSERT INTO `accounts`.`baseEnvelope` (`Id`, `Name`, `Color`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`) VALUES (3, 'Gas', 'Gray', now(), 1, now(), 1);

INSERT INTO `accounts`.`envelope` (`AccountId`, `BaseEnvelopeId`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`)
SELECT A.Id
  , BE.Id
  , now()
  , 1
  , now()
  , 1
FROM `accounts`.`account` A
CROSS JOIN `accounts`.`baseEnvelope` BE;

INSERT INTO `accounts`.`transaction` (`EnvelopeId`, `Name`, `PostedDate`, `Amount`, `Pending`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`)
VALUES
  (1, 'Balance', '2016-05-01', 100, 0, now(), 1, now(), 1),
  (2, 'Balance', '2016-05-01', 200, 0, now(), 1, now(), 1),
  (3, 'Balance', '2016-05-01', 30, 0, now(), 1, now(), 1),
  (5, 'Balance', '2016-05-01', 50, 0, now(), 1, now(), 1),
  (3, 'Food store, groceries', '2016-05-02', -75.00, 0, now(), 1, now(), 1),
  (5, 'Gas store, gas', '2016-05-02', -25.50, 0, now(), 1, now(), 1),
  (1, 'Paycheck', '2016-05-03', 100, 0, now(), 1, now(), 1),
  (3, 'Paycheck', '2016-05-03', 150, 0, now(), 1, now(), 1),
  (5, 'Paycheck', '2016-05-03', 40, 0, now(), 1, now(), 1),
  (1, 'Transfer to Savings', '2016-05-04', -100, 0, now(), 1, now(), 1),
  (2, 'Transfer from Checking', '2016-05-04', 100, 0, now(), 1, now(), 1),
  (3, 'Amazon, cereal', '2016-05-05', null, -10.17, now(), 1, now(), 1),
  (1, 'Amazon, coffee', '2016-05-05', null, -5.54, now(), 1, now(), 1);