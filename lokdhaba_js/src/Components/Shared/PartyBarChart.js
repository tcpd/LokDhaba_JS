import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import ColPalette from '../../Assets/Data/PartyColourPalette.json';
import ErrorScreen from './ErrorScreen.js';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class PartyBarChart extends Component {
  render() {
    const { layout, vizParameter, showAdditionalText, getAdditionalText } = this.props;
    var vizData = this.props.data;
    var data = [];
    var parties = new Set(vizData.map(x => x.Party));
    var x_axis_labels = vizData.map(function (item) { return item.Year + " (#" + item.Assembly_No + ")" });
    x_axis_labels = [...new Set(x_axis_labels)];
    parties.forEach(function (party) {
      var y_contested = vizData.filter(x => x.Party === party).map(x => x[vizParameter]);
      var x_labels = vizData.filter(x => x.Party === party).map(function (item) { return item.Year + " (#" + item.Assembly_No + ")" });
      var y_vals = new Array(x_axis_labels.length).fill(NaN);
      var y_text = new Array(x_axis_labels.length).fill(NaN);
      for (var i = 0; i < x_axis_labels.length; i++) {
        var label = x_axis_labels[i];
        var idx = x_labels.findIndex(function (x) { return x === label })
        if (idx !== -1) {
          y_vals[i] = y_contested[idx];
          if (showAdditionalText) {
            y_text[i] = getAdditionalText(party, idx);
          }
        }
      }


      var party_color = "#808080"

      for (let i = 0; i < ColPalette.length; i++) {
        var element = ColPalette[i];

        if (element.Party === party) {
          party_color = element.Color;
          break;
        }
      }
      var trace = {
        type: 'bar',
        x: x_axis_labels,
        y: y_vals,
        name: party,
        text: y_text,
        marker: {color: party_color}
      }
      data.push(trace);
    });

    // guard clause to gracefully exit to error screen if invalid data is passed
    if (typeof(data) !== undefined && (data.length === 0 || data[0].y.length === 0)) {
      return (<ErrorScreen message={"Data is not available for this configuration."}/>);
    }

    let config = {
      showLink: false,
      displayModeBar: true
    };
    return (
      <PlotlyComponent className="chart" data={data} layout={layout} config={config} />
    );
  }
}
