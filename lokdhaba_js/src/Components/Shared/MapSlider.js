import React from "react";
import ReactDOM from 'react-dom';
import { withLeaflet, MapControl } from "react-leaflet";
import Slider from '@material-ui/core/Slider';
import Paper from '@material-ui/core/Paper';
import L from "leaflet";

var marks = [];

function valuetext(value) {
  return value;
}

function valueLabelFormat(value) {
  return marks.find((mark) => mark.value === value).label.split(" ")[0];
}

class MapSlider extends MapControl {

  getSlider(props) {
    const yearOptions = props.yearOptions;
    const minMarker = yearOptions[1].value;
    const maxMarker = yearOptions[yearOptions.length - 1].value;
    
    marks = []
    for (let index = 0; index < yearOptions.length; index++) {
      const element = yearOptions[index];
      if (element.value !== "") {
        marks.push({ value: element.value, label: element.label })
      }
    }

    const jsx = (
      <div {...this.props}>
        <Paper elevation={3}>
          <button onClick={this.props.handlePlay}>play</button>
          <br />
          <div style={{ width: "450px", paddingLeft: 70, paddingRight: 70 }}>
            <Slider
              defaultValue={20}
              value={parseInt(this.props.year)}
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider-restrict"
              step={null}
              min={minMarker}
              max={maxMarker}
              valueLabelDisplay="auto"
              marks={marks}
              onChange={this.props.onSliderYearChange}
            />
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
    return new MapInfo({ position: "bottomleft" });
  }

  createLeafletElement(props) {
    return this.getSlider(props)
  }

  updateLeafletElement (fromProps, toProps) {
    const { map } = this.props.leaflet;
    if (fromProps.year !== toProps.year) {

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

export default withLeaflet(MapSlider);
