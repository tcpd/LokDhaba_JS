import React from 'react'
import { Map, GeoJSON } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import VoterTurnoutLegends from './VoterTurnoutLegends';

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

  renderConstituencies = (mapGeoJson) => {
    return mapGeoJson.map(constituency => {
      let style = {fillColor: '#FFFFFF00',
      weight: 1,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.7};
      var val = constituency.properties.Turnout_Percentage;
      switch(true){
        case (!val):
          break;
        case (val >= 95 ):
          style = {fillColor: '#08306b',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val>=90):
          style = {fillColor: '#08519c',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=85):
          style = {fillColor: '#2171b5',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=80):
          style = {fillColor: '#4292c6',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=75):
          style = {fillColor: '#6baed6',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=70):
          style = {fillColor: '#9ecae1',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=60):
          style = {fillColor: '#c6dbef',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val >=50):
          style = {fillColor: '#deebf7',
          weight: 1,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.7};
          break;
        case (val <50):
          style = {fillColor: '#f7fbff',
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
          {this.renderConstituencies(data.features)}
          <VoterTurnoutLegends/>
        </Map>
      </div>
    );
  }
}
