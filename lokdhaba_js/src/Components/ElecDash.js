import React, { Component } from 'react';
import LdSelect from './Shared/Select.js';
import BarChart from './Shared/BarChart';
import * as Constants from './Shared/Constants.js'
import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import LokSabhaNumber from '../Assets/Data/LokSabhaNumber.json'
import { Button } from 'react-bootstrap';





export default class ElecDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateName:"",
      electionStates:["Uttar_Pradesh","Uttarakhand","Punjab","Goa","Manipur"],
      stateTurnoutData:[],
      turnoutMapData:[],
      mapData:[]
    };
  }


  componentDidMount() {



  }

  componentWillUpdate(nextProps, nextState) {


  }
  fetchVTData =(props )=>{
    return new Promise((resolve, reject) => {
      const url = Constants.baseUrl + "/data/api/v1.0/getVizData";
      fetch(url, {
        method: "POST",
        mode:"cors",
        headers: new Headers({
          "content-type": "application/json"
        }),
        body: JSON.stringify({
          ElectionType: "AE",
          StateName: props.stateName,
          ModuleName: props.viz,
          VizType: "Chart"
        })
      }).then(response => response.json()).then(resp => {

        this.setState({ [props.stateVar]: resp.data });
        setTimeout(() => resolve(resp.data), 500);
      });
    });
  }
  fetchStateData = (newValue) => {
    let stateName = newValue;
    let props = {
      stateName : newValue,
      viz: "voterTurnoutChart",
      stateVar:"stateTurnoutData"
    }
    this.fetchVTData(props);
  }

  onStateNameChange = (newValue) =>{
    this.fetchStateData(newValue);
    this.setState({ stateName: newValue });
  }

  renderTurnoutVisualization =()=>{
    var {stateName, stateTurnoutData} = this.state;
    var layout = {
      title: `Voter turnout across years in ${stateName} Vidhan Sabha`,
      xaxis: {
        title: 'Year (Assembly Number)'
      },
      yaxis: {
        title: 'Turnout in %',
        range: [0, 100],
        autorange: false
      }
    };
    var dataFilterOptions = new Set(["male","female","total"]);
    var vizParameters = [... dataFilterOptions].map(function(item){return{value: item, label: item.replace(/_/g, " ") ,dataFilterOptionName:item}});



    return(
      <div className="row">
      <div className="column chart" style={{width: "50%", padding: "0.5rem"}}>
      <BarChart
        layout={layout}
        vizParameters={vizParameters}
        data={stateTurnoutData}
        dataFilterOptions = {dataFilterOptions}
      />
      </div>
      <div className="column map" style={{width: "50%", padding: "0.5rem"}}>

      </div>
      </div>
    )
  }
  render() {
    var electionStates = this.state.electionStates;
    var stateName = this.state.stateName;
    var States = electionStates.map(function (item) { return { value: item, label: item.replace(/_/g, " ") } });

    return (
      <div className="content overflow-auto">
        <div>
            <LdSelect id="ed_state_selector" label="Select State" options={States} selectedValue={stateName} onChange={this.onStateNameChange} />
        </div>
        {stateName!=="" && this.renderTurnoutVisualization()}
      </div>
    )
  }
}
