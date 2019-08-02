import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Assets/Styles/form.css'

export default class BrowseData extends Component {
  constructor(props){
        super(props);
        this.state = {electionType: ""};
        this.handleSelection = this.handleSelection.bind(this);
      }

handleSelection(e){
  if(e.target.name === "ElectionType"){
    this.setState({electionType: e.target.value});
  }
}

  render() {
    var electionType = this.state.electionType;
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3">
            <form className="well">
            <div className="form-group">
                  <label className="control-label" htmlFor="bd_electiontype_selector">Election Type</label>
                  <div>
                  <select id="bd_electiontype_selector" name="ElectionType" value={electionType} onChange={this.handleSelection}>
                    <option value="">Select Election Type</option>
                    <option value="GE">General Elections</option>
                    <option value="AE">Assembly Elections</option>
                  </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
       </div>
    </div>
    )
  }
}
