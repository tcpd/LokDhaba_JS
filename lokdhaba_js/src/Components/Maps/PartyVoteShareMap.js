import React from 'react'
import { Map, GeoJSON, TileLayer, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import PartyVoteShareLegends from './PartyVoteShareLegends';
import PrintControlDefault from 'react-leaflet-easyprint';

export default class PartyVoteShareMap extends React.Component {

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

  renderConstituencies = (mapGeoJson, dataFilterOptions) => {
    return mapGeoJson.map(constituency => {
      let style = {fillColor: '#FFFFFF00',
      weight: 1,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.7};
      var val = constituency.properties.Vote_Share_Percentage;
      switch(true){
        case (!val):
          break;
        case (val > 60 && dataFilterOptions.has(">60%")):
          style = {fillColor: '#08519c',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val>=50 && val<=60 && dataFilterOptions.has("50%-60%")):
          style = {fillColor: '#3182bd',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=40 && val<50 && dataFilterOptions.has("40%-50%")):
          style = {fillColor: '#6baed6',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=30 && val<40 && dataFilterOptions.has("30%-40%")):
          style = {fillColor: '#9ecae1',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=20 && val<30 && dataFilterOptions.has("20%-30%")):
          style = {fillColor: '#c6dbef',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val <20 && dataFilterOptions.has("<20%")):
          style = {fillColor: '#eff3ff',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
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

    var voteShares = data.map(X => X.Vote_Share_Percentage);
    var legend = {};
    for (var i = 0; i < voteShares.length; i++) {
      var val = voteShares[i];
      if(val >60 && dataFilterOptions.has(">60%") ){
        legend[">60%"] = legend[">60%"] ? legend[">60%"] + 1 : 1
      }else if(val >=50 && val<=60 && dataFilterOptions.has("50%-60%")){
        legend["50%-60%"] = legend["50%-60%"] ? legend["50%-60%"] + 1 : 1
      }else if(val >=40 && val<50 && dataFilterOptions.has("40%-50%")){
        legend["40%-50%"] = legend["40%-50%"] ? legend["40%-50%"] + 1 : 1
      }else if(val >=30 && val<40 && dataFilterOptions.has("30%-40%")){
        legend["30%-40%"] = legend["30%-40%"] ? legend["30%-40%"] + 1 : 1
      }else if(val >=20 && val<30 && dataFilterOptions.has("20%-30%")){
        legend["20%-30%"] = legend["20%-30%"] ? legend["20%-30%"] + 1 : 1
      }else if(val <20 && dataFilterOptions.has("<20%")){
        legend["<20%"] = legend["<20%"] ? legend["<20%"] + 1 : 1
      }
    }

    var SortedKeys = ["<20%", "20%-30%", "30%-40%","40%-50%","50%-60%",">60%"];//Object.keys(legend).sort(function(a,b){return legend[b]-legend[a]})
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
         {`Constituency wise vote share percentages of winners for ${electionType} in Assembly #${assemblyNo}`}
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
             <TileLayer
               attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             />
          {leaflet}
          <PartyVoteShareLegends Legend = {sortedLegend}/>
          <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
          <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />

        </Map>
      </div>
    );
  }
}
