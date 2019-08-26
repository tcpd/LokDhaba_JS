import React, { Component } from 'react';
import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import Select from './Shared/Select.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

export default class DataVisualization extends Component {
  constructor(props){
        super(props);
        this.state ={ electionType: "Lok Sabha", stateOptions: [], AE_States: [], visualization: "", visualizationOptions: [] };
      }

 componentDidMount(){
   var unique_AE_States = [...new Set(VidhanSabhaNumber.map(x => x.State_Name))];
   var AE_States = unique_AE_States.map(function(item){ return {value: item, label:item.replace(/_/g, " ")}});
   this.setState({AE_States: AE_States, });
 }

 componentWillUpdate(nextProps, nextState) {

 }

 onVisualizationChange = (e) => {

 }

 onElectionTypeChange = (e) => {
   let newValue = e.target.innerText;
   var activeItem = $("li.nav-item.active");
   activeItem.removeClass("active");
   $(e.target).parent().addClass("active");
   this.setState({electionType: newValue});
   let stateOptions;
   if(newValue === "Vidhan Sabha"){
     stateOptions = [{value: "", label: "Select State"}].concat(this.state.AE_States);
   }
   this.setState({stateOptions: stateOptions});
 }

render() {
 var electionType = this.state.electionType;
 var stateOptions = this.state.AE_States;
 var visualizationOptions = [];
 return (
   <div className="content">
     <div className="container-fluid">
       <div className="row">
         <div className="col-xs-3">
           <form className="well">
            <nav className="navbar navbar-expand-sm bg-light" role="navigation">
              <ul className="navbar-nav">
                <li className="nav-item active">
                <a className="nav-link" onClick={this.onElectionTypeChange}>Lok Sabha</a>
               </li>
               <li className="nav-item">
                <a className="nav-link" onClick={this.onElectionTypeChange}>Vidhan Sabha</a>
               </li>
              </ul>
             </nav>
             {electionType === "Vidhan Sabha" && <Select id="dv_state_selector" label="State" options={stateOptions} onChange={this.onStateNameChange}/>}
             <Select id="dv_visualization_selector" label="Visualization" options={visualizationOptions} onChange={this.onVisualizationChange}/>
           </form>
         </div>
         <div className="col-xs-9">
         </div>
        </div>
      </div>
    </div>
    )
  }
}
