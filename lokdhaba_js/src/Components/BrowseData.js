import React, { Component } from 'react';
import Select from './Shared/Select.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BrowseData extends Component {
  constructor(props){
        super(props);
        this.state = {electionType: "", stateName: ""};
        this.onElectionTypeChange = this.onElectionTypeChange.bind(this);
        this.onStateNameChange = this.onStateNameChange.bind(this);
      }

  onElectionTypeChange(newValue){
    this.setState({electionType: newValue});
  }

  onStateNameChange(newValue){
    this.setState({stateName: newValue});
  }

  render() {
    var electionType = this.state.electionType;
    var stateName = this.state.stateName;
    var stateOptions = [];
    var electionTypeOptions = [{value: "", label: "Select Election Type"},
                              {value: "GE", label:"General Elections"},
                              {value: "AE", label:"Assembly Elections"}];
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3">
              <form className="well">
                <Select id="bd_electiontype_selector" label="Election Type" options = {electionTypeOptions} onChange={this.onElectionTypeChange} />
                {electionType !== "" && <Select id="bd_state_selector" label="State Name" options={stateOptions} onChange={this.onStateNameChange}/>}
              </form>
            </div>
          </div>
       </div>
    </div>
    )
  }
}
