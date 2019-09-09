import React from 'react'
import { Map, GeoJSON, TileLayer, Circle, Rectangle, Popup, LayerGroup, FeatureGroup} from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';

export default class ConstituencyTypeMap extends React.Component {

  renderConstituencies = (mapGeoJson) => {
    return mapGeoJson.map(constituency => {
       let style = { borderColor: '#1A1A1A', color: '#FFF', fillOpacity: "1"};
       switch(constituency.properties.Constituency_Type){
         case "General":
           style = { borderColor: 'black', color: '#1F78B4', fillOpacity: "1"};
           break;
         case "SC":
           style = { borderColor: 'black', color: '#A6CEE3', fillOpacity: "1" };
           break;
         case "ST":
           style = { borderColor: 'black', color: '#B2DF8A', fillOpacity: "1" };
           break;
        defualt:
           style = { borderColor: 'black', color: '#1A1A1A', fillOpacity: "1" };
           break;
        }
        return (
          <GeoJSON key={constituency.id} data={constituency} style={style} />
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
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
        >
          {this.renderConstituencies(data.features)}
        </Map>
      </div>
    );
  }
}
