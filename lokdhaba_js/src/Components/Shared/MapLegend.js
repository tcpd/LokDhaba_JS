import React from "react";
import ReactDOM from 'react-dom';
import { withLeaflet, MapControl } from "react-leaflet";
import Paper from '@material-ui/core/Paper';
import L from "leaflet";
import * as Constants from '../Shared/Constants';
import '../../Assets/Styles/legend.css'

class MapLegend extends MapControl {

  createLeafletElement(opts) {
    const color1 = Constants.legendColorCodes.color2;
    const color2 = Constants.legendColorCodes.color1;
    const background = "linear-gradient(to right, #" + color1 +" 0%, #" + color2 +" 100%)";
    
    const jsx = (
      <div {...this.props}>
        <Paper elevation={3}>
          <div style={{ paddingLeft: "10px", paddingRight: "10px", paddingBottom: "10px", paddingTop: "5px" }}>
            <div className="box">
              <p className="left-marker">0</p>
              <p className="middle-marker">Percentage(%)</p>
              <p className="right-marker">100</p>
              <br />
              <div className="legend-gradient" style={{ background: background }}></div>
            </div>
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

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet(MapLegend);
