import React from "react";
import { Row } from "reactstrap";
import Layout from "./components/Layout";
import MapList from "./components/MapList";
import MapsProvider from "./components/MapsProvider";

const App = () => (
  <div className="App">
    <Layout>
      <Row>
        <MapsProvider render={data => <MapList mapsData={data} />} />
      </Row>
    </Layout>
  </div>
);

export default App;
