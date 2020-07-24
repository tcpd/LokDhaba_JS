import React from "react";
import ReactDOM from 'react-dom';
import { withLeaflet, MapControl } from "react-leaflet";
import Paper from '@material-ui/core/Paper';
import L from "leaflet";
import '../../Assets/Styles/legend.css';

class FeatureInfo extends MapControl {


// method that we will use to update the control based on feature properties passed.
  getInfo(props){

    const text = this.props.info
    const jsx = text===""?"Click a constituency to get information":text;


    const MapInfo = L.Control.extend({
      onAdd: map => {
        let div = L.DomUtil.create('div', 'info');
        div.innerHTML= jsx;
        return div;
      }
    });
    return new MapInfo({ position: "topleft" });

  }

  createLeafletElement(props) {
    return this.getInfo(props);
  }

  updateLeafletElement(fromProps, toProps) {
    const { map } = this.props.leaflet;
    if (fromProps.info !== toProps.info ) {

      if (this.leafletElement) {
        this.leafletElement.remove(map);
      }

      this.leafletElement = this.createLeafletElement(toProps)
      this.leafletElement.addTo(map)
    }
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement = this.createLeafletElement()
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet(FeatureInfo);
