/*
contains all the UI elements for data visualization page
internally calls the Charts and Maps components
*/

import React, { Component } from 'react';
import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import ChartsMapsCodes from '../Assets/Data/ChartsMapsCodes.json';
import Checkbox from './Shared/Checkbox.js';
import Select from './Shared/Select.js';
import VoterTurnoutChart from './Charts/VoterTurnoutChart.js';
import PartiesPresentedChart from './Charts/PartiesPresentedChart.js';
import PartyVoteShareChart from './Charts/PartyVoteShareChart.js';
import PartySeatShareChart from './Charts/PartySeatShareChart.js';
import PartyStrikeRateChart from './Charts/PartyStrikeRateChart.js';
import ContestedDepositLostChart from './Charts/ContestedDepositLostChart.js';
import ConstituencyTypeMap from './Maps/ConstituencyTypeMap.js';
import * as Constants from './Shared/Constants.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

export default class DataVisualization extends Component {
  constructor(props){
        super(props);
        this.state ={ electionType: "GE",
                      stateName: "",
                      AE_States: [],
                      visualization: "",
                      visualizationType: "",
                      visualizationOptions: [],
                      chartMapOptions: [],
                      year: "",
                      yearOptions: [],
                      party: "",
                      partyOptions: [],
                      showVisualization: false,
                      vizOptionsSelected: new Set(),
                      vizData: []};
      }

 componentDidMount(){
   var unique_AE_States = [...new Set(VidhanSabhaNumber.map(x => x.State_Name))];
   var visualizationOptions = [{value: "", label: "Chart/Map"}].concat(ChartsMapsCodes.map(function(item){return {value: item.modulename, label: item.title}}));
   var AE_States = [{value: "", label: "Select State"}].concat(unique_AE_States.map(function(item){ return {value: item, label:item.replace(/_/g, " ")}}));
   this.setState({AE_States: AE_States, visualizationOptions: visualizationOptions});
 }

