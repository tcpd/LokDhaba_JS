import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class Table extends Component {
  constructor(props){
        super(props);
        this.state = {loading: false, pages: 0, data: this.props.data};
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      }

 handleCheckboxChange(e){
   this.setState({ checked: e.target.checked });
   this.props.onChange(e.target.value);
 }

 fetchData = (state, instance) =>  {
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
                     onFetchData={this.fetchData}
                     minRows={1}
                     />
    );
  }
}
