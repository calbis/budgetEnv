CREATE OR REPLACE VIEW vw_envelope_sum_ext
AS
  SELECT
    ESUM.EnvelopeId,
    ESUM.EnvelopeSum,
    ESUM.EnvelopePending,
    ESUM.StatsCost,
    ESUM.TimeLeft,
    ESUM.GoalDeposit,
    E.BaseEnvelopeId,
    E.AccountId,
    BE.Color EnvelopeColor,
    BE.Name  EnvelopeName
  FROM envelope E
    INNER JOIN baseEnvelope BE
      ON E.BaseEnvelopeId = BE.Id
         AND E.IsDeleted = 0
         AND E.IsClosed = 0
    INNER JOIN vw_envelope_sum ESUM
      ON E.Id = ESUM.EnvelopeId
  Order By BE.Name;