import React from "react";
import ReactDOM from 'react-dom';
import { withLeaflet, MapControl } from "react-leaflet";
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import Checkbox from '../Shared/Checkbox.js';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import L from "leaflet";

class MapYearOptions extends MapControl {

  getYearOptions(props) {
    const { enableChangeMap, enableBaseMap, yearOptions } = props;

    const jsx = (
      <div>
        <Paper elevation={3} style={{ width: 400, opacity: 0.7 }}>
          <div style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 5 }}>
            {enableChangeMap &&
              <Checkbox id={"change_map_checkbox"} label={"Show change map"} checked={props.showChangeMap} onChange={props.onShowChangeMapChange} />
            }
            {enableBaseMap &&
              <Checkbox id={"base_map_checkbox"} label={"Show base map"} checked={props.showBaseMap} onChange={props.onShowBaseMapChange} />
            }
            {(enableChangeMap || enableBaseMap) &&
              <Divider />
            }
            <div style={{ paddingTop: 7 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Year</FormLabel>
                <RadioGroup row aria-label="year" name="year" value={parseInt(props.year)} onChange={props.onMapYearChange}>
                  {yearOptions.map((year) => {
                    if (year.value !== "") {
                      return <FormControlLabel key ={year.value} value={year.value} control={<Radio />} label={year.label} />
                    }
                    else return null;
                  })}

                </RadioGroup>
              </FormControl>
              <button onClick={props.handlePlay}>play</button>
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
    return new MapInfo({ position: "bottomleft" });
  }

  createLeafletElement(props) {
    return this.getYearOptions(props)
  }

  updateLeafletElement(fromProps, toProps) {
    const { map } = this.props.leaflet;
    if (fromProps.year !== toProps.year || fromProps.enableChangeMap !== toProps.enableChangeMap || fromProps.enableNormalizedMap !== toProps.enableNormalizedMap) {

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

export default withLeaflet(MapYearOptions);
