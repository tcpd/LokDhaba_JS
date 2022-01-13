import React, { Component } from 'react';
import { CSVLink } from "react-csv";
import Select from './Shared/Select.js';
import Checkbox from './Shared/Checkbox.js';
import Popup from './Shared/Popup.js';
import Table from './Shared/Table.js';
import * as Constants from './Shared/Constants.js'
import StateCodes from '../Assets/Data/StateCodes.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import LokSabhaNumber from '../Assets/Data/LokSabhaNumber.json'
import { Button } from 'react-bootstrap';
import '../Assets/Styles/table.css'
import ReactTooltip from 'react-tooltip'

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


export default class BrowseData extends Component {
  constructor(props) {
    super(props);
    // let inputs = getParams(props.location);
    // var et = inputs.get("et") || "";
    this.state = {
      electionType: "",
      segmentWise : false,
      stateName: "",
      GE_States: [],
      AE_States: [],
      stateOptions: [],
      stateAssemblies: [],
      assembliesChecked: new Set(),
      tableData: [],
      allChecked: false,
      showTermsAndConditionsPopup: false,
      csvData: [],
      isDataDownloadable: false,
      filters: []
    };
  }

  setYearsFromSearch = (searchYears) => {
    if (typeof searchYears !== 'undefined' && searchYears.length > 0) {
      let options = this.state.stateAssemblies;
      searchYears.map((searchYear) => {
        let year = parseInt(searchYear);
        let assembly = options.find((ele) => {
          return ele.Year === year
        })

        if (typeof assembly !== 'undefined') {
          this.onAssemblyChecked(assembly.Assembly_No.toString(), true);
        }
        return null;
      })
    }
  }

