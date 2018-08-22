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
import PropTypes from 'prop-types';

export default class CreateMapModal extends React.Component{

    constructor(props){
        super(props);
        this.defaultState = {
            selectedAssociateDegree:-1,
            selectedProgramId:-1,
            selectedUniversityId:this.props.university.university_id,
            newMapName:'',
            newMapCollaborators:[],
            selected:[]
        }
        this.state = this.defaultState;
        this.associateDegrees = [];
        for(let id in this.props.associateDegrees){
            let newAssociateDegree = this.props.associateDegrees[id];
            newAssociateDegree.id = id;
            this.associateDegrees.push(newAssociateDegree);
        }
    }
    
    componentDidMount(){
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

    handleAssociateDegreeSelection = ({target:{value}}) => {
        let selectedAssociateDegree = value;
        this.setState({selectedAssociateDegree});
    }
    
    render(){
        let modalState = this.state;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.openClose} className={this.props.className}>
                <ModalHeader toggle={this.openClose}>Create new degree map.</ModalHeader>
                <ModalBody>
                <Label for="mapName">Transfer Institution</Label>
                <h6>{this.props.university.university_name}</h6>
                <hr/>
                <Form>
                    <FormGroup>
                            <Label for="assocDegree">SJC Associate Degree</Label>
                            <Input 
                                type="select" 
                                name="assocDegree" 
                                id="assocDegree" 
                                value={this.state.selectedAssociateDegree}
                                onChange={this.handleAssociateDegreeSelection}
                            >
                                <option value="-1">Please select an Associate's Degree.</option>
                                {this.associateDegrees.map(
                                    associateDegree => <option key={associateDegree.id} value={associateDegree.id}>{associateDegree.name}</option>
                                    )
                                }
                            </Input>
                            <FormText>To what Associate's Degree are you aligning this map?</FormText>
                            <FormFeedback>You did good!</FormFeedback>
                        </FormGroup>
                    <FormGroup>
                        <Label for="program">Transfer Program</Label>
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
                            options={this.props.collaborators.map(collaborator=>collaborator.email).filter(
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
                    <Button 
                        color="primary" 
                        onClick={()=>this.createMapHandler(modalState)} 
                        disabled={(this.state.selectedProgramId === -1) || !this.state.newMapName}
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </Modal>
            );
        }
    }

    CreateMapModal.propTypes = {
        isOpen:PropTypes.bool.isRequired,
        toggle:PropTypes.func.isRequired,
        handler:PropTypes.func.isRequired,
        university:PropTypes.object.isRequired,
        programs:PropTypes.array.isRequired,
        collaborators:PropTypes.array.isRequired,
        login:PropTypes.object.isRequired
    }