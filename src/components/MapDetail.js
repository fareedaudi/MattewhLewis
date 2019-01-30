import React from "react";
import axios from "axios";
import { Col, Card, CardBody } from "reactstrap";
import MapTable from "./MapTable";

const mapURL = id => `http://localhost:5000/api/map/${id}`;

class MapDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMap: {},
      loaded: false
    };
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    this.getMap(id).then(response =>
      this.setState({ selectedMap: response.data.map }, _ =>
        this.setState({ loaded: true })
      )
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;
    return false;
  }

  getMap = id => {
    return axios.get(mapURL(id));
  };

  render() {
    console.log(this.state.selectedMap);
    let loaded = this.state.loaded;
    return (
      <Col>
        <Card>
          <CardBody>
            <MapTable map={this.state.selectedMap} loaded={this.state.loaded} />
          </CardBody>
        </Card>
      </Col>
    );
  }
}
export default MapDetail;
