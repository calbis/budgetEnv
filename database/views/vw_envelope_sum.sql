Create Or Replace View vw_envelope_sum
As Select E.Id EnvelopeId
     , Sum(IFNULL(Tran.Amount, 0.0)) EnvelopeSum
     , Sum(IFNULL(Tran.Pending, 0.0)) EnvelopePending
     , SC.StatsCostAmount As StatsCost
     , fn_calculate_envelope_stats_length(E.Id, SC.StatsCostAmount) As TimeLeft
     , fn_calculate_envelope_goal_deposit(E.Id, SC.StatsCostAmount) as GoalDeposit
   From `account` A
     Inner Join `envelope` E
       On A.Id = E.AccountId
          And A.IsDeleted = 0
          And E.IsDeleted = 0
     Inner Join `transaction` Tran
       On E.Id = Tran.EnvelopeId
          And Tran.IsDeleted = 0
     Inner Join vw_envelope_stats_cost SC
       On E.Id = SC.EnvelopeId
   Group By E.Id;