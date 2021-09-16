
list.of.packages <- c("RMySQL","data.table")
new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)

library(RMySQL)
library(data.table)



git_loc = "../tcpd_data/data/"

db_user= "root"
db_host = "127.0.0.1"
db_pass= "root"
db_port = 32000
db = "tcpd_data"

dbDisconnectAll <- function(){
  ile <- length(dbListConnections(MySQL())  )
  lapply( dbListConnections(MySQL()), function(x) dbDisconnect(x) )
  cat(sprintf("%s connection(s) closed.\n", ile))
}

createTable <- function(dframe,connection,db,table){
  #browser()
  mydb = dbConnect(MySQL(),user=db_user,password=db_pass,port = db_port,dbname=db,host=connection)
  if(table %in% dbListTables(mydb)){
    names_table = dbListFields(mydb,table)
    dframe[,names_table[which(!names_table %in% names(dframe))]] = NA
    dframe = subset(dframe,select=names_table)
    dbWriteTable(mydb,table, dframe,overwrite=F,append=T,row.names= F)
  }

  dbDisconnectAll()

}
#Clear existing from database from sql and create a clean database tcpd_data
## mysql> drop database if exists tcpd_data;
## mysql> create database tcpd_data;
## mysql> SET GLOBAL local_infile = true;



ge_mastersheet = read.csv(paste(git_loc,"GE/Data/derived/mastersheet_socio.csv",sep = "/"),stringsAsFactors = F,na="")
ge_mastersheet$Election_Type = "GE"

ae_mastersheet = read.csv(paste(git_loc,"AE/Analysis_Data/Consolidated_AE_mastersheet_socio.csv",sep="/"),stringsAsFactors = F,na="")
ae_mastersheet$Election_Type = "AE"

createTable(ae_mastersheet,db_host,db,"mastersheet")
createTable(ge_mastersheet,db_host,db,"mastersheet")
## <<<<<<<<<< needs further work for combining AE and GE field names
##nms = names(ae_mastersheet)[which(!names(ae_mastersheet) %in% names(ge_mastersheet))]
##print(paste(c("adding :",nms,", columns to ge mastersheet"),collapse = " "))
##ge_mastersheet[,nms]= NA

##nms = names(ge_mastersheet)[which(!names(ge_mastersheet) %in% names(ae_mastersheet))]
##print(paste(c("adding :",nms,", columns to ae mastersheet"),collapse = " "))
##ae_mastersheet[,nms]= NA

##all_mastersheet = rbind(ge_mastersheet,ae_mastersheet)


gae_mastersheet  = read.csv(paste(git_loc,"GE/Data/derived/ac_wise_pc_mastersheet.csv",sep = "/"),stringsAsFactors = F,na="")
#gae_mastersheet$Votes = gae_mastersheet$Votes_In_AC
gae_mastersheet$Election_Type = "GA"
##nms = names(all_mastersheet)[which(!names(all_mastersheet) %in% names(gae_mastersheet))]
##print(paste(c("adding :",nms,", columns to gae mastersheet"),collapse = " "))
##gae_mastersheet[,nms] =NA

##all_mastersheet = rbind(all_mastersheet,subset(gae_mastersheet,select=names(all_mastersheet)))
createTable(gae_mastersheet,db_host,db,"mastersheet")



ge_ld_files = list.files(paste(git_loc,"GE/Data/derived/lokdhaba/",sep="/"),pattern = "*.csv")
for(x in ge_ld_files){
  file = paste(git_loc,"GE/Data/derived/lokdhaba",x,sep="/")
  if(length(grep("ge_",x))==1 ){
    tab_name = gsub("ge_","",x)
    tab_name = gsub("\\.csv","",tab_name)
    data = read.csv(file,na="",stringsAsFactors = F)
    data$Election_Type = "GE"
    if(!"State_Name" %in% names(data)){
      data$State_Name = "Lok_Sabha"
    }
  }else if(length(grep("gae",x))==1){
    tab_name = gsub("gae_","",x)
    tab_name = gsub("\\.csv","",tab_name)
    data = read.csv(file,na="",stringsAsFactors = F)
    data$Election_Type = "GA"
  }

  createTable(data,db_host,db,tab_name)
}

ae_states = list.files(paste(git_loc,"AE/Data",sep="/"))
for (state in ae_states){
  ae_ld_files = list.files(paste(git_loc,"AE/Data",state,"/derived/lokdhaba/",sep='/'),pattern = "*.csv")
  for(x in ae_ld_files){
    file = paste(git_loc,"AE/Data",state,"/derived/lokdhaba",x,sep="/")
    tab_name = gsub("ae_","",x)
    tab_name = gsub("\\.csv","",tab_name)
    data = read.csv(file,na="",stringsAsFactors = F)
    data$Election_Type = "AE"
    if(!"State_Name" %in% names(data)){
      data$State_Name = state
    }
    #data$State_Name = "Lok_Sabha"
    createTable(data,db_host,db,tab_name)

  }
}


ge_vt_file = paste(git_loc,"GE/ge_voter_turnouts.csv",sep="/")
tab_name = "voter_turnout"
data = read.csv(ge_vt_file,na="",stringsAsFactors=F)
data$Election_Type = "GE"
if(!"State_Name" %in% names(data)){
    data$State_Name = "Lok_Sabha"
  }
createTable(data,db_host,db,tab_name)



