ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
SHOW GLOBAL VARIABLES LIKE 'local_infile';
CREATE DATABASE tcpd_data;
USE tcpd_data;
CREATE table if not exists `mastersheet` (
	`Election_Type` varchar(2) NOT NULL,
	`State_Name` varchar(50) NOT NULL,
	`Assembly_No` INT NOT NULL,
	`Constituency_No` INT NOT NULL,
	`Year` INT NOT NULL,
	`month` INT,
	`Poll_No` INT NOT NULL,
	`DelimID` INT,
	`Position` INT NOT NULL,
	`Candidate` varchar(255),
	`Sex` varchar(3),
	`Party` varchar(255),
	`Votes` INT,
	`Candidate_Type` varchar(5),
	`Valid_Votes` INT,
	`Electors` INT,
	`Constituency_Name` varchar(255),
	`Constituency_Type` varchar(10),
	`Sub_Region` varchar(255),
	`N_Cand` INT,
	`Turnout_Percentage` REAL,
	`Vote_Share_Percentage` REAL,
	`Deposit_Lost` varchar(3),
	`Margin` INT,
	`Margin_Percentage` REAL,
	`ENOP` REAL,
	`pid` varchar(255),
	`Party_Type_TCPD` varchar(255),
	`Party_ID` INT,
	`last_poll` varchar(10),
	`Contested` INT,
	`Last_Party` varchar(255),
	`Last_Party_ID` INT,
	`Last_Constituency_Name` varchar(255),
	`Same_Constituency` varchar(10),
	`Same_Party` varchar(10),
	`No_Terms` INT,
	`Turncoat` varchar(10),
	`Incumbent` varchar(10),
	`Recontest` varchar(10),
	`Age` INT,
	`District_Name` varchar(255),
	`PC_Name` varchar(255),
	`PC_No` INT,
	`CandID` INT,
	`MyNeta_education` varchar(100),
	`TCPD_Prof_Main` varchar(100),
	`TCPD_Prof_Main_Desc`	varchar(100),
	`TCPD_Prof_Second`	varchar(100),
	`TCPD_Prof_Second_Desc` varchar(100),
	PRIMARY KEY (`Election_Type`,`State_Name`, `Assembly_No`,`Constituency_No`,`Poll_No`,`Position`)
);
create table `contested_deposit_losts` (
	`Election_Type` varchar(2) NOT NULL,
	`State_Name` varchar(50) NOT NULL,
	`Assembly_No` INT NOT NULL,
	`Year` INT NOT NULL,
	`Total_Candidates` INT,
	`Deposit_Lost` INT,
	PRIMARY KEY (`Election_Type`, `State_Name`, `Assembly_No`)
);
create table `maps` (
	`Election_Type` varchar(2) NOT NULL,
	`State_Name` varchar(50) NOT NULL,
	`Assembly_No` INT NOT NULL,
	`Year` INT NOT NULL,
	`Constituency_No` INT NOT NULL,
	`Constituency_Name` varchar(50) NOT NULL,
	`Turnout_Percentage` REAL,
	`Vote_Share_Percentage` REAL,
	`Constituency_Type` varchar(50),
	`Electors` INT,
	`N_Cand` INT,
	`Position` INT NOT NULL,
	`Sex` varchar(10),
	`Party` varchar(50) NOT NULL,
	`Votes` INT,
	`Elected` varchar(255) NOT NULL,
	`Margin_Percentage` REAL ,
	`Runner` varchar(255),
	`Runner_Party` varchar(50),
	`Runner_Sex` varchar(10),
	`Nota_Percentage` REAL,
	`Vote_Share_Change_pct` REAL,
	`Turnout_Change_pct` REAL,
	`Margin_Change_pct` REAL,
	`Last_Party` varchar(50),
	`Party_Change` varchar(50),
	`Last_Elected` varchar(255),
	PRIMARY KEY (`Election_Type`, `State_Name`,`Assembly_No`,`Constituency_No`)
);

create table `parties_contests` (
	`Election_Type` varchar(2) NOT NULL,
	`State_Name` varchar(50) NOT NULL,
	`Assembly_No` INT NOT NULL,
	`Year` INT NOT NULL,
	`Parties_Contested` INT,
	`Parties_Represented` INT,
	PRIMARY KEY (`Election_Type`, `State_Name`, `Assembly_No`)
);

