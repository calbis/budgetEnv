Drop Function If Exists fn_calculate_envelope_stats_length;

Delimiter $$

Create Function fn_calculate_envelope_stats_length
  (
      envelopeId int
    , statsCostAmount decimal(19, 2)
  )
  Returns Decimal(19, 2)
  Begin

    Select DATE_ADD(CURDATE(), INTERVAL -3 MONTH) Into @date;

    Select Case When statsCostAmount = 0 Then
      0.00
           Else
             (
               Select
                 IFNULL
                 (
                     (
                       Select (Sum(T.Amount) + Sum(T.Pending)) / statsCostAmount
                     )
                     , 0.00)
               From `envelope` E
                 Inner Join `transaction` T
                   On E.Id = T.EnvelopeId
                      And E.Id = envelopeId
                      And T.IsDeleted = 0
               Group By E.Id
             )
           End
    Into @retVal;


    RETURN @retVal;
  End $$

Delimiter ;