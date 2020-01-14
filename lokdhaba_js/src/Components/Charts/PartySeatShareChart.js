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
    var x_axis_labels = vizData.map(function(item){return item.Year +" (#" + item.Assembly_No + ")"});
    x_axis_labels = [...new Set(x_axis_labels)];
    parties.forEach(function(party){
      var y_contested = vizData.filter(x => x.Party === party).map(x => x.Seat_Share);
      var y_seats = vizData.filter(x => x.Party === party).map(x => x.Winners);
      var total_seats = vizData.filter(x => x.Party === party).map(x => x.Total_Seats_in_Assembly);
      var x_labels = vizData.filter(x => x.Party === party).map(function(item){return item.Year +" (#" + item.Assembly_No + ")"});
      var y_vals = new Array(x_axis_labels.length).fill(NaN);
      var y_text = new Array(x_axis_labels.length).fill(NaN);
      for(var i =0; i < x_axis_labels.length;i++){
        var label = x_axis_labels[i];
        var idx = x_labels.findIndex(function(x){return x=== label})
        if(idx !== -1){
          y_vals[i] = y_contested[idx]
          y_text[i] = y_seats[idx]+"/"+total_seats[idx]+" Seats"
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
                    text: y_text,
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
        title: 'Seat share %',
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
