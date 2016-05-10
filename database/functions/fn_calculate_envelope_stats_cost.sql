Drop Function If Exists fn_calculate_envelope_stats_cost;

Delimiter $$

Create Function fn_calculate_envelope_stats_cost
  (
    envelopeId int
  )
  Returns Decimal(19, 2)
  BEGIN

    Select U.StatsLength
    Into @length
    From `user` U
    Where U.Id = 1
    Limit 1;

    Select DATE_ADD(CURDATE(), INTERVAL @length * -1 MONTH) End Into @date;

    Select
      IFNULL
      (
          (
            Case When E.CalculationType = 'fix'
              Then E.CalculationAmount
            Else
              (
                Select (IFNULL(Sum(T.Amount), 0.00) + IFNULL(Sum(T.Pending), 0.00)) / 3 * -1
                From `transaction` T
                Where T.EnvelopeId = E.Id
                      And T.PostedDate > DATE_ADD(CURDATE(), INTERVAL -3 MONTH)
                      And T.UseInStats = 1
                      And T.IsDeleted = 0
                      And
                      (
                        T.Amount < 0
                        Or T.IsRefund = 1
                        Or T.Pending < 0
                      )
                Group By T.EnvelopeId
              )
            End
          )
          , 0.00)
    Into @retVal
    From `envelope` E
    Where E.Id = envelopeId
    Limit 1;

    RETURN @retVal;
  END