ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '<root password>';
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
	`Turnout_Percentage` Numeric(4,2),
	`Vote_Share_Percentage` Numeric(4,2),
	`Deposit_Lost` varchar(3),
	`Margin` INT,
	`Margin_Percentage` Numeric(4,2),
	`ENOP` REAL,
	`pid` varchar(255),
	`Party_Type_TCPD` varchar(255),
	`Party_ID` INT,
	`last_poll` BIT,
	`Contested` INT,
	`Last_Party` varchar(255),
	`Last_Party_ID` INT,
	`Last_Constituency_Name` varchar(255),
	`Same_Constituency` BIT,
	`Same_Party` BIT,
	`No_Terms` INT,
	`Turncoat` BIT,
	`Incumbent` BIT,
	`Recontest` BIT,
	`Age` INT,
	`District_Name` varchar(255),
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
	`Turnout_Percentage` Numeric(4,2),
	`Vote_Share_Percentage` Numeric(4,2),
	`Constituency_Type` varchar(50),
	`Electors` INT,
	`N_Cand` INT,
	`Position` INT NOT NULL,
	`Sex` varchar(10),
	`Party` varchar(50) NOT NULL,
	`Votes` INT,
	`Candidate` varchar(255) NOT NULL,
	`Margin_Percentage` Numeric(4,2) ,
	`Runner` varchar(255),
	`Runner_Party` varchar(50),
	`Runner_Sex` varchar(10),
	`Nota_Percentage` Numeric(4,2),
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
	`Vote_Share_Percentage` Numeric(4,2),
	`Constituency_Type` varchar(50),
	`Position` INT NOT NULL,
	`Party` varchar(50) NOT NULL,
	`Votes` INT,
	`Candidate` varchar(255) NOT NULL,
	PRIMARY KEY (`Election_Type`, `State_Name`,`Assembly_No`,`Constituency_No`,`Position`)
);
create table partysummary (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	Party varchar(50) NOT NULL,
	Total_Cand INT ,
	Winners INT NOT NULL,
	Deposit_Lost INT,
	Avg_Winning_Margin Numeric(4,2),
	Strike_Rate Numeric(4,2),
	PRIMARY KEY (Election_Type, State_Name,Assembly_No,Party)
);
create table seatshares (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	Party varchar(50) NOT NULL,
	partyseats INT,
	totalseats INT,
	Seats Numeric(4,2),
	position INT,
	PRIMARY KEY (Election_Type, State_Name,Assembly_No,Party)

);
create table voteshares_cont (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	Party varchar(50) NOT NULL,
	partyvotes INT,
	totalvotes INT,
	Vote_Share_Percentage Numeric(4,2),
	position INT,
	PRIMARY KEY (Election_Type, State_Name,Assembly_No,Party)

);
create table voteshares_total (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	Party varchar(50) NOT NULL,
	Vote_Share_Percentage Numeric(4,2),
	PRIMARY KEY (Election_Type, State_Name,Assembly_No,Party)
);

create table womens (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	Women_Percentage Numeric(4,2),
	PRIMARY KEY (Election_Type, State_Name,Assembly_No)
);
create table voter_turnout (
	Election_Type varchar(2) NOT NULL,
	State_Name varchar(50) NOT NULL,
	Assembly_No INT NOT NULL,
	Year INT NOT NULL,
	male Numeric(4,2),
	female Numeric(4,2),
	total Numeric(4,2),
	PRIMARY KEY (Election_Type, State_Name, Assembly_No)
);

CREATE USER '<mysql ld user>'@'%' IDENTIFIED WITH mysql_native_password BY '<mysql ld password>';

GRANT SELECT on *.* to 'ld_api'@'%';
FLUSH PRIVILEGES;
