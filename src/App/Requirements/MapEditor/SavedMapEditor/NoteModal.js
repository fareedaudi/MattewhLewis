import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
    Button
} from 'reactstrap';

export default class NoteModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            applicable:false,
            text:''
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            applicable:(nextProps.noteModalNote.applicable),
            text:(nextProps.noteModalNote.text || '')
        });
    }

    openClose = () => {
        this.props.toggle();
        this.resetModalState();
    }

    onSelectChange = ({target:{name,value}}) => {
        if(name !== "applicable"){
            this.setState({[name]:value});
        } else {
            this.setState({[name]:Boolean(value)})
        }        
    }

    onCheckboxChange = ({target:{name,checked}}) => {
        this.setState({
            [name]:checked
        });
    }


    resetModalState = () => {
        this.setState({
            applicable:false,
            text:''
        })
    }

    handleSubmission = () => {
        if(this.state.applicable || this.state.text){
            let slot = this.props.slot;
            slot.note.applicable = this.state.applicable;
            slot.note.text = this.state.text;
            this.props.editNote(slot);
        }
        this.openClose();
    }

    render(){
        let {name,rubric,number} = this.props.noteModalCourse;
        let {applicable,text} = this.props.noteModalNote;
        return (
        
            <Modal isOpen={this.props.isOpen} toggle={this.openClose}>
                <ModalHeader toggle={this.openClose}>
                    Selection Notes
                </ModalHeader>
                <ModalBody>
                    <Label for="mapName">Notes for Course Selection</Label>
                    <h6>{rubric} {number} - {name}</h6>
                    <Form>
                        <FormGroup check>
                            <Label check>
                            <Input 
                                type="checkbox"
                                name="applicable"
                                id="apply"
                                checked={this.state.applicable}
                                onChange={this.onCheckboxChange}
                            />{' '}
                            Check if this course is known to apply to this degree.
                            </Label>
                        </FormGroup>
                        <hr/>
                        <FormGroup>
                            <Label for="justification">What is your rationale for selecting this course?</Label>
                            <Input 
                                type="textarea"
                                name="text"
                                id="text"
                                value={this.state.text}
                                onChange={this.onSelectChange}
                            />
                        </FormGroup>
                    </Form>       
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-sm" color="secondary" onClick={this.openClose}>Close</Button>
                    <Button className="btn-sm" color="primary" onClick={this.handleSubmission}>Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }
}