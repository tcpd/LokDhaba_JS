import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class PieChart extends Component {
  render() {
    const { layout, vizParameter, varName } = this.props;
    var vizData = this.props.data;
    var vals = vizData.map(function (item) { return item[vizParameter]  });
    var labs = vizData.map(function (item) { return item[varName]  });
    var data = [{
      values :vals,
      labels: labs,
      textinfo: 'percent',
      hole: .4,
      type:'pie'
      //,insidetextorientation: "radial"
    }];


    let config = {
      showLink: false,
      displayModeBar: true
    };
    return (
      <PlotlyComponent className="chart" data={data} layout={layout} config={config} />
    );
  }
}
