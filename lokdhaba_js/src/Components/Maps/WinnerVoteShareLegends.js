import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class WinnerVoteShareLegends extends MapControl {
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
      const grades = this.props.Legend;
      let labels = [];

      for (let key in grades) {

        labels.push(
          '<i style="background:' +
            getColor(key) +
            '"></i> ' +
            key+
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

export default withLeaflet(WinnerVoteShareLegends);
