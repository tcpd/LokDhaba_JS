import React, { Component } from 'react';
import * as Constants from './Constants.js';
import { withRouter } from 'react-router-dom'
import '../../Assets/Styles/navbar.css'

class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: [],
      loading: false,
    };
  }

  fetchSearchResults = (query) => {
    const url = Constants.baseUrl + "/data/api/v1.0/getSearchResults";
    fetch(url, {
      method: "POST",
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        Query: query
      })
    }).then(response => response.json()).then(resp => {
      this.setState({ results: [resp] })
      this.props.history.push({
        pathname: '/search-results',
        search: 'term=' + query,
        state: { results: [resp] }
      })
    });
  }

  handleOnInputChange = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;

      if (!query) {
        this.setState({
          query,
          results: {},
        })
      } else {
        this.setState({
          query,
          loading: true,
        }, () => {
          this.fetchSearchResults(query)
        })
      }
    }
  }

  render() {
    return (
      <div className="search-box">
        <input type="text" placeholder="Search..." onKeyDown={this.handleOnInputChange} />
      </div>
    )
  }
}

export default withRouter(SearchBox);