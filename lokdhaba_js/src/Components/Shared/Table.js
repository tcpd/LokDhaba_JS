import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
var _ = require('lodash');

export default class Table extends Component {
  constructor(props){
        super(props);
        this.state = {loading: false, pages: 0, data: this.props.data};
        this.filtering = false;
        this.fetchDataWithDebounce = _.debounce(this.fetchData, 1500);
      }

fetchStrategy = (tableState) => {
    if(this.filtering) {
      return this.fetchDataWithDebounce(tableState)
    } else {
      return this.fetchData(tableState);
    }
  }

  onFilteredChange = (column, value) => {
    this.filtering = true;
  }

 fetchData = (state) =>  {
  this.filtering = false
  this.setState({ loading: true });
  this.props.fetchData(state.pageSize, state.page, state.sorted, state.filtered).then(
    res => {
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      });
      }
    );
  }

 render() {
   var columns = this.props.columns;
   var data  = this.props.data;
    return (
      <ReactTable columns={columns} data={data} pages={this.state.pages} defaultPageSize={100} filterable loading={this.state.loading}
                     showPagination={true}
                     showPaginationTop={false}
                     showPaginationBottom={true}
                     pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                     manual
                     onFetchData={this.fetchStrategy}
                     onFilteredChange={this.onFilteredChange}
                     minRows={1}
                     />
    );
  }
}
