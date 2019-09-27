# LokDhaba_JS
Development repository for lokdhaba in javascript

Backend : Flask API : LokdhabaAPI
database : mysql : db
front end : React app : lokdhaba_js


docker-compose file : docker-compose yml

Configuration instructions : 
update following files 
1) docker-compose.yml
Update mysql root user password to be used.
2)db/init.sql
update mysql root password as set in docker-compose.yml
update api user and password 
3) db/tcpd_sql_setup.R
update git_loc with location of tcpd_data repository on server, relative to location of LokDhaba_JS repository.
update 
4) LokdhabaApi/db_config.properties
Update user to api user and respective password. (lines 3 and 4)
3) lokdhaba_js/src/Components/Shared/Constants.js
update the ip/dns of server in baseUrl variable.
4) setup.sh
updated tcpd_data repository location for copying AE and GE Maps.


Building App:
$ sudo setup.sh

dependency installations :
docker-compose
r-base-core
libmariadb (for instalation of library RMySQL to populate data)
 


if creating ld_ui gives following error : 
ERROR: for ld_ui  UnixHTTPConnectionPool(host='localhost', port=None): Read timed out. (read timeout=60)

ERROR: for node  UnixHTTPConnectionPool(host='localhost', port=None): Read timed out. (read timeout=60)
ERROR: An HTTP request took too long to complete. Retry with --verbose to obtain debug information.
If you encounter this issue regularly because of slow network conditions, consider setting COMPOSE_HTTP_TIMEOUT to a higher value (current value: 60).

try : 
$export COMPOSE_HTTP_TIMEOUT=120
$sudo sh setup.sh


if there is a error in running tcpd_sql_setup.R like :
Error in .local(drv, ...) : 
  Failed to connect to database: Error: Lost connection to MySQL server at 'reading initial communication packet', system error: 2 "No such file or directory"
Calls: createTable -> dbConnect -> dbConnect -> .local -> .Call
Execution halted

try :
$Rscript db/tcpd_sql_setup.R (a few moments after db is initialized) 

Running in test enviornment on http://lokdhaba1.ashoka.edu.in:3001/ (please file bugs, improvements, enhancements in issues) 

