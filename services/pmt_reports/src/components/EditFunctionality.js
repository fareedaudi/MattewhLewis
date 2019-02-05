import React from "react";
import NoteModal from "./NoteModal";

export default class EditFunctionality extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteModalOpen: false,
      noteModalNote: {},
      noteModalCourse: {},
      noteModalSlot: {},
      savedMapToEdit: props.savedMapToEdit,
      savingMap: false,
      saveError: false,
      saved: false
    };
  }

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
      <NoteModal
        isOpen={this.state.noteModalOpen}
        toggle={this.toggleNoteModal}
        noteModalNote={this.state.noteModalNote}
        noteModalCourse={this.state.noteModalCourse}
        editNote={this.editNote}
        slot={this.state.noteModalSlot}
      />
    );
  }
}
