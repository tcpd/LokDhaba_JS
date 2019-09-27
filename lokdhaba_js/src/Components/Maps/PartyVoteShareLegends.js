import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class PartyVoteShareLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d ==="<20%"? "#eff3ff"
            : d === "20%-30%" ? "#c6dbef"
            : d === "30%-40%" ? "#9ecae1"
            : d === "40%-50%" ? "#6baed6"
            : d === "50%-60%" ? "#3182bd"
            : d === ">60%" ? "#08519c"
            : "FFFFFF00";
    };

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = ["<20%","20%-30%","30%-40%","40%-50%","50%-60%",">60%"];
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

export default withLeaflet(PartyVoteShareLegends);
