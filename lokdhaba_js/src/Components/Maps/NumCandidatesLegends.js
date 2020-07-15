import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class NumCandidatesLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d ==="<5"? "#deebf7"
            : d === "5-15" ? "#6baed6"
            : d === ">15" ? "#08306b"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = this.props.Legend;//["<5", "5-15", ">15"];
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

export default withLeaflet(NumCandidatesLegends);
