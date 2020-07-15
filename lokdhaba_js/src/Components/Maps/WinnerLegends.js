import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';
import ColPalette from '../../Assets/Data/PartyColourPalette.json';

class WinnerLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = p => {
      var color = "#FFFFFF00"
      //var constituencyParty = constituency.properties.Party;

      for (var i = 0; i < ColPalette.length; i++) {
        var element = ColPalette[i];

        if (element.Party == p) {
          color = element.Color;
          break;
        }
      }
      return(color);
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const parties = this.props.Legend;
      let labels = [];

      for (let key in parties) {

        labels.push(
          '<i style="background:' +
            getColor(key) +
            '"></i> ' +
            key +
            ' ('+ parties[key] +')'
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    const { map } = this.props.leaflet;
    legend.addTo(map);
  }
}

export default withLeaflet(WinnerLegends);
