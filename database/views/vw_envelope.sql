Create Or Replace View vw_envelope
As
Select BE.Name
  , BE.Color
  , E.Id
  , E.AccountId
  , E.BaseEnvelopeId
  , E.IsClosed
  , E.IsDeleted
  , E.CreatedOn
  , E.CreatedBy
  , E.ModifiedOn
  , E.ModifiedBy
  , ES.EnvelopePending
  , ES.EnvelopeSum
  , ES.GoalDeposit
  , ES.StatsCost
  , ES.TimeLeft
From envelope E
Inner Join baseEnvelope BE
  On E.BaseEnvelopeId = BE.Id
Inner Join vw_envelope_sum ES
  On E.Id = ES.EnvelopeId