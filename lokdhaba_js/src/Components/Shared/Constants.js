/*
Holds any constants used across the project
*/

import React from 'react';
import ReactTooltip from 'react-tooltip'
import Tooltip from 'rc-tooltip'


export const baseUrl = "http://0.0.0.0:15000";


export const tableColumns = [
    {
      minWidth: 160,
      Header: "State",
      accessor: "State_Name",
      Cell: row => <span text-overflow="ellipsis" data-tip={row.value}>{row.value} <ReactTooltip place="left" type="dark" effect="solid"/></span>
    },
    {
      Header: "Year",
      accessor: "Year",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      minWidth: 160,
      Header: "Candidate",
      accessor: "Candidate",
      Cell: row => <span text-overflow="ellipsis" data-tip={row.value}>{row.value} <ReactTooltip place="left" type="dark" effect="solid"/></span>
    },
    {
      Header: "Sex",
      accessor: "Sex"
    },
    {
      Header: "Party",
      accessor: "Party"
    },
    {
      minWidth: 160,
      Header: "Constituency Name",
      accessor: "Constituency_Name",
      Cell: row => <span text-overflow="ellipsis" data-tip={row.value}>{row.value} <ReactTooltip place="left" type="dark" effect="solid"/></span>
    },
    {
      Header: "Position",
      accessor: "Position",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Poll No",
      accessor: "Poll_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Votes",
      accessor: "Votes",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Age",
      accessor: "Age",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Candidate Type",
      accessor: "Candidate_Type"
    },
    {
      Header: "Valid Votes",
      accessor: "Valid_Votes",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Electors",
      accessor: "Electors",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Constituency Type",
      accessor: "Constituency_Type"
    },
    {
      Header: "District",
      accessor: "District_Name"
    },
    {
      Header: "Sub Region",
      accessor: "Sub_Region"
    },
    {
      Header: "N_Cand",
      accessor: "N_Cand",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Turnout %",
      accessor: "Turnout_Percentage",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Vote Share %",
      accessor: "Vote_Share_Percentage",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Deposit Lost",
      accessor: "Deposit_Lost"
    },
    {
      Header: "Margin",
      accessor: "Margin",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Margin %",
      accessor: "Margin_Percentage",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "pid",
      accessor: "pid"
    },{
      Header: "Education Level",
      accessor: "MyNeta_education"
    },
    {
      Header: "Primary Profession Category",
      accessor: "TCPD_Prof_Main"
    },
    {
      Header: "Primary Profession Type",
      accessor: "TCPD_Prof_Main_Desc"
    },
    {
      Header: "Secondary Profession Category",
      accessor: "TCPD_Prof_Second"
    },
    {
      Header: "Secondary Profession Type",
      accessor: "TCPD_Prof_Second_Desc"
    },
    {
      Header: "Party ID",
      accessor: "PartyID"
    },
    {
      Header: "Party Type",
      accessor: "Party_Type_TCPD"
    },
    {
      Header: "Normalized_Party",
      accessor: "Normalized_Party"
    },
    {
      Header: "Max_Poll_No",
      accessor: "Max_Poll_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "last_poll",
      accessor: "last_poll"
    },
    {
      Header: "Contested",
      accessor: "Contested",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Last_Party",
      accessor: "Last_Party"
    },
    {
      Header: "Last_Constituency_Name",
      accessor: "Last_Constituency_Name"
    },
    {
      Header: "Same_Constituency",
      accessor: "Same_Constituency"
    },
    {
      Header: "Same_Party",
      accessor: "Same_Party"
    },
    {
      Header: "No_Mandates",
      accessor: "No_Mandates",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Turncoat",
      accessor: "Turncoat"
    },
    {
      Header: "Incumbent",
      accessor: "Incumbent"
    },
    {
      Header: "Recontest",
      accessor: "Recontest"
    },
    {
      Header: "ENOP",
      accessor: "ENOP",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Assembly No",
      accessor: "Assembly_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Constituency No",
      accessor: "Constituency_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "month",
      accessor: "month",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "DelimID",
      accessor: "DelimID",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
]
export const segmentTableColumns = [
    {
      minWidth: 160,
      Header: "State",
      accessor: "State_Name",
      Cell: row => <span text-overflow="ellipsis" data-tip={row.value}>{row.value} <ReactTooltip place="left" type="dark" effect="solid"/></span>
    },
    {
      Header: "Year",
      accessor: "Year",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      minWidth: 160,
      Header: "Candidate",
      accessor: "Candidate",
      Cell: row => <span text-overflow="ellipsis" data-tip={row.value}>{row.value} <ReactTooltip place="left" type="dark" effect="solid"/></span>
    },
    {
      Header: "Sex",
      accessor: "Sex"
    },
    {
      Header: "Party",
      accessor: "Party"
    },
    {
      minWidth: 160,
      Header: "AC Segment Name",
      accessor: "Constituency_Name",
      Cell: row => <span text-overflow="ellipsis" data-tip={row.value}>{row.value} <ReactTooltip place="left" type="dark" effect="solid"/></span>
    },
    {
      Header: "Position",
      accessor: "Position",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      minWidth: 160,
      Header: "PC Name",
      accessor: "PC_Name",
      Cell: row => <span text-overflow="ellipsis" data-tip={row.value}>{row.value} <ReactTooltip place="left" type="dark" effect="solid"/></span>
    },
    {
      Header: "Poll No",
      accessor: "Poll_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Votes",
      accessor: "Votes",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Age",
      accessor: "Age",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Candidate Type",
      accessor: "Candidate_Type"
    },
    {
      Header: "Valid Votes",
      accessor: "Valid_Votes",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Constituency Type",
      accessor: "Constituency_Type"
    },
    {
      Header: "N_Cand",
      accessor: "N_Cand",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Turnout %",
      accessor: "Turnout_Percentage",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Vote Share %",
      accessor: "Vote_Share_Percentage",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Deposit Lost",
      accessor: "Deposit_Lost"
    },
    {
      Header: "Margin",
      accessor: "Margin",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Margin %",
      accessor: "Margin_Percentage",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "pid",
      accessor: "pid"
    },
    {
      Header: "Party ID",
      accessor: "PartyID"
    },
    {
      Header: "last_poll",
      accessor: "last_poll"
    },
    {
      Header: "ENOP",
      accessor: "ENOP",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "Assembly No",
      accessor: "Assembly_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "AC Segment No",
      accessor: "Constituency_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "PC No",
      accessor: "PC_No",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "month",
      accessor: "month",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
    {
      Header: "DelimID",
      accessor: "DelimID",
      Cell: row => (<div style={{ textAlign: "right" }}>{row.value}</div>)
    },
]

export const mapColorCodes = {
  normalMap: {minColor: 'ffffff', maxColor: 'B83027'},
  changeMap: {minColor: 'cc3300', maxColor: '006600'},
  dataUnavailabe: {color: '#BFC9CA'},
}
