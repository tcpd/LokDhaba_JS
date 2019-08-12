import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Assets/Styles/select.css'

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

 render() {
   var label = this.props.label;
   var id = this.props.id;
    return (
      <div className="form-group">
        <input type="checkbox"  id={id} key={id} checked={this.state.checked} onChange={this.handleCheckboxChange}/>
        <label className="control-label" key={id + "_label"} htmlFor={id}>{label}</label>
      </div>
    )
  }
}
