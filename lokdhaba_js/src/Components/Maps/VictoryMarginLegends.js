import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class VictoryMarginLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d ==="<5%"? "#f1eef6"
            : d === "5%-10%" ? "#bdc9e1"
            : d === "10%-20%" ? "#74a9cf"
            : d === ">20%" ? "#0570b0"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = ["<5%", "5%-10%", "10%-20%", ">20%"];
      let labels = [];

      for (let i = 0; i < grades.length; i++) {

        labels.push(
          '<i style="background:' +
            getColor(grades[i]) +
            '"></i> ' +
            grades[i]
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    const { map } = this.props.leaflet;
    legend.addTo(map);
  }
}

export default withLeaflet(VictoryMarginLegends);
