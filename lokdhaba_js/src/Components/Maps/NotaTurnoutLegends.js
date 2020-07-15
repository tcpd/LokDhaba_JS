import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class NotaTurnoutLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d ==="<1%"? "#f1eef6"
            : d === "1%-3%" ? "#bdc9e1"
            : d === "3%-5%" ? "#74a9cf"
            : d === ">5%" ? "#0570b0"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = this.props.Legend;//["<1%","1%-3%","3%-5%",">5%"];
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

export default withLeaflet(NotaTurnoutLegends);
