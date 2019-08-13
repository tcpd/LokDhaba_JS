import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class Checkbox extends Component {
  constructor(props){
        super(props);
        this.state = {checked: false};
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      }

 handleCheckboxChange(e){
   this.setState({ checked: e.target.checked });
   this.props.onChange(e.target.value);
 }

 render() {
   var columns = this.props.columns;
   var data = this.props.data;
    return (
      <ReactTable columns={columns} data={data} defaultPageSize={100} filterable/>
    )
  }
}
