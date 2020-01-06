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
import NumCandidatesMap from './Maps/NumCandidatesMap.js';
import VoterTurnoutMap from './Maps/VoterTurnoutMap.js';
import WinnerGenderMap from './Maps/WinnerGenderMap.js';
import VictoryMarginMap from './Maps/VictoryMarginMap.js';
import WinnerVoteShareMap from './Maps/WinnerVoteShareMap.js';
import PartyVoteShareMap from './Maps/PartyVoteShareMap.js';
import PartyPositionsMap from './Maps/PartyPositionsMap.js';
import WinnerMap from './Maps/WinnerMap.js';
import NotaTurnoutMap from './Maps/NotaTurnoutMap.js';
import * as Constants from './Shared/Constants.js';
import Popup from './Shared/Popup.js';
import { CSVLink } from "react-csv";
import { Button } from 'react-bootstrap';
import $ from 'jquery';

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

function getParams(location) {
  return new URLSearchParams(location.search);
}

function setParams(props ) {
  const { location, variable, val } = props;
  const searchParams = new URLSearchParams(location.search);
  searchParams.set(variable, val || "");
  return searchParams.toString();
}


export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    let inputs = getParams(props.location);
    var et = inputs.get("et") || "";
    this.state = {
      electionType: et===""?"GE":et,
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
      vizData: [],
      mapData :[],
      isDataDownloadable: false,
      showTermsAndConditionsPopup: false
    };
  }

  updateURL = (props) => {
    const { variable, val } = props
    const url = setParams({ location: this.props.location, variable:variable, val: val });
    this.props.history.push(`?${url}`);
  };


  componentDidMount() {
    var unique_AE_States = [...new Set(VidhanSabhaNumber.sort(compareValues('State_Name')).map(x => x.State_Name))];
    var visualizationOptions = [{ value: "", label: "Chart/Map" }].concat(ChartsMapsCodes.map(function (item) { return { value: item.modulename, label: item.title } }));
    var AE_States = [{ value: "", label: "Select State" }].concat(unique_AE_States.map(function (item) { return { value: item, label: item.replace(/_/g, " ") } }));
    this.setState({ AE_States: AE_States, visualizationOptions: visualizationOptions });

    let inputs = getParams(this.props.location);
    var st = inputs.get("st") || "";
    if(st !== "" ){this.onStateNameChange(st);}
    var viz = inputs.get("viz") || "";
    if(viz !== "" ){this.onVisualizationChange(viz);}
    var an = inputs.get("an") || "";
    if(an !== "" ){this.onYearChange(an);}
    var pty = inputs.get("pty") || "";
    if(pty !== ""){this.onPartyChange(pty);}

    var options = inputs.get("opt") || "";
    if(options !== ""){
      var selected_options = options.replace(/%2C/g,",").split(",");
      this.state.vizOptionsSelected = new Set(selected_options);
      for(var an =0; an < selected_options.length;an++){
        this.chartMapOptionChecked(selected_options[an],true);
      }
    }


  }

  componentWillUpdate(nextProps, nextState) {
    if ((nextState.visualization !== "" && this.state.visualization !== nextState.visualization && nextState.visualizationType === "Chart")
      || (nextState.year !== "" && this.state.year !== nextState.year && this.state.visualization !== "partyPositionsMap" && this.state.visualization !== "partyVoteShareMap")
      || (nextState.party !== "" && this.state.party !== nextState.party && (this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap"))) {
      this.fetchChartMapOptions(nextState);
    }
  }
  onAcceptTermsAndConditions = (key, checked) => {
    this.setState({ isDataDownloadable: checked });
  }

  CancelTermsAndConditionsPopup = () => {
    this.setState({ isDataDownloadable: false });
    this.setState({ showTermsAndConditionsPopup: false });
  }

  CloseTermsAndConditionsPopup = () => {
    this.setState({ showTermsAndConditionsPopup: false });
  }

  showTermsAndConditionsPopup = () => {
    this.setState({ showTermsAndConditionsPopup: true });
  }

  onVisualizationChange = (newValue) => {
    this.setState({ year: "" });
    this.setState({ vizOptionsSelected: new Set() });
    this.setState({ showVisualization: false });
    var visualizationType = ChartsMapsCodes.filter(function (item) { return item.modulename === newValue })[0].type;
    this.setState({ visualization: newValue });
    this.setState({ visualizationType: visualizationType }, () => {
      if (visualizationType === "Map") {
        this.fetchMapYearOptions();
      }
    });
    this.updateURL({variable:"viz",val:newValue});
  }

  onStateNameChange = (newValue) => {
    this.setState({ visualization: "" });
    this.setState({ visualizationType: "" });
    this.setState({ vizOptionsSelected: new Set() });
    this.setState({ showVisualization: false });
    this.setState({ stateName: newValue });
    this.updateURL({variable:"st",val:newValue});
  }

  onElectionTypeChange = (e) => {
    this.setState({ visualization: "" });
    this.setState({ visualizationType: "" });
    this.setState({ stateName: "" });
    this.setState({ year: "" });
    this.setState({ party: "" });
    this.setState({ chartMapOptions: [] });
    this.setState({ showVisualization: false });
    let newValue = e.target.name;
    var activeItem = $("li.nav-item.active");
    activeItem.removeClass("active");
    $(e.target).parent().addClass("active");
    this.setState({ electionType: newValue });
    this.updateURL({variable:"et",val:newValue});
  }

  fetchVisualizationData = () => {
    return new Promise((resolve, reject) => {
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
        body: JSON.stringify({
          ElectionType: electionType,
          StateName: stateName,
          ModuleName: visualization,
          VizType: visualizationType,
          AssemblyNo: assemblyNumber,
          Party: party,
          Legends: [...legends]
        })
      }).then(response => response.json()).then(resp => {
        var data = resp.data;
        this.setState({ vizData: data });
        var checked = ChartsMapsCodes.filter(function (item) { return item.modulename === visualization })[0].alloptionschecked;
        if (checked) {
          this.setState({ showVisualization: true });
        }
        setTimeout(() => resolve(data), 500);
      });
    });
  }

  fetchMapData = () => {
    return new Promise((resolve, reject) => {
      let electionType = this.state.electionType;
      let stateName = this.state.stateName;
      var file = electionType === "GE" ? "/India_PC_json.geojson": "/"+stateName+"_AC_json.geojson"
      const url = Constants.baseUrl + file;
      fetch(url, {
        method: "GET"
        }).then(response => response.json()).then(resp => {
          var map = resp.features;
          this.setState({ mapData: map });
          setTimeout(() => resolve(map), 500);
        });
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
      body: JSON.stringify({
        ElectionType: electionType,
        StateName: stateName,
        ModuleName: visualization,
        VizType: visualizationType,
        AssemblyNo: assemblyNumber
      })
    }).then(response => response.json()).then(resp => {
      var data = [{ value: "", label: "Select Party" }];
      var data = data.concat(resp.data.map(function (item) { return { label: item, value: item } }));
      this.setState({ partyOptions: data });
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
      body: JSON.stringify({
        ElectionType: electionType,
        StateName: stateName,
        ModuleName: visualization,
        VizType: visualizationType
      })
    }).then(response => response.json()).then(resp => {
      var data = [{ value: "", label: "Select Year" }];
      var data = data.concat(resp.data.map(function (item) { return { label: `${item.Year} (#${item.Assembly_No})`, value: item.Assembly_No } }));
      this.setState({ yearOptions: data });
    });
  }

  fetchChartMapOptions = (state) => {
    let electionType = state.electionType;
    let stateName = state.stateName;
    let visualization = state.visualization;
    let visualizationType = state.visualizationType;
    let assemblyNo = state.year;
    const url = Constants.baseUrl + "/data/api/v1.0/getVizLegend";
    fetch(url, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json"
      }),
      body: JSON.stringify({
        ElectionType: electionType,
        StateName: stateName,
        ModuleName: visualization,
        VizType: visualizationType,
        AssemblyNo: assemblyNo
      })
    }).then(response => response.json()).then(resp => {
      this.setState({ chartMapOptions: resp.data });
      var checked = ChartsMapsCodes.filter(function (item) { return item.modulename === visualization })[0].alloptionschecked;
      if (checked) {
        this.setState({ vizOptionsSelected: new Set(resp.data.map(x => x.replace(/_/g, ""))) }, () => {
          this.fetchVisualizationData();
          if(visualizationType==="Map"){
            this.fetchMapData();
          }
        });
      }
    });
  }

  chartMapOptionChecked = (key, checked) => {
    var vizOptionsSelected = this.state.vizOptionsSelected;
    if (checked) {
      vizOptionsSelected.add(key);
    } else {
      vizOptionsSelected.delete(key);
    }
    let visualization = this.state.visualization;
    this.setState({ vizOptionsSelected: vizOptionsSelected }, () => {

      if (visualization === "cvoteShareChart" || visualization === "seatShareChart" || visualization === "tvoteShareChart" || visualization === "strikeRateChart") {
        this.fetchVisualizationData();
        this.setState({ showVisualization: true });
      } else if (vizOptionsSelected.size > 0) {
        this.fetchVisualizationData();
        this.setState({ showVisualization: false });
      } else {
        this.setState({ showVisualization: false });
      }
    });
    this.updateURL({variable:"opt",val:[...vizOptionsSelected]});
  }

  createOptionsCheckboxes = () => {
    var checkboxes = [];
    var scope = this;
    var visualization = scope.state.visualization;
    var vizOptionsSelected = scope.state.vizOptionsSelected;
    var label = ChartsMapsCodes.filter(function (item) { return item.modulename === scope.state.visualization })[0].optionslabel;
    var chartMapOptions = scope.state.chartMapOptions;
    chartMapOptions.forEach(function (item) {
      var checked = vizOptionsSelected.has(item.replace(/_/g, ""));
      checkboxes.push(<Checkbox id={"dv_" + visualization + "_filter_" + item.replace(/_/g, "")} checked={checked} key={item.replace(/_/g, "")} label={item.replace(/_/g, " ")} onChange={scope.chartMapOptionChecked} />)
    });
    if (checkboxes.length > 0) {
      return <div>
        <label>{label}</label>
        {checkboxes}
      </div>;
    }
  }

  renderVisualization = () => {
    var data = this.state.vizData;
    var shape = this.state.mapData;
    var dataFilterOptions = this.state.vizOptionsSelected;
    var electionType = this.state.electionType;
    var stateName = this.state.stateName;
    var visualization = this.state.visualization;
    var assemblyNo = this.state.year;
    switch (visualization) {
      case "voterTurnoutChart":
        return <VoterTurnoutChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName} />;
      case "partiesPresentedChart":
        return <PartiesPresentedChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName} />;
      case "tvoteShareChart":
      case "cvoteShareChart":
        return <PartyVoteShareChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName} />;
      case "seatShareChart":
        return <PartySeatShareChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName} />;
      case "strikeRateChart":
        return <PartyStrikeRateChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName} />;
      case "contestedDepositSavedChart":
        return <ContestedDepositLostChart data={data} dataFilterOptions={dataFilterOptions} electionType={electionType} stateName={stateName} />;
      case "winnerCasteMap":
        return <ConstituencyTypeMap data={data} map={shape} electionType={electionType} dataFilterOptions={dataFilterOptions} assemblyNo={assemblyNo} stateName={stateName} />;
      case "numCandidatesMap":
        return <NumCandidatesMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "voterTurnoutMap":
        return <VoterTurnoutMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "winnerGenderMap":
        return <WinnerGenderMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "winnerMarginMap":
        return <VictoryMarginMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "winnerVoteShareMap":
        return < WinnerVoteShareMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "partyVoteShareMap":
        return < PartyVoteShareMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "partyPositionsMap":
        return < PartyPositionsMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "winnerMap":
        return < WinnerMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;
      case "notaTurnoutMap":
        return < NotaTurnoutMap data={data} map={shape} electionType={electionType} assemblyNo={assemblyNo} dataFilterOptions={dataFilterOptions} stateName={stateName} />;


      default:
        return;
    }
  }

  onPartyChange = (newValue) => {
    this.setState({ party: newValue });
    if (this.state.showVisualization === true) {
      this.setState({ showVisualization: false });
    }
    this.updateURL({variable:"pty",val:newValue});
  }

  onYearChange = (newValue) => {
    this.setState({ year: newValue }, () => {
      if (this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap") {
        this.fetchMapYearParties();
      }

      if (this.state.showVisualization === true) {
        this.setState({ showVisualization: false })
      }

    });
    this.updateURL({variable:"an",val:newValue});
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
    var dataFilterOptions = this.state.vizOptionsSelected;
    var csvData = this.state.vizData;
    var isDataDownloadable = this.state.isDataDownloadable;
    var showTermsAndConditionsPopup = this.state.showTermsAndConditionsPopup;


    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var filename = `TCPD_${this.state.electionType}_${this.state.stateName}_${visualization}_${date}.csv`;
    const modalBody = <div><p>Lok Dhaba is an online web interface provided by the Trivedi Centre for
        Political Data. In these terms of use of the data provided by the Centre, 'Data'
        includes all visualizations, texts, graphics and compilations of data and other
        material presented within the application. The users are free to download,
        display or include the data in other products for non-commercial purposes at no
        cost subject to the following limitations:</p>
      <ul>
        <li>The user must include the citation for data they use in the manner indicated
        through 'How to Cite' information mentioned on the top of this web page. The
        user must not claim or imply that the Trivedi Centre for Political Data endorses
        the user's use of the data or use of the Centre's logo(s) or trademarks(s) in
        conjunction with the same.</li>
        <li>The Centre makes no warranties with respect to the data and the user must
        agree that the Centre shall not be held responsible or liable to the user for
        any errors, omissions, misstatements and/or misrepresentations of the data
        though the user is encouraged to report the same to us (following the procedure
        elaborated upon within the 'Contact us' tab).</li>
        <li>The Centre may record visits to Lok Dhaba without collecting the personal
        information of the users. The records shall be used for statistical reports
        only.</li>
        <li>The user must agree that the use of Data presented within the application can
        be seen as the acknowledgement of unconditionally accepting the Terms of Use
        presented by the Centre.</li>
      </ul>
      <center><Checkbox id={"dd_accept_condition"} label={"I accept the terms and conditions mentioned here."} checked={this.state.isDataDownloadable} onChange={this.onAcceptTermsAndConditions} /></center>
    </div>
    var buttonClass = isDataDownloadable ? "btn-lg" : "btn-lg disabled";
    const modalFooter = <div>
      <Button className="btn-lg" variant="secondary" onClick={this.CancelTermsAndConditionsPopup}>
        Cancel
                        </Button>
      <CSVLink className={buttonClass} data={csvData} filename={filename}>
        <Button className={buttonClass} variant="primary" onClick={this.CloseTermsAndConditionsPopup}>
          Download
                          </Button>
      </CSVLink>
    </div>

    return (
      <div className="content overflow-auto">
        <div className="data-vis">
        <div className="row">
        <div className="column card" style={{width: "20%", padding: "0.5rem"}}>
              <form className="well">
                  <ul className="nav nav-tabs">
                    <li className="nav-item active">
                      <a className="nav-link" name={"GE"} onClick={this.onElectionTypeChange}>Lok Sabha</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" name={"AE"} onClick={this.onElectionTypeChange}>Vidhan Sabha</a>
                    </li>
                  </ul>
                  <br></br>
                {electionType === "AE" && <Select id="dv_state_selector" label="State" options={stateOptions} selectedValue={stateName} onChange={this.onStateNameChange} />}
                {(electionType === "GE" || (electionType === "AE" && stateName !== "")) && <Select id="dv_visualization_selector" label="Visualization" selectedValue={visualization} options={visualizationOptions} onChange={this.onVisualizationChange} />}
                {visualizationType === "Map" && <Select id="dv_year_selector" label="Select Year" options={yearOptions} selectedValue={year} onChange={this.onYearChange} />}
                {year !== "" && (visualization === "partyPositionsMap" || visualization === "partyVoteShareMap") && <Select id="dv_party_selector" label="Select Party" options={partyOptions} selectedValue={party} onChange={this.onPartyChange} />}
                {((visualizationType === "Chart") || (visualizationType === "Map" && year !== "")) && this.createOptionsCheckboxes()}
                {dataFilterOptions.size > 0 && <Button className="btn-lg" onClick={this.showTermsAndConditionsPopup}> Download Data</Button>}
              </form>
          </div>
          <div className="vis column" style={{width: "80%", padding: "10px"}}>
            {showVisualization && this.renderVisualization()}
          </div>
          </div>
          {showTermsAndConditionsPopup && <Popup id="tems_and_conditions_popup" show={showTermsAndConditionsPopup} body={modalBody} heading={<p>Terms and Conditions</p>} footer={modalFooter} handleClose={this.CloseTermsAndConditionsPopup} />}
          </div>
      </div>
    )
  }
}
