import React, { Component } from 'react';
import { CSVLink, CSVDownload } from "react-csv";
import $ from 'jquery';
import Select from './Shared/Select.js';
import Checkbox from './Shared/Checkbox.js';
import Modal from './Shared/Modal.js';
import Table from './Shared/Table.js';
import * as Constants from './Shared/Constants.js'
import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import LokSabhaNumber  from '../Assets/Data/LokSabhaNumber.json'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BrowseData extends Component {
  constructor(props){
        super(props);
        this.state = {electionType: "", stateName: "", GE_States: [], AE_States: [], stateOptions: [], stateAssemblies: [], assembliesChecked: new Set(), tableData: [], allChecked: false, showTemsAndConditionsPopup: false, csvData: [], isDataDownloadable: false};
      }

  componentDidMount(){
    var GE_States = StateCodes.map(function(item){ return {value: item.State_Name, label: item.State_Name.replace(/_/g, " ")}});
    var unique_AE_States = [...new Set(VidhanSabhaNumber.map(x => x.State_Name))];
    var AE_States = unique_AE_States.map(function(item){ return {value: item, label:item.replace(/_/g, " ")}});
    this.setState({GE_States: GE_States});
    this.setState({AE_States: AE_States});
  }

  CloseTemsAndConditionsPopup = () => {
    this.setState({showTemsAndConditionsPopup : false});
  }

 showTemsAndConditionsPopup = () => {
    this.setState({showTemsAndConditionsPopup : true});
    this.fetchDownloadData();
    this.setState({isDataDownloadable : true});
  }

  downloadData = () => {
    this.setState({isDataDownloadable: true});
  }

  onElectionTypeChange = (newValue) => {
    if (newValue !== this.state.electionType) {
      this.setState({stateName: ""});
    }
    this.setState({electionType: newValue});
    let stateOptions;
    if(newValue === "GE"){
      stateOptions = [{value: "", label: "Select State"}, {value: "all", label: "All"}].concat(this.state.GE_States);
    }else if(newValue === "AE"){
      stateOptions = [{value: "", label: "Select State"}].concat(this.state.AE_States);
    }
    this.setState({stateOptions: stateOptions});
  }

  onStateNameChange = (newValue) => {
    this.setState({assembliesChecked: new Set()});
    this.setState({allChecked: false});
    this.setState({stateName: newValue});
    let assemblies;
    if(this.state.electionType === "AE"){
      assemblies = VidhanSabhaNumber.filter(function(item){return item.State_Name === newValue});
    }else if(this.state.electionType === "GE"){
      if(newValue === "all"){
        assemblies = [...new Set(LokSabhaNumber.map(s => s.Assembly_No))]
        .map(Assembly_No => {
          return {
            Assembly_No: Assembly_No,
            Year: LokSabhaNumber.find(s => s.Assembly_No === Assembly_No).Year
          };
        });
      }else{
        assemblies = LokSabhaNumber.filter(function(item){return item.State_Name === newValue});
      }
    }
    this.setState({stateAssemblies: assemblies});
  }

  fetchDownloadData = () =>{
    let electionType = this.state.electionType;
    let stateName = this.state.stateName;
    let assemblyNumber = [...this.state.assembliesChecked].join(",");
    const url = `http://10.1.19.77:5000/data/api/v1.0/DataDownload`;
    fetch(url, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json"
      }),
      body: JSON.stringify({ElectionType : electionType,
                            StateName: stateName,
                            AssemblyNo: assemblyNumber,
                            Filters: []
                            })
      }).then(response => response.json()).then(resp => {
        debugger;
        console.log(resp.data);
        this.setState({csvData: resp.data});
      });
  }

  fetchTableData = (pageSize = 100, page = 0, sorted = [] , filtered = []) => {
    return new Promise((resolve, reject) => {
      let electionType = this.state.electionType;
      let stateName = this.state.stateName;
      let assemblyNumber = [...this.state.assembliesChecked].join(",");
      const url = `http://10.1.19.77:5000/data/api/v2.0/getDerivedData`;
      fetch(url, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json"
        }),
        body: JSON.stringify({ElectionType : electionType,
                              StateName: stateName,
                              AssemblyNo: assemblyNumber,
                              PageNo: page,
                              PageSize: pageSize,
                              Filters: filtered,
                              SortOptions: sorted
                              })
      }).then(response => response.json()).then(resp => {
        this.setState({tableData: resp.data});
        const res = {
          rows: resp.data,
          pages: resp.pages
        };
        setTimeout(() => resolve(res), 500);
      });
    });
  }

  onAssemblyChecked = (key, checked) => {
    var assembliesChecked = this.state.assembliesChecked;
    if(key === "all"){
      assembliesChecked.clear();
      this.setState({allChecked: checked});
    }
    if(checked){
      assembliesChecked.add(key);
    }else{
      assembliesChecked.delete(key);
    }
    this.setState({assembliesChecked: assembliesChecked});
    assembliesChecked.size > 0 && this.fetchTableData();
  }

  createAssemblyCheckboxes = () => {
    let checkboxes = [];
    let scope = this;
    var isChecked = this.state.allChecked;
    var stateAssemblies = scope.state.stateAssemblies;
    checkboxes.push(<Checkbox id={"bd_year_selector_all" }  key={0} label={"Select All"} checked={isChecked} onChange={scope.onAssemblyChecked}/>)
    stateAssemblies.forEach(function(item){
      var checked = scope.state.assembliesChecked.has(item.Assembly_No.toString()) ? true: isChecked;
      checkboxes.push(<Checkbox id={"bd_year_selector_" + item.Assembly_No} checked={checked} key={item.Assembly_No} label={item.Assembly_No + " Assembly (" + item.Year + ")"} onChange={scope.onAssemblyChecked} />)
    });
    return checkboxes;
  }

  render() {
    var electionType = this.state.electionType;
    var stateName = this.state.stateName;
    var assembliesChecked = this.state.assembliesChecked;
    var stateOptions = this.state.stateOptions;
    var csvData = this.state.csvData;
    var csvHeaders = this.state.csvHeaders;
    var isDataDownloadable = this.state.isDataDownloadable;
    var showTemsAndConditionsPopup = this.state.showTemsAndConditionsPopup;
    var electionTypeOptions = [{value: "", label: "Select Election Type"},
                              {value: "GE", label:"General Elections"},
                              {value: "AE", label:"Assembly Elections"}];
    var columns = [];
    Constants.tableColumns.forEach(function(item){
      columns.push({Header: item, accessor: item });
    })
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var filename = `TCPD_${this.state.electionType}_${this.state.stateName}_${date}.csv`
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3" style={{width: "20%"}}>
              <form className="well">
                <Select id="bd_electiontype_selector" label="Election Type" options = {electionTypeOptions} onChange={this.onElectionTypeChange} />
                {electionType !== "" && <Select id="bd_state_selector" label="State Name" options={stateOptions} onChange={this.onStateNameChange}/>}
                {stateName !== "" && this.createAssemblyCheckboxes()}
                {assembliesChecked.size > 0 && !isDataDownloadable && <Button variant="primary" onClick={this.showTemsAndConditionsPopup}> Download </Button>}
                {showTemsAndConditionsPopup && <Modal id="tems_and_conditions_popup" show={showTemsAndConditionsPopup} body={<p>BODY!!</p>} heading={<p>Terms and Conditions</p>} handleClose={this.CloseTemsAndConditionsPopup} onSubmit={this.downloadData} />}
                {isDataDownloadable && <CSVLink data={csvData} filename={filename}>Download Data</CSVLink>}
                </form>
            </div>
            <div className="col-xs-9" style={{width: "80%"}}>
            {assembliesChecked.size > 0  && <Table columns={columns} data={this.state.tableData} fetchData={this.fetchTableData}/>}
            </div>
          </div>
       </div>
    </div>
    )
  }
}


//{showTemsAndConditionsPopup && <Modal id="tems_and_conditions_popup" show={showTemsAndConditionsPopup} body={<p>BODY!!</p>} heading={<p>Terms and Conditions</p>} handleClose={this.CloseTemsAndConditionsPopup} onSubmit={this.downloadData} />}
//{isDataDownloadable && <CSVLink data={csvData} filename={"test-data.csv"}>Download Data</CSVLink>}
//{isDataDownloadable && <a href="" onClick={this.downloadData}>Download Data</a>}
