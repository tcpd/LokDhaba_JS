/*
Checkbox component to display the checkbox input with label
Accepts following props:
id: id for the checkbox input
label: label to display beside the checkbox
checked: boolean to indicate if checkbox is checked
onChange: function to call when checkbox value changes
*/

import React, { Component } from 'react';
import '../../Assets/Styles/layout.css'

export default class Checkbox extends Component {
  constructor(props){
        super(props);
        this.state = {checked: false};
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      }

 handleCheckboxChange(e){
   this.setState({ checked: e.target.checked });
   this.props.onChange(e.target.id.split("_").slice(-1)[0], e.target.checked);
 }

 componentWillUpdate(nextProps, nextState) {
   if (nextProps.checked === false && this.state.checked) {
     this.setState({checked: false});
   }
 }

 render() {
   var label = this.props.label;
   var id = this.props.id;
   var isChecked = this.props.checked ? this.props.checked : this.state.checked;
   var title = this.props.title;
    return (
      <div className="form-group">
        <input type="checkbox"  id={id} key={id} checked={isChecked} onChange={this.handleCheckboxChange}/>
        <label className="control-label" key={id + "_label"} title = {title} htmlFor={id}>{label}</label>
      </div>
    )
  }
}
