ALTER TABLE `account`
ADD CONSTRAINT `FK_AccountsCreatedBy_ToUsersId` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_AccountsModifiedBy_ToUsersId` FOREIGN KEY (`ModifiedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `envelope`
--
ALTER TABLE `envelope`
ADD CONSTRAINT `FK_EnvelopesAccountId_ToAccountId` FOREIGN KEY (`AccountId`) REFERENCES `account` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_EnvelopesCreatedBy_ToUsersId` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_EnvelopesModifiedBy_ToUsersId` FOREIGN KEY (`ModifiedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `filterEnvelope`
--
ALTER TABLE `filterEnvelope`
ADD CONSTRAINT `FK_FiltersEnvelopeId_ToEnvelopesId` FOREIGN KEY (`EnvelopeId`) REFERENCES `envelope` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_FiltersFilterId_ToFiltersId` FOREIGN KEY (`FilterId`) REFERENCES `userFilter` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `filterLabel`
--
ALTER TABLE `filterLabel`
ADD CONSTRAINT `FK_FilterLabelsFilterId_ToFiltersId` FOREIGN KEY (`FilterId`) REFERENCES `userFilter` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `label`
--
ALTER TABLE `label`
ADD CONSTRAINT `FK_LabelsCreatedBy_ToUsersId` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_LabelsTransactionId_ToTransactionId` FOREIGN KEY (`TransactionId`) REFERENCES `transaction` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Logs`
--
ALTER TABLE `Logs`
ADD CONSTRAINT `FK_LogsUserId_ToUsersId` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `transaction`
ADD CONSTRAINT `FK_TransactionsCreatedBy_ToUsersId` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_TransactionsEnvelopeId_ToEnvelopesId` FOREIGN KEY (`EnvelopeId`) REFERENCES `envelope` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_TransactionsModifiedBy_ToUsersId` FOREIGN KEY (`ModifiedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `userAccount`
ADD CONSTRAINT `FK_UserAccountsAccountId_ToAccountId` FOREIGN KEY (`AccountId`) REFERENCES `account` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_UserAccountsCreatedBy_ToUsersId` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_UserAccountsModifiedBy_ToUsersId` FOREIGN KEY (`ModifiedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_UserAccountsUserId_ToUsersId` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `userFilter`
ADD CONSTRAINT `FK_FiltersCreatedBy_ToUsersId` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_FiltersModifiedBy_ToUsersId` FOREIGN KEY (`ModifiedBy`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER VIEW `vw_account_sum`
ADD CONSTRAINT `FK_VwAccountSum_AccountId_ToAccountId` FOREIGN KEY (`AccountId`) REFERENCES `account` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,

ALTER VIEW `vw_envelope_sum`
ADD CONSTRAINT `FK_VwEnvelopeSum_EnvelopeId_ToEnvelopeId` FOREIGN KEY (`EnvelopeId`) REFERENCES `envelope` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,