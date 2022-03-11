
list.of.packages <- c("RMySQL","data.table")
new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)

library(RMySQL)
library(data.table)



git_loc = "../tcpd_data/data"

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
    if(nrow(data)!=0){
      data$Election_Type = "AE"
      if(!"State_Name" %in% names(data)){
        data$State_Name = state
      }
      #data$State_Name = "Lok_Sabha"
      createTable(data,db_host,db,tab_name)
    }
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
