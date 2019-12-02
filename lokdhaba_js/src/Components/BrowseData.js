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


export default class BrowseData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionType: "",
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

  componentDidMount() {
    var GE_States = StateCodes.map(function (item) { return { value: item.State_Name, label: item.State_Name.replace(/_/g, " ") } });
    var unique_AE_States = [...new Set(VidhanSabhaNumber.map(x => x.State_Name))];
    var AE_States = unique_AE_States.map(function (item) { return { value: item, label: item.replace(/_/g, " ") } });
    this.setState({ GE_States: GE_States });
    this.setState({ AE_States: AE_States });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.filters !== this.state.filters) {
      this.setState({ isDataDownloadable: false });
    }
  }

  onAcceptTermsAndConditions = (key, checked) => {
    this.setState({ isDataDownloadable: checked });
    if (checked) {
      this.fetchDownloadData();
    }
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
      this.setState({ stateName: "" });
    }
    this.setState({ electionType: newValue });
    let stateOptions;
    if (newValue === "GE") {
      stateOptions = [{ value: "", label: "Select State" }, { value: "all", label: "All" }].concat(this.state.GE_States);
    } else if (newValue === "AE") {
      stateOptions = [{ value: "", label: "Select State" }].concat(this.state.AE_States);
    }
    this.setState({ stateOptions: stateOptions });
    this.setState({ isDataDownloadable: false });
  }

  onStateNameChange = (newValue) => {
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
    this.setState({ stateAssemblies: assemblies });
    this.setState({ isDataDownloadable: false });
  }

  fetchDownloadData = () => {
    let electionType = this.state.electionType;
    let stateName = this.state.stateName;
    let filters = this.state.filters;
    let assemblyNumber = [...this.state.assembliesChecked].join(",");
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
      this.setState({ csvData: resp.data });
    });
  }

  fetchTableData = (pageSize = 100, page = 0, sorted = [], filtered = []) => {
    return new Promise((resolve, reject) => {
      let electionType = this.state.electionType;
      let stateName = this.state.stateName;
      let assemblyNumber = [...this.state.assembliesChecked].join(",");
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
  }

  createAssemblyCheckboxes = () => {
    let checkboxes = [];
    let scope = this;
    var isChecked = this.state.allChecked;
    var stateAssemblies = scope.state.stateAssemblies;
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
    var columns = Constants.tableColumns;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var filename = `TCPD_${this.state.electionType}_${this.state.stateName}_${date}.csv`;
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
            <div className="col-xs-3 input" style={{ width: "20%" }}>
              <form className="well">
                <Select id="bd_electiontype_selector" label="Election Type" options={electionTypeOptions} onChange={this.onElectionTypeChange} />
                {electionType !== "" && <Select id="bd_state_selector" label="State Name" options={stateOptions} onChange={this.onStateNameChange} />}
                <br></br>
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
