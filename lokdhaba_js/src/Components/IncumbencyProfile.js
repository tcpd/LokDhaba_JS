import React, { Component } from 'react';
import IncumbencyViz from './Shared/IncumbencyViz';
import LokSabhaNumber from '../Assets/Data/LokSabhaNumber.json';
import VidhanSabhaNumber from '../Assets/Data/VidhanSabhaNumber.json';
import Select from '../Components/Shared/Select';
import '../Assets/Styles/incumbency.css';

const incumbencyBaseURL = 'Incumbency/';
const lokSabha = { name: "Lok Sabha", code: "ge" };
const states = [{ name: "Delhi", code: "dl" }, { name: "Haryana", code: "hr" }, { name: "Jharkhand", code: "jh" }, { name: "Maharashtra", code: "mh" }];

function setParams(props) {
  const { location, variable, val } = props;
  const searchParams = new URLSearchParams(location.search);
  searchParams.set(variable, val || "");
  return searchParams.toString();
}

export default class IncumbencyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assembly: "",
      assemblyOptions: [],
      assemblyNumber: "",
      assemblyNumberOptions: new Set(),
      label: "TIMES_WON",
      labelOptions: [{ value: "NO_LABEL", label: "No label" }, { value: "TIMES_WON", label: "Times won" }, { value: "TIMES_CONTESTED", label: "Times Contested" }],
      position: "1",
      positionOptions: [{ value: "1", label: "Only winners" }, { value: "2", label: "All candidates" }],
      experience: "ALL",
      experienceOptions: [{ value: "ALL", label: "All" }, { value: "NEWCOMERS", label: "Newcomers" }, { value: "PREVIOUSLY_CONTESTED", label: "Previously Contested" }, { value: "TURNCOATS", label: "Turncoats" }],
      gender: "ALL",
      genderOptions: [{ value: "ALL", label: "All" }, { value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }, { value: "OTHER", label: "Other" }],
      searchTerm: "",
    };
  }

  componentDidMount() {
    console.log("inc mount")
    let assemblyOptions = [{ value: "", label: "Select" }];
    assemblyOptions.push({ value: lokSabha.name, label: lokSabha.name });
    states.forEach((item) => {
      assemblyOptions.push({ value: item.name, label: item.name });
    });
    this.setState({ assemblyOptions: assemblyOptions });
  }

  updateURL = (props) => {
    const { variable, val } = props
    const url = setParams({ location: this.props.location, variable: variable, val: val });
    this.props.history.push(`?${url}`);
  };

  onAssemblyChange = (newValue) => {
    this.setState({ assembly: newValue });
    let assemblies;
    if (newValue === lokSabha.name) {
      assemblies = LokSabhaNumber.filter(function (item) { return item.State_Name.replace(/_/g, " ") === "Delhi" });
    }
    else { assemblies = VidhanSabhaNumber.filter(function (item) { return item.State_Name.replace(/_/g, " ") === newValue }); }
    this.setState({ assemblyNumberOptions: assemblies });
    this.updateURL({ variable: "st", val: newValue });
  }

  onAssemblyNumberChange = (newValue) => {
    this.setState({ assemblyNumber: newValue });
    this.updateURL({ variable: "an", val: newValue });
  }

  onLabelChange = (newValue) => {
    this.setState({ label: newValue });
    this.updateURL({ variable: "lb", val: newValue });
  }

  onPositionChange = (newValue) => {
    this.setState({ position: newValue });
    this.updateURL({ variable: "pos", val: newValue });
  }

  onGenderChange = (newValue) => {
    this.setState({ gender: newValue });
    this.updateURL({ variable: "gen", val: newValue });
  }

  onExperienceChange = (newValue) => {
    this.setState({ experience: newValue });
    this.updateURL({ variable: "exp", val: newValue });
  }

  onSearchChange = (event) => {
    const query = event.target.value;
    this.setState({ searchTerm: query });
  }

  getElectionName = (assembly) => {
    if (assembly === "") {
      return "Not selected";
    }
    else if (assembly === "Lok Sabha") {
      return "Lok Sabha";
    }
    else {
      return assembly + " Vidhan Sabha";
    }
  }

  renderHeader = (assembly, assemblyNumber) => {
    if (assembly === "" || assemblyNumber === "") {
      return (
        <h3>
          Incumbency profile
        </h3>
      )
    }
    else {
      return (
        <h3>
          Incumbency profile for {this.getElectionName(assembly)} (Assembly #{assemblyNumber})
        </h3>
      )
    }
  }

  renderAssemblyNumberOptions = () => {
    const { assemblyNumber, assemblyNumberOptions } = this.state;

    let options = [{ value: "", label: "Select" }];
    assemblyNumberOptions.forEach((item) => {
      const option = { label: `${item.Year} (#${item.Assembly_No})`, value: item.Assembly_No };
      options.push(option);
    })

    return (
      <Select id="assembly_number_selector" label="Assembly No." options={options} selectedValue={assemblyNumber} onChange={this.onAssemblyNumberChange} />
    )
  }

  getAssemblyCode = (assembly) => {
    if (assembly === lokSabha.name) {
      return lokSabha.code;
    }
    let stateMatch = states.filter((item) => {
      return item.name === assembly;
    })
    if (stateMatch.length) {
      return stateMatch[0].code;
    }
    else return "";
  }

  render() {
    const { assembly, assemblyOptions, assemblyNumber, label, labelOptions, position, positionOptions, experience, experienceOptions, gender, genderOptions, searchTerm } = this.state;
    const pids_data_url = incumbencyBaseURL + this.getAssemblyCode(assembly) + '-pids.csv';
    const data_url = incumbencyBaseURL + this.getAssemblyCode(assembly) + '-incumbency-' + assemblyNumber + '.csv';

    return (
      <div className="content overflow-auto">
        <div style={{ margin: '20px' }}>
          {this.renderHeader(assembly, assemblyNumber)}

          <div className="help">
            <p><i>About this visualization: Each box represents an MLA contesting in the general elections to State
            Legislative
            Assembly. The color of the box indicates the previous party of the MP
            Only the most successful parties are shown; other parties are clubbed into "Other".

            Hover on a box to see more details such as constituency, year and position. Unsuccessful attempts
            are shown in
            grey.

            The number in the box is the total number of terms in which the person has been an MP, including the
            new term.
            Change the Label setting to see the number of terms contested instead.

            You can also change the Position setting to "All candidates" instead of just the winners. Squares
            indicate
            winners and circles indicate those who lost.
                    To search for a person or constituency, type the name in the search box.</i></p>
          </div>
          <div className="controls">

            <div className="input-container">
              <input autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" size="28"
                type='text' className="select-search" id='search' placeholder="Person, constituency or party" onChange={this.onSearchChange} />
            </div>

            <div className="input-container">
              <Select id="assembly_selector" label="Assembly" options={assemblyOptions} selectedValue={assembly} onChange={this.onAssemblyChange} />
            </div>

            <div className="input-container">
              {this.renderAssemblyNumberOptions()}
            </div>

            <div className="input-container">
              <Select id="label_selector" label="Label" options={labelOptions} selectedValue={label} onChange={this.onLabelChange} />
            </div>

            <div className="input-container">
              <Select id="position_selector" label="Position" options={positionOptions} selectedValue={position} onChange={this.onPositionChange} />
            </div>

            <div className="input-container">
              <Select id="experience_selector" label="Experience" options={experienceOptions} selectedValue={experience} onChange={this.onExperienceChange} />
            </div>

            <div className="input-container">
              <Select id="gender_selector" label="Gender" options={genderOptions} selectedValue={gender} onChange={this.onGenderChange} />
            </div>

          </div>
          
          <IncumbencyViz
            assembly={assembly}
            assemblyNumber={assemblyNumber}
            label={label}
            position={position}
            experience={experience}
            gender={gender}
            searchTerm={searchTerm}
            data_url={data_url}
            pids_data_url={pids_data_url}
          />
        </div>
      </div>
    )
  }
}
