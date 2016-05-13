CREATE OR REPLACE VIEW vw_transaction
AS
  SELECT
    T.Id,
    T.EnvelopeId,
    T.Name,
    T.PostedDate,
    T.Amount,
    T.Pending,
    T.UseInStats,
    T.IsRefund,
    T.CreatedOn,
    T.CreatedBy,
    T.ModifiedOn,
    T.ModifiedBy,
    E.AccountId,
    BE.Name  EnvelopeName,
    BE.Color EnvelopeColor
  FROM transaction T
    INNER JOIN envelope E
      ON T.EnvelopeId = E.Id
         AND T.IsDeleted = 0
         AND E.IsDeleted = 0
         AND E.IsClosed = 0
    INNER JOIN baseEnvelope BE
      ON E.BaseEnvelopeId = BE.Id
  ORDER BY
    CASE WHEN ifnull(T.pending, 0) = 0
      THEN 1
    ELSE 2 END DESC
    , T.PostedDate DESC
    , T.Name ASC;