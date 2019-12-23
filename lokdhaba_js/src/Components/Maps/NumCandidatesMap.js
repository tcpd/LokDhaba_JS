import React from 'react'
import { Map, GeoJSON, TileLayer, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import NumCandidatesLegends from './NumCandidatesLegends';
import PrintControlDefault from 'react-leaflet-easyprint';

export default class NumCandidatesMap extends React.Component {

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
                    fillOpacity: 1};
       var val = constituency.properties.N_Cand;
       switch(true){
        case (!val):
          break;
        case (val<5 && dataFilterOptions.has("<5")):
           style = {fillColor: '#deebf7',
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    fillOpacity: 1};
           break;
        case (val>15 && dataFilterOptions.has(">15")):
             style = {fillColor: '#6baed6',
                      weight: 1,
                      opacity: 1,
                      color: 'black',
                      fillOpacity: 1};
             break;
        case (val >=5 && val<=15 && dataFilterOptions.has("5-15")):
           style = {fillColor: '#08306b',
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

    var candidates = data.map(X => X.N_Cand);
    var legend = {};
    for (var i = 0; i < candidates.length; i++) {
      val = candidates[i];
      if(val <5 && dataFilterOptions.has("<5") ){
        legend["<5"] = legend["<5"] ? legend["<5"] + 1 : 1
      }else if(val >15 && dataFilterOptions.has(">15") ){
        legend[">15"] = legend[">15"] ? legend[">15"] + 1 : 1
      }else if(val >=5 && val<=15 && dataFilterOptions.has("5-15") ){
        legend["5-15"] = legend["5-15"] ? legend["5-15"] + 1 : 1
      }
    }

    var SortedKeys = ["<5", "5-15", ">15"];//Object.keys(legend).sort(function(a,b){return legend[b]-legend[a]})
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
         {`Constituency wise number of candidates contested for ${electionType} in Assembly #${assemblyNo}`}
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
//             <TileLayer
//               attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
          {leaflet}
          <NumCandidatesLegends Legend = {sortedLegend}/>
          <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
          <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />

        </Map>
      </div>
    );
  }
}
