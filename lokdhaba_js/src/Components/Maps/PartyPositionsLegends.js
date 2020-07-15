import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class PartyPositionsLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d ==="1"? "#0570b0"
            : d === "2" ? "#74a9cf"
            : d === "3" ? "#bdc9e1"
            : d === ">3" ? "#f1eef6"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = this.props.Legend;
      let labels = [];

      for (let key in grades) {

        labels.push(
          '<i style="background:' +
            getColor(key) +
            '"></i> ' +
            key +
            ' ('+ grades[key] +')'
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    const { map } = this.props.leaflet;
    legend.addTo(map);
  }
}

export default withLeaflet(PartyPositionsLegends);
