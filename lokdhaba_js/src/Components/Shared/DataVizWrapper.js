import React from 'react';
import MapViz from './MapViz';
import BarChart from './BarChart';
import PartyBarChart from './PartyBarChart';
import PartyStepBarChart from './PartyStepBarChart';
import PieChart from './PieChart';
//import IncumbencyProfile from './IncumbencyProfile';
import PartyScatterChart from './PartyScatterChart';
import ConstituencyTypeColorPalette from '../../Assets/Data/ConstituencyTypeColorPalette.json';
import PartyColorPalette from '../../Assets/Data/PartyColourPalette.json';
import GenderColorPalette from '../../Assets/Data/GenderColorPalette.json';
import * as Constants from './Constants';

const defaultColor = "#FFFFFF00";

/* Template function for currying */
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

export default class DataVizWrapper extends React.Component {

  getColorFromRatio = (ratio, minColor, maxColor) => {
    var color1 = maxColor;
    var color2 = minColor;
    var hex = function (x) {
      if (x === 256) {
        return 'ff';
      }
      x = x.toString(16);
      return (x.length === 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
    var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
    var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

    var middle = hex(r) + hex(g) + hex(b);

    return "#" + middle.toString();
  }

  getColorForContinuous = (minColor, maxColor, vizParameter, constituency, dataFilterOptions) => {
    if (!constituency) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.hasOwnProperty('properties')) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.properties.hasOwnProperty(vizParameter)) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    let val = constituency.properties[vizParameter];
    if (val) {
      return this.getColorFromRatio(val / 100, minColor, maxColor);
    }
    else return Constants.mapColorCodes.dataUnavailabe.color;
  }

