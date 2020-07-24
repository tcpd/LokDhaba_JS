import React from "react";
import ReactDOM from 'react-dom';
import { withLeaflet, MapControl } from "react-leaflet";
import Paper from '@material-ui/core/Paper';
import Checkbox from '../Shared/Checkbox.js';
import Divider from '@material-ui/core/Divider';
import L from "leaflet";
import '../../Assets/Styles/legend.css'

class ContinuousLegend extends MapControl {

  getLegend(props) {
    const { backgroundStyle, title, leftMarker, rightMarker,enableNormalizedMap } = props;

    const jsx = (
      <div {...this.props}>
        <Paper elevation={3}>
          <div style={{ paddingLeft: "10px", paddingRight: "10px", paddingBottom: "10px", paddingTop: "5px" }}>
            <div className="box">
              <p className="left-marker">{leftMarker}</p>
              <p className="middle-marker">{title}</p>
              <p className="right-marker">{rightMarker}</p>
              <br />
              <div className="legend-gradient" style={{ background: backgroundStyle }}></div>
            </div>
            {(enableNormalizedMap) &&
              <Divider />
            }
            {enableNormalizedMap &&
              <Checkbox id={"normalized_map_checkbox"} label={"Normalize values"} checked={props.showNormalizedMap} onChange={props.onShowNormalizedMapChange} />
            }
          </div>
        </Paper>
      </div>
    );

    const MapInfo = L.Control.extend({
      onAdd: map => {
        let div = L.DomUtil.create('div', '');
        ReactDOM.render(jsx, div);
        return div;
      }
    });
    return new MapInfo({ position: "topright" });
  }

  createLeafletElement(props) {
    return this.getLegend(props)
  }

  updateLeafletElement(fromProps, toProps) {
    const { map } = this.props.leaflet;
    if (fromProps.backgroundStyle !== toProps.backgroundStyle || fromProps.title !== toProps.title || fromProps.leftMarker !== toProps.leftMarker || fromProps.rightMarker !== toProps.rightMarker) {

      if (this.leafletElement) {
        this.leafletElement.remove(map);
      }

      this.leafletElement = this.createLeafletElement(toProps)
      this.leafletElement.addTo(map)
    }
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet(ContinuousLegend);
