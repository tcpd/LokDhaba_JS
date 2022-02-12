import React, { Component } from 'react';

import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import LokSabhaNumber from '../Assets/Data/LokSabhaNumber.json';
import ChartsMapsCodes from '../Assets/Data/ChartsMapsCodes.json';
import Checkbox from './Shared/Checkbox.js';
import LdSelect from './Shared/Select.js';
import DataVizWrapper from './Shared/DataVizWrapper';
import * as Constants from './Shared/Constants.js';
import ErrorScreen from "./Shared/ErrorScreen.js";
import ErrorBoundary from "./Shared/ErrorBoundary.js";
import Popup from './Shared/Popup.js';
import { CSVLink } from "react-csv";
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import { components } from "react-select";
import Select from "react-select";

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
const removeDuplicatesFromArray = (arr) => [...new Set(
      arr.map(el => JSON.stringify(el))
    )].map(e => JSON.parse(e));

function getParams(location) {
  return new URLSearchParams(location.search);
}

const refreshPage = ()=> {
     window.location.reload();
}

function setParams(props) {
  const { location, variable, val, remove } = props;
  let searchParams = new URLSearchParams(location.search);
  if(variable !== undefined){
    searchParams.set(variable, val || "");
  }
  if(remove!==undefined){
    remove.forEach((x)=>{searchParams.delete(x)});
  }
  return searchParams.toString();
}

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          id={"dv_options_"+props.value}
          key={props.value}
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label className="control-label" key={props.value + "_label"} title ={props.name} htmlFor ={"dv_options_"+props.value}>{props.label}</label>
      </components.Option>
    </div>
  );
};
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#B83027' : state.isFocused ? '#F9E6E5' : 'whitesmoke' ,
    color : state.isSelected ? 'white':'black',
  }),
  // dropdownIndicator:(provided, state)=>({
  //   ...provided,
  //   title:"red"
  // })


}


