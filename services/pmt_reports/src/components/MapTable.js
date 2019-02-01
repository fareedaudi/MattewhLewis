import "./Table.css";
import React from "react";
import { Table } from "reactstrap";
import MapsProvider from "./MapsProvider";

const isObjectEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const MapForm = ({ map, loaded, updateMap }) => {
  let h =
    (Math.max(document.documentElement.clientHeight, window.innerHeight) || 0) -
    250;
  let style = {
    tbody: {
      tableLayout: "fixed",
      overflowY: "auto",
      height: h
    },
    headerRow: {
      paddingTop: "3px",
      paddingBottom: "3px"
    }
  };
  let requirements = map.requirements || [];
  let applicableCourses = map.applicable_courses || [];
  let applicableIds = new Set(
    applicableCourses.map(course => String(course.id))
  );
  const isApplicable = course => applicableIds.has(String(course.id));
  return (
    <Table>
      <thead>
        <tr
          style={{
            left: 0,
            top: 0,
            padding: ".25em",
            color: "gray",
            fontSize: "20px",
            fontWeight: "500"
          }}
        >
          <th style={{ fontSize: "25px" }}>
            {loaded ? map.name : "Loading map statistics..."}
          </th>
          <th>Total Credits: {map.total_credits}</th>
          <th>Applicable Credits: {map.applicable_credits}</th>
          <th>Applicability Rating: {loaded ? map.applicability + "%" : ""}</th>
        </tr>
      </thead>
      {loaded ? (
        <React.Fragment>
          <thead>
            <tr>
              <th style={style.headerRow}>&nbsp;</th>
              <th style={style.headerRow}>Applicable</th>
              <th style={style.headerRow}>Applicability Across Inst.</th>
              <th style={style.headerRow}>Alternative</th>
            </tr>
          </thead>

          <tbody style={style.tbody}>
            {requirements.map(req => (
              <React.Fragment key={req.id}>
                <tr>
                  <td>
                    <strong>{req.name}</strong>
                  </td>
                  {[1, 2, 3].map(i => (
                    <td key={i}>&nbsp;</td>
                  ))}
                </tr>
                {req.course_slots.map(slot => {
                  let course = !isObjectEmpty(slot.course)
                    ? slot.course
                    : {
                        name: "No Course Selected",
                        applicable: "N/A",
                        inst_appl: "N/A",
                        id: 0
                      };
                  return (
                    <tr
                      key={course.id}
                      style={{ color: isApplicable(course) ? "black" : "red" }}
                    >
                      <td>
                        {course.rubric} {course.number} - {course.name}
                      </td>
                      <td>{isApplicable(course) ? "YES" : "NO"}</td>
                      <td>
                        {isApplicable(course)
                          ? "-"
                          : course.applicable_count !== undefined
                          ? `${course.applicable_count}/${map.program_count}`
                          : "N/A"}
                      </td>
                      <td>
                        {isApplicable(course) ? (
                          "-"
                        ) : (
                          <select style={{ width: "250px" }}>
                            <option value="-1">
                              Please select an alternative.
                            </option>
                            {req.default_courses.map(course => (
                              <option value={course.id} key={course.id}>
                                {course.rubric} {course.number} - {course.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </React.Fragment>
      ) : (
        ""
      )}
    </Table>
  );
};

class MapTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loaded) {
      this.setState({ map: this.props.map });
    }
  }

  updateMap = msg => {
    switch (msg) {
      case msg:
        // code
        break;
      default:
        //
        break;
    }
  };

  render() {
    return (
      <MapForm
        map={this.state.map}
        loaded={this.props.loaded}
        updateMap={this.updateMap}
      />
    );
  }
}

export default MapTable;
