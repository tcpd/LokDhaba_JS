import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import ColPalette from '../../Assets/Data/PartyColourPalette.json';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class PartySeatShareChart extends Component {
  render() {
    var vizData = this.props.data;
    var dataFilterOptions = this.props.dataFilterOptions;
    var stateName = this.props.stateName.replace(/_/g, " ");
    var electionType = this.props.electionType === "GE" ? "Lok Sabha" : "Vidhan Sabha";
    var data = [];
    var parties = new Set(vizData.map(x => x.Party));
    parties.forEach(function(party){
      var y_contested = vizData.filter(x => x.Party === party).map(x => x.Seats);
      var x_labels = vizData.filter(x => x.Party === party).map(function(item){return item.Year +" (#" + item.Assembly_No + ")"});
      var party_color = "#FFFFFF00"

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
                    x: x_labels,
                    y: y_contested,
                    name: party,
                    line: {
                      color: party_color,
                      width: 1
                    }
                  }
      data.push(trace);
    });
    var title = `Party wise seatshare across years in ${electionType}`;
    if(stateName !== ""){
      title = `Party wise seatshare across years in ${stateName} ${electionType}`
    }
    let layout = {
      title: title,
      xaxis: {
        title: 'Year(Assembly Number)'
      },
      yaxis:{
        title: 'Seat share %'
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
