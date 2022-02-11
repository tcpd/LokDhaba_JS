import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import ColPalette from '../../Assets/Data/AffidavitColorPalette.json';
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class PartyStepBarChart extends Component {
  render() {
    const { layout, vizParameter, showAdditionalText, getAdditionalText, varName  } = this.props;
    var vizData = this.props.data;
    if(varName ==="MyNeta_education"){
      var eduClasses = {"Literate":1,"5th Pass":2,"8th Pass":3,"10th Pass":4,"12th Pass":5,"Graduate":6, "Graduate Professional":7,"Post Graduate":8,"Doctorate":9,"Illiterate":10,"Others":11,"Not Given":12,"Unknown":13,"":14};
      vizData = vizData.sort((a,b) => (eduClasses[a[varName]] > eduClasses[b[varName]]) ? -1 : ((eduClasses[b[varName]] > eduClasses[a[varName]]) ? 1 : 0));
    }else{
      vizData= vizData.sort((a,b) => (a[varName] > b[varName]) ? -1 : ((b[varName] > a[varName]) ? 1 : 0));
    }

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


      var category_color = typeof category!=='undefined' && ColPalette.filter( item => item.value===category)[0].Color;
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
        ,marker: {color: category_color}
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
