import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class PartiesPresentedChart extends Component {
  render() {
    var vizData = this.props.data;
    var dataFilterOptions = this.props.dataFilterOptions;
    var x_labels = vizData.map(function(item){return item.Year +" (#" + item.Assembly_No + ")"});
    var data = [];
    if(dataFilterOptions.has("Parties_Represented")){
      var y_represented = vizData.map(x => x.Parties_Represented);
      var trace = {
                    type: 'bar',
                    x: x_labels,
                    y: y_represented,
                    name: 'Parties Represented'
                  }
      data.push(trace);
    }
    if(dataFilterOptions.has("Parties_Contested")){
      var y_contested = vizData.map(x => x.Parties_Contested);
      var trace = {
                    type: 'bar',
                    x: x_labels,
                    y: y_contested,
                    name: 'Parties Contested'
                  }
      data.push(trace);
    }

    let layout = {
      title: 'Parties Contested and Represented across years in LokSabha',
      xaxis: {
        title: 'Year(Assembly Number)'
      },
      yaxis:{
        title: 'Number of Parties'
      }
    };
    let config = {
      showLink: false,
      displayModeBar: true
    };
    return (
      <PlotlyComponent className="chart" data={data} layout={layout} config={config}/>
    );
   }
}
