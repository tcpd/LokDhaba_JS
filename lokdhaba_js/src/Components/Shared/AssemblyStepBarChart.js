import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import ColPalette from '../../Assets/Data/PartyColourPalette.json';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class AssemblyStepBarChart extends Component {
  render() {
    const {  vizParameter, varName } = this.props;
    var layout = this.props.layout;
    const vizData = this.props.data;
    var data = [];
    var steps = [];
    var frames = [];
    var x_axis_labels = this.props.dataFilterOptions;
    //var x_axis_labels = vizData.map(function (item) { return item.Year + " (#" + item.Assembly_No + ")" });
    //x_axis_labels = [...new Set(x_axis_labels)];
    var names = new Set(vizData.map(x=>x[varName]));
    var years = vizData.map(function (item){{ return item.Assembly_No }});
    years = [...new Set(years)];
    years.forEach(function(year){
      names.forEach(function (name) {
        var y_contested = vizData.filter(x => x[varName] === name && x.Assembly_No === year).map(x => x[vizParameter]);
        var x_labels = vizData.filter(x => x[varName] === name && x.Assembly_No === year).map(function (item) { return item.Party });
        var y_vals = new Array(x_axis_labels.length).fill(NaN);
        //var y_text = new Array(x_axis_labels.length).fill(NaN);
        for (var i = 0; i < x_axis_labels.length; i++) {
          var label = x_axis_labels[i];
          var idx = x_labels.findIndex(function (x) { return x === label });
          if (idx !== -1) {
            y_vals[i] = y_contested[idx];
          }
        }

        var trace = {
          type: 'bar',
          x: x_axis_labels,
          y: y_vals,
          name: name,
          year: year
          //marker: {color: party_color}
        }
        data.push(trace);

      });
      var step = {
        label:year,
        method: 'animate',
        args: [[year], {
          mode: 'immediate',
          frame: {redraw: false, duration: 500},
          transition: {duration: 500}
        }]
      }
      steps.push(step);
      var frame = {
        name:year,
        data:data.filter(x => x.Assembly_No === year)
      }
      frames.push(frame);
    });

    var sliders=[{
      pad: {t: 30},
      x: 0.05,
      len: 0.95,
      currentvalue: {
        xanchor: 'right',
        prefix: 'Assembly No: ',
        font: {
          color: '#888',
          size: 20
        }
      },
      transition: {duration: 500}
    }]

    sliders['steps']=steps;
    var updatemenus= [{
      type: 'buttons',
      showactive: false,
      x: 0.05,
      y: 0,
      xanchor: 'right',
      yanchor: 'top',
      pad: {t: 60, r: 20},
      buttons: [{
        label: 'Play',
        method: 'animate',
        args: [null, {
          fromcurrent: true,
          frame: {redraw: false, duration: 1000},
          transition: {duration: 500}
        }]
      }]
    }]
    layout['sliders']=sliders;
    layout['updatemenus']=updatemenus;

    let config = {
      showLink: false,
      displayModeBar: true
    };
    return (
      <PlotlyComponent className="chart" data={data} layout={layout} config={config} frames = {frames}/>
    );
  }
}
