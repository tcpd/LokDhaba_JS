import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import ColPalette from '../../Assets/Data/PartyColourPalette.json';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class PartyStepBarChart extends Component {
  render() {
    const { layout, vizParameter, showAdditionalText, getAdditionalText, varName  } = this.props;
    var vizData = this.props.data;
    var data = [];
    var categories = new Set(vizData.map(x => x[varName]));
    var x_axis_labels = vizData.map(function (item) { return item.Party});
    x_axis_labels = [...new Set(x_axis_labels)];
    categories.forEach(function (category) {
      var y_contested = vizData.filter(x => x[varName] === category).map(x => x[vizParameter]);
      var x_labels = vizData.filter(x => x[varName] === category).map(function (item) { return item.Party });
      var y_vals = new Array(x_axis_labels.length).fill(NaN);
      var y_text = new Array(x_axis_labels.length).fill(NaN);
      var bar_width = new Array(x_axis_labels.length).fill(0.7);
      if(x_axis_labels.length <4){
        bar_width = new Array(x_axis_labels.length).fill(0.4);
      }

      for (var i = 0; i < x_axis_labels.length; i++) {
        var label = x_axis_labels[i];
        var idx = x_labels.findIndex(function (x) { return x === label })
        if (idx !== -1) {
          y_vals[i] = y_contested[idx];
          if (showAdditionalText) {
            y_text[i] = getAdditionalText(category, idx);
          }
        }
      }


      // var party_color = "#808080"
      //
      // for (let i = 0; i < ColPalette.length; i++) {
      //   var element = ColPalette[i];
      //
      //   if (element.Party === party) {
      //     party_color = element.Color;
      //     break;
      //   }
      // }
      var trace = {
        type: 'bar',
        x: x_axis_labels,
        y: y_vals,
        name: category,
        text: y_text,
        width: bar_width
        //,marker: {color: party_color}
      }
      data.push(trace);
    });
    let config = {
      showLink: false,
      displayModeBar: true
    };
    return (
      <PlotlyComponent className="chart" data={data} layout={layout} config={config} />
    );
  }
}
