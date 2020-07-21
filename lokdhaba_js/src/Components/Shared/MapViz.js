import React from 'react';
import { Map, GeoJSON, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import PrintControlDefault from 'react-leaflet-easyprint';
import StateCentroids from '../../Assets/Data/StateCentroids.json';
import ContinuousLegend from './ContinuousLegend';
import DiscreteLegend from '../Shared/DiscreteLegend';
import MapYearOptions from '../Shared/MapYearOptions';
import FeatureInfo from '../Shared/FeatureInfo'
import * as Constants from '../Shared/Constants';
import L from "leaflet";

export default class MapViz extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      info : ""
    };
  }

  highlightFeature = (e) => {
    var layer = e.target;
    const { vizParameter } = this.props;


    var tooltip = '';
    for (var key in layer.feature.properties) {
      if (layer.feature.properties.hasOwnProperty(key) && (key === "State_Name" || key == "Constituency_Name" || key === vizParameter )) {
        var value = layer.feature.properties[key];
        tooltip += `<b>${key}:</b> ${value}<br/>`;
      }
    }
    this.setState({info:tooltip});

    layer.setStyle({
      weight: 3,
      color: '#ffffff'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  resetHighlight = (e) => {
    var layer = e.target;
    layer.setStyle({
      weight: 1,
      color: 'black'
    });
    this.setState({info:""})
  };

   // zoomToFeature = (e) => {
   //   Map.fitBounds(e.target.getBounds());
   // };


  onEachFeature = (feature, layer) => {

    var popupContent = '';
    for (var key in feature.properties) {
      if (feature.properties.hasOwnProperty(key) ) {
        var value = feature.properties[key];
        popupContent += `<b>${key}:</b> ${value}<br/>`;
      }
    }
    layer.bindPopup(popupContent);


    // layer.bindTooltip(tooltip);

    layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight
    });
  };

  renderConstituencies = (mapGeoJson, dataFilterOptions) => {
    const { getMapColor } = this.props;

    return mapGeoJson.map((constituency) => {
      let style = {
        fillColor: getMapColor(constituency, dataFilterOptions),
        weight: 1,
        opacity: 1,
        color: 'black',
        fillOpacity: 1
      };

      return (
        <GeoJSON
          key={constituency.id + "-" + constituency.properties.Assembly_No}
          data={constituency}
          style={() => {
            return ({ fillColor: style.fillColor, weight: style.weight, opacity: style.opacity, color: style.color, fillOpacity: style.fillOpacity })
          }}
          onEachFeature={this.onEachFeature}
        />
      );
    });
  };

  renderLegend = () => {
    const { legendType, discreteLegend, getLegendColor, minVizParameter, maxVizParameter, showChangeMap, enableNormalizedMap, showNormalizedMap, onShowNormalizedMapChange  } = this.props;

    if (legendType === "Continuous") {
      if (showChangeMap) {
        return (
          <ContinuousLegend
            backgroundStyle={"linear-gradient(to right, #" + Constants.mapColorCodes.changeMap.minColor + " 0%, #ffffff 50%, #" + Constants.mapColorCodes.changeMap.maxColor + " 100%)"}
            title={"Percentage(%)"}
            leftMarker={minVizParameter}
            rightMarker={maxVizParameter}
          />
        )
      }
      else {
        return (
          <ContinuousLegend
            backgroundStyle={"linear-gradient(to right, #" + Constants.mapColorCodes.normalMap.minColor + " 0%, #" + Constants.mapColorCodes.normalMap.maxColor + " 100%)"}
            title={"Percentage(%)"}
            leftMarker={minVizParameter}
            rightMarker={maxVizParameter}
            enableNormalizedMap = {enableNormalizedMap}
            showNormalizedMap={showNormalizedMap}
            onShowNormalizedMapChange={onShowNormalizedMapChange}
          />
        )
      }
    }
    else if (legendType === "Discrete") {
      return (
        <DiscreteLegend Legend={discreteLegend} getLegendColor={getLegendColor} />
      )
    }
  }

  render() {
    const { title, enableChangeMap, showChangeMap, onShowChangeMapChange, enableNormalizedMap, showNormalizedMap, onShowNormalizedMapChange, vizParameter } = this.props;
    var data = this.props.data;
    var electionType = this.props.electionType === 'GE' ? 'Lok Sabha' : 'Vidhan Sabha';
    const PrintControl = withLeaflet(PrintControlDefault);
    var dataFilterOptions = this.props.dataFilterOptions;
    var shape = this.props.map;
    var state = this.props.stateName;
    let joinMap = {};
    const {info} = this.state;

    if (electionType === 'Lok Sabha') {
      for (var i = 0; i < data.length; i++) {
        data[i].key = data[i].State_Name + '_' + data[i].Constituency_No;
      }
      joinMap = {
        geoKey: 'properties.State_Key', //here geoKey can be feature 'id' also
        dataKey: 'key'
      };
    } else {
      joinMap = {
        geoKey: 'properties.ASSEMBLY', //here geoKey can be feature 'id' also
        dataKey: 'Constituency_No'
      };
    }

    var extendGeoJSON = require('extend-geojson-properties');
    extendGeoJSON(shape, data, joinMap);

    var leaflet = this.renderConstituencies(shape, dataFilterOptions);

    var st = state !== '' ? state : 'Lok_Sabha';
    var centerX = StateCentroids.filter(function (item) {
      return item.State_Name === st;
    })[0].Y;
    var centerY = StateCentroids.filter(function (item) {
      return item.State_Name === st;
    })[0].X;
    var zoom = StateCentroids.filter(function (item) {
      return item.State_Name === st;
    })[0].zoom;

    return (
      <div style={{ height: '300px' }}>
        <div className="my-map" style={{ width: '100%', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <label>
              {title}
            </label>
          </div>
          <Map
            center={[centerX, centerY]}
            zoom={zoom }
            maxZoom={zoom + 8}
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={false}
            dragging={true}
            animate={true}
            easeLinearity={0.35}
          >
            {leaflet}
            <PrintControl
              ref={(ref) => {
                this.printControl = ref;
              }}
              position="topleft"
              sizeModes={['Current', 'A4Portrait', 'A4Landscape']}
              hideControlContainer={false}
            />
            <PrintControl
              position="topleft"
              sizeModes={['Current', 'A4Portrait', 'A4Landscape']}
              hideControlContainer={false}
              title="Export as PNG"
              exportOnly
            />
            {this.renderLegend()}
            <FeatureInfo
              info= {this.state.info}
            />
            {this.props.showMapYearOptions &&
              <MapYearOptions
                enableChangeMap={enableChangeMap}
                showChangeMap={showChangeMap}
                onShowChangeMapChange={onShowChangeMapChange}
                enableNormalizedMap={enableNormalizedMap}
                showNormalizedMap={showNormalizedMap}
                onShowNormalizedMapChange={onShowNormalizedMapChange}
                handlePlay={this.props.playChangeYears}
                onMapYearChange={this.props.onMapYearChange}
                year={this.props.assemblyNo}
                yearOptions={this.props.yearOptions}
              />}
          </Map>
        </div>
      </div>
    );
  }
}
