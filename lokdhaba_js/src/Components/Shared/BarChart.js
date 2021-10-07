import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class BarChart extends Component {
  render() {
    const { layout, vizParameters, showAdditionalText, getAdditionalText } = this.props;
    var vizData = this.props.data;
    var dataFilterOptions = this.props.dataFilterOptions;
    var x_labels = vizData.map(function (item) { return item.Year + " (#" + item.Assembly_No + ")" });
    var data = [];

    vizParameters.forEach((vizParameter) => {
      if (dataFilterOptions.has(vizParameter.dataFilterOptionName)) {
        var y_labels = vizData.map(x => x[vizParameter.value]);
        var y_text = new Array(x_labels.length).fill(NaN);
        for (var i = 0; i < x_labels.length; i++) {
          if (showAdditionalText) {
            y_text[i] = getAdditionalText(i, vizParameter.value);
          }
        }
        var trace = {
          type: 'bar',
          x: x_labels,
          y: y_labels,
          text: y_text,
          name: vizParameter.label
        }
        data.push(trace);
      }
    })

    let config = {
      showLink: false,
      displayModeBar: true
    };
    return (
      <PlotlyComponent className="chart" data={data} layout={layout} config={config} />
    );
  }
}
