import React from "react";
import { Tooltip } from "reactstrap";
import PropTypes from "prop-types";

export default class MapActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false
    };
    this.FAClassMap = {
      approve: {
        faClass: "fa fa-paper-plane",
        tooltipText: "Submit for approval."
      },
      share: {
        faClass: "fa fa-share-alt",
        tooltipText: "Share with collaborators."
      },
      delete: {
        faClass: "fa fa-trash",
        tooltipText: "Delete map."
      },
      print: {
        faClass: "fa fa-file-pdf",
        tooltipText: "Download as PDF file."
      },
      note: {
        faClass: "fa fa-sticky-note",
        tooltipText: "View/edit notes."
      },
      makeApplicable: {
        faClass: "fa fa-check-circle",
        tooltipText: "Mark course as applicable."
      },
      exchangeCourse: {
        faClass: "fa fa-exchange-alt",
        tooltipText: "Select a different course."
      }
    };
    this.myRef = React.createRef();
    this.toggle = () => {
      this.setState({ tooltipOpen: !this.state.tooltipOpen });
    };
  }

  render() {
    let buttonId = this.props.type + this.props.map_id;
    let color;
    if (this.props.disabled) {
      color = "gray";
    } else if (this.props.activated) {
      color = "green";
    } else {
      color = "black";
    }
    var style = {
      cursor: "pointer",
      color: color,
      fontSize: "20px"
    };
    return (
      <span>
        <i
          className={this.FAClassMap[this.props.type].faClass}
          style={style}
          id={buttonId}
          onClick={() => {
            if (this.props.disabled) {
              return;
            }
            this.props.handler();
          }}
        />
        <Tooltip
          placement="top"
          isOpen={this.state.tooltipOpen}
          target={buttonId}
          toggle={this.toggle}
        >
          {" "}
          {this.FAClassMap[this.props.type].tooltipText}
        </Tooltip>
      </span>
    );
  }
}

MapActionButton.propTypes = {
  type: PropTypes.string.isRequired,
  map_id: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired
};