create table `partys` (
	`Election_Type` varchar(2) NOT NULL,
	`State_Name` varchar(50) NOT NULL,
	`Assembly_No` INT NOT NULL,
	`Year` INT NOT NULL,
	`Constituency_No` INT NOT NULL,
	`Constituency_Name` varchar(50) NOT NULL,
	`Vote_Share_Percentage` REAL,
	`Constituency_Type` varchar(50),
	`Position` INT NOT NULL,
	`Party` varchar(50) NOT NULL,
	`Votes` INT,
	`Candidate` varchar(255) NOT NULL,
	`Position_Change` REAL,
	`Vote_Share_Change_pct` REAL,
	`Last_Position` INT,
	`Last_Candidate` varchar(255),
	PRIMARY KEY (`Election_Type`, `State_Name`,`Assembly_No`,`Constituency_No`,`Position`)
);
create table party_statistics (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	Party varchar(50) NOT NULL,
        Total_Seats_in_Assembly INT NOT NULL,
        Total_Votes_in_Assembly INT NOT NULL,
        Total_Votes_in_Contested_Seats INT NOT NULL,
	Total_Candidates INT ,
	Winners INT NOT NULL,
	Deposit_Lost INT,
	Strike_Rate REAL,
	Seat_Share REAL,
	Vote_Share_in_Assembly REAL,
	Vote_Share_in_Contested_Seats REAL,
	position INT,
	Expanded_Party_Name varchar(50),
	PRIMARY KEY (Election_Type, State_Name,Assembly_No,Party)
);

create table womens (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	Women_Percentage REAL,
	PRIMARY KEY (Election_Type, State_Name,Assembly_No)
);
create table voter_turnout (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	male REAL,
	female REAL,
	total REAL,
	PRIMARY KEY (Election_Type, State_Name, Assembly_No)
);

CREATE table if not exists incumbency (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT,
	Total_Candidates INT,
	Contesting_Incumbents INT,
	Successful_Incumbents INT,
	Total_Seats INT,
	Turncoats  INT,
	Successful_Turncoats INT,
	Recontesting_Candidates INT,
	First_Contests INT,
	Second_Contests INT,
	Multiple_Contests INT,
	No_first_time_winners INT,
	First_Contest_Winners INT,
	Recontesting_Candidates_pct REAL,
	First_Contests_pct REAL,
	Second_Contests_pct REAL,
	Multiple_Contests_pct REAL,
	Contesting_Incumbents_pct REAL,
	Successful_Incumbents_pct REAL,
	Incumbent_Strike_Rate REAL,
	Turncoat_Strike_Rate REAL,
	No_first_time_winners_pct REAL,
	First_Contest_Winners_pct REAL,
	PRIMARY KEY (Election_Type,State_Name, Assembly_No)
);
CREATE table if not exists pty_incumbency (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Party_ID INT,
	Party varchar(255),
	Year INT,
	pty_Total_Candidates INT,
	pty_Incumbents INT,
	pty_Turncoats INT,
	pty_Recontests INT,
	pty_First_contests INT,
	pty_Second_contests INT,
	pty_Multiple_contests INT,
	pty_first_time_winners INT,
	pty_First_Contest_winners INT,
	pty_Successful_Incumbents INT,
	pty_Successful_Turncoats INT,
	pty_incm_recontests_pct REAL,
	pty_incm_Strike_Rate REAL,
	pty_turn_Strike_Rate REAL,
	pty_fist_time_winners_pct REAL,
	No_Incumbents INT,
	No_first_time_winners INT,
	Color varchar(7),
	PRIMARY KEY (Election_Type,State_Name, Assembly_No,Party_ID)
);

CREATE table if not exists profession (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	TCPD_Prof_Main varchar(255),
	MLAs_var INT,
	PRIMARY KEY (Election_Type,State_Name, Assembly_No,TCPD_Prof_Main)
);

CREATE table if not exists education (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	MyNeta_education varchar(255),
	MLAs_var INT,
	PRIMARY KEY (Election_Type,State_Name, Assembly_No,MyNeta_education)
);

CREATE table if not exists pty_education (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Party_ID INT,
	Party varchar(255),
	Year INT,
	MyNeta_education varchar(255),
	MLAs_var_Party INT,
	Party_MLAs INT,
	pty_mla_var_perc REAL,
	PRIMARY KEY (Election_Type,State_Name, Assembly_No,Party_ID,MyNeta_education)
);

CREATE table if not exists pty_profession (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Party_ID INT,
	Party varchar(255),
	Year INT,
	TCPD_Prof_Main varchar(255),
	MLAs_var_Party INT,
	Party_MLAs INT,
	pty_mla_var_perc REAL,
	PRIMARY KEY (Election_Type,State_Name, Assembly_No,Party_ID,TCPD_Prof_Main)
);


CREATE USER 'ld_api'@'%' IDENTIFIED WITH mysql_native_password BY 'root';

GRANT SELECT on *.* to 'ld_api'@'%';
FLUSH PRIVILEGES;
