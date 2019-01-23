import "./Table.css";
import React from "react";
import { Card, CardBody, Col, Table } from "reactstrap";
import MapTableHeader from "./MapTableHeader";

const MapList = ({ mapsData }) => {
  let h =
    (Math.max(document.documentElement.clientHeight, window.innerHeight) || 0) -
    250;
  let style = {
    tbody: {
      tableLayout: "fixed",
      overflowY: "auto",
      height: h
    }
  };
  let { maps, uiMapping, loaded, handlers, sortKey, filters } = mapsData;

  let tableHeaders = uiMapping.map(header => {
    let filterValues = filters[header.key];
    return (
      <MapTableHeader
        key={header.key}
        {...{ header, sortKey, filterValues, handlers }}
      />
    );
  });

  let tableRows = maps.map(map => (
    <tr key={map.id}>
      {uiMapping.map((header, i) => {
        let value = map[header.key];
        if (header.formatFunc) {
          value = header.formatFunc(value);
        }
        return <td key={i}>{value}</td>;
      })}
    </tr>
  ));
  return (
    <Col>
      <Card>
        {!loaded ? (
          <div>Loading maps...</div>
        ) : (
          <CardBody>
            <Table hover>
              <thead>
                <tr>{tableHeaders}</tr>
              </thead>
              <tbody style={style.tbody}>{tableRows}</tbody>
            </Table>
          </CardBody>
        )}
      </Card>
    </Col>
  );
};

export default MapList;
