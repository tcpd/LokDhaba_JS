import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class ContestedDepositLostChart extends Component {
  render() {
    var vizData = this.props.data;
    var dataFilterOptions = this.props.dataFilterOptions;
    var stateName = this.props.stateName.replace(/_/g, " ");
    var electionType = this.props.electionType === "GE" ? "LokSabha" : "Vidhan Sabha";
    var x_labels = vizData.map(function(item){return item.Year +" (#" + item.Assembly_No + ")"});
    var data = [];
    if(dataFilterOptions.has("TotalCandidates")){
      var y_contested = vizData.map(x => x.Total_Candidates);
      var trace = {
                    type: 'bar',
                    x: x_labels,
                    y: y_contested,
                    name: 'Total Candidates'
                  }
      data.push(trace);
    }
    if(dataFilterOptions.has("DepositLost")){
      var y_represented = vizData.map(x => x.Deposit_Lost);
      var trace = {
                    type: 'bar',
                    x: x_labels,
                    y: y_represented,
                    name: 'Deposit Lost'
                  }
      data.push(trace);
    }
    var title = `Contested and deposit lost across years in ${electionType}`;
    if(stateName !== ""){
      title = `Contested and deposit lost across years in ${stateName} ${electionType}`
    }

    let layout = {
      title: title,
      xaxis: {
        title: 'Year(Assembly Number)'
      },
      yaxis:{
        title: 'Number of Candidates'
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
