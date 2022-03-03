import React from "react";
import { Route, Switch } from "react-router-dom";
import DataVisualization from "./Components/DataVisualization";
import HomePage from "./Components/HomePage";
import DashPage from "./Components/DashPage";
import BrowseData from "./Components/BrowseData";
import Documentation from "./Components/Documentation";
import About from "./Components/About";
import SearchResults from "./Components/SearchResults";
import NotFound from "./Components/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/dash" exact component={DashPage} />
      <Route path="/data-vis" exact component={DataVisualization} />
      <Route path="/browse-data" exact component={BrowseData} />
      <Route path="/docs" exact component={Documentation} />
      <Route path="/about" exact component={About} />
      <Route path="/search-results" exact component={SearchResults} />
      <Route component={NotFound} />
    </Switch>
  );
}