 componentWillUpdate(nextProps, nextState) {
   if((nextState.visualization !== "" && this.state.visualization !== nextState.visualization && nextState.visualizationType === "Chart")
        || (nextState.year !== "" && this.state.year !== nextState.year && this.state.visualization !== "partyPositionsMap" && this.state.visualization !== "partyVoteShareMap")
            || (nextState.party !== "" && this.state.party !== nextState.party && (this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap"))){
     this.fetchChartMapOptions(nextState);
   }
 }

 onVisualizationChange = (newValue) => {
   this.setState({year: ""});
   this.setState({vizOptionsSelected: new Set()});
   this.setState({showVisualization: false});
   var visualizationType = ChartsMapsCodes.filter(function(item){return item.modulename === newValue})[0].type;
   this.setState({visualization: newValue});
   this.setState({visualizationType: visualizationType}, () => {
     if(visualizationType === "Map"){
       this.fetchMapYearOptions();
     }
   });
 }

 onStateNameChange = (newValue) => {
   this.setState({visualization: ""});
   this.setState({visualizationType: ""});
   this.setState({vizOptionsSelected: new Set()});
   this.setState({showVisualization: false});
   this.setState({stateName: newValue});
 }

 onElectionTypeChange = (e) => {
   this.setState({visualization: ""});
   this.setState({visualizationType: ""});
   this.setState({stateName: ""});
   this.setState({year: ""});
   this.setState({party: ""});
   this.setState({chartMapOptions: []});
   this.setState({showVisualization: false});
   let newValue = e.target.name;
   var activeItem = $("li.nav-item.active");
   activeItem.removeClass("active");
   $(e.target).parent().addClass("active");
   this.setState({electionType: newValue});
 }

 fetchVisualizationData = () => {
   let electionType = this.state.electionType;
   let stateName = this.state.stateName;
   let visualization = this.state.visualization;
   let visualizationType = this.state.visualizationType;
   let assemblyNumber = this.state.year;
   let party = this.state.party;
   let legends = this.state.vizOptionsSelected;
   const url = Constants.baseUrl + "/data/api/v1.0/getVizData";
   fetch(url, {
     method: "POST",
     headers: new Headers({
       "content-type": "application/json"
     }),
     body: JSON.stringify({ElectionType : electionType,
                           StateName: stateName,
                           ModuleName: visualization,
                           VizType: visualizationType,
                           AssemblyNo: assemblyNumber,
                           Party: party,
                           Legends: [...legends]
                           })
     }).then(response => response.json()).then(resp => {
          var data = visualizationType === "Map" ? JSON.parse(resp.data) : resp.data;
          this.setState({vizData: data});
          var checked = ChartsMapsCodes.filter(function(item) {return item.modulename === visualization})[0].alloptionschecked;
          if(checked){
            this.setState({showVisualization: true});
          }
     });
 }

 fetchMapYearParties = () => {
   let electionType = this.state.electionType;
   let stateName = this.state.stateName;
   let visualization = this.state.visualization;
   let visualizationType = this.state.visualizationType;
   let assemblyNumber = this.state.year;
   const url = Constants.baseUrl + "/data/api/v1.0/getMapYearParty";
   fetch(url, {
     method: "POST",
     headers: new Headers({
       "content-type": "application/json"
     }),
     body: JSON.stringify({ElectionType : electionType,
                           StateName: stateName,
                           ModuleName: visualization,
                           VizType: visualizationType,
                           AssemblyNo: assemblyNumber
                           })
     }).then(response => response.json()).then(resp => {
       var data = [{value: "", label: "Select Party"}];
       var data = data.concat(resp.data.map(function(item) {return {label: item, value: item}}));
       this.setState({partyOptions: data});
     });
 }

 fetchMapYearOptions = () => {
   let electionType = this.state.electionType;
   let stateName = this.state.stateName;
   let visualization = this.state.visualization;
   let visualizationType = this.state.visualizationType;
   const url = Constants.baseUrl + "/data/api/v1.0/getMapYear";
   fetch(url, {
     method: "POST",
     headers: new Headers({
       "content-type": "application/json"
     }),
     body: JSON.stringify({ElectionType : electionType,
                           StateName: stateName,
                           ModuleName: visualization,
                           VizType: visualizationType
                           })
     }).then(response => response.json()).then(resp => {
       var data = [{value: "", label: "Select Year"}];
       var data = data.concat(resp.data.map(function(item) {return {label: `${item.Year} (#${item.Assembly_No})`, value: item.Assembly_No}}));
       this.setState({yearOptions: data});
     });
 }

 fetchChartMapOptions = (state) => {
   let electionType = state.electionType;
   let stateName = state.stateName;
   let visualization = state.visualization;
   let visualizationType = state.visualizationType;
   const url = Constants.baseUrl + "/data/api/v1.0/getVizLegend";
   fetch(url, {
     method: "POST",
     headers: new Headers({
       "content-type": "application/json"
     }),
     body: JSON.stringify({ElectionType : electionType,
                           StateName: stateName,
                           ModuleName: visualization,
                           VizType: visualizationType
                           })
     }).then(response => response.json()).then(resp => {
       this.setState({chartMapOptions: resp.data});
       var checked = ChartsMapsCodes.filter(function(item) {return item.modulename === visualization})[0].alloptionschecked;
       if(checked){
         this.setState({vizOptionsSelected: new Set(resp.data.map(x => x.replace(/_/g, "")))}, () => {
           this.fetchVisualizationData();
         });
       }
     });
 }

 chartMapOptionChecked = (key, checked) => {
   var vizOptionsSelected = this.state.vizOptionsSelected;
   if(checked){
     vizOptionsSelected.add(key);
   }else{
     vizOptionsSelected.delete(key);
   }
   this.setState({vizOptionsSelected: vizOptionsSelected}, () => {
     if(vizOptionsSelected.size > 0){
        this.fetchVisualizationData();
        this.setState({showVisualization : true});
      }else{
        this.setState({showVisualization : false});
      }
   });
 }

 createOptionsCheckboxes = () => {
   var checkboxes = [];
   var scope = this;
   var visualization = scope.state.visualization;
   var vizOptionsSelected = scope.state.vizOptionsSelected;
   var label = ChartsMapsCodes.filter(function(item) {return item.modulename === scope.state.visualization})[0].optionslabel;
   var chartMapOptions = scope.state.chartMapOptions;
   chartMapOptions.forEach(function(item){
     var checked = vizOptionsSelected.has(item.replace(/_/g, ""));
     checkboxes.push(<Checkbox id={"dv_" + visualization + "_filter_" + item.replace(/_/g, "")} checked={checked} key={item.replace(/_/g, "")} label={item.replace(/_/g, " ")} onChange={scope.chartMapOptionChecked} />)
   });
   if(checkboxes.length > 0){
     return <div>
              <label>{label}</label>
              {checkboxes}
            </div>;
        }
 }

 renderVisualization = () => {
   var data = this.state.vizData;
   var dataFilterOptions = this.state.vizOptionsSelected;
   var electionType = this.state.electionType;
   var stateName = this.state.stateName;
   var visualization = this.state.visualization;
   var assemblyNo = this.state.year;
   switch(visualization){
     case "voterTurnoutChart":
        return <VoterTurnoutChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName}/>;
     case "partiesPresentedChart":
        return <PartiesPresentedChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName}/>;
     case "tvoteShareChart":
     case "cvoteShareChart":
        return <PartyVoteShareChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName}/>;
     case "seatShareChart":
        return <PartySeatShareChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName}/>;
     case "strikeRateChart":
        return <PartyStrikeRateChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName}/>;
     case "contestedDepositSavedChart":
        return <ContestedDepositLostChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName}/>;
     case "winnerCasteMap":
        return <ConstituencyTypeMap data={data} electionType={electionType} assemblyNo={assemblyNo}/>;
     default:
        return;
   }
 }

 onPartyChange = (newValue) => {
   this.setState({party: newValue});
 }

 onYearChange = (newValue) => {
   this.setState({year: newValue}, () => {
     if(this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap"){
       this.fetchMapYearParties();
     }
   });
 }

