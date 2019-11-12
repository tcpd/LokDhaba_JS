import { Map, GeoJSON, MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class VoterTurnoutLegends extends MapControl {
  createLeafletElement(props) {}

  componentWillUnmount() {}

  componentDidMount() {
    const getColor = d => {
      return d ==="<50%"? "#f7fbff"
            : d === "50%-60%" ? "#deebf7"
            : d === "60%-70%" ? "#c6dbef"
            : d === "70%-75%" ? "#9ecae1"
            : d === "75%-80%" ? "#6baed6"
            : d === "80%-85%" ? "#4292c6"
            : d === "85%-90%" ? "#2171b5"
            : d === "90%-95%" ? "#08519c"
            : d === ">95%" ? "#08306b"
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

export default withLeaflet(VoterTurnoutLegends);
