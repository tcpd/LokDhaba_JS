import React, { Component } from 'react';
import MultiSelectReact from 'multi-select-react';

export default class MultiSelectReactComponent extends Component {
  constructor(props) {
        super(props);
        // props.options: array with {value: "", label: ""} elements
        // how to handle default selected options
        this.state = {
            multiSelect: []
        };
    }
  render() {
        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };
        // console.log('props.options', this.props.options);
        // console.log('optionsclicked', this.optionClicked.bind(this));
    return (
      <MultiSelectReact 
      options={this.props.options}
      // define default selected options {selected} ~ optionsList
      optionClicked={this.optionClicked.bind(this)} // function
      selectedBadgeClicked={this.selectedBadgeClicked.bind(this)} // function
      selectedOptionsStyles={selectedOptionsStyles}
      optionsListStyles={optionsListStyles} />
    );
  }

  // optionsList: list of clicked options
  optionClicked(optionsList) {
        // this.setProps({ options: optionsList });
        // console.log('onchange function', this.props.onChange)
        //console.log('optionsList', optionsList);
        this.props.onChange(optionsList);
  }
  selectedBadgeClicked(optionsList) {
        // this.setProps({ options: optionsList });
        this.props.onChange(optionsList);
  }

}