import React from "react";
import { Container } from "reactstrap";

const Layout = ({ children }) => (
  <Container fluid>
    <h3>
      Pathways Mapping Toolkit - <i>Reports</i>
    </h3>
    {children}
    <p style={{ textAlign: "center", padding: "20px" }}>
      (c) 2019 San Jacinto College. All rights reserved.
    </p>
  </Container>
);

export default Layout;
