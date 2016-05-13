Create Or Replace View vw_account_sum As
  Select A.Id AccountId
    , Sum(IFNULL(Tran.Amount, 0.0)) AccountSum
    , Sum(IFNULL(Tran.Pending, 0.0)) AccountPending
  From `account` A
    Inner Join `envelope` E
      On A.Id = E.AccountId
         And A.IsDeleted = 0
         And E.IsDeleted = 0
    Inner Join `transaction` Tran
      On E.Id = Tran.EnvelopeId
         And Tran.IsDeleted = 0
  Group By A.Id;