  componentDidMount() {
    let searchYears = []
    if (this.props.location.state) {
      searchYears = this.props.location.state.years;
      console.log(searchYears)
    }

    var GE_States = StateCodes.sort(compareValues('State_Name')).map(function (item) { return { value: item.State_Name, label: item.State_Name.replace(/_/g, " ") } });
    var unique_AE_States = [...new Set(VidhanSabhaNumber.sort(compareValues('State_Name')).map(x => x.State_Name))];
    var AE_States = unique_AE_States.map(function (item) { return { value: item, label: item.replace(/_/g, " ") } });
    this.state.GE_States = GE_States;
    this.state.AE_States = AE_States;
    //this.setState({'GE_States': GE_States, 'AE_States': AE_States });
    let inputs = getParams(this.props.location);
    var et = inputs.get("et") || "";
    if(et !== ""){this.onElectionTypeChange(et);}
    var st = inputs.get("st") || "";
    if(st !== "" ){this.onStateNameChange(st, searchYears);}
    //this.setState({  });
    var assemblies = inputs.get("an") || "";
    if(assemblies !== ""){
      var assembly_numbers = assemblies.replace(/%2C/g,",").split(",");
      this.state.assembliesChecked = new Set(assembly_numbers);
      for(var an =0; an < assembly_numbers.length;an++){
        this.onAssemblyChecked(assembly_numbers[an],true);
      }
    }
    var seg = inputs.get("seg") || "";
    if(seg !== ""){this.onSegment(seg);}


    // var an = inputs.get("an") || "";
    // if(an !== "" ){this.onYearChange(an);}


  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.filters !== this.state.filters) {
      this.setState({ isDataDownloadable: false });
    }

  }

  updateURL = (props) => {
    const { variable, val } = props
    const url = setParams({ location: this.props.location, variable:variable, val: val });
    this.props.history.push(`?${url}`);
  };

  onAcceptTermsAndConditions = (key, checked) => {
    if (checked) {
      this.fetchDownloadData(checked);
    }
  }
  onSegment = (checked) =>{

    this.setState({ segmentWise: checked },
      () => {
        this.fetchTableData();
    });
  }

  onAcSegmentClick = (key, checked) => {
    this.updateURL({variable:"seg",val:checked});
    this.onSegment(checked)

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

  onElectionTypeChange = (newValue) => {
    if (newValue !== this.state.electionType) {

      this.updateURL({variable:"et",val:newValue});
      // this.updateURL({variable:"st",val:""});
      // this.updateURL({variable:"an",val:""});
      this.state.electionType = newValue;
      let stateOptions;
      if (newValue === "GE") {
        stateOptions = [{ value: "", label: "Select State" }, { value: "all", label: "All" }].concat(this.state.GE_States);
      } else if (newValue === "AE") {
        stateOptions = [{ value: "", label: "Select State" }].concat(this.state.AE_States);
      }
      this.setState({ stateName: "" });
      this.setState({ stateOptions: stateOptions });
      this.setState({ isDataDownloadable: false });

    }else{
    }

  }

  onStateNameChange = (newValue, searchYears) => {
    this.setState({ assembliesChecked: new Set() });
    this.setState({ allChecked: false });
    this.setState({ stateName: newValue });
    let assemblies;
    if (this.state.electionType === "AE") {
      assemblies = VidhanSabhaNumber.filter(function (item) { return item.State_Name === newValue });
    } else if (this.state.electionType === "GE") {
      if (newValue === "all") {
        assemblies = [...new Set(LokSabhaNumber.map(s => s.Assembly_No))]
          .map(Assembly_No => {
            return {
              Assembly_No: Assembly_No,
              Year: LokSabhaNumber.find(s => s.Assembly_No === Assembly_No).Year
            };
          });
      } else {
        assemblies = LokSabhaNumber.filter(function (item) { return item.State_Name === newValue });
      }
    }
    this.setState(
      { stateAssemblies: assemblies },
      () => {
        this.setYearsFromSearch(searchYears)
      }
    );
    this.setState({ isDataDownloadable: false });
    this.updateURL({variable:"st",val:newValue});

    //this.updateURL({variable:"an",val:""});
  }

  fetchDownloadData = (checked) => {
    let electionType = this.state.electionType;
    let stateName = this.state.stateName;
    let filters = this.state.filters;
    let assemblyNumber = [...this.state.assembliesChecked].join(",");
    let segmentwise = this.state.segmentWise;
    if(segmentwise && electionType ==="GE"){
      electionType = "GA"
    }
    const url = Constants.baseUrl + "/data/api/v1.0/DataDownload";
    fetch(url, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json"
      }),
      body: JSON.stringify({
        ElectionType: electionType,
        StateName: stateName,
        AssemblyNo: assemblyNumber,
        Filters: filters
      })
    }).then(response => response.json()).then(resp => {
      this.setState({ isDataDownloadable: checked });
      this.setState({ csvData: resp.data });
    });
  }

  fetchTableData = (pageSize = 100, page = 0, sorted = [], filtered = []) => {
    return new Promise((resolve, reject) => {
      let electionType = this.state.electionType;
      let stateName = this.state.stateName;
      let assemblyNumber = [...this.state.assembliesChecked].join(",");
      let segmentwise = this.state.segmentWise;
      if(segmentwise && electionType ==="GE"){
        electionType = "GA"
      }
      const url = Constants.baseUrl + "/data/api/v2.0/getDerivedData";
      this.setState({ filters: filtered });
      fetch(url, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json"
        }),
        body: JSON.stringify({
          ElectionType: electionType,
          StateName: stateName,
          AssemblyNo: assemblyNumber,
          PageNo: page,
          PageSize: pageSize,
          Filters: filtered,
          SortOptions: sorted
        })
      }).then(response => response.json()).then(resp => {
        this.setState({ tableData: resp.data });
        const res = {
          rows: resp.data,
          pages: resp.pages
        };
        setTimeout(() => resolve(res), 500);
      });
    });
  }

  onAssemblyChecked = (key, checked) => {
    var assembliesChecked = this.state.assembliesChecked;
    if (key === "all") {
      assembliesChecked.clear();
      this.setState({ allChecked: checked });
    }
    if (checked) {
      assembliesChecked.add(key);
    } else {
      assembliesChecked.delete(key);
    }
    this.setState({ assembliesChecked: assembliesChecked });
    assembliesChecked.size > 0 && this.fetchTableData();
    this.setState({ isDataDownloadable: false });
    this.updateURL({variable:"an",val:[...assembliesChecked]});
  }

  createAssemblyCheckboxes = () => {
    let checkboxes = [];
    let scope = this;
    var isChecked = this.state.allChecked;
    let stateAssemblies = scope.state.stateAssemblies;
    if(this.state.segmentWise){
      stateAssemblies = stateAssemblies.filter(function(x){return x.Year >= 1999;})
    }
    checkboxes.push(<Checkbox id={"bd_year_selector_all"} key={0} label={"Select All"} checked={isChecked} onChange={scope.onAssemblyChecked} />)
    stateAssemblies.forEach(function (item) {
      var checked = scope.state.assembliesChecked.has(item.Assembly_No.toString()) ? true : isChecked;
      checkboxes.push(<Checkbox id={"bd_year_selector_" + item.Assembly_No} checked={checked} key={item.Assembly_No} label={item.Assembly_No + " Assembly (" + item.Year + ")"} onChange={scope.onAssemblyChecked} />)
    });
    return checkboxes;
  }

  render() {
    var electionType = this.state.electionType;
    var stateName = this.state.stateName;
    var assembliesChecked = this.state.assembliesChecked;
    var stateOptions = this.state.stateOptions;
    var csvData = this.state.csvData;
    var isDataDownloadable = this.state.isDataDownloadable;
    var showTermsAndConditionsPopup = this.state.showTermsAndConditionsPopup;
    var electionTypeOptions = [{ value: "", label: "Select Election Type" },
    { value: "GE", label: "General Elections" },
    { value: "AE", label: "Assembly Elections" }];
    var columns = this.state.segmentWise? Constants.segmentTableColumns:Constants.tableColumns;
    var today = new Date();
    let segmentwise = this.state.segmentWise;
    if(segmentwise && electionType ==="GE"){
      electionType = "GA"
    }
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var filename = `TCPD_${electionType}_${this.state.stateName}_${date}.csv`;
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
        <div className="browse-data">
          <div className="row">
            <div className="col-xs-3 input card" style={{ width: "20%", padding: "0.5rem" }}>
              <form className="well">
                <Select id="bd_electiontype_selector" label="Election Type" options={electionTypeOptions} selectedValue={electionType} onChange={this.onElectionTypeChange} />
                {electionType !== "" && <Select id="bd_state_selector" label="State Name" options={stateOptions} selectedValue={stateName} onChange={this.onStateNameChange} />}
                <br></br>
                {(electionType === "GE"||electionType === "GA") && <Checkbox id="assembly_segments" label="Show AC segment wise results" checked= {this.state.segmentWise} onChange={this.onAcSegmentClick} />}
                {stateName !== "" && this.createAssemblyCheckboxes()}

                {assembliesChecked.size > 0 && <Button className="btn-lg" onClick={this.showTermsAndConditionsPopup}> Download Data</Button>}
              </form>
            </div>
            <div className="col-xs-9 table" style={{ width: "80%" }}>
              {assembliesChecked.size > 0 && <Table columns={columns} data={this.state.tableData} fetchData={this.fetchTableData} />}
            </div>
          </div>
          {showTermsAndConditionsPopup && <Popup id="tems_and_conditions_popup" show={showTermsAndConditionsPopup} body={modalBody} heading={<p>Terms and Conditions</p>} footer={modalFooter} handleClose={this.CloseTermsAndConditionsPopup} />}
        </div>
      </div>
    )
  }
}
