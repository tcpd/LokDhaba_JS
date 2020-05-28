import React, { Component } from 'react';
import ChartsMapsCodes from '../Assets/Data/ChartsMapsCodes.json';
import { withRouter, NavLink } from 'react-router-dom';
import "../Assets/Styles/search.css";

class SearchResults extends Component {

  getElectionName = (electionType) => {
    if (electionType === "GE") {
      return "General Elections"
    }
    else if (electionType === "AE") {
      return "Assembly Elections"
    }
    else {
      return "Not specified"
    }
  }

  getStateName = (stateName) => {
    if (stateName === "Lok_Sabha") {
      return ""
    }
    else {
      return stateName
    }
  }

  getBrowseDataLink = (electionType, stateName, years) => {
    return (
      <NavLink to={{
        pathname: "/browse-data",
        search: "?et=" + electionType + "&st=" + stateName.replace(/_/g, " "),
        state: {
          years: years
        }
      }}
        className="searchLink"
      >Browse data
        <pre>{this.getElectionName(electionType)}    {this.getStateName(stateName)}</pre>
      </NavLink>
    )
  }

  getDataVizLink = (modulename, title, electionType, stateName, year, party) => {
    return (
      <NavLink
        to={{
          pathname: "/data-vis",
          search: "?et=" + electionType + "&st=" + stateName + "&viz=" + modulename + "&opt=" + party,
          state: {
            year: year
          }
        }}
        className="searchLink"
      >
        {title}
      <pre>{this.getElectionName(electionType)}    {this.getStateName(stateName)}    {year}    {party.join(' ')}</pre>
      </NavLink>
    )
  }

  renderBrowseDataResults = (electionType, stateName, years) => {
    if (electionType === "GE" || electionType === "AE") {
      return (
        <div>
          {this.getBrowseDataLink(electionType, stateName, years)}
        </div>
      )
    }
    else {
      return (
        <div>
          <div>
            {this.getBrowseDataLink("GE", stateName, years)}
          </div>
          <div>
            {this.getBrowseDataLink("AE", stateName, years)}
          </div>
        </div>
      )
    }
  }

  renderDataVizResults = (item, electionType, stateName, year, party) => {
    let title = ChartsMapsCodes.filter(function (element) { return element.modulename === item[0] })[0].title;
    let modulename = item[0];

    if (electionType === "AE" || electionType === "GE") {
      return (
        <div key={item[0] + electionType}>
          {this.getDataVizLink(modulename, title, electionType, stateName, year, party)}
        </div>
      )
    }
    else {
      return (
        <div key={item[0]}>
          <div key={item[0] + "GE"}>
            {this.getDataVizLink(modulename, title, "GE", stateName, year, party)}
          </div>
          <div key={item[0] + "AE"}>
            {this.getDataVizLink(modulename, title, "AE", stateName, year, party)}
          </div>
        </div>
      )
    }
  }

  render() {
    const res = this.props.location.state.results[0]['results']
    const electionType = res['electionType']
    const stateName = res['stateName']
    const year = res['year'][0]
    const years = res['year']
    const party = res['party']
    const modules = res['similarModules']

    // Find the maximum differnce (gap) between similarity scores
    let maxDiff = 0;
    let maxDiffIndex = 0;
    for (let index = 0; index < modules.length - 1; index++) {
      let diff = modules[index][1] - modules[index + 1][1]
      if (diff > maxDiff) {
        maxDiff = diff;
        maxDiffIndex = index;
      }
    }

    // Collect results before the gap
    const dataVizResults = []
    const maxResults = 10;
    const limit = Math.min(maxDiffIndex, maxResults);

    for (let index = 0; index <= limit; index++) {
      const element = modules[index];
      dataVizResults.push(element);
    }

    return (
      <div className="content overflow-auto">
        <div className="text-content">
          <h2>Search Results</h2>
          <br />
          <div>
            <h5>Data Visualization</h5>
            {dataVizResults.map((item) => this.renderDataVizResults(item, electionType, stateName, year, party))}
          </div>
          <br />
          <div>
            <h5>Browse Data</h5>
            {this.renderBrowseDataResults(electionType, stateName, years)}
          </div>
        </div >
      </div >
    )
  }
}

export default withRouter(SearchResults);
