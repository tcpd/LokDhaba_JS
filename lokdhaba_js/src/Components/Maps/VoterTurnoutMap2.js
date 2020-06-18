import React from 'react';
import { Map, GeoJSON, withLeaflet } from 'react-leaflet';
import '../../Assets/Styles/layout.css';
import 'leaflet/dist/leaflet.css';
import PrintControlDefault from 'react-leaflet-easyprint';
import StateCentroids from '../../Assets/Data/StateCentroids.json';
import MapLegend from '../Shared/MapLegend';
import MapSlider from '../Shared/MapSlider';
import * as Constants from '../Shared/Constants';

export default class VoterTurnoutMap2 extends React.Component {
	onEachFeature = (feature, layer) => {
		var popupContent = '';
		for (var key in feature.properties) {
			if (feature.properties.hasOwnProperty(key)) {
				var value = feature.properties[key];
				popupContent += `<b>${key}:</b> ${value}<br/>`;
			}
		}
		layer.bindPopup(popupContent);
	};

	getColor = (ratio) => {
		var color1 = Constants.legendColorCodes.color1;
		var color2 = Constants.legendColorCodes.color2;
		var hex = function (x) {
			x = x.toString(16);
			return (x.length === 1) ? '0' + x : x;
		};

		var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
		var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
		var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

		var middle = hex(r) + hex(g) + hex(b);

		return "#" + middle.toString();
	}

	renderConstituencies = (mapGeoJson, dataFilterOptions) => {
		return mapGeoJson.map((constituency) => {
			var val = constituency.properties.Turnout_Percentage;
			let clr = '#FFFFFF00'
			if (val) {
				clr = this.getColor(val / 100);
			}

			let style = {
				fillColor: clr,
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

	render() {
		var data = this.props.data;
		var electionType = this.props.electionType === 'GE' ? 'Lok Sabha' : 'Vidhan Sabha';
		var assemblyNo = this.props.assemblyNo;
		const PrintControl = withLeaflet(PrintControlDefault);
		var dataFilterOptions = this.props.dataFilterOptions;

		var turnouts = data.map((X) => X.Turnout_Percentage);
		var legend = {};
		for (var i = 0; i < turnouts.length; i++) {
			var val = turnouts[i];
			if (val >= 95 && dataFilterOptions.has('>95%')) {
				legend['>95%'] = legend['>95%'] ? legend['>95%'] + 1 : 1;
			} else if (val >= 90 && val < 95 && dataFilterOptions.has('90%-95%')) {
				legend['90%-95%'] = legend['90%-95%'] ? legend['90%-95%'] + 1 : 1;
			} else if (val >= 85 && val < 90 && dataFilterOptions.has('85%-90%')) {
				legend['85%-90%'] = legend['85%-90%'] ? legend['85%-90%'] + 1 : 1;
			} else if (val >= 80 && val < 85 && dataFilterOptions.has('80%-85%')) {
				legend['80%-85%'] = legend['80%-85%'] ? legend['80%-85%'] + 1 : 1;
			} else if (val >= 75 && val < 80 && dataFilterOptions.has('75%-80%')) {
				legend['75%-80%'] = legend['75%-80%'] ? legend['75%-80%'] + 1 : 1;
			} else if (val >= 70 && val < 75 && dataFilterOptions.has('70%-75%')) {
				legend['70%-75%'] = legend['70%-75%'] ? legend['70%-75%'] + 1 : 1;
			} else if (val >= 60 && val < 70 && dataFilterOptions.has('60%-70%')) {
				legend['60%-70%'] = legend['60%-70%'] ? legend['60%-70%'] + 1 : 1;
			} else if (val >= 50 && val < 60 && dataFilterOptions.has('50%-60%')) {
				legend['50%-60%'] = legend['50%-60%'] ? legend['50%-60%'] + 1 : 1;
			} else if (val < 50 && dataFilterOptions.has('<50%')) {
				legend['<50%'] = legend['<50%'] ? legend['<50%'] + 1 : 1;
			}
		}

		var SortedKeys = [
			'>95%',
			'90%-95%',
			'85%-90%',
			'80%-85%',
			'75%-80%',
			'70%-75%',
			'60%-70%',
			'50%-60%',
			'<50%'
		]; //Object.keys(legend).sort(function(a,b){return legend[b]-legend[a]})
		var sortedLegend = {};
		for (var i = 0; i < SortedKeys.length; i++) {
			var val = SortedKeys[i];
			if (legend[val]) {
				sortedLegend[val] = legend[val];
			}
		}

		var shape = this.props.map;
		var state = this.props.stateName;
		if (electionType === 'Lok Sabha') {
			for (var i = 0; i < data.length; i++) {
				data[i].key = data[i].State_Name + '_' + data[i].Constituency_No;
			}
			var joinMap = {
				geoKey: 'properties.State_Key', //here geoKey can be feature 'id' also
				dataKey: 'key'
			};
		} else {
			var joinMap = {
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
							{`Constituency wise turnout perentages for ${electionType} in Assembly #${assemblyNo}`}
						</label>
					</div>
					<Map
						center={[centerX, centerY]}
						zoom={zoom - 1}
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
						<MapLegend />
            <MapSlider
              handlePlay={this.props.playChangeYears}
              onSliderYearChange={this.props.onSliderYearChange}
              year={this.props.assemblyNo}
              yearOptions={this.props.yearOptions}
            />
					</Map>
				</div>
			</div>
		);
	}
}
