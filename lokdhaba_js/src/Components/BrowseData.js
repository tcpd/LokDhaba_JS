import React, { Component } from 'react';
import Select from './Shared/Select.js';
import Checkbox from './Shared/Checkbox.js';
import Table from './Shared/Table.js';
import * as Constants from './Shared/Constants.js'
import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json'
import VidhanSabhaData from '../Assets/Data/AE_MasterSheet.json'
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BrowseData extends Component {
  constructor(props){
        super(props);
        this.state = {electionType: "", stateName: "", stateOptions: [], stateAssemblies: [], assembliedChecked: [], tableData: []};
      }

  componentDidMount(){
    var stateOptions = StateCodes.map(function(item){ return {value: item.State_Name, label: item.State_Name.replace(/_/g, " ")}});
    this.setState({stateOptions: stateOptions});
    //const url = "";
    //fetch(url, {
    //  method: "GET"
    //}).then(response => response.json()).then(tableData => {
    //  this.setState({tableData: tableData})
    //});
  }

  onElectionTypeChange = (newValue) => {
    this.setState({electionType: newValue});
  }

  onStateNameChange = (newValue) => {
    this.setState({stateName: newValue});
    var assemblies = VidhanSabhaNumber.filter(function(item){return item.state == newValue});
    this.setState({stateAssemblies: assemblies});
  }

  onAssemblyChecked = (newValue) => {
    this.setState({assembliedChecked: newValue});
  }

  createAssemblyCheckboxes = () => {
    let checkboxes = [];
    let scope = this;
    var stateAssemblies = scope.state.stateAssemblies;
    stateAssemblies.forEach(function(item){
      checkboxes.push(<Checkbox id={"bd_year_selector_" + item.value}  key={item.value} label={item.sa_no + " Assembly (" + item.year + ")"} onChange={scope.onAssemblyChecked} />)
    });
    return checkboxes;
  }

  render() {
    var electionType = this.state.electionType;
    var stateName = this.state.stateName;
    var stateAssemblies = this.state.stateAssemblies;
    var stateOptions = [{value: "", label: "Select State"}, {value: "all", label: "All"}].concat(this.state.stateOptions);
    var electionTypeOptions = [{value: "", label: "Select Election Type"},
                              {value: "GE", label:"General Elections"},
                              {value: "AE", label:"Assembly Elections"}];
    var columns = [];
    Constants.tableColumns.forEach(function(item){
      columns.push({Header: item, accessor: item});
    })
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3">
              <form className="well">
                <Select id="bd_electiontype_selector" label="Election Type" options = {electionTypeOptions} onChange={this.onElectionTypeChange} />
                {electionType !== "" && <Select id="bd_state_selector" label="State Name" options={stateOptions} onChange={this.onStateNameChange}/>}
                {stateName !== "" && this.createAssemblyCheckboxes()}
              </form>
            </div>
            <div className="col-xs-9">
            {stateAssemblies.length !== 0  && <Table columns={columns} data={VidhanSabhaData}/>}
            </div>
          </div>
       </div>
    </div>
    )
  }
}
