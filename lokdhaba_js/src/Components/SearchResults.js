import React, { Component } from 'react';
import "../Assets/Styles/search.css";
import DataVizResults from './Shared/SearchResults/DataVizResults';
import DataBrowseResults from './Shared/SearchResults/DataBrowseResults';

class SearchResults extends Component {

  render() {
    const res = this.props.location.state.results[0]['results']
    const electionType = res['electionType']
    const stateName = res['stateName']
    const year = res['year'][0]
    const years = res['year']
    const party = res['party']
    const modules = res['similarModules']

    return (
      <div className="content overflow-auto">
        <div className="text-content">
          <h2>Search Results</h2>
          <br />
          <DataVizResults modules={modules} electionType={electionType} stateName={stateName} year={year} party={party} />
          <br />
          <DataBrowseResults electionType={electionType} stateName={stateName} years={years} />
        </div >
      </div >
    )
  }
}

export default SearchResults;
