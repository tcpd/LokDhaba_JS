import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class WinnerGenderLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d === "Male"? "#1F78B4"
            : d === "Female" ? "#A6CEE3"
            : d === "Others" ? "#B2DF8A"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = ["Male", "Female", "Others"];
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

export default withLeaflet(WinnerGenderLegends);
