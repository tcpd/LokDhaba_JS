import React from 'react'
import { Map, GeoJSON } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import WinnerGenderLegends from './WinnerGenderLegends';

export default class WinnerGenderMap extends React.Component {

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
       switch(constituency.properties.Sex){
         case "Male":
           style = {fillColor: '#1F78B4',
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    fillOpacity: 0.7};
           break;
         case "Female":
           style = {fillColor: '#A6CEE3',
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    fillOpacity: 0.7};
           break;
         case "Others":
           style = {fillColor: '#B2DF8A',
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    fillOpacity: 0.7};
           break;
        defualt:
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
         {`Constituency types for ${electionType} in Assembly #${assemblyNo}`}
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
          <WinnerGenderLegends/>
        </Map>
      </div>
    );
  }
}
