library(data.table)
library(jsonlite)
library(dplyr)
args = commandArgs(TRUE)


if (length(args) != 1)  {
  stop ("Please provide 1 argument:  Directory of the tcpd_data.git")
}


dir <- args[1]

ls_no_file = paste(dir,"GE/Data/derived/mastersheet.csv",sep="/")
st_codes_file = paste(dir,"state_codes.csv",sep="/")
vs_no_file = paste(dir,"AE/VidhaSabhaNumber.csv",sep="/")

ls_no = fread(ls_no_file,na="")
ls_yr = ls_no[Poll_No==0,list(Year = unique(Year)),by=c("Assembly_No","State_Name")]
ls_yr %>% toJSON() %>% writeLines("../Data/LokSabhaNumber.json")

st_codes = fread(st_codes_file,na="")
st_codes %>% toJSON() %>% writeLines("../Data/StateCodes.json")

vs_no = fread(vs_no_file,na="")
vs_no$Assembly_No = vs_no$sa_no
vs_no$State_Name = vs_no$state
vs_no$Year = vs_no$year
vs_no$key_year = NULL
vs_no$sa_no = NULL
vs_no$year= NULL
vs_no$state=NULL
vs_no %>% toJSON() %>% writeLines("../Data/VidhanSabhaNumber.json")

color_file = paste(dir,"colours.csv",sep="/")
colors = fread(color_file,na="")
colors %>% toJSON() %>% writeLines("../Data/PartyColourPalette.json")
