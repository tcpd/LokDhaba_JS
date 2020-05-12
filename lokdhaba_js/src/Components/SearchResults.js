import React, { Component } from 'react';
import ChartsMapsCodes from '../Assets/Data/ChartsMapsCodes.json';
import { Link } from 'react-router-dom'

export default class SearchResults extends Component {

  renderItem = (item, electionType, stateName) => {
    var title = ChartsMapsCodes.filter(function (element) { return element.modulename === item[0] })[0].title;
    var link = "/data-vis?et=" + electionType + "&st=" + stateName + "&viz=" + item[0]

    return (
      <div key={item[0]}>
        <Link to={link}>{title}</Link>
      </div>
    )
  }

  render() {
    let res = this.props.location.state.results[0]['results']

    // Create modules array
    var modules = Object.keys(res['similarModules']).map(function (key) {
      return [key, res['similarModules'][key]];
    });

    // Sort the array based on similarity scores
    modules.sort(function (first, second) {
      return second[1] - first[1];
    });

    return (
      <div className="content overflow-auto">
        <div className="text-content">
          <h2>Search Results</h2>
          <div>
            electionType: {res['electionType']}
          </div>
          <div>
            stateName: {res['stateName']}
          </div>
          <div>
            {modules.map((item) => this.renderItem(item, res['electionType'], res['stateName']))}
          </div>
        </div >
      </div >
    )
  }
}
