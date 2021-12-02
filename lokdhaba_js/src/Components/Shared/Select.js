/*
Select componnet for dropdown options
Accepts following props:
id: id for the select element
label: text for the placeholder
selectedValue: initial selected value in dropdown
options: dropdown options
onChange: function to call when selection is made
*/

import React, { Component } from 'react';
import '../../Assets/Styles/select.css'

export default class LdSelect extends Component {
  constructor(props){
        super(props);
        this.state = {selectedValue: ""};
        this.handleSelection = this.handleSelection.bind(this);
      }

handleSelection(e){
   this.setState({selectedValue: e.target.value});
   this.props.onChange(e.target.value);
}

  render() {
    var label = this.props.label;
    var id = this.props.id;
    var name = label.replace(/\s/g, '');
    var placeholder = 'Select ' + label;
    var selectedValue = this.props.selectedValue !== undefined? this.props.selectedValue: this.state.selectedValue;
    var options = this.props.options.map(function(item) {
          if ("" === item.value) {
            return <option disabled value="DEFAULT" key = {item.value} value = {
              item.value
            } > {
              item.label
            } </option>;
          } else if (selectedValue === item.value) {
            return <option value="DEFAULT" key = {item.value} value = {
              item.value
            } > {
              item.label
            } </option>;
          } else {
            return <option key = {item.value} value = {
              item.value
            } > {
              item.label
            } </option>;
          }
        });

    return (
      <div className="form-group">
        <label className="control-label" htmlFor={id}>{label}</label>
        <div>
          <select id={id} name={name} value={selectedValue} onChange={this.handleSelection} placeholder={placeholder}>
            {options}
          </select>
        </div>
      </div>
    )
  }
}
