import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';

class DataBrowseResults extends Component {

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

  render() {
    const { electionType, stateName, years } = this.props;

    return (
      <div>
        <h5>Browse Data</h5>
        {this.renderBrowseDataResults(electionType, stateName, years)}
      </div>
    )
  }
}

export default withRouter(DataBrowseResults);