render() {
 var electionType = this.state.electionType;
 var stateOptions = this.state.AE_States;
 var stateName = this.state.stateName;
 var visualization = this.state.visualization;
 var visualizationOptions = this.state.visualizationOptions;
 var visualizationType = this.state.visualizationType;
 var yearOptions = this.state.yearOptions;
 var year = this.state.year;
 var party = this.state.party;
 var partyOptions = this.state.partyOptions;
 var showVisualization = this.state.showVisualization;

 return (
   <div className="content">
     <div className="container-fluid">
       <div className="row">
         <div className="col-xs-3">
           <form className="well">
            <nav className="navbar navbar-expand-sm bg-light" role="navigation">
              <ul className="navbar-nav">
                <li className="nav-item active">
                <a className="nav-link" name={"GE"} onClick={this.onElectionTypeChange}>Lok Sabha</a>
               </li>
               <li className="nav-item">
                <a className="nav-link" name={"AE"} onClick={this.onElectionTypeChange}>Vidhan Sabha</a>
               </li>
              </ul>
             </nav>
             {electionType === "AE" && <Select id="dv_state_selector" label="State" options={stateOptions} onChange={this.onStateNameChange}/>}
             {(electionType === "GE" || (electionType === "AE" && stateName !== "")) && <Select id="dv_visualization_selector" label="Visualization" selectedValue={visualization} options={visualizationOptions} onChange={this.onVisualizationChange}/>}
             {visualizationType === "Map" && <Select id="dv_year_selector" label="Select Year" options={yearOptions} onChange={this.onYearChange}/>}
             {year !== "" && (visualization === "partyPositionsMap" || visualization === "partyVoteShareMap") && <Select id="dv_party_selector" label="Select Party" options={partyOptions} onChange={this.onPartyChange}/>}
             {(( visualizationType === "Chart") || (visualizationType === "Map" && year !== "")) && this.createOptionsCheckboxes()}
           </form>
         </div>
         <div className="col-xs-9">
          {showVisualization && this.renderVisualization()}
         </div>
        </div>
      </div>
    </div>
    )
  }
}
