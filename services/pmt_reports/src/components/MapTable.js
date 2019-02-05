import "./Table.css";
import React from "react";
import { Table } from "reactstrap";
import MapsProvider from "./MapsProvider";
import MapActionButton from "./MapActionButton";
import NoteModal from "./NoteModal";

const isObjectEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const MapForm = props => {
  let { map, loaded, updateMap } = props;
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
              <th style={style.headerRow}>
                Transfer Program:{" "}
                <a href={map.prog_link} target="_blank">
                  {map.prog_name}
                </a>
              </th>
              <th style={style.headerRow}>Applicable</th>
              <th style={style.headerRow}>Applicability Across Inst.</th>
              <th style={style.headerRow}>Actions</th>
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
                          <span className="pull-right">
                            <MapActionButton
                              type="note"
                              map_id={course.id}
                              handler={() => props.launchNoteModal(slot)}
                            />
                            &nbsp;&nbsp;
                            <MapActionButton
                              type="exchangeCourse"
                              map_id={course.id}
                              handler={_ => {
                                return;
                              }}
                            />
                            &nbsp;&nbsp;
                            <MapActionButton
                              type="makeApplicable"
                              map_id={course.id}
                              handler={_ => {
                                return;
                              }}
                            />
                          </span>
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
      map: {},
      noteModalOpen: false,
      noteModalNote: {},
      noteModalCourse: {},
      noteModalSlot: {},
      savedMapToEdit: props.map,
      savingMap: false,
      saveError: false,
      saved: false
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

  toggleNoteModal = () => {
    this.setState({
      noteModalOpen: !this.state.noteModalOpen
    });
  };

  launchNoteModal = slot => {
    let { note, course } = slot;
    this.setState({
      noteModalNote: note,
      noteModalCourse: course,
      noteModalOpen: true,
      noteModalSlot: slot
    });
  };

  editNote = ({ id, req_id, note }) => {
    let requirement = this.state.savedMapToEdit.requirements.filter(
      req => req.id == req_id
    )[0];
    let slot = requirement.course_slots.filter(slot => slot.id === id)[0];
    slot.note = note;
    this.forceUpdate();
  };

  saveMapHandler = savedMapToEdit => {
    this.setState({
      savingMap: true,
      saveError: false,
      saved: false
    });

    this.handleSave(savedMapToEdit)
      .then(() => {
        this.timer = setTimeout(_ => {
          this.setState({ savingMap: false, saved: true }, _ => {
            this.timer = setTimeout(_ => {
              this.setState({ saved: false }, 1500);
            });
          });
        });
      })
      .catch(e => {
        this.setState({ savingMap: false, saveError: true });
      });
  };

  handleSave(mapToEdit) {
    console.log("Saving that mutha!");
  }

  render() {
    return (
      <div>
        <MapForm
          map={this.state.map}
          loaded={this.props.loaded}
          updateMap={this.updateMap}
          launchNoteModal={this.launchNoteModal}
        />
        <NoteModal
          isOpen={this.state.noteModalOpen}
          toggle={this.toggleNoteModal}
          noteModalNote={this.state.noteModalNote}
          noteModalCourse={this.state.noteModalCourse}
          editNote={this.editNote}
          slot={this.state.noteModalSlot}
        />
      </div>
    );
  }
}

export default MapTable;