export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    let inputs = getParams(props.location);
    var et = inputs.get("et") || "";
    this.state = {
      electionType: et===""?"GE":et,
      segmentWise : false,
      stateName: "",
      AE_States: [],
      GE_States: [],
      visualization: "",
      visualizationType: "",
      visualizationVar: "",
      visualizationVarOptions: [],
      visualizationOptions: [],
      chartMapOptions: [],
      year: "",
      yearOptions: [],
      stateAssemblies: [],
      party: "",
      partyOptions: [],
      showVisualization: false,
      vizOptionsSelected: new Set(),
      vizData: [],
      mapData :[],
      mapOverlay :[],
      isDataDownloadable: false,
      showTermsAndConditionsPopup: false,
      vizOptionsNames : {},
      stateOptions :[],
      allYearsVizData: [],
      allYearsVizLegend: [],
      allYearsVizOptionsSelected: [],
      showChangeMap: false,
      showNormalizedMap: false,
      showBaseMap: true,
      electionYearDisplay:""
    };
  }

  updateURL = (props) => {
    const { variable, val, remove } = props;
    const url = setParams({ location: this.props.location, variable:variable, val: val, remove:remove });
    this.props.history.push(`?${url}`);
  }

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
    //var visualizationOptions = [{ value: "", label: "Chart/Map" }].concat(ChartsMapsCodes.map(function (item) { return { value: item.modulename, label: item.title } }));
    var visualizationVarOptions = [{ value: "", label: "Select Level" }].concat(removeDuplicatesFromArray(ChartsMapsCodes.map(function(x){return{value:x.varType,label:x.varLabel}})));
    var AE_States = unique_AE_States.map(function (item) { return { value: item, label: item.replace(/_/g, " ") } });

    var GE_States = StateCodes.sort(compareValues('State_Name')).map(function (item) { return { value: item.State_Name, label: item.State_Name.replace(/_/g, " ") } });
    this.state.GE_States = GE_States;
    this.state.AE_States = AE_States;
    //this.state.visualizationOptions = visualizationOptions;
    this.state.visualizationVarOptions = visualizationVarOptions;
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
    var vizVar = inputs.get("var") || "";
    var viz = inputs.get("viz") || "";
    var options = inputs.get("opt") || "";
    var an = inputs.get("an") || "";
    var pty = inputs.get("pty") || "";
    var seg = inputs.get("seg") || "";
    this.buildFromUrl({
      "et":et,
      "st":st,
      "vizVar":vizVar,
      "viz": viz,
      "options":options,
      "an":an,
      "pty":pty,
      "seg":seg
    })

  }

  buildFromUrl = (props)=>{
    var {et,st,vizVar,viz,options,an,pty,seg}= props;
    let assemblies;
    if (et === "AE") {
      assemblies = VidhanSabhaNumber.filter(function (item) { return item.State_Name === st }).map(function (item) { return { value: item.Assembly_No, label: item.Year+" (#"+item.Assembly_No+")",year: item.Year } });
    } else if (et === "GE") {
      if (st === "Lok_Sabha"){
        assemblies = [...new Set(LokSabhaNumber.map(s => s.Assembly_No))]
          .map(Assembly_No => {
            return {
              Assembly_No: Assembly_No,
              Year: LokSabhaNumber.find(s => s.Assembly_No === Assembly_No).Year
            };
          }).map(function (item) { return { value: item.Assembly_No, label: item.Year+" (#"+item.Assembly_No+")",year: item.Year } });
      }else{
        assemblies = LokSabhaNumber.filter(function (item) { return item.State_Name === st }).map(function (item) { return { value: item.Assembly_No, label: item.Year+" (#"+item.Assembly_No+")",year: item.Year } });
      }
    }
    var visualizationOptions = vizVar!=="" ? [{ value: "", label: "Chart/Map" }].concat(ChartsMapsCodes.filter(x => x.varType=== vizVar).map(function (item) { return { value: item.modulename, label: item.title } })):[];
    var visualizationType = viz !=="" ? ChartsMapsCodes.filter(function (item) { return item.modulename === viz })[0].type:"";
    var vizOptionsSelected = options!==""? new Set(options.replace(/%2C/g,",").split(",")) : new Set();

    if(vizVar==="ADR" && an===""){
      an = assemblies.sort(compareValues('value','desc'))[0].value
    }
    var showVisualization = viz !== "";

    var disp = an !==""? assemblies.filter(x=> x.value===parseInt(an))[0].label:"";

    this.setState(
      { stateName: st, stateAssemblies: assemblies,visualizationOptions: visualizationOptions, visualizationVar:vizVar,visualizationType: visualizationType,visualization: viz,vizOptionsSelected: vizOptionsSelected,year: an,electionYearDisplay: disp,showVisualization : showVisualization},
      () => {
        this.setYearsFromSearch("")
        if(visualizationType ==="Map"){
          this.fetchMapData();
          if (viz === "partyPositionsMap" || viz === "partyVoteShareMap") {
            this.fetchMapYearParties();
          }
          this.fetchMapYearAndData("");
          if(seg){
             this.fetchMapOverlay();
          }
          const { allYearsVizData, allYearsVizLegend, allYearsVizOptionsSelected} = this.state;
          let newData = allYearsVizData.find(function (item) {
            return item.assemblyNo === parseInt(an);
          })

          if (typeof newData != 'undefined') {
            this.setState({ vizData: newData.data });
          }

          let vizLegend = allYearsVizLegend.find(function (item) {
            return item.assemblyNo === parseInt(an);
          })

          if (typeof vizLegend != 'undefined') {
            this.setState({ chartMapOptions: vizLegend.data });
          }

          let vizOptionsSelected = allYearsVizOptionsSelected.find(function (item) {
            return item.assemblyNo === parseInt(an);
          })

          if (typeof vizOptionsSelected != 'undefined') {
            this.setState({ vizOptionsSelected: vizOptionsSelected.data });
          }

        }
        this.fetchVisualizationData();

      });

    {st !=="" && this.updateURL({variable:"st",val:st});}
    {viz !=="" && this.updateURL({variable:"viz",val:viz});}
    {vizVar !=="" && this.updateURL({variable:"var",val:vizVar});}
    {seg !=="" && this.updateURL({variable:"seg",val:seg});}
    {an !=="" && this.updateURL({variable:"an",val:an});}
    {pty !=="" && this.updateURL({variable:"pty",val:pty});}

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

  onShowBaseMapChange = (key, checked) => {
    this.setState({ showBaseMap: checked });
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
    var visualizationType = ChartsMapsCodes.filter(function (item) { return item.modulename === newValue })[0].type;
    this.setState({ visualization: newValue
      //,showVisualization: false
      , showBaseMap: true
      ,showChangeMap: false
      ,showNormalizedMap: false
      ,vizOptionsSelected: new Set()
      ,year: ""
      , visualizationType: visualizationType }, () => {
      //this.fetchChartMapOptions(this.state);
      if (visualizationType === "Map") {
        this.fetchMapData();
        if (newValue === "partyPositionsMap" || newValue === "partyVoteShareMap") {
          this.fetchMapYearParties();
        }
        this.fetchMapYearAndData(searchYear);
      }
    });
    var visualizationVar = ChartsMapsCodes.filter(function (item) { return item.modulename === newValue })[0].varType;

    //this.setState({visualizationVar:visualizationVar});
    this.updateURL({variable:"viz",val:newValue,remove:["an","opt"]});

    if(visualizationVar==="ADR" && this.state.stateAssemblies.length > 0){
      var defaultAssembly = this.state.stateAssemblies.sort(compareValues('value','desc'))[0].value;
      //this.onAssemblyChange(defaultAssembly);
      var defaultAssemblyDisplay = this.state.stateAssemblies.sort(compareValues('value','desc'))[0].label;
      this.setState({year:defaultAssembly,electionYearDisplay:defaultAssemblyDisplay});
      // this.updateURL({variable:"an",val:defaultAssembly});
    }




  }

  setYearsFromSearch = (searchYears) => {
    if (typeof searchYears !== 'undefined' && searchYears.length > 0) {
      let options = this.state.stateAssemblies;
      searchYears.map((searchYear) => {
        let year = parseInt(searchYear);
        let assembly = options.find((ele) => {
          return ele.Year === year
        })
        return null;
      })
    }
  }
  onVisualizationVarChange = (newValue, searchYear) => {
    var visualizationOptions = [{ value: "", label: "Chart/Map" }].concat(ChartsMapsCodes.filter(x => x.varType=== newValue).map(function (item) { return { value: item.modulename, label: item.title } }));
    this.setState({ year: "",visualization:"", vizOptionsSelected: new Set(), showVisualization: false,visualizationOptions: visualizationOptions,visualizationVar:newValue });
    this.updateURL({variable:"var",val:newValue,remove:["an","opt"]});
  }

  onStateNameChange = (newValue, searchYears, nourl=false) => {

    let assemblies;
    if (this.state.electionType === "AE") {
      assemblies = VidhanSabhaNumber.filter(function (item) { return item.State_Name === newValue }).map(function (item) { return { value: item.Assembly_No, label: item.Year+" (#"+item.Assembly_No+")",year: item.Year } });
    } else if (this.state.electionType === "GE") {
      if (newValue === "Lok_Sabha") {
        assemblies = [...new Set(LokSabhaNumber.map(s => s.Assembly_No))]
          .map(Assembly_No => {
            return {
              Assembly_No: Assembly_No,
              Year: LokSabhaNumber.find(s => s.Assembly_No === Assembly_No).Year
            };
          }).map(function (item) { return { value: item.Assembly_No, label: item.Year+" (#"+item.Assembly_No+")",year: item.Year } });
      } else {
        assemblies = LokSabhaNumber.filter(function (item) { return item.State_Name === newValue }).map(function (item) { return { value: item.Assembly_No, label: item.Year+" (#"+item.Assembly_No+")",year: item.Year } });
      }
    }
    this.setState(
      { stateName: newValue, stateAssemblies: assemblies },
      () => {
        this.setYearsFromSearch(searchYears)
        this.fetchVisualizationData();
        if(this.state.visualizationType ==="Map"){
          this.fetchMapData();
        }

      }
    );
    if(!nourl){
      this.updateURL({variable:"st",val:newValue,remove:["an","opt"]});
    }

  }

  onElectionTypeChange = (e) => {
    let newValue = e.target.name;
    var activeItem = $("li.nav-item.active");
    activeItem.removeClass("active");
    $(e.target).parent().addClass("active");
    let stateOptions;
    if (newValue === "GE") {
      stateOptions = [{ value: "", label: "Select State" }, { value: "Lok_Sabha", label: "All" }].concat(this.state.GE_States);
    } else if (newValue === "AE") {
      stateOptions = [{ value: "", label: "Select State" }].concat(this.state.AE_States);
      //this.setState({segmentWise : false});
      // if(this.state.stateName === "Lok_Sabha"){
      //   this.setState({stateName:""});
      //   this.updateURL({remove:"st"})
      // }
    }
    this.setState({ electionType: newValue
      ,stateOptions: stateOptions
      ,showVisualization: false
      ,chartMapOptions: []
      ,party: ""
      ,year: ""
      ,segmentWise : false
      ,stateName: ""
      ,visualizationType: ""
      ,visualization: ""
     });
    this.updateURL({variable:"et",val:newValue, remove:["seg","an","opt","st","viz","var"]});

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

      let segmentwise = this.state.segmentWise;
      if(segmentwise && electionType ==="GE"){
        electionType = "GA"
      }

      const url = Constants.baseUrl + "/data/api/v1.0/getVizData";
      fetch(url, {
        method: "POST",
        mode:"cors",
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

        this.setState({ vizData: resp.data });
        var checked = ChartsMapsCodes.filter(function (item) { return item.modulename === visualization })[0].alloptionschecked;
        if (checked) {
          this.setState({ showVisualization: true });
        }
        setTimeout(() => resolve(resp.data), 500);
      });
    });
  }

  fetchMapOverlay = () => {
    return new Promise((resolve, reject) =>{
      let electionType = this.state.electionType;
      let segmentwise = this.state.segmentWise;
      let stateName = this.state.stateName;
      var file = electionType === "GE" ? "/India_PC_json.geojson": "/"+stateName+"_AC_json.geojson";
      const url = Constants.baseUrl + file;
      fetch(url, {
        method: "GET",
        mode:"cors",
      }).then(response => response.json()).then(resp => {
        if((electionType === "GE") && stateName !== "Lok_Sabha"){
          var map = resp.features.filter(function(item){return item.properties.State_Name=== stateName});
        }else{
          var map = resp.features;
        }

        this.setState({ mapOverlay: map });
        setTimeout(() => resolve(map), 500);
      });

    });
  }

  fetchMapData = () => {
    return new Promise((resolve, reject) => {
      let electionType = this.state.electionType;
      let segmentwise = this.state.segmentWise;
      if(segmentwise && electionType ==="GE"){
        electionType = "GA"
      }
      let stateName = this.state.stateName;
      var file = electionType === "GE" ? "/India_PC_json.geojson": electionType === "GA"? "/India_AC_json.geojson" :"/"+stateName+"_AC_json.geojson";
      const url = Constants.baseUrl + file;
      fetch(url, {
        method: "GET",
        mode:"cors",
      }).then(response => response.json()).then(resp => {
        if((electionType === "GE" || electionType === "GA") && stateName !== "Lok_Sabha"){
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

    const url = Constants.baseUrl + "/data/api/v1.0/getMapYearParty";
    fetch(url, {
      method: "POST",
      mode:"cors",
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
      var data = [{ value: "", label: "Select Party" }];
      var data = data.concat(resp.data.map(function (item) { return { label: item, value: item } }));
      this.setState({ partyOptions: data });
      //this.onPartyChange("");
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
      mode:"cors",
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

  fetchMapYearAndData = (searchYear, party=this.state.party) => {
    return new Promise((resolve, reject) => {
      let electionType = this.state.electionType;
      let stateName = this.state.stateName;
      let visualization = this.state.visualization;
      let visualizationType = this.state.visualizationType;
      let assemblyNumber = this.state.year;
      //let party = this.state.party;
      let legends = this.state.vizOptionsSelected;


      const url = Constants.baseUrl + "/data/api/v1.0/getMapYear";
      fetch(url, {
        method: "POST",
        mode:"cors",
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
        let segmentwise = this.state.segmentWise;
        if(segmentwise && electionType ==="GE"){
          electionType = "GA"
        }

        resp.data.forEach(function (item) {
          const urlVizData = Constants.baseUrl + "/data/api/v1.0/getVizData";
          fetch(urlVizData, {
            method: "POST",
            mode:"cors",
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
            mode:"cors",
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
      mode:"cors",
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

        this.setState({ vizOptionsSelected: new Set(resp.data.map(x => x.replace(/_/g, ""))) },  () => {
          this.fetchVisualizationData();
          if(visualizationType==="Map"){
            this.fetchMapData();
          }
          //this.updateURL({variable:"opt",val:[resp.data.map(x => x.replace(/_/g, ""))]});

        this.setState({ showVisualization: true });
        });
      }
      var selectedOptions = resp.selected;
      if(this.state.vizOptionsSelected.size > 0){
        this.setState({ showVisualization: true });
      }
      else if(typeof selectedOptions != "undefined" && selectedOptions != null && selectedOptions.length != null && selectedOptions.length > 0){
        this.setState({ vizOptionsSelected: new Set(selectedOptions.map(x => x.replace(/_/g, ""))) },  () => {
          this.fetchVisualizationData();
          if(visualizationType==="Map"){
            this.fetchMapData();
          }
          //this.updateURL({variable:"opt",val:[selectedOptions.map(x => x.replace(/_/g, ""))]});
        });

        this.setState({ showVisualization: true });
      }

    });
  }



  optionChange = (selected,viz) => {
    const vis_list=["cvoteShareChart","seatShareChart","tvoteShareChart","strikeRateChart","incumbentsParty","incumbentsStrikeParty","turncoatsStrikeParty","firstTimeParty","ptyOccupationMLA","ptyEducationMLA"]
    var selectedOpts = new Set(selected.map(x=>x.value || x))
    let visualization = this.state.visualization || viz;
    this.setState({
      vizOptionsSelected: selectedOpts
    },  () => {

      if (vis_list.includes(visualization)) {
        this.fetchVisualizationData();
        this.setState({ showVisualization: true });
      }
    });
    this.updateURL({variable:"opt",val:[...selectedOpts]});

  };
  createOptionsSelect = () => {
    var selectOptions = [];
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
      var option = {}
      option["value"]= item.replace(/_/g, "")
      option["label"]=item.replace(/_/g, " ").replace(/ pct/g,"")

      var checked = vizOptionsSelected.has(item.replace(/_/g, "").replace(/ pct/g,""));
      var name = ""
      if(typeof optionNames === "object"){
        name = optionNames[item]
      }
      option["isSelected"]= checked
      option["name"] = name

      selectOptions.push(option)
    });

    if (selectOptions.length > 0) {
      return <div >
        <label>{label}</label>
        <Select
          options={selectOptions}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          menuColor = "#B83027"
          components={{
            Option, ClearIndicator :() => null
          }}
          styles={customStyles}
          onChange={this.optionChange}
          allowSelectAll={true}
          value={selectOptions.filter(x=> x.isSelected===true)}
        />
      </div>;
    }
  }

  renderVisualization = () => {
    const data = this.state.vizData;
    var shape = this.state.mapData;
    var dataFilterOptions = this.state.vizOptionsSelected;
    var electionType = this.state.electionType;
    var stateName = this.state.stateName;
    var visualization = this.state.visualization;
    var assemblyNo = this.state.year;
    const { visualizationType, yearOptions, chartMapOptions, showChangeMap, showBaseMap, showNormalizedMap, party, showVisualization, segmentWise, mapOverlay,electionYearDisplay } = this.state;

    if (!data) {
      return (
        <ErrorScreen
          message="An error occured while trying to get this data."
        />
      )
    }

    return (
      <ErrorBoundary>
        <DataVizWrapper
          visualization={visualization}
          visualizationType={visualizationType}
          data={data}
          map={shape}
          party = {party}
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
          showBaseMap = {showBaseMap}
          onShowBaseMapChange = {this.onShowBaseMapChange}
          showNormalizedMap={showNormalizedMap}
          onShowNormalizedMapChange={this.onShowNormalizedMapChange}
          segmentWise={segmentWise}
          mapOverlay = {mapOverlay}
          electionYearDisplay = {electionYearDisplay}
        />
      </ErrorBoundary>
    );
  }

  onAssemblyNoChange = (newValue) => {
    this.setState({showVisualization: false, year : newValue}, ()=>{

      this.fetchVisualizationData();
      // if (this.state.showVisualization === true) {
      //    this.setState({ showVisualization: false });
      //
      //    //this.setState({ showVisualization: true });
      //  }
      this.updateURL({variable:"an",val:newValue});
    })
  }

  onPartyChange = (newValue) => {
    this.setState({ party: newValue });

    this.fetchMapYearAndData("",newValue);


    if (this.state.showVisualization === true) {
       this.setState({ showVisualization: false });

       //this.setState({ showVisualization: true });
     }
    this.updateURL({variable:"pty",val:newValue});
  }
  onAssemblyChange = (newValue) => {
    var disp = this.state.stateAssemblies.filter(x=> x.value===parseInt(newValue))[0].label;
    this.setState({ year: newValue,electionYearDisplay: disp });

    //this.fetchMapYearAndData("",newValue);

    this.updateURL({variable:"an",val:newValue});
  }

  onYearChange = (newValue) => {

    this.setState({ showVisualization: false,year: newValue }, () => {
      // if (this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap") {
      //   this.fetchMapYearParties();
      // }
      //else {
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
      //}
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
  onSegment = (checked)=>{
    this.setState({ segmentWise: checked },
       () => {
        if(this.state.visualizationType === "Map"){
          this.setState({ showVisualization: false });
           this.fetchMapData();
          if (this.state.visualization === "partyPositionsMap" || this.state.visualization === "partyVoteShareMap") {
             this.fetchMapYearParties();
          }
          if(checked){
             this.fetchMapOverlay();
          }
           this.fetchMapYearAndData("");
        }
       this.fetchVisualizationData();
    });
  }
  onAcSegmentClick = (key, checked) => {
    this.updateURL({variable:"seg",val:checked});
    this.onSegment(checked);
  }

  render() {
    var electionType = this.state.electionType;
    var stateOptions = this.state.stateOptions;
    var stateName = this.state.stateName;
    var visualization = this.state.visualization;
    var visualizationOptions = this.state.visualizationOptions ;
    var visualizationVarOptions = this.state.visualizationVarOptions;
    var visualizationType = this.state.visualizationType;
    var visualizationVar = this.state.visualizationVar;
    var yearOptions = this.state.yearOptions;
    var assemblyOptions = this.state.stateAssemblies;
    var year = this.state.year;
    var party = this.state.party;
    var partyOptions = this.state.partyOptions;
    var showVisualization = this.state.showVisualization;
    var dataFilterOptions = this.state.vizOptionsSelected;
    var csvData = this.state.vizData;
    var isDataDownloadable = this.state.isDataDownloadable;
    var showTermsAndConditionsPopup = this.state.showTermsAndConditionsPopup;

    var adrDataStartYear = visualization ==="occupationMLA" || visualization ==="ptyOccupationMLA"?2010:2004;

    var adrAssemblies = assemblyOptions.filter(function (item) { return item.year >= adrDataStartYear }).sort(compareValues('value','desc'));
    //var adrAssembly = adrAssemblies.filter(function(item){return item.value===year});


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
                {<LdSelect id="dv_state_selector" label="State" options={stateOptions} selectedValue={stateName} onChange={this.onStateNameChange} />}
                {stateName !== "" && <LdSelect id="dv_var_selector" label="Variable" options={visualizationVarOptions} selectedValue={visualizationVar} onChange={this.onVisualizationVarChange} />}
                {visualizationVar !== "" && <LdSelect id="dv_visualization_selector" label="Visualization" selectedValue={visualization} options={visualizationOptions} onChange={this.onVisualizationChange} />}
                {electionType === "GE" && visualization !== "voterTurnoutChart" && visualization !== "voterTurnoutMap" && visualizationVar !="Candidate" && visualizationVar !="ADR" && <Checkbox id="assembly_segments" label="Show AC segment wise results" checked= {this.state.segmentWise} onChange={this.onAcSegmentClick} />}
                {(visualization === "partyPositionsMap" || visualization === "partyVoteShareMap") && <LdSelect id="dv_party_selector" label="Select Party" options={partyOptions} selectedValue={party} onChange={this.onPartyChange} />}
                {(visualizationVar === "ADR" && visualization !=="") && <LdSelect id="dv_adr_assem_selector" label="Select Assembly" options={adrAssemblies} selectedValue={year} onChange={this.onAssemblyChange} />}
                {((visualizationType === "Chart") || (visualizationType === "Map" && year !== "" && (visualization === "winnerMap" || visualization === "numCandidatesMap" || visualization === "partyPositionsMap" ))) && this.createOptionsSelect()}
                <br/>
                {showVisualization && <Button className="btn" variant="primary" onClick={this.showTermsAndConditionsPopup}> Download Data</Button>}
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

//{((visualizationType === "Chart") || (visualizationType === "Map" && year !== "" && (visualization === "winnerMap" || visualization === "numCandidatesMap" || visualization === "partyPositionsMap" ))) && this.createOptionsCheckboxes()}
