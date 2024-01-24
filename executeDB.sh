/opt/mssql/bin/sqlservr &
sleep 160s
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -i /usr/src/app/create-database.sql
tail -f /dev/null