import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class ConstituencyTypeLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d === "General"? "#1F78B4"
            : d === "SC" ? "#A6CEE3"
            : d === "ST" ? "#B2DF8A"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = this.props.Legend;//["General", "SC", "ST"];
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

export default withLeaflet(ConstituencyTypeLegends);