  getColorForNormalizedMap = (min, max, minColor, maxColor, vizParameter, constituency, dataFilterOptions) => {
    if (!constituency) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.hasOwnProperty('properties')) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.properties.hasOwnProperty(vizParameter)) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    let val = constituency.properties[vizParameter];
    if (!val) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    else {
      let ratio = (val - min) / (max - min);
      return this.getColorFromRatio(ratio, minColor, maxColor);
    }
  }

  getColorForChangeMap = (min, max, minColor, maxColor, vizParameter, constituency, dataFilterOptions) => {
    if (!constituency) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.hasOwnProperty('properties')) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.properties.hasOwnProperty(vizParameter)) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    let val = constituency.properties[vizParameter];
    let ratio;
    if (!val) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (val >= 0) {
      ratio = val / max;
      return this.getColorFromRatio(ratio, 'ffffff', maxColor);
    }
    else {
      ratio = (val - min) / (- min);
      return this.getColorFromRatio(ratio, minColor, 'ffffff');
    }
  }

  getMapColorFromPalette = (ColorPalette, vizParameter, constituency, dataFilterOptionName) => {
    if (!constituency) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.hasOwnProperty('properties')) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    if (!constituency.properties.hasOwnProperty(vizParameter)) {
      return Constants.mapColorCodes.dataUnavailabe.color;
    }
    let d = constituency.properties[vizParameter];
    let color = "#FFFFFF00";

    if (!d) {
      return color;
    }
    if (dataFilterOptionName.has(d.toString())) {
      for (let i = 0; i < ColorPalette.length; i++) {
        var element = ColorPalette[i];
        if (element[vizParameter] === d) {
          color = element.Color;
          break;
        }
      }
    }

    return color;
  }

  getLegendColorFromPalette = (ColorPalette, vizParameter, d, dataFilterOptionName) => {
    let color = "#FFFFFF00";

    if (!d) {
      return color;
    }
    if (dataFilterOptionName.has(d.toString())) {
      for (let i = 0; i < ColorPalette.length; i++) {
        var element = ColorPalette[i];
        if (element[vizParameter] === d) {
          color = element.Color;
          break;
        }
      }
    }

    return color;
  }

  getSortedLegendFromValue = (data, vizParameter, dataFilterOptions) => {
    let vals = data.map((X) => X[vizParameter]);
    let legend = {};
    for (let i = 0; i < vals.length; i++) {
      let val = vals[i].toString();
      if (dataFilterOptions.has(val)) {
        legend[val] = legend[val] ? legend[val] + 1 : 1;
      }
    }

    let SortedKeys = Object.keys(legend).sort(function (a, b) {
      return legend[b] - legend[a];
    });
    let sortedLegend = {};
    for (let i = 0; i < SortedKeys.length; i++) {
      const val = SortedKeys[i];
      sortedLegend[val] = legend[val];
    }

    return sortedLegend;
  }

  render() {
    const { visualization, visualizationType, data, map, electionType, chartMapOptions, dataFilterOptions, assemblyNo, stateName, party, showMapYearOptions, yearOptions, playChangeYears, onMapYearChange, showChangeMap,showBaseMap, showNormalizedMap, segmentWise, mapOverlay,electionYearDisplay } = this.props;
    const electionTypeDisplay = electionType === 'GE' ? 'Lok Sabha' : 'Vidhan Sabha';
    const stateNameDisplay = stateName === 'Lok_Sabha' ? '' : stateName.replace(/_/g, " ");

    if (visualizationType === "Map") {
      let title = "";
      let changeMapTitle = "";
      let vizParameter = "";
      let vizChangeParameter = "";
      let ColorPalette = [];
      let legendType = "";
      let discreteLegend = [];
      let changeMapDiscreteLegend = [];
      let getLegendColor;
      let getMapColor;
      let getMapChangeMapColor;
      let curriedGetMapColorFromPalette = curry(this.getMapColorFromPalette);
      let curriedGetLegendColorFromPalette = curry(this.getLegendColorFromPalette);
      let curriedGetColorForContinuous = curry(this.getColorForContinuous);
      let curriedGetColorForChangeMap = curry(this.getColorForChangeMap);
      let curriedGetColorForNormalizedMap = curry(this.getColorForNormalizedMap);
      let minColorNormal = Constants.mapColorCodes.normalMap.minColor;
      let maxColorNormal = Constants.mapColorCodes.normalMap.maxColor;
      let enableChangeMap = false;
      let enableBaseMap = true;
      let enableNormalizedMap = false;
      let minVizParameter = 0;
      let maxVizParameter = 100;

      switch (visualization) {
        case "winnerCasteMap": {
          title = `Constituency types for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Constituency_Type";
          legendType = "Discrete";
          ColorPalette = ConstituencyTypeColorPalette;
          getMapColor = (constituency, dataFilterOptions) => {
            return curriedGetMapColorFromPalette(ColorPalette, vizParameter, constituency, dataFilterOptions);
          }
          discreteLegend = this.getSortedLegendFromValue(data, vizParameter, dataFilterOptions);
          getLegendColor = (val) => {
            return curriedGetLegendColorFromPalette(ColorPalette, vizParameter, val, dataFilterOptions);
          }
          break;
        }

        case "numCandidatesMap": {
          title = `Constituency wise number of candidates contested for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "N_Cand";
          legendType = "Discrete";
          getMapColor = (constituency, dataFilterOptions) => {
            if (!constituency) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.hasOwnProperty('properties')) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.properties.hasOwnProperty(vizParameter)) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            let val = constituency.properties[vizParameter];
            switch (true) {
              case !val:
                return defaultColor;
              case val < 5 && dataFilterOptions.has('<5'):
                return '#deebf7';
              case val > 15 && dataFilterOptions.has('>15'):
                return '#6baed6';
              case val >= 5 && val <= 15 && dataFilterOptions.has('5-15'):
                return '#08306b';
              default:
                return defaultColor;
            }
          };
          var candidates = data.map((X) => X.N_Cand);
          let legend = {};
          for (let i = 0; i < candidates.length; i++) {
            let val = candidates[i];
            if (val < 5 && dataFilterOptions.has('<5')) {
              legend['<5'] = legend['<5'] ? legend['<5'] + 1 : 1;
            } else if (val > 15 && dataFilterOptions.has('>15')) {
              legend['>15'] = legend['>15'] ? legend['>15'] + 1 : 1;
            } else if (val >= 5 && val <= 15 && dataFilterOptions.has('5-15')) {
              legend['5-15'] = legend['5-15'] ? legend['5-15'] + 1 : 1;
            }
          }

          let SortedKeys = ['<5', '5-15', '>15'];
          let sortedLegend = {};
          for (let i = 0; i < SortedKeys.length; i++) {
            let val = SortedKeys[i];
            if (legend[val]) {
              sortedLegend[val] = legend[val];
            }
          }

          discreteLegend = sortedLegend;
          getLegendColor = d => {
            return d === "<5" ? "#deebf7"
              : d === "5-15" ? "#6baed6"
                : d === ">15" ? "#08306b"
                  : "FFFFFF00";
          };
          break;
        }

        case "voterTurnoutMap": {
          title = `Constituency wise turnout percentages for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          changeMapTitle = `Constituency wise change in turnout perentages for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Turnout_Percentage";
          vizChangeParameter = "Turnout_Change_pct";
          legendType = "Continuous";
          getMapColor = curriedGetColorForContinuous(minColorNormal, maxColorNormal, vizParameter);
          enableChangeMap = true;
          enableNormalizedMap = true;
          break;
        }

        case "winnerGenderMap": {
          title = `Winners by gender for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Sex";
          legendType = "Discrete";
          ColorPalette = GenderColorPalette;
          getMapColor = (constituency, dataFilterOptions) => {
            return curriedGetMapColorFromPalette(ColorPalette, vizParameter, constituency, dataFilterOptions);
          }
          discreteLegend = this.getSortedLegendFromValue(data, vizParameter, dataFilterOptions);
          getLegendColor = (val) => {
            return curriedGetLegendColorFromPalette(ColorPalette, vizParameter, val, dataFilterOptions);
          }
          break;
        }

        case "winnerMarginMap": {
          title = `Constituency wise victory margin percentages for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          changeMapTitle = `Constituency wise change in victory margin percentages for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Margin_Percentage";
          vizChangeParameter = "Margin_Change_pct";
          legendType = "Continuous";
          getMapColor = curriedGetColorForContinuous(minColorNormal, maxColorNormal, vizParameter);
          enableChangeMap = true;
          enableNormalizedMap = true;
          break;
        }

        case "winnerVoteShareMap": {
          title = `Constituency wise vote share percentages of winners for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          changeMapTitle = `Constituency wise change in vote share percentages of winners for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Vote_Share_Percentage";
          vizChangeParameter = "Vote_Share_Change_pct";
          legendType = "Continuous";
          getMapColor = curriedGetColorForContinuous(minColorNormal, maxColorNormal, vizParameter);
          enableChangeMap = true;
          enableNormalizedMap = true;
          break;
        }

        case "partyVoteShareMap": {
          title = `Constituency wise vote share percentages of ${party} candidates for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          changeMapTitle = `Constituency wise change in vote share percentages of ${party} candidates for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Vote_Share_Percentage";
          vizChangeParameter = "Vote_Share_Change_pct";
          legendType = "Continuous";
          getMapColor = curriedGetColorForContinuous(minColorNormal, maxColorNormal, vizParameter);
          enableNormalizedMap = true;
          enableChangeMap = true;
          break;
        }

        case "partyPositionsMap": {
          title = `Constituency wise vote share percentages of ${party} candidates for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Position";
          legendType = "Discrete";
          getMapColor = (constituency, dataFilterOptions) => {
            if (!constituency) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.hasOwnProperty('properties')) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.properties.hasOwnProperty(vizParameter)) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            let val = constituency.properties[vizParameter];
            switch (true) {
              case !val:
                return defaultColor;
              case val === 1 && dataFilterOptions.has('1'):
                return '#0570b0';
              case val === 2 && dataFilterOptions.has('2'):
                return '#74a9cf';
              case val === 3 && dataFilterOptions.has('3'):
                return '#bdc9e1';
              case val > 3 && dataFilterOptions.has('>3'):
                return '#f1eef6';
              default:
                return defaultColor;
            }
          };

          var positions = data.map((X) => X.Position);
          let legend = {};
          for (let i = 0; i < positions.length; i++) {
            let val = positions[i];
            if (val === 1 && dataFilterOptions.has('1')) {
              legend['1'] = legend['1'] ? legend['1'] + 1 : 1;
            } else if (val === 2 && dataFilterOptions.has('2')) {
              legend['2'] = legend['2'] ? legend['2'] + 1 : 1;
            } else if (val === 3 && dataFilterOptions.has('3')) {
              legend['3'] = legend['3'] ? legend['3'] + 1 : 1;
            } else if (val > 3 && dataFilterOptions.has('>3')) {
              legend['>3'] = legend['>3'] ? legend['>3'] + 1 : 1;
            }
          }

          let SortedKeys = ['1', '2', '3', '>3'];
          let sortedLegend = {};
          for (let i = 0; i < SortedKeys.length; i++) {
            let val = SortedKeys[i];
            if (legend[val]) {
              sortedLegend[val] = legend[val];
            }
          }

          discreteLegend = sortedLegend;
          getLegendColor = (d) => {
            return d === "1" ? "#0570b0"
              : d === "2" ? "#74a9cf"
                : d === "3" ? "#bdc9e1"
                  : d === ">3" ? "#f1eef6"
                    : "FFFFFF00";
          };
          break;
        }

        case "winnerMap": {
          title = `Constituency wise winning parties for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          changeMapTitle = `Constituency wise change in winning parties for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Party";
          legendType = "Discrete";
          ColorPalette = PartyColorPalette;
          getMapColor = (constituency, dataFilterOptions) => {
            return curriedGetMapColorFromPalette(ColorPalette, vizParameter, constituency, dataFilterOptions);
          }
          getMapChangeMapColor = (constituency, dataFilterOptions) => {
            if (!constituency) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.hasOwnProperty('properties')) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.properties.hasOwnProperty(vizParameter)) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (constituency.properties["Party_Change"] === null) {
              return '#ffffff';
            }
            else {
              return curriedGetMapColorFromPalette(ColorPalette, vizParameter, constituency, dataFilterOptions);
            }
          }
          discreteLegend = this.getSortedLegendFromValue(data, vizParameter, dataFilterOptions);
          getLegendColor = (val) => {
            return curriedGetLegendColorFromPalette(ColorPalette, vizParameter, val, dataFilterOptions);
          }

          let legend = {};
          let noPartyChangeCount = 0;
          for (let index = 0; index < data.length; index++) {
            const constituency = data[index];
            let val = constituency[vizParameter].toString();
            if (constituency["Party_Change"] === null) {
              noPartyChangeCount++;
            }
            else if (dataFilterOptions.has(val)) {
              legend[val] = legend[val] ? legend[val] + 1 : 1;
            }
          }

          let SortedKeys = Object.keys(legend).sort(function (a, b) {
            return legend[b] - legend[a];
          });
          let sortedLegend = {};
          sortedLegend['No change'] = noPartyChangeCount;
          for (let i = 0; i < SortedKeys.length; i++) {
            const val = SortedKeys[i];
            sortedLegend[val] = legend[val];
          }

          changeMapDiscreteLegend = sortedLegend;

          enableChangeMap = true;
          break;
        }

        case "notaTurnoutMap": {
          title = `Constituency wise NOTA vote share percentages for ${electionTypeDisplay} in Assembly #${assemblyNo}`;
          vizParameter = "Nota_Percentage";
          legendType = "Discrete";
          getMapColor = (constituency, dataFilterOptions) => {
            if (!constituency) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.hasOwnProperty('properties')) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            if (!constituency.properties.hasOwnProperty(vizParameter)) {
              return Constants.mapColorCodes.dataUnavailabe.color;
            }
            let val = constituency.properties[vizParameter];
            switch (true) {
              case !val:
                return defaultColor;
              case val > 5 && dataFilterOptions.has('>5%'):
                return '#0570b0';
              case val >= 3 && val <= 5 && dataFilterOptions.has('3%-5%'):
                return '#74a9cf';
              case val >= 1 && val < 3 && dataFilterOptions.has('1%-3%'):
                return '#bdc9e1';
              case val < 1 && dataFilterOptions.has('<1%'):
                return '#f1eef6';
              default:
                return defaultColor;
            }
          };

          let notavs = data.map((X) => X.Nota_Percentage);
          let legend = {};
          for (let i = 0; i < notavs.length; i++) {
            let val = notavs[i];
            if (val > 5 && dataFilterOptions.has('>5%')) {
              legend['>5%'] = legend['>5%'] ? legend['>5%'] + 1 : 1;
            } else if (val < 1 && dataFilterOptions.has('<1%')) {
              legend['<1%'] = legend['<1%'] ? legend['<1%'] + 1 : 1;
            } else if (val >= 3 && val <= 5 && dataFilterOptions.has('3%-5%')) {
              legend['3%-5%'] = legend['3%-5%'] ? legend['3%-5%'] + 1 : 1;
            } else if (val >= 1 && val < 3 && dataFilterOptions.has('1%-3%')) {
              legend['1%-3%'] = legend['1%-3%'] ? legend['1%-3%'] + 1 : 1;
            }
          }

          let SortedKeys = ['<1%', '1%-3%', '3%-5%', '>5%'];
          let sortedLegend = {};
          for (let i = 0; i < SortedKeys.length; i++) {
            let val = SortedKeys[i];
            if (legend[val]) {
              sortedLegend[val] = legend[val];
            }
          }

          discreteLegend = sortedLegend;
          getLegendColor = d => {
            return d === "<1%" ? "#f1eef6"
              : d === "1%-3%" ? "#bdc9e1"
                : d === "3%-5%" ? "#74a9cf"
                  : d === ">5%" ? "#0570b0"
                    : "FFFFFF00";
          };
          break;
        }

        default:
          break;
      }

      enableNormalizedMap = enableNormalizedMap && !showChangeMap;

      if (showChangeMap) {
        if (vizChangeParameter !== "") {
          maxVizParameter = Number.NEGATIVE_INFINITY;
          minVizParameter = Number.POSITIVE_INFINITY;
          for (let index = 0; index < data.length; index++) {
            let val = data[index][vizChangeParameter];
            if (parseFloat(val) > parseFloat(maxVizParameter)) {
              maxVizParameter = val;
            }
            if (parseFloat(val) < parseFloat(minVizParameter)) {
              minVizParameter = val;
            }
          }

          getMapChangeMapColor = curriedGetColorForChangeMap(minVizParameter, maxVizParameter, Constants.mapColorCodes.changeMap.minColor, Constants.mapColorCodes.changeMap.maxColor, vizChangeParameter);
        }

        return <MapViz
          title={changeMapTitle}
          data={data}
          map={map}
          visualization={visualization}
          electionType={electionType}
          dataFilterOptions={dataFilterOptions}
          assemblyNo={assemblyNo}
          stateName={stateName}
          showMapYearOptions={showMapYearOptions}
          yearOptions={yearOptions}
          playChangeYears={playChangeYears}
          onMapYearChange={onMapYearChange}
          vizParameter={vizChangeParameter}
          legendType={legendType}
          discreteLegend={changeMapDiscreteLegend}
          getMapColor={getMapChangeMapColor}
          getLegendColor={getLegendColor}
          minVizParameter={minVizParameter}
          maxVizParameter={maxVizParameter}
          enableChangeMap={enableChangeMap}
          showChangeMap={showChangeMap}
          onShowChangeMapChange={this.props.onShowChangeMapChange}
          enableBaseMap={enableBaseMap}
          showBaseMap = {showBaseMap}
          onShowBaseMapChange = {this.props.onShowBaseMapChange}
          enableNormalizedMap={enableNormalizedMap}
          showNormalizedMap={showNormalizedMap}
          onShowNormalizedMapChange={this.props.onShowNormalizedMapChange}
          segmentWise = {this.props.segmentWise}
          mapOverlay = {mapOverlay}
        />
      }

      else {
        if (showNormalizedMap) {
          maxVizParameter = Number.NEGATIVE_INFINITY;
          minVizParameter = Number.POSITIVE_INFINITY;
          for (let index = 0; index < data.length; index++) {
            let val = data[index][vizParameter];
            if (parseFloat(val) > parseFloat(maxVizParameter)) {
              maxVizParameter = val;
            }
            if (parseFloat(val) < parseFloat(minVizParameter)) {
              minVizParameter = val;
            }
          }

          let getMapChangeNormalizedColor = curriedGetColorForNormalizedMap(minVizParameter, maxVizParameter, Constants.mapColorCodes.normalMap.minColor, Constants.mapColorCodes.normalMap.maxColor, vizParameter);

          return (
            <MapViz
              title={title}
              data={data}
              map={map}
              visualization={visualization}
              electionType={electionType}
              dataFilterOptions={dataFilterOptions}
              assemblyNo={assemblyNo}
              stateName={stateName}
              showMapYearOptions={showMapYearOptions}
              yearOptions={yearOptions}
              playChangeYears={playChangeYears}
              onMapYearChange={onMapYearChange}
              vizParameter={vizParameter}
              legendType={legendType}
              discreteLegend={discreteLegend}
              getMapColor={getMapChangeNormalizedColor}
              getLegendColor={getLegendColor}
              minVizParameter={minVizParameter}
              maxVizParameter={maxVizParameter}
              enableChangeMap={enableChangeMap}
              showChangeMap={showChangeMap}
              onShowChangeMapChange={this.props.onShowChangeMapChange}
              enableBaseMap={enableBaseMap}
              showBaseMap = {showBaseMap}
              onShowBaseMapChange = {this.props.onShowBaseMapChange}
              enableNormalizedMap={enableNormalizedMap}
              showNormalizedMap={showNormalizedMap}
              onShowNormalizedMapChange={this.props.onShowNormalizedMapChange}
              segmentWise = {this.props.segmentWise}
              mapOverlay = {mapOverlay}
            />
          )
        }
        else {
          return (
            <MapViz
              title={title}
              data={data}
              map={map}
              visualization={visualization}
              electionType={electionType}
              dataFilterOptions={dataFilterOptions}
              assemblyNo={assemblyNo}
              stateName={stateName}
              showMapYearOptions={showMapYearOptions}
              yearOptions={yearOptions}
              playChangeYears={playChangeYears}
              onMapYearChange={onMapYearChange}
              vizParameter={vizParameter}
              legendType={legendType}
              discreteLegend={discreteLegend}
              getMapColor={getMapColor}
              getLegendColor={getLegendColor}
              minVizParameter={0}
              maxVizParameter={100}
              enableChangeMap={enableChangeMap}
              showChangeMap={showChangeMap}
              onShowChangeMapChange={this.props.onShowChangeMapChange}
              enableBaseMap = {enableBaseMap}
              showBaseMap = {showBaseMap}
              onShowBaseMapChange = {this.props.onShowBaseMapChange}
              enableNormalizedMap={enableNormalizedMap}
              showNormalizedMap={showNormalizedMap}
              onShowNormalizedMapChange={this.props.onShowNormalizedMapChange}
              segmentWise = {this.props.segmentWise}
              mapOverlay = {mapOverlay}
            />
          )
        }
      }
    }
    else if (visualizationType === "Chart") {
      let chartType = "";
      let layout = {};
      let vizParameters = [];
      let vizParameter = "";
      let varName="";
      let showAdditionalText = false;
      let getAdditionalText;

      chartMapOptions.forEach(element => {
        let x = element.replace(/_/g, "")
        let found = Array.from(dataFilterOptions).find((item) => {
          return item === x;
        })

        if (found) {
          vizParameters.push({ label: element.replace(/_|pct/g, " "), value: element, dataFilterOptionName: x });
        }
      });

      switch (visualization) {
        case "voterTurnoutChart": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `Voter turnout across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Voter turnout across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Turnout in %',
              range: [0, 100],
              autorange: false
            }
          };
          break;
        }

        case "partiesPresentedChart": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `Parties Contested and Represented across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Parties Contested and Represented across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Number of Parties'
            }
          };
          break;
        }

        case "tvoteShareChart": {
          chartType = "PartyScatterChart";
          vizParameter = "Vote_Share_in_Assembly";
          layout = {
            title: stateNameDisplay !== "" ? `Party wise voteshare in all seats across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Party wise voteshare in all seats across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Vote share %',
              range: [0, 100],
              autorange: false
            }
          };
          break;
        }

        case "cvoteShareChart": {
          chartType = "PartyScatterChart";
          vizParameter = "Vote_Share_in_Contested_Seats";
          layout = {
            title: stateNameDisplay !== "" ? `Party wise voteshare in seats contested across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Party wise voteshare in seats contested across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Vote share %',
              range: [0, 100],
              autorange: false
            }
          };
          break;
        }

        case "seatShareChart": {
          chartType = "PartyScatterChart";
          vizParameter = "Seat_Share";
          layout = {
            title: stateNameDisplay !== "" ? `Party wise seatshare across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Party wise seatshare across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Seat share %',
              range: [0, 100],
              autorange: false
            }
          };

          showAdditionalText = true;
          getAdditionalText = (party, idx) => {
            var y_seats = data.filter(x => x.Party === party).map(x => x.Winners);
            var total_seats = data.filter(x => x.Party === party).map(x => x.Total_Seats_in_Assembly);
            return y_seats[idx] + "/" + total_seats[idx] + " Seats";
          }
          break;
        }

        case "strikeRateChart": {
          chartType = "PartyScatterChart";
          vizParameter = "Strike_Rate";
          layout = {
            title: stateNameDisplay !== "" ? `Party wise Strike Rate across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Party wise Strike Rate across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Strike Rate %',
              range: [0, 100],
              autorange: false
            }
          };
          break;
        }

        case "contestedDepositSavedChart": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `Contested and deposit lost across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Contested and deposit lost across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Number of Candidates'
            }
          };
          break;
        }

        case "rerunningCandidates": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `Rerunning candidates across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Rerunning candidates across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Percentage of Candidates',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (i, val) => {
            var new_val=val.replace("_pct","")
            var y_in = data.map(x => x[[new_val]]);
            var total_inc =data.map(x => x.Total_Candidates);
            return y_in[i]+"/" + total_inc[i]+" Candidates";
          }
          break;
        }

        case "timesContested": {
          chartType = "BarChart";
          layout = {
            barmode:'stack',
            title: stateNameDisplay !== "" ? `Candidates by times contested across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Candidates by times contested across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Percentage of Candidates',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (i, val) => {
            var new_val=val.replace("_pct","")
            var y_in = data.map(x => x[[new_val]]);
            var total_inc =data.map(x => x.Total_Candidates);
            return y_in[i]+"/" + total_inc[i]+" Candidates";
          }
          break;
        }

        case "incumbentsChart": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `Rerunning Incumbents across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Rerunning Incumbents across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Percentage (out of total seats)',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (i, val) => {
            var new_val=val.replace("_pct","")
            var y_in = data.map(x => x[[new_val]]);
            var total_inc =data.map(x => x.Total_Seats);
            return y_in[i]+"/" + total_inc[i]+" Seats";
          }
          break;
        }

        case "incumbentsParty": {
          chartType = "PartyBarChart";
          vizParameter = "pty_incm_recontests_pct";
          layout = {
            barmode: 'stack',
            title: stateNameDisplay !== "" ? `Rerunning Incumbents by party across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Rerunning Incumbents by party across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Percentage of total incumbents',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (party, idx) => {
            var y_in = data.filter(x => x.Party === party).map(x => x.pty_Incumbents);
            var total_inc = data.filter(x => x.Party === party).map(x => x.No_Incumbents);
            return y_in[idx]+"/" + total_inc[idx]+" Incumbents";
          }
          break;
        }

        case "incumbentsStrike": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `Strike rate of incumbents across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Strike rate of incumbents across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Strike Rate',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (i, val) => {
            var new_val=val.replace("_pct","")
            var y_in = data.map(x => x.Successful_Incumbents);
            var total_inc =data.map(x => x.Contesting_Incumbents);
            return y_in[i]+"/" + total_inc[i]+" Incumbents";
          }
          break;
        }

        case "incumbentsStrikeParty": {
          chartType = "PartyScatterChart";
          vizParameter = "pty_incm_Strike_Rate";
          layout = {
            title: stateNameDisplay !== "" ? `Party wise strike rate of incumbents across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Party wise strike rate of incumbents across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Strike Rate',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (party, idx) => {
            var y_win = data.filter(x => x.Party === party).map(x => x.pty_Successful_Incumbents);
            var total_inc = data.filter(x => x.Party === party).map(x => x.pty_Incumbents);
            return y_win[idx]+"/" + total_inc[idx]+" Incumbents";
          }
          break;
          //additional text=hover_pty_incm_Strike_Rate
        }

        case "turncoatsStrike": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `Strike rate of turncoats across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Strike rate of turncoats across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Strike Rate',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (i, val) => {
            var y_in = data.map(x => x.Successful_Turncoats);
            var total_inc =data.map(x => x.Turncoats);
            return y_in[i]+"/" + total_inc[i]+" Turncoats";
          }
          break;
        }

        case "turncoatsStrikeParty": {
          chartType = "PartyScatterChart";
          vizParameter = "pty_turn_Strike_Rate";
          layout = {
            title: stateNameDisplay !== "" ? `Party wise strike rate of turncoats across years in ${stateNameDisplay} ${electionTypeDisplay}` : `Party wise strike rate of turncoats across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Strike Rate',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (party, idx) => {
            var y_win = data.filter(x => x.Party === party).map(x => x.pty_Successful_Turncoats);
            var total_inc = data.filter(x => x.Party === party).map(x => x.pty_Turncoats);
            return y_win[idx]+"/" + total_inc[idx]+" Turncoats";
          }
          break;
          //additionaltext=hover_pty_turn_Strike_Rate
        }

        case "firstTimeWinners": {
          chartType = "BarChart";
          layout = {
            title: stateNameDisplay !== "" ? `First-time winners across years in ${stateNameDisplay} ${electionTypeDisplay}` : `First-time winners across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Percentage (out of total seats)',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (i, val) => {
            var new_val=val.replace("_pct","");
            var y_in = data.map(x => x[[new_val]]);
            var total_inc =data.map(x => x.Total_Seats);
            return y_in[i]+"/" + total_inc[i]+" Seats";
          }
          break;
        }

        case "firstTimeParty": {
          chartType = "PartyBarChart";
          vizParameter = "pty_fist_time_winners_pct";
          layout = {
            barmode: 'stack',
            title: stateNameDisplay !== "" ? `First-time winners by party across years in ${stateNameDisplay} ${electionTypeDisplay}` : `First-time winners by party across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Year (Assembly Number)'
            },
            yaxis: {
              title: 'Percentage of total first-time winners',
              range: [0, 100],
              autorange: false
            }
          };
          showAdditionalText = true;
          getAdditionalText = (party, idx) => {
            var y_in = data.filter(x => x.Party === party).map(x => x.pty_first_time_winners);
            var total_inc = data.filter(x => x.Party === party).map(x => x.No_first_time_winners);
            return y_in[idx]+"/" + total_inc[idx]+" First-time winners";
          }
          break;
        }
        case "occupationMLA": {
          chartType = "PieChart";
          vizParameter = "MLAs_var";
          varName ="TCPD_Prof_Main";
          layout = {
            title: stateNameDisplay !== "" ? `Profession of winners in the ${electionYearDisplay} ${stateNameDisplay} ${electionTypeDisplay} ` : `Professions of winners in ${electionYearDisplay} ${electionTypeDisplay} `,
            xaxis: {
              showgrid: false, zeroline:false, showticklabels:false
            },
            legend: {
              "orientation": "h",align:'centre',xanchor : "center",x:0.5},
            yaxis: {
              showgrid: false, zeroline:false, showticklabels:false
            }
          };
          break;
        }

        case "educationMLA": {
          chartType = "PieChart";
          vizParameter = "MLAs_var";
          varName ="MyNeta_education";
          layout = {
            title: stateNameDisplay !== "" ? `Education of winners in the ${electionYearDisplay} ${stateNameDisplay} ${electionTypeDisplay} ` : `Education of winners in ${electionYearDisplay} ${electionTypeDisplay} `,
            xaxis: {
              showgrid: false, zeroline:false, showticklabels:false
            },
            legend: {"orientation": "h",xanchor : "center",x:0.5},
            yaxis: {
              showgrid: false, zeroline:false, showticklabels:false
            }
          };
          break;
        }


        case "ptyOccupationMLA": {
          chartType = "PartyStepBarChart";
          vizParameter = "MLAs_var_Party";
          varName = "TCPD_Prof_Main";
          layout = {
            barmode: 'stack',
            title: stateNameDisplay !== "" ? `Party wise profession of winners in the ${electionYearDisplay} ${stateNameDisplay} ${electionTypeDisplay} ` : `Party wise distribution of winner's Profession in ${electionYearDisplay} ${electionTypeDisplay}`,
            xaxis: {
              title: ''
            },
            legend: {"orientation": "h",xanchor : "center",x:0.5},
            yaxis: {
              title: 'Number of winners',
              autorange: true
            },
            hovermode: 'closest'
          };
          showAdditionalText = true;
          getAdditionalText = (category, idx) => {
            var y_in = data.filter(x => x.TCPD_Prof_Main === category && x.Assembly_No === parseInt(assemblyNo)).map(x => x.pty_mla_var_perc);
            var total_inc = data.filter(x => x.TCPD_Prof_Main === category && x.Assembly_No === parseInt(assemblyNo)).map(x => x.Party_MLAs);
            return y_in[idx]+"% of " + total_inc[idx]+" Winners";
          }
          break;
        }

        case "ptyEducationMLA": {
          chartType = "PartyStepBarChart";
          vizParameter = "MLAs_var_Party";
          varName = "MyNeta_education";
          layout = {
            barmode: 'stack',
            title: stateNameDisplay !== "" ? `Party wise professions of elected members in ${stateName} ${electionTypeDisplay}` : `Party wise strike rate of turncoats across years in ${electionTypeDisplay}`,
            xaxis: {
              title: 'Party'
            },
            legend: {"orientation": "h",xanchor : "center",x:0.5},
            yaxis: {
              title: 'Number of winners',
              autorange: true
            },
            hovermode: 'closest'
          };
          showAdditionalText = true;
          getAdditionalText = (category, idx) => {
            var y_in = data.filter(x => x.MyNeta_education === category && x.Assembly_No === parseInt(assemblyNo)).map(x => x.pty_mla_var_perc);
            var total_inc = data.filter(x => x.MyNeta_education === category && x.Assembly_No === parseInt(assemblyNo)).map(x => x.Party_MLAs);
            return y_in[idx]+"% of " + total_inc[idx]+" Winners";
          }
          break;
        }

        default:
          break;
      }
      if (chartType === "BarChart") {
        return (
          <BarChart
            layout={layout}
            vizParameters={vizParameters}
            data={data}
            dataFilterOptions={dataFilterOptions}
            showAdditionalText={showAdditionalText}
            getAdditionalText={getAdditionalText}
          />
        )
      }
      else if (chartType === "PartyBarChart") {
        return (
          <PartyBarChart
            layout={layout}
            vizParameter={vizParameter}
            data={data}
            dataFilterOptions={dataFilterOptions}
            showAdditionalText={showAdditionalText}
            getAdditionalText={getAdditionalText}
          />
        )
      }
      else if (chartType === "PartyStepBarChart") {
        let vizParameter_sec = "pty_mla_var_perc";
        let varName_sec = visualization === "ptyOccupationMLA"?"TCPD_Prof_Main":"MyNeta_education";
        let name = visualization === "ptyOccupationMLA"?"Profession":"Education"
        let layout_sec = {
          barmode: 'stack',
          title: stateNameDisplay !== "" ? `Party Wise ${name} percentages of winners in the ${electionYearDisplay} ${stateNameDisplay} ${electionTypeDisplay} ` : `Party wise percentages of winner's ${name} in ${electionYearDisplay} ${electionTypeDisplay}`,
          xaxis: {
            title: ''
          },
          legend: {"orientation": "h",xanchor : "center",x:0.5},
          yaxis: {
            title: '% winners',
            range: [0,100],
            autorange: false
          },
          hovermode: 'closest'
        };
        let showAdditionalText_sec = true;
        let getAdditionalText_sec = (category, idx) => {
          var y_in = data.filter(x => x[varName_sec] === category && x.Assembly_No === parseInt(assemblyNo)).map(x => x.MLAs_var_Party);
          var total_inc = data.filter(x => x[varName_sec] === category && x.Assembly_No === parseInt(assemblyNo)).map(x => x.Party_MLAs);
          return y_in[idx]+"/" + total_inc[idx]+" Winners";
        }
        return (
          <div><PartyStepBarChart
            layout={layout}
            vizParameter={vizParameter}
            data={data.filter(function (item) { return item.Assembly_No === parseInt(assemblyNo) })}
            varName={varName}
            dataFilterOptions={dataFilterOptions}
            showAdditionalText={showAdditionalText}
            getAdditionalText={getAdditionalText}
          />
          <PartyStepBarChart
            layout={layout_sec}
            vizParameter={vizParameter_sec}
            data={data.filter(function (item) { return item.Assembly_No === parseInt(assemblyNo) })}
            varName={varName_sec}
            dataFilterOptions={dataFilterOptions}
            showAdditionalText={showAdditionalText_sec}
            getAdditionalText={getAdditionalText_sec}
          />
          <p align="center"><small>Note: We have used the data made publicly available by ADR and applied TCPD categories for the purpose of analyses.</small></p></div>
        )
      }
      else if (chartType === "PartyScatterChart") {
        return (
          <PartyScatterChart
            layout={layout}
            data={data}
            vizParameter={vizParameter}
            showAdditionalText={showAdditionalText}
            getAdditionalText={getAdditionalText}
          />
        )
      }
      else if (chartType === "PieChart") {
        return (
          <div><PieChart
            layout={layout}
            data={data.filter(function (item) { return item.Assembly_No === parseInt(assemblyNo) })}
            vizParameter={vizParameter}
            varName = {varName}
          />
          <p align="center"><small>Note: We have used the data made publicly available by ADR and applied TCPD categories for the purpose of analyses.</small></p></div>
        )
      }
    }
    // else if (visualizationType === "IP"){
    //   const { data, electionType, assemblyNo, stateName } = this.props;
    //   return (
    //     <IncumbencyProfile
    //       electionType={electionType}
    //       assemblyNumber={assemblyNo}
    //       stateName={stateName}
    //       data = {data}
    //     />
    //   )
    // }
  }
}
