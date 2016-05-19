cat ./tables/user.sql | mysql --database=accounts -u manager -pPassword123
cat ./tables/account.sql | mysql --database=accounts -u manager -pPassword123
cat ./tables/baseEnvelope.sql | mysql --database=accounts -u manager -pPassword123
cat ./tables/color.sql | mysql --database=accounts -u manager -pPassword123
cat ./tables/envelope.sql | mysql --database=accounts -u manager -pPassword123
cat ./tables/transaction.sql | mysql --database=accounts -u manager -pPassword123

cat ./functions/fn_calculate_envelope_goal_deposit.sql | mysql --database=accounts -u manager -pPassword123
cat ./functions/fn_calculate_envelope_stats_cost.sql | mysql --database=accounts -u manager -pPassword123
cat ./functions/fn_calculate_envelope_stats_length.sql | mysql --database=accounts -u manager -pPassword123

cat ./views/vw_account_sum.sql | mysql --database=accounts -u manager -pPassword123
cat ./views/vw_envelope_stats_cost.sql | mysql --database=accounts -u manager -pPassword123
cat ./views/vw_envelope_sum.sql | mysql --database=accounts -u manager -pPassword123
cat ./views/vw_envelope.sql | mysql --database=accounts -u manager -pPassword123
cat ./views/vw_envelope_sum_ext.sql | mysql --database=accounts -u manager -pPassword123
cat ./views/vw_transaction.sql | mysql --database=accounts -u manager -pPassword123

cat ./constraints.sql | mysql --database=accounts -u manager -pPassword123