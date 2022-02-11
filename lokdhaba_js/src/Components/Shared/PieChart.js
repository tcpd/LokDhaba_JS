import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import ColPalette from '../../Assets/Data/AffidavitColorPalette.json';

const PlotlyComponent = createPlotlyComponent(Plotly);

export default class PieChart extends Component {
  render() {
    const { layout, vizParameter, varName } = this.props;
    var vizData = this.props.data;
    if(varName ==="MyNeta_education"){
      var eduClasses = {"Literate":1,"5th Pass":2,"8th Pass":3,"10th Pass":4,"12th Pass":5,"Graduate":6, "Graduate Professional":7,"Post Graduate":8,"Doctorate":9,"Illiterate":10,"Others":11,"Not Given":12,"Unknown":13,"":14};
      vizData = vizData.sort((a,b) => (eduClasses[a[varName]] > eduClasses[b[varName]]) ? 1 : ((eduClasses[b[varName]] > eduClasses[a[varName]]) ? -1 : 0));
    }else{
      vizData= vizData.sort((a,b) => (a[varName] > b[varName]) ? 1 : ((b[varName] > a[varName]) ? -1 : 0));
    }
    var vals = vizData.map(function (item) { return item[vizParameter]  });
    var labs = vizData.map(function (item) { return item[varName]  });
    var colors= [];
    labs.forEach(lab=>  typeof lab!=='undefined' && colors.push(ColPalette.filter(item => item.value===lab )[0].Color))
    var data = [{
      values :vals,
      labels: labs,
      textinfo: 'percent',
      hole: .4,
      type:'pie',
      sort:false
      ,marker: {colors: colors}
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
