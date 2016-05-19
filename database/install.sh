`cat ./database/tables/user.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/tables/account.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/tables/baseEnvelope.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/tables/color.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/tables/envelope.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/tables/transaction.sql | mysql --database=accounts -u manager -pPassword123`;

`cat ./database/functions/fn_calculate_envelope_goal_deposit.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/functions/fn_calculate_envelope_stats_cost.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/functions/fn_calculate_envelope_stats_length.sql | mysql --database=accounts -u manager -pPassword123`;

`cat ./database/views/vw_account_sum.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/views/vw_envelope_stats_cost.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/views/vw_envelope_sum.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/views/vw_envelope.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/views/vw_envelope_sum_ext.sql | mysql --database=accounts -u manager -pPassword123`;
`cat ./database/views/vw_transaction.sql | mysql --database=accounts -u manager -pPassword123`;

`cat ./database/constraints.sql | mysql --database=accounts -u manager -pPassword123`;