import React from 'react'
import { Map, GeoJSON, TileLayer, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import VoterTurnoutLegends from './VoterTurnoutLegends';
import PrintControlDefault from 'react-leaflet-easyprint';

export default class VoterTurnoutMap extends React.Component {

  onEachFeature = (feature, layer) => {
    var popupContent = "";
    for (var key in feature.properties) {
      if (feature.properties.hasOwnProperty(key)) {
        var value = feature.properties[key];
        popupContent += `<b>${key}:</b> ${value}<br/>`;
      }
    }
    layer.bindPopup(popupContent);
  }


  renderConstituencies = (mapGeoJson,dataFilterOptions) => {
    return mapGeoJson.map(constituency => {
      let style = {fillColor: '#FFFFFF00',
      weight: 1,
      opacity: 1,
      color: 'black',
      fillOpacity: 1};
      var val = constituency.properties.Turnout_Percentage;
      switch(true){
        case (!val):
          break;
        case (val >= 95 && dataFilterOptions.has(">95%")):
          style = {fillColor: '#08306b',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val>=90 && val<95 && dataFilterOptions.has("90%-95%")):
          style = {fillColor: '#08519c',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val >=85 && val<90 && dataFilterOptions.has("85%-90%")):
          style = {fillColor: '#2171b5',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val >=80 && val<85 && dataFilterOptions.has("80%-85%")):
          style = {fillColor: '#4292c6',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val >=75 && val<80 && dataFilterOptions.has("75%-80%")):
          style = {fillColor: '#6baed6',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val >=70 && val<75 && dataFilterOptions.has("70%-75%")):
          style = {fillColor: '#9ecae1',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val >=60 && val<70 && dataFilterOptions.has("60%-70%")):
          style = {fillColor: '#c6dbef',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val >=50 && val<60 && dataFilterOptions.has("50%-60%")):
          style = {fillColor: '#deebf7',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        case (val <50 && dataFilterOptions.has("<50%")):
          style = {fillColor: '#f7fbff',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 1};
          break;
        default:
          break;
      }
      return (
        <GeoJSON key={constituency.id} data={constituency} style={style} onEachFeature={this.onEachFeature}/>
      );
    });
  }

  render() {
    var data = this.props.data;
    var electionType = this.props.electionType === "GE" ? "Lok Sabha" : "Vidhan Sabha";
    var assemblyNo =this.props.assemblyNo;
    const PrintControl = withLeaflet(PrintControlDefault);
    var dataFilterOptions = this.props.dataFilterOptions;
    //var leaflet = this.renderConstituencies(data.features,dataFilterOptions);

    var turnouts = data.map(X => X.Turnout_Percentage);
    var legend = {};
    for (var i = 0; i < turnouts.length; i++) {
      var val = turnouts[i];
      if(val >=95 && dataFilterOptions.has(">95%") ){
        legend[">95%"] = legend[">95%"] ? legend[">95%"] + 1 : 1
      }else if(val >=90 && val<95 && dataFilterOptions.has("90%-95%")){
        legend["90%-95%"] = legend["90%-95%"] ? legend["90%-95%"] + 1 : 1
      }else if(val >=85 && val<90 && dataFilterOptions.has("85%-90%")){
        legend["85%-90%"] = legend["85%-90%"] ? legend["85%-90%"] + 1 : 1
      }else if(val >=80 && val<85 && dataFilterOptions.has("80%-85%")){
        legend["80%-85%"] = legend["80%-85%"] ? legend["80%-85%"] + 1 : 1
      }else if(val >=75 && val<80 && dataFilterOptions.has("75%-80%")){
        legend["75%-80%"] = legend["75%-80%"] ? legend["75%-80%"] + 1 : 1
      }else if(val >=70 && val<75 && dataFilterOptions.has("70%-75%")){
        legend["70%-75%"] = legend["70%-75%"] ? legend["70%-75%"] + 1 : 1
      }else if(val >=60 && val<70 && dataFilterOptions.has("60%-70%")){
        legend["60%-70%"] = legend["60%-70%"] ? legend["60%-70%"] + 1 : 1
      }else if(val >=50 && val<60 && dataFilterOptions.has("50%-60%")){
        legend["50%-60%"] = legend["50%-60%"] ? legend["50%-60%"] + 1 : 1
      }else if(val <50 && dataFilterOptions.has("<50%")){
        legend["<50%"] = legend["<50%"] ? legend["<50%"] + 1 : 1
      }
    }

    var SortedKeys = [">95%", "90%-95%", "85%-90%","80%-85%","75%-80%","70%-75%","60%-70%","50%-60%","<50%"];//Object.keys(legend).sort(function(a,b){return legend[b]-legend[a]})
    var sortedLegend ={}
    for (var i =0; i < SortedKeys.length; i++) {
      var val = SortedKeys[i];
      if(legend[val]){
        sortedLegend[val] = legend[val]
      }

    }

    var shape = this.props.map;
    var state = this.props.stateName;
    if(electionType === "Lok Sabha"){
      for (var i=0; i<data.length; i++){
        data[i].key = data[i].State_Name + "_" + data[i].Constituency_No
      }
      var joinMap = {
        geoKey: 'properties.State_Key', //here geoKey can be feature 'id' also
        dataKey: 'key'
      };
    }else{
      var joinMap = {
        geoKey: 'properties.ASSEMBLY', //here geoKey can be feature 'id' also
        dataKey: 'Constituency_No'
      };
    }

    var extendGeoJSON = require('extend-geojson-properties');


    extendGeoJSON( shape, data, joinMap);

    var leaflet = this.renderConstituencies(shape, dataFilterOptions);


    return (
      <div className="my-map" style={{width: "100%", height: "100%"}}>
      <div style={{textAlign: "center"}}>
      <label>
         {`Constituency wise turnout perentages for ${electionType} in Assembly #${assemblyNo}`}
       </label>
       </div>
        <Map center={[20.5937, 78.9629]}
             zoom={5}
             maxZoom={13}
             attributionControl={true}
             zoomControl={true}
             doubleClickZoom={true}
             scrollWheelZoom={false}
             dragging={true}
             animate={true}
             easeLinearity={0.35}>
          {leaflet}
          <VoterTurnoutLegends Legend = {sortedLegend}/>
          <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
          <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />

        </Map>
      </div>
    );
  }
}
