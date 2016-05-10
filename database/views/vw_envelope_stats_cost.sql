Create Or Replace View vw_envelope_stats_cost
As Select
     E.Id As EnvelopeId
     ,
     IFNULL(
         ((IFNULL(Sum(T.Amount), 0.00) + IFNULL(Sum(T.Pending), 0.00)) / -3
         ), 0.00) As StatsCostAmount
   From `envelope` E
     Left Outer Join `transaction` T
       On E.Id = T.EnvelopeId
          And E.IsDeleted = 0
          And T.PostedDate > DATE_ADD(CURDATE(), INTERVAL -3 MONTH)
          And T.UseInStats = 1
          And T.IsDeleted = 0
          And
          (
            T.Amount < 0
            Or T.IsRefund = 1
            Or T.Pending < 0
          )
   Group By E.Id;