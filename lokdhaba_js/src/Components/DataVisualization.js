import React, { Component } from 'react';

import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import ChartsMapsCodes from '../Assets/Data/ChartsMapsCodes.json';
import Checkbox from './Shared/Checkbox.js';
import Select from './Shared/Select.js';
import DataVizWrapper from './Shared/DataVizWrapper';
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
      GE_States: [],
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
      showTermsAndConditionsPopup: false,
      vizOptionsNames : {},
      stateOptions :[],
      allYearsVizData: [],
      allYearsVizLegend: [],
      allYearsVizOptionsSelected: [],
      showChangeMap: false,
      showNormalizedMap: false,
    };
  }

  updateURL = (props) => {
    const { variable, val } = props
    const url = setParams({ location: this.props.location, variable:variable, val: val });
    this.props.history.push(`?${url}`);
  };

  setDefaultYear = (searchYear) => {
    // Set defalut year as searchYear if given, else set to latest year

    let options = this.state.yearOptions;
    let foundYear = false;
    if (typeof searchYear !== 'undefined' && searchYear !== "") {
      options.forEach((item) => {
        if (searchYear === item.label.split(' ')[0]) {
          foundYear = true;
          this.onYearChange(item.value);
        }
      })
    }
    if (!foundYear) {
      let latestYear = options[options.length - 1]
      console.log("Data for year searchYear=" + searchYear + " not found. Fetching data for latest year " + latestYear.label)
      this.onYearChange(latestYear.value);
    }
  }

  componentDidMount() {
    let searchYear = "";
    if (this.props.location.state) {
      searchYear = this.props.location.state.year;
    }

    var unique_AE_States = [...new Set(VidhanSabhaNumber.sort(compareValues('State_Name')).map(x => x.State_Name))];
    var visualizationOptions = [{ value: "", label: "Chart/Map" }].concat(ChartsMapsCodes.map(function (item) { return { value: item.modulename, label: item.title } }));
    var AE_States = [{ value: "", label: "Select State" }].concat(unique_AE_States.map(function (item) { return { value: item, label: item.replace(/_/g, " ") } }));

    var GE_States = StateCodes.map(function (item) { return { value: item.State_Name, label: item.State_Name.replace(/_/g, " ") } });
    this.state.GE_States = GE_States;
    this.state.AE_States = AE_States;
    this.state.visualizationOptions = visualizationOptions;
    //this.setState({ AE_States: AE_States, visualizationOptions: visualizationOptions, GE_States : GE_States });

    let inputs = getParams(this.props.location);
    var et = inputs.get("et") || "";
    if(et !== ""){
      var elem = $("a.nav-link[id=et"+et+"]");
      // var e.target = elem[0];
      // this.onElectionTypeChange(e);
      var evt = new MouseEvent('click'); // If cancelled, don't dispatch our event
      evt.initEvent('click', true, true);
      elem[0].addEventListener('click',this.onElectionTypeChange,false);
      elem[0].target = elem[0];
      elem[0].dispatchEvent(evt);
      // var event = document.createEvent('Event');
      // event.initEvent('click', true, true);
      // var elem = $(document).ready(function(){$("a.nav-link[name="+et+"]")});
      // elem[0].addEventListener('click',this.onElectionTypeChange,false);
      // elem[0].dispatchEvent(event);
      //$(document).ready(function(){$("a.nav-link[name="+et+"]").click()});
      //this.onElectionTypeChange(evt);
    }
    var st = inputs.get("st") || "";
    if(st !== "" ){this.onStateNameChange(st);}
    var viz = inputs.get("viz") || "";
    if(viz !== "" ){this.onVisualizationChange(viz, searchYear);}
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
      || (nextState.party !== "" && (this.state.party !== nextState.party) && (this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap"))) {
      this.fetchChartMapOptions(nextState);
    }
  }

  onAcceptTermsAndConditions = (key, checked) => {
    this.setState({ isDataDownloadable: checked });
  }

  onShowChangeMapChange = (key, checked) => {
    if (checked === false) {
      this.setState({ showNormalizedMap: false });
    }
    this.setState({ showChangeMap: checked });
  }

  onShowNormalizedMapChange = (key, checked) => {
    this.setState({ showNormalizedMap: checked });
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

  onVisualizationChange = (newValue, searchYear) => {
    this.setState({ year: "" });
    this.setState({ vizOptionsSelected: new Set() });
    this.setState({ showChangeMap: false });
    this.setState({ showVisualization: false });
    var visualizationType = ChartsMapsCodes.filter(function (item) { return item.modulename === newValue })[0].type;
    this.setState({ visualization: newValue });
    this.setState({ visualizationType: visualizationType }, () => {
      if (visualizationType === "Map") {
        this.fetchMapData();
        if (newValue !== "partyPositionsMap" && newValue !== "partyVoteShareMap") {
          this.fetchMapYearAndData(searchYear);
        }
        else {
          this.fetchMapYearOptions();
        }
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
    let stateOptions;
    if (newValue === "GE") {
      stateOptions = [{ value: "", label: "Select State" }, { value: "Lok_Sabha", label: "All" }].concat(this.state.GE_States);
    } else if (newValue === "AE") {
      stateOptions = [{ value: "", label: "Select State" }].concat(this.state.AE_States);
    }
    this.setState({ stateOptions: stateOptions });
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
        if(electionType === "GE" && stateName !== "Lok_Sabha"){
          var map = resp.features.filter(function(item){return item.properties.State_Name=== stateName});
        }else{
          var map = resp.features;
        }

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
      this.onPartyChange("");
    });
  }

  fetchMapYearOptions = (searchYear) => {
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
      this.setState(
        { yearOptions: data },
        () => {
          this.setDefaultYear(searchYear);
        }
      );
    });
  }

  fetchMapYearAndData = (searchYear) => {
    return new Promise((resolve, reject) => {
      let electionType = this.state.electionType;
      let stateName = this.state.stateName;
      let visualization = this.state.visualization;
      let visualizationType = this.state.visualizationType;
      let assemblyNumber = this.state.year;
      let party = this.state.party;
      let legends = this.state.vizOptionsSelected;

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
        data = data.concat(resp.data.map(function (item) { return { label: `${item.Year} (#${item.Assembly_No})`, value: item.Assembly_No } }));
        this.setState({ yearOptions: data});
        let scope = this;
        let allYearsVizData = [];
        let allYearsVizLegend = [];
        let allYearsVizOptionsSelected = [];

        resp.data.forEach(function (item) {
          const urlVizData = Constants.baseUrl + "/data/api/v1.0/getVizData";
          fetch(urlVizData, {
            method: "POST",
            headers: new Headers({
              "content-type": "application/json"
            }),
            body: JSON.stringify({
              ElectionType: electionType,
              StateName: stateName,
              ModuleName: visualization,
              VizType: visualizationType,
              AssemblyNo: item.Assembly_No,
              Party: party,
              Legends: [...legends]
            })
          }).then(response2 => response2.json()).then(respVizData => {
            allYearsVizData = allYearsVizData.concat({ assemblyNo: item.Assembly_No, data: respVizData.data });
            scope.setState({ allYearsVizData: allYearsVizData }, () => {
              scope.setDefaultYear(searchYear);
            });
            setTimeout(() => resolve(data), 500);
          });

          const urlVizLegend = Constants.baseUrl + "/data/api/v1.0/getVizLegend";
          fetch(urlVizLegend, {
            method: "POST",
            headers: new Headers({
              "content-type": "application/json"
            }),
            body: JSON.stringify({
              ElectionType: electionType,
              StateName: stateName,
              ModuleName: visualization,
              VizType: visualizationType,
              AssemblyNo: item.Assembly_No,
            })
          }).then(response => response.json()).then(respVizLegend => {
            allYearsVizLegend.push({ assemblyNo: item.Assembly_No, data: respVizLegend.data });
            var checked = ChartsMapsCodes.filter(function (item1) { return item1.modulename === visualization })[0].alloptionschecked;
            if (checked) {
              allYearsVizOptionsSelected.push({ assemblyNo: item.Assembly_No, data: new Set(respVizLegend.data.map(x => x.replace(/_/g, ""))) })
            }
          })
          scope.setState({ allYearsVizLegend: allYearsVizLegend });
          scope.setState({ allYearsVizOptionsSelected: allYearsVizOptionsSelected });
        });
      });
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
      this.setState({ vizOptionsNames : resp.names});
      var checked = ChartsMapsCodes.filter(function (item) { return item.modulename === visualization })[0].alloptionschecked;
      if (checked) {
        this.setState({ vizOptionsSelected: new Set(resp.data.map(x => x.replace(/_/g, ""))) }, async () => {
          this.fetchVisualizationData();
          if(visualizationType==="Map"){
            await this.fetchMapData();
          }

        this.setState({ showVisualization: true });
        });
      }
      var selectedOptions = resp.selected;
      if(typeof selectedOptions != "undefined" && selectedOptions != null && selectedOptions.length != null && selectedOptions.length > 0){
        this.setState({ vizOptionsSelected: new Set(selectedOptions.map(x => x.replace(/_/g, ""))) }, () => {
          this.fetchVisualizationData();
          if(visualizationType==="Map"){
            this.fetchMapData();
          }
        });

        this.setState({ showVisualization: true });
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
      }
    });
    this.updateURL({variable:"opt",val:[...vizOptionsSelected]});
  }

  createOptionsCheckboxes = () => {
    var checkboxes = [];
    var scope = this;
    var visualization = scope.state.visualization;
    var vizOptionsSelected = scope.state.vizOptionsSelected;
    var label = "";
    var foundLabel = ChartsMapsCodes.find(function (item) { return item.modulename === scope.state.visualization });
    if (foundLabel) {
      label = foundLabel.optionslabel;
    }
    var chartMapOptions = scope.state.chartMapOptions;
    var optionNames = scope.state.vizOptionsNames;
    chartMapOptions.forEach(function (item) {
      var checked = vizOptionsSelected.has(item.replace(/_/g, ""));
      var name = ""
      if(typeof optionNames === "object"){
        name = optionNames[item]
      }
      checkboxes.push(<Checkbox id={"dv_" + visualization + "_filter_" + item.replace(/_/g, "")} checked={checked} key={item.replace(/_/g, "")} title={name} label={item.replace(/_/g, " ")} onChange={scope.chartMapOptionChecked} />)
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
    const { visualizationType, yearOptions, chartMapOptions, showChangeMap, showNormalizedMap } = this.state;

    return (
      <DataVizWrapper
        visualization={visualization}
        visualizationType={visualizationType}
        data={data}
        map={shape}
        electionType={electionType}
        assemblyNo={assemblyNo}
        stateName={stateName}
        showMapYearOptions={true}
        yearOptions={yearOptions}
        chartMapOptions={chartMapOptions}
        dataFilterOptions={dataFilterOptions}
        playChangeYears={this.playChangeYears}
        onMapYearChange={this.onMapYearChange}
        showChangeMap={showChangeMap}
        onShowChangeMapChange={this.onShowChangeMapChange}
        showNormalizedMap={showNormalizedMap}
        onShowNormalizedMapChange={this.onShowNormalizedMapChange}
      />
    );
  }

  onPartyChange = (newValue) => {
    this.setState({ party: newValue });
    if (this.state.showVisualization === true) {
      this.setState({ showVisualization: false });
    }
    this.updateURL({variable:"pty",val:newValue});
  }

  onYearChange = (newValue) => {
    this.setState({ showVisualization: false });
    this.setState({ year: newValue }, () => {
      if (this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap") {
        this.fetchMapYearParties();
      }
      else {
        const { allYearsVizData, allYearsVizLegend, allYearsVizOptionsSelected, showVisualization } = this.state;
        let newData = allYearsVizData.find(function (item) {
          return item.assemblyNo === parseInt(newValue);
        })
  
        if (typeof newData != 'undefined') {
          this.setState({ vizData: newData.data });
        }
  
        let vizLegend = allYearsVizLegend.find(function (item) {
          return item.assemblyNo === parseInt(newValue);
        })
  
        if (typeof vizLegend != 'undefined') {
          this.setState({ chartMapOptions: vizLegend.data });
        }
  
        let vizOptionsSelected = allYearsVizOptionsSelected.find(function (item) {
          return item.assemblyNo === parseInt(newValue);
        })
  
        if (typeof vizOptionsSelected != 'undefined') {
          this.setState({ vizOptionsSelected: vizOptionsSelected.data });
        }
  
        if (showVisualization === false) {
          this.setState({ showVisualization: true });
        }
      }
    });
    this.updateURL({ variable: "an", val: newValue });
  }

  onMapYearChange = (event, newValue) => {
    this.onYearChange(newValue);
  }

  playChangeYears = () => {
    const { yearOptions } = this.state;
    let scope = this;
    for (let i = 1; i < yearOptions.length; i++) {
      setTimeout(function timer() {
        scope.onYearChange(yearOptions[i].value);
      }, i * 800);
    }
  }

  render() {
    var electionType = this.state.electionType;
    var stateOptions = this.state.stateOptions;
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
                  <li className="nav-item active" >
                  <a className="nav-link" id= {"etGE"} name={"GE"} onClick={this.onElectionTypeChange}>Lok Sabha</a>
                  </li>
                  <li className="nav-item" >
                  <a className="nav-link" id= {"etAE"} name={"AE"} onClick={this.onElectionTypeChange}>Vidhan Sabha</a>
                  </li>
                </ul>
                <br></br>
                {<Select id="dv_state_selector" label="State" options={stateOptions} selectedValue={stateName} onChange={this.onStateNameChange} />}
                {stateName !== "" && <Select id="dv_visualization_selector" label="Visualization" selectedValue={visualization} options={visualizationOptions} onChange={this.onVisualizationChange} />}
                {(visualization === "partyPositionsMap" || visualization === "partyVoteShareMap") && <Select id="dv_year_selector" label="Select Year" options={yearOptions} selectedValue={year} onChange={this.onYearChange} />}
                {year !== "" && (visualization === "partyPositionsMap" || visualization === "partyVoteShareMap") && <Select id="dv_party_selector" label="Select Party" options={partyOptions} selectedValue={party} onChange={this.onPartyChange} />}
                {((visualizationType === "Chart") || (visualizationType === "Map" && year !== "" && (visualization === "winnerMap" || visualization === "numCandidatesMap" || visualization === "partyPositionsMap"))) && this.createOptionsCheckboxes()}
                {<Button className="btn-lg" onClick={this.showTermsAndConditionsPopup}> Download Data</Button>}
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
