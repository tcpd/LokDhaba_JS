import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class NumCandidatesLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d ==="<5"? "#1F78B4"
            : d === "5-15" ? "#A6CEE3"
            : d === ">15" ? "#B2DF8A"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = ["<5", "5-15", ">15"];
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

export default withLeaflet(NumCandidatesLegends);