ae_vt_file = paste(git_loc,"AE/ae_voter_turnouts.csv",sep="/")
tab_name = "voter_turnout"
data = read.csv(ae_vt_file,na="",stringsAsFactors=F)
data$Election_Type = "AE"
createTable(data,db_host,db,tab_name)


# this script generates incumbency visualization sql tables

# print("Creating incumbecny tables")
# if("pid" %in% names(ge_mastersheet)){
#   tab_name = "incumbency"
#   data =data.table(ge_mastersheet)[Party != 'NOTA' , c("Assembly_No", "Poll_No", "Year", "Candidate", "State_Name", "Constituency_Name", "Party", "Last_Party", "pid", "Votes", "Sex", "Position", "Contested", "No_Terms", "Turncoat", "Incumbent", "Vote_Share_Percentage", "Margin", "Margin_Percentage", "Age","Constituency_No")]
#   for (assembly in min(data$Assembly_No):max(data$Assembly_No)) {
#     print (paste('Generating data for assembly# ', assembly))
#
#     dt = data[Assembly_No <= assembly] # filter out all rows after this assembly
#
#     # get pids of everyone who has a line in this assembly...
#     # ... but drop INDs and non-winning-parties parties unless their Position is < 3 to avoid the long tail of insignificant cands
#
#     party_seat_count = dt[Assembly_No == assembly & Position == 1, .(count = .N), by='Party']
#     winning_parties = party_seat_count$Party # only winning parties will have an entry in this table
#     this_assembly_pids = unique(dt[Assembly_No == assembly & (Position < 3 | (Party %in% winning_parties & Party != 'IND'))]$pid)
#
#     print (paste("winning parties = ", winning_parties))
#
#     dt = dt[pid %in% this_assembly_pids]
#     # only keep those rows with a pid in this assembly
#
#     #terms_served_by_pid = dt[Position == 1, .(Terms=length(unique(Assembly_No))), by=c('pid')]
#     #dt = merge (dt, terms_served_by_pid, by=c('pid'), all.x=TRUE)
#
#     # fix the #mandates and contested to be whatever it is up to the current assembly
#     # otherwise rows for the same pid will have different values in these columns
#     dt[, No_Terms:=max(No_Terms), by=c('pid')]
#     dt[, Contested:=max(Contested), by=c('pid')]
#
#     terms_contested_by_pid = dt[, .(Terms_Contested=length(unique(Assembly_No))), by=c('pid')]
#     dt = merge (dt, terms_contested_by_pid, by=c('pid'), all.x = TRUE)
#
#     dt$Incm_Assembly_No = assembly
#     dt$Election_Type = "GE"
#     createTable(dt,db_host,db,tab_name)
#   }
# }else{
#   print(paste("pids not found in Lok Sabha data. Skipping adding to incumbency table"))
# }

# for (state in ae_states){
#   data = fread(paste(git_loc,"AE/Data",state,"/derived/mastersheet.csv",sep='/'),na="")
#   tab_name = "incumbency"
#   if("pid" %in% names(data)){
#     data <- data[Party != 'NOTA' , c("Assembly_No", "Poll_No", "Year", "Candidate", "State_Name", "Constituency_Name", "Party", "Last_Party", "pid", "Votes", "Sex", "Position", "Contested", "No_Terms", "Turncoat", "Incumbent", "Vote_Share_Percentage", "Margin", "Margin_Percentage", "Age","Constituency_No")]
#     # filter dt down to only rows whose pid is present in this assembly
#     for (assembly in min(data$Assembly_No):max(data$Assembly_No)) {
#       print (paste('Generating data for assembly# ', assembly))
#
#       dt = data[Assembly_No <= assembly] # filter out all rows after this assembly
#
#       # get pids of everyone who has a line in this assembly...
#       # ... but drop INDs and non-winning-parties parties unless their Position is < 3 to avoid the long tail of insignificant cands
#
#       party_seat_count = dt[Assembly_No == assembly & Position == 1, .(count = .N), by='Party']
#       winning_parties = party_seat_count$Party # only winning parties will have an entry in this table
#       this_assembly_pids = unique(dt[Assembly_No == assembly & (Position < 3 | (Party %in% winning_parties & Party != 'IND'))]$pid)
#
#       print (paste("winning parties = ", winning_parties))
#
#       dt = dt[pid %in% this_assembly_pids]
#       # only keep those rows with a pid in this assembly
#
#       terms_served_by_pid = dt[Position == 1, .(Terms=length(unique(Assembly_No))), by=c('pid')]
#       dt = merge (dt, terms_served_by_pid, by=c('pid'), all.x=TRUE)
#
#       # fix the #mandates and contested to be whatever it is up to the current assembly
#       # otherwise rows for the same pid will have different values in these columns
#       dt[, No_Terms:= as.integer(max(No_Terms)), by=c('pid')]
#       dt[, Contested:= as.integer(max(Contested)), by=c('pid')]
#
#       terms_contested_by_pid = dt[, .(Terms_Contested=length(unique(Assembly_No))), by=c('pid')]
#       dt = merge (dt, terms_contested_by_pid, by=c('pid'), all.x = TRUE)
#
#       dt$Incm_Assembly_No = assembly
#       dt$Election_Type = "AE"
#       createTable(dt,db_host,db,tab_name)
#     }
#   }else{
#     print(paste("pids not found in",state,". Skipping adding to incumbency table"))
#   }
# }
