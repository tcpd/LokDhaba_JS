import React from 'react'
import { Map, GeoJSON, TileLayer, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import PartyPositionsLegends from './PartyPositionsLegends';
import PrintControlDefault from 'react-leaflet-easyprint';

export default class PartyPositionsMap extends React.Component {

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
      fillOpacity: 0.7};
      var val = constituency.properties.Position;
      switch(true){
        case (!val):
          break;
        case (val === 1 && dataFilterOptions.has("1")):
          style = {fillColor: '#0570b0',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val===2 && dataFilterOptions.has("2")):
          style = {fillColor: '#74a9cf',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val ===3 && dataFilterOptions.has("3")):
          style = {fillColor: '#bdc9e1',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >3 && dataFilterOptions.has(">3")):
          style = {fillColor: '#f1eef6',
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
    var leaflet = this.renderConstituencies(data.features,dataFilterOptions);

    var positions = data.features.flatMap(X => X.properties.Position);
    var legend = {};
    for (var i = 0; i < positions.length; i++) {
      val = positions[i];
      if(val ===1 && dataFilterOptions.has("1") ){
        legend["1"] = legend["1"] ? legend["1"] + 1 : 1
      }else if(val ===2 && dataFilterOptions.has("2") ){
        legend["2"] = legend["2"] ? legend["2"] + 1 : 1
      }else if(val ===3 && dataFilterOptions.has("3") ){
        legend["3"] = legend["3"] ? legend["3"] + 1 : 1
      }else if(val >3 && dataFilterOptions.has(">3") ){
        legend[">3"] = legend[">3"] ? legend[">3"] + 1 : 1
      }
    }

    var SortedKeys = ["1", "2", "3", ">3"];//Object.keys(legend).sort(function(a,b){return legend[b]-legend[a]})
    var sortedLegend ={}
    for (var i =0; i < SortedKeys.length; i++) {
      var val = SortedKeys[i];
      if(legend[val]){
        sortedLegend[val] = legend[val]
      }

    }




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
          <PartyPositionsLegends Legend = {sortedLegend}/>
          <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
          <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />

        </Map>
      </div>
    );
  }
}
