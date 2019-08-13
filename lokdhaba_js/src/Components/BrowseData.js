import React, { Component } from 'react';
import $ from 'jquery';
import Select from './Shared/Select.js';
import Checkbox from './Shared/Checkbox.js';
import Table from './Shared/Table.js';
import * as Constants from './Shared/Constants.js'
import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import LokSabhaNumber  from '../Assets/Data/LokSabhaNumber.json'
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BrowseData extends Component {
  constructor(props){
        super(props);
        this.state = {electionType: "", stateName: "", GE_States: [], AE_States: [], stateOptions: [], stateAssemblies: [], assembliesChecked: new Set(), tableData: [], allChecked: false};
      }

  componentDidMount(){
    var GE_States = StateCodes.map(function(item){ return {value: item.State_Name, label: item.State_Name.replace(/_/g, " ")}});
    var unique_AE_States = [...new Set(VidhanSabhaNumber.map(x => x.State_Name))];
    var AE_States = unique_AE_States.map(function(item){ return {value: item, label:item.replace(/_/g, " ")}});
    this.setState({GE_States: GE_States});
    this.setState({AE_States: AE_States});
  }

  onElectionTypeChange = (newValue) => {
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
    this.setState({stateName: newValue});
    let assemblies;
    if(this.state.electionType === "AE"){
      assemblies = VidhanSabhaNumber.filter(function(item){return item.State_Name === newValue});
    }else if(this.state.electionType === "GE"){
      if(newValue === "all"){
        this.setState({allChecked: true});
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

  fetchTableData = () => {
    let electionType = this.state.electionType;
    let stateName = this.state.stateName.replace('&', "%26");
    let assemblyNumber = [...this.state.assembliesChecked].join(",");
    const url = `http://10.1.17.230:5000/data/api/v1.0/getDerivedData?ElectionType=${electionType}&StateName=${stateName}&AssemblyNo=${assemblyNumber}`;
    fetch(url, {
     method: "GET"
    }).then(response => response.json()).then(resp => {
     this.setState({tableData: resp.data});
    });
  }

  onAssemblyChecked = (key, checked) => {
    var assembliesChecked = this.state.assembliesChecked;
    if(checked){
      assembliesChecked.add(key);
    }else{
      assembliesChecked.delete(key);
    }
    this.setState({assembliesChecked: assembliesChecked});
    this.fetchTableData();
  }

  toggleAllCheckboxes = (key, checked) => {
    var assemblies = this.state.assembliesChecked;
    assemblies.clear();
    if(checked){
      assemblies.add(key);
    }else{
      assemblies.delete(key);
    }
    this.setState({assembliesChecked: assemblies});
    this.setState({allChecked: checked});
    this.fetchTableData();
  }

  createAssemblyCheckboxes = () => {
    let checkboxes = [];
    let scope = this;
    var isChecked = this.state.allChecked;
    var stateAssemblies = scope.state.stateAssemblies;
    checkboxes.push(<Checkbox id={"bd_year_selector_all" }  key={0} label={"Select All"} checked={isChecked} onChange={scope.toggleAllCheckboxes}/>)
    stateAssemblies.forEach(function(item){
      checkboxes.push(<Checkbox id={"bd_year_selector_" + item.Assembly_No} checked={isChecked} key={item.Assembly_No} label={item.Assembly_No + " Assembly (" + item.Year + ")"} onChange={scope.onAssemblyChecked} />)
    });
    return checkboxes;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.stateName !== this.state.stateName) {
      this.setState({allChecked: false});
    }
  }

  render() {
    var electionType = this.state.electionType;
    var stateName = this.state.stateName;
    var assembliesChecked = this.state.assembliesChecked;
    var stateOptions = this.state.stateOptions;
    var electionTypeOptions = [{value: "", label: "Select Election Type"},
                              {value: "GE", label:"General Elections"},
                              {value: "AE", label:"Assembly Elections"}];
    var columns = [];
    Constants.tableColumns.forEach(function(item){
      columns.push({Header: item, accessor: item });
    })
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3" style={{width: "20%"}}>
              <form className="well">
                <Select id="bd_electiontype_selector" label="Election Type" options = {electionTypeOptions} onChange={this.onElectionTypeChange} />
                {electionType !== "" && <Select id="bd_state_selector" label="State Name" options={stateOptions} onChange={this.onStateNameChange}/>}
                {stateName !== "" && this.createAssemblyCheckboxes()}
              </form>
            </div>
            <div className="col-xs-9" style={{width: "80%"}}>
            {assembliesChecked.size > 0  && <Table columns={columns} data={this.state.tableData}/>}
            </div>
          </div>
       </div>
    </div>
    )
  }
}
