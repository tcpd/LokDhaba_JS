import { MapControl, withLeaflet } from 'react-leaflet';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

var legend;

class DiscreteLegend extends MapControl {
  createLeafletElement(props) { }

  updateLeafletElement(fromProps, toProps) {
    if (fromProps.Legend !== toProps.Legend) {
      const { getLegendColor } = this.props;

      if (legend) {
        legend.remove(this.props.leaflet.map);
      }

      legend = L.control({ position: "topright" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        const grades = this.props.Legend;
        let labels = [];

        for (let key in grades) {

          labels.push(
            '<i style="background:' +
            getLegendColor(key) +
          '; border-style: solid; border-width: 1px"></i> ' +
            key +
            ' (' + grades[key] + ')'
          );
        }

        div.innerHTML = labels.join("<br>");
        return div;
      };

      const { map } = this.props.leaflet;
      legend.addTo(map);
    }
  }

  componentWillUnmount() { }

  componentDidMount() {
    const { getLegendColor } = this.props;
    legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = this.props.Legend;
      let labels = [];

      for (let key in grades) {

        labels.push(
          '<i style="background:' +
          getLegendColor(key) +
          '; border-style: solid; border-width: 1px"></i> ' +
          key +
          ' (' + grades[key] + ')'
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    const { map } = this.props.leaflet;
    legend.addTo(map);
  }
}

export default withLeaflet(DiscreteLegend);
