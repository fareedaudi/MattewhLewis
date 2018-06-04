import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    Form,
    FormGroup,
    Input,
    FormFeedback,
    ListGroup,
    ModalFooter,
    FormText,
    ListGroupItem,
    Button
} from 'reactstrap';
import {Typeahead} from 'react-bootstrap-typeahead';

export default class CreateMapModal extends React.Component{

    constructor(props){
        super(props);
        this.defaultState = {
            selectedProgramId:-1,
            selectedUniversityId:this.props.university.university_id,
            newMapName:'',
            newMapCollaborators:[],
            selected:[]
        }
        this.state = this.defaultState;
    }
    
    openClose = (ev) => {
        this.setState(this.defaultState);
        this.props.toggle(ev);
    }
    
    handleProgramSelection = (ev) => {
        let selectedProgramId = Number(ev.target.value);
        this.setState({
            selectedProgramId
        });
    }
    
    handleNameChange = (ev) => {
        let newMapName = ev.target.value;
        this.setState({
            newMapName
        });
    }
    
    handleCollaboratorAdd = ([selectedCollaborator]) => {
        let currentCollaborators = this.state.newMapCollaborators;
        let isNewCollaborator = currentCollaborators.indexOf(selectedCollaborator) < 0;
        if(selectedCollaborator &&  isNewCollaborator){
            let newMapCollaborators = this.state.newMapCollaborators.concat(selectedCollaborator);
            this.setState({
                newMapCollaborators
            });
        }
        this.setState({selected:[]});
    }
    
    removeCollaborator = (ev) => {
        ev.preventDefault();
        let collaboratorToRemove = ev.target.parentElement.parentElement.getAttribute("id");
        let newMapCollaborators = this.state.newMapCollaborators.filter(
            collaborator => collaborator !== collaboratorToRemove
        );
        this.setState({newMapCollaborators});
    }
    
    createMapHandler = (mapState) => {
        if(mapState.selectedProgramId!==-1){
            this.props.handler(mapState);
            this.setState(this.defaultState);
        }
    }
    
    render(){
        let modalState = this.state;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.openClose} className={this.props.className}>
                <ModalHeader toggle={this.openClose}>Create new degree map.</ModalHeader>
                <ModalBody>
                <Label for="mapName">Transfer Institution</Label>
                <h6>{this.props.university.university_name}</h6>
                <Form>
                    <FormGroup>
                        <Label for="program">Program</Label>
                        <Input 
                            type="select" 
                            name="program" 
                            id="program" 
                            placeholder="Please select a program." 
                            value={this.state.selectedProgramId}
                            onChange={this.handleProgramSelection}
                        >
                            <option value="-1">Please select a program.</option>
                            {this.props.programs.map(
                                program => <option key={program.program_id} value={program.program_id}>{program.program_name}</option>
                                )
                            }
                        </Input>
                        <FormText>To what program are you aligning this map?</FormText>
                        <FormFeedback>You did good!</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="mapName">Name</Label>
                        <Input 
                            type="text" 
                            name="name" 
                            id="mapName" 
                            placeholder="E.g., German Basket Weaving Specialization"
                            value={this.state.newMapName}
                            onChange={this.handleNameChange}
                        />
                        <FormText>Pick something specific.</FormText>
                    </FormGroup>
                    <FormGroup>
                        <Label for="collaborators">Collaborators</Label>
                        <Typeahead 
                            type="text"
                            name="collaborators"
                            id="collaborators"
                            placeholder="E.g., matthew.lewis@sjcd.edu"
                            options={this.props.collaborators.filter(
                                collaborator => collaborator !== this.props.login.state.userEmail
                                )}
                            onChange={this.handleCollaboratorAdd}
                            selectHintOnEnter={true}
                            selected={this.state.selected}
                        />
                        <FormText>Add some co-conspirators!</FormText>
                        <ListGroup>
                            {this.state.newMapCollaborators.map(
                                (collaborator)=><ListGroupItem 
                                                    key={collaborator} 
                                                    id={collaborator}
                                                    color="success"
                                                    style={{padding: "3px 10px"}}
                                                >
                                                    {collaborator}
                                                    <button type="button" className="close" aria-label="Close" onClick={this.removeCollaborator}>
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </FormGroup>
                </Form>
    
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.openClose}>Close</Button>
                    <Button color="danger" onClick={()=>this.createMapHandler(modalState)}>Submit</Button>
                </ModalFooter>
            </Modal>
            );
        }
    }