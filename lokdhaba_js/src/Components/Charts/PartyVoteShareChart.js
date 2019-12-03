import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import ColPalette from '../../Assets/Data/PartyColourPalette.json';
const PlotlyComponent = createPlotlyComponent(Plotly);


export default class PartyVoteShareChart extends Component {
  render() {
    var vizData = this.props.data.sort(function(a, b){return a.Year - b.Year;});;
    var dataFilterOptions = this.props.dataFilterOptions;
    var stateName = this.props.stateName.replace(/_/g, " ");
    var electionType = this.props.electionType === "GE" ? "Lok Sabha" : "Vidhan Sabha";
    var data = [];
    var parties = new Set(vizData.map(x => x.Party));
    var x_axis_labels = vizData.map(function(item){return item.Year +" (#" + item.Assembly_No + ")"});
    x_axis_labels = [...new Set(x_axis_labels)];
    parties.forEach(function(party){
      var party_data = vizData.filter(x => x.Party === party );
      var y_vals = new Array(x_axis_labels.length).fill(NaN);
      var y_contested = party_data.map(x => x.Vote_Share_Percentage);
      var x_labels = party_data.map(function(item){return item.Year +" (#" + item.Assembly_No + ")"});

      for(var i =0; i < x_axis_labels.length;i++){
        var label = x_axis_labels[i];
        var idx = x_labels.findIndex(function(x){return x=== label})
        if(idx !== -1){
          y_vals[i] = y_contested[idx]
        }
      }

      var party_color = "#808080"

      for (var i = 0; i < ColPalette.length; i++) {
        var element = ColPalette[i];

        if (element.Party == party) {
          party_color = element.Color;
          break;
        }
      }

      var trace = {
                    type: 'scatter',
                    mode: 'lines+markers',
                    x: x_axis_labels,
                    y: y_vals,
                    name: party,
                    line: {
                      color: party_color,
                      width: 1
                    }
                  }
      data.push(trace);
    });
    var title = `Party wise voteshare in seats contested across years in ${electionType}`;
    if(stateName !== ""){
      title = `Party wise voteshare in seats contested across years in ${stateName} ${electionType}`
    }
    let layout = {
      title: title,
      xaxis: {
        title: 'Year(Assembly Number)',
        tickvals : x_axis_labels
      },
      yaxis:{
        title: 'Vote share %',
        range: [0, 100],
        autorange: false
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
