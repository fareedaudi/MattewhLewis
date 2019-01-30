import React from "react";
import { Row } from "reactstrap";
import Layout from "./components/Layout";
import MapList from "./components/MapList";
import MapsProvider from "./components/MapsProvider";
import MapDetail from "./components/MapDetail";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router>
    <div className="App">
      <Layout>
        <Route
          path="/"
          exact
          render={props => (
            <MapsProvider
              render={data => <MapList {...props} mapsData={data} />}
            />
          )}
        />
        <Route
          path="/map/:id"
          render={props => (
            <MapsProvider
              render={data => <MapDetail {...props} mapsData={data} />}
            />
          )}
        />
      </Layout>
    </div>
  </Router>
);

export default App;
