import React from 'react'
import { Map, GeoJSON , TileLayer, withLeaflet} from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import ConstituencyTypeLegends from './ConstituencyTypeLegends';
import PrintControlDefault from 'react-leaflet-easyprint';

export default class ConstituencyTypeMap extends React.Component {

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

      let color = '#FFFFFF00';

      if(dataFilterOptions.has(constituency.properties.Constituency_Type)){
        switch(constituency.properties.Constituency_Type){
          case "General":
            color =  '#1F78B4';
            break;
          case "SC":
            color = '#A6CEE3';
            break;
          case "ST":
            color =  '#B2DF8A';
            break;
         defualt:
            break;
         }
      }
      var style= {fillColor: color,
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    fillOpacity: 0.7};

        return (
          <GeoJSON key={constituency.id} data={constituency} style={style} onEachFeature={this.onEachFeature}/>
        );
      });
    }

  render() {
    var data = this.props.data;
    var electionType = this.props.electionType === "GE" ? "Lok Sabha" : "Vidhan Sabha";
    var assemblyNo =this.props.assemblyNo;
    var dataFilterOptions = this.props.dataFilterOptions;
    const PrintControl = withLeaflet(PrintControlDefault);

    var constituencyTypes = data.features.flatMap(X => X.properties.Constituency_Type);
    var legend = {}
    for (var i = 0; i < constituencyTypes.length; i++) {
      var pty = constituencyTypes[i];
      if(dataFilterOptions.has(pty)){
        legend[pty] = legend[pty] ? legend[pty] + 1 : 1;
      }
    }

    var SortedKeys = Object.keys(legend).sort(function(a,b){return legend[b]-legend[a]})
    var sortedLegend ={}
    for (var i =0; i < SortedKeys.length; i++) {
      var pty = SortedKeys[i];
      sortedLegend[pty] = legend[pty]
    }

    var leaflet = this.renderConstituencies(data.features,dataFilterOptions);
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
             <TileLayer
               attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             />
          {leaflet}
          <ConstituencyTypeLegends Legend = {sortedLegend}/>
          <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
          <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />

        </Map>
      </div>
    );
  }
}
